import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
const user = JSON.parse(sessionStorage.getItem('user') || "{}")

const $axios = axios.create({
  baseURL: process.env.VUE_APP_API,
})

export default new Vuex.Store({
  state: {
    busy: false,
    status: '',
    token: sessionStorage.getItem('token') || '',
    user: user,
    rol: user.ID_ROL,
    roles: [],
    alert: {}
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
      state.busy = true
    },
    auth_success(state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.user = payload.user
      state.rol = payload.user.ID_ROL
      state.busy = false
    },
    auth_error(state) {
      state.status = 'error'
      state.busy = false
    },
    recover_request(state){
      state.status = 'loading'
      state.busy = true
    },
    recover_success(state){
      state.status = 'success'
      state.busy= false
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.user = {}
      state.rol = ''
    },
    roles_request(state) {
      state.status = 'loading'
      state.busy = true
    },
    roles_success(state, payload) {
      state.status = 'success'
      state.busy = false
      state.roles = payload
    },
    roles_error(state) {
      state.status = 'error'
      state.busy = false
    },
    showalert(state, payload) {
      state.alert.model = payload.model
      state.alert.type = payload.type
      state.alert.message = payload.message
      state.alert.next = payload.next
    }
  },
  actions: {
    initialize({ commit }) {
      return new Promise((resolve, reject) => {
        commit('roles_request')
        $axios.get('/rols')
          .then(resp => {
            sessionStorage.setItem('roles', JSON.stringify(resp.data))
            commit('roles_success', resp.data)
            resolve(resp)
          })
          .catch(err => {
            console.log(err)
            commit('roles_error')
            sessionStorage.removeItem('roles')
            reject(err)
          })
      })
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        $axios.post('/auth/login', user)
          .then(resp => {
            const token = resp.data.token
            const user = resp.data.user
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('user', JSON.stringify(user))
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', { token, user })
            resolve(resp)
          })
          .catch(err => {
            console.log(err)
            commit('auth_error')
            sessionStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        sessionStorage.clear()
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
    tokenExpire({ commit }) {
      return new Promise((resolve) => {
        commit('showalert', {
          model: true,
          type: 'error',
          message: 'Su sesion ha expirado, sera redirigido al inicio',
          next:()=>{commit('logout')}
        })
        sessionStorage.clear()
        delete axios.defaults.headers.common['Authorization']

        resolve()
      })
    },
    recover({commit}, user){
      return new Promise((resolve, reject) => {
      commit('recover_request')
      $axios.post('/auth/recover',user).then(()=>{
        commit('recover_success')
        resolve()
      }).catch(reject)
    })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: () => JSON.parse(sessionStorage.getItem('user'))
  }
})
