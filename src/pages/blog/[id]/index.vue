<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRoute } from 'vue-router'
import Playlist from '@/components/blogs/playList.vue'

const blog: Ref<Blog> = ref({} as Blog)
const videoIndex = ref(0)
const route = useRoute()
const VideoPlayer: Ref<HTMLVideoElement | null> = ref(null)

const id = route.params.id
const getBlogById = async () => {
  const blogDoc = doc(db, 'blogs', id.toString())
  const blogSnapshot = await getDoc(blogDoc)
  const blog = { id: blogSnapshot.id, ...blogSnapshot.data() }
  return blog
}
onMounted(async () => {
  blog.value = (await getBlogById()) as Blog
})

const updateVideo = (item: number) => {
  if (VideoPlayer.value) {
    videoIndex.value = item    
    VideoPlayer.value.currentTime = 44
    VideoPlayer.value.load()
  }
}

const onVideoCanPlay = () => {
  if (!VideoPlayer.value) {
    return
  }

  const video = VideoPlayer.value
  const currentVideo = blog.value.videos[videoIndex.value]

  if (currentVideo.startTime) {
    video.currentTime = currentVideo.startTime
  }

  video.play()

  if (currentVideo.endTime) {
    const duration = (currentVideo.endTime - currentVideo.startTime) * 1000
    setTimeout(() => {
      video.pause()
      video.currentTime = 0
    }, duration)
  }
}

</script>
<template>
  <div v-if="blog.videos">
    <div class="flex justify-between items-center p-0 w-full px-6">
      <h1
        v-if="blog.videos[videoIndex].title"
        class="text-gray-800 max-w-[50%] break-words"
      >
        {{ blog.videos[videoIndex].title }}
      </h1>
      <div>
        <router-link :to="`/blog/${id}/edit`" class="btn btn-primary my-4 mx-2">
          Edit
        </router-link>
        <router-link
          :to="`/blog/${id}/videos/new`"
          class="btn btn-success my-4 text-white"
        >
          Add New Video
        </router-link>
      </div>
    </div>
    <div
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-10 bg-white shadow-md m-6 rounded-xl"
    >
      <div class="lg:col-span-2 h-fit">
        <div
          class="flex items-center justify-center min-h-[32rem] bg-gray-200 h-full rounded-lg p-4"
        >
          <video
            v-if="blog.videos"
            controls
            autoplay
            class="rounded-xl"
            ref="VideoPlayer"
            :key="blog.videos[0].url"
            @loadedmetadata="onVideoCanPlay"
          >
            <source
              :src="blog.videos[videoIndex].url"
              type="video/mp4"
            />
          </video>
        </div>
        <div class="bg-gray-200 rounded-xl p-8 my-4">
          <p class="text-gray-700">description: {{ blog.description }}</p>
        </div>
      </div>
      <Playlist
        v-if="blog.videos.length > 1"
        :videos="blog.videos"
        :cover="blog.coverImage"
        @updateVideo="updateVideo"
      />
    </div>
  </div>
</template>
