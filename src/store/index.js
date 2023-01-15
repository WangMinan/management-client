import { createStore } from 'vuex'

const state = {
    navState: sessionStorage.getItem('navState') || ''
}

export default createStore({
    state,
    mutations: {
        saveNavState(state, payload) {
            state.navState = payload
            sessionStorage.setItem('navState', payload)
        }
    }
})
