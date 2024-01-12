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

<!-- <template>
    <NuxtLink to="/">Back</NuxtLink>
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
</template> -->

<template>

  <v-container>
    <!-- Job Information -->
    <v-card color="black">
         <NuxtLink to="/">Back</NuxtLink>
          <v-row>
          <v-col>
            <v-img :src="rowData.companyLogoUrl" alt="Company Logo" width="50%"></v-img>
          </v-col>
             <v-col>
      <v-card-title>{{ rowData.jobTitle }}</v-card-title>
      <v-card-subtitle>{{ rowData.companyName }} - {{ rowData.jobLocation }}</v-card-subtitle>
      <v-card-subtitle>Posted at: {{ formatDate(rowData.postedAt) }}</v-card-subtitle>
      <v-card-text>
        {{ rowData.jobDescription }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :href="rowData.applyUrl" target="_blank">Apply Now</v-btn>

      </v-card-actions>
      </v-col>
      </v-row>
    </v-card>

    <!-- Company Information -->
    <v-card color="black">
      <v-row>

        <v-col>
          <v-card-title>{{ rowData.companyName }}</v-card-title>
          <v-card-subtitle>Industry: {{ rowData.jobIndustries }}</v-card-subtitle>
          <v-card-subtitle>Employees: {{ rowData.companyStaffCount }}</v-card-subtitle>
          <v-card-subtitle v-if="rowData.remoteAllowed">Remote Allowed</v-card-subtitle>
          <v-card-subtitle v-else>On-site</v-card-subtitle>
          <v-card-text>{{ rowData.companyDescription }}</v-card-text>
        </v-col>
      </v-row>
    </v-card>

    <!-- Job Poster Information -->
    <v-card color="black">
      <v-card-title>Posted By: {{ rowData.jobPosterName }}</v-card-title>
      <v-card-subtitle>Email: {{ rowData.jobPosterEmail }}</v-card-subtitle>
      <v-card-subtitle>LinkedIn: <a :href="rowData.jobPosterProfileUrl" target="_blank">{{ rowData.jobPosterName }}</a></v-card-subtitle>
    </v-card>

    <!-- Job Metrics -->
    <v-card color="black">
      <v-card-title>Job Metrics</v-card-title>
      <v-card-subtitle>Applicants: {{ rowData.applicantsCount }}</v-card-subtitle>
      <v-card-subtitle>Views: {{ rowData.viewsCount }}</v-card-subtitle>
    </v-card>
  </v-container>
</template>
