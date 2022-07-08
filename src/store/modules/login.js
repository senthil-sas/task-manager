import service from '../../store/httpService.js'
import router from '@/router'

// Vue.use(Toast, {
//     transition: "Vue-Toastification__fade",
//     maxToasts: 20,
//     newestOnTop: true
// });

const login = {
    namespaced: true,

    state: {
        userData: [],
        currentEmpId: ''
    },

    mutations: {
        setUserData (state, payload) {
            state.userData = payload;
        },
        setCurrentEmpId (state, payload) {
            state.currentEmpId = payload;
        }
    },

    actions: {
        async login ({ state, commit, dispatch, rootState }, payload) {
            await service.login(payload).then((response) => {
                if (response.status == 200 && response.data.message == 'login Sucesss') {
                    commit('setUserData', response.data.result);
                    localStorage.setItem('userId', response.data.result.emp_email);
                    localStorage.setItem('sessionId', response.data.result.tokenkey);
                    localStorage.setItem('currentUserData', JSON.stringify(response.data.result));
                    dispatch('checkIn', { emp_id: response.data.result.emp_id })
                    // 
                    localStorage.setItem('currentUser', response.data.result.userOrCustomer);
                    localStorage.setItem('clientProjectId', response.data.result.projectId);
                    commit('setCurrentUser', response.data.result.userOrCustomer, { root: true });
                    commit('setClientProjectId', response.data.result.projectId, { root: true });
                } else {
                    
                }
            }).finally(() => { });
        },
        async checkIn ({ commit, rootGetters }, payload) {
            await service.checkIn(payload).then(() => {
                rootGetters.getCurrentUser == 'Customer' ? router.push('/task') : router.push('/dashboard')
            })
        },
        async ckeckout ({ commit }, payload) {
            await service.checkout(payload).then(() => {
                router.push('/')
            })
        }
    },
    getters: {
        getUserData: state => {
            return state.userData;
        },
        getCurrentEmpId: state => {
            return state.currentEmpId;
        }
    }
}

export default login