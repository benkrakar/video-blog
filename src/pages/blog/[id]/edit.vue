<script setup lang="ts">
import EditBlog from '@/components/blogs/EditBlog.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const blogId = route.params.id as string
</script>
<template>
  <div
    class="2xl:mx-auto 2xl:container lg:px-20 md:py-9 md:px-6 my-3 px-4  sm:w-auto bg-white rounded shadow-md shadow-slate-300 p-10"
  >
    <div class="flex  flex-col items-center justify-center">
      <h1 class="main-title text-primary">New Blog</h1>
    
      <div class="w-full">
        <EditBlog :blogId="blogId"/>
      </div>
    </div>
  </div>
</template>
