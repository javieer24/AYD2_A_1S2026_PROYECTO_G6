<template>
  <div class="home-page">
    <div class="welcome-banner">
      <h1>Bienvenido, {{ usuario.nombre }}</h1>
      <p>Selecciona un módulo para continuar</p>
    </div>

    <div class="modules-grid">
      <router-link to="/ingesta" class="module-card active">
        <div class="module-icon">📂</div>
        <h2>Ingesta de Datos</h2>
        <p>Carga expedientes académicos de USAC, UCR o UES en formato CSV, JSON o XML.</p>
        <span class="module-status disponible">Disponible</span>
      </router-link>

      <div class="module-card disabled">
        <div class="module-icon">📝</div>
        <h2>Examen Adaptativo</h2>
        <p>Módulo de evaluación personalizada por competencias digitales.</p>
        <span class="module-status proximamente">Próximamente</span>
      </div>

      <div class="module-card disabled">
        <div class="module-icon">🛡️</div>
        <h2>Antifraude</h2>
        <p>Detección de identidad y prevención de suplantación durante evaluaciones.</p>
        <span class="module-status proximamente">Próximamente</span>
      </div>

      <div class="module-card disabled">
        <div class="module-icon">🏅</div>
        <h2>Credencial Digital</h2>
        <p>Emisión de certificados inmutables con registro en cadena de bloques.</p>
        <span class="module-status proximamente">Próximamente</span>
      </div>

      <div class="module-card disabled">
        <div class="module-icon">📊</div>
        <h2>Dashboard BI</h2>
        <p>Métricas regionales de certificación y análisis comparativo entre universidades.</p>
        <span class="module-status proximamente">Próximamente</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const raw = localStorage.getItem('prccd_usuario');
const usuario = raw ? JSON.parse(raw) : { nombre: 'Usuario' };
</script>

<style scoped>
.home-page { padding: 2rem; max-width: 1100px; margin: 0 auto; }

.welcome-banner {
  background: linear-gradient(135deg, #1a365d, #2b6cb0);
  color: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
}
.welcome-banner h1 { font-size: 1.8rem; font-weight: 700; }
.welcome-banner p { margin-top: .4rem; opacity: .85; }

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.module-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  display: flex; flex-direction: column; gap: .5rem;
  border: 2px solid transparent;
  text-decoration: none; color: inherit;
  transition: transform .15s, box-shadow .15s;
}
.module-card.active { border-color: #3182ce; cursor: pointer; }
.module-card.active:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(49,130,206,.2); }
.module-card.disabled { opacity: .55; cursor: not-allowed; }

.module-icon { font-size: 2.2rem; }
.module-card h2 { font-size: 1.1rem; font-weight: 700; color: #1a365d; }
.module-card p { font-size: .88rem; color: #4a5568; line-height: 1.5; flex: 1; }

.module-status {
  display: inline-block; align-self: flex-start;
  padding: 3px 10px; border-radius: 12px;
  font-size: .75rem; font-weight: 700; letter-spacing: .04em;
}
.disponible { background: #c6f6d5; color: #276749; }
.proximamente { background: #e2e8f0; color: #4a5568; }
</style>
