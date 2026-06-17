import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import IngestaView from '../views/IngestaView.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: LoginView, meta: { publica: true } },
  { path: '/home', component: HomeView, meta: { requiereAuth: true } },
  { path: '/ingesta', component: IngestaView, meta: { requiereAuth: true } },
  // Catch-all: si la ruta no existe, ir al home
  { path: '/:pathMatch(.*)*', redirect: '/home' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global: si la ruta requiere auth y no hay token, redirige al login
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('prccd_token');
  if (to.meta.requiereAuth && !token) return next('/login');
  if (to.path === '/login' && token) return next('/home');
  next();
});

export default router;
