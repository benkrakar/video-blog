<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const passwordType = ref('password')
const passwordToggle = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

const user = reactive({
  email:"",
  password:"",
})

const login = async () => {
  await store.dispatch('signIn', { email: user.email, password: user.password })
  const currentUser = store.state.auth.user  
  if(!currentUser.emailVerified){
    await store.dispatch('logOut')
  } else {
      router.push("/");
  };
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
          
          <form @submit.prevent="login">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="email"
                 v-model="user.email"
              class="input input-bordered"
              name="email"
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
                  name="password"
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
              <label class="label">
                <a href="#" class="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div class="form-control mt-6">
              <button type="submit" class="btn btn-primary">Login</button>
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
