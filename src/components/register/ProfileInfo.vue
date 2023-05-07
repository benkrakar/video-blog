<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import Swal from 'sweetalert2'
import { useField, useForm } from "vee-validate"
import * as yup from "yup"

const router = useRouter()
const store = useStore()
const newImage = ref({} as File)
const loading = ref(false)
const imgUrl = ref('')
const scheme = computed(() => {
  return yup.object({
    fullName: yup.string().required('full name is a required field'),
    phoneNumber: yup.string().required('phone number is a required field')
  })
})
const { errors, handleSubmit } = useForm({
  validationSchema: scheme,
})
const { handleChange: FullNameError, value: fullName
 } = useField('fullName')
const { handleChange: phoneNumberError, value: phoneNumber } = useField('phoneNumber')

const user = computed(() => ({
  phoneNumber: phoneNumber.value,
  photoURL: '',
  fullName: fullName.value,
}))

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    newImage.value = file
    imgUrl.value = URL.createObjectURL(newImage.value)
  }
}

const updateProfile = handleSubmit(async () => {
  loading.value = true
  const storage = getStorage()
  const imageRef = storageRef(storage, 'images/' + newImage.value.name)
  await uploadBytes(imageRef, newImage.value)
    .then(async () => {
      const profileImageUrl = await getDownloadURL(imageRef)
      user.value.photoURL = profileImageUrl
      await store.dispatch('updateProfile', user).then(() => {
        loading.value = false
        Swal.fire({
          title: 'Congratulations',
          text: "A confirmation email has been sent to you in order to activate your account.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Great',
        }).then(() => {
          router.push('/login')
        })
      })
    })
    .catch((err) => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err,
        showConfirmButton: false,
        timer: 1500,
      })
    })
})
</script>
<template>
  <main>
    <form @submit.prevent="updateProfile">
      <div class="avatar flex justify-center" v-if="imgUrl">
        <div
          class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 my-5"
        >
          <img :src="imgUrl" />
        </div>
      </div>
      <div class="form-control">
          <label class="label">
            <span class="label-text">Full name</span>
          </label>
          <input
            type="text"
            placeholder="full name "
            class="input input-bordered"
            @input="FullNameError"
            v-model="fullName"
          />
          <span v-if="errors.fullName" class="text-red-500 p-2">{{ errors.fullName }}</span>
        </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Phone number</span>
        </label>
        <input
          type="number"
          placeholder="phone number"
          class="input input-bordered"
          @input="phoneNumberError"
          v-model="phoneNumber"
        />
        <span v-if="errors.phoneNumber" class="text-red-500 p-2">{{ errors.phoneNumber }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Profile Image</span>
        </label>
        <input
          type="file"
          class="file-input file-input-ghost w-full max-w-xs"
          accept="image/png, image/jpeg"
          @change="handleImage"
        />
      </div>
      <div class="form-control mt-6">
        <button :class="['btn btn-primary', loading ? 'loading' : '' ]" >Save</button>
      </div>
    </form>
  </main>
</template>
