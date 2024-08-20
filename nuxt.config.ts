// https://nuxt.com/docs/api/configuration/nuxt-config

import { resolve } from "path";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@invictus.codes/nuxt-vuetify',
    '@kgierke/nuxt-basic-auth'
  ],
  basicAuth: {
    enabled: true,
    users: [
      {
        username: "admin",
        password: "Fj29J(^#jjskKJVsjwjal)",
      },
    ],
    // Optional: Delimiter for users string
    // usersDelimiter: ",",
    // Optional: Whitelist routes
    // allowedRoutes: ["/api/.*"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  alias: {
    '@': resolve(__dirname, "/"),
  },
  css: ["~/assets/main.scss"],
  runtimeConfig: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    PHANTOMBUSTER_API_KEY: process.env.PHANTOMBUSTER_API_KEY,
    HUNTER_API_KEY: process.env.HUNTER_API_KEY,
    mongodbUri: process.env.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    MONGODB_COLLECTION: process.env.MONGODB_COLLECTION,
  },
  nitro: {
    plugins: ['~/server/index.ts'],
  },


});
