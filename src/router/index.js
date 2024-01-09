import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import store from "../store/index.js";


const routes = [
  {
    path: "/",
    name: "HomeView",
    component: () => import("../views/HomeView.vue"),
    meta: {
      requiresAuth: false,
      requiresRegistration: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Registration/Register.vue"),
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
    path: "/democontestsubmit",
    name: "DemoContestSubmit",
    component: () => import("../views/DemoContestSubmit.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: false,
    },
  },
  {
    path: "/livecontestsubmit",
    name: "LiveContestSubmit",
    component: () => import("../views/LiveContestSubmit.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: false,
    },
  },
  {
    path: "/democontests/:data",
    name: "DemoContests",
    component: () => import("../views/DemoContests.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: false,
    },
  },
  {
    path: "/mockcontest",
    name: "MockContest",
    component: () => import("../views/MockContest.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: true,
      hideNavBar: true
    },
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   redirect: '/'
  // },
  {
    path: "/mock20",
    name: "Mock20",
    component: () => import("../views/Mock20.vue"),
    meta: {
      requiresAuth: true,
      requiresRegistration: true,
      hideNavBar: true
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
    component: () => import("../views/Admin.vue"),
    meta: {
      requiresAuth: false,
      hideNavBar:true,

    },
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
      // if (
      //   to.matched.some((record) => record.meta.requiresEvaluatorRegistration)
      // ) {
      //   const db = getDatabase();
      //   const dbRef = firebaseRef(db);
      //   const userId = store.state.userId;

      //   await get(child(dbRef, "evaluators/" + userId.value + "/registered"))
      //     .then((snapshot) => {
      //       if (snapshot.exists()) {
      //         const isEvaluatorRegistered = snapshot.val();
      //         if (isEvaluatorRegistered) {
      //           flag = true;
      //         } else {
      //           flag = false;
      //           alert("First register to access this page");
      //           next("/register");
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       alert("couldn't fetch results");
      //     });
      // }
      if (flag) next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Pass the path user wanted to visit
      });
      

    //   if(to.matched.some((record) => record.meta.isEvaluator))
    //   {
    //     next('/evaluate');
    //   }
    // else{
    //     next('/');
    // }
    }
  } else {
    next();
  }
});

export default router;
