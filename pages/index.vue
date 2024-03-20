<template>
    <v-container>
        <!-- <div className="overlay-intro"></div> -->
<div>
<v-row class="outside-table d-flex align-end">
  <v-col cols="2" class="d-flex align-center">
    <img alt="Man 1" height="auto" src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1710832996/new-6_zuoc2x.jpg" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="300">
  </v-col>
   <v-col cols="1" class="d-flex align-end"></v-col>
   <v-col cols="3" class="d-flex align-end mb-3">
      <div class="text-end">
        <v-btn color="rgb(28, 255, 206)" class="mr-3" @click="runJobScraper">Run Scraper</v-btn>
      </div>
      <div class="text-end">
        <v-btn color="rgb(28, 255, 206)" class="mr-3" @click="fetchNewJobs">Fetch Jobs</v-btn>
      </div>
      <div class="text-end">
      <v-btn outlined class="pr-2" style="background-color: rgba(250,250,250,0.2);color: #1cffcefa;" text @click="updateTable">Refresh Data</v-btn>
      </div>
   </v-col>
<v-col cols="6" class="d-flex justify-end">
      <span class="mr-2">Filters:</span>
  <v-card outlined class="pa-2 d-flex flex-row align-start" style="border: .5px solid rgb(28, 255, 206); background-color: transparent; color: #1cffcefa;">
    <v-checkbox v-model="filters.isRemote" label="Remote" class="pr-4"></v-checkbox>
    <v-select v-model="filters.status" :items="statuses" label="View by Status" class="flex-grow-1" style="min-width: 200px;"></v-select>
    <v-btn outlined class="mx-4 my-2" style="background-color: rgba(250,250,250,0.2);color: #1cffcefa;" text @click="resetFilters">Clear Filters</v-btn>
  </v-card>
</v-col>
</v-row>
    <div style="background-color:#011918;">
      <p class="p-1 outside-table">Total # of jobs {{ numberOfJobs }}</p>
    </div>
      <Table @open-email-modal="openEmailModal" @send-email="sendEmail" @get-email="getEmail" @update-row="updateRow" @delete-row="deleteRow" :jobs="jobs_filtered" :isRemote="filters.isRemote" class="mb-4" ref="main_table"/>
    <v-dialog
      v-model="isDialogOpen"
      width="auto"
      scrollable
    >
      <template v-slot:default="{ isActive }">
        <v-card
          prepend-icon="mdi-email-fast-outline"
          title="Select Email Type"
          dark
        >
          <v-divider class="mt-3"></v-divider>
          <v-card-text class="px-4" style="height: 100px;">
            <v-radio-group
              v-model="dialog"
              column
              dark
            >
              <v-radio
                label="Just Applied"
                value="just-applied"
              ></v-radio>
              <v-radio
                label="Thank you"
                value="thankyou"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              text="Close"
              @click="isActive.value = false"
            ></v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="surface-variant"
              text="Send"
              variant="flat"
              @click="isActive.value = false; sendEmail()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
        </div>
    </v-container>
</template>

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
    isDialogOpen: false,
    dialog: '',
    rowData: {},
    jobs: [],
    // Do i really need this
    msg: {
      "personalizations": [
        {
          to: [
            {
              email: "test@test.com",
              name: "CompanyUrl"
            }
          ]
        }
      ],
      "from": {
        email: "ryangriego@gmail.com",
        name: "Ryan Griego - Sofware Engineer"
      },
      "subject": "Test message!",
      "content": [
        {
          type: "text/plain",
          value: "Test message"
        },
        {
          type: "text/html",
          value: "<h1>Test message!</h1>"
        }
      ]
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
      // What would be the most valuable default method to filter the data?
      //CONSIDER A SWITCH STATEMENT
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
      // if(this.filters.status === 'Sent') {
      //   return this.jobs.jobs.filter(job => job.status === 'Sent');
      // }
      // if(this.filters.status === 'Applied') {
      //   return this.jobs.jobs.filter(job => job.status === 'Applied');
      // }
      // if(this.filters.isRemote === true) {
      //     return this.jobs.jobs.filter(job => job.remoteAllowed === true);
      // } else {
      // return this.jobs.jobs;
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
      const { data, error } = await useFetch("/api/runjobscraper", {
        method: "POST",
      });
      if(error.value === 'error') {
        //return an error message
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
        let urls = output.match(/https?:\/\/[^\s]+/g);
        let lastUrl = urls[urls.length -1];
        const getJobsJson = await fetch(lastUrl);
        let jobsData = await getJobsJson.json();
        // DOUBLE CHECK THAT IF JOB POSTER INFORMATION IS COMING THROUGH THAT DUBPLICATE HEADERS ARE NOT CREATED
        jobsData = jobsData.map(job => ( {
            ...job,
            companyOfficialUrl: '',
            status: 'Applied',
            jobPosterEmail: '',
            jobPosterName: '',
            jobPosterProfileUrl: ','
        }));
          const { data: jobs } = await useFetch("/api/addjobs", {
            method: "POST",
            body: jobsData
        });
      }
      if(error.value === 'error') {
         this.notify('fail-fetch-new-jobs');
        //return an error message
      }
    },
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
      this.isDialogOpen = true;
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
            email: "ryangriego@gmail.com",
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
              value: `<!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>
    </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a {
        padding: 0;
      }

      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      p {
        display: block;
        margin: 13px 0;
      }
    </style>
    <!--[if mso]>
          <noscript>
          <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          </noscript>
          <![endif]-->
    <!--[if lte mso 11]>
          <style type="text/css">
            .mj-outlook-group-fix { width:100% !important; }
          </style>
          <![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-40 {
          width: 40% !important;
          max-width: 40%;
        }

        .mj-column-per-60 {
          width: 60% !important;
          max-width: 60%;
        }

        .mj-column-px-200 {
          width: 200px !important;
          max-width: 200px;
        }

        .mj-column-px-400 {
          width: 400px !important;
          max-width: 400px;
        }

        .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }

        .mj-column-per-33-333333333333336 {
          width: 33.333333333333336% !important;
          max-width: 33.333333333333336%;
        }

        .mj-column-per-50 {
          width: 50% !important;
          max-width: 50%;
        }
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        .emailImage {
          height: auto !important;
          max-width: 600px !important;
          width: 100% !important;
        }
      }
          @media only screen and (min-width: 480px){
          .social-icons-footer{
              text-align:right !important;

          }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-40 {
        width: 40% !important;
        max-width: 40%;
      }

      .moz-text-html .mj-column-per-60 {
        width: 60% !important;
        max-width: 60%;
      }

      .moz-text-html .mj-column-px-200 {
        width: 200px !important;
        max-width: 200px;
      }

      .moz-text-html .mj-column-px-400 {
        width: 400px !important;
        max-width: 400px;
      }

      .moz-text-html .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }

      .moz-text-html .mj-column-per-33-333333333333336 {
        width: 33.333333333333336% !important;
        max-width: 33.333333333333336%;
      }

      .moz-text-html .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width:480px) {
        table.mj-full-width-mobile {
          width: 100% !important;
        }

        td.mj-full-width-mobile {
          width: auto !important;
        }
      }

      noinput.mj-menu-checkbox {
        display: block !important;
        max-height: none !important;
        visibility: visible !important;
      }

      @media only screen and (max-width:480px) {
        .mj-menu-checkbox[type="checkbox"]~.mj-inline-links {
          display: none !important;
        }

        .mj-menu-checkbox[type="checkbox"]:checked~.mj-inline-links,
        .mj-menu-checkbox[type="checkbox"]~.mj-menu-trigger {
          display: block !important;
          max-width: none !important;
          max-height: none !important;
          font-size: inherit !important;
        }

        .mj-menu-checkbox[type="checkbox"]~.mj-inline-links>a {
          display: block !important;
        }

        .mj-menu-checkbox[type="checkbox"]:checked~.mj-menu-trigger .mj-menu-icon-close {
          display: block !important;
        }

        .mj-menu-checkbox[type="checkbox"]:checked~.mj-menu-trigger .mj-menu-icon-open {
          display: none !important;
        }
      }
    </style>
  </head>

  <body style="word-spacing:normal;background-color:#d6dde5;">
    <div style="background-color:#d6dde5;">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:240px;" ><![endif]-->
                <div class="mj-column-per-40 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                              <td>
                               <h1 style="display:inline-block;color:#3d3b3b;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:26px;font-weight:normal;line-height:12px;text-decoration:none;text-transform:uppercase;padding:0px 10px;">Ryan Griego</h1>
                              </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:360px;" ><![endif]-->
                <div class="mj-column-per-60 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding-top:5px;word-break:break-word;">
                          <!--[if !mso><!-->
                          <input type="checkbox" id="c77f46b2b2fd0f30" class="mj-menu-checkbox"
                            style="display:none !important; max-height:0; visibility:hidden;" />
                          <!--<![endif]-->
                          <div class="mj-menu-trigger"
                            style="display:none;max-height:0px;max-width:0px;font-size:0px;overflow:hidden;">
                            <label for="c77f46b2b2fd0f30" class="mj-menu-label"
                              style="display:block;cursor:pointer;mso-hide:all;-moz-user-select:none;user-select:none;color:#303030;font-size:30px;font-family:Ubuntu, Helvetica, Arial, sans-serif;text-transform:uppercase;text-decoration:none;line-height:30px;padding:10px;"
                              align="center">
                              <span class="mj-menu-icon-open" style="mso-hide:all;"> &#9776; </span>
                              <span class="mj-menu-icon-close" style="display:none;mso-hide:all;"> &#8855; </span>
                            </label>
                          </div>
                          <div class="mj-inline-links" style="">
                            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td style="padding:15px 10px;" class="" ><![endif]-->
                            <a class="mj-link" href="https://www.ryangriego.com"
                              target="_blank"
                              style="display:inline-block;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:22px;text-decoration:none;text-transform:uppercase;padding:15px 10px;">
                            <span style="text-decoration: none; border-bottom: 2px solid #1a9ba2;letter-spacing:.2px;">Portfolio</span>
                            </a>
                            <!--[if mso | IE]></td><td style="padding:15px 10px;" class="" ><![endif]-->
                            <a class="mj-link"
                              href="https://www.ryangriego.com/assets/ryan_griego_resume.pdf"
                              target="_blank"
                              style="display:inline-block;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:22px;text-decoration:none;text-transform:uppercase;padding:15px 10px;">
                            <span style="text-decoration: none; border-bottom: 2px solid #1a9ba2;letter-spacing:.2px;">Resume</span>
                            </a>
                            </a>
                            <!--[if mso | IE]></td><td style="padding:15px 10px;" class="" ><![endif]-->
                            <a class="mj-link"
                              href="https://www.linkedin.com/in/ryan-griego-2134a340/"
                              target="_blank"
                              style="display:inline-block;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:22px;text-decoration:none;text-transform:uppercase;padding:15px 10px;">
                              <span style="text-decoration: none; border-bottom: 2px solid #1a9ba2;letter-spacing:.2px;">LinkedIn</span>
                              </a>
                            </a>
                            <!--[if mso | IE]></td></tr></table><![endif]-->
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#1a9ba2" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#1a9ba2;background-color:#1a9ba2;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#1a9ba2;background-color:#1a9ba2;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:200px;" ><![endif]-->
                <div class="mj-column-px-200 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="left"
                          style="font-size:0px;padding:10px 25px;padding-top:40px;padding-right:25px;padding-bottom:10px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:40px;line-height:1;text-align:left;color:#ffffff;">
                            <p style="font-size: 22px;line-height: 1.8rem">Hi ${jobPosterName},</p>
                            <p style="font-size: 13px;line-height: 1.2rem;">I recently applied for the ${jobTitle} position at ${companyName} and
                              wanted to reach out and further express my interest in the&nbsp;position.<br /></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle"
                          style="font-size:0px;padding:15px 30px;padding-right:25px;padding-bottom:10px;padding-left:25px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:separate;line-height:100%;">
                            <tr>
                              <td align="center" bgcolor="#ffffff" role="presentation"
                                style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#ffffff;"
                                valign="middle">
                                <a href="https://www.ryangriego.com/"
                                  style="display:inline-block;background:#ffffff;color:#1a9ba2;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;"
                                  target="_blank"> Check Me out </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:400px;" ><![endif]-->
                <div class="mj-column-px-400 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:400px;">
                                  <img alt="Company Logo" height="auto"
                                    src="${companyLogoUrl}"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                    width="400" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#2f323b" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#2f323b;background-color:#2f323b;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#2f323b;background-color:#2f323b;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:10px;padding-right:25px;padding-bottom:10px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:18px;line-height:1;text-align:center;color:#ffffff;">
                            <p> 💻&nbsp;&nbsp;A FEW OF MY TECHNICAL SKILLS&nbsp;&nbsp;💻</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:bottom;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:30px;padding-right:0px;padding-bottom:20px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:120px;">
                                  <img alt="React" height="120"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231480/portfolio/icons/react_yz6djo.png"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:120px;width:100%;font-size:13px;"
                                    width="120" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:bold;line-height:1;text-align:center;color:#000000;">
                            <p>REACT</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:bottom;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-right:0px;padding-bottom:20px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:120px;">
                                  <img alt="Vue" height="120"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231952/portfolio/icons/vue_fq4345.png"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:120px;width:100%;font-size:13px;"
                                    width="120" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:bold;line-height:1;text-align:center;color:#000000;">
                            <p>VUE</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:bottom;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:30px;padding-right:0px;padding-bottom:20px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:120px;">
                                  <img alt="Javascript" height="120"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231480/portfolio/icons/javascript_ifuclz.png"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:120px;width:100%;font-size:13px;"
                                    width="120" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:bold;line-height:1;text-align:center;color:#000000;">
                            <p>JAVASCRIPT</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:bottom;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:20px;padding-right:0px;padding-bottom:20px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:129px;">
                                  <img alt="HTML5" height="120"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231480/portfolio/icons/html5_kuymet.png"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:120px;width:100%;font-size:13px;"
                                    width="129" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:bold;line-height:1;text-align:center;color:#000000;">
                            <p>HTML5</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:bottom;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:20px;padding-right:0px;padding-bottom:20px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:120px;">
                                  <img alt="CSS3" height="120"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626231480/portfolio/icons/css3_qvw5pn.png"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:120px;width:100%;font-size:13px;"
                                    width="120" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:bold;line-height:1;text-align:center;color:#000000;">
                            <p>CSS3</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:bottom;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:20px;padding-right:0px;padding-bottom:20px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:120px;">
                                  <img alt="PHP" height="120"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1710817780/php-logo_yrgo45.png"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:120px;width:100%;font-size:13px;"
                                    width="120" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:bold;line-height:1;text-align:center;color:#000000;">
                            <p>PHP</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#1a9ba2" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#1a9ba2;background-color:#1a9ba2;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#1a9ba2;background-color:#1a9ba2;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:300px;">
                                  <img alt="Man 1" height="auto"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626543265/portfolio/ryan-email-space_usthuf.png"
                                    style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                    width="300" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="left"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#ffffff;">
                            <p style="font-size: 19px;">Ryan </p>
                            <p style="font-size: 36px;margin-top:-5px;">explores the unknown</p>
                            <p>Check out his track record of companies.</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle"
                          style="font-size:0px;padding:15px 30px;padding-top:0;padding-bottom:10px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:separate;line-height:100%;">
                            <tr>
                              <td align="center" bgcolor="#ffffff" role="presentation"
                                style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#ffffff;"
                                valign="middle">
                                <a href="https://www.ryangriego.com/assets/ryan_griego_resume.pdf"
                                  style="display:inline-block;background:#ffffff;color:#1a9ba2;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;"
                                  target="_blank">
                                  <strong>VIEW RESUME</strong>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#18b082" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#18b082;background-color:#18b082;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#18b082;background-color:#18b082;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="left"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#ffffff;">
                            <p style="font-size: 19px;">Ryan </p>
                            <p style="font-size: 36px;margin-top:-5px;">dives deep to find solutions</p>
                            <p>Check out the technologies he works with.</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle"
                          style="font-size:0px;padding:15px 30px;padding-top:0;padding-bottom:10px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:separate;line-height:100%;">
                            <tr>
                              <td align="center" bgcolor="#ffffff" role="presentation"
                                style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#ffffff;"
                                valign="middle">
                                <a href="https://www.ryangriego.com/"
                                  style="display:inline-block;background:#ffffff;color:#1a9ba2;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;"
                                  target="_blank">
                                  <strong>VIEW PORTFOLIO</strong>
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
                <div class="mj-column-per-50 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:300px;">
                                  <img alt="Man 2" height="auto"
                                    src="https://res.cloudinary.com/dm7y3yvjp/image/upload/v1626543265/portfolio/ryan-email-scuba_hzc5nt.png"
                                    style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                    width="300" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#2f323b" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#2f323b;background-color:#2f323b;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#2f323b;background-color:#2f323b;width:100%;">
          <tbody>
            <tr>
              <td
                style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <!-- <mj-image src="http://191n.mj.am/img/191n/3s/x48.png" alt="Currencies" align="center" border="none" width="70px" padding-left="25px" padding-right="25px" padding-bottom="0px" padding-top="10px"></mj-image> -->
                      <tr>
                        <td align="center"
                          style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                          <div
                            style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#ffffff;">
                            <p style="font-size: 45px;font-weight: bold;">R/G</p>
                            <p style="font-size: 15px;font-weight: bold;">Thank you for checking me out</p>
                            <p style="line-height:20px">This email was sent with a full-stack app I built with Nuxt 3, SendGrid, and&nbsp;axios, and MongoDB.</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#eeeee" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background:#eeeee;background-color:#eeeee;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#eeeee;background-color:#eeeee;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:10px;padding-top:0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td align="left"
                          style="font-size:0px;padding:10px 25px;padding-top:20px;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:180px;">
                                  <a href="https://www.ryangriego.com/assets/ryan_griego_resume.pdf" target="_blank">
                                    <img alt="Ryan Griego logo" height="auto"
                                      src="https://www.ryangriego.com/images/portfolio-ryan-logo.png"
                                      style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                      width="180" />
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix"
                  style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;"
                    width="100%">
                    <tbody>
                      <!-- <mj-text align="center" color="black" font-size="13px" padding-left="25px" padding-right="25px" padding-bottom="0px" padding-top="25px" href="tel:+19493108534">
  Call me maybe?
          </mj-text> -->
                      <tr>
                        <td align="center" vertical-align="middle"
                          style="font-size:0px;padding:15px 30px;padding-right:5px;padding-bottom:10px;padding-left:5px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="border-collapse:separate;line-height:100%;">
                            <tr>
                              <td align="center" bgcolor="#1a9ba2" role="presentation"
                                style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#1a9ba2;"
                                valign="middle">
                                <a href="tel:+19493108534"
                                  style="display:inline-block;background:#1a9ba2;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;"
                                  target="_blank"> Call (949) 310 - 8534 </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:200px;" ><![endif]-->
                <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix social-icons-footer"
                  style="font-size:0px;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                          <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td><![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="float:none;display:inline-table;">
                            <tr>
                              <td style="padding:4px;vertical-align:middle;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                  style="background:#0077b5;border-radius:3px;width:20px;">
                                  <tr>
                                    <td style="font-size:0;height:20px;vertical-align:middle;width:20px;">
                                      <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://www.linkedin.com/in/ryan-griego-2134a340/&title=&summary=&source="
                                        target="_blank">
                                        <img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png"
                                          style="border-radius:3px;display:block;" width="20" />
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!--[if mso | IE]></td><td><![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                            style="float:none;display:inline-table;">
                            <tr>
                              <td style="padding:4px;vertical-align:middle;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                  style="background:#000000;border-radius:3px;width:20px;">
                                  <tr>
                                    <td style="font-size:0;height:20px;vertical-align:middle;width:20px;">
                                      <a href="https://github.com/ryan-griego/" target="_blank">
                                        <img height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/github.png"
                                          style="border-radius:3px;display:block;" width="20" />
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!--[if mso | IE]></td></tr></table><![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td
                style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:0px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
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
                  email: "ryangriego@gmail.com",
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
