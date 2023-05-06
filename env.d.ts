/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-vue-layouts/client" />

declare interface User {
  fullName: string,
  email: string,
  password: string,
}

declare interface Blog {
  id:string,
  postDate: string,
  title: string,
  author: string,
}


