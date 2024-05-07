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
  <v-container>
    <div className="overlay-intro"></div>
    <div>
      <v-row class="outside-table d-flex align-end">
        <v-col cols="2" class="d-flex align-center">
          <img alt="Job Getter logo" height="auto"
            src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1710832996/new-6_zuoc2x.jpg"
            style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
            width="300">
        </v-col>
        <v-col cols="1" class="d-flex align-end"></v-col>
        <v-col cols="3" class="d-flex align-end mb-3">
          <div class="text-end">
            <v-btn color="rgb(28, 255, 206)" class="m-3" @click="runJobScraper">Run Scraper</v-btn>
          </div>
          <div class="text-end">
            <v-btn color="rgb(28, 255, 206)" class="m-3" @click="fetchNewJobs">Fetch Jobs</v-btn>
          </div>
          <div class="text-end">
            <v-btn outlined class="m-3" style="background-color: rgba(250,250,250,0.2);color: #1cffcefa;" text
              @click="openAddJobModal">Add Job</v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <span class="mr-2">Filters:</span>
          <v-card outlined class="pa-2 d-flex flex-row align-start"
            style="border: .5px solid rgb(28, 255, 206); background-color: transparent; color: #1cffcefa;">
            <v-checkbox v-model="filters.isRemote" label="Remote" class="pr-4"></v-checkbox>
            <v-select v-model="filters.status" :items="statuses" label="View by Status" class="flex-grow-1"
              style="min-width: 200px;"></v-select>
            <v-btn outlined class="mx-4 my-2" style="background-color: rgba(250,250,250,0.2);color: #1cffcefa;" text
              @click="resetFilters">Clear Filters</v-btn>
          </v-card>
        </v-col>
      </v-row>
      <div style="background-color:#011918;">
        <p class="p-1 outside-table">Total # of jobs {{ numberOfJobs }}</p>
      </div>
      <Table @open-email-modal="openEmailModal" @send-email="sendEmail" @get-email="getEmail" @update-row="updateRow"
        @delete-row="deleteRow" :jobs="jobs_filtered" :isRemote="filters.isRemote" class="mb-4" ref="main_table" />
      <v-dialog v-model="isEmailDialogOpen" width="auto" scrollable>
        <template v-slot:default="{ isActive }">
          <v-card prepend-icon="mdi-email-fast-outline" title="Select Email Type" dark>
            <v-divider class="mt-3"></v-divider>
            <v-card-text class="px-4" style="height: 100px;">
              <v-radio-group v-model="dialog" column dark>
                <v-radio label="Just Applied" value="just-applied"></v-radio>
                <v-radio label="Thank you" value="thankyou"></v-radio>
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
                <v-text-field v-model="job.companyUrl" label="Company URL"></v-text-field>
                <v-text-field v-model="job.companyOfficialUrl" label="Company Official Url"></v-text-field>
                <v-text-field v-model="job.jobLocation" label="Job Location"></v-text-field>
                <v-text-field v-model="job.postedAt" label="Posted At"></v-text-field>
                <v-text-field v-model="job.appliesClosedAt" label="Applies Closed At"></v-text-field>
                <v-text-field v-model="job.timestamp" label="Date Scraped"></v-text-field>
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
.app-background {
  background: url('https: //www.ryangriego.com/images/home-background-ryan-griego.jpeg') !important;
}
</style>

<script>
import Table from '../components/Table.vue';
// Dark mode
import 'tabulator-tables/dist/css/tabulator_midnight.min.css';
// import 'tabulator-tables/dist/css/tabulator.min.css';

nextTick(() => {
  if (process.client) {
    useNuxtApp().$toast('notify after nextTick');
  }
});

export default {
  data: () => ({
    filters: {
        isRemote: false,
        staus: null,
      },
      statuses: ['Sent', 'Applied'],
    isEmailDialogOpen: false,
    isAddJobDialogOpen: false,
    dialog: '',
    rowData: {},
    mySkills: ['React', 'Vue', 'PHP'],
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
      immediate: true,
    },
    'filters.status': {
      handler() {
        this.updateTable();
      },
      immediate: true,
    },
  },
  methods: {
    initialize() {
    },
    async submitForm() {

      // this.job.jobPosterEmail = "test@delphiretech.com";
      // this.status = "";
      // this.companyUrl = "https://www.linkedin.com/company/delphire";
      // this.companyName = "Delphire Inc";
      // this.jobTitle = "Software Engineer";
      // this.jobLocation = "Los Angeles; CA";
      // this.postedAt = "2023-10-29T22:59:23.000Z";
      // this.appliesClosedAt = "2024-04-26T22:59:06.000Z";
      // this.jobDescription = "Software Engineer with some Embedded Systems Experience Search\n Required Qualifications\n 2 years of experience working on a combination of hardware and software. i.e. an IOT system that is field deployed or car industry related.Please tailor your resume to the following Required Qualifications and include a second page highlighting the projects that you worked to fulfill those qualifications and your role / contribution to those projects.Proven system testing and validation ability.Experience Working experience with FPGAs; Microcontrollers.We are looking for someone who takes initiative to find new and improved ways to get things done; is action oriented and achieves results.Ability to solve end-to-end problems and Translate user requirements to design requirements. Preferred Qualifications:Advanced degree (e.g. Master's; PhD; etc) in an engineering-related field.A passion for tackling the wildfire challenge.Experience in field-deployed systems (i.e. weather stations; IOT devices) that operate off-grid.Experience working at a startup or on a small; fast-moving team.Ability to foresee issues and design in flexibility and workarounds for both known and unknown unknowns.Good skills and interest in mentorship BenefitsCompetitive Salary.Fully covered health Benefits and PTO; subject to change.Flexible Work Schedules!Accelerated Career Growth!Startup Equity Stake Job DescriptionOur Company is looking for an IoT Embedded Hardware Engineer to work as a member of our growing team. You will be responsible for hardware development on our early wildfire detection system. You will work directly with our software team to innovate with and improve our current software systems and platform. The goal is to transition our prototype to a Minimum Commercial Unit so you will gain hands on experience in that process. This position will require a fair amount of hands-on work and testing of our platform. The main work will be out of our office at the LKIC Campus in downtown LA and other field locations as necessary. You will have access to a state-of-the-art prototyping facility and machine shop. We have some great partners and advisors that can provide support to this position. This position requires a self-motivated; dynamic individual with strong technical and communication skills. We are looking for someone who takes initiative to find new and improved ways to get things done; is action oriented and achieves results. You will also be a key contributor to product definition and resulting detailed device performance and functional requirements specifications.\n About DelphireDelphire’s mission is to reduce the occurrence and impact of wildfires caused by downed or damaged power lines of the electric grid by supplying our utility customers with an early detection and warning system that can report fires; provide photographs for human confirmation and assessment prior to resource deployment all in their earliest stages even from low connectivity environments. We differentiate from other wildfire AI detection technologies by working below the canopy line; along the grid assets; to detect fires and faults during the incipient phase; thus helping to stop fires before they reach their critical self‐sustaining stage; and simultaneously provide information on their root cause enhancing future prevention. Both aspects are improvements to the state‐of‐the‐art capabilities for our utility customers that Delphire is working with through a unique combination of hardware and software advances. Learn more about us at www.delphiretech.com\n References required.";
      // this.jobId  =3745290039;
      // this.workplaceType = "On-site";
      // this.companyLogoUrl = "https://www.linkedin.com/in/gilberto-desalvo-74b498a6";
      // this.applyUrl = "John Smith";
      // this.experienceLevel = "https://media.licdn.com/dms/image/C560BAQGxvjHURpAHnA/company-logo_400_400/0/1675743016492/delphire_logo?e=1714003200&v=beta&t=CN4I50rXA5FNCkuljbbwmD_li4JIV3-QzzjQDEd2yaY";
      // this.applicantsCount = "https://www.linkedin.com/job-apply/3745290039";
      // this.viewsCount = "1150";
      // this.companyStaffCount = "4253";
      // this.companyDescription = "4";
      // this.jobIndustries = "Global warming increases grid-sparked wildfires to account for 30% of California’s annual burn area; releasing CO2 equivalent to 65% of the state’s transportation-related emissions. Better identification of required maintenance; especially in remote areas; could prevent most of these devastating fires. Delphire’s powerline monitoring system solves this problem by enabling automated; frequent; and cheap inspection of lines. Plus; our system identifies fires that do break out and transmits alerts within seconds - minimizing damages; power disruptions; and CO2 impact.";
      // this.jobFunctions = "";
      // this.remoteAllowed = "";
      // this.jobState = "FALSE";
      // this.jobType = "LISTED";
      // this.timestamp = "Full-time";
      // this.query = "2024-01-22T18:23:52.311Z";
      // this.jobPosterProfileUrl = "https://www.linkedin.com/jobs/view/3745290039/?eBP=CwEAAAGNMi1gsTOrD_rMJ8jE2uu_yYt5anfIUDqac7C9VVHBsoE9aSeuaFXPErTOT0xvjYXKQOOs12jVRnLQiL3cKbCqo3OGdEvd1bUtFYvQRS2pzegkgPWTz2eiY8tIXLYZZt1WWu6xoA7ytQaG7PLZ3Orjy8Bfc-Rm2tD55qZ_9yh-ngWWXfy_wFfkxfnACFo913WrW8h8VhCq09Ga-Rbq9ZN_l1uspZR6kNRxVJrYg2RFylvt5SC-u0BXCk5h5yc1YYJNh-r6BIkONx88Yh5TTuoIlsKpvvX7um5nsUDODJkN-weCwLk5ltVYO0KH_B_dyRLif25VIwGN_RY9K91fwHujhn1wEnq48K8mY_KIiQ7sxJ-H6mPQEp-e1XtNiBKlEsqBocWckHj9tjDQvHgfOduRkz0&refId=4%2FSq1VUQB0mN3NMC3yANFA%3D%3D&trackingId=g2nGQXmEPq1f4c727RD4Hg%3D%3D&trk=flagship3_search_srp_jobs#/";
      // this.jobPosterName = "";

      let job = this.job;
      const isValid = this.$refs.form.validate();

      if (isValid) {
        const { data: jobs } = await useFetch("/api/addjobs", {
          method: "POST",
          body: {
            data: job,
            type: 'single',
          },
        });
        // this.isAddJobDialogOpen = false;
      }
    },
    updateTable() {
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
             'domain': item.companyOfficialUrl,
             'jobPosterName': item.jobPosterName,
             'jobPosterEmail': item.jobPosterEmail,
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
        // DOUBLE CHECK THAT IF JOB POSTER INFORMATION IS COMING THROUGH THAT DUBPLICATE HEADERS ARE NOT CREATED
        jobsData = jobsData.map(job => {
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
            source: 'LinkedIn'
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
          }
      }
    },
    // Might not need this function VV

    async getEmail(item) {
      item = toRaw(item);
        try {
          const response = await fetch(`/api/getemail?domain=${item.companyOfficialUrl}&full_name=${item.jobPosterName}`);
        if (!response.ok) {
            this.notify('fail-get-email');
          throw new Error('HTTP error ' + response.status);
        }
        let data = await response.json();
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

    async sendEmail() {
      let item = toRaw(this.rowData);
      let html = ""
      let companyUrl = item.companyUrl;
      let companyName = item.companyName.replace(/[^\w\s]/gi, '');
      let companyLogoUrl = item.companyLogoUrl ? item.companyLogoUrl : 'https://www.ryangriego.com/images/ryan-hero.jpg';
      let jobTitle = item.jobTitle;
      let jobLocation = item.jobLocation;
      let postedAt = item.postedAt;
      let jobPosterName = item.jobPosterName ? item.jobPosterName.split(" ")[0] : 'Hiring Manager';
      let jobPosterEmail = item.jobPosterEmail ? 'ryangriego@gmail.com' : 'ryangriego@gmail.com';
     // let jobPosterEmail = item.jobPosterEmail ? item.jobPosterEmail : 'ryangriego@gmail.com';
      let msg = '';

      if(this.dialog === 'just-applied') {
        msg = {
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
            name: "Ryan Griego / Software Engineer"
          },
          "subject": `👋 Recently applied for ${jobTitle} at ${companyName} - thanks for accepting my application`,
          "content": [
            {
              type: "text/plain",
              value: `👋 Recently applied for ${jobTitle} at ${companyName} - thanks for accepting my application`
            },
            {
              type: "text/html",
              value: `<!DOCTYPE HTML
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>

  <style type="text/css">
    @media only screen and (min-width: 620px) {
      .u-row {
        width: 600px !important;
      }

      .u-row .u-col {
        vertical-align: top;
      }

      .u-row .u-col-28p33 {
        width: 169.98px !important;
      }

      .u-row .u-col-33p33 {
        width: 199.98px !important;
      }

      .u-row .u-col-33p67 {
        width: 202.02px !important;
      }

      .u-row .u-col-39 {
        width: 234px !important;
      }

      .u-row .u-col-42p5 {
        width: 255px !important;
      }

      .u-row .u-col-50 {
        width: 300px !important;
      }

      .u-row .u-col-57p5 {
        width: 345px !important;
      }

      .u-row .u-col-61 {
        width: 366px !important;
      }

      .u-row .u-col-66p33 {
        width: 397.98px !important;
      }

      .u-row .u-col-71p67 {
        width: 430.02px !important;
      }

      .u-row .u-col-100 {
        width: 600px !important;
      }

    }

    @media (max-width: 620px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }

      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }

      .u-row {
        width: 100% !important;
      }

      .u-col {
        width: 100% !important;
      }

      .u-col>div {
        margin: 0 auto;
      }
    }

    body {
      margin: 0;
      padding: 0;
    }

    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }

    p {
      margin: 0;
    }

    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }

    * {
      line-height: inherit;
    }

    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }

    @media (max-width: 480px) {
      .hide-mobile {
        max-height: 0px;
        overflow: hidden;
        display: none !important;
      }
    }

    table,
    td {
      color: #000000;
    }

    #u_body a {
      color: #0000ee;
      text-decoration: underline;
    }

    #u_content_text_16 a {
      color: #ffffff;
    }

    #u_content_text_17 a {
      color: #ffffff;
    }

    @media (max-width: 480px) {
      #u_content_heading_3 .v-container-padding-padding {
        padding: 5px 10px 0px 30px !important;
      }

      #u_content_heading_1 .v-container-padding-padding {
        padding: 5px 10px 0px 30px !important;
      }

      #u_content_text_22 .v-container-padding-padding {
        padding: 0px 10px 20px 30px !important;
      }

      #u_content_heading_33 .v-container-padding-padding {
        padding: 5px 10px 0px 30px !important;
      }

      #u_content_text_1 .v-container-padding-padding {
        padding: 0px 10px 20px 30px !important;
      }

      #u_content_text_21 .v-container-padding-padding {
        padding: 0px 10px 20px 30px !important;
      }

      #u_content_divider_11 .v-container-padding-padding {
        padding: 10px !important;
      }

      #u_content_heading_17 .v-container-padding-padding {
        padding: 0px 10px 10px 20px !important;
      }

      #u_content_heading_5 .v-container-padding-padding {
        padding: 10px 20px 20px !important;
      }

      #u_content_heading_11 .v-container-padding-padding {
        padding: 10px 10px 0px 20px !important;
      }

      #u_content_text_9 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_divider_8 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_heading_15 .v-container-padding-padding {
        padding: 5px 10px 0px 20px !important;
      }

      #u_content_text_10 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_text_12 .v-container-padding-padding {
        padding: 10px 40px 10px 20px !important;
      }

      #u_content_heading_10 .v-container-padding-padding {
        padding: 10px 10px 0px 20px !important;
      }

      #u_content_text_8 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_divider_5 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_heading_8 .v-container-padding-padding {
        padding: 5px 10px 0px 20px !important;
      }

      #u_content_text_5 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_text_7 .v-container-padding-padding {
        padding: 10px 40px 30px 20px !important;
      }

      #u_content_heading_27 .v-container-padding-padding {
        padding: 10px 20px !important;
      }

      #u_content_divider_14 .v-container-padding-padding {
        padding: 0px 10px 10px !important;
      }

      #u_content_heading_28 .v-container-padding-padding {
        padding: 5px 10px 0px 20px !important;
      }

      #u_content_divider_15 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_text_16 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_heading_29 .v-container-padding-padding {
        padding: 5px 10px 0px 20px !important;
      }

      #u_content_divider_16 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_text_17 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_heading_30 .v-container-padding-padding {
        padding: 10px 20px 30px 10px !important;
      }

      #u_content_divider_4 .v-container-padding-padding {
        padding: 0px 10px !important;
      }

      #u_content_heading_13 .v-container-padding-padding {
        padding: 10px 10px 10px 20px !important;
      }

      #u_content_heading_13 .v-text-align {
        text-align: left !important;
      }

      #u_content_image_10 .v-src-width {
        width: auto !important;
      }

      #u_content_image_10 .v-src-max-width {
        max-width: 45% !important;
      }

      #u_content_image_10 .v-text-align {
        text-align: center !important;
      }

      #u_content_heading_22 .v-container-padding-padding {
        padding: 0px 10px 10px !important;
      }

      #u_content_heading_22 .v-text-align {
        text-align: center !important;
      }

      #u_content_image_9 .v-src-width {
        width: auto !important;
      }

      #u_content_image_9 .v-src-max-width {
        max-width: 45% !important;
      }

      #u_content_image_9 .v-text-align {
        text-align: center !important;
      }

      #u_content_heading_34 .v-container-padding-padding {
        padding: 0px 10px 10px !important;
      }

      #u_content_heading_34 .v-text-align {
        text-align: center !important;
      }

      #u_content_image_3 .v-src-width {
        width: auto !important;
      }

      #u_content_image_3 .v-src-max-width {
        max-width: 45% !important;
      }

      #u_content_image_3 .v-text-align {
        text-align: center !important;
      }

      #u_content_heading_23 .v-text-align {
        text-align: center !important;
      }

      #u_content_image_2 .v-src-width {
        width: auto !important;
      }

      #u_content_image_2 .v-src-max-width {
        max-width: 45% !important;
      }

      #u_content_image_2 .v-text-align {
        text-align: center !important;
      }

      #u_content_heading_35 .v-container-padding-padding {
        padding: 0px 10px 10px !important;
      }

      #u_content_heading_35 .v-text-align {
        text-align: center !important;
      }

      #u_content_image_4 .v-src-width {
        width: auto !important;
      }

      #u_content_image_4 .v-src-max-width {
        max-width: 45% !important;
      }

      #u_content_image_4 .v-text-align {
        text-align: center !important;
      }

      #u_content_heading_24 .v-container-padding-padding {
        padding: 0px 10px 10px !important;
      }

      #u_content_heading_24 .v-text-align {
        text-align: center !important;
      }

      #u_content_image_5 .v-src-width {
        width: auto !important;
      }

      #u_content_image_5 .v-src-max-width {
        max-width: 45% !important;
      }

      #u_content_text_19 .v-container-padding-padding {
        padding: 10px 30px 0px !important;
      }

      #u_content_social_1 .v-container-padding-padding {
        padding: 30px 10px 10px !important;
      }
    }
  </style>



  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@500&display=swap" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300&display=swap" rel="stylesheet" type="text/css">
  <!--<![endif]-->

</head>

<body class="clean-body u_body"
  style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e4e0e8;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body"
    style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e4e0e8;width:100%"
    cellpadding="0" cellspacing="0">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e4e0e8;"><![endif]-->



          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #1a9ba2;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #1a9ba2;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ebf9f9; line-height: 140%; text-align: center; word-wrap: break-word; font-family: Epilogue, sans-serif; font-size: 34px; font-weight: 400;">
                                <span><span><span><span><span>Ryan Griego</span></span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="menu" style="text-align:center">
                                <!--[if (mso)|(IE)]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"><tr><![endif]-->

                                <!--[if (mso)|(IE)]><td style="padding:5px 18px"><![endif]-->

                                <a href="https://ryangriego.com" target="_blank"
                                  style="padding:5px 18px;display:inline-block;color:#ffffff;font-size:16px;font-weight: 700;text-decoration:none">
                                  Portfolio
                                </a>

                                <!--[if (mso)|(IE)]></td><![endif]-->

                                <!--[if (mso)|(IE)]><td style="padding:5px 18px"><![endif]-->
                                <span
                                  style="padding:5px 18px;display:inline-block;color:#ffffff;font-size:16px;font-weight: 700;"
                                  class="hide-mobile">
                                  ~
                                </span>
                                <!--[if (mso)|(IE)]></td><![endif]-->


                                <!--[if (mso)|(IE)]><td style="padding:5px 18px"><![endif]-->

                                <a href="https://www.ryangriego.com/assets/ryan_griego_resume.pdf" target="_blank"
                                  style="padding:5px 18px;display:inline-block;color:#ffffff;font-size:16px;font-weight: 700;text-decoration:none">
                                  Resume
                                </a>

                                <!--[if (mso)|(IE)]></td><![endif]-->

                                <!--[if (mso)|(IE)]><td style="padding:5px 18px"><![endif]-->
                                <span
                                  style="padding:5px 18px;display:inline-block;color:#ffffff;font-size:16px;font-weight: 700;"
                                  class="hide-mobile">
                                  ~
                                </span>
                                <!--[if (mso)|(IE)]></td><![endif]-->


                                <!--[if (mso)|(IE)]><td style="padding:5px 18px"><![endif]-->

                                <a href="https://www.linkedin.com/in/ryan-griego-2134a340/" target="_blank"
                                  style="padding:5px 18px;display:inline-block;color:#ffffff;font-size:16px;font-weight: 700;text-decoration:none">
                                  LinkedIn
                                </a>

                                <!--[if (mso)|(IE)]></td><![endif]-->


                                <!--[if (mso)|(IE)]></tr></table><![endif]-->
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #5ac1a9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #0f3159;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Open Sans',sans-serif; font-size: 21px; font-weight: 700;">
                                <span><span style="line-height: 29.4px;"><span style="line-height: 29.4px;"><span
                                        style="line-height: 29.4px;"><span style="line-height: 29.4px;"><span
                                            style="line-height: 29.4px;"><span style="line-height: 29.4px;"><span
                                                style="line-height: 29.4px;"><span style="line-height: 29.4px;"><span
                                                    style="line-height: 29.4px;"><span
                                                      style="line-height: 29.4px;"><span
                                                        style="line-height: 29.4px;"><span
                                                          style="line-height: 29.4px;">Hi ${jobPosterName},<br />I'm
                                                          Ryan Griego and I recently applied for the ${jobTitle}
                                                          role.</span></span></span></span></span></span></span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #0f3159;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                  style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #0f3159;height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 0px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 15px; font-weight: 700;">
                                <span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span><span>I
                                                                              sent this email from a side project that
                                                                              uses various 3rd party APIs to archive
                                                                              positions I've applied to and  help hiring
                                                                              managers, recruiters, etc. get to know
                                                                              me.<br /><br />Below you'll find a summary
                                                                              of my most recent roles, and a brief list
                                                                              of skills I bring to the
                                                                              table.<br /></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_1" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 13px; font-weight: 700;">
                                <span><span><span><span><span><span>PHONE</span></span></span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_22" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">949 310-8534</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_33" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 13px; font-weight: 700;">
                                <span><span><span><span><span>PORTFOLIO SITE</span></span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_1" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;"><span style="color: #ffffff; line-height: 19.6px;"><a
                                      rel="noopener" href="https://ryangriego.com" target="_blank"
                                      style="color: #ffffff;">ryangriego.com</a></span></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #5ac1a9;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-50"
                  style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #5ac1a9;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="left">

                                    <img align="left" border="0"
                                      src="${companyLogoUrl}"
                                      alt="image" title="image"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 270px;"
                                      width="270" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_21" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 16px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%;"><span style="color: #ecf0f1; line-height: 22.4px;">I'd
                                    love to work at ${companyName}!</span></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="430" style="background-color: #0f3159;width: 430px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-71p67"
                  style="max-width: 320px;min-width: 430.02px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="169" style="background-color: #0f3159;width: 169px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-28p33"
                  style="max-width: 320px;min-width: 169.98px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 12px 20px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #1a9ba2; line-height: 80%; text-align: right; word-wrap: break-word; font-family: impact,chicago; font-size: 120px; font-weight: 400;">
                                <span><span><span><span><span><span><span><span><span><span><span><span>01</span></span></span></span></span></span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="345" style="background-color: #0f3159;width: 345px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-57p5"
                  style="max-width: 320px;min-width: 345px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_divider_11" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 20px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="96%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 27px solid #5ac1a9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="255" style="background-color: #0f3159;width: 255px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-42p5"
                  style="max-width: 320px;min-width: 255px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_17" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 13px 30px 0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 80%; text-align: right; word-wrap: break-word; font-family: Oswald, sans-serif; font-size: 32px; font-weight: 700;">
                                <span><span><span><span><span><span><span>EXPERIENCES</span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #0f3159;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_5" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:140px 20px 20px 11px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #1a9ba2; line-height: 80%; text-align: left; word-wrap: break-word; font-family: impact,chicago; font-size: 120px; font-weight: 400;">
                                <span><span><span><span><span>02</span></span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #0f3159;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_11" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                <span>LifeMD</span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_9" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 12px; color: #5ac1a9; line-height: 0%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 0%;">Huntington Beach, CA</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_divider_8" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="left" border="0" cellpadding="0" cellspacing="0" width="47%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #383838;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_15" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                <span><span>Full Stack Engineer</span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_10" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 12px; color: #5ac1a9; line-height: 0%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 0%;">From 2021 - 2023</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_12" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">My responsibilities were to build out features and reports
                                  on our internal patient care applications.</p>
                                <p style="line-height: 140%;"><strong>Skills:</strong> PHP, Vue, MySQL</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #0f3159;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_10" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                <span>Eagle Industrial Group</span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_8" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 12px; color: #5ac1a9; line-height: 0%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 0%;">Rancho Santa Margarita, CA</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_divider_5" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="left" border="0" cellpadding="0" cellspacing="0" width="47%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #383838;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_8" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                <span>Front-End Web Developer</span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_5" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 12px; color: #5ac1a9; line-height: 0%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 0%;">From 2018- 2020</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_7" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Built three online stores in collaboration with various
                                  3rd party contractors and the Director of Marketing.<br /><strong>Skills:</strong>
                                  Javascript, HTML/CSS</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="234" style="background-color: #0f3159;width: 234px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-39"
                  style="max-width: 320px;min-width: 234px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_27" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 0px 30px 13px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 80%; text-align: left; word-wrap: break-word; font-family: Oswald, sans-serif; font-size: 32px; font-weight: 700;">
                                <span><span><span><span><span><span><span><span>APPS</span></span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="366" style="background-color: #0f3159;width: 366px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-61"
                  style="max-width: 320px;min-width: 366px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_divider_14" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 10px 0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="96%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 27px solid #5ac1a9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #0f3159;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_28" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 0px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                <span>Job Getter</span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_divider_15" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="left" border="0" cellpadding="0" cellspacing="0" width="47%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #383838;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_16" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Job Hunt Prospect Admin</p>
                                <p style="line-height: 140%;">Nuxt 3 / MongoDB</p>
                                <p style="line-height: 140%;"><a rel="noopener"
                                    href="https://github.com/ryan-griego/job-getter" target="_blank">GitHub link</a></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #0f3159;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_29" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 0px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                <span>Chat RRG</span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_divider_16" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="left" border="0" cellpadding="0" cellspacing="0" width="47%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #383838;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_text_17" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 30px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p style="line-height: 140%;">Custom ChatGPT Clone<br />Next.js / MongoDB</p>
                                <p style="line-height: 140%;"><a rel="noopener"
                                    href="https://github.dev/ryan-griego/chat-rrg" target="_blank">GitHub link</a></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #0f3159;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #0f3159;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_30" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:20px 11px 30px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #1a9ba2; line-height: 80%; text-align: right; word-wrap: break-word; font-family: impact,chicago; font-size: 120px; font-weight: 400;">
                                <span><span><span><span><span>03</span></span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="397" style="background-color: #ffffff;width: 397px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-66p33"
                  style="max-width: 320px;min-width: 397.98px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_divider_4" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 0px 10px 20px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="96%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 27px solid #5ac1a9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="202" style="background-color: #ffffff;width: 202px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p67"
                  style="max-width: 320px;min-width: 202.02px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_heading_13" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 30px 0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #1a9ba2; line-height: 80%; text-align: right; word-wrap: break-word; font-family: Oswald, sans-serif; font-size: 32px; font-weight: 700;">
                                <span><span><span><span><span><span>SKILLS</span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #ffffff;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_image_10" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0"
                                      src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1712253454/next-js-icon_bmql3q.png"
                                      alt="Next.js" title="Next.js"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 38%;max-width: 68.4px;"
                                      width="68.4" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_22" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 20px 10px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #231f20; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 15px; font-weight: 400;">
                                <span><span><span><span><span><span><span><span><span><span><span><span><span>Next.js</span></span></span></span></span></span></span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #ffffff;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_image_9" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0"
                                      src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231480/portfolio/icons/javascript_ifuclz.png"
                                      alt="Javascript" title="Javascript"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 38%;max-width: 68.4px;"
                                      width="68.4" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_34" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 20px 10px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #141313; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 15px; font-weight: 400;">
                                <span><span><span><span><span><span><span><span>Javascript<br /></span></span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #ffffff;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_image_3" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0"
                                      src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231952/portfolio/icons/vue_fq4345.png"
                                      alt="Vue" title="Vue"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 38%;max-width: 68.4px;"
                                      width="68.4" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_23" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #090808; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 15px; font-weight: 400;">
                                <span><span><span><span>Vue</span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #ffffff;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_image_2" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0"
                                      src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1712253652/nuxt-js-icon_wxwrc2.png"
                                      alt="Nuxt.js" title="Nuxt.js"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 51%;max-width: 91.8px;"
                                      width="91.8" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_35" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 20px 10px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #231f20; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 15px; font-weight: 400;">
                                <span><span><span><span><span><span><span><span><span><span><span>Nuxt.js</span></span></span></span></span></span></span></span></span></span></span>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #ffffff;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_image_4" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0"
                                      src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231480/portfolio/icons/react_yz6djo.png"
                                      alt="React" title="React"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 38%;max-width: 68.4px;"
                                      width="68.4" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_heading_24" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 20px 10px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #302d2e; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 15px; font-weight: 400;">
                                <span><span><span><span>React</span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color: #ffffff;width: 200px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33"
                  style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_image_5" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0"
                                      src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1710817780/php-logo_yrgo45.png"
                                      alt="PHP" title="PHP"
                                      style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 38%;max-width: 68.4px;"
                                      width="68.4" class="v-src-width v-src-max-width" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #141313; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 15px; font-weight: 400;">
                                <span><span>PHP</span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <!--[if mso]><table width="100%"><tr><td><![endif]-->
                              <h1 class="v-text-align"
                                style="margin: 0px; color: #0f3159; line-height: 140%; text-align: center; word-wrap: break-word; font-family: Epilogue, sans-serif; font-size: 34px; font-weight: 400;">
                                <span><span><span><span><span><span><span>Ryan
                                              Griego</span></span></span></span></span></span></span></h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row"
              style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div
                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100"
                  style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div
                    style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div
                      style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table id="u_content_text_19" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px 70px 20px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div class="v-text-align"
                                style="font-size: 13px; color: #000000; line-height: 170%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 170%;">Feel free to reach out to me. I'd love to learn more about
                                  the role.</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table id="u_content_social_1" style="font-family:'Lato',sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                              align="left">

                              <div align="center">
                                <div style="display: table; max-width:128px;">
                                  <!--[if (mso)|(IE)]><table width="128" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:128px;"><tr><![endif]-->


                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 11px;" valign="top"><![endif]-->
                                  <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                    style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 11px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td align="left" valign="middle"
                                          style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://www.linkedin.com/in/ryan-griego-2134a340/" title="LinkedIn"
                                            target="_blank">
                                            <img
                                              src="https://cdn.tools.unlayer.com/social/icons/rounded-black/linkedin.png"
                                              alt="LinkedIn" title="LinkedIn" width="32"
                                              style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 11px;" valign="top"><![endif]-->
                                  <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                    style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 11px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td align="left" valign="middle"
                                          style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://github.com/ryan-griego" title="GitHub" target="_blank">
                                            <img
                                              src="https://cdn.tools.unlayer.com/social/icons/rounded-black/github.png"
                                              alt="GitHub" title="GitHub" width="32"
                                              style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                  <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32"
                                    style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td align="left" valign="middle"
                                          style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="mailto:ryangriego@gmail.com" title="Email" target="_blank">
                                            <img
                                              src="https://cdn.tools.unlayer.com/social/icons/rounded-black/email.png"
                                              alt="Email" title="Email" width="32"
                                              style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->


                                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                </div>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                        width="100%" border="0">
                        <tbody>
                          <tr>
                            <td class="v-container-padding-padding"
                              style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Lato',sans-serif;"
                              align="left">

                              <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <tbody>
                                  <tr style="vertical-align: top">
                                    <td
                                      style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <span>&#160;</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
    </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>
</html>
  `
            }
          ]
        }
  } else if(this.dialog === 'thankyou') {
        msg = {
                "personalizations": [
                  {
                    to: [
                      {
                        email: "ryangriego@gmail.com",
                        name: "test"
                      }
                    ]
                  }
                ],
                "from": {
                  email: "ryan@ryangriego.com",
                  name: "Ryan Griego"
                },
                "subject": `Thank you for the interview ${jobPosterName}`,
                "content": [
                  {
                    type: "text/plain",
                    value: "Thank you for having me interview for your position. I am excited to learn more about the opportunity and how I can contribute to your team. I am looking forward to the next steps in the process."
                  }
                ]
          }
      }

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
