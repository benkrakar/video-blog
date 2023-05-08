<script setup lang="ts">
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { db, auth } from '@/firebase'

const emit = defineEmits(['blogUpdated'])
const coverImage = ref({} as File)
const imgUrl = ref('')

const newBlog = ref({
  title: '',
  description: '',
  author: '',
  created_at: new Date(),
  coverImage: '',
})
const loading = ref(false)

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    coverImage.value = file
    imgUrl.value = URL.createObjectURL(coverImage.value)
  }
}

const addNewBlog = async () => {
  loading.value = true
  const storage = getStorage()
  if ( coverImage.value.name) {
    const imageRef = storageRef(storage, 'images/' + coverImage.value.name)
    await uploadBytes(imageRef, coverImage.value)  
    const blogCoverImage = await getDownloadURL(imageRef)
    newBlog.value.coverImage = blogCoverImage
  }
  const blogRef = collection(db, "blogs");
  newBlog.value.author= auth.currentUser?.displayName as string
  const data = await addDoc(blogRef, newBlog.value)
  emit('blogUpdated', data.id)
  loading.value = false
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
          <span class="label-text">Pick a blog cover</span>
        </label>
        <input
          type="file"
          class="file-input file-input-bordered w-full"
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
