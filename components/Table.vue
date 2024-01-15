<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { useGlobalState } from '~/composables/state'

export default {
  emits: ['sendEmail'],
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
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.tableData,
      reactiveData: true,
      layout: "fitColumns",
      columns: [
      { title: "Job ID", field: "jobId", sorter: "number", width: 100 },
      { title: "Job Title", field: "jobTitle", sorter: "string", width: 200},
      { title: "Company Name", field: "companyName", sorter: "string", maxWidth: 300 },
      { title: "Company URL", field: "companyUrl", sorter: "string", width: 200, visible: false },
      { title: "Job Location", field: "jobLocation", sorter: "string", width: 120, visible: false },
      { title: "Posted At", field: "postedAt", sorter: "date", width: 200, visible: false },
      { title: "Applies Closed At", field: "appliesClosedAt", sorter: "date", width: 200, visible: false },
      { title: "Job Description", field: "jobDescription", sorter: "string", width: 200, visible: false },
      { title: "Workplace Type", field: "workplaceType", sorter: "string", width: 100, visible: false  },
      { title: "Job Poster Profile URL", field: "jobPosterProfileUrl", sorter: "string", width: 200, visible: false },
      { title: "Job Poster Name", field: "jobPosterName", sorter: "string", width: 100 },
      { title: "Job Poster Email", field: "jobPosterEmail", sorter: "string", width: 200 },
      { title: "Company Logo URL", field: "companyLogoUrl", sorter: "string", width: 200, visible: false },
      { title: "Apply URL", field: "applyUrl", sorter: "string", width: 200, visible: false },
      { title: "Views Count", field: "viewsCount", sorter: "number", width: 80, visible: false },
      { title: "Company Staff Count", field: "companyStaffCount", sorter: "number", width: 200, visible: false },
      { title: "Company Description", field: "companyDescription", sorter: "string", width: 200, visible: false },
      { title: "Job Industries", field: "jobIndustries", sorter: "string", width: 200, visible: false  },
      { title: "Job Functions", field: "jobFunctions", sorter: "string", width: 200, visible: false },
      { title: "Remote Allowed", field: "remoteAllowed", sorter: "boolean", width: 80 },
      { title: "Job Type", field: "jobType", sorter: "string", width: 80 },
      { title: "Applicants Count", field: "applicantsCount", sorter: "number", width: 80, visible: false },
      { title: "Experience Level", field: "experienceLevel", sorter: "string", width: 100 },
       {
          title: "Actions",
          field: "actions",
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
                console.log("Button clicked:", cell.getRow().getData());
                console.log("getData", cell.getRow());
              });
              return button;
            } else {
              return '';
            }
          }
        },
      ],
    });
    this.tabulator.on("rowDblClick", function (e, row) {
      let rowData = toRaw(row.getData());
      globalState.value.rowData = rowData
      navigateTo("/job")
    });
  }
}
</script>

<template>
  <div ref="table"></div>
</template>
