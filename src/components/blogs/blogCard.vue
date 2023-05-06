<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  blog: { type: Object as PropType<Blog>, required: true },
})
</script>

<template>
  <div class="relative min-w-[25rem] hover:-translate-y-2">
    <div >
      <p
        class="p-6 text-xs font-medium leading-3 text-white absolute top-0 right-0"
      >
        {{ blog.postDate }}
      </p>
      <div class="absolute bottom-0 left-0 p-6">
        <h2 class="text-xl font-semibold 5 text-white">{{ blog.title }}</h2>
        <p class="text-base leading-4 text-white mt-2">
          {{ blog.author }}
        </p>
        <a
          href="javascript:void(0)"
          class="focus:outline-none focus:underline flex items-center mt-4 cursor-pointer text-white hover:text-gray-200 hover:underline"
        >
          <p class="pr-2 text-sm font-medium leading-none">Read More</p>
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
        </a>
      </div>
    </div>
    <img src="https://i.ibb.co/DYxtCJq/img-1.png" class="w-full rounded-lg" alt="chair" />
  </div>
</template>
