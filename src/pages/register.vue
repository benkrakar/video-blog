<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2';

const router = useRouter()
const store = useStore()
const passwordType = ref('password')

const passwordToggle = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

const user = reactive({
  fullName:"",
  email:"",
  password:"",
})

const register = async () => {
  await store.dispatch('signUp', user)
  .then(()=>{
    router.push("/login");
  })
  .catch((err)=>{
    console.log(err.message.error);
    
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'email already in use',
        showConfirmButton: false,
        timer: 1500
      })
    })
}
</script>
<template>
  <main>
    <div class="hero min-h-screen bg-base-200">
      <div class="auth-card">
        <div class="card-body">
          <div class="flex justify-center">
            <div class="text-primary font-bold text-4xl mr-2">Video</div>
            <div class="text-secondary font-bold text-4xl">Blog</div>
          </div>
          <form @submit.prevent="register">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Full name</span>
            </label>
            <input
              type="text"
              placeholder="first name"
              class="input input-bordered"
              v-model="user.fullName"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="email"
              class="input input-bordered"
              v-model="user.email"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <div class="relative">
              <input
                :type="passwordType"
                placeholder="password"
                class="input input-bordered w-full"
                v-model="user.password"
              />
              <button
                v-if="user.password"
                class="absolute top-1/2 right-2 -mt-2 text-gray-500"
                @click="passwordToggle"
              >
                <Icon
                  :icon="
                    passwordType === 'password'
                      ? 'mdi:eye-outline'
                      : 'mdi:eye-off-outline'
                  "
                  class="text-lg"
                />
              </button>
            </div>
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary">Register</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  </main>
</template>

<route lang="yaml">
  meta:
    layout: auth
    auth: "guest"
</route>
