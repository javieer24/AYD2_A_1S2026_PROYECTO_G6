<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo / Header -->
      <div class="login-header">
        <div class="login-logo">🎓</div>
        <h1>PRCCD</h1>
        <p class="login-subtitle">Plataforma Regional de Certificación<br>de Competencias Digitales</p>
        <span class="sica-tag">Sistema de la Integración Centroamericana</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="iniciarSesion" class="login-form">
        <div class="field">
          <label for="username">Usuario</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Ej: admin"
            autocomplete="username"
            :disabled="cargando"
          />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            :disabled="cargando"
          />
        </div>

        <div v-if="error" class="alert-error">{{ error }}</div>

        <button type="submit" class="btn-login" :disabled="cargando">
          <span v-if="cargando">Verificando...</span>
          <span v-else>Iniciar sesión</span>
        </button>
      </form>

      <!-- Credenciales de prueba -->
      <details class="credenciales-demo">
        <summary>Credenciales de prueba (prototipo MVP)</summary>
        <table>
          <thead><tr><th>Usuario</th><th>Contraseña</th><th>Rol</th></tr></thead>
          <tbody>
            <tr><td>admin</td><td>admin123</td><td>ADMIN</td></tr>
            <tr><td>oswaldo</td><td>oswaldo123</td><td>EVALUADOR</td></tr>
            <tr><td>usac</td><td>usac2026</td><td>COORDINADOR USAC</td></tr>
            <tr><td>ucr</td><td>ucr2026</td><td>COORDINADOR UCR</td></tr>
            <tr><td>ues</td><td>ues2026</td><td>COORDINADOR UES</td></tr>
          </tbody>
        </table>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/api.js';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const error = ref('');
const cargando = ref(false);

async function iniciarSesion() {
  error.value = '';
  if (!form.username || !form.password) {
    error.value = 'Por favor ingresa usuario y contraseña.';
    return;
  }

  cargando.value = true;
  try {
    const res = await login(form.username, form.password);
    localStorage.setItem('prccd_token', res.token);
    localStorage.setItem('prccd_usuario', JSON.stringify(res.usuario));
    router.push('/home');
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al conectar con el servidor.';
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a365d 0%, #2b6cb0 60%, #3182ce 100%);
  padding: 1rem;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
}

.login-header { text-align: center; margin-bottom: 2rem; }
.login-logo { font-size: 3rem; margin-bottom: .5rem; }
.login-header h1 { font-size: 2rem; font-weight: 800; color: #1a365d; letter-spacing: .05em; }
.login-subtitle { color: #4a5568; font-size: .95rem; margin: .4rem 0 .6rem; line-height: 1.4; }
.sica-tag {
  display: inline-block;
  background: #ebf8ff; color: #2b6cb0;
  font-size: .75rem; font-weight: 600;
  padding: 3px 10px; border-radius: 12px;
}

.login-form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: .35rem; }
.field label { font-size: .85rem; font-weight: 600; color: #4a5568; }
.field input {
  padding: .65rem .9rem;
  border: 1.5px solid #cbd5e0;
  border-radius: 8px;
  font-size: .95rem;
  transition: border-color .2s;
  outline: none;
}
.field input:focus { border-color: #3182ce; box-shadow: 0 0 0 3px rgba(49,130,206,.15); }
.field input:disabled { background: #f7fafc; }

.alert-error {
  background: #fff5f5; border: 1px solid #fc8181;
  color: #c53030; border-radius: 8px;
  padding: .6rem .9rem; font-size: .88rem;
}

.btn-login {
  margin-top: .5rem;
  padding: .75rem;
  background: #2b6cb0;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
}
.btn-login:hover:not(:disabled) { background: #2c5282; }
.btn-login:disabled { opacity: .6; cursor: not-allowed; }

.credenciales-demo {
  margin-top: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  font-size: .82rem;
}
.credenciales-demo summary {
  padding: .6rem .9rem;
  background: #f7fafc;
  cursor: pointer;
  color: #4a5568;
  font-weight: 600;
  user-select: none;
}
.credenciales-demo table { width: 100%; border-collapse: collapse; }
.credenciales-demo th, .credenciales-demo td {
  padding: .4rem .7rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
.credenciales-demo th { background: #edf2f7; font-weight: 700; }
</style>
