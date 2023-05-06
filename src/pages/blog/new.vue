<script setup lang="ts">
import uploadBlog from '@/components/blogs/fileUpload.vue'
import videoEdit from '@/components/blogs/videoPlayer.vue'
import { shallowRef } from 'vue';

const currentComponent = shallowRef(uploadBlog)
const blogUpdated = ()=>{
  currentComponent.value = videoEdit
}
</script>
<template>
  <div
    class="2xl:mx-auto 2xl:container lg:px-20 md:py-9 md:px-6 my-3 px-4 w-96 sm:w-auto bg-white rounded shadow-md shadow-slate-300"
  >
    <div class="flex flex-col items-center justify-center">
      <h1 class="main-title text-primary">New Blog</h1>
      <div class="my-5">
        <ul class="steps">
          <li class="step step-neutral w-60">Add Blog</li>
          <li class="step ">Edit video</li>
        </ul>
      </div>
      <div class="w-full">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>
