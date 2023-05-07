<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { Ref } from 'vue'
import {
  getStorage,
  ref as refFromURL,
  getDownloadURL,
  updateMetadata,
} from 'firebase/storage'
import type { StorageReference } from 'firebase/storage'
import Swal from 'sweetalert2';

const props = defineProps({
  url: { type: String, required: true },
})

const videoUrl = ref('')
const startTime = ref(0)
const endTime = ref(0)
const videoRef = ref({} as StorageReference)
const videoDuration = reactive({
  minutes: 0,
  seconds: 0,
})
const VideoEditor: Ref<HTMLVideoElement | null> = ref(null)

onMounted(async () => {
  const storage = getStorage()
  videoRef.value = refFromURL(storage, props.url)
  if (videoRef.value) {
    const url = await getDownloadURL(videoRef.value)
    videoUrl.value = url
  }
})
const handleLoadedMetadata = () => {
  if (VideoEditor.value) {
    videoDuration.minutes = Math.floor(VideoEditor.value.duration / 60)
    videoDuration.seconds = Math.floor(VideoEditor.value.duration % 60)
  }
}
const saveBlog = async () => {
  const metadata = {
    customMetadata: {
      startTime: startTime.value,
      endTime: endTime.value,
    },
  }
  await updateMetadata(videoRef.value, metadata)
  .then(()=>{
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Saving the video was successful',
        showConfirmButton: false,
        timer: 1500
      })
  })
}
</script>

<template>
  <form @submit.prevent="saveBlog">
    <div class="flex justify-around w-full gap-5 shadow-xl p-5 rounded-xl">
      <div v-if="videoUrl" class="flex-1">
        <video
          controls
          autoplay
          ref="VideoEditor"
          class="rounded-xl"
          @loadedmetadata="handleLoadedMetadata"
        >
          <source :src="videoUrl" type="video/mp4" />
        </video>
      </div>
      <div class="flex-1">
        <div class="w-3/4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Start time</span>
            </label>
            <input
              type="text"
              placeholder="start time"
              class="input input-bordered w-full"
              v-model="startTime"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">End time</span>
            </label>
            <input
              type="text"
              placeholder="end time"
              class="input input-bordered w-full"
              v-model="endTime"
            />
          </div>
          <div class="mt-4 ml-1">
            <p>
              Video duration :
              <span>{{ videoDuration.minutes }} minutes</span>
              <span class="pl-1">{{ videoDuration.seconds }} second</span>
            </p>
          </div>
          <div class="flex justify-end">
            <button :class="['btn btn-primary']" type="submit">Save</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
