import service from '../../store/httpService.js'
import router from '@/router'

const task = {
    namespaced: true,
    state: {
        totalTasks: [],
        currentUserTaks: [],
        currentTasks: [],
        commentsData: [],

        // types of tasks
        openTasks: [],
        inProgressTasks: [],
        completedTasks: [],
        pendingTasks: [],
        reviewTasks: [],
    },
    mutations: {
        setTasks (state, payload) {
            state.totalTasks = payload
            this.commit('task/setCurrentUserTaks', payload)
        },

        setCurrentTaks (state, payload) {
            state.currentTasks = payload
        },

        setCurrentUserTaks (state, payload) {
            state.currentUserTaks = []
            var empId = JSON.parse(localStorage.getItem('currentUserData')).emp_id
            payload.forEach(el => {
                el.assigned_to == empId ? state.currentUserTaks.push(el) : ''
            });
            this.commit('task/setCurrentTaks', state.currentUserTaks)

            // set different types of tasks
            let openTasks = []
            let inProcTasks = []
            let completedTasks = []
            let pendingTasks = []
            let reviewTasks = []
            state.currentUserTaks.forEach(el => {
                if (el.task_status == 'Open') {
                    openTasks.push(el)
                } else if (el.task_status == 'In-Progress') {
                    inProcTasks.push(el)
                } else if (el.task_status.toLowerCase() == 'pending') {
                    pendingTasks.push(el)
                } else if (el.task_status == 'Review') {
                    reviewTasks.push(el)
                }
            })
            this.commit('task/setOpenTasks', openTasks)
            this.commit('task/setInProgressTasks', inProcTasks)
            this.commit('task/setCompletedTasks', completedTasks)
            this.commit('task/setReviewTasks', reviewTasks)
        },

        setCommentsData (state, payload) {
            state.commentsData = payload
        },

        setOpenTasks (state, payload) {
            state.openTasks = payload
            console.log("🚀 ~ file: task.js ~ line 64 ~ setOpenTasks ~ state.openTasks", state.openTasks)
        },

        setInProgressTasks (state, payload) {
            state.inProgressTasks = payload
            console.log("🚀 ~ file: task.js ~ line 69 ~ setInProgressTasks ~ state.inProgressTasks", state.inProgressTasks)
        },

        setCompletedTasks (state, payload) {
            state.completedTasks = payload
            console.log("🚀 ~ file: task.js ~ line 74 ~ setCompletedTasks ~ state.completedTasks", state.completedTasks)
        },

        setPendingTasks (state, payload) {
            state.pendingTasks = payload
            console.log("🚀 ~ file: task.js ~ line 79 ~ setPendingTasks ~ state.pendingTasks", state.pendingTasks)
        },

        setReviewTasks(state, payload) {
            state.reviewTasks = payload
            console.log("🚀 ~ file: task.js ~ line 86 ~ setReviewTasks ~ state.reviewTasks", state.reviewTasks)
        }

    },
    actions: {
        async getTasks ({ commit }) {
            commit('setLoader', true, { root: true })
            await service.getTasks().then(response => {
                if (response.status == 200 && response.data.result) {
                    commit('setTasks', response.data.result);
                } else {
                    commit('setTasks', []);
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    router.push("/");
                }
            }).finally(() => { commit('setLoader', false, { root: true }) })
        },
        async createTasks ({ commit, dispatch }, payload) {
            service.insertTasks().then(response => {
                if (response.status == 200 && response.data.result) {
                    dispatch('getTasks');
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    router.push("/");
                }
            }).finally(() => { commit('setLoader', false, { root: true }) })
        },
        async getComments ({ commit }, payload) {
            await service.getComments(payload).then(response => {
                if (response.status == 200 && response.data.result) {
                    commit('setCommentsData', response.data.result);
                } else {
                    commit('setCommentsData', []);
                }
            }).finally(() => { })
        }
    },
    getters: {
        getAllTasks: state => {
            return state.totalTasks;
        },
        getCurrentUserTaks: state => {
            return state.currentUserTaks;
        },
        getCurrentTasks: state => {
            return state.currentTasks;
        },
        getCommentsData: state => {
            return state.commentsData;
        },
        getOpenTasks: state => {
            return state.openTasks;
        },
        getInProgressTasks: state => {
            return state.inProgressTasks;
        },
        getCompletedTasks: state => {
            return state.completedTasks;
        },
        getPendingTasks: state => {
            return state.pendingTasks;
        },
        getReviewTasks: state => {
            return state.reviewTasks;
        }
    }
}
export default task;