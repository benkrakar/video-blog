<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <p class="text-gray-600 text-lg mb-8">
        Oops! The page you're looking for does not exist.
      </p>
      <router-link
        to="/"
        class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >Back to home</router-link
      >
    </div>
  </div>
</template>
