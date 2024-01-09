// store.js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      isLoggedIn: '',
      isRegistered: false,
      userId: '',
      userName: '',
      userEmail: '',
      userImageUrl: '',
      questionData:{"answerstatus":{}},
      totalAnswered:0,
      totalUnAnswered:0
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
    setQuestionData(state, value) {
      state.questionData = value
    },
    setTotalAnswered(state, value) {
      state.totalAnswered = value
    },
    setTotalUnAnswered(state, value) {
      state.totalUnAnswered = value
    }
  }

  
})

const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
if (storedIsLoggedIn == 'true') {
  store.commit('setIsLoggedIn', JSON.parse(storedIsLoggedIn));
}

const storedIsRegistered = localStorage.getItem('isRegistered');
if (storedIsLoggedIn == 'true') {
  store.commit('setIsRegistered', JSON.parse(storedIsRegistered));
}

const storedUserId = localStorage.getItem('userId');
if (storedIsLoggedIn == 'true') {
  store.commit('setUserId', JSON.parse(storedUserId));
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