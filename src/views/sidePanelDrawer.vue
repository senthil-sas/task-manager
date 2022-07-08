<template>
  <div>

    <v-navigation-drawer class="updatepanel" v-model="updatePanel" overlay-color="transparent" :width="panelWidth" fixed right>
      <div class="d-flex pa-3 bg-f5 align-center updatePanelHead">
        <span class="fsize14 secondaryColor font-weight-bold pa-1">{{currentTask.task_name}}</span>
        <v-btn depressed color="light-blue" class="text-capitalize fsize12 white--text ml-4" height="24" @click="$store.commit('setExpandPanel' , expandPanel = !expandPanel)" v-model="expandPanel">More details</v-btn>
        <v-spacer></v-spacer>
        <v-icon color="light-blue" :ripple="false" @click="closePanel()">mdi-close-circle</v-icon>
      </div>

      <!-- update form -->
      <div class="d-flex pt-10">
        <div v-if="expandPanel">
          <div class="pa-4 commentsPart updateForm">
            comments
            <!-- <div class="d-flex" v-for="(c,i) in commentsData" :key="i">
              <v-flex xs3 class="secondaryColor">{{c.task_name}}</v-flex>
              <v-flex xs4 class="secondaryColor">{{c.comments}}</v-flex>
              <v-flex xs2 class="secondaryColor">{{c.created_on.split(' ')[0]}}</v-flex>
              <v-flex xs3></v-flex>
            </div> -->
          </div>
        </div>

        <!-- calcHeightPanel -->
        <div class="my-1 sidePanel rounded-lg d-flex flex-column align-end user-select-none">
          <div class="pt-4 updateForm" :style="expandPanel ? 'max-width: 50%' : 'max-width: 100%'">
            <v-form>
              <v-row class="pa-2 ma-0">
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2">
                  <v-text-field class="fsize12 secondaryColor" v-model="actualEffort" label="Actual Effort" dense type="time" height="20" hide-details="" name="appt-time" step="0" outlined></v-text-field>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2">
                  <v-menu v-model="dueDatePicker" :close-on-content-click="false" transition="scale-transition" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field class="fsize12" v-model="formatedDueDate" outlined persistent-hint label="Add due date" hide-details append-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="dueDate" :show-current="true" no-title @input="dueDatePicker = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2">
                  <v-select class="fsize12 secondaryColor" v-model="status" :items="statusList" label="Status" hide-details dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2">
                  <v-select class="fsize12 secondaryColor" v-model="assignedTo" :items="employeeList" label="Assigned To" hide-details dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2">
                  <v-select class="fsize12 secondaryColor" v-model="project" :items="projectList" label="Project" hide-details dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2">
                  <v-select class="fsize12 secondaryColor" v-model="manager" :items="['Pradeep K']" label="Manager" hide-details dense outlined menu-props="offset-y"></v-select>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2">
                  <v-file-input dense append-icon="mdi-folder-open" label="Add file" hide-details="" prepend-icon="" outlined></v-file-input>
                </v-col>
                <v-col sm="6" md="6" lg="5" class="pa-0 ma-2 d-flex align-center justify-center">
                  <v-switch sm v-model="billable" inset flat hide-details dense :ripple="false" color="light-blue" class="fsize12 secondaryColor ml-2 mt-0" label="Billable"></v-switch>
                </v-col>
              </v-row>
              <!-- <v-textarea filled v-model="comments" placeholder="Comments" class="px-3 secondaryColor" :rules="commentRules"></v-textarea> -->
              <vue-editor @image-added="handleImageAdded" class="pa-4" v-model="content"></vue-editor>
              <!-- <v-rich-text-editor v-model="content" /> -->
            </v-form>
          </div>
        </div>
      </div>

      <!-- footer -->
      <div class="footerPad d-flex align-center justify-space-between pa-2 ">
        <a class="fsize12 primaryColor pr-6">Create on {{getDateString(new Date(currentTask.start_date), "d-M-y")}}</a>
        <div>
          <v-btn depressed color="grey lighten-2" @click="closePanel()" class="text-capitalize black--text mr-2">Cancel</v-btn>
          <v-btn depressed color="light-blue" @click="updateTask()" class="text-capitalize white--text">Update</v-btn>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { mapGetters } from "vuex";
import commonFunc from "../mixins/common";
export default {
  mixins: [commonFunc],
  data: () => ({
    // update task fields
    actualEffort: "00:00",
    assignedTo: JSON.parse(localStorage.getItem("currentUserData")).emp_name,
    project: "",
    manager: "",
    statusList: ["In Progress", "Completed", "Pending", "Cancelled"],
    status: "In Progress",
    dueDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dueDatePicker: false,
    comments: "",
    billable: true,
    commentRules: [
      (v) => !!v || "Comments is required",
      (v) =>
        (v && v.length >= 25) || "Comments must be greater than 50 characters",
    ],
    content: "<span>Description</span>",
  }),
  components: {
    VueEditor,
  },
  computed: {
    ...mapGetters({ currentTask: "getCurrentTask" }),
    ...mapGetters("project", { projectList: "getProjectsList" }),
    ...mapGetters("employee", { employeeList: "getEmployeeList" }),
    ...mapGetters("task", { commentsData: "getCommentsData" }),
    ...mapGetters({
      sidePanelState: "getUpdateTaskPanel",
      expandPanelBool: "getExpandPanel",
      panelWidth: "getPanelWidth",
    }),

    // formate date
    formatedDueDate: function () {
      return this.formatDate(this.dueDate);
    },
    updatePanel: {
      get() {
        return this.sidePanelState;
      },
      set(val) {
        this.$store.commit("setUpdateTaskPanel", val);
      },
    },
    expandPanel: {
      get() {
        return this.expandPanelBool;
      },
      set(val) {
        this.$store.commit("setExpandPanel", val);
      },
    },
  },

  methods: {
    closePanel() {
      this.$store.commit("setUpdateTaskPanel", "close");
    },
    updateTask(task) {
      var projId;
      var managerId;
      this.projectList.forEach((el) => {
        if (el.project_name == this.project) {
          projId = el.project_id;
        }
        if (el.manager_name == this.currentTask.task_manager) {
          managerId = el.manager;
        }
      });
      let jsonObj = {
        actual_hour: this.actualEffort,
        end_date: this.dueDate,
        task_status: this.status,
        assigned_to: this.assignedTo,
        task_manager: managerId,
        project_name: this.project,
        project_id: projId,
        description: "",
        comments: this.comments,
        id: this.currentTask.id,
      };
      this.$store.dispatch("task/updateTask", jsonObj);
      this.$toast.success(
        `Task Updated Successfully (${this.currentTask.task_name})`,
        {
          position: "bottom-center",
          timeout: 1500,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: false,
          closeButton: "button",
          icon: true,
          rtl: false,
        }
      );
      this.$store.commit("setUpdateTaskPanel", "close");
    },

    formatDate(date) {
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    handleImageAdded() {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

      var formData = new FormData();
      formData.append("image", file);

      // axios({
      //   url: "https://fakeapi.yoursite.com/images",
      //   method: "POST",
      //   data: formData
      // })
      //   .then(result => {
      //     const url = result.data.url; // Get url from response
      //     Editor.insertEmbed(cursorLocation, "image", url);
      //     resetUploader();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
  },

  created() {
    let jsonObj = {
      end_Date: "25/2/2022",
      start_Date: "25/2/2022",
    };
    this.$store.dispatch("project/getProjects");
    this.$store.dispatch("employee/getEmployees");
    // this.$store.dispatch("task/getComments", jsonObj);
  },
};
</script>

<style>
.footerPad {
  width: 100%;
  background-color: #f5f5f5;
  position: absolute;
  bottom: 0;
  height: auto;
}
.calcHeightPanel {
  height: calc(100vh - 176px) !important;
}
.text-overflow {
  width: 400px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.updateForm {
  max-height: 650px;
  overflow-y: auto;
}
.bg-f5 {
  background-color: #f5f5f5;
}
.sidePanel {
  /* border: 1px solid #e5e5e5 !important; */
  box-shadow: none !important;
  /* max-width: 80%; */
}

/* nav new design css */
.updatepanel {
  top: 56px !important;
  /* left: 74px !important; */
  height: calc(100vh - 56px) !important;
}
.commentsPart {
  height: calc(100vh - 56px) !important;
  overflow-y: auto;
}
.updatePanelHead {
  position: fixed;
  width: 100%;
  z-index: 1;
}
.grey-clr {
  background-color: #ededed;
}
.updatepanel .v-navigation-drawer__border {
  width: 0px !important;
}
</style>