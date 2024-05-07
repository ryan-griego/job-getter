<template>
  <NuxtLayout name="default">
    <NuxtPage />
  </NuxtLayout>
 </template>


<script setup>
import { ref, provide } from 'vue';

let keywords = ref([
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Express.js",
  "MongoDB",
  "SQL",
  "Git",
  "Webpack",
  "Babel",
  "Jest",
  // add more skills as needed
]);

provide('keywords', keywords);
</script>
