import Vue from 'vue';
import VueRouter from "vue-router";
import VueGoodTablePlugin from "vue-good-table";
import 'vue-good-table/dist/vue-good-table.css';
import UserDashboard from "@/pages/UserDashboard";
import BookCatalog from "@/pages/BookCatalog";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminBookCatalog from "@/pages/AdminBookCatalog";
import AdminAddUser from "@/pages/AdminAddUser";
import AdminViewUsers from "@/pages/AdminViewUsers";

Vue.use(VueRouter);

Vue.use(VueGoodTablePlugin);

const routes = [
  {
    path: "/",
    name: "UserDashboard",
    component: UserDashboard
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard
  },
  {
    path: "/bookcatalog",
    name: "BookCatalog",
    component: BookCatalog
  },
  {
    path: "/adminbookcatalog",
    name: "AdminBookCatalog",
    component: AdminBookCatalog
  },
  {
    path: "/adminadduser",
    name: "AdminAddUser",
    component: AdminAddUser
  },
  {
    path: "/adminviewusers",
    name: "AdminViewUsers",
    component: AdminViewUsers
  },
]

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
