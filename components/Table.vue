<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { useGlobalState } from '~/composables/state'

export default {
  emits: ['sendEmail', 'getEmail', 'updateRow', 'deleteRow'],
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
    }
  },

  computed: {

  },

  methods: {
    updateTableData() {
      this.tabulator.setData(this.jobs);
    },
  },

  mounted() {

    const vueInstance = this;
    const globalState = useGlobalState();
    this.tabulator = new Tabulator(this.$refs.table, {
     // pagination: "local",
     // paginationSize: 13,
      rowContextMenu: [
    {
        label:"Delete row",
        action:function(e, row){
           vueInstance.$emit('delete-row', row.getData());
           row.delete();
        }
    },
        {
        label:"Refresh Table",
        action:function(e, row){
         vueInstance.tabulator.setData(vueInstance.jobs_filtered);
            // Update the Mongo DB document using the jobId with the value of the company domain
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

            let rowInfo = {companyOfficialUrl, jobId, jobPosterName, jobPosterEmail};
            // Update the Mongo DB document using the jobId with the value of the company domain
            vueInstance.$emit('update-row', rowInfo);
        }
    },
    ],
      data: this.jobs,
      reactiveData: true,
      layout: "fitColumns",
      // This columns array can be generated dynamically in a computed property
      columns: [
         { title: "", field: "logo",maxWidth:40, formatter: function (cell, formatterParams, onRendered) {
          let rowData = cell.getRow().getData();
          let url = rowData.companyLogoUrl ?  rowData.companyLogoUrl : "https://www.ryangriego.com/assets/icons/vue.svg";
          return `<img src="${url}" style="height:40px;width:40px;">`;
         }

        },
      { title: "Job ID", field: "jobId", sorter: "number", minWidth: 100, visible:false },
      { title: "Job Title", field: "jobTitle", sorter: "string", minWidth: 160},
      { title: "Status", field: "status", sorter: "string", minWidth: 100 },
      { title: "Company Name", field: "companyName", sorter: "string", minWidth: 150 },
      { title: "Company URL", field: "companyUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Company Url", field: "companyOfficialUrl", sorter: "string", minWidth: 150, visible: true, editor:'input'},
      { title: "Job Location", field: "jobLocation", sorter: "string", minWidth: 120, visible: false },
      { title: "Posted At", field: "postedAt", sorter: "date", minWidth: 200, visible: false },
      { title: "Applies Closed At", field: "appliesClosedAt", sorter: "date", minWidth: 200, visible: false },
      { title: "Date Scraped", field: "timestamp", sorter: "date", minWidth: 100,formatter: (cell) => {
       const date = new Date(cell.getValue());
         return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      },  },

      { title: "Job Description", field: "jobDescription", sorter: "string", minWidth: 200, visible: false },
      { title: "Workplace Type", field: "workplaceType", sorter: "string", minWidth: 100, visible: false  },
      { title: "Job Poster Profile URL", field: "jobPosterProfileUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Job Poster Name", field: "jobPosterName", sorter: "string", minWidth: 100, editor:'input' },
      { title: "Job Poster Email", field: "jobPosterEmail", sorter: "string", minWidth: 200, editor:'input' },
      { title: "Company Logo URL", field: "companyLogoUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Apply URL", field: "applyUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Views Count", field: "viewsCount", sorter: "number", minWidth: 80, visible: false },
      { title: "Company Staff Count", field: "companyStaffCount", sorter: "number", minWidth: 200, visible: false },
      { title: "Company Description", field: "companyDescription", sorter: "string", minWidth: 200, visible: false },
      { title: "Job Industries", field: "jobIndustries", sorter: "string", minWidth: 200, visible: false  },
      { title: "Job Functions", field: "jobFunctions", sorter: "string", minWidth: 200, visible: false },
      { title: "Remote Allowed", field: "remoteAllowed", sorter: "boolean", minWidth: 40 },
      { title: "Job Type", field: "jobType", sorter: "string", minWidth: 80, visible: false },
      { title: "Applicants Count", field: "applicantsCount", sorter: "number", minWidth: 80, visible: false },
      { title: "Experience Level", field: "experienceLevel", sorter: "string", minWidth: 100 },
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
                vueInstance.$emit('open-email-modal', cell.getRow().getData());
              });
              return button;
            } else if(!rowData.jobPosterEmail && rowData.companyOfficialUrl && rowData.jobPosterName) {
                let button = document.createElement("button");
                button.style.padding = "2px";
                button.style.backgroundColor = "blue";
                button.style.border = "none";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";
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
      ]

    });

    // this.tabulator.on("rowDblClick", function (e, row) {
    //   let rowData = toRaw(row.getData());
    //   globalState.value.rowData = rowData
    //      setTimeout(() => {
    //     // Now `this` refers to the Vue instance, so `this.tabulator` should be defined
    //     console.log("log this.tabulator", this.tabulator);
    //     this.tabulator.redraw(true);
    //     navigateTo("/job")
    //   }, 2000);
    // });
    // /THIS IS NEW THE ONE ABOVE IS ORIGINAL
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
  <div ref="table"></div>
</template>
