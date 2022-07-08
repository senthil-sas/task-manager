<template>
  <div>
    <div class="ma-4 d-flex align-center justify-space-between">
      <div class="indigo--text">Project details</div>
      <v-btn depressed color="primary" class="text-capitalize" @click="createProjectDialog = true">Add</v-btn>
    </div>
    <v-card class="ma-4">
      <v-simple-table fixed-header  id="tableData">
        <thead>
          <tr class="tableRow">
            <th class="tableHeader bg-lightgrey">Project Name</th>
            <th class="tableHeader bg-lightgrey">No.of.task</th>
            <th class="tableHeader bg-lightgrey">Overdue task</th>
            <th class="tableHeader bg-lightgrey">Customer Name</th>
            <th class="tableHeader bg-lightgrey">Manager Name</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tableRow" v-for="(i,idx) in projectData" :key="idx">
            <td class="tableContent">{{i.project_name}}</td>
            <td class="tableContent">{{i.no_of_tasks}}</td>
            <td class="tableContent">{{i.no_of_overdue_tasks}}</td>
            <td class="tableContent">{{i.cust_short_name}}</td>
            <td class="tableContent">{{i.manager_name}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>

    <!-- create Project dialog -->
    <v-row justify="center">
      <v-dialog v-model="createProjectDialog" max-width="600" persistent transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar height="50" color="black" tile class="white--text">
            <div class="text-center w-100">
              Create Project
            </div>
          </v-toolbar>
          <v-container fluid>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="projectName" label="Project Name" :rules="projectNameRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field v-model="shortName" label="Project short Name" :rules="shortNameRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select v-model="customerName" :items="allCustomerNames" label="Customer Name" :rules="customerNameRules" dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select v-model="mdName" label="Manager Name" :items="managersData" :rules="address1Rules" dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select v-model="serviceType" label="Type" :items="['Service','Product','Product-customaization','RFP','Testing','UI/UX Design']" :rules="serviceTypeRules" menu-props="offset-y" dense outlined></v-select>
                </v-col>
                <div class="d-flex justify-center w-100">
                  <v-switch class="ml-4 mt-0" dense inset label="Billable" :ripple="false" v-model="isBillable"></v-switch>
                </div>
              </v-row>
            </v-form>
          </v-container>
          <div class="d-flex justify-center pa-4">
            <v-btn color="grey darken-1" class="mr-3 text-capitalize" outlined @click="resetValidation()">
              Close
            </v-btn>
            <v-btn color="red" class="mr-3 text-capitalize" outlined @click="reset()">Reset</v-btn>
            <v-btn color="blue darken-1" class="text-capitalize" outlined @click="createProject()">
              Save
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Project",
  data: () => ({
    createProjectDialog: false,
    projectName: "",
    shortName: "",
    customerName: "",
    mdName: "",
    serviceType: "Service",
    isBillable: 1,

    projectNameRules: [(v) => !!v || "Project Name is required"],
    shortNameRules: [(v) => !!v || "Project short Name is required"],
    customerNameRules: [(v) => !!v || "Customer Name is required"],
    address1Rules: [(v) => !!v || "Manager Name is required"],
    serviceTypeRules: [(v) => !!v || "Service Type is required"],
  }),
  computed: {
    ...mapGetters("project", {
      projectData: "getProjects",
      managersData: "getManagersData",
    }),
    ...mapGetters("customer", {
      allCustomerNames: "getAllCustomerNames",
    }),
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.createProjectDialog = false;
      this.$refs.form.resetValidation();
      this.reset();
    },
    createProject() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        var mdId;
        var cusId;
        this.projectData.forEach((el) => {
          el.manager_name == this.mdName ? (mdId = el.manager) : "";
          el.cust_name == this.customerName ? (cusId = el.cust_id) : "";
        });
        this.createProjectDialog = false;
        this.$store.dispatch("project/createProject", {
          project_name: this.projectName,
          project_short_name: this.shortName,
          cust_id: cusId,
          manager: mdId,
          type: this.serviceType,
          billable: this.isBillable,
        });
      }
    },
  },
  created() {
    this.$store.dispatch("customer/getCustomers");
    this.$store.dispatch("project/getProjects");
  },
};
</script>

<style>
</style>