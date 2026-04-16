'use strict';

// ── DATA ──────────────────────────────────────────────────────────────────────
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const RAW_TASKS = [
  {id:1,  tarea:'Lavado y engrase y control fluidos TOYOTA 3',      sector:'Playa',         resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-10'},
  {id:2,  tarea:'Lavado y engrase y control fluidos TOYOTA 1',      sector:'Playa',         resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-11'},
  {id:3,  tarea:'Mantenimiento CAT924 Cerámica',                    sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-11'},
  {id:4,  tarea:'Mantenimiento CAT924 Cevig',                       sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-11'},
  {id:5,  tarea:'Mantenimiento JD544J Cerámica',                    sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-15'},
  {id:6,  tarea:'Lubricado cadenas desapilado',                     sector:'Desapilado',    resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-15'},
  {id:7,  tarea:'Engrase rodamientos desapilado',                   sector:'Desapilado',    resp:'Pablo Monrroy',    period:14,  ultima:'2026-04-15'},
  {id:8,  tarea:'Engrase envolvedora',                              sector:'Desapilado',    resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-15'},
  {id:9,  tarea:'Lubricado cadenas apilado',                        sector:'Apilado',       resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-05'},
  {id:10, tarea:'Engrase rodamientos apilado',                      sector:'Apilado',       resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-18'},
  {id:11, tarea:'Mantenimiento robot apilado',                      sector:'Apilado',       resp:'Terciarizado',     period:365, ultima:'2026-03-16'},
  {id:12, tarea:'Engrase ruedas secadero',                          sector:'Secadero',      resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-16'},
  {id:13, tarea:'Engrase cajas portarodamiento chimeneas',          sector:'Horno',         resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-14'},
  {id:14, tarea:'Carga aceite grapodina 320',                       sector:'Moldeo',        resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-13'},
  {id:15, tarea:'Engrase del DAFF',                                 sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-13'},
  {id:16, tarea:'Engrase laminadores',                              sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-13'},
  {id:17, tarea:'Engrase extrusora 1',                              sector:'Moldeo',        resp:'Pablo Monrroy',    period:92,  ultima:'2026-04-09'},
  {id:18, tarea:'Lavado y lubricado ascensor',                      sector:'Secadero',      resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-09'},
  {id:19, tarea:'Lavado y lubricado descensor',                     sector:'Secadero',      resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-09'},
  {id:20, tarea:'Engrase general horno',                            sector:'Horno',         resp:'Pablo Monrroy',    period:186, ultima:'2026-04-15'},
  {id:21, tarea:'Lubricación cadenas puerta horno',                 sector:'Horno',         resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-10'},
  {id:22, tarea:'Control compresores',                              sector:'Compresores',   resp:'Pablo Monrroy',    period:7,   ultima:'2026-05-02'},
  {id:23, tarea:'Engrase rodamientos cajones',                      sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-16'},
  {id:24, tarea:'Engrase rodamientos amasadora',                    sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-05-04'},
  {id:25, tarea:'Engrase rodamientos laminadores',                  sector:'Molienda',      resp:'Pablo Monrroy',    period:7,   ultima:'2026-05-05'},
  {id:26, tarea:'Engrase motores laminadores',                      sector:'Molienda',      resp:'Pablo Monrroy',    period:31,  ultima:'2026-04-10'},
  {id:27, tarea:'Inspección visual transbordadores',                sector:'Horno',         resp:'Pablo Monrroy',    period:31,  ultima:'2026-05-07'},
  {id:28, tarea:'Engrase vagonetas',                                sector:'Horno',         resp:'Pablo Monrroy',    period:7,   ultima:'2026-04-13'},
  {id:29, tarea:'Amolar crestas laminadores',                       sector:'Molienda',      resp:'Walter Ruiz',      period:31,  ultima:'2026-05-09'},
  {id:30, tarea:'Control barra DAFF',                               sector:'Molienda',      resp:'Walter Ruiz',      period:31,  ultima:'2026-05-10'},
  {id:31, tarea:'Cambio rampa gas y bba agua',                      sector:'Servicios aux', resp:'Yuri Claure',      period:31,  ultima:'2026-03-30'},
  {id:32, tarea:'Checklist subestación eléctrica',                  sector:'Servicios aux', resp:'Yuri Claure',      period:7,   ultima:'2026-04-13'},
  {id:33, tarea:'Rectificado laminadores',                          sector:'Molienda',      resp:'Jesus Cristancho', period:1,   ultima:'2026-04-16'},
  {id:34, tarea:'Control limpieza cinta descarte apilado',          sector:'Apilado',       resp:'Orellana',         period:1,   ultima:'2026-04-19'},
];

// ── STATE ─────────────────────────────────────────────────────────────────────
let tasks = [];
let history = [];
let nextId = 35;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function calcTask(raw) {
  const ult = new Date(raw.ultima + 'T00:00:00');
  const prox = new Date(ult);
  prox.setDate(prox.getDate() + raw.period);
  const diff = Math.round((prox - TODAY) / 86400000);
  const estado = diff < 0 ? 'vencida' : diff === 0 ? 'hoy' : diff <= 7 ? 'pronto' : 'ok';
  return { ...raw, prox, diff, estado };
}

function getStatus(diff) {
  if (diff < 0)  return { label: `Vencida ${Math.abs(diff)}d`, cls: 'danger',  cardCls: 'overdue' };
  if (diff === 0) return { label: 'Hoy',                        cls: 'warning', cardCls: 'today'   };
  if (diff <= 7)  return { label: `En ${diff}d`,               cls: 'info',    cardCls: 'soon'    };
  return               { label: `En ${diff}d`,                 cls: 'success', cardCls: 'ok'      };
}

function fmtDate(d) {
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function renderMetrics() {
  const v = tasks.filter(t => t.diff < 0).length;
  const h = tasks.filter(t => t.diff === 0).length;
  const p = tasks.filter(t => t.diff > 0 && t.diff <= 7).length;
  const ok = tasks.filter(t => t.diff > 7).length;
  document.getElementById('metrics').innerHTML = `
    <div class="metric-card danger">
      <div class="metric-label">Vencidas</div>
      <div class="metric-value">${v}</div>
    </div>
    <div class="metric-card warning">
      <div class="metric-label">Para hoy</div>
      <div class="metric-value">${h}</div>
    </div>
    <div class="metric-card info">
      <div class="metric-label">Esta semana</div>
      <div class="metric-value">${p}</div>
    </div>
    <div class="metric-card success">
      <div class="metric-label">Al día</div>
      <div class="metric-value">${ok}</div>
    </div>`;
}

function taskCardHTML(t) {
  const s = getStatus(t.diff);
  const proxStr = fmtDate(t.prox);
  return `
    <div class="task-card ${s.cardCls}">
      <div class="task-left">
        <div class="task-name">${t.tarea}</div>
        <div class="task-meta">${t.sector} · ${t.resp} · cada ${t.period}d · próx: ${proxStr}</div>
      </div>
      <div class="task-right">
        <span class="badge ${s.cls}">${s.label}</span>
        <button class="done-btn" onclick="markDone(${t.id})">✓ Realizada</button>
      </div>
    </div>`;
}

function renderDashboard() {
  renderMetrics();

  const urgent = tasks.filter(t => t.diff <= 0).sort((a, b) => a.diff - b.diff).slice(0, 8);
  const soon   = tasks.filter(t => t.diff > 0 && t.diff <= 7).sort((a, b) => a.diff - b.diff).slice(0, 8);

  document.getElementById('urgent-list').innerHTML =
    urgent.length ? urgent.map(taskCardHTML).join('') : '<div class="empty">Sin tareas vencidas</div>';
  document.getElementById('soon-list').innerHTML =
    soon.length   ? soon.map(taskCardHTML).join('')   : '<div class="empty">Sin tareas urgentes esta semana</div>';

  renderSectorChart();
}

function renderSectorChart() {
  const sectors = {};
  tasks.forEach(t => { sectors[t.sector] = (sectors[t.sector] || 0) + 1; });
  const sorted = Object.entries(sectors).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const colors = ['#e8c547','#4d9de0','#52c07a','#e8a33a','#a78bfa','#f472b6','#6ee7b7','#fb923c','#e05252'];

  document.getElementById('sector-chart').innerHTML = sorted.map(([s, c], i) => `
    <div class="bar-row">
      <div class="bar-label">${s}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${((c / max) * 100).toFixed(1)}%;background:${colors[i % colors.length]};"></div>
      </div>
      <div class="bar-count">${c}</div>
    </div>`).join('');
}

function renderTareas() {
  const sec  = document.getElementById('filter-sector').value;
  const resp = document.getElementById('filter-resp').value;
  const est  = document.getElementById('filter-estado').value;

  const filtered = tasks
    .filter(t => (!sec  || t.sector === sec) && (!resp || t.resp === resp) && (!est || t.estado === est))
    .sort((a, b) => a.diff - b.diff);

  document.getElementById('all-tasks-list').innerHTML =
    filtered.length ? filtered.map(taskCardHTML).join('') : '<div class="empty">Sin tareas que coincidan con los filtros</div>';
}

function renderHistorial() {
  const el = document.getElementById('hist-list');
  if (!history.length) {
    el.innerHTML = '<div class="empty">Aún no hay mantenimientos registrados.<br>Marcá una tarea como realizada para que aparezca acá.</div>';
    return;
  }
  el.innerHTML = `
    <div class="panel">
      <table class="hist-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Sector</th>
            <th>Responsable</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${history.slice().reverse().map(h => `
            <tr>
              <td>${h.tarea}</td>
              <td>${h.sector}</td>
              <td>${h.resp}</td>
              <td>${h.fecha}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function populateFilters() {
  const sectors = [...new Set(tasks.map(t => t.sector))].sort();
  const resps   = [...new Set(tasks.map(t => t.resp))].sort();

  const secSel  = document.getElementById('filter-sector');
  const respSel = document.getElementById('filter-resp');

  sectors.forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    secSel.appendChild(o);
  });
  resps.forEach(r => {
    const o = document.createElement('option');
    o.value = r; o.textContent = r;
    respSel.appendChild(o);
  });
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────
function markDone(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  history.push({ tarea: t.tarea, sector: t.sector, resp: t.resp, fecha: fmtDate(TODAY) });

  const newProx = new Date(TODAY);
  newProx.setDate(newProx.getDate() + t.period);
  t.ultima = TODAY.toISOString().split('T')[0];
  t.prox   = newProx;
  t.diff   = Math.round((newProx - TODAY) / 86400000);
  t.estado = t.diff === 0 ? 'hoy' : t.diff <= 7 ? 'pronto' : 'ok';

  renderAll();
}

function openModal() {
  document.getElementById('modal-bg').classList.add('open');
  document.getElementById('m-fecha').value = TODAY.toISOString().split('T')[0];
}

function closeModal() {
  document.getElementById('modal-bg').classList.remove('open');
  ['m-tarea','m-sector','m-resp','m-period'].forEach(id => document.getElementById(id).value = '');
}

function handleModalBgClick(e) {
  if (e.target === document.getElementById('modal-bg')) closeModal();
}

function saveTask() {
  const tarea  = document.getElementById('m-tarea').value.trim();
  const sector = document.getElementById('m-sector').value.trim();
  const resp   = document.getElementById('m-resp').value.trim();
  const period = parseInt(document.getElementById('m-period').value) || 7;
  const ultima = document.getElementById('m-fecha').value;

  if (!tarea || !sector || !resp || !ultima) {
    alert('Por favor completá todos los campos.');
    return;
  }

  const newTask = calcTask({ id: nextId++, tarea, sector, resp, period, ultima });
  tasks.push(newTask);
  closeModal();
  populateFilters();
  renderAll();
}

function setTab(tab) {
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'tareas')    renderTareas();
  if (tab === 'historial') renderHistorial();
}

function renderAll() {
  renderDashboard();
  renderTareas();
  renderHistorial();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
  tasks = RAW_TASKS.map(calcTask);

  document.getElementById('today-label').textContent =
    TODAY.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab));
  });

  populateFilters();
  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
