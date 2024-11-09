// https://nuxt.com/docs/api/configuration/nuxt-config

import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@invictus.codes/nuxt-vuetify',
    '@kgierke/nuxt-basic-auth'
  ],
  basicAuth: {
    enabled: false,
    users: [
      {
        username: process.env.APP_USER,
        password: process.env.APP_PASSWORD,
      },
      {
        username: process.env.GUEST_USER,
        password: process.env.GUEST_PASSWORD,
      },
    ],
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
    keys: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      PHANTOMBUSTER_API_KEY: process.env.PHANTOMBUSTER_API_KEY,
      PHANTOMBUSTER_AGENT_ID: process.env.PHANTOMBUSTER_AGENT_ID,
      HUNTER_API_KEY: process.env.HUNTER_API_KEY,
      mongodbUri: process.env.MONGODB_URI,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      GUEST_USER: process.env.GUEST_USER,
      GUEST_PASSWORD: process.env.GUEST_PASSWORD,
    },
    public: {
      mode: process.env.NUXT_PUBLIC_MODE || 'guest', // Default to 'guest' if not set
    },
  },
  nitro: {
    plugins: ['~/server/index.ts'],
  },
});
