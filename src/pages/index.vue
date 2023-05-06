<script setup lang="ts">
import { reactive } from 'vue'
import BlogCard from '@/components/blogs/blogCard.vue'

const blogs: Blog[] = reactive([
  {
    id: '1',
    postDate: '02/02/2022',
    title: 'Dummy title',
    author: 'Dummy Author',
  },
  {
    id: '2',
    postDate: '02/02/2022',
    title: 'Dummy title',
    author: 'Dummy Author',
  },
  {
    id: '3',
    postDate: '02/02/2022',
    title: 'Dummy title',
    author: 'Dummy Author',
  },
  {
    id: '4',
    postDate: '02/02/2022',
    title: 'Dummy title',
    author: 'Dummy Author',
  },
  {
    id: '5',
    postDate: '02/02/2022',
    title: 'Dummy title',
    author: 'Dummy Author',
  },
  {
    id: '6',
    postDate: '02/02/2022',
    title: 'Dummy title',
    author: 'Dummy Author',
  },
])
</script>

<template>
  <main>
    <div class="flex justify-center items-center">
      <div
        class="2xl:mx-auto 2xl:container lg:px-20 lg:py-16 md:py-12 md:px-6 py-9 px-4 w-96 sm:w-auto"
      >
        <div class="flex flex-col items-center justify-center">
          <h1 class="main-title">This Week Blogs</h1>
          <p
            class="text-base leading-normal text-center text-gray-600 dark:text-white mt-4 lg:w-1/2 md:w-10/12 w-11/12"
          >
            If you're looking for random paragraphs, you've come to the right
            place. When a random word or a random sentence isn't quite enough
          </p>
        </div>
        <div class="lg:flex items-stretch md:mt-12 mt-8">
          <div class="sm:flex items-center justify-center gap-6 flex-wrap">
            <div v-for="blog in blogs" :key="blog.id">
              <BlogCard :blog="blog" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
