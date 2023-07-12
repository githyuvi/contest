import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import store from '../store/index.js'



console.log("router running")

const routesData = [
    ['/', 'HomeView'],
    ['/register', 'Register'],
    ['/login', 'Login'],
    ['/q1', 'q1'],
    ['/q2', 'q2'],
    ['/q3', 'q3'],
    ['/poll', 'Poll'],
    ['/pollresults', 'PollResults'],
    ['/q4', 'q4'],
    ['/q5tiptap', 'q5tiptap'],
    ['/chk', 'Chk'],
    ['/q6','q6'],
    ['/q7','q7'],
    ['/contest1','Contest1'],
    ['/c1q1','problems/c1q1'],
    ['/c1q2','problems/c1q2'],
    ['/c1q3','problems/c1q3'],
    ['/contest2','Contest2'],
    ['/contest3','Contest3'],
    ['/account','Account'],
    ['/imagepreviewdemo','ImagePreviewDemo'],
    ['/admin', 'Admin'],
    ['/democontests/:data', 'DemoContests'],
    ['/livecontestsubmit', 'LiveContestSubmit'],
    ['/live1','LiveContest1'],
    ['/imagepreview2','ImagePreview2'],
    
]

const routes = []

routesData.forEach((routeData) => {
    const obj = {}
    obj.path = routeData[0]
    obj.component = () => import("../views/" + routeData[1] + ".vue")
    obj.meta = {requiresAuth: true}
    routes.push(obj)    
});

routes[0].meta.requiresAuth = false
// routes[1].meta.requiresAuth = false
routes[2].meta.requiresAuth = false
routes[24].meta.requiresRegistration = true

// //manually importing files as build cannot read dynamically imported files
// routes[0].component = () => import("../views/HomeView.vue")
// routes[1].component = () => import("../views/Register.vue")
// routes[2].component = () => import("../views/Login.vue")
// routes[3].component = () => import("../views/q1.vue")
// routes[4].component = () => import("../views/q2.vue")
// routes[5].component = () => import("../views/q3.vue")
// routes[6].component = () => import("../views/Poll.vue")
// routes[7].component = () => import("../views/PollResults.vue")
// routes[8].component = () => import("../views/q4.vue")
// routes[9].component = () => import("../views/q5tiptap.vue")
// routes[10].component = () => import("../views/Chk.vue")
// routes[11].component = () => import("../views/q6.vue")
// routes[12].component = () => import("../views/q7.vue")


const router = createRouter( {

 history: createWebHistory(),
 routes: routes,


});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                // console.log(user.uid)
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
}else {
    next();
}
});


export default router;