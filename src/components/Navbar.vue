<template>
  <div class="navbar bg-white px-5 sticky top-0">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </label>
      </div>
      <router-link to="/" class="flex items-center space-x-2">
        <div class="text-primary font-bold text-2xl">Video</div>
        <div class="text-secondary font-bold text-2xl">Blog</div>
      </router-link>
    </div>
    <div class="navbar-center hidden lg:flex">

    </div>
    <div class="navbar-end">
      <router-link to="/blog/new" class="btn btn-primary">Add blog</router-link>
    </div>
  </div>
</template>
