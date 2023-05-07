<script setup lang="ts">
import { ref } from 'vue'
import {
  arrayUnion,
  updateDoc,
  doc
} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes,  getDownloadURL } from "firebase/storage";
import { db,  } from '@/firebase'

const props = defineProps({
  url: { type: String, required: true },
})
const emit = defineEmits(["videoUpdated"]);
const blogVideo = ref({} as File)
const loading = ref(false)
const videoUrl = ref('')

const handleChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    blogVideo.value = file
    videoUrl.value = URL.createObjectURL(blogVideo.value)
  }
  }

const updateBlog = async () => {
  loading.value = true
  const storage = getStorage()
    const videoRef = storageRef(storage, 'videos/' +props.url)
    await uploadBytes(videoRef, blogVideo.value)
    .then(async()=>{
      const blogVideoUrl = await getDownloadURL(videoRef);
      const blogRef = doc(db, "blogs", props.url);
        const updatedBlogData = {
          videoUrl: arrayUnion(blogVideoUrl),
        };
      await updateDoc(blogRef, updatedBlogData)
      .then(()=>{
        emit("videoUpdated", blogVideoUrl)
        loading.value = false
    })
})
}
</script>

<template>
  <div>
    <form @submit.prevent="updateBlog">
      <div class="avatar flex justify-center " v-if="videoUrl">
        <video
          controls
          autoplay
          ref="VideoEditor"
          class="rounded-xl w-[30rem]"
        >
          <source :src="videoUrl" type="video/mp4" />
        </video>
      </div>
      <div class="form-control w-full my-3">
        <label class="label">
          <span class="label-text">Pick a file</span>
        </label>
        <input
          type="file"
          class="file-input file-input-bordered w-full"
          ref="videoFile"
          @change="handleChange"
        />
      </div>
      <div class="w-full flex justify-end">
        <button :class="['btn btn-primary', loading ? 'loading' : '' ]" type="submit">Next</button>
      </div>
    </form>
  </div>
</template>