<template>
  <div class="user-select-none">
    <div class="mx-4 mt-4 d-flex">
      <v-breadcrumbs color="indigo--text" class="pa-0" :items="titles" large></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-radio-group v-model="taskSwitch" class="radio-switch ma-0" row dense hide-details="">
        <v-radio label="My Task" value="user" hide-details></v-radio>
        <v-radio label="Attached" value="attached" hide-details></v-radio>
        <v-radio label="All Task" value="all" hide-details></v-radio>
      </v-radio-group>
      <div class="d-flex align-center">
        <v-btn @click="sortTasks()" depressed color="light-blue" width="fit-content" height="32" class="white--text text-capitalize">
          <v-icon color="white" small>mdi-sort</v-icon>
        </v-btn>
      </div>
    </div>
    <v-container fluid class="d-flex">
      <!-- tasks sheet -->
      <div :class="sidePanelState == 'open' ? 'openedPanel' : ''" class="taskswrapper">
        <v-card class="my-2 addtask align-center d-flex pl-4" height="56">
          <div @keypress.enter="createTask" class="w-100">
            <div :data-state="state" class="d-flex align-center">
              <v-icon color="grey" left>mdi-plus</v-icon>
              <input type="text" class="addTaskInput" v-model="addTaskInput" autofocus placeholder="Add a task" @click="state = 'open'" @blur="state='close'" />
              <v-btn @click="createTask" depressed color="light-blue white--text" height="40" width="100" class="text-capitalize ml-4">Add</v-btn>
            </div>
          </div>
        </v-card>

        <div class="calcHeight">
          <v-card :ripple="false" @click="updateTask(i)" class="my-1 tasksheet align-center d-flex pl-4" min-height="56" v-for="(i,idx) in currentTasks" :key='idx'>
            <!-- <v-layout align-center>
              <v-flex wrap sm12 xs12 lg4 xl4><span class="fsize14">{{i.task_name}}</span></v-flex>
              <v-flex xs3>
                <span class="fsize12 secondaryColor">{{i.assigned_to_name}}</span>
              </v-flex>
              <v-flex xs3>
                <span class="fsize12 secondaryColor">{{i.task_status}}</span>
              </v-flex>
              <v-flex xs3>
                <v-btn min-width="86" depressed rounded-lg height="26" :color="i.priority == 'Low' ? 'teal lighten-4 teal--text' : i.priority == 'Medium' ? 'amber lighten-4 orange--text' : i.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="fsize12 text-capitalize">{{i.priority}}</v-btn>
              </v-flex>
            </v-layout>
            <v-flex xs3>
              <span class="fsize12 secondaryColor">{{getDateString(new Date(i.end_date), "d-M-y")}}</span>
            </v-flex> -->
            <v-row class="ma-0">
              <v-col>
                <span class="fsize14">{{i.task_name}}</span>
              </v-col>
              <v-col>
                <span class="fsize12 secondaryColor">{{i.assigned_to_name}}</span>
              </v-col>
              <v-col>
                <span class="fsize12 secondaryColor">{{i.task_status}}</span>
              </v-col>
              <v-col>
                <v-btn min-width="86" depressed rounded-lg height="26" :color="i.priority == 'Low' ? 'teal lighten-4 teal--text' : i.priority == 'Medium' ? 'amber lighten-4 orange--text' : i.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="fsize12 text-capitalize">{{i.priority}}</v-btn>
              </v-col>
              <v-col>
                <span class="fsize12 secondaryColor">{{getDateString(new Date(i.end_date), "d-M-y")}}</span>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>

      <!-- update panel -->
      <transition :duration="550" name="fade">
        <updatePanel v-if="sidePanelState == 'open'" class="resizeClass" />
      </transition>
    </v-container>
  </div>
</template>

<script>
import updatePanel from "../views/sidePanelDrawer.vue";
import { mapGetters } from "vuex";
import commonFunc from "../mixins/common";
export default {
  mixins: [commonFunc],
  name: "Task",
  data: () => ({
    titles: [
      { text: "Tasks", disabled: false, href: "task1" },
      { text: "Board", disabled: false, href: "kanbanBoard" },
    ],
    state: "close",
    addTaskInput: "",
    taskSwitch: "user",
    dueDate1: "",
    dueDatePicker1: false,
    sortingBool: true,
  }),
  components: { updatePanel },
  computed: {
    ...mapGetters("task", {
      totalTasks: "getAllTasks",
      currentUserTasks: "getCurrentUserTaks",
      currentTasks: "getCurrentTasks",
    }),
    ...mapGetters({ loader: "getLoader" }),
    ...mapGetters("project", { projectList: "getProjectsList" }),
    ...mapGetters("employee", { employeeList: "getEmployeeList" }),
    ...mapGetters({ sidePanelState: "getUpdateTaskPanel" }),
  },
  methods: {
    updateTask(task) {
      this.$store.commit("setUpdateTaskPanel", "open");
      this.$store.commit("setCurrentTask", task);
    },
    async createTask() {
      let empId = JSON.parse(localStorage.getItem("currentUserData"));
      if (this.addTaskInput != "") {
        await this.$store.dispatch("task/createTask", {
          task_name: this.addTaskInput,
          emp_id: empId.emp_id,
        });
        //   this.$toast.success(`Task created successfully. (${this.addTaskInput})`, {
        //   position: "bottom-center",
        //   timeout: 1500,
        //   closeOnClick: true,
        //   pauseOnFocusLoss: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   draggablePercent: 0.6,
        //   showCloseButtonOnHover: false,
        //   hideProgressBar: false,
        //   closeButton: "button",
        //   icon: true,
        //   rtl: false,
        // });
      }
      this.addTaskInput = "";
    },
    sortTasks() {
      this.sortingBool = !this.sortingBool;
      this.$store.commit("task/setSortTasks", this.sortingBool);
    },
  },
  watch: {
    taskSwitch(val) {
      this.$store.commit(
        "task/setCurrentTasks",
        val == "all"
          ? this.totalTasks
          : val == "user"
          ? this.currentUserTasks
          : []
      );
    },
  },
  created() {
    this.$store.dispatch("task/getTasks");
  },
};
</script>

<style>
</style>