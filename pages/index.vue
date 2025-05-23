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
     <Modal v-if="showModal" :message="modalMessage" @close="closeModal" />
    <h1>Welcome to My Nuxt App</h1>
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
      <Table @open-email-modal="openEmailModal" @send-email="sendEmail" @get-email="getEmail" @update-row="updateRow"
        @delete-row="deleteRow" @notify="notify" :jobs="jobs_filtered" :isRemote="filters.isRemote" ref="main_table" />
      <v-dialog v-model="isEmailDialogOpen" width="auto" scrollable>
        <template v-slot:default="{ isActive }">
          <v-card prepend-icon="mdi-email-fast-outline" title="Select Email Type" dark>
            <v-divider class="mt-3"></v-divider>
            <v-card-text class="px-4" style="height: 100px;">
              <v-radio-group v-model="dialog" column dark>
                <v-radio label="Recently Applied" value="just-applied"></v-radio>
              </v-radio-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text="Close" @click="isActive.value = false"></v-btn>
              <v-spacer></v-spacer>
              <v-btn color="surface-variant" text="Send" variant="flat"
                @click="isActive.value = false; sendEmail()"></v-btn>
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

<!-- <script setup>

const config = useRuntimeConfig();

const mode = computed(() => config.public.mode);

const isAdmin = computed(() => mode.value === 'admin');
const isGuest = computed(() => mode.value === 'guest');
</script> -->

<script>
import Table from '../components/Table.vue';
// Dark mode
// import 'tabulator-tables/dist/css/tabulator_midnight.min.css';
import 'tabulator-tables/dist/css/tabulator.min.css';

//  import { ref } from 'vue';

  import { ref, onMounted } from 'vue';
import Modal from '~/components/Modal.vue'; // Import your modal component

  // Define a ref to store HTML content
  const htmlContent = ref('');


  // Access URL Parameters

//   import { computed } from 'vue';
// import { useRoute } from 'vue-router';

// const route = useRoute();

// const isAdmin = computed(() => route.query.user === 'admin');
// const isDemo = computed(() => route.query.user !== 'admin');

// console.log("log the isAdmin", isAdmin);
// console.log("log the isDemo", isDemo);

///////////








export default {
  data: () => ({
    filters: {
        isRemote: false,
        status: null,
      },
      statuses: ['Sent', 'Applied'],
    isEmailDialogOpen: false,
    isAddJobDialogOpen: false,
    isAdmin: false,
    dialog: '',
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

components: {
    Modal,
},

async setup() {

  const config = useRuntimeConfig();
  const isAdmin = computed(() => config.public.mode === 'admin');
  const isGuest = computed(() => config.public.mode === 'guest');

  const showModal = ref(false);
  const modalMessage = ref('This demo version of Job Getter removes most of the funtionality of the app. The user can right click a row and click the get it button to see the features available in the full app. Feel free to check out the video below of me using the app.');

  const closeModal = () => {
    showModal.value = false;
  };

  onMounted(() => {
    if(isGuest.value) {
      showModal.value = true;
    }
  });

  const { data: jobs } = await useFetch("/api/jobs");

  jobs.value = toRaw(jobs.value);

  return {
    jobs,
    isAdmin,
    isGuest,
    showModal,
    modalMessage,
    closeModal,
  };
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

    // Filtered by ryangriego@gmail.com
    // jobs_filtered() {
    //   return this.jobs.jobs
    //     .filter(job => {
    //       let statusMatch = true;
    //       let remoteMatch = true;
    //       let emailMatch = false;

    //       // Check status filter
    //       if (this.filters.status) {
    //         statusMatch = job.status === this.filters.status;
    //       }

    //       // Check remoteAllowed filter
    //       if (this.filters.isRemote) {
    //         remoteMatch = job.remoteAllowed === true;
    //       }

    //       // Check if jobPosterEmail contains 'ryangriego@gmail.com'
    //       if (job.jobPosterEmail && Array.isArray(job.jobPosterEmail)) {
    //         emailMatch = job.jobPosterEmail.includes('ryangriego@gmail.com');
    //       }

    //       return statusMatch && remoteMatch && emailMatch;
    //     })
    //     .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    // }

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

    takeAction(action){
      if(!this.isAdmin) {
       return this.notify('in-guest-mode');
      }
      if(action === 'Run Scraper') {
        // this.runJobScraper();
        setTimeout(() => {
        this.runJobScraper();
      }, 1000); // Run the scraper after 1 second
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
      // SHouldnt need to auto genrate ID mongo does this on its own
      // let generateId = Number(Math.floor(Math.random() * 9000000000) + 1000000000);
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
        case "fail-delete-row":
          useNuxtApp().$toast.error('Failed to delete row');
          break;
        case "in-guest-mode":
          useNuxtApp().$toast.error('Feature not available in demo mode');
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
      item.qrCodeUrl = item.qrCodeUrl ? item.qrCodeUrl : '';
      item.outcome = item.outcome ? item.outcome : '';
      console.log("log the item!!!!!!!!", item);
      const { data, error } = await useFetch("/api/updaterow", {
        method: "POST",
         body: {
             'jobId': item.jobId,
             'domain': item.companyOfficialUrl,
             'jobPosterName': item.jobPosterName,
             'jobPosterEmail': item.jobPosterEmail,
             'outcome': item.outcome ?? '',
             'qrCodeUrl': item.qrCodeUrl ?? ''

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
        let urls = output.match(/https?:\/\/[^\s]+/g);
        let lastUrl = urls[urls.length -1];
        const getJobsJson = await fetch(lastUrl);
        let jobsData = await getJobsJson.json();
        console.log("log the jobsData", jobsData);
        // return;
        // DOUBLE CHECK THAT IF JOB POSTER INFORMATION IS COMING THROUGH THAT DUBPLICATE HEADERS ARE NOT CREATED
        jobsData = jobsData.map(job => {
          if(job.error) {
            return null;
          }

          if (!job.companyOfficialUrl || job.companyOfficialUrl === '') {
            let companyName = job.companyName
              .replace(/\s/g, '')
              .replace(/[^\w\s]/gi, '')
              .replace(/llc/gi, '')
              .replace(/inc/gi, '');

            let companyUrl = `${companyName}.com`;
            job.companyOfficialUrl = companyUrl.toLowerCase();
          }

          // Check through the jobDescription and find number of matching keywords
          // This has to be taken out an accessible throughou the app and apply in real time to the data coming into the tabulator

          let keywords = [
            "PHP",
            "Nuxt.js",
            "Next.js",
            "JavaScript",
            "TypeScript",
            "React",
            "Vue",
            "HTML",
            "CSS",
            "Node.js",
            "Express.js",
            "MongoDB",
            "SQL",
            "Git",
            "Webpack",
            "Babel",
            "GSAP",
            "MySQL",
            "Tailwind CSS",
          ];

          let jobDescription = job.jobDescription;

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
            jobPosterEmail: '',
            source: 'LinkedIn',
            sentFollowUp1: false,
          };
        });

          const { data: jobs } = await useFetch("/api/addjobs", {
            method: "POST",
            body: {
              data: jobsData,
              type: 'multi',
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
          let data = await response.json();

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
      this.isEmailDialogOpen = true;
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

    async sendEmail(eventData) {
      const { type, payload } = eventData || {};
      console.log("log type", type);
      console.log("log payload", payload);
      console.log("log deventData", eventData);

      // Determine if `eventData` is an object or if it is not provided (direct call)
      let item = this.rowData;
      item = toRaw(this.rowData);

      // if (!item) {
      //   item = toRaw(this.rowData);
      // } else {
      //   item = toRaw(payload);
      // }
     // let html = ""
      // let companyUrl = item.companyUrl;
      // let companyName = item.companyName.replace(/[^\w\s]/gi, '');
      let companyName = item.companyName;
      // let companyLogoUrl = item.companyLogoUrl ? item.companyLogoUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';
      let jobTitle = item.jobTitle;
      // let jobLocation = item.jobLocation;
      // let postedAt = item.postedAt;
      let jobPosterName;

      if(Array.isArray(item.jobPosterName)) {
        jobPosterName =  item.jobPosterName[0] ? item.jobPosterName[0].split(" ")[0] : 'Hiring Manager';
      } else {

        jobPosterName = item.jobPosterName ? item.jobPosterName.split(" ")[0] : 'Hiring Manager';

      }
      // let jobPosterEmail = item.jobPosterEmail ? 'ryangriego@gmail.com' : 'ryangriego@gmail.com';
     // let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';
      let QRCodeUrl = item.qrCodeUrl ? item.qrCodeUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';
      // let msg = '';



      let templateName = '';

      if (this.dialog === 'just-applied' || type === 'just-applied') {
        templateName = 'recently-applied.html';
      }


      await this.loadEmailTemplate(templateName);


      let html = htmlContent.value;
      //html = html.replace('${jobPosterName}', (item.jobPosterName[0] ? item.jobPosterName[0].split(' ')[0] : 'Hiring Manager'));


      if(Array.isArray(item.jobPosterName)) {
      html = html.replace('${jobPosterName}', (item.jobPosterName[0] ? item.jobPosterName[0].split(' ')[0] : 'Hiring Manager'));
      } else {

        html = html.replace('${jobPosterName}', (item.jobPosterName ? item.jobPosterName.split(' ')[0] : 'Hiring Manager'));

      }
      html = html.replace('${jobTitle}', item.jobTitle || '');
      html = html.replace('${QRCodeUrl}', item.qrCodeUrl || '');


    //  let jobPosterEmail = item.jobPosterEmail || 'ryangriego@gmail.com';
     //let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';

     let jobPosterEmail = 'ryangriego@gmail.com';
    // let jobPosterEmail = 'ryangriego730@yahoo.com';
      // let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';


      // let jobPosterEmail = 'ryangriego@gmail.com';
      // console.log('log the item.jobPosterEmail!!!!!', item.jobPosterEmail);
      // return;
      // Replace placeholder in the HTML
      html = html.replace('{{ jobPosterEmail }}', jobPosterEmail);
      console.log("Final HTML ContentRIGHTIEIFJAOIJEFOIJ", html); // Log the final HTML
      //      let jobPosterEmail = item.jobPosterEmail ? 'ryangriego@gmail.com' : 'ryangriego@gmail.com';
     // jobPosterEmail = 'ryangriegoMy power adapter the two prongs just went inside, and they're barely sticking out in any tips on how to get it working again@gmail.com';

      // const msg = {
      //   personalizations: [
      //     {
      //       to: [
      //         {
      //           email: "ryangriego@gmail.com",
      //           name: "test"
      //         }
      //       ]
      //     }
      //   ],
      //   from: {
      //     email: "ryan@ryangriego.com",
      //     name: "Ryan Griego"
      //   },
      //   subject: `Thank you for the interview ${item.jobPosterName}`,
      //   content: [
      //     {
      //       type: "text/html",
      //       value: html
      //     }
      //   ]
      // };

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
                "subject": `👋 Recently applied for ${jobTitle} at ${companyName}`,
                "content": [
                  {
                    type: "text/plain",
                    value: `👋 Recently applied for ${jobTitle} at ${companyName}`
                  },
                  {
                    type: "text/html",
                    value: html
                  }
                ],
              };
          //  }



      // console.log("log the msg[personalizations]", msg['personalizations']);
      // return;

      console.log('llog the msg', msg);

      const { data, status, error } = await useFetch("/api/sendgrid", {
        method: "POST",
        body: msg
      });
      if(error.value === 'error') {
        this.notify('fail-send-email');
      } else {
            this.notify('success-send-email');
            const { status, error } = await useFetch("/api/updatestatus", {
              method: "POST",
              body: item.jobId
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
