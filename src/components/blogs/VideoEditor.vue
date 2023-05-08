<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { Ref } from 'vue'
import { DocumentReference, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  sourceVideo: { type: String, required: true },
  blogId: { type: String, required: true },
})

const video = ref([] )
const videoRef = ref({})
const videoUrl = ref('')
const videoIndex = ref(0)
const startTime = ref(0)
const endTime = ref(0)
const videoDuration = reactive({
  minutes: 0,
  seconds: 0,
})
const VideoEditor: Ref<HTMLVideoElement | null> = ref(null)

onMounted(async () => {  
  videoRef.value = doc(db, "blogs", props.blogId);
  const blogSnapshot = await getDoc(videoRef.value as DocumentReference<unknown>);
  if (blogSnapshot.exists()) {
  video.value = await blogSnapshot.data()?.videos;  
  video.value.forEach((video: any, index:number) => {
  if (video.videoUrl === videoUrl) {
    videoIndex.value = index;
  }
});
}
})

const handleLoadedMetadata = () => {
  if (VideoEditor.value) {
    videoDuration.minutes = Math.floor(VideoEditor.value.duration / 60)
    videoDuration.seconds = Math.floor(VideoEditor.value.duration % 60)
  }
}
const saveBlog = async () => {
  video.value[videoIndex.value].startTime = startTime.value;
  video.value[videoIndex.value].endTime = endTime.value;
  const blogRef = doc(db, "blogs", props.blogId);
  await updateDoc(blogRef, { videos: video.value })
  .then(()=>{
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Saving the video was successful',
      showConfirmButton: false,
      timer: 1500,
    })
    router.push(`/blog/${props.blogId}`);
  })
}
</script>

<template>
  <form @submit.prevent="saveBlog">
    <div class="flex justify-around w-full gap-5 shadow-xl p-5 rounded-xl">
      <div v-if="sourceVideo" class="flex-1">
        <video
          controls
          autoplay
          ref="VideoEditor"
          class="rounded-xl"
          @loadedmetadata="handleLoadedMetadata"
        >
          <source :src="sourceVideo" type="video/mp4" />
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
