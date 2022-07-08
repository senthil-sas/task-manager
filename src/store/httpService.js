import axios from "axios";

// var BASEURL = `http://103.231.42.211:8080/TaskManagerService/`
var BASEURL = 'http://rest.amoga.tech/SasTaskManagerService/'

const AXIOS = axios.create({
    baseURL: `${BASEURL}`,
});

export default {
    data: () => ({
        headers: { "Content-Type": "application/json" },
    }),

    getAuthHeaders () {
        let userId = localStorage.getItem('userId');
        let sessionId = localStorage.getItem('sessionId');
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId} ${sessionId}`,
        };
        return headers;
    },
    login: async function (jsonObj) {
        return await AXIOS.post(`employee/empLogin`, jsonObj, {
            headers: this.headers,
        });
    },
    checkIn: async function (jsonObj) {
        return await AXIOS.post(`checkinout/insertCheckin`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    getEmployee: async function (jsonObj) {
        return await AXIOS.post(`employee/getListEmployeeDetails`, jsonObj, {
            headers: this.headers,
        });
    },
    getCustomer: async function (jsonObj) {
        return await AXIOS.post(`customerdetails/getCustomerDetails`, jsonObj, {
            headers: this.headers,
        });
    },

    getProjects: async function (jsonObj) {
        return await AXIOS.post(`project/getprojectDetailsList`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },

    getTasks: async function (jsonObj) {
        return await AXIOS.post(`task/getTaskList`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    getReports: async function (jsonObj) {
        return await AXIOS.post(`reports/getTaskHourReport`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    getComments: async function (jsonObj) {
        return await AXIOS.post(`reports/getComments`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    createCustomer: async function (jsonObj) {
        return await AXIOS.post(`customerdetails/insertCustomerDetails`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    createProject: async function (jsonObj) {
        return await AXIOS.post(`project/insertProjectDetails`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    createTask: async function (jsonObj) {
        return await AXIOS.post(`taskV2/insertTaskNew`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    statusUpdate: async function (jsonObj) {
        return await AXIOS.post(`taskV2/updateTaskStatus`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },
    updateTask: async function (jsonObj) {
        return await AXIOS.post(`taskV2/updateTask`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },

    checkout: async function (jsonObj) {
        return await AXIOS.post(`checkinout/updateCheckout`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    },

    getCustomerTasks: async function (jsonObj) {
        return await AXIOS.post(`taskV2/getClientProjectDetails`, jsonObj, {
            headers: this.getAuthHeaders(),
        });
    }
}