<script setup lang="ts">
import { ref, computed } from "vue";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Swal from "sweetalert2";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const emit = defineEmits(["submit-user"]);

const newImage = ref({} as File);
const loading = ref(false);
const imgUrl = ref("");
const scheme = computed(() => {
  return yup.object({
    fullName: yup.string().required("full name is a required field"),
    phoneNumber: yup.string().required("phone number is a required field"),
  });
});
const { errors, handleSubmit } = useForm({
  validationSchema: scheme,
});
const { handleChange: FullNameError, value: fullName } = useField("fullName");
const { handleChange: phoneNumberError, value: phoneNumber } =
  useField("phoneNumber");

const user = computed(() => ({
  phoneNumber: phoneNumber.value,
  photoURL: "",
  fullName: fullName.value,
}));

const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && validateImageFileType(file)) {
    newImage.value = file;
    imgUrl.value = URL.createObjectURL(newImage.value);
  } else {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Please choose a correct image type",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

const validateImageFileType = (file: File): boolean => {
  const allowedTypes = ["image/png", "image/jpeg"];
  return allowedTypes.includes(file.type);
};

const updateProfile = handleSubmit(async () => {
  loading.value = true;
  const storage = getStorage();
  const imageRef = storageRef(storage, "images/" + newImage.value.name);
  await uploadBytes(imageRef, newImage.value)
    .then(async () => {
      const profileImageUrl = await getDownloadURL(imageRef);
      user.value.photoURL = profileImageUrl;
      emit("submit-user", user.value);
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
});
</script>
<template>
  <main>
    <form @submit.prevent="updateProfile">
      <div v-if="imgUrl" class="avatar flex justify-center">
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
          v-model="fullName"
          type="text"
          placeholder="full name "
          class="input input-bordered"
          @input="FullNameError"
        />
        <span v-if="errors.fullName" class="text-red-500 p-2">
          {{ errors.fullName }}
        </span>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Phone number</span>
        </label>
        <input
          v-model="phoneNumber"
          type="number"
          placeholder="phone number"
          class="input input-bordered"
          @input="phoneNumberError"
        />
        <span v-if="errors.phoneNumber" class="text-red-500 p-2">
          {{ errors.phoneNumber }}
        </span>
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
        <button :class="['btn btn-primary', loading ? 'loading' : '']">
          Save
        </button>
      </div>
    </form>
  </main>
</template>
