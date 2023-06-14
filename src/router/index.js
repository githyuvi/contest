import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

console.log("router running")

const routesData = [
    ['/', 'Poll'],
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
    ['/imagepreview','ImagePreview'],
    ['/imagepreview2','ImagePreview2']
    
]

const routes = []

routesData.forEach((routeData) => {
    const obj = {}
    obj.path = routeData[0]
    // obj.component = () => import("../views/" + routeData[1] + ".vue")
    obj.meta = {requiresAuth: false}

    routes.push(obj)
    
});

routes[0].meta.requiresAuth = false
// routes[1].meta.requiresAuth = false
routes[2].meta.requiresAuth = false

//manually importing files as build cannot read dynamically imported files
routes[0].component = () => import("../views/HomeView.vue")
routes[1].component = () => import("../views/Register.vue")
routes[2].component = () => import("../views/Login.vue")
routes[3].component = () => import("../views/q1.vue")
routes[4].component = () => import("../views/q2.vue")
routes[5].component = () => import("../views/q3.vue")
routes[6].component = () => import("../views/Poll.vue")
routes[7].component = () => import("../views/PollResults.vue")
routes[8].component = () => import("../views/q4.vue")
routes[9].component = () => import("../views/q5tiptap.vue")
routes[10].component = () => import("../views/Chk.vue")
routes[11].component = () => import("../views/q6.vue")
routes[12].component = () => import("../views/q7.vue")
routes[13].component = () => import("../views/ImagePreview.vue")
routes[14].component = () => import("../views/ImagePreview2.vue")


const router = createRouter( {

 history: createWebHistory(),
 routes: routes,

//  [
//     { path: "/q1", component: () => import("../views/q1.vue"),
//   //   meta: {
//   //     requiresAuth: true,},
//    },
//     { path: "/q2", component: () => import("../views/q2.vue") },
//     { path: "/q3", component: () => import("../views/q3.vue"), },
//    ]

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
if (to.matched.some((record) => record.meta.requiresAuth)) {
 if (await getCurrentUser()) {
  next();
} else {
alert ("Login to see questions");
next ("/");
}
}else {
    next();
}
});


export default router;