<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  blog: { type: Object as PropType<Blog>, required: true },
});

const blogCoverImg = (item: string) => {
  if (item) return item;
  return "https://i.ibb.co/DYxtCJq/img-1.png";
};
</script>

<template>
  <div class="relative min-w-[25rem] hover:-translate-y-2">
    <div>
      <div class="absolute bottom-0 left-0 p-6 bg-black/70 w-full rounded-lg">
        <h2 class="text-xl font-semibold 5 text-white">{{ blog.title }}</h2>
        <p class="text-base leading-4 text-white mt-2">
          {{ blog.author }}
        </p>
        <router-link
          :to="`/blog/${blog.id}`"
          href="javascript:void(0)"
          class="focus:outline-none focus:underline flex items-center mt-4 cursor-pointer text-white hover:text-gray-200 hover:underline"
        >
          <router-link
            :to="`/blog/${blog.id}`"
            class="pr-2 text-sm font-medium leading-none"
            >Read More</router-link
          >
          <svg
            class="fill-stroke"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.75 12.5L10.25 8L5.75 3.5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </router-link>
      </div>
    </div>
    <img
      :src="blogCoverImg(blog.coverImage)"
      class="w-[25rem] h-[25rem] rounded-lg"
    />
  </div>
</template>
