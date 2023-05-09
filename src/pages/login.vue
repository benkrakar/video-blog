<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2';
import { useField, useForm } from "vee-validate"
import * as yup from "yup" 

const store = useStore()
const router = useRouter()
const passwordType = ref('password')
const passwordToggle = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}


const scheme = computed(() => {
  return yup.object({
    email: yup
    .string()
    .required('Please fill out this field. It is required for submission.')
    .email('Please enter a valid email address in this field.'),
    password: yup
    .string()
      .required('Please fill out this field. It is required for submission.')
      .min(8, 'This field must contain at least 8 characters. Please enter a valid value.')
      .max(30, 'This field must not exceed 30 characters. Please enter a valid value.'),
  })
})
const { errors, handleSubmit } = useForm({
  validationSchema: scheme,
})
const { handleChange: mailError, value: email } = useField('email')
const { handleChange: passwordError, value: password } = useField('password')


const login = handleSubmit(async () => {
  await store.dispatch('signIn', { email: email.value, password: password.value })
  const currentUser = store.state.auth.user  
  if(!currentUser.emailVerified){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'please confirm your email!',
    })
    await store.dispatch('logOut')
  } else {
      router.push("/");
  };
})

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
              v-model="email"
              class="input input-bordered"
              name="email"
              @input="mailError"
            />
            <span v-if="errors.email" class="text-red-500 p-2">{{ errors.email }}</span>
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
                v-model="password"
                name="password"
                @input="passwordError"
              />
              <button
                v-if="password"
                type="button"
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
              <span v-if="errors.password" class="text-red-500 p-2">{{ errors.password }}</span>
              <label class="flex justify-center my-4 text-4xl font-semibold leading-3 ">
                <router-link to="/register" class="label-text-alt link link-hover">
                  New here? Sign up now.
                </router-link >
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
