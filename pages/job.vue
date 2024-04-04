<script>
import { useGlobalState } from '~/composables/state';

export default {
  setup() {
    const globalState = useGlobalState();
    const rowData = globalState.value.rowData;
    return {
      rowData
    };
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  }
}
</script>
<template>
  <v-container>
    <v-card color="#F5F5F5" class="mb-5">
      <v-toolbar color="secondary" dark>
        <v-toolbar-title>{{ rowData.jobTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <NuxtLink to="/" class="white--text">Back</NuxtLink>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-img :src="rowData.companyLogoUrl" alt="Company Logo" contain height="300px"></v-img>
          </v-col>
          <v-col cols="12" sm="6">
            <h2>{{ rowData.companyName }}</h2>
            <p>{{ rowData.jobLocation }}</p>
            <p>Posted at: {{ formatDate(rowData.postedAt) }}</p>
            <p>{{ rowData.jobDescription }}</p>
            <v-btn color="primary" :href="rowData.query" target="_blank">Job LinkedIn Page</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card color="#F5F5F5" class="mb-5">
      <v-toolbar color="secondary" dark>
        <v-toolbar-title>Company Information</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <h2>{{ rowData.companyName }}</h2>
        <p>Industry: {{ rowData.jobIndustries }}</p>
        <p>Employees: {{ rowData.companyStaffCount }}</p>
        <p v-if="rowData.remoteAllowed">Remote Allowed</p>
        <p v-else>On-site</p>
        <p>{{ rowData.companyDescription }}</p>
        <v-btn color="primary" :href="rowData.companyUrl" target="_blank">Company LinkedIn Page</v-btn>
      </v-card-text>
    </v-card>

    <v-card color="#F5F5F5" class="mb-5">
      <v-toolbar color="secondary" dark>
        <v-toolbar-title>Job Poster Information</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <h2>Posted By: {{ rowData.jobPosterName }}</h2>
        <p>Email: {{ rowData.jobPosterEmail }}</p>
        <p>LinkedIn: <a :href="rowData.jobPosterProfileUrl" target="_blank">{{ rowData.jobPosterName }}</a></p>
      </v-card-text>
    </v-card>

    <v-card color="#F5F5F5" class="mb-5">
      <v-toolbar color="secondary" dark>
        <v-toolbar-title>Job Metrics</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <h2>Applicants: {{ rowData.applicantsCount }}</h2>
        <h2>Views: {{ rowData.viewsCount }}</h2>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style scoped>
.content {
  max-width: 200ch;
  margin: auto;
}
</style>
