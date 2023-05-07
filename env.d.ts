/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-vue-layouts/client" />

declare interface User {
  displayName: string,
  phoneNumber: string,
  fullName: string,
  photoURL: string,
}

declare interface Blog {
  id:string,
  description: string,
  title: string,
  author: string,
  coverImage: string,
  created_at: string,
  videoUrl: string[],

}


