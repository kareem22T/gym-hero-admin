import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Exercises from "../views/Exercises.vue";
import Signin from "../views/Signin.vue";
import auth from './../middleware/auth'

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/workouts",
    meta: { auth: true },
  },
  {
    path: "/workouts",
    name: "Dashboard",
    component: Dashboard,
    meta: { auth: true },
  },
  {
    path: "/exercises/:id",
    name: "Exercises",
    component: Exercises,
    meta: { auth: true },
  },
  {
    path: "/login",
    name: "Signin",
    component: Signin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});
router.beforeEach(auth);
export default router;
