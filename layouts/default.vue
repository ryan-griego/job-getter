<template>
  <v-app class="app-background">
    <div class="d-flex">

      <!-- removed nav until at least 1 page has been added -->

      <!-- <v-navigation-drawer class="flex-shrink-0"
        image="https://www.ryangriego.com/images/home-background-ryan-griego.jpeg">
        <v-list-item title="Job Getter" subtitle="navigation" base-color="white"></v-list-item>
        <v-divider class="mt-10"></v-divider>
        <v-list-item link base-color="white">
          <NuxtLink to="/" class="white--text">Home</NuxtLink>
        </v-list-item>
        <v-list-item link base-color="white">
          <NuxtLink to="/" class="white--text">Keywords</NuxtLink>
        </v-list-item>
        <v-list-item link title="Analytics" base-color="white"></v-list-item>
        <v-list-item link title="Feature Request" base-color="white"></v-list-item>
      </v-navigation-drawer> -->
      <v-main class="flex-grow-1">
        <slot />
      </v-main>
    </div>
  </v-app>
</template>
