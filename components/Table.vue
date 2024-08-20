<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { useGlobalState } from '~/composables/state';
import { generateQRCodeAndUpload } from '~/utils/QRCodeGenerator';


export default {
  emits: ['sendEmail', 'getEmail', 'updateRow', 'deleteRow', 'openAddContactModal'],
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
    console.log("got into generateQRCode");
         await generateQRCodeAndUpload(url, jobId, name, companyName, jobTitle);
    },
    batchSendEmails() {
      // Get selected data
      const selectedData = this.tabulator.getSelectedData();
      const rawData = selectedData.map(row => toRaw(row));

      // Filter rows based on required fields
      const filteredRows = rawData.filter(row =>
        row.jobPosterName && row.jobPosterEmail && row.companyName && row.jobTitle// && row.status === 'Applied'
      );
      // Log the filtered rows
      console.log(filteredRows);
      const vueInstance = this;

      filteredRows.forEach(row => {
        console.log("got into foreach in table");
        console.log("log the row in foreach", row);
        /// vueInstance.$emit('open-email-modal', row);

        this.$emit('sendEmail', { type: 'just-applied', payload: row });

      });
      // vueInstance.$emit('open-email-modal', cell.getRow().getData());
    },
  },

  mounted() {

    const vueInstance = this;
    const globalState = useGlobalState();
    this.tabulator = new Tabulator(this.$refs.table, {
     pagination: "local",
     paginationSize: 50,
      rowContextMenu: [
    {
        label:"Delete row",
        action:function(e, row){
           vueInstance.$emit('delete-row', row.getData());
           row.delete();
        }
    },
    // NOT WORKING
     {
        label:"Update row",
        action:function(e, row){
            let rowData = row.getData();
            let companyOfficialUrl = rowData.companyOfficialUrl;
            let jobId = rowData.jobId;
            let jobPosterName = rowData.jobPosterName;
            let jobPosterEmail = rowData.jobPosterEmail;
            let qrCodeUrl = rowData.qrCodeUrl;

            let rowInfo = {companyOfficialUrl, jobId, jobPosterName, jobPosterEmail, qrCodeUrl};
            // Update the Mongo DB document using the jobId with the value of the company domain
            vueInstance.$emit('update-row', rowInfo);
        }
    },
         {
        label:"Add Contact",
        action:function(e, row){
            let rowData = row.getData();
            let jobId = rowData.jobId;
            let rowInfo = {jobId};
            // Update the Mongo DB document using the jobId with the value of the company domain
            vueInstance.$emit('open-add-contact-modal', rowInfo);
        }
    },
    {
        label: 'Generate QR Code',
        action: async (e, row) => {
          const rowData = row.getData();
          const jobId = rowData.jobId;
          const url = rowData.companyOfficialUrl;
          const name = rowData.jobPosterName.split(' ')[0];
          const companyName = rowData.companyName;
          const jobTitle = rowData.jobTitle;

          if (url && jobId && name && companyName && jobTitle) {
            await this.generateQRCode(url, jobId, name, companyName, jobTitle);
          }
        }
      },
    ],
      data: this.jobs,
      reactiveData: true,
      layout: "fitColumns",
      columns: [
          {formatter:"rowSelection",
          titleFormatter:"rowSelection", titleFormatterParams:{
            rowRange:"active" //only toggle the values of the active filtered rows
          },
          hozAlign:"center",
          headerSort:false
          },
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
      { title: "Job ID", field: "jobId", sorter: "number", minWidth: 100, visible:false },
      { title: "Job Title", field: "jobTitle", sorter: "string", minWidth: 160},
      { title: "Status", field: "status", sorter: "string", minWidth: 100 },
     { title: "QR Code Url", field: "qrCodeUrl", sorter: "string", minWidth: 100, editor:'input' },

{ title: "QR Code", field: "qrCodeUrl", sorter: "string", minWidth: 100,formatter: function (cell, formatterParams, onRendered) {
                        let rowData = cell.getRow().getData();
                        let url = rowData.qrCodeUrl ?  rowData.qrCodeUrl : "https://www.ryangriego.com/assets/icons/vue.svg";
                              const backupImageUrl = "https://www.ryangriego.com/assets/icons/vue.svg"; // Replace with your actual backup image URL
                        return `
                          <img
                            src="${url}"
                            style="height:40px;width:40px;"
                            onerror="this.onerror=null;this.src='${backupImageUrl}';"
                            alt="Company Logo"
                          >
                        `; },
      },



{ title: "Company Name", field: "companyName", sorter: "string", minWidth: 150 },
      { title: "Company Url", field: "companyOfficialUrl", sorter: "string", minWidth: 150, visible: true, editor:'input'},
      { title: "Job Location", field: "jobLoscation", sorter: "string", minWidth: 120, visible: false },
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
      {
        title: "Job Poster Name",
        field: "jobPosterName",
        sorter: "string",
        minWidth: 150,
        editor: 'input',
        formatter: function(cell) {
          let names = cell.getValue();
          if (Array.isArray(names)) {
            return names.join(", ");
          }
          return names;
        }
      },
      {
        title: "Job Poster Emails",
        field: "jobPosterEmail",
        sorter: "string",
        editor:'input',
        minWidth: 200,
        formatter: function(cell) {
          let emails = cell.getValue();
          if (Array.isArray(emails)) {
            return emails.join(", ");
          }
          return emails;
        }
      },
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
            if(cell) {
            let rowData = cell.getRow().getData();
          if(rowData.jobPosterEmail) {
              let button = document.createElement("button");
              button.classList.add("action-button");
              button.innerHTML = 'Send Email';
              button.addEventListener("click", (e) => {
                vueInstance.$emit('open-email-modal', cell.getRow().getData());
              });
              return button;
            } else if(!rowData.jobPosterEmail && rowData.companyOfficialUrl && rowData.jobPosterName) {
                let button = document.createElement("button");
                button.classList.add("action-button");
                button.innerHTML = 'Get Email';
                button.addEventListener("click", (e) => {
                  vueInstance.$emit('get-email', cell.getRow().getData());
                });
                return button;
            }
            else {
              return '';
            }
          }
        },
        }
      ]

    });
    this.tabulator.on("rowDblClick", (e, row) => {
      let rowData = toRaw(row.getData());
      globalState.value.rowData = rowData;
        this.tabulator.redraw(true);
        navigateTo("/job")
    });
  }
}
</script>
<template>
<button @click="batchSendEmails" style="
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
  <div ref="table"></div>

</template>
