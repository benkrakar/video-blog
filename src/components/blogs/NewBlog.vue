<script setup lang="ts">
import { ref } from 'vue'
import {
  addDoc,
  collection,
} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, updateMetadata, getDownloadURL } from "firebase/storage";
import { db, auth } from '@/firebase'
import Swal from 'sweetalert2';

const emit = defineEmits(["blogUpdated"]);

const newBlog = ref({
  title :"",
  description :"",
  videoUrl :"",
  author :"",
  created_at :new Date(),
})
const download = ref(false)

const handleChange = async (e: Event) => {
  download.value = true
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const storage = getStorage()
    const videoRef = storageRef(storage, 'videos/' + file.name)
    await uploadBytes(videoRef, file)
    .then(async()=>{
      const blogVideoUrl = await getDownloadURL(videoRef);
      newBlog.value.videoUrl = blogVideoUrl
      download.value = false
    })
    .catch((err)=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Were sorry, something went wrong. Please try again ',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
  }

const addNewBlog = async () => {
  const blogRef = collection(db, "blogs");
  newBlog.value.author= auth.currentUser?.displayName as string
  const data = await addDoc(blogRef, newBlog.value)
  emit("blogUpdated", data.id);
}
</script>

<template>
  <div>
    <form @submit.prevent="addNewBlog">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="title"
          class="input input-bordered"
          v-model="newBlog.title"
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Description</span>
        </label>
        <textarea
          placeholder="Description"
          class="textarea textarea-bordered textarea-lg w-full"
          v-model="newBlog.description"
        ></textarea>
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
        <button :class="['btn btn-primary', download ? 'loading' : '' ]" type="submit">Next</button>
      </div>
    </form>
  </div>
</template>
