<template>
  <!-- <v-app class="app-background">
    <div class="d-flex"> -->
  <!-- <v-navigation-drawer model-value="true" class="flex-shrink-0"
        image="https://www.ryangriego.com/images/home-background-ryan-griego.jpeg">
        <v-list-item title="Job Getter" subtitle="navigation" base-color="white"></v-list-item>
        <v-divider class="mt-10"></v-divider>
        <v-list-item link title="Home" base-color="white"></v-list-item>
        <v-list-item link base-color="white">
          <NuxtLink to="/" class="white--text">Keywords</NuxtLink>
        </v-list-item>
        <v-list-item link title="Analytics" base-color="white"></v-list-item>
        <v-list-item link title="Feature Request" base-color="white"></v-list-item>
      </v-navigation-drawer> -->
  <v-container fluid pa-0 class="app-background">
    <!-- <div className="overlay-intro"></div> -->
    <div>
      <v-row class="outside-table d-flex align-end">
        <v-col cols="2" class="d-flex align-center no-pad">
          <img alt="Job Getter logo" height="auto"
            src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1721611296/logo-in-use-transformed_qqmga8.png"
            style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
            width="300">
        </v-col>
        <v-col cols="1" class="d-flex align-end"></v-col>
        <v-col cols="3" class="d-flex align-end mb-3">
  <v-bottom-sheet v-model="sheet">
    <template v-slot:activator="{ props }">
      <div class="text-center">
        <v-btn
          v-bind="props"
          color="green"
          size="x-large"
          text="Get it"
        ></v-btn>
      </div>
    </template>
    <v-list>
      <v-list-subheader>Actions</v-list-subheader>
      <v-list-item
        v-for="tile in tiles"
        :key="tile.title"
        :prepend-avatar="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
        :title="tile.title"
        @click="sheet = false;takeAction(tile.title)"
      ></v-list-item>
    </v-list>
  </v-bottom-sheet>
        </v-col>
        <v-col cols="6" class="d-flex justify-end no-pad">
          <v-slide-x-reverse-transition>
            <div v-if="showFilters" class="overlay">
              <v-select v-model="filters.status" :items="statuses" label="View by Status" class="flex-grow-1"
                style="min-width: 200px;"></v-select>
                <v-checkbox v-model="filters.isRemote" label="Is remote" class="pr-4"></v-checkbox>
                <v-btn outlined class="mx-2 my-2" text
                @click="resetFilters">Clear Filters</v-btn>
            </div>
          </v-slide-x-reverse-transition>
          <v-btn
          class="ma-2"
          color="green"
          icon="mdi-filter-menu-outline"
          @click="showFilters = !showFilters"
          ></v-btn>
        </v-col>
      </v-row>
      <div>
        <p class="p-1 outside-table">Total # of jobs {{ numberOfJobs }}</p>
      </div>
      <Table @open-email-modal="openEmailModal" @open-add-contact-modal="openAddContactModal" @send-email="sendEmail" @get-email="getEmail" @update-row="updateRow"
        @delete-row="deleteRow" :jobs="jobs_filtered" :isRemote="filters.isRemote" class="mb-4" ref="main_table" />
      <v-dialog v-model="isEmailDialogOpen" width="auto" scrollable>
        <template v-slot:default="{ isActive }">
          <v-card prepend-icon="mdi-email-fast-outline" title="Send Email(s)" dark>
            <v-divider class="mt-3"></v-divider>
            <v-card-text class="px-4" style="height: 400px;">
              <v-radio-group v-model="dialog" column dark>
                <v-radio label="Recently Applied" value="just-applied"></v-radio>
              </v-radio-group>



              <v-checkbox
      v-model="selectAll"
      label="Send to All"
      @change="toggleSelectAll"
    />

    <v-checkbox-group v-model="selectedEmails" @change="handleCheckboxChange">
      <v-checkbox
        v-for="email in rowData.jobPosterEmail"
        :key="email"
        :label="email"
        :value="email"
      />
    </v-checkbox-group>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text="Close" @click="isActive.value = false"></v-btn>
              <v-spacer></v-spacer>
              <v-btn color="surface-variant" text="Send" variant="flat"
                @click="isActive.value = false; sendEmail(selectedEmails)"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog v-model="isAddContactModalOpen" width="auto" scrollable>
        <template v-slot:default="{ isActive }">
          <v-card prepend-icon="mdi-email-fast-outline" title="Add Hiring Contact" dark>
            <v-divider class="mt-3"></v-divider>
            <v-card-text class="px-4">
            <v-text-field
            v-model="hiringContactName"
            label="Name"
            required
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="hiringContactEmail"
            label="Email"
            required
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="hiringContactLinkedInUrl"
            label="LinkedIn"
            required
            outlined
            dense
          ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text="Close" @click="isActive.value = false"></v-btn>
              <v-spacer></v-spacer>
              <v-btn color="surface-variant" text="Send" variant="flat"
                @click="isActive.value = false; addHiringContact()"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog v-model="isAddJobDialogOpen" width="50%" scrollable>
        <template v-slot:default="{ isActive }">
          <v-card prepend-icon="mdi-email-fast-outline" title="Add Job" dark>
            <v-divider class="mt-3"></v-divider>
            <v-card-text class="px-4">
              <v-form ref="form">
                <v-text-field v-model="job.jobId" label="Job ID"></v-text-field>
                <v-text-field v-model="job.jobTitle" label="Job Title*"
                  :rules="[v => !!v || 'Job Title is required']"></v-text-field>
                <v-text-field v-model="job.status" label="Status"></v-text-field>
                <v-text-field v-model="job.companyName" label="Company Name*"
                  :rules="[v => !!v || 'Company name is required']"></v-text-field>
                <v-text-field v-model="job.companyOfficialUrl" label="Company Official Url"></v-text-field>
                <v-text-field v-model="job.jobLocation" label="Job Location"></v-text-field>
                <v-text-field v-model="job.postedAt" label="Posted At"></v-text-field>
                <v-text-field v-model="job.appliesClosedAt" label="Applies Closed At"></v-text-field>
                <v-text-field v-model="job.timestamp" label="Date Added"></v-text-field>
                <v-text-field v-model="job.jobDescription" label="Job Description"></v-text-field>
                <v-text-field v-model="job.matchingKeywords" label="Matching Keywords"></v-text-field>
                <v-text-field v-model="job.workplaceType" label="Workplace Type"></v-text-field>
                <v-text-field v-model="job.jobPosterProfileUrl" label="Job Poster Profile URL"></v-text-field>
                <v-text-field v-model="job.jobPosterName" label="Job Poster Name"></v-text-field>
                <v-text-field v-model="job.jobPosterEmail" label="Job Poster Email"></v-text-field>
                <v-text-field v-model="job.companyLogoUrl" label="Company Logo URL"></v-text-field>
                <v-text-field v-model="job.applyUrl" label="Apply URL"></v-text-field>
                <v-text-field v-model="job.viewsCount" label="Views Count"></v-text-field>
                <v-text-field v-model="job.companyStaffCount" label="Company Staff Count"></v-text-field>
                <v-text-field v-model="job.companyDescription" label="Company Description"></v-text-field>
                <v-text-field v-model="job.jobIndustries" label="Job Industries"></v-text-field>
                <v-text-field v-model="job.source" label="Source"></v-text-field>
                <v-text-field v-model="job.jobFunctions" label="Job Functions"></v-text-field>
                <v-text-field v-model="job.remoteAllowed" label="Remote Allowed"></v-text-field>
                <v-text-field v-model="job.jobType" label="Job Type"></v-text-field>
                <v-text-field v-model="job.applicantsCount" label="Applicants Count"></v-text-field>
                <v-text-field v-model="job.experienceLevel" label="Experience Level"></v-text-field>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text="Close" @click="isActive.value = false"></v-btn>
              <v-spacer></v-spacer>
              <v-btn color="surface-variant" text="Submit" variant="flat" @click="submitForm()"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
  </v-container>
  <!-- </div>
  </v-app> -->
</template>

<style scoped>
/* .app-background {
  background: url('https: //www.ryangriego.com/images/home-background-ryan-griego.jpeg') !important;
} */
.overlay {
  position: unset;
  /* top: 0;
  right: 140; */
  z-index: 1;
}
</style>

<script>
import Table from '../components/Table.vue';
// Dark mode
// import 'tabulator-tables/dist/css/tabulator_midnight.min.css';
import 'tabulator-tables/dist/css/tabulator.min.css';

  import { ref } from 'vue';

  // Define a ref to store HTML content
  const htmlContent = ref('');

export default {
  data: () => ({
    filters: {
        isRemote: false,
        status: null,
      },
      statuses: ['Sent', 'Applied'],
    isEmailDialogOpen: false,
    isAddContactModalOpen: false,
    hiringContactName: '',
    hiringContactEmail: '',
    hiringContactLinkedInUrl: '',
    selectedEmails:[],
    isAddJobDialogOpen: false,
    dialog: '',
    selectAll: '',
    toggleSelectAll: '',
    showFilters: false,
    rowData: {},
    sheet: false,
      tiles: [
        { img: 'keep.png', title: 'Run Scraper' },
        { img: 'inbox.png', title: 'Fetch Jobs' },
        { img: 'hangouts.png', title: 'Add Job' },
      ],
    jobs: [],
    valid: true,
    job: {
      jobId: '',
      jobTitle: '',
      status: '',
      companyName: '',
      companyUrl: '',
      jobLocation: '',
      jobDescription: '',
      workplaceType: '',
      jobPosterName: '',
      jobPosterEmail: '',
      companyLogoUrl: '',
      applyUrl: '',
      viewsCount: '',
      companyStaffCount: '',
      companyDescription: '',
      jobIndustries: '',
      jobFunctions: '',
      remoteAllowed: '',
      jobType: '',
      applicantsCount: '',
      experienceLevel: '',
      source: '',
    },
  }),

  async setup() {


    const { data: jobs } = await useFetch("/api/jobs");
    jobs.value = toRaw(jobs.value);
    return {
      jobs
    }
  },
  computed: {
    numberOfJobs() {
      return this.jobs.jobs.length;
    },
    jobs_filtered() {
        return this.jobs.jobs.filter(job => {
            let statusMatch = true;
            let remoteMatch = true;

            if (this.filters.status) {
              statusMatch = job.status === this.filters.status;
            }

            if (this.filters.isRemote) {
              remoteMatch = job.remoteAllowed === true;
            }
            return statusMatch && remoteMatch;
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    },

  created() {
    this.initialize()
  },
  watch: {
    'filters.isRemote': {
      handler() {
        this.updateTable();
      },
      immediate: false,
    },
    'filters.status': {
      handler() {
        this.updateTable();
      },
      immediate: false,
    },
  },
  methods: {
    initialize() {
    },

    handleCheckboxChange(event) {
        const email = event.target.value; // Get the value from the checkbox event
        const index = this.selectedEmails.indexOf(email); // Check if the email is already selected

        if (index > -1) {
            // If the email is found in the array, remove it
            this.selectedEmails.splice(index, 1);
        } else {
            // If the email is not found, add it
            this.selectedEmails.push(email);
        }

        console.log("Selected Emails:", this.selectedEmails);
    },

    takeAction(action){
      if(action === 'Run Scraper') {
        this.runJobScraper();
      } else if(action === 'Fetch Jobs') {
        this.fetchNewJobs();
      } else if(action === 'Add Job') {
        this.openAddJobModal();
      }
      console.log('take action - log the action', action);
    },
    async submitForm() {

      const currentDate = new Date();
      const isoString = currentDate.toISOString();
      this.timestamp = currentDate.toISOString();
      let job = this.job;
      job.timestamp = currentDate.toISOString();
      let generateId = Number(Math.floor(Math.random() * 9000000000) + 1000000000);
      job.jobId  = generateId;
      const isValid = this.$refs.form.validate();

      if (isValid && this.job.jobTitle && this.job.companyName) {
        const { data: jobs } = await useFetch("/api/addjobs", {
          method: "POST",
          body: {
            data: job,
            type: 'single',
          },
        });
      }
    },
    updateTable() {
      console.log("got into updateDTable");
      setTimeout(() => {
        this.$refs.main_table.updateTableData();
      }, 100);
    },
    resetFilters() {
      this.filters = {
        isRemote: false,
        status: null,
      };
      this.$nextTick(() => {
        this.updateTable();
      });
    },

    notify(reason) {
      switch (reason) {
        case "fail-scraper":
          useNuxtApp().$toast.error('JobScraper failed');
          break;
        case "success-scraper":
          useNuxtApp().$toast.success('JobScraper succeeded');
          break;
        case "fail-update-row":
          useNuxtApp().$toast.error('Update row failed');
          break;
        case "fail-fetch-new-jobs":
          useNuxtApp().$toast.error('Fetch new jobs failed');
          break;
        case "fail-get-email":
          useNuxtApp().$toast.error('Get email failed');
          break;
        case "fail-send-email":
          useNuxtApp().$toast.error('Send email failed');
          break;
        case "success-send-email":
          useNuxtApp().$toast.success('Email sent');
          break;
          // DO
        case "success-get-email":
          useNuxtApp().$toast.success('Email received');
          break;
        default:
          useNuxtApp().$toast.error('Notify by click - test');
      }
    },

    async runJobScraper() {
      try {
        const { data, error } = await useFetch("/api/runjobscraper", {
          method: "POST",
        });
          this.notify('success-scraper');
      } catch (error) {
        console.error('Error during fetch operation in runJobScraper:', error);
        this.notify('fail-scraper');
      }
    },

    async updateRow(item) {
      item = toRaw(item);
      const { data, error } = await useFetch("/api/updaterow", {
        method: "POST",
         body: {
             'jobId': item.jobId,
             'companyOfficialUrl': item.companyOfficialUrl,
             'jobPosterName': item.jobPosterName,
             'jobPosterEmail': item.jobPosterEmail,
             'status': item.status,
            }
      });
      if(error.value === 'error') {
        this.notify('fail-update-row');
      } else {
        this.updateTable();
      }
    },

    async deleteRow(item) {
        item = toRaw(item);
        const { data, error } = await useFetch("/api/deleterow", {
          method: "POST",
          body: {
              'jobId': item.jobId
              }
        });

        if(error.value === 'error') {
          this.notify('fail-delete-row');
        } else {
          // NEED TO ADD SUCCESS NOTIFICATION HERE
          console.log("deleteRow was a success");
        }
    },

    async fetchNewJobs() {
      const { data, error } = await useFetch("/api/fetchnewjobs", {
        method: "POST",
      });
      if(data.value.output) {
        let output = data.value.output;
        console.log('log the output in fetchNewJobs', output);
        let urls = output.match(/https?:\/\/[^\s]+/g);
        let lastUrl = urls[urls.length -1];
        const getJobsJson = await fetch(lastUrl);
        let jobsData = await getJobsJson.json();
        console.log("log the jobsData", jobsData);
        jobsData = jobsData.map(job => {
  try {
    console.log("log the jobsData", jobsData);
    if ((!job.companyOfficialUrl || job.companyOfficialUrl === '') && job.companyName && job.companyDescription) {
      let companyName = job.companyName
        .replace(/\s/g, '')
        .replace(/[^\w\s]/gi, '')
        .replace(/llc/gi, '')
        .replace(/inc/gi, '');
      let companyUrl = `${companyName}.com`;
      job.companyOfficialUrl = companyUrl.toLowerCase();
    }

    // Change jobPosterName from string to array
    if(job.jobPosterName) {
        job.jobPosterName = [`${job.jobPosterName}`];
    } else {
        job.jobPosterName = [];
    }

    let keywords = [
      "PHP", "Nuxt.js", "Next.js", "JavaScript", "TypeScript", "React", "Vue",
      "HTML", "CSS", "Node.js", "Express.js", "MongoDB", "SQL", "Git",
      "Webpack", "Babel", "GSAP", "MySQL", "Tailwind CSS",
    ];

    let jobDescription = job.jobDescription || ''; // Handle cases where jobDescription might be undefined

    let keywordCounts = keywords.reduce((counts, keyword) => {
      let regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      let matches = jobDescription.match(regex);
      if (matches) {
        counts[keyword] = matches.length;
      }
      return counts;
    }, {});

    return {
      ...job,
      companyOfficialUrl: job.companyOfficialUrl,
      status: 'Applied',
      jobPosterEmail: [],
      source: 'LinkedIn'
    };

  } catch (error) {
    console.error("Error processing job:", job, error);
    return null; // Skip this job and return null
  }
}).filter(job => job !== null); // Remove null entries from the resulting array

        console.log("log the jobsData that was scraped", jobsData);
        let quantityType = '';
        console.log("log the length of the jobsData", jobsData.length);
        if(jobsData.length > 1) {
           quantityType = 'multi';
        } else {
          quantityType = 'single';
        }


        console.log("log the jobsData before going to add jobs", jobsData);
        console.log("AND THE quantityType", quantityType);

          const { data: jobs } = await useFetch("/api/addjobs", {
            method: "POST",
            body: {
              data: jobsData,
              type: quantityType,
            },
          });

          if(error.value === 'error') {
            this.notify('fail-fetch-new-jobs');
            //return an error message
          } else {
            this.updateTable();
          }
      }
    },
    // Might not need this function VV

    async getEmail(item) {
      item = toRaw(item);
        try {
          const response = await fetch(`/api/getemail?domain=${item.companyOfficialUrl}&full_name=${item.jobPosterName}`);
          console.log('log the response', response);
          let data = await response.json();
          console.log("log the data", data);
          console.log("log the data", data.data.email);


        if (!response.ok || !data.data.email) {
            this.notify('fail-get-email');
          throw new Error('HTTP error ' + response.status);
        }
        if(data.data.email) {
          //Update the data in the MongoDB with the correct email
          const { status, error } = await useFetch("/api/updatejobposteremail", {
            method: "POST",
            body: {
             'jobId': item.jobId,
             'email': data.data.email,
            }
            });

            if(error.value === 'error') {
              this.notify('fail-get-email');
            } else {
              this.notify('success-get-email');
                setTimeout(() => {
                  this.updateTable();
                }, 4000);


            }
          const vueInstance = this;
          // Need to refresh the tabulator show the data
        }
      } catch (error) {
        // return an error message
      }
    },

    //
    // GET COMPANY URL
    //

    openEmailModal(rowData) {
      this.rowData = toRaw(rowData);
      console.log("log the row data in openEmailModal", this.rowData);
      this.isEmailDialogOpen = true;
    },

    openAddContactModal(rowData) {
      console.log("got into openAddContactModal");
      this.rowData = toRaw(rowData);
      this.isAddContactModalOpen = true;
    },

    openAddJobModal() {
      this.isAddJobDialogOpen = true;
    },

    async loadEmailTemplate(templateName) {
      try {
        const response = await fetch(`/email-templates/${templateName}`);
        if (!response.ok) {
          throw new Error('Failed to load email template');
        }
        htmlContent.value = await response.text();
      } catch (error) {
        console.error(error);
      }
    },

    async addHiringContact() {
        // need to pass in the JobId and this.hiringContactName
        let jobId = this.rowData.jobId;
        let jobPosterName = this.hiringContactName;
        let jobPosterEmail = this.hiringContactEmail;
        let jobPosterProfileUrl = this.jobPosterProfileUrl ? this.jobPosterProfileUrl: '';

        console.log('got into addHiringContact and log jobPosterName', jobPosterName);

        console.log('log jobId', jobId);

            let data = {jobId, jobPosterName, jobPosterEmail, jobPosterProfileUrl};

            //const { status, error } = await useFetch("/api/updaterow", {
            const { status, error } = await useFetch("/api/addcontact", {
              method: "POST",
              body: data
            });
            if(error.value === 'error') {
          } else {
            this.updateTable();
          }



    },



    async sendEmail(eventData) {
      console.log("log this.selectedEmails!!!!!! IN SENDEMAIL", this.selectedEmails);


      const { type, payload } = eventData || {};

      console.log("log the eventData!!!!!!!!!!!!!!!!!!!!! IN SENDEMAIL", eventData);

      console.log("log the rowData!!!!!!!!!!!!!!!!!!!!! IN SENDEMAIL", this.rowData);
      // this.selectedEmails = ['ryangriego@gmail.com', 'ryangriego@gmail.com'];
      console.log("log this this.selectedEmails", this.selectedEmails);
      // return;

      // Determine if `eventData` is an object or if it is not provided (direct call)
      let item = this.rowData;

      if (this.rowData) {
        // Handle case where `sendEmail` is called directly (no eventData)
        item = toRaw(this.rowData);
      } else {
        // If eventData is provided, use item from eventData
        item = toRaw(payload);
      }

      console.log("log the item FIRST", item);


      if(this.selectedEmails.length === 1 && item.jobPosterName.length === 1) {
        // Send to only one email
        console.log("ONLY SENDING TO 1 EMAIL");
              console.log("log the item", item);
     // let html = ""
      // let companyUrl = item.companyUrl;
      // let companyName = item.companyName.replace(/[^\w\s]/gi, '');
      let companyName = item.companyName;
      // let companyLogoUrl = item.companyLogoUrl ? item.companyLogoUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';
      let jobTitle = item.jobTitle;
      // let jobLocation = item.jobLocation;
      // let postedAt = item.postedAt;
      // let jobPosterName = item.jobPosterName ? item.jobPosterName.split(" ")[0] : 'Hiring Manager';
          //   let jobPosterName =
          // Array.isArray(item.jobPosterName) && typeof item.jobPosterName[0] === 'string'
          // ? item.jobPosterName[0].split(" ")[0]
          // : 'Hiring Manager';

      // let jobPosterEmail = item.jobPosterEmail ? 'ryangriego@gmail.com' : 'ryangriego@gmail.com';
     // let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';
      let QRCodeUrl = item.qrCodeUrl ? item.qrCodeUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';
      // let msg = '';

      console.log("GOT HERE 1");


      let templateName = '';

      if (this.dialog === 'just-applied' || type === 'just-applied') {
        templateName = 'recently-applied.html';
      }


      await this.loadEmailTemplate(templateName);

      // console.log("log the QRCodeUrl", QRCodeUrl);
      // console.log("log the item.qrCodeUrl", item.qrCodeUrl);
      console.log("log the item.jobPosterName!!", item.jobPosterName);
      // return;
     let html = htmlContent.value;

     // For 1 person
     console.log("log the item.jobPosterName[0] before split", item.jobPosterName[0]);
    //  html = html.replace('${jobPosterName}', (item.jobPosterName[0] ? item.jobPosterName[0].split(' ') : 'Hiring Manager'));

      html = html.replace('${jobTitle}', item.jobTitle || '');
      html = html.replace('${QRCodeUrl}', item.qrCodeUrl || '');

   //  let jobPosterEmail = item.jobPosterEmail || 'ryangriego@gmail.com';
     //let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';

      // let jobPosterEmail = 'ryangriego@gmail.com';
      let jobPosterName = item.jobPosterName[0].split(' ');
      jobPosterName = jobPosterName[0];
      // jobPosterName = 'ryangriego@gmail.com';
      console.log("log the job PosterNAMEEEEEEE", jobPosterName);
           html = html.replace('${jobPosterName}', (jobPosterName ? jobPosterName : 'Hiring Manager'));

      let jobPosterEmail = item.jobPosterEmail[0];
      jobPosterEmail = 'ryangriego@gmail.com';
      // Replace placeholder in the HTML
            html = html.replace('{{ jobPosterEmail }}', jobPosterEmail);
        // grace.lee@ringcentral.com
      // html = html.replace('{{ jobPosterEmail }}', jobPosterEmail);
      console.log("Final HTML ContentRIGHTIEIFJAOIJEFOIJ", html); // Log the final HTML
      //      let jobPosterEmail = item.jobPosterEmail ? 'ryangriego@gmail.com' : 'ryangriego@gmail.com';

              const msg = {
                "personalizations": [
                  {
                    to: [
                      {
                        email: `${jobPosterEmail}`,
                        name: `${jobPosterName}`
                      }
                    ]
                  }
                ],
                "from": {
                  email: "ryan@ryangriego.com",
                  name: `Ryan Griego / ${jobTitle}`
                },
                "subject": `👋 Recently applied for ${jobTitle} at ${companyName} - thank you for accepting my application`,
                "content": [
                  {
                    type: "text/plain",
                    value: `👋 Recently applied for ${jobTitle} at ${companyName} - thank you for accepting my application`
                  },
                  {
                    type: "text/html",
                    value: html
                  }
                ],
              };
          //  }


      const { data, status, error } = await useFetch("/api/sendgrid", {
        method: "POST",
        body: msg
      });
      if(error.value === 'error') {
        this.notify('fail-send-email');
      } else {
            this.notify('success-send-email');
            item = {...item, status: 'Sent'};
            console.log("log the item going into update row in sendEmail", item);
            const { status, error } = await useFetch("/api/updaterow", {
              method: "POST",
              body: item
            });
            if(error.value === 'error') {
          } else {
            this.updateTable();
          }
        }
      }

    //  this.selectedEmails = ['ryangriego@gmail.com', 'ryangriego@gmail.com'];

//      if(this.selectedEmails.length > 1) {
//         // SEND TO MULTIPLE EMAILS
//         console.log("SENDING TO MULTIPLE EMAILS");
//       let companyName = item.companyName;
//       let jobTitle = item.jobTitle;


//       // let jobPosterEmail = item.jobPosterEmail ? 'ryangriego@gmail.com' : 'ryangriego@gmail.com';
//      // let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';
//       let QRCodeUrl = item.qrCodeUrl ? item.qrCodeUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';

//       let templateName = '';

//       if (this.dialog === 'just-applied' || type === 'just-applied') {
//         templateName = 'recently-applied.html';
//       }


//       await this.loadEmailTemplate(templateName);





//       console.log("log the item.jobPosterName!!", item.jobPosterName);
//       //return;
//      let html = htmlContent.value;

//      // For 1 person
//      console.log("log the item.jobPosterName[0] before split", item.jobPosterName[0]);
//      let jobPosterName = item.jobPosterName[0] ? item.jobPosterName[0] : 'ryangriego@gmail.com'
//      html = html.replace('${jobPosterName}', (item.jobPosterName[0] ? item.jobPosterName[0].split(' ')[0] : 'Hiring Manager'));

//       html = html.replace('${jobTitle}', item.jobTitle || '');
//       html = html.replace('${QRCodeUrl}', item.qrCodeUrl || '');

//    //  let jobPosterEmail = item.jobPosterEmail || 'ryangriego@gmail.com';
//      //let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';

//       // let jobPosterEmail = 'ryangriego@gmail.com';
//       // let jobPosterName = 'Roger';



//             // LOOP THROUGH EACH OF THE SELECTED EMAILS AND SEND THEM

//       //return;
//  //     for(let i = 0; i <= this.selectedEmails.length; i++) {
//        // let jobPosterEmail = this.selectedEmails[i] ? this.selectedEmails[i] : 'ryangriego@gmail.com';
//        let jobPosterEmail = 'ryangriego@gmail.com';
//           console.log("log ge the row DATAAAAAAAAAAAAA", this.rowData);

//             html = html.replace('{{ jobPosterEmail }}', jobPosterEmail[0]);

//               const msg = {
//                 "personalizations": [
//                   {
//                     to: [
//                       {
//                         email: `${jobPosterEmail[0]}`,
//                         //email: `${this.selectedEmails[i]}`,
//                         name: `${jobPosterName[0]}`
//                       }
//                     ]
//                   }
//                 ],
//                 "from": {
//                   email: "ryan@ryangriego.com",
//                   name: `Ryan Griego / ${jobTitle}`
//                 },
//                 "subject": `👋 Recently applied for ${jobTitle} at ${companyName} - thank you for accepting my application`,
//                 "content": [
//                   {
//                     type: "text/plain",
//                     value: `👋 Recently applied for ${jobTitle} at ${companyName} - thank you for accepting my application`
//                   },
//                   {
//                     type: "text/html",
//                     value: html
//                   }
//                 ],
//               };
//           //  }


//       const { data, status, error } = await useFetch("/api/sendgrid", {
//         method: "POST",
//         body: msg
//       });
//       if(error.value === 'error') {
//         this.notify('fail-send-email');
//       } else {
//             this.notify('success-send-email');
//             item = {...item, status: 'Sent'};
//             console.log("log the item going into update row in sendEmail", item);
//             const { status, error } = await useFetch("/api/updaterow", {
//               method: "POST",
//               body: item
//             });
//             if(error.value === 'error') {
//           } else {
//             this.updateTable();
//           }
//         }

//     //  }

//       console.log("got tot he end of the meail loop");
//           return;
//       // Replace placeholder in the HTML
//       html = html.replace('{{ jobPosterEmail }}', jobPosterEmail);


//       }


        // BELOW WAS COPY/PASTED INTO THE SINGLE EMAIL STATEMENT ABOVE


      console.log("log the item", item);
     // let html = ""
      // let companyUrl = item.companyUrl;
      // let companyName = item.companyName.replace(/[^\w\s]/gi, '');
      let companyName = item.companyName;
      // let companyLogoUrl = item.companyLogoUrl ? item.companyLogoUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';
      let jobTitle = item.jobTitle;
      // let jobLocation = item.jobLocation;
      // let postedAt = item.postedAt;
      // let jobPosterName = item.jobPosterName ? item.jobPosterName.split(" ")[0] : 'Hiring Manager';
          //   let jobPosterName =
          // Array.isArray(item.jobPosterName) && typeof item.jobPosterName[0] === 'string'
          // ? item.jobPosterName[0].split(" ")[0]
          // : 'Hiring Manager';

      // let jobPosterEmail = item.jobPosterEmail ? 'ryangriego@gmail.com' : 'ryangriego@gmail.com';
     // let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';
      let QRCodeUrl = item.qrCodeUrl ? item.qrCodeUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';
      // let msg = '';



      let templateName = '';

      if (this.dialog === 'just-applied' || type === 'just-applied') {
        templateName = 'recently-applied.html';
      }


      await this.loadEmailTemplate(templateName);

      // console.log("log the QRCodeUrl", QRCodeUrl);
      // console.log("log the item.qrCodeUrl", item.qrCodeUrl);
      console.log("log the item.jobPosterName!!", item.jobPosterName);
      return;
     let html = htmlContent.value;

     // For 1 person
     console.log("log the item.jobPosterName[0] before split", item.jobPosterName[0]);
    //  html = html.replace('${jobPosterName}', (item.jobPosterName[0] ? item.jobPosterName[0].split(' ') : 'Hiring Manager'));
     html = html.replace('${jobPosterName}', (item.jobPosterName[0] ? item.jobPosterName[0].split(' ')[0] : 'Hiring Manager'));

      html = html.replace('${jobTitle}', item.jobTitle || '');
      html = html.replace('${QRCodeUrl}', item.qrCodeUrl || '');

   //  let jobPosterEmail = item.jobPosterEmail || 'ryangriego@gmail.com';
     //let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';

      let jobPosterEmail = 'ryangriego@gmail.com';
      // Replace placeholder in the HTML
      html = html.replace('{{ jobPosterEmail }}', jobPosterEmail);
      // console.log("Final HTML ContentRIGHTIEIFJAOIJEFOIJ", html); // Log the final HTML

         //   if(this.dialog === 'just-applied') {
              const msg = {
                "personalizations": [
                  {
                    to: [
                      {
                        email: `${jobPosterEmail}`,
                        name: `${jobPosterName}`
                      }
                    ]
                  }
                ],
                "from": {
                  email: "ryan@ryangriego.com",
                  name: `Ryan Griego / ${jobTitle}`
                },
                "subject": `👋 Recently applied for ${jobTitle} at ${companyName} - thank you for accepting my application`,
                "content": [
                  {
                    type: "text/plain",
                    value: `👋 Recently applied for ${jobTitle} at ${companyName} - thank you for accepting my application`
                  },
                  {
                    type: "text/html",
                    value: html
                  }
                ],
              };
          //  }


      const { data, status, error } = await useFetch("/api/sendgrid", {
        method: "POST",
        body: msg
      });
      if(error.value === 'error') {
        this.notify('fail-send-email');
      } else {
            this.notify('success-send-email');
            item = {...item, status: 'Sent'};
            console.log("log the item going into update row in sendEmail", item);
            const { status, error } = await useFetch("/api/updaterow", {
              method: "POST",
              body: item
            });
            if(error.value === 'error') {
          } else {
            this.updateTable();
          }
        }
     },
  },
}
</script>
