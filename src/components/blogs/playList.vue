<script setup lang="ts">
import type {  PropType } from 'vue'

const props = defineProps({
  videos: { type: Array as PropType<Videos[]>, required: true },
  cover: { type: String, required: false },
})
const emit = defineEmits(['updateVideo'])

const setVideo = (item: number) => {
  emit("updateVideo", item)
}

</script>

<template>
<div class="border border-primary/50 rounded-lg h-fit">
	<div class="bg-primary/80 text-white px-6 py-10 flex justify-between items-center">
		<h1>Playlist Blog</h1>
		<Icon icon="material-symbols:close" class="text-2xl cursor-pointer" />
	</div>
	<div class="overflow-scroll max-h-[25rem] py-10">
		<div v-for="(video, index) in videos" :key="index" @click="setVideo(index)" class=" grid grid-cols-4 gap-2 p-2 min-h-20 h-h-[9rem]   overflow-hidden cursor-pointer hover:bg-primary/10 duration-200">
      <img  :src="cover" class="h-[7rem] w-[9rem]  rounded-lg "  />
			<div class="px-4 col-span-3 flex items-center">
				<div>
					<h2 class="text-sm lg:text-base text-gray-800">{{ video.title }}</h2>
				</div>
			</div>
		</div>
	</div>
</div>
</template>