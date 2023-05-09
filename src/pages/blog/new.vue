<script setup lang="ts">
import { ref } from "vue";
import type { Component } from "vue";
import NewBlog from "@/components/blogs/NewBlog.vue";
import NewBlogVideo from "@/components/blogs/NewBlogVideo.vue";
import VideoEditor from "@/components/blogs/VideoEditor.vue";

const source = ref("");
const blogId = ref("");
const currentComponent = ref("NewBlog");
const components: Component = {
  NewBlog,
  NewBlogVideo,
  VideoEditor,
};

const videoUpdated = async (blogVideoUrl: string) => {
  source.value = blogVideoUrl;
  currentComponent.value = "VideoEditor";
};

const blogUpdated = async (id: string) => {
  blogId.value = id;
  currentComponent.value = "NewBlogVideo";
};

const updateExistingBlog = async (id: string, blogVideoUrl: string) => {
  blogId.value = id;
  source.value = blogVideoUrl;
  currentComponent.value = "VideoEditor";
};
</script>
<template>
  <div
    class="2xl:mx-auto 2xl:container lg:px-20 md:py-9 md:px-6 my-3 px-4 sm:w-auto bg-white rounded shadow-md shadow-slate-300 p-10"
  >
    <div class="flex flex-col items-center justify-center">
      <h1 class="main-title text-primary">New Blog</h1>
      <div class="my-5">
        <ul class="steps">
          <li class="step step-neutral font-bold">Adding blog details</li>
          <li
            :class="[
              'step',
              currentComponent === ('NewBlogVideo' || 'VideoEditor')
                ? 'step-neutral font-bold'
                : '',
            ]"
          >
            Adding blog video
          </li>
          <li
            :class="[
              'step ',
              currentComponent === 'VideoEditor'
                ? 'step-neutral font-bold'
                : '',
            ]"
          >
            Adding video timing
          </li>
        </ul>
      </div>
      <div class="w-full">
        <component
          :is="components[currentComponent]"
          :blog-id="blogId"
          :source-video="source"
          @blog-updated="blogUpdated"
          @video-updated="videoUpdated"
          @update-existing-blog="updateExistingBlog"
        ></component>
      </div>
    </div>
  </div>
</template>
