<script setup lang="ts">
import { ref } from 'vue'
import NewProfile from '@/components/register/NewProfile.vue'
import ProfileInfo from '@/components/register/ProfileInfo.vue'

const currentComponent = ref('NewProfile')
const components: any = {
  NewProfile,
  ProfileInfo,
}
const addUserInfo = async () => {
  currentComponent.value = 'ProfileInfo'
}
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="auth-card">
      <div class="card-body">
        <div class="flex justify-center">
          <div class="text-primary font-bold text-4xl mr-2">Video</div>
          <div class="text-secondary font-bold text-4xl">Blog</div>
        </div>
        <component
          :is="components[currentComponent]"
          @addUserInfo="addUserInfo"
        ></component>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
  meta:
    layout: auth
    auth: "guest"
</route>
