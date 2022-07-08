import service from '../../store/httpService.js'
import router from '@/router'

const customer = {
    namespaced: true,
    state: {
        customersData: [],
        allCustomerNames: [],
    },
    mutations: {
        setCustomers (state, payload) {
            state.customersData = []
            payload.forEach(el => {
                el.cust_name != ' ' ? state.customersData.push(el) : ''
                el.cust_name != ' ' ? state.allCustomerNames.push(el.cust_name) : ''
            })
        }
    },
    actions: {
        getCustomers ({ commit }) {
            commit('setLoader', true, { root: true })
            service.getCustomer({}).then(response => {
                if (response.status == 200 && response.data.result) {
                    commit('setCustomers', response.data.result);
                }
            }).finally(() => { commit('setLoader', false, { root: true }) })
        },
        async createCustomer ({ commit,dispatch }, payload) {
            commit('setLoader', true, { root: true })
            let response = await service.createCustomer(payload)
            if (response.status == 200 && response.data['status'] == 1) {
                dispatch('getCustomers')
            }
            commit('setLoader', false, { root: true })
        }
    },
    getters: {
        getCustomers: state => {
            return state.customersData;
        },
        getAllCustomerNames: state => {
            return state.allCustomerNames;
        }
    }
}
export default customer;