<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables'; //import Tabulator library


// const { data: patients } = await useFetch("/api/patients");

// console.log('log the patients', toRaw(patients.value.patients));
// console.log('log patients.value', toRaw(patients.value.patients));
// console.log('log this.patientssss', this.patients);


export default {


  data() {
    return {
      tabulator: null, //variable to hold your table
      tableData: [
       {
          _id: 1,
          email: "ABC Company",
          name: "Software Engineer",
        },

      ],
    props: {
        sendEmail: {
          type: Function,
          required: true
        },
        patients: {
          type: Array,
          required: true
        }
      }
    }
  },
  mounted() {
    const vueInstance = this;
    console.log("log vueInstance", vueInstance);
    //instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.tableData, //link data to table
      reactiveData: true, //enable data reactivity
      columns: [{ title: "_id", field: "_id", sorter: "string", width: 200, editor: true },
      { title: "email", field: "email", sorter: "string", width: 200 },
      { title: "name", field: "name", sorter: "string", cellClick: function (e, cell) { console.log("cell click") }, },

      ,], //define table columns
    });
  }
}
</script>

<template>
  <div ref="table"></div>
</template>
