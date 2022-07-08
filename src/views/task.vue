<template>
  <!-- <div>
    <div class="ma-4 d-flex align-center">
      <div>
        <v-text-field v-model="search" single-line dense max-width="50%" hide-details outlined prepend-inner-icon="mdi-magnify" placeholder="Search"></v-text-field>
      </div>
      <div class="ml-5">
        <v-btn block depressed outlined color="black" class="text-capitalize" @click="createTaskDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add Task
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-checkbox v-model="taskSwitch" :label="taskSwitch ? 'My Taks' : 'All Tasks'"></v-checkbox>
    </div>
    <v-card class="ma-4">
      <v-simple-table fixed-header id="tableData" v-if="currentTasks.length != 0 && taskFilter.length != 0 && !loader">
        <thead>
          <tr class="tableRow">
            <th class="tableHeader bg-lightgrey">S.No</th>
            <th class="tableHeader bg-lightgrey">Task Name</th>
            <th class="tableHeader bg-lightgrey text-center">project</th>
            <th class="tableHeader bg-lightgrey text-center">Assigned To</th>
            <th class="tableHeader bg-lightgrey text-center">Due Date</th>
            <th class="tableHeader bg-lightgrey text-center">priority</th>
            <th class="tableHeader bg-lightgrey text-center">Status</th>
            <th class="tableHeader bg-lightgrey text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tableRow" v-for="(i,idx) in search == '' ? currentTasks : taskFilter" :key="idx">
            <td class="tableContent">{{idx+1}}</td>
            <td class="tableContent">{{i.task_name}}</td>
            <td class="tableContent text-center">{{i.project_name}}</td>
            <td class="tableContent text-center">{{i.assigned_to_name}}</td>
            <td class="tableContent text-center">{{i.end_date}}</td>
            <td class="tableContent text-center">{{i.priority}}</td>
            <td class="tableContent text-center">
              <button class="fsize12" :class="i.task_status == 'In-Progress' ? 'progressBtn' :i.task_status == 'Fixed' ? 'fixedBtn' : 'openBtn'">
                {{i.task_status}}
              </button>
            </td>
            <td class="tableContent text-center">
              <v-btn depressed outlined text color="primary" class="text-capitalize fsize12">
                <v-icon left>mdi-pencil</v-icon>
                Edit Task
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <div class="pa-5" v-else-if="!loader">
        No Data Found
      </div>
    </v-card>

    <v-row justify="center">
      <v-dialog v-model="createTaskDialog" max-width="900" persistent transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar height="50" color="black" tile class="white--text">
            <div class="text-center w-100">
              Create Task
            </div>
          </v-toolbar>
          <v-container fluid>
            <v-form ref="form" v-model="cTaskForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="taskName" label="Task Name" :rules="taskNameRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu v-model="startDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="formatedStartDate" outlined persistent-hint label="Start Date" hide-details append-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="startDate" :show-current="true" no-title @input="startDatePicker = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-menu v-model="toDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="formatedEndDate" outlined persistent-hint label="To Date" hide-details append-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="toDate" :show-current="true" no-title @input="toDatePicker = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="estimatedEffort" label="Estimated Effort" dense class="without_ampm" type="time" name="appt-time" step="0" outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="actualEffort" label="Actual Effort" dense class="without_ampm" type="time" name="appt-time" step="0" outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="status" :items="['Open']" disabled label="Status" dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="priority" :items="priorityList" label="Priority" dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="project" label="Projects" :items="projectList" dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="assignedTo" :items="employeeList" label="Assigned To" dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-file-input dense append-icon="mdi-folder-open" prepend-icon="" label="Choose File" outlined></v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="description" filled dense :rules="descriptionRules" placeholder="Description"></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <div class="d-flex justify-center pa-4">
            <v-btn color="grey darken-1" class="mr-3 text-capitalize" outlined @click="createTaskDialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" class="text-capitalize" outlined @click="createTask()">
              Save
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div> -->
  <div>
    <div class="ma-4 indigo--text">
      Tasks
    </div>
    <div class="calcHeight-1 mx-4" v-if="customerTasks.length != 0">
      <v-card :ripple="false" class="my-1 tasksheet align-center d-flex pl-4" min-height="56" v-for="(i,idx) in customerTasks" :key='idx'>
        <v-layout align-center>
          <v-flex wrap xs4><span class="fsize14">{{i.task_name}}</span></v-flex>
          <v-flex xs3>
            <span class="fsize12 secondaryColor">{{i.assigned_to_name}}</span>
          </v-flex>
          <v-flex xs3>
            <span class="fsize12 secondaryColor">{{i.task_status}}</span>
          </v-flex>
          <v-flex xs3>
            <v-btn min-width="86" depressed rounded-lg height="26" :color="i.priority == 'Low' ? 'teal lighten-4 teal--text' : i.priority == 'Medium' ? 'amber lighten-4 orange--text' : i.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="fsize12 text-capitalize">{{i.priority}}</v-btn>
          </v-flex>
          <v-flex xs3>
          <span class="fsize12 secondaryColor">{{getDateString(new Date(i.end_date), "d-M-y")}}</span>
        </v-flex>
        </v-layout>
        <!-- <v-flex xs1>
          <span class="fsize12 secondaryColor">{{i.project_name}}</span>
        </v-flex> -->
      </v-card>
    </div>
    <div v-else>
      <div class="secondaryColor d-flex align-center justify-center">
        No Tasks Found
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import commonFunc from "../mixins/common";
export default {
  mixins: [commonFunc],
  name: "Task",
  data: () => ({
    taskSwitch: false,
    search: "",
    createTaskDialog: false,
    // dates
    startDatePicker: false,
    toDatePicker: false,
    startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    toDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    // create task fields models
    priorityList: ["High", "Medium", "Low"],
    taskName: "",
    estimatedEffort: "00:00",
    actualEffort: "00:00",
    status: "Open",
    priority: "Medium",
    project: "",
    assignedTo: "",
    description: "",
    // form model
    cTaskForm: false,

    // rules validation
    descriptionRules: [
      (v) => !!v || "Description is required",
      (v) =>
        (v && v.length >= 49) ||
        "Description must be greater than 50 characters",
    ],
    taskNameRules: [(v) => !!v || "Task Name is required"],
  }),
  computed: {
    ...mapGetters("task", {
      // totalTasks: "getAllTasks",
      // currentUserTasks: "getCurrentUserTaks",
      customerTasks: "getCustomerTasks",
    }),
    ...mapGetters({ loader: "getLoader" }),
    ...mapGetters("project", { projectList: "getProjectsList" }),
    ...mapGetters("employee", { employeeList: "getEmployeeList" }),

    taskFilter() {
      return this.customerTasks.filter((data) => {
        return data.task_name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    formatedStartDate(date) {
      return this.formatDate(this.startDate);
    },
    formatedEndDate(date) {
      return this.formatDate(this.toDate);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    formatDateIndian(date) {
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    createTask() {
      this.$refs.form.validate();
      this.cTaskForm ? (this.createTaskDialog = false) : "";
      var jsonObj = {
        dateProvided: "true",
        start_Date: this.formatDateIndian(this.fromDate),
        end_Date: this.formatDateIndian(this.toDate),
      };
      // this.$store.dispatch("report/getReports",jsonObj);
    },
  },
  created() {
    this.$store.dispatch("project/getProjects");
    // this.$store.dispatch("employee/getEmployees");
    // this.$store.dispatch("task/getTasks");
    this.$store.dispatch("task/getCustomerTasks");
  },
};
</script>

<style>
</style>