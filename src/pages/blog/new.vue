<script setup lang="ts">
import NewBlog from '@/components/blogs/NewBlog.vue'
import VideoEditor from '@/components/blogs/VideoEditor.vue'
import { db } from '@/firebase'
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { ref } from 'vue';
const source = ref('')
const currentComponent = ref('NewBlog')
const components: any = ({
  NewBlog,
  VideoEditor
})
const blogUpdated = async(id: string)=>{
  const blogDoc = doc(db, "blogs", id);
  const blogData = await getDoc(blogDoc);
  const { videoUrl }  = blogData.data() as any
  source.value = videoUrl
  currentComponent.value="VideoEditor"
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
          <li :class="['step', currentComponent === 'VideoEditor' ? 'step-neutral' : '']">Edit video</li>
        </ul>
      </div>
      <div class="w-full">
        <component :is="components[currentComponent]" @blogUpdated="blogUpdated" :url="source"></component>
      </div>
    </div>
  </div>
</template>
