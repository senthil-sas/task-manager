import service from '../../store/httpService.js'
import router from '@/router'

const project = {
    namespaced: true,
    state: {
        projects: [],
        projectList:[],
        managersData: [],
    },
    mutations: {
        setProjects (state, payload) {
            state.projects = payload
            payload.forEach(el => {
                state.projectList.push(el.project_name)
            })
        },
        setManagersData(state, payload) {
            payload.forEach(el => {
                if (el.manager_name && el.manager_name != ' ') {
                    state.managersData.push(el.manager_name)
                }
            })
        }
    },
    actions: {
        getProjects ({ commit }) {
            commit('setLoader', true, { root: true })
            service.getProjects({}).then(response => {
                if (response.status == 200 && response.data.result) {
                    commit('setProjects', response.data.result);
                    commit('setManagersData', response.data.result);
                }
            }).finally(() => { commit('setLoader', false, { root: true }) })
        },
        async createProject ({ commit, dispatch }, payload) {
            commit('setLoader', true, { root: true })
            service.createProject(payload).then(response => {
                if (response.status == 200 && response.data['status'] == 1) {
                    dispatch('getProjects')
                }
            }).finally(() => { commit('setLoader', false, { root: true }) })
            commit('setLoader', false, { root: true })
        }
    },
    getters: {
        getProjects: state => {
            return state.projects;
        },
        getProjectsList: state => {
            return state.projectList;
        },
        getManagersData: state => {
            return state.managersData;
        }
    }
}
export default project;