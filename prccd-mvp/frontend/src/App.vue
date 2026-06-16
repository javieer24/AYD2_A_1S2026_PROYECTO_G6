<template>
  <div id="prccd-app">
    <!-- Barra superior solo cuando hay sesión activa -->
    <nav v-if="usuarioActivo" class="navbar">
      <div class="nav-brand">
        <span class="nav-logo">🎓</span>
        <span>PRCCD / SICA</span>
      </div>
      <div class="nav-links">
        <router-link to="/home">Inicio</router-link>
        <router-link to="/ingesta">Ingesta</router-link>
      </div>
      <div class="nav-user">
        <span>{{ usuarioActivo.nombre }}</span>
        <span class="badge">{{ usuarioActivo.rol }}</span>
        <button @click="cerrarSesion" class="btn-logout">Salir</button>
      </div>
    </nav>

    <main :class="{ 'con-nav': usuarioActivo }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const usuarioActivo = computed(() => {
  const raw = localStorage.getItem('prccd_usuario');
  return raw ? JSON.parse(raw) : null;
});

function cerrarSesion() {
  localStorage.removeItem('prccd_token');
  localStorage.removeItem('prccd_usuario');
  router.push('/login');
}
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f0f4f8;
  color: #1a202c;
}

#prccd-app { min-height: 100vh; }

/* ── Navbar ─────────────────────────────────────────────── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem;
  height: 56px;
  background: #1a365d;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
}
.nav-brand { display: flex; align-items: center; gap: .5rem; font-weight: 700; font-size: 1.1rem; }
.nav-logo { font-size: 1.4rem; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #bee3f8; text-decoration: none; font-size: .95rem; }
.nav-links a.router-link-active { color: #fff; border-bottom: 2px solid #63b3ed; padding-bottom: 2px; }
.nav-user { display: flex; align-items: center; gap: .75rem; font-size: .9rem; }
.badge {
  background: #2b6cb0; padding: 2px 8px; border-radius: 12px;
  font-size: .75rem; font-weight: 600; letter-spacing: .04em;
}
.btn-logout {
  background: transparent; border: 1px solid #bee3f8; color: #bee3f8;
  padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: .85rem;
}
.btn-logout:hover { background: rgba(255,255,255,.1); }

/* ── Main ───────────────────────────────────────────────── */
main.con-nav { padding-top: 56px; }
</style>
