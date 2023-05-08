<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type{ Ref } from 'vue'
import { collection, getDocs } from "firebase/firestore";
import BlogCard from '@/components/blogs/blogCard.vue'
import { db } from "@/firebase";
const blogs: Ref<Blog[]> = ref([])

const getAllBlogs = async () => {
  const blogCollection = collection(db, "blogs");
  const blogsSnapshot = await getDocs(blogCollection);
  const blogs = blogsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return blogs;
};

onMounted(async () => {
  blogs.value = await getAllBlogs() as Blog[]
})
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
          <router-link to="/blog/new" class="btn btn-primary my-4">Add new blog</router-link>
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
