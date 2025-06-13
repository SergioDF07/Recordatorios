let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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

  document.getElementById("titulo").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("descripcion").value = "";

  const confirmacion = document.createElement("div");
  confirmacion.className = "alert alert-success mt-3";
  confirmacion.textContent = "Recordatorio guardado correctamente!";
  document.querySelector("main").appendChild(confirmacion);

  setTimeout(() => {
    confirmacion.remove();
  }, 3000);

  mostrarCalendario();
}


function mostrarTodos() {
  const contenedor = document.getElementById("lista-recordatorios");
  contenedor.innerHTML = "";
  const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];

  if (recordatorios.length === 0) {
    contenedor.innerHTML = "<p>No hay recordatorios aún.</p>";
    return;
  }

  recordatorios.forEach((r, index) => {
    const div = document.createElement("div");
    div.classList.add("recordatorio-item");
    div.innerHTML = `
      <strong>${r.titulo}</strong> - ${r.fecha}<br>
      ${r.descripcion}
      <br>
      <button class="btn btn-sm btn-danger mt-2" onclick="eliminarRecordatorio(${index})">Eliminar</button>
      <hr>`;
    contenedor.appendChild(div);
  });
}


function eliminarRecordatorio(index) {
  const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];
  if (index >= 0 && index < recordatorios.length) {
    recordatorios.splice(index, 1);
    localStorage.setItem("recordatorios", JSON.stringify(recordatorios));
    mostrarTodos();
    mostrarCalendario();
  }
}

function mostrarEstadisticas() {
  const hoy = new Date().toISOString().split("T")[0];
  const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];

  const total = recordatorios.length;
  const completados = recordatorios.filter(r => r.fecha < hoy).length;
  const porHacer = total - completados;

  document.getElementById("total-count").textContent = total;
  document.getElementById("por-hacer-count").textContent = porHacer;
  document.getElementById("completados-count").textContent = completados;
}

function obtenerNombreMes(mes) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mes];
}

function cambiarMes(delta) {
  currentMonth += delta;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  mostrarCalendario();
}

function irAHoy() {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  mostrarCalendario();
}

function mostrarCalendario() {
  const contenedor = document.getElementById("calendario");
  const recordatorios = JSON.parse(localStorage.getItem("recordatorios")) || [];

  const mapaEventos = {};
  recordatorios.forEach(r => {
    if (!mapaEventos[r.fecha]) mapaEventos[r.fecha] = [];
    mapaEventos[r.fecha].push(r);
  });

  const primerDia = new Date(currentYear, currentMonth, 1);
  const ultimoDia = new Date(currentYear, currentMonth + 1, 0);
  const hoy = new Date();

  let diaSemanaInicio = primerDia.getDay();
  diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

  let html = `
    <div class="calendar-container">
      <div class="calendar-header">
        <div class="calendar-month">${obtenerNombreMes(currentMonth)} ${currentYear}</div>
        <div class="calendar-title">Calendario de Recordatorios</div>
      </div>

      <div class="calendar-nav">
        <button onclick="cambiarMes(-1)" class="btn btn-outline-secondary">‹ Mes anterior</button>
        <button onclick="irAHoy()" class="btn btn-outline-primary">Hoy</button>
        <button onclick="cambiarMes(1)" class="btn btn-outline-secondary">Mes siguiente ›</button>
      </div>

      <table class="table table-bordered" width="100%">
        <thead class="calendar-weekdays">
          <tr>
            <th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th>
          </tr>
        </thead>
        <tbody>`;

  let fechaActual = 1;
  let diaSemana = 0;
  let fila = '<tr>';

  for (let i = 0; i < diaSemanaInicio; i++) {
    fila += '<td class="empty-day"></td>';
    diaSemana++;
  }

  while (fechaActual <= ultimoDia.getDate()) {
    if (diaSemana > 6) {
      html += fila + '</tr><tr>';
      fila = '';
      diaSemana = 0;
    }

    const fechaCompleta = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(fechaActual).padStart(2, "0")}`;
    const esHoy = hoy.getDate() === fechaActual && hoy.getMonth() === currentMonth && hoy.getFullYear() === currentYear;
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

  while (diaSemana <= 6) {
    fila += '<td class="empty-day"></td>';
    diaSemana++;
  }

  html += fila + '</tr></tbody></table></div>';
  contenedor.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('calendario')) {
    mostrarCalendario();
  }

  if (document.getElementById('lista-recordatorios')) {
    mostrarTodos();
  }

  if (document.getElementById('total-count')) {
    mostrarEstadisticas();
  }
});
