<template>
  <div>
    <div class="mx-4 d-flex align-center justify-space-between position-fixed">
      <v-breadcrumbs color="indigo--text" class="pa-0 mr-5" :items="titles" large></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-radio-group v-model="taskSwitch" class="radio-switch" row dense>
        <v-radio label="My Task" class="fsize12" value="user" hide-details></v-radio>
        <v-radio label="Attached" class="fsize12" value="attached" hide-details></v-radio>
        <v-radio label="All Task" class="fsize12" value="all" hide-details></v-radio>
      </v-radio-group>
      <!-- <div class="d-flex align-center">
        <v-btn @click="sortTasks()" depressed color="light-blue" class="white--text text-capitalize">
          <v-icon color="white" left>mdi-sort</v-icon>
          Sort
        </v-btn>
      </div> -->
    </div>
    <div class="user-select-none">
      <div class="container testimonial-group">
        <div class="boardRow text-center">
          <!-- open column -->
          <div class="boards mr-3">
            <v-card elevation="1" class="mx-auto ma-2 d-flex flex-column" min-height="550" width="270">
              <div class='text-center light-blue lighten-5 cardHead d-flex align-center justify-space-between px-4'>
                <span class="primaryColor fsize12">Open <span v-if="openTasks.length != 0">({{openTasks.length}})</span></span>
                <v-icon color="light-blue" @click="addTask">mdi-plus-circle</v-icon>
              </div>
              <div class="overflow-y-auto h-550 allTasks" @drop.prevent="currentStatus = 'Open'">
                <div class="pa-3 m-h-76">
                  <draggable tag="div" :group="{ name: 'section', put: true }" :list="openTasks" v-bind="dragOptions" :move="drag_handler">
                    <v-card :ripple="false" @click="updateTask(t)" min-height="76" class="pa-1 my-2 taskCard rounded-lg" v-for="(t,index) in openTasks" :key="index">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-left">
                          <span class="secondaryColor fsize12">{{t.task_name}}</span>
                        </div>
                        <v-btn min-width="50" height="16" depressed rounded-lg :color="t.priority == 'Low' ? 'teal lighten-4 teal--text' : t.priority == 'Medium' ? 'amber lighten-4 orange--text' : t.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="pa-0 text-capitalize mx-1 fsize9">{{t.priority}}</v-btn>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-5">
                        <div class="secondaryColor fsize10 grey--text">{{t.project_name}}</div>
                        <div class="secondaryColor fsize10 grey--text">{{getDateString(new Date(t.end_date), "d-M-y")}}</div>
                      </div>
                      <!-- input field -->
                      <!-- <div class="d-flex justify-space-between">
                        <div></div>
                        <input class="datePicker"  v-model="pricing.name[index]" type="date" placeholder="Add due Date">
                      </div> -->
                    </v-card>
                  </draggable>
                </div>
              </div>
            </v-card>
          </div>

          <!-- In progress column -->
          <div class="boards mr-3">
            <v-card elevation="1" class="mx-auto ma-2 d-flex flex-column" min-height="550" width="270">
              <div class='text-center deep-orange lighten-5 cardHead d-flex align-center justify-space-between px-4'>
                <span class="primaryColor fsize12">In Progress <span v-if="inProgressTasks.length != 0">({{inProgressTasks.length}})</span></span>
                <v-icon color="light-blue" @click="addTask">mdi-plus-circle</v-icon>
              </div>
              <div class="overflow-y-auto h-550" @drop.prevent="currentStatus = 'In-Progress'">
                <div class="pa-3 m-h-76">
                  <draggable tag="div" :group="{ name: 'section', put: true }" :list="inProgressTasks" v-bind="dragOptions" :move="drag_handler">
                    <v-card :ripple="false" @click="updateTask(t)" min-height="76" class="pa-1 my-2 taskCard" v-for="(t,tidx) in inProgressTasks" :key="tidx">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-left">
                          <span class="secondaryColor fsize12">{{t.task_name}}</span>
                        </div>
                        <v-btn min-width="50" height="16" depressed rounded-lg :color="t.priority == 'Low' ? 'teal lighten-4 teal--text' : t.priority == 'Medium' ? 'amber lighten-4 orange--text' : t.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="pa-0 text-capitalize mx-1 fsize9">{{t.priority}}</v-btn>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-5">
                        <div class="secondaryColor fsize10 grey--text">{{t.project_name}}</div>
                        <div class="secondaryColor fsize10 grey--text">{{getDateString(new Date(t.end_date), "d-M-y")}}</div>
                      </div>
                    </v-card>
                  </draggable>
                </div>
              </div>
            </v-card>
          </div>

          <!-- Fixed column -->
          <div class="boards mr-3">
            <v-card elevation="1" class="mx-auto ma-2 d-flex flex-column" min-height="550" width="270">
              <div class='text-center grey lighten-2 cardHead d-flex align-center justify-space-between px-4'>
                <span class="primaryColor fsize12">Fixed <span v-if="fixedTasks.length != 0">({{fixedTasks.length}})</span></span>
                <v-icon color="light-blue" @click="addTask">mdi-plus-circle</v-icon>
              </div>
              <div class="overflow-y-auto h-550 allTasks" @drop.prevent="currentStatus = 'Fixed'">
                <div class="pa-3 m-h-76">
                  <draggable tag="div" :group="{ name: 'section', put: true }" :list="fixedTasks" v-bind="dragOptions" :move="drag_handler">
                    <v-card :ripple="false" @click="updateTask(t)" min-height="76" class="pa-1 my-2 taskCard rounded-lg" v-for="(t,index) in fixedTasks" :key="index">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-left">
                          <span class="secondaryColor fsize12">{{t.task_name}}</span>
                        </div>
                        <v-btn min-width="50" height="16" depressed rounded-lg :color="t.priority == 'Low' ? 'teal lighten-4 teal--text' : t.priority == 'Medium' ? 'amber lighten-4 orange--text' : t.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="pa-0 text-capitalize mx-1 fsize9">{{t.priority}}</v-btn>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-5">
                        <div class="secondaryColor fsize10 grey--text">{{t.project_name}}</div>
                        <div class="secondaryColor fsize10 grey--text">{{getDateString(new Date(t.end_date), "d-M-y")}}</div>
                      </div>
                    </v-card>
                  </draggable>
                </div>
              </div>
            </v-card>
          </div>

          <!-- Pending column -->
          <!-- <div class="boards mr-3">
            <v-card elevation="1" class="mx-auto ma-2 d-flex flex-column" min-height="550" width="270">
              <div class='text-center grey lighten-5 cardHead d-flex align-center justify-space-between px-4'>
                <span class="primaryColor fsize12">Pending <span v-if="pendingTasks.length != 0">({{pendingTasks.length}})</span></span>
                <v-icon color="light-blue" @click="addTask">mdi-plus-circle</v-icon>
              </div>
              <div class="overflow-y-auto h-550 allTasks">
                <div class="pa-3 m-h-76">
                  <draggable tag="div" :group="{ name: 'section', put: true }" :list="pendingTasks" v-bind="dragOptions" :move="drag_handler">
                    <v-card :ripple="false" @click="updateTask(t)" min-height="76" class="pa-1 my-2 taskCard rounded-lg" v-for="(t,index) in pendingTasks" :key="index">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-left">
                          <span class="secondaryColor fsize12">{{t.task_name}}</span>
                        </div>
                        <v-btn min-width="50" height="16" depressed rounded-lg :color="t.priority == 'Low' ? 'teal lighten-4 teal--text' : t.priority == 'Medium' ? 'amber lighten-4 orange--text' : t.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="pa-0 text-capitalize mx-1 fsize9">{{t.priority}}</v-btn>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-5">
                        <div class="secondaryColor fsize10 grey--text">{{t.project_name}}</div>
                        <div class="secondaryColor fsize10 grey--text">{{getDateString(new Date(t.end_date), "d-M-y")}}</div>
                      </div>
                    </v-card>
                  </draggable>
                </div>
              </div>
            </v-card>
          </div> -->

          <!-- cancelled column -->
          <div class="boards mr-3">
            <v-card elevation="1" class="mx-auto ma-2 d-flex flex-column" min-height="550" width="270">
              <div class='text-center grey lighten-5 cardHead d-flex align-center justify-space-between px-4'>
                <span class="primaryColor fsize12">cancelled <span v-if="cancelledTasks.length != 0">({{cancelledTasks.length}})</span></span>
                <v-icon color="light-blue" @click="addTask">mdi-plus-circle</v-icon>
              </div>
              <div class="overflow-y-auto h-550 allTasks">
                <div class="pa-3 m-h-76">
                  <draggable tag="div" @drop.prevent="currentStatus = 'Cancelled'" :group="{ name: 'section', put: true }" :list="cancelledTasks" v-bind="dragOptions" :move="drag_handler">
                    <v-card :ripple="false" @click="updateTask(t)" min-height="76" class="pa-1 my-2 taskCard rounded-lg" v-for="(t,index) in cancelledTasks" :key="index">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-left">
                          <span class="secondaryColor fsize12">{{t.task_name}}</span>
                        </div>
                        <v-btn min-width="50" height="16" depressed rounded-lg :color="t.priority == 'Low' ? 'teal lighten-4 teal--text' : t.priority == 'Medium' ? 'amber lighten-4 orange--text' : t.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="pa-0 text-capitalize mx-1 fsize9">{{t.priority}}</v-btn>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-5">
                        <div class="secondaryColor fsize10 grey--text">{{t.project_name}}</div>
                        <div class="secondaryColor fsize10 grey--text">{{getDateString(new Date(t.end_date), "d-M-y")}}</div>
                      </div>
                    </v-card>
                  </draggable>
                </div>
              </div>
            </v-card>
          </div>

          <!-- completed column -->
          <div class="boards mr-3">
            <v-card elevation="1" class="mx-auto ma-2 d-flex flex-column" min-height="550" width="270">
              <div class='text-center teal lighten-5 cardHead d-flex align-center justify-space-between px-4'>
                <span class="primaryColor fsize12">Completed <span v-if="completedTasks.length != 0">({{completedTasks.length}})</span></span>
                <v-icon color="light-blue" @click="addTask">mdi-plus-circle</v-icon>
              </div>
              <div class="overflow-y-auto h-550">
                <div class="pa-3 m-h-76">
                  <draggable tag="div" @drop.prevent="currentStatus = 'Completed'" :group="{ name: 'section', put: true }" :list="completedTasks" v-bind="dragOptions" :move="drag_handler">
                    <v-card :ripple="false" @click="updateTask(t)" min-height="76" class="pa-1 my-2 taskCard" v-for="(t,tidx) in completedTasks" :key="tidx">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-left">
                          <span class="secondaryColor fsize12">{{t.task_name}}</span>
                        </div>
                        <v-btn min-width="50" height="16" depressed rounded-lg :color="t.priority == 'Low' ? 'teal lighten-4 teal--text' : t.priority == 'Medium' ? 'amber lighten-4 orange--text' : t.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="pa-0 text-capitalize mx-1 fsize9">{{t.priority}}</v-btn>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-5">
                        <div class="secondaryColor fsize10 grey--text">{{t.project_name}}</div>
                        <div class="secondaryColor fsize10 grey--text">{{getDateString(new Date(t.end_date), "d-M-y")}}</div>
                      </div>
                    </v-card>
                  </draggable>
                </div>
              </div>
            </v-card>
          </div>

          <!-- Review column -->
          <div class="boards mr-3">
            <v-card elevation="1" class="mx-auto ma-2 d-flex flex-column" min-height="550" width="270">
              <div class='text-center orange lighten-5 cardHead d-flex align-center justify-space-between px-4'>
                <span class="primaryColor fsize12">Review <span v-if="reviewTasks.length != 0">({{reviewTasks.length}})</span></span>
              </div>
              <div class="overflow-y-auto h-550 allTasks">
                <div class="pa-3 m-h-76">
                  <draggable tag="div" @drop.prevent="currentStatus = 'Review'" :group="{ name: 'section', put: true }" :list="reviewTasks" v-bind="dragOptions" :move="drag_handler">
                    <v-card :ripple="false" @click="updateTask(t)" min-height="76" class="pa-1 my-2 taskCard rounded-lg" v-for="(t,index) in reviewTasks" :key="index">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-left">
                          <span class="secondaryColor fsize12">{{t.task_name}}</span>
                        </div>
                        <v-btn min-width="50" height="16" depressed rounded-lg :color="t.priority == 'Low' ? 'teal lighten-4 teal--text' : t.priority == 'Medium' ? 'amber lighten-4 orange--text' : t.priority == 'High' ? 'red lighten-4 red--text' : 'grey white--text'" class="pa-0 text-capitalize mx-1 fsize9">{{t.priority}}</v-btn>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-5">
                        <div class="secondaryColor fsize10 grey--text">{{t.project_name}}</div>
                        <div class="secondaryColor fsize10 grey--text">{{getDateString(new Date(t.end_date), "d-M-y")}}</div>
                      </div>
                    </v-card>
                  </draggable>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </div>
      <div>
        <updatePanel v-if="sidePanelState == 'open'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import commonFunc from "../mixins/common";
export default {
  mixins: [commonFunc],
  name: "kanbanBoard",
  data: () => ({
    title: "Kanban Board",
    titles: [
      { text: "Tasks", disabled: false, href: "task1" },
      { text: "Board", disabled: false, href: "kanbanBoard" },
    ],
    currentStatus: "Open",
    opentaskmodel: [],
    taskSwitch: "user",
    sortingBool: true,
    pricing: {
      name: [],
    },
  }),
  components: {
    draggable,
    updatePanel: () => import("../views/sidePanelDrawer.vue"),
  },
  computed: {
    ...mapGetters("task", {
      totalTasks: "getAllTasks",
      currentUserTasks: "getCurrentUserTaks",
      currentTasks: "getCurrentTasks",
      //task types
      openTasks: "getOpenTasks",
      inProgressTasks: "getInProgressTasks",
      fixedTasks: "getFixedTasks",
      cancelledTasks: "getCancelledTasks",
      pendingTasks: "getPendingTasks",
      reviewTasks: "getReviewTasks",
      completedTasks: "getCompletedTasks",
    }),
    ...mapGetters({ loader: "getLoader", currentTask: "getCurrentTask" }),
    ...mapGetters("project", { projectList: "getProjectsList" }),
    ...mapGetters("employee", { employeeList: "getEmployeeList" }),
    ...mapGetters({ sidePanelState: "getUpdateTaskPanel" }),
    dragOptions() {
      return {
        animation: 300,
        group: "cards",
        disabled: false,
        draggable: ".taskCard",
        ghostClass: "ghost",
        forceFallback: true,
      };
    },
  },
  methods: {
    addTask() {},
    addColumn() {},

    updateTask(task) {
      // this.$store.commit("setUpdateTaskPanel", "open");
      this.$store.commit("setCurrentTask", task);
      console.log(task);
      console.log(this.pricing.name);
    },

    drag_handler(evt) {
      console.log(evt.draggedContext);
      console.log(this.currentStatus);
      var userData = JSON.parse(localStorage.getItem("currentUserData"));
      if (userData) {
        // this.$store.dispatch("task/taskStatusUpdate", {
        //   task_status: this.currentStatus,
        //   task_id: evt.draggedContext.element.task_id,
        //   emp_id: userData.emp_id,
        // });
      }
    },

    minutesToHours(minutes) {
      var h = Math.floor(minutes / 60);
      var m = minutes % 60;
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      return h;
    },

    sortTasks() {
      this.sortingBool = !this.sortingBool;
      this.$store.commit("task/setSortTasks", this.sortingBool);
    },
  },
  watch: {
    taskSwitch(val) {
      if (val == "user") {
        this.$store.commit("task/setAllTypesTasks", this.currentUserTasks);
      } else if (val == "all") {
        this.$store.commit("task/setAllTypesTasks", this.totalTasks);
      } else if (val == "attached") {
        this.$store.commit("task/setAllTypesTasks", []);
      }
    },
  },
  created() {
    this.$store.dispatch("task/getTasks");
  },
};
</script>

<style>
.cardHead {
  background: #f5f5f5;
  min-height: 30px;
}
.taskCard {
  background: #f8f8f8 !important;
  box-shadow: inset 0 0 0 1px #f4f6ff !important;
  border: 1px solid #d3d2d2 !important;
  cursor: move !important;
}
.h-550 {
  height: 550px;
}
.m-h-76 {
  min-height: 100px;
}
/* The heart of the matter */
.testimonial-group > .boardRow {
  overflow-x: auto !important;
  white-space: nowrap !important;
}
.testimonial-group > .boardRow > .boards {
  display: inline-block !important;
  float: none !important;
}
.datePicker {
  width: 50%;
  border: 1px solid #e5e5e5 !important;
  text-indent: 2px;
  font-size: 10px;
  border-radius: 4px;
  color: #808080;
}
</style>