<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
    <p>{{ message }}</p>
       <br/>
      <iframe
        width="100%"
        height="315"
        :src="videoUrl"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <br />
      <v-btn
        color="green"
        size="large"
        @click="closeModal"
      >
        Close
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Reactive state to control modal visibility
const show = ref(true);

// Define component props
const props = defineProps({
  message: String, // You can remove this if not needed
  videoUrl: {
    type: String,
    default: 'https://www.youtube.com/embed/mQazxb70QTA?si=IcD30_CL7ylGKPMI'
  }
});

// Define emitted events
const emits = defineEmits(['close']);

// Function to close the modal
const closeModal = () => {
  show.value = false;
  emits('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 90%;
  max-width: 640px; /* Adjusted to fit the YouTube embed width */
}

iframe {
  border-radius: 5px;
}
</style>
