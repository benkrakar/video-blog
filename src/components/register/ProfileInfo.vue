<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  updateMetadata,
  getDownloadURL,
} from 'firebase/storage'
import Swal from 'sweetalert2'

const router = useRouter()
const store = useStore()
const newImage = ref({} as File)
const loading = ref(false)
const imgUrl = ref('')
const user = reactive({
  phoneNumber: '',
  photoURL: '',
  fullName: '',
})

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    newImage.value = file
    imgUrl.value = URL.createObjectURL(newImage.value)
  }
}

const updateProfile = async () => {
  loading.value = true
  const storage = getStorage()
  const imageRef = storageRef(storage, 'images/' + newImage.value.name)
  await uploadBytes(imageRef, newImage.value)
    .then(async () => {
      const profileImageUrl = await getDownloadURL(imageRef)
      user.photoURL = profileImageUrl
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
}
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
            placeholder="first name"
            class="input input-bordered"
            v-model="user.fullName"
          />
        </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Phone number</span>
        </label>
        <input
          type="number"
          placeholder="phone number"
          class="input input-bordered"
          v-model="user.phoneNumber"
        />
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
