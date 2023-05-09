<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DocumentReference, doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { db } from '@/firebase'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  blogId: { type: String, required: true },
})
const blog =ref({} as Blog)

onMounted(async () => {  
  const dataRef = doc(db, "blogs", props.blogId);
  const blogSnapshot = await getDoc(dataRef as DocumentReference<Blog>);
  if (blogSnapshot.exists()) {
  blog.value = await blogSnapshot.data();  
}
})

const coverImage = ref({} as File)
const imgUrl = ref('')
const loading = ref(false)

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    coverImage.value = file
    imgUrl.value = URL.createObjectURL(coverImage.value)
  }
}

const editBlog = async () => {
  loading.value = true
  const storage = getStorage()
  if ( coverImage.value.name) {
    const imageRef = storageRef(storage, 'images/' + coverImage.value.name)
    await uploadBytes(imageRef, coverImage.value)  
    const blogCoverImage = await getDownloadURL(imageRef)
    blog.value.coverImage = blogCoverImage
  }
  const blogRef = doc(db, "blogs", props.blogId);  
  await updateDoc(blogRef, blog.value)
  .then(()=>{
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Blog updated successfully',
      showConfirmButton: false,
      timer: 1500,
    })
    router.push(`/blog/${props.blogId}`);
  })
  loading.value = false
}
</script>

<template>
  <div>
    <form @submit.prevent="editBlog">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="title"
          class="input input-bordered"
          v-model="blog.title"
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Description</span>
        </label>
        <textarea
          placeholder="Description"
          class="textarea textarea-bordered textarea-lg w-full"
          v-model="blog.description"
        ></textarea>
      </div>
      <div class="form-control w-full my-3">
        <label class="label">
          <span class="label-text">Pick a blog cover</span>
        </label>
        <input
          type="file"
          class="file-input file-input-bordered w-full"
          @change="handleImage"
        />
      </div>
      <div class="w-full flex justify-end">
        <button
          :class="['btn btn-primary', loading ? 'loading' : '']"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>
