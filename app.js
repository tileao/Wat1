let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const procedureEl = document.getElementById('procedure');
const configurationEl = document.getElementById('configuration');
const procedureGroup = document.getElementById('procedureGroup');
const configurationGroup = document.getElementById('configurationGroup');
const paEl = document.getElementById('pressureAltitude');
const oatEl = document.getElementById('oat');
const weightEl = document.getElementById('actualWeight');
const headwindEl = document.getElementById('headwind');
const headwindWrap = document.getElementById('headwindWrap');
const runBtn = document.getElementById('runBtn');
const demoBtn = document.getElementById('demoBtn');
const toggleChart = document.getElementById('toggleChart');
const chartPanel = document.getElementById('chartPanel');
const chartCanvas = document.getElementById('chartCanvas');
const ctx = chartCanvas.getContext('2d');
const statusCard = document.getElementById('statusCard');
const statusTitle = document.getElementById('statusTitle');
const statusText = document.getElementById('statusText');
const maxWeightEl = document.getElementById('maxWeight');
const marginEl = document.getElementById('margin');


const autoAdvanceRules = [
  { el: paEl, next: oatEl, minDigits: 3 },
  { el: oatEl, next: weightEl, minDigits: 2 },
  { el: weightEl, next: headwindEl, minDigits: 4, offshoreOnly: true },
  { el: weightEl, next: runBtn, minDigits: 4, offshoreOnly: false },
  { el: headwindEl, next: runBtn, minDigits: 1 }
];

function canAdvance(rule) {
  if (rule.offshoreOnly === true && procedureEl.value !== 'offshore') return false;
  if (rule.offshoreOnly === false && procedureEl.value === 'offshore') return false;
  const value = String(rule.el.value ?? '').replace(/[^0-9]/g, '');
  return value.length >= rule.minDigits;
}

function focusNext(target) {
  if (!target) return;
  if (target === runBtn) {
    runBtn.focus();
    return;
  }
  target.focus();
  target.select?.();
}

function setupAutoAdvance() {
  autoAdvanceRules.forEach((rule) => {
    rule.el.addEventListener('input', () => {
      if (canAdvance(rule)) focusNext(rule.next);
    });
    rule.el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        focusNext(rule.next);
      }
    });
  });
}

const chartDb = {
  offshore: {
    eaps_off: { mode: 'placeholder', note: 'Digitalização pendente' },
    eaps_on: { mode: 'placeholder', note: 'Digitalização pendente' },
    ibf: { mode: 'placeholder', note: 'Digitalização pendente' },
    standard: { mode: 'placeholder', note: 'Digitalização pendente' }
  },
  clear: {
    eaps_off: { mode: 'placeholder' },
    eaps_on: { mode: 'placeholder' },
    ibf: { mode: 'placeholder' },
    standard: { mode: 'placeholder' }
  },
  confined: {
    eaps_off: { mode: 'placeholder' },
    eaps_on: { mode: 'placeholder' },
    ibf: { mode: 'placeholder' },
    standard: { mode: 'placeholder' }
  }
};


function syncSegmentedUI(groupEl, value) {
  groupEl.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.value === value);
    btn.setAttribute('aria-selected', btn.dataset.value === value ? 'true' : 'false');
  });
}

function setSegmentedValue(target, value) {
  if (target === 'procedure') {
    procedureEl.value = value;
    syncSegmentedUI(procedureGroup, value);
    toggleHeadwind();
    if (value !== 'offshore') headwindEl.value = '';
    return;
  }
  if (target === 'configuration') {
    configurationEl.value = value;
    syncSegmentedUI(configurationGroup, value);
  }
}

function setupSegmentedControls() {
  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setSegmentedValue(btn.dataset.target, btn.dataset.value);
    });
  });
}

function toggleHeadwind() {
  headwindWrap.classList.toggle('hidden', procedureEl.value !== 'offshore');
}

function loadDemo() {
  setSegmentedValue('procedure', 'offshore');
  setSegmentedValue('configuration', 'eaps_off');
  paEl.value = '1200';
  oatEl.value = '28';
  weightEl.value = '6550';
  headwindEl.value = '15';
  toggleHeadwind();
  runCalculation();
}

function estimatePlaceholderMaxWeight(pa, oat, procedure, configuration, headwind) {
  const procedureBase = { offshore: 6670, clear: 6710, confined: 6620 }[procedure] ?? 6650;
  const configDelta = { standard: 0, eaps_off: 0, eaps_on: 70, ibf: 110 }[configuration] ?? 0;
  const paPenalty = Math.max(0, pa * 0.045);
  const oatPenalty = Math.max(0, (oat + 10) * 2.8);
  const windBonus = procedure === 'offshore' ? Math.max(0, Math.min(headwind || 0, 40) * 4.5) : 0;
  const result = Math.min(6800, Math.max(6100, procedureBase + configDelta - paPenalty - oatPenalty + windBonus));
  return Math.round(result / 5) * 5;
}

function formatKg(v) {
  return `${Math.round(v).toLocaleString('pt-BR')} kg`;
}

function runCalculation() {
  const procedure = procedureEl.value;
  const configuration = configurationEl.value;
  const pa = Number(paEl.value);
  const oat = Number(oatEl.value);
  const actualWeight = Number(weightEl.value);
  const headwind = Number(headwindEl.value || 0);

  if ([pa, oat, actualWeight].some(Number.isNaN)) {
    statusCard.className = 'card status neutral';
    statusTitle.textContent = 'Dados incompletos';
    statusText.textContent = 'Preencha altitude, OAT e peso atual.';
    maxWeightEl.textContent = '—';
    marginEl.textContent = '—';
    drawChart();
    return;
  }

  const maxWeight = estimatePlaceholderMaxWeight(pa, oat, procedure, configuration, headwind);
  const margin = maxWeight - actualWeight;
  const within = margin >= 0;

  statusCard.className = `card status ${within ? 'within' : 'out'}`;
  statusTitle.textContent = within ? 'WITHIN ENVELOPE' : 'OUT OF ENVELOPE';
  statusText.textContent = within
    ? 'Peso atual dentro do envelope calculado.'
    : 'Peso atual acima do envelope calculado.';
  maxWeightEl.textContent = formatKg(maxWeight);
  marginEl.textContent = `${margin >= 0 ? '+' : ''}${Math.round(margin).toLocaleString('pt-BR')} kg`;

  drawChart({ procedure, configuration, pa, oat, actualWeight, headwind, maxWeight, within });
}

function drawChart(data) {
  const w = chartCanvas.width;
  const h = chartCanvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0b1017';
  ctx.fillRect(0, 0, w, h);

  const pad = { left: 90, right: 40, top: 50, bottom: 80 };
  const gx = pad.left;
  const gy = pad.top;
  const gw = w - pad.left - pad.right;
  const gh = h - pad.top - pad.bottom;

  ctx.strokeStyle = '#223141';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = gx + (gw / 10) * i;
    const y = gy + (gh / 10) * i;
    ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + gh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx + gw, y); ctx.stroke();
  }

  ctx.strokeStyle = '#6fa8dc';
  ctx.lineWidth = 1.6;
  [10, 20, 30, 40].forEach((temp, idx) => {
    ctx.beginPath();
    const startY = gy + 40 + idx * 58;
    ctx.moveTo(gx + 20, startY);
    ctx.lineTo(gx + gw - 30, startY + 130);
    ctx.stroke();
    ctx.fillStyle = '#8ea0b7';
    ctx.fillText(`${temp}°C`, gx + gw - 56, startY + 122);
  });

  ctx.fillStyle = '#8ea0b7';
  ctx.font = '14px sans-serif';
  ctx.fillText('Gross Weight (kg)', gx + gw / 2 - 54, h - 28);
  ctx.save();
  ctx.translate(24, gy + gh / 2 + 40);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Pressure Altitude (ft)', 0, 0);
  ctx.restore();

  if (!data) {
    ctx.fillStyle = '#b7c7db';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('Aguardando cálculo', gx + 24, gy + 34);
    return;
  }

  const xMin = 6400, xMax = 6800;
  const yMin = 0, yMax = 4000;
  const toX = (value) => gx + ((value - xMin) / (xMax - xMin)) * gw;
  const toY = (value) => gy + gh - ((value - yMin) / (yMax - yMin)) * gh;

  const maxX = toX(data.maxWeight);
  const actualX = toX(data.actualWeight);
  const y = toY(data.pa);

  ctx.strokeStyle = data.within ? '#14b86a' : '#df4f5f';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(gx, y);
  ctx.lineTo(maxX, y);
  ctx.stroke();

  ctx.strokeStyle = '#52a8ff';
  ctx.beginPath();
  ctx.moveTo(actualX, gy);
  ctx.lineTo(actualX, gy + gh);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(maxX, y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#b7c7db';
  ctx.fillText(`PA ${data.pa} ft`, gx + 10, y - 10);
  ctx.fillText(`OAT ${data.oat}°C`, gx + 10, y + 12);
  ctx.fillText(`MAX ${Math.round(data.maxWeight)} kg`, Math.min(maxX + 12, gx + gw - 120), Math.max(y - 12, gy + 18));
  ctx.fillText(`ACT ${Math.round(data.actualWeight)} kg`, Math.min(actualX + 12, gx + gw - 120), gy + 22);
  if (data.procedure === 'offshore') {
    ctx.fillText(`HW ${Math.round(data.headwind)} kt`, gx + gw - 96, gy + gh - 12);
  }
}

runBtn.addEventListener('click', runCalculation);
demoBtn.addEventListener('click', loadDemo);
toggleChart.addEventListener('click', () => {
  chartPanel.classList.toggle('hidden');
  toggleChart.textContent = chartPanel.classList.contains('hidden') ? 'Mostrar gráfico' : 'Ocultar gráfico';
  if (!chartPanel.classList.contains('hidden')) drawChart();
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add('hidden');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}

setupSegmentedControls();
setSegmentedValue('procedure', 'offshore');
setSegmentedValue('configuration', 'standard');
setupAutoAdvance();
drawChart();
