<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';

export default {
  emits: ['sendEmail'],
  props: {
    sendEmail: {
      type: Function,
      required: true
    },
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
    //instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.tableData, //link data to table
      reactiveData: true, //enable data reactivity
      columns: [
      { title: "companyUrl", field: "companyUrl", sorter: "string", width: 200 },
      { title: "companyName", field: "companyName", sorter: "string" },
      { title: "jobTitle", field: "jobTitle", sorter: "string", width: 200 },
      // { title: "jobLocation", field: "jobLocation", sorter: "string", width: 200 },
      // { title: "postedAt", field: "postedAt", sorter: "date", width: 200 },
      // { title: "appliesClosedAt", field: "appliesClosedAt", sorter: "date", width: 200 },
      // { title: "jobDescription", field: "jobDescription", sorter: "string", width: 200 },
      // { title: "jobId", field: "jobId", sorter: "number", width: 200 },
      // { title: "workplaceType", field: "workplaceType", sorter: "string", width: 200 },
      // { title: "jobPosterProfileUrl", field: "jobPosterProfileUrl", sorter: "string", width: 200 },
      // { title: "jobPosterName", field: "jobPosterName", sorter: "string", width: 200 },
      // { title: "companyLogoUrl", field: "companyLogoUrl", sorter: "string", width: 200 },
      // { title: "applyUrl", field: "applyUrl", sorter: "string", width: 200 },
      // { title: "viewsCount", field: "viewsCount", sorter: "number", width: 200 },
      // { title: "companyStaffCount", field: "companyStaffCount", sorter: "number", width: 200 },
      // { title: "companyDescription", field: "companyDescription", sorter: "string", width: 200 },
      // { title: "jobIndustries", field: "jobIndustries", sorter: "string", width: 200 },
      // { title: "jobFunctions", field: "jobFunctions", sorter: "string", width: 200 },
      // { title: "remoteAllowed", field: "remoteAllowed", sorter: "boolean", width: 200 },
      // { title: "jobType", field: "jobType", sorter: "string", width: 200 },
      // { title: "applicantsCount", field: "applicantsCount", sorter: "number", width: 200 },
      // { title: "experienceLevel", field: "experienceLevel", sorter: "string", width: 200 },
      ],
    });
    this.tabulator.on("rowDblClick", function (e, row) {
      //e - the click event object
      let rowData = toRaw(row.getData());
      console.log('log row data', rowData);
      //row - row component
    });

  }
}
</script>

<template>
  <div ref="table"></div>
</template>
