
    const BASE = 'http://localhost:8088/api/alumnos';
    const statusEl = document.getElementById('status');
    const tablaBody = document.querySelector('#tablaAlumnos tbody');

    // form controls
    const cedulaInput = document.getElementById('cedula');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const direccionInput = document.getElementById('direccion');
    const telefonoInput = document.getElementById('telefono');

    // buttons
    const btnCrear = document.getElementById('btnCrear');
    const btnActualizar = document.getElementById('btnActualizar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnRefrescar = document.getElementById('btnRefrescar');
    const btnBuscar = document.getElementById('btnBuscar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const searchCedula = document.getElementById('searchCedula');

    // estado: modo crear o editar
    let modoEdicion = false;
    let cedulaEditando = null;

    // util
    function setStatus(msg, isError = false) {
      statusEl.textContent = 'Estado: ' + msg;
      statusEl.style.color = isError ? '#b91c1c' : '#111827';
    }

    // cargar todos
    async function cargarTodos() {
      setStatus('Cargando alumnos...');
      try {
        const res = await fetch(BASE);
        if (!res.ok) throw new Error('Error al obtener lista: ' + res.status);
        const data = await res.json();
        renderLista(data);
        setStatus('Lista cargada: ' + data.length + ' alumno(s).');
      } catch (err) {
        console.error(err);
        setStatus(err.message || 'Error desconocido', true);
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
          <td class="actions">
            <button data-cedula="${a.cedula}" class="editar">Editar</button>
            <button data-cedula="${a.cedula}" class="eliminar danger">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(tr);
      });

      // attach action listeners
      tablaBody.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const c = e.currentTarget.dataset.cedula;
          cargarParaEditar(c);
        });
      });
      tablaBody.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const c = e.currentTarget.dataset.cedula;
          if (confirm('¿Eliminar alumno con cédula ' + c + '?')) {
            eliminarAlumno(c);
          }
        });
      });
    }

    // escapar texto para evitar problemas de inyección en el table
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
      const payload = recogerFormulario();
      if (!payload) return;
      setStatus('Creando alumno...');
      try {
        const res = await fetch(BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error('Error al crear: ' + res.status + ' ' + text);
        }
        setStatus('Alumno creado.');
        limpiarFormulario();
        await cargarTodos();
      } catch (err) {
        console.error(err);
        setStatus(err.message || 'Error creando alumno', true);
      }
    }

    // obtener por cédula y mostrar
    async function buscarPorCedula(cedula) {
      if (!cedula) { setStatus('Introduce una cédula para buscar', true); return; }
      setStatus('Buscando alumno ' + cedula + '...');
      try {
        const res = await fetch(BASE + '/' + encodeURIComponent(cedula));
        if (res.status === 404) { setStatus('Alumno no encontrado', true); return; }
        if (!res.ok) throw new Error('Error al buscar: ' + res.status);
        const a = await res.json();
        renderLista([a]); // mostrar en la tabla como único resultado
        setStatus('Alumno encontrado: ' + a.nombre + ' ' + a.apellido);
      } catch (err) {
        console.error(err);
        setStatus(err.message || 'Error buscando alumno', true);
      }
    }

    // cargar datos en formulario para editar
    async function cargarParaEditar(cedula) {
      setStatus('Cargando alumno para edición...');
      try {
        const res = await fetch(BASE + '/' + encodeURIComponent(cedula));
        if (!res.ok) throw new Error('No se pudo cargar: ' + res.status);
        const a = await res.json();
        cedulaInput.value = a.cedula || '';
        nombreInput.value = a.nombre || '';
        apellidoInput.value = a.apellido || '';
        direccionInput.value = a.direccion || '';
        telefonoInput.value = a.telefono || '';

        modoEdicion = true;
        cedulaEditando = a.cedula;
        cedulaInput.disabled = true; // no permitir cambiar la PK en edición
        btnCrear.style.display = 'none';
        btnActualizar.style.display = 'inline-block';
        btnCancelar.style.display = 'inline-block';
        setStatus('Modo edición: ' + cedulaEditando);
      } catch (err) {
        console.error(err);
        setStatus(err.message || 'Error cargando para editar', true);
      }
    }

    // actualizar
    async function actualizarAlumno() {
      if (!modoEdicion || !cedulaEditando) { setStatus('No hay edición en curso', true); return; }
      const payload = recogerFormulario(true); // permitir que cédula esté deshabilitada ya, pero usar cedulaEditando
      if (!payload) return;
      setStatus('Actualizando alumno ' + cedulaEditando + '...');
      try {
        const res = await fetch(BASE + '/' + encodeURIComponent(cedulaEditando), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error('Error al actualizar: ' + res.status + ' ' + text);
        }
        setStatus('Alumno actualizado.');
        cancelarEdicion();
        await cargarTodos();
      } catch (err) {
        console.error(err);
        setStatus(err.message || 'Error actualizando', true);
      }
    }

    // eliminar
    async function eliminarAlumno(cedula) {
      setStatus('Eliminando ' + cedula + '...');
      try {
        const res = await fetch(BASE + '/' + encodeURIComponent(cedula), { method: 'DELETE' });
        if (res.status === 404) { setStatus('Alumno no encontrado', true); return; }
        if (!res.ok) throw new Error('Error al eliminar: ' + res.status);
        setStatus('Alumno eliminado: ' + cedula);
        await cargarTodos();
      } catch (err) {
        console.error(err);
        setStatus(err.message || 'Error eliminando', true);
      }
    }

    // recoger formulario a objeto DTO
    function recogerFormulario(allowDisabled=false) {
      const ced = cedulaInput.value && cedulaInput.value.trim();
      const nom = nombreInput.value && nombreInput.value.trim();
      const ape = apellidoInput.value && apellidoInput.value.trim();
      const dir = direccionInput.value && direccionInput.value.trim();
      const tel = telefonoInput.value && telefonoInput.value.trim();

      if (!ced || !nom || !ape) {
        setStatus('Cédula, nombre y apellido son obligatorios', true);
        return null;
      }
      return {
        cedula: ced,
        nombre: nom,
        apellido: ape,
        direccion: dir || '',
        telefono: tel || ''
      };
    }

    function limpiarFormulario() {
      modoEdicion = false;
      cedulaEditando = null;
      cedulaInput.disabled = false;
      cedulaInput.value = '';
      nombreInput.value = '';
      apellidoInput.value = '';
      direccionInput.value = '';
      telefonoInput.value = '';
      btnCrear.style.display = 'inline-block';
      btnActualizar.style.display = 'none';
      btnCancelar.style.display = 'none';
      setStatus('Formulario limpio');
    }

    function cancelarEdicion() {
      limpiarFormulario();
    }

    // listeners
    btnCrear.addEventListener('click', crearAlumno);
    btnActualizar.addEventListener('click', actualizarAlumno);
    btnCancelar.addEventListener('click', cancelarEdicion);
    btnRefrescar.addEventListener('click', cargarTodos);
    btnBuscar.addEventListener('click', () => buscarPorCedula(searchCedula.value.trim()));
    btnLimpiar.addEventListener('click', limpiarFormulario);

    // permitir enter en campo buscar
    searchCedula.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); buscarPorCedula(searchCedula.value.trim()); }
    });

    // iniciar
    cargarTodos();
