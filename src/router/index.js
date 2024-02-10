import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions';
import store from "../store/index.js";

const functions = getFunctions()
const isUserAdmin = httpsCallable(functions, 'isUserAdmin')

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: () => import("../views/HomePage/HomeView.vue"),
    meta: {
      requiresAuth: false,
      requiresRegistration: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegistrationPage/Register.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      requiresAuth: false,
      requiresRegistration: false,
      hideNavBar:true
    },
  },
  {
    path: "/exam/:data",
    name: "Exam",
    component: () => import("../views/ExamPage/Exam.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: true,
    },
  },
  {
    path: "/archivedexam/:data",
    name: "ArchivedExam",
    component: () => import("../views/ExamPage/ArchivedExam.vue"),
    meta: {
    },
  },
  {
    path: "/mockcontestscore",
    name: "MockContestScore",
    component: () => import("../views/MockContestScore.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: true,
    },
  },
  {
    path: "/evaluate",
    name: "Evaluate",
    component: () => import("../views/Evaluate.vue"),
    meta: {
      requiresAuth: false,
      requiresEvaluatorRegistration: false,
      hideNavBar:true,
      isEvaluator:true
    },
  },
  {
    path: "/evaluatorregister",
    name: "Evaluator Register",
    component: () => import("../views/EvaluatorRegistration.vue"),
    meta: {
      requiresAuth: true,
      requiresEvaluatorRegistration: false,
      hideNavBar:true,
      isEvaluator:true

    },
},
{
    path: "/admin",
    name: "Admin",
    component: () => import("../views/AdminPage/Admin.vue"),
    meta: {
      requiresAdmin: true
    }
},

{
  path: "/mockcontestleaderboard",
  name: "MockContestLeaderboard",
  component: () => import("../views/MockContestLeaderboard.vue"),
  meta: {
  },
},
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  var flag = true;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      if (to.matched.some((record) => record.meta.requiresRegistration)) {
        var isRegistered = store.state.isRegistered;
        if (isRegistered) {
          flag = true;
        } else {
          flag = false;
          next({
            path: '/register',
            query: { redirect: to.fullPath } // Pass the path user wanted to visit
          });
        }
      }

      if (flag) next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Pass the path user wanted to visit
      });
    }
  }
  else if(to.matched.some((record) => record.meta.requiresAdmin)){
    if(await getCurrentUser()){
      if((await isUserAdmin()).data){
        next()
      }
      else{
        alert("You don't have access")
      }
    }
    else{
      alert('login as admin')
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Pass the path user wanted to visit
      });

    }
  }
  else {
    next()
  }
  
});

export default router;
