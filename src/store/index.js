import { createStore } from 'vuex'

const state = {
    navState: sessionStorage.getItem('navState') || '',
    policeTrainingRefresh: false,
}

export default createStore({
    state,
    mutations: {
        saveNavState(state, payload) {
            state.navState = payload
            sessionStorage.setItem('navState', payload)
        },
        changePoliceTrainingRefresh(state, payload) {
            state.policeTrainingRefresh = !state.policeTrainingRefresh
        }
    }
})
