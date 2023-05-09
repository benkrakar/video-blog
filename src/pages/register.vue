<script setup lang="ts">
import { ref } from "vue";
import type { Component } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import NewProfile from "@/components/register/NewProfile.vue";
import ProfileInfo from "@/components/register/ProfileInfo.vue";

const router = useRouter();
const store = useStore();
const user = ref<Partial<User>>({});
const loading = ref(false);
const currentComponent = ref("NewProfile");
const components: Component = {
  NewProfile,
  ProfileInfo,
};

const addUserInfo = async ({ email, password }: User) => {
  if (email && password) {
    user.value = { email, password };
    currentComponent.value = "ProfileInfo";
  }
};

const submitUser = async (userInfo: User) => {
  loading.value = true;
  user.value = { ...user.value, ...userInfo };
  await store
    .dispatch("signUp", user.value)
    .then(() => {
      loading.value = false;
      Swal.fire({
        title: "Congratulations",
        text: "A confirmation email has been sent to you in order to activate your account.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Great",
      }).then(() => {
        router.push("/login");
      });
    })
    .catch((err) => {
      loading.value = false;
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: err,
        showConfirmButton: false,
        timer: 1500,
      });
    });
};
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="auth-card">
      <div class="card-body">
        <div class="flex justify-center">
          <div class="text-primary font-bold text-4xl mr-2">Video</div>
          <div class="text-secondary font-bold text-4xl">Blog</div>
        </div>
        <KeepAlive>
          <component
            :is="components[currentComponent]"
            @add-user-info="addUserInfo"
            @submit-user="submitUser"
          ></component>
        </KeepAlive>
        <button
          v-if="currentComponent === 'ProfileInfo' && !loading"
          class="btn"
          @click="currentComponent = 'NewProfile'"
        >
          back
        </button>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
  auth: "guest"
</route>
