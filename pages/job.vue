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
      const options =s { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  }
}
</script>

<template>
  <v-container>
    <!-- Job Information -->
    <v-card color="#FFFFFF">
      <NuxtLink to="/">Back</NuxtLink>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <div class="content">
            <v-img :src="rowData.companyLogoUrl" alt="Company Logo" width="50%"></v-img>
            <v-card-subtitle>{{ rowData.companyName }} - {{ rowData.jobLocation }}</v-card-subtitle>
            <v-card-title>{{ rowData.jobTitle }}</v-card-title>
            <v-card-subtitle>Posted at: {{ formatDate(rowData.postedAt) }}</v-card-subtitle>
            <v-card-text>
              {{ rowData.jobDescription }}
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" :href="rowData.query" target="_blank">Job LinkedIn Page</v-btn>
            </v-card-actions>
          </div>
        </v-col>
      </v-row>

      <!-- Company Information -->
    </v-card>
        <v-card color="FFFFFF">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6">
            <div class="content">
              <v-card-subtitle>{{ rowData.companyName }}</v-card-subtitle>
              <v-card-title>{{ rowData.jobTitle }}</v-card-title>
            <v-card-title>{{ rowData.companyName }}</v-card-title>
            <v-card-subtitle>Industry: {{ rowData.jobIndustries }}</v-card-subtitle>
            <v-card-subtitle>Employees: {{ rowData.companyStaffCount }}</v-card-subtitle>
            <v-card-subtitle v-if="rowData.remoteAllowed">Remote Allowed</v-card-subtitle>
            <v-card-subtitle v-else>On-site</v-card-subtitle>
            <v-card-text>{{ rowData.companyDescription }}</v-card-text>
              <v-card-actions>
                <v-btn color="primary" :href="rowData.companyUrl" target="_blank">Company LinkedIn Page</v-btn>
              </v-card-actions>
            </div>
          </v-col>
        </v-row>
      </v-card>
          <!-- Job Poster Information -->
          <v-card color="FFFFFF">
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
              <div class="content">
                <v-card-subtitle>Job Poster Information</v-card-subtitle>
                 <v-card-title>Posted By: {{ rowData.jobPosterName }}</v-card-title>
                   <v-card-subtitle>Email: {{ rowData.jobPosterEmail }}</v-card-subtitle>
                   <v-card-subtitle>LinkedIn: <a :href="rowData.jobPosterProfileUrl" target="_blank">{{ rowData.jobPosterName }}</a></v-card-subtitle>
              </div>
            </v-col>
          </v-row>
        </v-card>

   <!-- Job Metrics -->
          <v-card color="FFFFFF">
            <v-row justify="center">
              <v-col cols="12" sm="8" md="6">
                <div class="content">
                  <v-card-title>Job Metrics</v-card-title>
                   <v-card-subtitle>Applicants: {{ rowData.applicantsCount }}</v-card-subtitle>
                   <v-card-subtitle>Views: {{ rowData.viewsCount }}</v-card-subtitle>
                </div>
              </v-col>
            </v-row>
          </v-card>
  </v-container>
</template>

<style scoped>
.content {
  max-width: 200ch;
  margin: auto;
}
</style>
