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
        fixedTasks: [],
        cancelledTasks: [],
        pendingTasks: [],
        completedTasks: [],
        reviewTasks: [],
    },
    mutations: {
        setTasks (state, payload) {
            state.totalTasks = payload
            this.commit('task/setCurrentUserTaks', payload)
            this.commit('task/setAllTypesTasks', state.currentUserTaks)
        },

        setCurrentTasks (state, payload) {
            state.currentTasks = payload
        },

        setCurrentUserTaks (state, payload) {
            state.currentUserTaks = []
            var empId = JSON.parse(localStorage.getItem('currentUserData')).emp_id
            payload.forEach(el => {
                el.assigned_to == empId ? state.currentUserTaks.push(el) : ''
            });
            this.commit('task/setCurrentTasks', state.currentUserTaks)
            this.commit('task/setAllTypesTasks', state.currentUserTaks)
        },

        setAllTypesTasks (state, payload) {
            // set different types of tasks
            let openTasks = []
            let inProcTasks = []
            let fixedTasks = []
            let cancelledTasks = []
            let completedTasks = []
            let pendingTasks = []
            let reviewTasks = []
            let closedDuplicate = []
            let closedRejected = []
            let closedAbsolute = []
            payload.forEach(el => {
                if (el.task_status == 'Open') {
                    openTasks.push(el)
                } else if (el.task_status == 'In-Progress') {
                    inProcTasks.push(el)
                } else if (el.task_status.toLowerCase() == 'Pending') {
                    pendingTasks.push(el)
                } else if (el.task_status == 'Review') {
                    reviewTasks.push(el)
                } else if (el.task_status == 'Cancelled') {
                    cancelledTasks.push(el)
                } else if (el.task_status == 'Fixed') {
                    fixedTasks.push(el)
                }
            })
            this.commit('task/setOpenTasks', openTasks)
            this.commit('task/setInProgressTasks', inProcTasks)
            this.commit('task/setFixedTasks', fixedTasks)
            this.commit('task/setCancelledTasks', cancelledTasks)
            this.commit('task/setPendingTasks', pendingTasks)
            this.commit('task/setCompletedTasks', completedTasks)
            this.commit('task/setReviewTasks', reviewTasks)
        },

        setCommentsData (state, payload) {
            state.commentsData = payload
        },

        setOpenTasks (state, payload) {
            state.openTasks = payload
        },

        setInProgressTasks (state, payload) {
            state.inProgressTasks = payload
        },

        setFixedTasks (state, payload) {
            state.fixedTasks = payload
        },

        setCancelledTasks (state, payload) {
            state.cancelledTasks = payload
        },

        setPendingTasks (state, payload) {
            state.pendingTasks = payload
        },

        setCompletedTasks (state, payload) {
            state.completedTasks = payload
        },

        setReviewTasks (state, payload) {
            state.reviewTasks = payload
        },

        setClosedDuplicate (state, payload) {
            state.closedDuplicateTasks = payload
        },

        setClosedRejected (state, payload) {
            state.closedRejectedTasks = payload
        },

        setClosedAbsolute (state, payload) {
            state.closedAbsoluteTasks = payload
        },

        setSortTasks (state, sortBool) {
            if (sortBool) {
                state.currentTasks.sort((a, b) =>
                    b.task_name > a.task_name ? 1 : a.task_name > b.task_name ? -1 : 0
                )
            } else {
                state.currentTasks.sort((a, b) =>
                    a.task_name > b.task_name ? 1 : b.task_name > a.task_name ? -1 : 0
                )
            }
            this.commit('task/setCurrentTasks', state.currentTasks)
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

        // tasks different's types
        getOpenTasks: state => {
            return state.openTasks;
        },
        getInProgressTasks: state => {
            return state.inProgressTasks;
        },
        getFixedTasks: state => {
            return state.fixedTasks;
        },
        getCancelledTasks: state => {
            return state.cancelledTasks;
        },
        getPendingTasks: state => {
            return state.pendingTasks;
        },
        getCompletedTasks: state => {
            return state.completedTasks;
        },
        getReviewTasks: state => {
            return state.reviewTasks;
        },
    }
}
export default task;