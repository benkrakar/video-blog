<template>
  <div v-if="videoUrl">
    <video ref="videoPlayer" controls  autoplay >
      <source :src="videoUrl" type="video/mp4">
    </video>
  </div>
</template>

  <script setup lang="ts">
  import { ref, onMounted, Ref } from "vue";
  import { getStorage, ref as storageRef, getDownloadURL , getMetadata} from "firebase/storage";

  const videoUrl = ref("");
  const startTime = ref(0);
  const endTime = ref(0);
  const videoPlayer: Ref<HTMLVideoElement | null> = ref(null);

  onMounted(async () => {
    const storage = getStorage();
    const videoRef = storageRef(storage, "videos/012 Combining & Merging Different Volumes.mp4"); // Replace "example.mp4" with the name of your video file
    try {
      const url = await getDownloadURL(videoRef);
      const metadata = await getMetadata(videoRef);
      if (metadata.customMetadata) {
      startTime.value = parseInt(metadata.customMetadata.startTime);
      endTime.value = parseInt(metadata.customMetadata.endTime);
    }
      videoUrl.value = url;
      if (videoPlayer.value) {
      videoPlayer.value.currentTime = startTime.value; 
      videoPlayer.value.currentTime = startTime.value; 
    }
    } catch (error) {
      console.error("Failed to get download URL", error);
    }
  });
  </script>
