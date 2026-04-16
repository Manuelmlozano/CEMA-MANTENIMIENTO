'use strict';

// ── CONFIGURACIÓN ─────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admincema'; // ← cambiá esta contraseña

// ── TODAY ─────────────────────────────────────────────────────────────────────
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

// ── RAW DATA ──────────────────────────────────────────────────────────────────
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
let calYear = TODAY.getFullYear();
let calMonth = TODAY.getMonth();
let activeDetailId = null;
let editingId = null;
let deletingId = null;
let adminLoggedIn = false;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function calcTask(raw) {
  const ult = new Date(raw.ultima + 'T00:00:00');
  const prox = new Date(ult);
  prox.setDate(prox.getDate() + raw.period);
  const diff = Math.round((prox - TODAY) / 86400000);
  const estado = diff < 0 ? 'vencida' : diff === 0 ? 'hoy' : diff <= 7 ? 'pronto' : 'ok';
  return { ...raw, prox, diff, estado, doneToday: raw.doneToday || false };
}

function getStatus(t) {
  if (t.doneToday) return { label: '✓ Realizada', cls: 'done', cardCls: 'done-today' };
  if (t.diff < 0)   return { label: `Vencida ${Math.abs(t.diff)}d`, cls: 'danger',  cardCls: 'overdue' };
  if (t.diff === 0)  return { label: 'Hoy',                          cls: 'warning', cardCls: 'today'   };
  if (t.diff <= 7)   return { label: `En ${t.diff}d`,               cls: 'info',    cardCls: 'soon'    };
  return                    { label: `En ${t.diff}d`,               cls: 'success', cardCls: 'ok'      };
}

function fmtDate(d) { return d.toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric' }); }
function fmtDateShort(d) { return d.toLocaleDateString('es-AR', { day:'2-digit', month:'short' }); }

// ── TASK CARD ─────────────────────────────────────────────────────────────────
function taskCardHTML(t) {
  const s = getStatus(t);
  return `
    <div class="task-card ${s.cardCls}" onclick="openDetail(${t.id})">
      <div class="task-card-top">
        <div class="task-name">${t.tarea}</div>
        <span class="badge ${s.cls}">${s.label}</span>
      </div>
      <div class="task-card-meta">Próx: ${fmtDateShort(t.prox)} · cada ${t.period}d</div>
      <div class="task-card-footer">
        <span class="task-card-sector">${t.sector}</span>
        <span class="task-card-resp">${t.resp}</span>
      </div>
    </div>`;
}

// ── HOY ───────────────────────────────────────────────────────────────────────
function renderHoy() {
  document.getElementById('today-label').textContent =
    TODAY.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const vencidas   = tasks.filter(t => t.diff < 0 && !t.doneToday).sort((a,b) => a.diff - b.diff);
  const hoy        = tasks.filter(t => t.diff === 0 && !t.doneToday);
  const realizadas = tasks.filter(t => t.doneToday);

  const pills = [];
  if (vencidas.length)   pills.push(`<div class="metric-pill danger">${vencidas.length} vencida${vencidas.length>1?'s':''}</div>`);
  if (hoy.length)        pills.push(`<div class="metric-pill warning">${hoy.length} para hoy</div>`);
  if (realizadas.length) pills.push(`<div class="metric-pill success">${realizadas.length} realizada${realizadas.length>1?'s':''}</div>`);
  document.getElementById('metrics-hoy').innerHTML = pills.join('');

  const hayAlgo = vencidas.length || hoy.length || realizadas.length;
  document.getElementById('hoy-empty').style.display = hayAlgo ? 'none' : 'flex';
  document.getElementById('hoy-vencidas-wrap').style.display = vencidas.length ? 'block' : 'none';
  document.getElementById('hoy-tareas-wrap').style.display = (hoy.length || realizadas.length) ? 'block' : 'none';
  document.getElementById('hoy-vencidas').innerHTML = vencidas.map(taskCardHTML).join('');
  document.getElementById('hoy-lista').innerHTML = [...hoy, ...realizadas].map(taskCardHTML).join('');
}

// ── TAREAS ────────────────────────────────────────────────────────────────────
function renderTareas() {
  const sec  = document.getElementById('filter-sector').value;
  const resp = document.getElementById('filter-resp').value;
  const est  = document.getElementById('filter-estado').value;
  const filtered = tasks.filter(t => (!sec||t.sector===sec) && (!resp||t.resp===resp) && (!est||t.estado===est)).sort((a,b) => a.diff-b.diff);
  document.getElementById('all-tasks-grid').innerHTML = filtered.length ? filtered.map(taskCardHTML).join('') : '<div class="empty">Sin tareas que coincidan</div>';
}

function populateFilters() {
  const sectors = [...new Set(tasks.map(t => t.sector))].sort();
  const resps   = [...new Set(tasks.map(t => t.resp))].sort();
  const secSel  = document.getElementById('filter-sector');
  const respSel = document.getElementById('filter-resp');
  while (secSel.options.length > 1) secSel.remove(1);
  while (respSel.options.length > 1) respSel.remove(1);
  sectors.forEach(s => { const o=document.createElement('option'); o.value=s; o.textContent=s; secSel.appendChild(o); });
  resps.forEach(r => { const o=document.createElement('option'); o.value=r; o.textContent=r; respSel.appendChild(o); });
}

// ── HISTORIAL ─────────────────────────────────────────────────────────────────
function renderHistorial() {
  const el = document.getElementById('hist-list');
  if (!history.length) { el.innerHTML = '<div class="empty">Aún no hay mantenimientos registrados.<br>Tocá una tarea y marcala como realizada.</div>'; return; }
  el.innerHTML = `<div class="hist-panel"><table class="hist-table">
    <thead><tr><th>Tarea</th><th>Sector</th><th>Responsable</th><th>Fecha</th></tr></thead>
    <tbody>${history.slice().reverse().map(h=>`<tr><td>${h.tarea}</td><td>${h.sector}</td><td>${h.resp}</td><td>${h.fecha}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

// ── CALENDARIO ────────────────────────────────────────────────────────────────
function renderCalendar() {
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  document.getElementById('cal-title').textContent = `${months[calMonth]} ${calYear}`;
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const tasksByDay = {};
  tasks.forEach(t => {
    if (t.prox.getFullYear()===calYear && t.prox.getMonth()===calMonth) {
      const d = t.prox.getDate();
      if (!tasksByDay[d]) tasksByDay[d] = [];
      tasksByDay[d].push(t);
    }
  });
  const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  let html = days.map(d=>`<div class="cal-day-header">${d}</div>`).join('');
  for (let i=0; i<startOffset; i++) html += `<div class="cal-day empty-day"></div>`;
  for (let day=1; day<=daysInMonth; day++) {
    const date = new Date(calYear, calMonth, day);
    const isToday = date.toDateString()===TODAY.toDateString();
    const dayTasks = tasksByDay[day]||[];
    const pills = dayTasks.slice(0,3).map(t=>{ const s=getStatus(t); return `<div class="cal-task-pill ${s.cls}">${t.tarea.slice(0,16)}…</div>`; }).join('');
    const more = dayTasks.length>3 ? `<div class="cal-more">+${dayTasks.length-3} más</div>` : '';
    html += `<div class="cal-day ${isToday?'today-day':''} ${dayTasks.length?'has-tasks':''}" onclick="${dayTasks.length?`openDayModal(${day})`:''}">
      <div class="cal-day-num">${day}</div>
      <div class="cal-tasks">${pills}${more}</div>
    </div>`;
  }
  document.getElementById('calendar').innerHTML = html;
}

function prevMonth() { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }
function nextMonth() { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }

function openDayModal(day) {
  const date = new Date(calYear, calMonth, day);
  const dayTasks = tasks.filter(t => t.prox.getFullYear()===calYear && t.prox.getMonth()===calMonth && t.prox.getDate()===day);
  document.getElementById('day-title').textContent = date.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'});
  document.getElementById('day-tasks').innerHTML = dayTasks.map(taskCardHTML).join('')||'<div class="empty">Sin tareas</div>';
  document.getElementById('day-bg').classList.add('open');
}
function closeDay() { document.getElementById('day-bg').classList.remove('open'); }
function handleDayBgClick(e) { if(e.target===document.getElementById('day-bg')) closeDay(); }

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
function openDetail(id) {
  const t = tasks.find(x=>x.id===id);
  if (!t) return;
  activeDetailId = id;
  const s = getStatus(t);
  document.getElementById('detail-title').textContent = t.tarea;
  document.getElementById('detail-sector').textContent = t.sector;
  document.getElementById('detail-resp').textContent = t.resp;
  document.getElementById('detail-period').textContent = `Cada ${t.period} días`;
  document.getElementById('detail-ultima').textContent = t.ultima;
  document.getElementById('detail-prox').textContent = fmtDate(t.prox);
  document.getElementById('detail-badge').innerHTML = `<span class="badge ${s.cls}">${s.label}</span>`;
  document.getElementById('detail-bg').classList.add('open');
}
function closeDetail() { document.getElementById('detail-bg').classList.remove('open'); activeDetailId=null; }
function handleDetailBgClick(e) { if(e.target===document.getElementById('detail-bg')) closeDetail(); }

function confirmarRealizada() {
  const t = tasks.find(x=>x.id===activeDetailId);
  if (!t) return;
  history.push({ tarea:t.tarea, sector:t.sector, resp:t.resp, fecha:fmtDate(TODAY) });
  const newProx = new Date(TODAY);
  newProx.setDate(newProx.getDate()+t.period);
  t.ultima = TODAY.toISOString().split('T')[0];
  t.prox   = newProx;
  t.diff   = Math.round((newProx-TODAY)/86400000);
  t.estado = t.diff===0?'hoy':t.diff<=7?'pronto':'ok';
  t.doneToday = true;
  closeDetail();
  renderAll();
}

// ── NUEVA / EDITAR TAREA ──────────────────────────────────────────────────────
function openModal(id) {
  editingId = id || null;
  document.getElementById('modal-title').textContent = editingId ? 'Editar tarea' : 'Nueva tarea';
  document.getElementById('modal-save-btn').textContent = editingId ? 'Guardar cambios' : 'Guardar tarea';
  if (editingId) {
    const t = tasks.find(x=>x.id===editingId);
    document.getElementById('m-tarea').value  = t.tarea;
    document.getElementById('m-sector').value = t.sector;
    document.getElementById('m-resp').value   = t.resp;
    document.getElementById('m-period').value = t.period;
    document.getElementById('m-fecha').value  = t.ultima;
  } else {
    ['m-tarea','m-sector','m-resp','m-period'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('m-fecha').value = TODAY.toISOString().split('T')[0];
  }
  document.getElementById('modal-bg').classList.add('open');
}
function closeModal() { document.getElementById('modal-bg').classList.remove('open'); editingId=null; }
function handleModalBgClick(e) { if(e.target===document.getElementById('modal-bg')) closeModal(); }

function saveTask() {
  const tarea  = document.getElementById('m-tarea').value.trim();
  const sector = document.getElementById('m-sector').value.trim();
  const resp   = document.getElementById('m-resp').value.trim();
  const period = parseInt(document.getElementById('m-period').value)||7;
  const ultima = document.getElementById('m-fecha').value;
  if (!tarea||!sector||!resp||!ultima) { alert('Completá todos los campos.'); return; }
  if (editingId) {
    const idx = tasks.findIndex(x=>x.id===editingId);
    tasks[idx] = calcTask({ ...tasks[idx], tarea, sector, resp, period, ultima, doneToday:false });
  } else {
    tasks.push(calcTask({ id:nextId++, tarea, sector, resp, period, ultima }));
  }
  closeModal();
  populateFilters();
  renderAll();
  if (adminLoggedIn) renderAdmin();
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────
function checkPass() {
  const val = document.getElementById('admin-pass').value;
  if (val === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('admin-pass').value = '';
    document.getElementById('login-error').textContent = '';
    renderAdmin();
  } else {
    document.getElementById('login-error').textContent = 'Contraseña incorrecta';
    document.getElementById('admin-pass').value = '';
  }
}

function logoutAdmin() {
  adminLoggedIn = false;
  document.getElementById('admin-login').style.display = 'block';
  document.getElementById('admin-panel').style.display = 'none';
}

function renderAdmin() {
  const sorted = [...tasks].sort((a,b) => a.diff-b.diff);
  document.getElementById('admin-task-list').innerHTML = sorted.map(t => {
    const s = getStatus(t);
    return `<div class="admin-row">
      <div class="admin-row-info">
        <div class="admin-row-name">${t.tarea}</div>
        <div class="admin-row-meta">${t.sector} · ${t.resp} · cada ${t.period}d · próx: ${fmtDateShort(t.prox)} · <span class="badge ${s.cls}" style="font-size:10px">${s.label}</span></div>
      </div>
      <div class="admin-row-actions">
        <button class="btn-edit" onclick="openModal(${t.id})">✏ Editar</button>
        <button class="btn-delete" onclick="openConfirm(${t.id})">✕ Eliminar</button>
      </div>
    </div>`;
  }).join('');
}

// ── CONFIRMAR ELIMINAR ────────────────────────────────────────────────────────
function openConfirm(id) {
  deletingId = id;
  const t = tasks.find(x=>x.id===id);
  document.getElementById('confirm-name').textContent = t.tarea;
  document.getElementById('confirm-bg').classList.add('open');
}
function closeConfirm() { document.getElementById('confirm-bg').classList.remove('open'); deletingId=null; }
function handleConfirmBgClick(e) { if(e.target===document.getElementById('confirm-bg')) closeConfirm(); }

function confirmarEliminar() {
  tasks = tasks.filter(x=>x.id!==deletingId);
  closeConfirm();
  populateFilters();
  renderAll();
  if (adminLoggedIn) renderAdmin();
}

// ── TAB NAV ───────────────────────────────────────────────────────────────────
function setTab(tab) {
  document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn=>btn.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  if (tab==='hoy')       renderHoy();
  if (tab==='calendario') renderCalendar();
  if (tab==='tareas')    renderTareas();
  if (tab==='historial') renderHistorial();
  if (tab==='admin' && adminLoggedIn) renderAdmin();
}

function renderAll() {
  renderHoy();
  renderCalendar();
  renderTareas();
  renderHistorial();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
  tasks = RAW_TASKS.map(calcTask);
  populateFilters();
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', ()=>setTab(btn.dataset.tab));
  });
  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
