<template>
  <div>
    <div class="ma-4  d-flex align-center justify-space-between">
      <div class="indigo--text">Customer details</div>
      <v-btn depressed color="primary" class="text-capitalize" @click="createCustomerDialog = true">Add</v-btn>
    </div>
    <v-card class="ma-4">
      <v-simple-table fixed-header id="tableData">
        <thead>
          <tr class="tableRow">
            <th class="tableHeader bg-lightgrey">S.No</th>
            <th class="tableHeader bg-lightgrey">Customer Name</th>
            <th class="tableHeader bg-lightgrey">Customer Shortname</th>
            <th class="tableHeader bg-lightgrey">Address One</th>
            <th class="tableHeader bg-lightgrey">Address Two</th>
            <th class="tableHeader bg-lightgrey">Mobile Number</th>
            <th class="tableHeader bg-lightgrey">Email ID</th>
            <th class="tableHeader bg-lightgrey">SPOC Name</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tableRow" v-for="(i,idx) in customerData" :key="idx">
            <td class="tableContent">{{idx+1}}</td>
            <td class="tableContent">{{i.cust_name}}</td>
            <td class="tableContent">{{i.cust_short_name}}</td>
            <td class="tableContent">{{i.address_1}}</td>
            <td class="tableContent">{{i.address_2}}</td>
            <td class="tableContent">{{i.contact_mobile}}</td>
            <td class="tableContent">{{i.contact_email}}</td>
            <td class="tableContent">{{i.spoc_name}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>

    <!-- create customer dialog -->
    <v-row justify="center">
      <v-dialog v-model="createCustomerDialog" max-width="900" persistent transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar height="50" color="black" tile class="white--text">
            <div class="text-center w-100">
              Create Customer
            </div>
          </v-toolbar>
          <v-container fluid>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="customerName" label="customer Name" :rules="customerNameRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="shortName" label="customer short Name" :rules="shortNameRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="spocName" label="SPOC Name" :rules="spocNameRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="addressLine1" label="Address Line 1" :rules="address1Rules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="addressLine2" label="Address Line 2" :rules="address2Rules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="contactNo" label="Contact Number" :rules="contactNoRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="emailId" label="Email" :rules="emailIdRules" dense outlined></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-file-input dense append-icon="mdi-folder-open" prepend-icon="" label="Choose File" outlined></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <div class="d-flex justify-center pa-4">
            <v-btn color="grey darken-1" class="mr-3 text-capitalize" outlined @click="resetValidation()">
              Close
            </v-btn>
            <v-btn color="red" class="mr-3 text-capitalize" outlined @click="reset()">Reset</v-btn>
            <v-btn color="blue darken-1" class="text-capitalize" outlined @click="createCustomer()">
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
  name: "customer",
  data: () => ({
    createCustomerDialog: false,
    customerName: "",
    shortName: "",
    spocName: "",
    addressLine1: "",
    addressLine2: "",
    contactNo: "",
    emailId: "",
    customerNameRules: [(v) => !!v || "Customer Name is required"],
    shortNameRules: [(v) => !!v || "Customer Short Name is required"],
    spocNameRules: [(v) => !!v || "SPOC Name is required"],
    address1Rules: [(v) => !!v || "Address Line 1 is required"],
    address2Rules: [(v) => !!v || "Address Line 2 is required"],
    contactNoRules: [(v) => !!v || "Contact Number is required"],
    emailIdRules: [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),
  computed: {
    ...mapGetters("customer", {
      customerData: "getCustomers",
    }),
  },
  methods: {
    createCustomer() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.createCustomerDialog = false;
        this.$store.dispatch("customer/createCustomer", {
          cust_name: this.customerName,
          cust_short_name: this.shortName,
          address_1: this.addressLine1,
          address_2: this.addressLine2,
          contact_mobile: this.contactNo,
          contact_email: this.emailId,
          spoc_name: this.spocName,
          logo: "logo",
        });
        this.reset();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.createCustomerDialog = false;
      this.$refs.form.resetValidation();
      this.reset();
    },
  },
  created() {
    this.$store.dispatch("customer/getCustomers");
  },
};
</script>

<style>
</style>