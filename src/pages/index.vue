<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { collection, getDocs, where, query } from "firebase/firestore";
import BlogCard from "@/components/blogs/blogCard.vue";
import { db } from "@/firebase";
import { useStore } from "vuex";

const store = useStore();
const blogs: Ref<Blog[]> = ref([]);
const user = store.state.auth.user;
const getAllBlogs = async () => {
  const blogCollection = query(
    collection(db, "blogs"),
    where("author", "==", user.displayName)
  );
  const blogsSnapshot = await getDocs(blogCollection);
  const blogs = blogsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return blogs;
};

onMounted(async () => {
  blogs.value = (await getAllBlogs()) as Blog[];
});
</script>

<template>
  <main class="flex justify-center items-center my-5">
    <div
      class="2xl:mx-auto 2xl:container lg:px-20 lg:py-16 md:py-12 md:px-6 py-9 px-4 w-96 sm:w-auto bg-white rounded-xl shadow-lg"
    >
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold text-center text-gray-900 mb-6">
          This Week's Blogs
        </h1>
        <p
          class="text-lg leading-normal text-center text-gray-600 mt-4 lg:w-1/2 md:w-10/12 w-11/12"
        >
          Your blogs have found a home here! Feel free to share and make
          yourself at home.
        </p>
        <router-link
          to="/blog/new"
          class="inline-block px-8 py-3 mt-8 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add New Blog
        </router-link>
      </div>
      <div class="lg:flex items-stretch md:mt-12 mt-8">
        <div class="sm:flex items-center justify-center gap-6 flex-wrap">
          <div v-for="blog in blogs" :key="blog.id">
            <BlogCard :blog="blog" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
