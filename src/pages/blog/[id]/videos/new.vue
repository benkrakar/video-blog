<script setup lang="ts">
import { useRoute } from 'vue-router'
import NewBlogVideo from '@/components/blogs/NewBlogVideo.vue'
import VideoEditor from '@/components/blogs/VideoEditor.vue'
import { ref } from 'vue';
const source = ref('')
const currentComponent = ref('NewBlogVideo')
const components: any = ({
  NewBlogVideo,
  VideoEditor
})
const route = useRoute()
const blogId = route.params.id as string

const videoUpdated = async(blogVideoUrl: string)=>{
  source.value = blogVideoUrl
  currentComponent.value="VideoEditor"
}

</script>
<template>
  <div
    class="2xl:mx-auto 2xl:container lg:px-20 md:py-9 md:px-6 my-3 px-4  sm:w-auto bg-white rounded shadow-md shadow-slate-300 p-10"
  >
    <div class="flex  flex-col items-center justify-center">
      <h1 class="main-title text-primary">New Blog Video</h1>
    
      <div class="w-full">
        <component :is="components[currentComponent]" @videoUpdated="videoUpdated" :blogId="blogId" :sourceVideo="source"></component>
      </div>
    </div>
  </div>
</template>
