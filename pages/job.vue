<script>
import { useGlobalState } from '~/composables/state';

export default {
  data: () => ({
        showCompanyDescription: false,
        showJobDescription: false,
  }),
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
     formatUrl(url) {
      return url.includes('http://') || url.includes('https://') ? url : `http://${url}`;
    },
  }
}
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="6" class="px-5 mt-10">
        <NuxtLink to="/">
  <v-btn color="rgb(28, 255, 206)" class="mb-3">
    <v-icon left>mdi-arrow-left</v-icon> Back
  </v-btn>
</NuxtLink>

      <!-- About the Job -->

    <v-card color="rgb(28, 255, 206)" class="mb-5 mx-auto" max-width="100%" rounded>
      <!-- <v-toolbar color="rgb(28, 255, 206)" dark>
        <v-toolbar-title>About the Job</v-toolbar-title>
      </v-toolbar> -->
      <v-card
        class="mx-auto"
        max-width="100%"
      >
        <v-card-title>
        <h2>{{ rowData.jobTitle }}</h2>
        </v-card-title>
        <v-card-subtitle>
        <p>{{ rowData.companyName }}</p>
        <p>Status: {{ rowData.status }}</p>
        </v-card-subtitle>
        <!-- <v-card-text>

          <p><v-icon left>mdi-briefcase</v-icon> workpalcetype-{{ rowData.workplaceType }} - jobtype-{{rowData.jobType}} - experience{{ rowData.experienceLevel }}</p>

          <p>{{ rowData.workplaceType }}</p>
          <p v-if="rowData.experienceLevel">{{ rowData.experienceLevel }}</p>
          <p><v-icon left>mdi-eye</v-icon> Views: {{ rowData.viewsCount }}</p>
          <p>{{ rowData.applicantsCount }} applicants as of {{ formatDate(rowData.postedAt) }}</p>
        </v-card-text> -->
        <v-card-text>

          <span>As of {{ formatDate(rowData.postedAt) }}, there have been:</span>
          <v-spacer></v-spacer>
          <span>{{ rowData.applicantsCount }} applicants</span><br>
          <span>{{ rowData.viewsCount }} views </span>
        </v-card-text>

        <v-card-text class="d-flex align-center">
  <v-icon left>mdi-briefcase</v-icon>
  <span v-if="rowData.workplaceType">&nbsp;&nbsp;&nbsp;{{ rowData.workplaceType }} - </span>
  <span v-if="rowData.jobType">  &nbsp;&nbsp;&nbsp;{{ rowData.jobType }}&nbsp;&nbsp;&nbsp;- </span>
  <span v-if="rowData.experienceLevel">&nbsp;&nbsp;&nbsp;{{ rowData.experienceLevel }}</span>
  <!-- <p> Matching Keywords -> {{ rowData.matchingKeywords }}</p> -->

</v-card-text>
        <v-card
          color="#e6e6e6"
          max-width="320"
          class="ml-5"
        >
        <v-card-text v-if="rowData.jobPosterEmail">
          <h2>Posted by:</h2>
          <h2 v-if="rowData.jobPosterName">{{ rowData.jobPosterName }}</h2>
          <p v-if="rowData.jobPosterEmail">{{ rowData.jobPosterEmail }}</p>
          <v-btn v-if="rowData.jobPosterProfileUrl" color="primary" :href="rowData.jobPosterProfileUrl" target="_blank">Job Poster Profile Page</v-btn>
        </v-card-text>
      </v-card>
      <v-btn v-if="rowData.applyUrl" color="primary" :href="rowData.applyUrl" target="_blank" class="ml-4">Apply URL</v-btn>

      <v-card-actions>
      <v-btn
        color="blue-lighten-2"
        text="View Job Description"
        @click="showJobDescription = !showJobDescription"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :icon="showJobDescription ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="showJobDescription = !showJobDescription"
      ></v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="showJobDescription">
          <v-divider></v-divider>
          <v-card-text>
          {{ rowData.jobDescription }}
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-card>
</v-col>

    <v-col cols="6" class="px-5 mt-10">
      <!-- <NuxtLink to="/"></NuxtLink> -->
      <!-- About the Company -->
      <v-card color="rgb(28, 255, 206)" class="mb-5 mx-auto" max-width="100%">
        <!-- <v-toolbar color="secondary" dark>
        <v-toolbar-title>About the Company</v-toolbar-title>
      </v-toolbar> -->
        <v-card
        class="mx-auto"
        max-width="100%"
        >
          <v-row>
            <v-col cols="auto">
              <v-img
                height="100px"
                width="100px"
                class="ml-2 mt-2"
                :src="rowData.companyLogoUrl"
                cover
              ></v-img>
            </v-col>
            <v-col class="align-self-center">
              <v-card-title>
                <h2>{{ rowData.companyName }}</h2>
              </v-card-title>
            </v-col>
          </v-row>
          <v-card-subtitle>
            <p><v-icon left>mdi-domain</v-icon>  {{ rowData.companyStaffCount }} employees - {{ rowData.jobIndustries }}</p>
            <!-- <p><v-icon left>mdi-domain</v-icon> {{ rowData.jobIndustries }}</p> -->
            <!-- <p>Job Functions: {{ rowData.jobFunctions }}</p> -->
            </v-card-subtitle>
            <v-btn color="primary" :href="rowData.companyUrl" target="_blank" class="ml-4">Company LinkedIn Page</v-btn>
            <v-btn v-if="rowData.companyOfficialUrl" color="primary" :href="formatUrl(rowData.companyOfficialUrl)" target="_blank" class="ml-4">Website</v-btn>            <v-card-actions>

              <v-btn
                color="blue-lighten-2"
                text="View Company Description"
                @click="showCompanyDescription = !showCompanyDescription"
              ></v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :icon="showCompanyDescription ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="showCompanyDescription = !showCompanyDescription"
              ></v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="showCompanyDescription">
                <v-divider></v-divider>
                <v-card-text>
                {{ rowData.companyDescription }}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

.job-title {
  font-size: 2.5rem;
  color: black;
}
</style>
