<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  addDoc,
  collection,
  limit,
  orderBy,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, auth } from "@/firebase";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const emit = defineEmits(["blog-updated", "update-existing-blog"]);
const coverImage = ref({} as File);
const imgUrl = ref("");

const newBlog = ref({
  title: "",
  description: "",
  author: "",
  created_at: new Date(),
  coverImage: "",
});
const loading = ref(false);

onMounted(async () => {
  const loggedInUser = Cookies.get("loggedInUser");
  const user = JSON.parse(loggedInUser as string);
  const lastVideosQuery = query(
    collection(db, "blogs"),
    orderBy("created_at", "desc"),
    where("author", "==", user.displayName),
    limit(1)
  );
  const lastVideosSnapshot = await getDocs(lastVideosQuery);
  const lastVideo = lastVideosSnapshot.docs[0];
  if (lastVideo) {
    const lastVideoData = lastVideo.data();
    const indexOfLastVideo = lastVideoData.videos?.length - 1;
    if (
      indexOfLastVideo >= 0 &&
      (!lastVideoData.videos[indexOfLastVideo].startTime ||
        !lastVideoData.videos[indexOfLastVideo].endTime)
    ) {
      const videoUrl = lastVideoData.videos[indexOfLastVideo].url;
      Swal.fire({
        icon: "warning",
        title: "Unfinished blog",
        text: "Please finish your last blog then you create new one",
      });
      emit("update-existing-blog", lastVideo.id, videoUrl);
    }
  }
});

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    coverImage.value = file;
    imgUrl.value = URL.createObjectURL(coverImage.value);
  }
};

const addNewBlog = async () => {
  loading.value = true;
  const storage = getStorage();
  if (coverImage.value.name) {
    const imageRef = storageRef(storage, "images/" + coverImage.value.name);
    await uploadBytes(imageRef, coverImage.value);
    const blogCoverImage = await getDownloadURL(imageRef);
    newBlog.value.coverImage = blogCoverImage;
  }
  const blogRef = collection(db, "blogs");
  newBlog.value.author = auth.currentUser?.displayName as string;
  const data = await addDoc(blogRef, newBlog.value);
  emit("blog-updated", data.id);
  loading.value = false;
};
</script>

<template>
  <div>
    <form @submit.prevent="addNewBlog">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Title</span>
        </label>
        <input
          v-model="newBlog.title"
          type="text"
          placeholder="title"
          class="input input-bordered"
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Description</span>
        </label>
        <textarea
          v-model="newBlog.description"
          placeholder="Description"
          class="textarea textarea-bordered textarea-lg w-full"
        ></textarea>
      </div>
      <div class="form-control w-full my-3">
        <label class="label">
          <span class="label-text">Pick a blog cover</span>
        </label>
        <input
          type="file"
          class="file-input file-input-bordered w-full"
          accept="image/png, image/jpeg"
          @change="handleImage"
        />
      </div>
      <div class="w-full flex justify-end">
        <button
          :class="['btn btn-primary', loading ? 'loading' : '']"
          type="submit"
        >
          Next
        </button>
      </div>
    </form>
  </div>
</template>
