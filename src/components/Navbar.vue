<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { auth } from "@/firebase";
import type firebase from "firebase/compat/app";

const router = useRouter();
const store = useStore();

const currentUser = ref<Partial<User> | null>(null);

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    currentUser.value = user as User | null;
  });
});

const Logout = async () => {
  await store.dispatch("logOut").then(() => {
    router.push("/login");
  });
};
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <router-link to="/" class="btn btn-ghost normal-case text-xl">
        {{ currentUser?.displayName }}</router-link
      >
    </div>
    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar w-16">
          <div class="rounded-full">
            <img :src="currentUser?.photoURL" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><button @click="Logout">Logout</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>
