
const BASE_ALUMNOS = 'http://20.96.172.6:8088/api/alumnos';
const BASE_CURSOS = 'http://20.96.172.6:8088/api/cursos';
const tablaBody = document.querySelector('#tablaAlumnos tbody');
const tablaCursosBody = document.querySelector('#tablaCursos tbody');
const viewAlumnos = document.getElementById('viewAlumnos');
const viewCursos = document.getElementById('viewCursos');
const tabAlumnos = document.getElementById('tabAlumnos');
const tabCursos = document.getElementById('tabCursos');
const selectCursoAsignar = document.getElementById('selectCursoAsignar');
const btnAsignarCurso = document.getElementById('btnAsignarCurso');
const modalAsignarCurso = document.getElementById('modalAsignarCurso');
const selectCursoAsignarTabla = document.getElementById('selectCursoAsignarTabla');
const btnAsignarCursoTabla = document.getElementById('btnAsignarCursoTabla');
const asignarCursoMsg = document.getElementById('asignarCursoMsg');
const btnAbrirCrearCurso = document.getElementById('btnAbrirCrearCurso');
const modalCrearCurso = document.getElementById('modalCrearCurso');
const cursoNombre = document.getElementById('cursoNombre');
const cursoDescripcion = document.getElementById('cursoDescripcion');
const cursoNombreMsg = document.getElementById('cursoNombreMsg');
const cursoDescripcionMsg = document.getElementById('cursoDescripcionMsg');
const crearCursoError = document.getElementById('crearCursoError');
const btnCrearCurso = document.getElementById('btnCrearCurso');
const searchCurso = document.getElementById('searchCurso');
const btnBuscarCurso = document.getElementById('btnBuscarCurso');
const btnLimpiarCurso = document.getElementById('btnLimpiarCurso');

// search and toolbar
const searchCedula = document.getElementById('searchCedula');
const btnBuscar = document.getElementById('btnBuscar');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnAbrirCrear = document.getElementById('btnAbrirCrear');
const btnSalir = document.getElementById('btnSalir');

// modal elements - crear
const modalCrear = document.getElementById('modalCrear');
const btnCrear = document.getElementById('btnCrear');
const cedulaInput = document.getElementById('cedula');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const direccionInput = document.getElementById('direccion');
const telefonoInput = document.getElementById('telefono');
const cedulaMsg = document.getElementById('cedulaMsg');
const nombreMsg = document.getElementById('nombreMsg');
const apellidoMsg = document.getElementById('apellidoMsg');
const telefonoMsg = document.getElementById('telefonoMsg');
const direccionMsg = document.getElementById('direccionMsg');
const crearError = document.getElementById('crearError');

// modal elements - editar
const modalEditar = document.getElementById('modalEditar');
const btnActualizar = document.getElementById('btnActualizar');
const btnCancelar = document.getElementById('btnCancelar');
const cedulaEditInput = document.getElementById('cedulaEdit');
const nombreEditInput = document.getElementById('nombreEdit');
const apellidoEditInput = document.getElementById('apellidoEdit');
const direccionEditInput = document.getElementById('direccionEdit');
const telefonoEditInput = document.getElementById('telefonoEdit');
const nombreEditMsg = document.getElementById('nombreEditMsg');
const apellidoEditMsg = document.getElementById('apellidoEditMsg');
const telefonoEditMsg = document.getElementById('telefonoEditMsg');

// estado
let cedulaEditando = null;
let cachedCursos = [];
let currentRole = null; // 'ADMINISTRADOR' | 'SECRETARIA'

// Accesibilidad y foco para modales
const appRoot = document.querySelector('.container'); // el contenedor principal de la página
let lastFocus = null; // para restaurar foco al cerrar

function openModal(el) {
  // Guarda quién abrió el modal
  lastFocus = document.activeElement;

  // Mostrar modal y accesibilidad correcta
  el.style.display = 'flex';
  el.setAttribute('aria-hidden', 'false');

  // Desactivar fondo para evitar navegación
  if (appRoot) appRoot.setAttribute('inert', '');

  // Enfocar el primer elemento interactivo dentro del modal
  const focusable = el.querySelector(
    'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) {
    setTimeout(() => focusable.focus(), 0);
  }
}

function closeModal(el) {
  // Recuperar foco al disparador (si existe y sigue en el DOM)
  if (lastFocus && document.contains(lastFocus)) {
    lastFocus.focus();
  }

  // Ocultar modal y marcar aria-hidden
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');

  // Reactivar fondo
  if (appRoot) appRoot.removeAttribute('inert');

  // Limpia referencia
  lastFocus = null;
}

// ===== Helpers de sanitización y validación visual =====
function onlyDigits(str, maxLen) {
  const cleaned = (str || '').replace(/\D+/g, '');
  return typeof maxLen === 'number' ? cleaned.slice(0, maxLen) : cleaned;
}
function onlyLettersSpaces(str, maxLen) {
  const cleaned = (str || '').replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]+/g, '');
  return typeof maxLen === 'number' ? cleaned.slice(0, maxLen) : cleaned;
}
function setMsg(el, msg) { if (el) el.textContent = msg || ''; }

// Entradas: crear
if (cedulaInput) {
  cedulaInput.addEventListener('input', () => {
    cedulaInput.value = onlyDigits(cedulaInput.value, 10);
    if (cedulaInput.value && cedulaInput.value.length !== 10) {
      setMsg(cedulaMsg, 'La cédula debe tener 10 dígitos');
    } else { setMsg(cedulaMsg, ''); }
  });
}
if (telefonoInput) {
  telefonoInput.addEventListener('input', () => {
    telefonoInput.value = onlyDigits(telefonoInput.value, 10);
    if (telefonoInput.value && telefonoInput.value.length !== 10) {
      setMsg(telefonoMsg, 'El teléfono debe tener 10 dígitos');
    } else { setMsg(telefonoMsg, ''); }
  });
}
if (nombreInput) {
  nombreInput.addEventListener('input', () => {
    const before = nombreInput.value;
    nombreInput.value = onlyLettersSpaces(nombreInput.value, 100);
    if (before !== nombreInput.value) { setMsg(nombreMsg, 'Solo letras y espacios'); }
    else { setMsg(nombreMsg, ''); }
  });
}
if (apellidoInput) {
  apellidoInput.addEventListener('input', () => {
    const before = apellidoInput.value;
    apellidoInput.value = onlyLettersSpaces(apellidoInput.value, 100);
    if (before !== apellidoInput.value) { setMsg(apellidoMsg, 'Solo letras y espacios'); }
    else { setMsg(apellidoMsg, ''); }
  });
}

// Entradas: editar
if (telefonoEditInput) {
  telefonoEditInput.addEventListener('input', () => {
    telefonoEditInput.value = onlyDigits(telefonoEditInput.value, 10);
    if (telefonoEditInput.value && telefonoEditInput.value.length !== 10) {
      setMsg(telefonoEditMsg, 'El teléfono debe tener 10 dígitos');
    } else { setMsg(telefonoEditMsg, ''); }
  });
}
if (nombreEditInput) {
  nombreEditInput.addEventListener('input', () => {
    const before = nombreEditInput.value;
    nombreEditInput.value = onlyLettersSpaces(nombreEditInput.value, 100);
    if (before !== nombreEditInput.value) { setMsg(nombreEditMsg, 'Solo letras y espacios'); }
    else { setMsg(nombreEditMsg, ''); }
  });
}
if (apellidoEditInput) {
  apellidoEditInput.addEventListener('input', () => {
    const before = apellidoEditInput.value;
    apellidoEditInput.value = onlyLettersSpaces(apellidoEditInput.value, 100);
    if (before !== apellidoEditInput.value) { setMsg(apellidoEditMsg, 'Solo letras y espacios'); }
    else { setMsg(apellidoEditMsg, ''); }
  });
}

// Cerrar por botones data-close
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-close');
    const m = document.getElementById(id);
    if (m) closeModal(m);
  });
});

// cargar todos
async function cargarTodos() {
  try {
    const res = await fetch(BASE_ALUMNOS, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener lista: ' + res.status);
    const data = await res.json();
    renderLista(data);
  } catch (err) {
    console.error(err);
    alert('Error cargando alumnos. Verifica sesión.');
    redirectLogin();
  }
}

function renderLista(alumnos) {
  tablaBody.innerHTML = '';
  if (!Array.isArray(alumnos) || alumnos.length === 0) {
    tablaBody.innerHTML = '<tr><td colspan="6" class="center">No hay alumnos</td></tr>';
    return;
  }
  alumnos.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(a.cedula ?? '')}</td>
      <td>${escapeHtml(a.nombre ?? '')}</td>
      <td>${escapeHtml(a.apellido ?? '')}</td>
      <td>${escapeHtml(a.direccion ?? '')}</td>
      <td>${escapeHtml(a.telefono ?? '')}</td>
      <td>${escapeHtml(a.cursoNombre ?? '')}</td>
      <td class="actions">
        <button data-cedula="${a.cedula}" class="editar warning">Editar</button>
        <button data-cedula="${a.cedula}" class="eliminar danger">Eliminar</button>
        <button data-cedula="${a.cedula}" class="asignarCurso primary">Asignar curso</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  tablaBody.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', (e) => cargarParaEditar(e.currentTarget.dataset.cedula));
  });
  tablaBody.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const c = e.currentTarget.dataset.cedula;
      if (confirm('¿Eliminar alumno con cédula ' + c + '?')) {
        await eliminarAlumno(c);
      }
    });
  });
  tablaBody.querySelectorAll('.asignarCurso').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const ced = e.currentTarget.dataset.cedula;
      if (currentRole !== 'ADMINISTRADOR') { alert('Solo ADMIN puede asignar cursos'); return; }
      cedulaEditando = ced;
      await ensureCursosLoaded();
      fillCursosSelect(selectCursoAsignarTabla, cachedCursos);
      openModal(modalAsignarCurso);
    });
  });
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// crear
async function crearAlumno() {
  const payload = recogerFormularioCrear();
  if (!payload) return;
  let res;
  try {
    res = await fetch(BASE_ALUMNOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error('Error al crear: ' + res.status + (text ? ' ' + text : ''));
    }
    closeModal(modalCrear);
    limpiarFormularioCrear();
    await cargarTodos();
  } catch (err) {
    console.error(err);
    crearError.textContent = err.message || 'Error creando alumno';
    if (res && res.status === 401) redirectLogin();
  }
}

// buscar exacto o LIKE por cédula
async function buscarPorCedula(cedula) {
  const q = cedula.trim();
  if (!q) { return buscarLike(''); }
  try {
    const res = await fetch(`${BASE_ALUMNOS}/${encodeURIComponent(q)}`, { headers: authHeaders() });
    if (res.status === 404) { return buscarLike(q); }
    if (!res.ok) throw new Error('Error al buscar: ' + res.status);
    const a = await res.json();
    renderLista([a]);
  } catch (err) {
    console.error(err);
    alert('Error buscando alumno: ' + err.message);
    if (err.message.includes('401')) redirectLogin();
  }
}

// buscar tipo LIKE
async function buscarLike(q) {
  try {
    const url = q ? `${BASE_ALUMNOS}/buscar?q=${encodeURIComponent(q)}` : BASE_ALUMNOS;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error en búsqueda: ' + res.status);
    const data = await res.json();
    renderLista(data);
  } catch (e) {
    console.error(e);
    if (e.message.includes('401')) redirectLogin();
  }
}

// filtro en vivo
let searchDebounce;
searchCedula.addEventListener('input', () => {
  const q = searchCedula.value.trim();
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => buscarLike(q), 200);
});

// cargar datos en modal editar
async function cargarParaEditar(cedula) {
  try {
    const res = await fetch(`${BASE_ALUMNOS}/${encodeURIComponent(cedula)}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('No se pudo cargar: ' + res.status);
    const a = await res.json();
    cedulaEditInput.value = a.cedula || '';
    nombreEditInput.value = a.nombre || '';
    apellidoEditInput.value = a.apellido || '';
    direccionEditInput.value = a.direccion || '';
    telefonoEditInput.value = a.telefono || '';
    cedulaEditando = a.cedula;
    await ensureCursosLoaded();
    fillCursosSelect(selectCursoAsignar, cachedCursos, a.cursoId);
    toggleAssignControlsByRole();
    openModal(modalEditar);
  } catch (err) {
    console.error(err);
    alert(err.message || 'Error cargando para editar');
    if (err.message.includes('401')) redirectLogin();
  }
}

// actualizar
async function actualizarAlumno() {
  if (!cedulaEditando) { alert('No hay edición en curso'); return; }
  const payload = recogerFormularioEditar();
  if (!payload) return;
  try {
    const res = await fetch(`${BASE_ALUMNOS}/${encodeURIComponent(cedulaEditando)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error('Error al actualizar: ' + res.status + (text ? ' ' + text : ''));
    }
    closeModal(modalEditar);
    cedulaEditando = null;
    await cargarTodos();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Error actualizando');
    if (err.message.includes('401')) redirectLogin();
  }
}

// eliminar
async function eliminarAlumno(cedula) {
  try {
    const res = await fetch(`${BASE_ALUMNOS}/${encodeURIComponent(cedula)}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.status === 404) { alert('Alumno no encontrado'); return; }
    if (!res.ok) throw new Error('Error al eliminar: ' + res.status);
    await cargarTodos();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Error eliminando');
    if (err.message.includes('401')) redirectLogin();
  }
}

// recoger formularios
function recogerFormularioCrear() {
  const ced = cedulaInput.value && cedulaInput.value.trim();
  const nom = nombreInput.value && nombreInput.value.trim();
  const ape = apellidoInput.value && apellidoInput.value.trim();
  const dir = direccionInput.value && direccionInput.value.trim();
  const tel = telefonoInput.value && telefonoInput.value.trim();

  cedulaMsg.textContent = '';
  nombreMsg.textContent = '';
  apellidoMsg.textContent = '';
  telefonoMsg.textContent = '';
  direccionMsg.textContent = '';
  crearError.textContent = '';

  if (!ced) { cedulaMsg.textContent = 'La cédula es obligatoria'; return null; }
  if (!/^\d{10}$/.test(ced)) { cedulaMsg.textContent = 'La cédula debe tener exactamente 10 dígitos'; return null; }
  if (!nom) { nombreMsg.textContent = 'El nombre es obligatorio'; return null; }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nom)) { nombreMsg.textContent = 'Solo letras y espacios'; return null; }
  if (!ape) { apellidoMsg.textContent = 'El apellido es obligatorio'; return null; }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(ape)) { apellidoMsg.textContent = 'Solo letras y espacios'; return null; }
  if (tel && !/^\d{10}$/.test(tel)) { telefonoMsg.textContent = 'El teléfono debe tener exactamente 10 dígitos'; return null; }

  return { cedula: ced, nombre: nom, apellido: ape, direccion: dir || '', telefono: tel || '' };
}
function limpiarFormularioCrear() {
  cedulaInput.value = '';
  nombreInput.value = '';
  apellidoInput.value = '';
  direccionInput.value = '';
  telefonoInput.value = '';
}
function recogerFormularioEditar() {
  const nom = nombreEditInput.value && nombreEditInput.value.trim();
  const ape = apellidoEditInput.value && apellidoEditInput.value.trim();
  const dir = direccionEditInput.value && direccionEditInput.value.trim();
  const tel = telefonoEditInput.value && telefonoEditInput.value.trim();
  if (!nom) { setMsg(nombreEditMsg, 'El nombre es obligatorio'); return null; }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nom)) { setMsg(nombreEditMsg, 'Solo letras y espacios'); return null; }
  if (!ape) { setMsg(apellidoEditMsg, 'El apellido es obligatorio'); return null; }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(ape)) { setMsg(apellidoEditMsg, 'Solo letras y espacios'); return null; }
  if (tel && !/^\d{10}$/.test(tel)) { setMsg(telefonoEditMsg, 'El teléfono debe tener exactamente 10 dígitos'); return null; }
  return { cedula: cedulaEditInput.value, nombre: nom, apellido: ape, direccion: dir || '', telefono: tel || '' };
}

// listeners
btnAbrirCrear.addEventListener('click', () => openModal(modalCrear));
btnCrear.addEventListener('click', crearAlumno);
btnActualizar.addEventListener('click', actualizarAlumno);
btnCancelar.addEventListener('click', () => closeModal(modalEditar));
btnBuscar.addEventListener('click', () => buscarPorCedula(searchCedula.value.trim()));
btnLimpiar.addEventListener('click', async () => { searchCedula.value=''; await cargarTodos(); });
btnSalir.addEventListener('click', async () => {
  await logout();
});

// Tabs
tabAlumnos.addEventListener('click', () => { viewAlumnos.style.display=''; viewCursos.style.display='none'; });
tabCursos.addEventListener('click', async () => { viewAlumnos.style.display='none'; viewCursos.style.display=''; await cargarCursos(); });

// Cursos UI events
btnAbrirCrearCurso && btnAbrirCrearCurso.addEventListener('click', () => openModal(modalCrearCurso));
btnCrearCurso && btnCrearCurso.addEventListener('click', crearCurso);
btnBuscarCurso && btnBuscarCurso.addEventListener('click', () => buscarCursos(searchCurso.value.trim()));
btnLimpiarCurso && btnLimpiarCurso.addEventListener('click', async () => { searchCurso.value=''; await cargarCursos(); });
btnAsignarCurso && btnAsignarCurso.addEventListener('click', asignarCursoAlAlumno);
btnAsignarCursoTabla && btnAsignarCursoTabla.addEventListener('click', async () => {
  asignarCursoMsg.textContent = '';
  const cursoId = selectCursoAsignarTabla.value;
  try {
    await asignarCursoApi(cedulaEditando, cursoId);
    closeModal(modalAsignarCurso);
    await cargarTodos();
  } catch (e) {
    console.error(e);
    asignarCursoMsg.textContent = e.message;
  }
});

// iniciar
detectRole().then(async role => {
  currentRole = role;
  toggleCursosTabByRole();
  await cargarTodos();
});

// Auth helpers
function authHeaders() {
  const tokenMeta = document.querySelector('meta[name="_csrf"]');
  const headerMeta = document.querySelector('meta[name="_csrf_header"]');
  const headers = {};
  if (tokenMeta && headerMeta) {
    headers[headerMeta.content] = tokenMeta.content;
  }
  return headers;
}

async function logout() {
    console.log("Intentando logout...");
    try {
        const response = await fetch('http://20.96.172.6:8088/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders() // tus headers de auth si aplica
            },
            credentials: 'include' // manda cookies de sesión
        });

        if (response.ok) {
            // Redirige al login después de logout
            window.location.href = '/login';
        } else {
            console.error('Error en logout, status:', response.status);
        }
    } catch (e) {
        console.error('Error en logout:', e);
    }
}

// ===== Role detection =====
async function detectRole() {
  try {
    // Try a cursos call: only ADMIN can read cursos
    const res = await fetch(BASE_CURSOS, { headers: authHeaders() });
    if (res.ok) return 'ADMINISTRADOR';
    // Fall back to alumnos: SECRETARIA and ADMIN can access
    const res2 = await fetch(BASE_ALUMNOS, { headers: authHeaders() });
    if (res2.ok) return 'SECRETARIA';
  } catch (_) {}
  return null;
}
function toggleCursosTabByRole() {
  if (currentRole !== 'ADMINISTRADOR') {
    tabCursos.style.display = 'none';
    viewCursos.style.display = 'none';
  }
}
function toggleAssignControlsByRole() {
  const show = currentRole === 'ADMINISTRADOR';
  if (selectCursoAsignar) selectCursoAsignar.style.display = show ? '' : 'none';
  if (btnAsignarCurso) btnAsignarCurso.style.display = show ? '' : 'none';
}

// ===== Cursos API/helpers =====
async function ensureCursosLoaded() {
  if (currentRole !== 'ADMINISTRADOR') return;
  if (cachedCursos && cachedCursos.length) return;
  await cargarCursos();
}
async function cargarCursos() {
  if (currentRole !== 'ADMINISTRADOR') return;
  try {
    const res = await fetch(BASE_CURSOS, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error listando cursos: ' + res.status);
    const data = await res.json();
    cachedCursos = data;
    renderCursos(data);
  } catch (e) {
    console.error(e);
  }
}
function renderCursos(cursos) {
  if (!tablaCursosBody) return;
  tablaCursosBody.innerHTML = '';
  if (!Array.isArray(cursos) || !cursos.length) {
    tablaCursosBody.innerHTML = '<tr><td colspan="4" class="center">No hay cursos</td></tr>';
    return;
  }
  cursos.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(c.id)}</td>
      <td>${escapeHtml(c.nombre)}</td>
      <td>${escapeHtml(c.descripcion || '')}</td>
      <td class="actions">
        <button data-id="${c.id}" class="editarCurso warning">Editar</button>
        <button data-id="${c.id}" class="eliminarCurso danger">Eliminar</button>
      </td>`;
    tablaCursosBody.appendChild(tr);
  });
  tablaCursosBody.querySelectorAll('.eliminarCurso').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm('¿Eliminar curso ' + id + '?')) await eliminarCurso(id);
    });
  });
  tablaCursosBody.querySelectorAll('.editarCurso').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      const c = cachedCursos.find(x => String(x.id) === String(id));
      if (!c) return;
      cursoNombre.value = c.nombre || '';
      cursoDescripcion.value = c.descripcion || '';
      modalCrearCurso.setAttribute('data-edit-id', id);
      openModal(modalCrearCurso);
    });
  });
}
function fillCursosSelect(select, cursos, selectedId) {
  if (!select) return;
  select.innerHTML = '<option value="">(Sin curso)</option>';
  cursos.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nombre;
    if (selectedId && String(selectedId) === String(c.id)) opt.selected = true;
    select.appendChild(opt);
  });
}
async function crearCurso() {
  crearCursoError.textContent = '';
  cursoNombreMsg.textContent = '';
  const nombre = (cursoNombre.value || '').trim();
  const descripcion = (cursoDescripcion.value || '').trim();
  if (!nombre) { cursoNombreMsg.textContent = 'Nombre es obligatorio'; return; }
  const editId = modalCrearCurso.getAttribute('data-edit-id');
  try {
    if (editId) {
      const res = await fetch(`${BASE_CURSOS}/${encodeURIComponent(editId)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ nombre, descripcion })
      });
      if (!res.ok) throw new Error('Error actualizando: ' + res.status);
    } else {
      const res = await fetch(BASE_CURSOS, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ nombre, descripcion })
      });
      if (!res.ok) throw new Error('Error creando: ' + res.status);
    }
    modalCrearCurso.removeAttribute('data-edit-id');
    closeModal(modalCrearCurso);
    cursoNombre.value = ''; cursoDescripcion.value = '';
    await cargarCursos();
  } catch (e) {
    console.error(e);
    crearCursoError.textContent = e.message;
  }
}
async function eliminarCurso(id) {
  try {
    const res = await fetch(`${BASE_CURSOS}/${encodeURIComponent(id)}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error('Error eliminando: ' + res.status);
    await cargarCursos();
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}
async function buscarCursos(q) {
  // backend no tiene buscar cursos; filtrar cliente
  const term = (q || '').toLowerCase();
  const items = (cachedCursos || []).filter(c => (c.nombre || '').toLowerCase().includes(term));
  renderCursos(items);
}

// ===== Asignar curso =====
async function asignarCursoAlAlumno() {
  if (!cedulaEditando) return;
  const cursoId = selectCursoAsignar.value;
  try {
    await asignarCursoApi(cedulaEditando, cursoId);
    await cargarTodos();
    closeModal(modalEditar);
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

async function asignarCursoApi(cedula, cursoId) {
  let url, options;
  if (cursoId) {
    url = `${BASE_ALUMNOS}/${encodeURIComponent(cedula)}/asignar/${encodeURIComponent(cursoId)}`;
    options = { method: 'POST', headers: authHeaders() };
  } else {
    url = `${BASE_ALUMNOS}/${encodeURIComponent(cedula)}/asignar?cursoId=`; // desasignar
    options = { method: 'POST', headers: authHeaders() };
  }
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('Error asignando curso: ' + res.status);
}
