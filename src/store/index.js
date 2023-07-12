// store.js
import { createStore } from 'vuex'

console.log("store running")

const store = createStore({
  state() {
    return {
      isLoggedIn: '',
      isRegistered: false,
      userId: '',
      userName: '',
      userEmail: '',
      userImageUrl: '',
    }
  },
  mutations: {
    setIsLoggedIn(state, value) {
      state.isLoggedIn = value
      localStorage.setItem('isLoggedIn', JSON.stringify(value));
    },
    setIsRegistered(state, value) {
      state.isRegistered = value
      localStorage.setItem('isRegistered', JSON.stringify(value));
    },
    setUserId(state, value) {
      state.userId = value
      localStorage.setItem('userId', JSON.stringify(value));
    },
    setUsername(state, value) {
      state.userName = value
      localStorage.setItem('userName', JSON.stringify(value));
    },
    setUserEmail(state, value) {
      state.userEmail = value
      localStorage.setItem('userEmail', JSON.stringify(value));
    },
    setUserImageUrl(state, value) {
      state.userImageUrl = value
      localStorage.setItem('userImageUrl', JSON.stringify(value));
    },
  }

  
})

const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
if (storedIsLoggedIn == 'true') {
  console.log('storedisloggedin', storedIsLoggedIn)
  store.commit('setIsLoggedIn', JSON.parse(storedIsLoggedIn));
}

const storedIsRegistered = localStorage.getItem('isRegistered');
if (storedIsLoggedIn == 'true') {
  store.commit('setIsRegistered', JSON.parse(storedIsRegistered));
}

const storedUserId = localStorage.getItem('userId');
if (storedIsLoggedIn == 'true') {
  store.commit('setUserId', JSON.parse(storedUserId));
  console.log("storedUserId", storedUserId)
}

const storedUserName = localStorage.getItem('userName');
if (storedIsLoggedIn == 'true') {
  store.commit('setUsername', JSON.parse(storedUserName));
}

const storedUserEmail = localStorage.getItem('userEmail');
if (storedIsLoggedIn == 'true') {
  store.commit('setUserEmail', JSON.parse(storedUserEmail));
}

const storedUserImageUrl = localStorage.getItem('userImageUrl');
if (storedIsLoggedIn == 'true') {
  store.commit('setUserImageUrl', JSON.parse(storedUserImageUrl));
}

export default store