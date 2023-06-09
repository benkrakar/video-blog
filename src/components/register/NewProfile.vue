<script setup lang="ts">
import { ref, computed } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const emit = defineEmits(["add-user-info"]);
const passwordType = ref("password");

const passwordToggle = () => {
  passwordType.value = passwordType.value === "password" ? "text" : "password";
};

const scheme = computed(() => {
  return yup.object({
    email: yup.string().required().email(),
    password: yup
      .string()
      .required("Please fill out this field. It is required for submission.")
      .min(
        8,
        "This field must contain at least 8 characters. Please enter a valid value."
      )
      .max(
        30,
        "This field must not exceed 30 characters. Please enter a valid value."
      ),
  });
});
const { errors, handleSubmit } = useForm({
  validationSchema: scheme,
});
const { handleChange: mailError, value: email } = useField("email");
const { handleChange: passwordError, value: password } = useField("password");

const user = computed(() => ({
  email: email.value,
  password: password.value,
}));

const register = handleSubmit(async () => {
  emit("add-user-info", user.value);
});
</script>
<template>
  <main>
    <form @submit.prevent="register">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          v-model="email"
          type="text"
          placeholder="email"
          class="input input-bordered"
          @input="mailError"
        />
        <span v-if="errors.email" class="text-red-500 p-2">{{
          errors.email
        }}</span>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <div class="relative">
          <input
            v-model="password"
            :type="passwordType"
            placeholder="password"
            class="input input-bordered w-full"
            @input="passwordError"
          />
          <button
            v-if="user.password"
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
        <span v-if="errors.password" class="text-red-500 p-2">{{
          errors.password
        }}</span>
      </div>
      <div class="form-control mt-6">
        <button class="btn btn-primary">Register</button>
      </div>
    </form>
  </main>
</template>
