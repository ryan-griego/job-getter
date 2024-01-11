<script>
import { useGlobalState } from '~/composables/state';

export default {
  setup() {
    const globalState = useGlobalState();
    const rowData = globalState.value.rowData;

    return {
      rowData
    };
  }
}
</script>

<template>
  <div>
    <v-card>
      <v-card-title>{{ rowData.jobTitle }}</v-card-title>
      <v-card-text>
        <div>{{ rowData.companyName }}</div>
        <div>{{ rowData.jobPosterName }}</div>
        <div>{{ rowData.jobId }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>
