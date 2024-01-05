<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables'; //import Tabulator library

export default {
  data() {
    return {
      tabulator: null, //variable to hold your table
      tableData: [
       {
          companyName: "ABC Company",
          jobTitle: "Software Engineer",
          jobUrl: "https://www.linkedin.com/job-apply/3784038973",
          jobLocation: "New York",
          postedAt: "2022-01-01",
          jobPoster: "John Doe",
          jobPosterEmail: "john.doe@example.com",
          status: '',
          actions: "Send Email",
        },
        {
          companyName: "XYZ Corporation",
          jobTitle: "Web Developer",
          jobUrl: "https://www.linkedin.com/job-apply/3789430631",
          jobLocation: "San Francisco",
          postedAt: "2022-01-05",
          jobPoster: "Jane Smith",
          jobPosterEmail: "jane.smith@example.com",
          status: '',
          actions: "Send Email",
        },
        {
          companyName: "XYZ Corporation",
          jobTitle: "Web Developer",
          jobUrl: "https://www.linkedin.com/job-apply/3786734022",
          jobLocation: "San Francisco",
          postedAt: "2022-01-05",
          jobPoster: "Jane Smith",
          jobPosterEmail: "jane.smith@example.com",
          status: '',
          actions: "Send Email",
        },
    ],
    props: {
        sendEmail: {
          type: Function,
          required: true
        }
      }
    }
  },
  mounted() {
    const vueInstance = this;
    //instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.tableData, //link data to table
      reactiveData: true, //enable data reactivity
      columns: [{ title: "Company Name", field: "companyName", sorter: "string", width: 200, editor: true },
      { title: "Job Title", field: "jobTitle", sorter: "string", width: 200 },
      { title: "Job Location", field: "jobLocation", sorter: "string", cellClick: function (e, cell) { console.log("cell click") }, },
      { title: "Posted At", field: "postedAt", sorter: "string", width: 200 },
      { title: "Job Poster", field: "jobPoster", sorter: "string" },
      { title: "Job Poster Email", field: "jobPosterEmail", sorter: "date", hozAlign: "center" },
      {
        title: "Actions",
        field: "actions",
        formatter: function (cell, formatterParams, onRendered) {
          // Create and style button
          let button = document.createElement("button");
          button.style.padding = "10px";
          button.style.backgroundColor = "lightblue";
          button.style.border = "none";
          button.style.borderRadius = "5px";
          button.style.cursor = "pointer";
          button.innerHTML = cell.getValue();

          // Add event listener
          button.addEventListener("click", (e) => {
            // Emit an event with the row data
            vueInstance.$emit('send-email', cell.getRow().getData());
            console.log("Button clicked:", cell.getRow().getData());
            console.log("getData", cell.getRow());
          });

          return button;
        }
      },], //define table columns
    });
  }
}
</script>

<template>
  <div ref="table"></div>
</template>
