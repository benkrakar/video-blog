<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getStorage, deleteObject, ref as storageRef } from "firebase/storage";
import { db } from "@/firebase";
import { useRoute } from "vue-router";
import Playlist from "@/components/blogs/playList.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();
const blog: Ref<Blog> = ref({} as Blog);
const videoIndex = ref(0);
const route = useRoute();
const VideoPlayer: Ref<HTMLVideoElement | null> = ref(null);

const id = route.params.id as string;
const getBlogById = async () => {
  const blogDoc = doc(db, "blogs", id.toString());
  const blogSnapshot = await getDoc(blogDoc);
  const blog = { id: blogSnapshot.id, ...blogSnapshot.data() };
  return blog;
};
onMounted(async () => {
  blog.value = (await getBlogById()) as Blog;
});

const updateVideo = (item: number) => {
  if (VideoPlayer.value) {
    videoIndex.value = item;
    VideoPlayer.value.currentTime = 44;
    VideoPlayer.value.load();
  }
};

const onVideoCanPlay = () => {
  if (!VideoPlayer.value) {
    return;
  }

  const video = VideoPlayer.value;
  const currentVideo = blog.value.videos[videoIndex.value];

  if (currentVideo.startTime) {
    video.currentTime = currentVideo.startTime;
  }

  video.play();

  if (currentVideo.endTime) {
    const duration = (currentVideo.endTime - currentVideo.startTime) * 1000;
    setTimeout(() => {
      video.pause();
      video.currentTime = 0;
    }, duration);
  }
};

const deleteConfirmation = async () => {
  Swal.fire({
    title: "Do you want to delete  current blog ?",
    showCancelButton: true,
    icon: "warning",
    confirmButtonText: "Yes delete it",
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBlog();
    }
  });
};

const deleteBlog = async () => {
  try {
    // Delete videos
    const videos = blog.value.videos;
    const storage = getStorage();
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const dataRef = storageRef(storage, video.url);
      await deleteObject(dataRef);
    }

    // Delete cover image
    const coverImage = blog.value.coverImage;
    if (coverImage) {
      const dataRef = storageRef(storage, coverImage);
      await deleteObject(dataRef);
    }

    // Delete blog document from Firestore
    const docRef = doc(db, "blogs", id);
    await deleteDoc(docRef);

    // Redirect to blogs page
    Swal.fire("Saved!", "", "success");

    router.push("/");
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Something wrong please try agin later",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
</script>
<template>
  <div>
    <div class="flex justify-end items-center p-0 w-full px-6">
      <button class="btn btn-error" @click="deleteConfirmation">Delete</button>
      <router-link :to="`/blog/${id}/edit`" class="btn btn-primary my-4 mx-2">
        Edit
      </router-link>
      <router-link
        :to="`/blog/${id}/videos/new`"
        class="btn btn-success my-4 text-white"
      >
        Add New Video
      </router-link>
    </div>
    <div v-if="blog.videos">
      <h1
        v-if="blog.videos[videoIndex].title"
        class="pl-6 text-gray-800 max-w-[50%] break-words"
      >
        {{ blog.videos[videoIndex].title }}
      </h1>
      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-10 bg-white shadow-md m-6 rounded-xl"
      >
        <div class="lg:col-span-2 h-fit">
          <div
            class="flex items-center justify-center min-h-[32rem] bg-gray-200 h-full rounded-lg p-4"
          >
            <video
              v-if="blog.videos"
              ref="VideoPlayer"
              :key="blog.videos[0].url"
              controls
              autoplay
              class="rounded-xl"
              @loadedmetadata="onVideoCanPlay"
            >
              <source :src="blog.videos[videoIndex].url" type="video/mp4" />
            </video>
          </div>
          <div class="bg-gray-200 rounded-xl p-8 my-4">
            <p class="text-gray-700">description: {{ blog.description }}</p>
          </div>
        </div>
        <Playlist
          :videos="blog.videos"
          :cover="blog.coverImage"
          @update-video="updateVideo"
        />
      </div>
    </div>
  </div>
</template>
