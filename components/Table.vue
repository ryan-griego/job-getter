<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { useGlobalState } from '~/composables/state'

export default {
  emits: ['sendEmail', 'getEmail', 'updateDomain'],
  props: {
      jobs: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      tabulator: null,
      tableData: this.jobs,
    }
  },

  mounted() {
    const vueInstance = this;
    const globalState = useGlobalState();
    var cellContextMenu = [
    {
        label:"Add domain",
        action:function(e, cell){
            cell.edit();
            // cell.setValue("");
            // Update the Mongo DB document using the jobId with the value of the company domain
            vueInstance.$emit('update-domain', cell.getRow().getData());
        }
    },
]
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.tableData,
      reactiveData: true,
      layout: "fitColumns",
      columns: [
      { title: "Job ID", field: "jobId", sorter: "number", minWidth: 100 },
      { title: "Job Title", field: "jobTitle", sorter: "string", minWidth: 100},
      { title: "Status", field: "status", sorter: "string", minWidth: 100 },
      { title: "Company Name", field: "companyName", sorter: "string", minWidth: 150 },
      { title: "Company URL", field: "companyUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Company Url", field: "companyOfficialUrl", sorter: "string", minWidth: 150, visible: true, contextMenu:cellContextMenu, editor:'input'},
      { title: "Job Location", field: "jobLocation", sorter: "string", minWidth: 120, visible: false },
      { title: "Posted At", field: "postedAt", sorter: "date", minWidth: 200, visible: false },
      { title: "Applies Closed At", field: "appliesClosedAt", sorter: "date", minWidth: 200, visible: false },
      { title: "Job Description", field: "jobDescription", sorter: "string", minWidth: 200, visible: false },
      { title: "Workplace Type", field: "workplaceType", sorter: "string", minWidth: 100, visible: false  },
      { title: "Job Poster Profile URL", field: "jobPosterProfileUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Job Poster Name", field: "jobPosterName", sorter: "string", minWidth: 100 },
      { title: "Job Poster Email", field: "jobPosterEmail", sorter: "string", minWidth: 200 },
      { title: "Company Logo URL", field: "companyLogoUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Apply URL", field: "applyUrl", sorter: "string", minWidth: 200, visible: false },
      { title: "Views Count", field: "viewsCount", sorter: "number", minWidth: 80, visible: false },
      { title: "Company Staff Count", field: "companyStaffCount", sorter: "number", minWidth: 200, visible: false },
      { title: "Company Description", field: "companyDescription", sorter: "string", minWidth: 200, visible: false },
      { title: "Job Industries", field: "jobIndustries", sorter: "string", minWidth: 200, visible: false  },
      { title: "Job Functions", field: "jobFunctions", sorter: "string", minWidth: 200, visible: false },
      { title: "Remote Allowed", field: "remoteAllowed", sorter: "boolean", minWidth: 80 },
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
                vueInstance.$emit('send-email', cell.getRow().getData());
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
                console.log("log this.$refs.table", this.$refs);
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

      // For later
      //  {
      //     title: "Company URL",
      //     field: "companyOfficialUrl",
      //     formatter: function (cell, formatterParams, onRendered) {
      //       let rowData = cell.getRow().getData();
      //       let button = document.createElement("button");
      //       button.style.padding = "2px";
      //       button.style.backgroundColor = "green";
      //       button.style.border = "none";
      //       button.style.borderRadius = "5px";
      //       button.style.cursor = "pointer";
      //       button.innerHTML = 'Get URL';
      //       console.log("log this.$refs.table", this.$refs);

      //       button.addEventListener("click", (e) => {

      //         vueInstance.$emit('send-email', cell.getRow().getData());


      //       });
      //       return button;
      //     }
      //   },
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
      globalState.value.rowData = rowData
      setTimeout(() => {
        this.tabulator.redraw(true);
        navigateTo("/job")
      }, 2000);
    });
  }
}
</script>

<template>
  <div ref="table"></div>
</template>
