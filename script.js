// Función para guardar recordatorios (sin cambios)
function guardarRecordatorio() {
  const titulo = document.getElementById("titulo").value;
  const fecha = document.getElementById("fecha").value;
  const descripcion = document.getElementById("descripcion").value;

  if (!titulo || !fecha) {
    alert("Por favor completa título y fecha.");
    return;
  }

  const nuevo = { titulo, fecha, descripcion };
  const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];
  recordatorios.push(nuevo);
  localStorage.setItem("recordatorios", JSON.stringify(recordatorios));

  alert("Recordatorio guardado correctamente.");
  
  // Limpiar el formulario en lugar de redirigir
  document.getElementById("titulo").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("descripcion").value = "";
  
  // Opcional: Mostrar confirmación en la misma página
  const confirmacion = document.createElement("div");
  confirmacion.className = "alert alert-success mt-3";
  confirmacion.textContent = "Recordatorio guardado correctamente!";
  document.querySelector("main").appendChild(confirmacion);
  
  // Eliminar la confirmación después de 3 segundos
  setTimeout(() => {
    confirmacion.remove();
  }, 3000);
}

// Función para mostrar todos los recordatorios (sin cambios)
function mostrarTodos() {
  const contenedor = document.getElementById("lista-recordatorios");
  const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];

  if (recordatorios.length === 0) {
    contenedor.innerHTML = "<p>No hay recordatorios aún.</p>";
    return;
  }

  recordatorios.forEach(r => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${r.titulo}</strong> - ${r.fecha}<br>${r.descripcion}<hr>`;
    contenedor.appendChild(div);
  });
}

// Función auxiliar para obtener nombre del mes
function obtenerNombreMes(mes) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mes];
}

// Función para cambiar de mes
function cambiarMes(delta) {
  // Esta función necesitaría implementación completa
  console.log("Cambiar mes:", delta);
  // Aquí deberías actualizar el mes y año mostrados y volver a renderizar
}

// Función para ir al mes actual
function irAHoy() {
  mostrarCalendario();
}

// Función mejorada para mostrar el calendario
function mostrarCalendario() {
  const contenedor = document.getElementById("calendario");
  const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];
  
  // Crear mapa de eventos por fecha
  const mapaEventos = {};
  recordatorios.forEach(r => {
    if (!mapaEventos[r.fecha]) mapaEventos[r.fecha] = [];
    mapaEventos[r.fecha].push(r);
  });

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0);
  
  // Ajustar para que la semana empiece en lunes
  let diaSemanaInicio = primerDia.getDay();
  diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

  let html = `
    <div class="calendar-container">
      <div class="calendar-header">
        <div class="calendar-month">${obtenerNombreMes(mes)} ${año}</div>
        <div class="calendar-title">Calendario de Recordatorios</div>
      </div>
      
      <div class="calendar-nav">
        <button onclick="cambiarMes(-1)">‹ Mes anterior</button>
        <button onclick="irAHoy()">Hoy</button>
        <button onclick="cambiarMes(1)">Mes siguiente ›</button>
      </div>
      
      <table width="100%">
        <thead class="calendar-weekdays">
          <tr>
            <th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th>
          </tr>
        </thead>
        <tbody>`;

  let fechaActual = 1;
  let diaSemana = 0;
  let fila = '<tr>';

  // Añadir celdas vacías para los días anteriores al primer día del mes
  for (let i = 0; i < diaSemanaInicio; i++) {
    fila += '<td class="empty-day"></td>';
    diaSemana++;
  }

  // Añadir los días del mes
  while (fechaActual <= ultimoDia.getDate()) {
    if (diaSemana > 6) {
      html += fila + '</tr><tr>';
      fila = '';
      diaSemana = 0;
    }
    
    const fechaCompleta = `${año}-${String(mes + 1).padStart(2, "0")}-${String(fechaActual).padStart(2, "0")}`;
    const esHoy = hoy.getDate() === fechaActual && hoy.getMonth() === mes && hoy.getFullYear() === año;
    const claseDia = esHoy ? 'today' : 'calendar-day';
    
    let eventosHTML = '';
    if (mapaEventos[fechaCompleta]) {
      eventosHTML = mapaEventos[fechaCompleta].map(r => 
        `<div class="event-marker"><span class="event-badge">${r.titulo}</span></div>`
      ).join('');
    }
    
    fila += `<td class="${claseDia}"><div class="day-number">${fechaActual}</div>${eventosHTML}</td>`;
    fechaActual++;
    diaSemana++;
  }

  // Añadir celdas vacías para los días restantes de la última semana
  while (diaSemana <= 6) {
    fila += '<td class="empty-day"></td>';
    diaSemana++;
  }

  html += fila + '</tr></tbody></table></div>';
  contenedor.innerHTML = html;
}

// Mostrar el calendario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Verifica si estamos en la página del calendario
  if (document.getElementById('calendario')) {
    mostrarCalendario();
  }
  
  // Verifica si estamos en la página de listado
  if (document.getElementById('lista-recordatorios')) {
    mostrarTodos();
  }
});