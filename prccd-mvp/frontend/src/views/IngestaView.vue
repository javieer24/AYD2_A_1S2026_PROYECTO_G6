<template>
  <div class="ingesta-page">
    <div class="page-header">
      <h1>📂 Ingesta de Expedientes</h1>
      <p>Carga el archivo académico de una universidad para registrar candidatos en el sistema.</p>
    </div>

    <!-- Formulario de carga -->
    <div class="card form-card">
      <h2>Cargar expediente</h2>

      <form @submit.prevent="enviar">
        <!-- Selección de universidad -->
        <div class="field">
          <label>Universidad de origen</label>
          <div class="radio-group">
            <label v-for="u in universidades" :key="u.valor" class="radio-option" :class="{ seleccionada: form.universidad === u.valor }">
              <input type="radio" :value="u.valor" v-model="form.universidad" />
              <span class="radio-flag">{{ u.bandera }}</span>
              <span>
                <strong>{{ u.valor }}</strong>
                <small>{{ u.nombre }} · {{ u.formato }}</small>
              </span>
            </label>
          </div>
        </div>

        <!-- Drop zone / selector de archivo -->
        <div class="field">
          <label>Archivo del expediente</label>
          <div
            class="drop-zone"
            :class="{ 'drag-over': arrastrandoArchivo, 'con-archivo': archivo }"
            @dragover.prevent="arrastrandoArchivo = true"
            @dragleave="arrastrandoArchivo = false"
            @drop.prevent="onDrop"
            @click="$refs.fileInput.click()"
          >
            <input ref="fileInput" type="file" accept=".csv,.json,.xml" @change="onFileChange" hidden />
            <div v-if="!archivo" class="drop-placeholder">
              <span class="drop-icon">📄</span>
              <p>Arrastra el archivo aquí o haz clic para seleccionarlo</p>
              <small>Formatos aceptados: CSV, JSON, XML (máx. 10 MB)</small>
            </div>
            <div v-else class="drop-archivo">
              <span class="drop-icon">✅</span>
              <div>
                <strong>{{ archivo.name }}</strong>
                <small>{{ (archivo.size / 1024).toFixed(1) }} KB</small>
              </div>
              <button type="button" @click.stop="quitarArchivo" class="btn-quitar">✕</button>
            </div>
          </div>
        </div>

        <!-- Validación previa visible -->
        <div v-if="errorFormulario" class="alert-error">{{ errorFormulario }}</div>

        <button type="submit" class="btn-enviar" :disabled="cargando || !archivo || !form.universidad">
          <span v-if="cargando">⏳ Procesando...</span>
          <span v-else>Enviar expediente</span>
        </button>
      </form>
    </div>

    <!-- Resultado -->
    <div v-if="resultado" class="card resultado-card">
      <h2>Resultado de la ingesta</h2>

      <div class="resultado-stats">
        <div class="stat">
          <span class="stat-valor">{{ resultado.procesados }}</span>
          <span class="stat-label">Procesados</span>
        </div>
        <div class="stat exitosos">
          <span class="stat-valor">{{ resultado.exitosos }}</span>
          <span class="stat-label">Exitosos</span>
        </div>
        <div class="stat" :class="{ errores: resultado.errores.length > 0 }">
          <span class="stat-valor">{{ resultado.errores.length }}</span>
          <span class="stat-label">Con error</span>
        </div>
      </div>

      <!-- Tabla de errores si los hay -->
      <div v-if="resultado.errores.length > 0" class="errores-tabla">
        <h3>Detalle de errores</h3>
        <table>
          <thead>
            <tr><th>Fila / Registro</th><th>Motivo</th></tr>
          </thead>
          <tbody>
            <tr v-for="(e, i) in resultado.errores" :key="i">
              <td>{{ e.fila ?? e.id_candidato ?? i + 1 }}</td>
              <td>{{ e.mensaje }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="alert-success">
        ✅ Todos los registros se procesaron correctamente.
      </div>

      <button class="btn-nuevo" @click="resetear">Cargar otro archivo</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ingestarExpediente } from '../services/api.js';

const universidades = [
  { valor: 'USAC', nombre: 'Universidad de San Carlos de Guatemala', formato: 'CSV',  bandera: '🇬🇹' },
  { valor: 'UCR',  nombre: 'Universidad de Costa Rica',               formato: 'JSON', bandera: '🇨🇷' },
  { valor: 'UES',  nombre: 'Universidad de El Salvador',              formato: 'XML',  bandera: '🇸🇻' },
];

const form = reactive({ universidad: '' });
const archivo = ref(null);
const arrastrandoArchivo = ref(false);
const cargando = ref(false);
const errorFormulario = ref('');
const resultado = ref(null);
const fileInput = ref(null);

function onFileChange(e) {
  archivo.value = e.target.files[0] || null;
}

function onDrop(e) {
  arrastrandoArchivo.value = false;
  archivo.value = e.dataTransfer.files[0] || null;
}

function quitarArchivo() {
  archivo.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

async function enviar() {
  errorFormulario.value = '';
  resultado.value = null;

  if (!form.universidad) { errorFormulario.value = 'Selecciona una universidad.'; return; }
  if (!archivo.value) { errorFormulario.value = 'Selecciona un archivo.'; return; }

  cargando.value = true;
  try {
    resultado.value = await ingestarExpediente(archivo.value, form.universidad);
  } catch (err) {
    errorFormulario.value = err.response?.data?.message || 'Error al comunicarse con el servidor.';
  } finally {
    cargando.value = false;
  }
}

function resetear() {
  resultado.value = null;
  archivo.value = null;
  form.universidad = '';
  if (fileInput.value) fileInput.value.value = '';
}
</script>

<style scoped>
.ingesta-page { padding: 2rem; max-width: 780px; margin: 0 auto; }

.page-header { margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.6rem; font-weight: 700; color: #1a365d; }
.page-header p { color: #4a5568; margin-top: .3rem; }

.card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,.08); margin-bottom: 1.5rem; }
.card h2 { font-size: 1.15rem; font-weight: 700; color: #1a365d; margin-bottom: 1.25rem; }

/* ── Campos ── */
.field { margin-bottom: 1.25rem; }
.field > label { display: block; font-size: .85rem; font-weight: 600; color: #4a5568; margin-bottom: .5rem; }

/* ── Radio group ── */
.radio-group { display: flex; flex-direction: column; gap: .5rem; }
.radio-option {
  display: flex; align-items: center; gap: .75rem;
  padding: .65rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color .15s;
}
.radio-option input[type=radio] { display: none; }
.radio-option.seleccionada { border-color: #3182ce; background: #ebf8ff; }
.radio-option span:last-child { display: flex; flex-direction: column; }
.radio-option strong { font-size: .95rem; color: #1a365d; }
.radio-option small { font-size: .78rem; color: #718096; }
.radio-flag { font-size: 1.5rem; }

/* ── Drop zone ── */
.drop-zone {
  border: 2px dashed #cbd5e0;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color .2s, background .2s;
}
.drop-zone:hover, .drop-zone.drag-over { border-color: #3182ce; background: #ebf8ff; }
.drop-zone.con-archivo { border-color: #48bb78; background: #f0fff4; }
.drop-placeholder { display: flex; flex-direction: column; align-items: center; gap: .4rem; }
.drop-icon { font-size: 2.5rem; }
.drop-placeholder p { color: #4a5568; font-size: .95rem; }
.drop-placeholder small { color: #a0aec0; font-size: .8rem; }
.drop-archivo { display: flex; align-items: center; gap: 1rem; justify-content: center; }
.drop-archivo div { display: flex; flex-direction: column; text-align: left; }
.drop-archivo strong { color: #276749; }
.drop-archivo small { color: #4a5568; font-size: .8rem; }
.btn-quitar { background: #fed7d7; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; font-size: .85rem; color: #c53030; }

/* ── Botones ── */
.btn-enviar {
  width: 100%; padding: .8rem;
  background: #2b6cb0; color: #fff;
  border: none; border-radius: 8px;
  font-size: 1rem; font-weight: 600;
  cursor: pointer; margin-top: .5rem;
  transition: background .2s;
}
.btn-enviar:hover:not(:disabled) { background: #2c5282; }
.btn-enviar:disabled { opacity: .55; cursor: not-allowed; }
.btn-nuevo { margin-top: 1rem; padding: .65rem 1.5rem; background: #e2e8f0; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-nuevo:hover { background: #cbd5e0; }

/* ── Alertas ── */
.alert-error { background: #fff5f5; border: 1px solid #fc8181; color: #c53030; border-radius: 8px; padding: .6rem .9rem; font-size: .88rem; margin-bottom: .75rem; }
.alert-success { background: #f0fff4; border: 1px solid #68d391; color: #276749; border-radius: 8px; padding: .75rem 1rem; margin-top: 1rem; }

/* ── Resultado ── */
.resultado-stats { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
.stat { flex: 1; background: #f7fafc; border-radius: 10px; padding: 1rem; text-align: center; border: 2px solid #e2e8f0; }
.stat.exitosos { border-color: #68d391; background: #f0fff4; }
.stat.errores { border-color: #fc8181; background: #fff5f5; }
.stat-valor { display: block; font-size: 2rem; font-weight: 800; color: #1a365d; }
.stat.exitosos .stat-valor { color: #276749; }
.stat.errores .stat-valor { color: #c53030; }
.stat-label { font-size: .8rem; color: #718096; font-weight: 600; text-transform: uppercase; }

.errores-tabla h3 { font-size: 1rem; margin-bottom: .75rem; color: #c53030; }
.errores-tabla table { width: 100%; border-collapse: collapse; font-size: .88rem; }
.errores-tabla th, .errores-tabla td { padding: .5rem .75rem; border-bottom: 1px solid #e2e8f0; text-align: left; }
.errores-tabla th { background: #fff5f5; font-weight: 700; }
</style>
