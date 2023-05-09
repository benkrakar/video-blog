<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import type { Ref } from 'vue'
import { DocumentReference, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useField, useForm } from "vee-validate"
import * as yup from "yup" 

const router = useRouter()
const props = defineProps({
  sourceVideo: { type: String, required: true },
  blogId: { type: String, required: true },
})

const video = ref([] as Videos[])
const videoRef = ref({})
const videoUrl = ref('')
const videoIndex = ref(0)
const videoSeconds = ref(0)
const videoDuration = reactive({
  minutes: 0,
  seconds: 0,
})
const VideoEditor: Ref<HTMLVideoElement | null> = ref(null)

  const scheme = computed(() => {
  return yup.object({
    startTime: yup
      .number()
      .min(0, "invalid number ")
      .max(yup.ref('endTime'), 'Please enter a value that is less than or equal to the end time.')
      .required("This field is requried"),
    endTime: yup
      .number()
      .min(yup.ref('startTime'), "End time must be greater than start time")
      .max(videoSeconds.value,  'The value you enter must be less than or equal to the current video time.')
      .required("This field is requried")
  })
})


const { errors, handleSubmit } = useForm({
  validationSchema: scheme,
})

const { handleChange: startTimeError, value: startTime, } = useField<number>('startTime')
const { handleChange: endTimeError, value: endTime } = useField<number>('endTime')
 

onMounted(async () => {  
  videoRef.value = doc(db, "blogs", props.blogId);
  const blogSnapshot = await getDoc(videoRef.value as DocumentReference<Blog>);
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
    videoSeconds.value = VideoEditor.value.duration 
  }
}

const saveBlog = handleSubmit(async() => {
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
})
</script>

<template>
  <form @submit.prevent="saveBlog">
    <div class="flex justify-around w-full gap-5 shadow-xl p-5 rounded-xl flex-col lg:flex-row">
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
        <div class="w-full lg:w-3/4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Start time (s)</span>
            </label>
            <input
              type="number"
              placeholder="start time"
              class="input input-bordered w-full"
              v-model="startTime"
              @input="startTimeError"
            />
            <span v-if="errors.startTime" class="text-red-500 p-2">{{ errors.startTime }}</span>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">End time (s)</span>
            </label>
            <input
              type="number"
              placeholder="end time"
              class="input input-bordered w-full"
              v-model="endTime"
              @input="endTimeError"
            />
            <span v-if="errors.endTime" class="text-red-500 p-2">{{ errors.endTime }}</span>
          </div>
          <div class="mt-4 ml-1">
            <p>
              Video duration :
              <span>{{ videoDuration.minutes }} minutes</span>
              <span class="pl-1">{{ videoDuration.seconds }} second</span>
              <br />
              <span >total seconds: {{ Math.round(videoSeconds) }} s</span>
            </p>
          </div>
          <div class="flex justify-center lg:justify-end">
            <button :class="['btn btn-primary']" type="submit">Save</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
