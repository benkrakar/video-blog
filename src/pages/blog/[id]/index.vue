<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type{ Ref } from 'vue'
import { doc, getDoc } from "firebase/firestore";
import { getMetadata } from 'firebase/storage'
import { db } from "@/firebase";
import { useRoute } from 'vue-router'

const blogs: Ref<Blog> = ref({} as Blog)
const route = useRoute()

const getBlogById = async () => {
  const id = route.params.id
  const blogDoc = doc(db, "blogs", id.toString());
  const blogSnapshot = await getDoc(blogDoc);
  const blog = { id: blogSnapshot.id, ...blogSnapshot.data() };
  return blog;
};

onMounted(async () => {
  blogs.value = await getBlogById() as Blog  
})
</script>
<template>
<div v-if="blogs">
	<div class="grid grid-cols-1 lg:grid-cols-1 gap-4 p-10 bg-white shadow-md m-6 rounded-xl">
		<div class="lg:col-span-2 h-fit">
			<div class="flex items-center justify-center min-h-[32rem] bg-gray-200 h-full rounded-lg p-4">
				<video
        v-if="blogs.videoUrl"
          controls
          autoplay
          class="rounded-xl"
        >
          <source :src="blogs.videoUrl[0]" type="video/mp4" />
        </video>
			</div>
			<div class="p-4">
				<h1  class="text-gray-800"> {{ blogs }} </h1>
			</div>
			<div class="bg-gray-200 rounded-xl p-8">
				<p class="text-gray-700">{{ blogs.description}}</p>
			</div>
		</div>
	</div>
</div>

</template>