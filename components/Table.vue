<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { useGlobalState } from '~/composables/state';
import { generateQRCodeAndUpload } from '~/utils/QRCodeGenerator';

export default {
  emits: ['sendEmail', 'getEmail', 'updateRow', 'deleteRow', 'notify', 'openEmailModal'],
  props: {
      jobs: {
      type: Array,
      required: true
    },
    isRemote: {
      type: Boolean,
      default: null
    },
  },
  data() {
    return {
      isAdmin: false,
      tabulator: null,
      tableData: this.jobs,
      keywords: [],
    }
  },

  computed: {

  },

  methods: {
    updateTableData() {
      this.tabulator.setData(this.jobs);
    },

      async generateQRCode(url, jobId, name, companyName, jobTitle) {
         await generateQRCodeAndUpload(url, jobId, name, companyName, jobTitle);
    },
    batchSendEmails() {
      const selectedData = this.tabulator.getSelectedData();
      const rawData = selectedData.map(row => toRaw(row));
      const filteredRows = rawData.filter(row =>
        row.jobPosterName && row.jobPosterEmail && row.companyName && row.jobTitle// && row.status === 'Applied'
      );
      console.log(filteredRows);
      const vueInstance = this;

      filteredRows.forEach(row => {
        this.$emit('sendEmail', { type: 'just-applied', payload: row });
      });

    },
  },

  mounted() {

    const vueInstance = this;
    const globalState = useGlobalState();
    const config = useRuntimeConfig();
    const userMode = config.public.mode;
    const showColumn = config.public.mode === 'admin';
    const isAdmin = userMode === 'admin';

    this.tabulator = new Tabulator(this.$refs.table, {
     pagination: "local",
     paginationSize: 50,
      rowContextMenu: [
    {
        label:"Delete row",
        action: (e, row) => {
          if(isAdmin) {
            vueInstance.$emit('delete-row', row.getData());
            row.delete();
          } else {
            vueInstance.$emit('notify', 'in-guest-mode');
          }
        },
    },
     {
        label:"Update row",
        action:function(e, row){
          if(isAdmin) {
            let rowData = row.getData();
            let companyOfficialUrl = rowData.companyOfficialUrl;
            let jobId = rowData.jobId;
            let jobPosterName = rowData.jobPosterName;
            let jobPosterEmail = rowData.jobPosterEmail;
            let qrCodeUrl = rowData.qrCodeUrl;
            let outcome = rowData.outcome;
            let rowInfo = {companyOfficialUrl, jobId, jobPosterName, jobPosterEmail, qrCodeUrl, outcome};
            vueInstance.$emit('update-row', rowInfo);
          } else {
            vueInstance.$emit('notify', 'in-guest-mode');
          }
        }
    },
    {
        label: 'Generate QR Code',
        action: async (e, row) => {

          if(isAdmin) {
            const rowData = row.getData();
            const jobId = rowData.jobId;
            const url = rowData.companyOfficialUrl;
            //const name = rowData.jobPosterName.split(' ')[0];
            if(Array.isArray(rowData.jobPosterName)) {
              name = rowData.jobPosterName[0].split(' ')[0];
            } else {
              name = rowData.jobPosterName.split(' ')[0];
            }

            const companyName = rowData.companyName;
            const jobTitle = rowData.jobTitle;

            if (url && jobId && name && companyName && jobTitle) {
              await this.generateQRCode(url, jobId, name, companyName, jobTitle);
            }
          } else {
            vueInstance.$emit('notify', 'in-guest-mode');
          }
        }
      },
    ],
      data: this.jobs,
      reactiveData: true,

      layout: "fitColumns",
      columns: [
          // {formatter:"rowSelection",
          // titleFormatter:"rowSelection", titleFormatterParams:{
          //   rowRange:"active"
          // },
          // hozAlign:"center",
          // headerSort:false
          // },
         { title: "", field: "logo",maxWidth:40, formatter: function (cell, formatterParams, onRendered) {
          let rowData = cell.getRow().getData();
          let url = rowData.companyLogoUrl ?  rowData.companyLogoUrl : "https://www.ryangriego.com/assets/icons/vue.svg";
                const backupImageUrl = "https://www.ryangriego.com/assets/icons/vue.svg";
          return `
            <img
              src="${url}"
              style="height:40px;width:40px;"
              onerror="this.onerror=null;this.src='${backupImageUrl}';"
              alt="Company Logo"
            >
          `;
         }

        },
      { title: "Job ID", field: "jobId", sorter: "number", minWidth: 100, visible:true },
      { title: "Job Title", field: "jobTitle", sorter: "string", minWidth: 160},
      { title: "Job Type", field: "jobType", sorter: "string", minWidth: 160},
      { title: "Sent Follow Up1", field: "sentFollowUp1", sorter: "string", minWidth: 160},
      { title: "Status", field: "status", sorter: "string", minWidth: 100 },
      { title: "Outcome", field: "outcome", sorter: "string", minWidth: 150, editor: userMode === 'admin' ? 'input' : false, },
    //  { title: "QR Code Url", field: "qrCodeUrl", sorter: "string", minWidth: 100, editor: userMode === 'admin' ? 'input' : false, },

    // { title: "QR Code", field: "qrCodeUrl", sorter: "string", minWidth: 100,formatter: function (cell, formatterParams, onRendered) {
    //       let rowData = cell.getRow().getData();
    //       let url = rowData.qrCodeUrl ?  rowData.qrCodeUrl : "https://www.ryangriego.com/assets/icons/vue.svg";
    //             const backupImageUrl = "https://www.ryangriego.com/assets/icons/vue.svg"; // Replace with your actual backup image URL
    //       return `
    //         <img
    //           src="${url}"
    //           style="height:40px;width:40px;"
    //           onerror="this.onerror=null;this.src='${backupImageUrl}';"
    //           alt="Company Logo"
    //         >
    //       `; },
    //   },



{ title: "Company Name", field: "companyName", sorter: "string", minWidth: 150 },
      { title: "Company URL", field: "companyUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Company Url", field: "companyOfficialUrl", sorter: "string", minWidth: 150, visible: true, editor: userMode === 'admin' ? 'input' : false,},
      // { title: "Job Location", field: "jobLocation", sorter: "string", minWidth: 120, visible: false },
      { title: "Job Type", field: "jobType", sorter: "string", minWidth: 120, visible: true },
      { title: "Posted At", field: "postedAt", sorter: "date", minWidth: 200, visible: false },
      { title: "Applies Closed At", field: "appliesClosedAt", sorter: "date", minWidth: 200, visible: false },
      { title: "Added", field: "timestamp", sorter: "date", minWidth: 100,formatter: (cell) => {

       const date = new Date(cell.getValue());
         return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      },  },

      { title: "Job Description", field: "jobDescription", sorter: "string", minWidth: 200, visible: false },
        {
          title: "Matching Keywords", field: "matchingKeywords", sorter: "string", minWidth: 200, visible: true, formatter: function (cell) {
            let rowData = toRaw(cell.getRow().getData());
            let keywords = toRaw(globalState.value.keywords);
            let jobDescription = rowData.jobDescription;

            if (rowData.jobDescription) {
              let jobDescription = rowData.jobDescription;
              let keywordCounts = keywords.reduce((counts, keyword) => {
                let regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                let matches = jobDescription.match(regex);
                if (matches) {
                  counts[keyword] = matches.length;
                }
                return counts;
              }, {});

              let keywordMatchCount = Object.keys(keywordCounts).length;
              let keywordCountsArray = Object.entries(keywordCounts);
              let keywordCountsString = keywordCountsArray.map(function ([keyword, count], index) {
                if (index === keywordCountsArray.length - 1) {
                  return keyword;
                } else {
                  return keyword + ', ';
                }
              }).join('');

              if(keywordMatchCount == 0) {
                return 'None';
              }

              keywordCountsString = 'Total: ' + keywordMatchCount + '</br>' + keywordCountsString;
              return keywordCountsString;

            }
              return 'None';
          } },

      { title: "Workplace Type", field: "workplaceType", sorter: "string", minWidth: 100, visible: false  },
      { title: "Job Poster Profile URL", field: "jobPosterProfileUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Job Poster Name", field: "jobPosterName", sorter: "string", minWidth: 150, editor: userMode === 'admin' ? 'input' : false, visible: userMode === 'admin' ? true : false},
      { title: "Job Poster Email", field: "jobPosterEmail", sorter: "string", visible: userMode === 'admin' ? true : false, minWidth: 150, editor: userMode === 'admin' ? 'input' : false, },
      { title: "Company Logo URL", field: "companyLogoUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Apply URL", field: "applyUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Views Count", field: "viewsCount", sorter: "number", minWidth: 80, visible: false },
      { title: "Company Staff Count", field: "companyStaffCount", sorter: "number", minWidth: 200, visible: false },
      { title: "Company Description", field: "companyDescription", sorter: "string", minWidth: 200, visible: false },
      { title: "Job Industries", field: "jobIndustries", sorter: "string", minWidth: 200, visible: false  },
      { title: "Source", field: "source", sorter: "string", minWidth: 100, visible: false },
      { title: "Job Functions", field: "jobFunctions", sorter: "string", minWidth: 200, visible: false },
      { title: "Remote Allowed", field: "remoteAllowed", sorter: "boolean", minWidth: 40, visible: false },
      { title: "Job Type", field: "jobType", sorter: "string", minWidth: 80, visible: false },
      { title: "Applicants Count", field: "applicantsCount", sorter: "number", minWidth: 80, visible: false },
      { title: "Experience Level", field: "experienceLevel", sorter: "string", minWidth: 100, visible: false },
       {
          title: "Actions",
          field: "actions",
          width: 100,
          formatter: function (cell, formatterParams, onRendered) {
            let rowData = cell.getRow().getData();
          if(rowData.jobPosterEmail) {
              let button = document.createElement("button");
              button.style.padding = "2px";
              button.style.backgroundColor = "green";
              button.style.border = "none";
              button.style.borderRadius = "5px";
              button.style.cursor = "pointer";
              button.innerHTML = 'Send Email';
              button.addEventListener("click", (e) => {
                if(!isAdmin) {
                     return vueInstance.$emit('notify', 'in-guest-mode');
                } else {
                vueInstance.$emit('openEmailModal', cell.getRow().getData());
                }
              });
              return button;
            } else if(!rowData.jobPosterEmail && rowData.companyOfficialUrl && rowData.jobPosterName) {
                let button = document.createElement("button");
                button.style.padding = "4px";
                button.style.backgroundColor = "green";
                button.style.border = "none";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";
                button.innerHTML = 'Get Email';
                button.addEventListener("click", (e) => {
                  if(!isAdmin) {
                     return vueInstance.$emit('notify', 'in-guest-mode');
                  } else {
                    vueInstance.$emit('get-email', cell.getRow().getData());
                  }

                });
                return button;
            }
          }
        },
      ],
    });
    if(isAdmin) {
      this.tabulator.on("rowDblClick", (e, row) => {
      let rowData = toRaw(row.getData());
      globalState.value.rowData = rowData;
      this.tabulator.redraw(true);
      navigateTo("/job")
    });
    }

  }
}
</script>
<template>
  <button v-if="isAdmin" @click="batchSendEmails" style="
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
">
  Batch send emails
</button>
  <div ref="table" class="mb-4"></div>

</template>
