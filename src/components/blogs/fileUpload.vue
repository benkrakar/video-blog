<script setup lang="ts">
import { ref } from 'vue'
import {
addDoc,
  collection,
} from "firebase/firestore";
import { db } from '@/firebase'

const newBlog = ref({
  title :"",
  description :"",
  image :""
})
const handleChange = async () => {
  console.log(newBlog.value);
  const blogRef = collection(db, "blogs");
  await addDoc(blogRef, newBlog.value)
}
</script>

<template>
  <div>
    <form  @submit.prevent="handleChange">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="title"
          class="input input-bordered"
          name="title"
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
            />
      </div>
      <div class="w-full flex justify-end">
          <button class="btn btn-primary " type="submit">Next</button>
        </div>
    </form>
  </div>
</template>
