<script setup lang="ts">
import NewBlog from '@/components/blogs/NewBlog.vue'
import NewBlogVideo from '@/components/blogs/NewBlogVideo.vue'
import VideoEditor from '@/components/blogs/VideoEditor.vue'
import { db } from '@/firebase'
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { ref } from 'vue';
const source = ref('')
const blogId = ref('')
const currentComponent = ref('NewBlog')
const components: any = ({
  NewBlog,
  NewBlogVideo,
  VideoEditor
})

const videoUpdated = async(blogVideoUrl: string)=>{
  source.value = blogVideoUrl
  currentComponent.value="VideoEditor"
}

const blogUpdated = async(id: string)=>{
  blogId.value = id
  currentComponent.value="NewBlogVideo"
}
</script>
<template>
  <div
    class="2xl:mx-auto 2xl:container lg:px-20 md:py-9 md:px-6 my-3 px-4  sm:w-auto bg-white rounded shadow-md shadow-slate-300 p-10"
  >
    <div class="flex flex-col items-center justify-center">
      <h1 class="main-title text-primary">New Blog</h1>
      <div class="my-5">
        <ul class="steps">
          <li class="step step-neutral "></li>
          <li :class="['step', currentComponent === 'VideoEditor' ? 'step-neutral' : '']"></li>
        </ul>
      </div>
      <div class="w-full">
        <component :is="components[currentComponent]" @blogUpdated="blogUpdated" @videoUpdated="videoUpdated" :blogId="blogId" :sourceVideo="source"></component>
      </div>
    </div>
  </div>
</template>
