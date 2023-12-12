import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import store from '../store/index.js'

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: () => import("../views/HomeView.vue"),
        meta: {
            requiresAuth: false,
            requiresRegistration: false
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import("../views/Register.vue"),
        meta: {
            requiresAuth: true,
            requiresRegistration: false
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("../views/Login.vue"),
        meta: {
            requiresAuth: false,
            requiresRegistration: false
        }
    },
    {
        path: '/democontestsubmit',
        name: 'DemoContestSubmit',
        component: () => import("../views/DemoContestSubmit.vue"),
        meta: {
            requiresAuth: true,
            requiresRegistration: false
        }
    },
    {
        path: '/livecontestsubmit',
        name: 'LiveContestSubmit',
        component: () => import("../views/LiveContestSubmit.vue"),
        meta: {
            requiresAuth: true,
            requiresRegistration: false
        },
    },
    {
        path: '/democontests/:data',
        name: 'DemoContests',
        component: () => import("../views/DemoContests.vue"),
        meta: {
            requiresAuth: true,
            requiresRegistration: false
        }
    },
    {
        path: '/live1',
        name: 'LiveContest1',
        component: () => import("../views/LiveContest1.vue"),
        meta: {
            requiresAuth: true,
            requiresRegistration: true
        }
    },
    {
        path: '/mddemo1',
        name: 'MdDemo1',
        component: () => import("../views/MdDemo1.vue"),
        meta: {
            requiresAuth: true,
            requiresRegistration: true
        }
    },
    {
        path: '/mddemo2',
        name: 'MdDemo1',
        component: () => import("../views/MdDemo2.vue"),
        meta: {
            requiresAuth: true,
            requiresRegistration: true
        }
    }

]

const router = createRouter( {

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
    var flag = true
    if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
        console.log('await getCurrentUser()', await getCurrentUser())
    if(to.matched.some((record) => record.meta.requiresRegistration)) {
        var isRegistered = store.state.isRegistered
        console.log('isRegistered', isRegistered)
        if(isRegistered) {
            flag = true
        } else {
            flag = false
            alert("First register to access this page")
            next("/")
        }
    }
    if(flag)
    next();
}
 else {
alert ("Login to access this page");
next ("/");
}
}
else {
    next();
}
});


export default router;