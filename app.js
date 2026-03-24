let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const procedureEl = document.getElementById('procedure');
const configurationEl = document.getElementById('configuration');
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
const hintEl = document.querySelector('.form-card .hint');

const phase1OffshoreStandard = {
  temps: [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50],
  // Hand-digitized phase-1 approximation from Figure 4-7.
  // Values are sea-level, zero-wind starting points before PA penalty.
  seaLevelKg: [6800, 6800, 6800, 6800, 6800, 6750, 6600, 6460, 6320, 6180],
  paPenaltyKgPer1000Ft: 150,
  headwindBonusKg: [
    { kt: 0, bonus: 0 },
    { kt: 5, bonus: 80 },
    { kt: 10, bonus: 170 },
    { kt: 15, bonus: 280 },
    { kt: 20, bonus: 360 }
  ]
};

const autoAdvanceRules = [
  { el: paEl, next: oatEl, minDigits: 3 },
  { el: oatEl, next: weightEl, minDigits: 2 },
  { el: weightEl, next: headwindEl, minDigits: 4, offshoreOnly: true },
  { el: weightEl, next: runBtn, minDigits: 4, offshoreOnly: false },
  { el: headwindEl, next: runBtn, minDigits: 1 }
];

function digitsOnly(value) {
  return String(value ?? '').replace(/[^0-9]/g, '');
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function interpolateFromPoints(value, points, key = 'kt', out = 'bonus') {
  if (value <= points[0][key]) return points[0][out];
  if (value >= points[points.length - 1][key]) return points[points.length - 1][out];

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    if (value >= a[key] && value <= b[key]) {
      const t = (value - a[key]) / (b[key] - a[key]);
      return lerp(a[out], b[out], t);
    }
  }
  return points[points.length - 1][out];
}

function interpolateByTemperature(oat, table) {
  const temps = phase1OffshoreStandard.temps;
  if (oat <= temps[0]) return table[0];
  if (oat >= temps[temps.length - 1]) return table[table.length - 1];

  for (let i = 0; i < temps.length - 1; i += 1) {
    const t0 = temps[i];
    const t1 = temps[i + 1];
    if (oat >= t0 && oat <= t1) {
      const ratio = (oat - t0) / (t1 - t0);
      return lerp(table[i], table[i + 1], ratio);
    }
  }
  return table[table.length - 1];
}

function canAdvance(rule) {
  if (rule.offshoreOnly === true && procedureEl.value !== 'offshore') return false;
  if (rule.offshoreOnly === false && procedureEl.value === 'offshore') return false;
  const length = digitsOnly(rule.el.value).length;
  if (rule.el === oatEl) return length === rule.minDigits;
  return length >= rule.minDigits;
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
      if (rule.el === oatEl) sanitizeDigitsInput(oatEl, 2);
      if (rule.el === paEl) sanitizeDigitsInput(paEl, 5);
      if (rule.el === weightEl) sanitizeDigitsInput(weightEl, 4);
      if (rule.el === headwindEl) sanitizeDigitsInput(headwindEl, 2);
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

function toggleHeadwind() {
  const offshore = procedureEl.value === 'offshore';
  headwindWrap.classList.toggle('hidden', !offshore);
  headwindEl.disabled = !offshore;
  if (!offshore) headwindEl.value = '';
}

function sanitizeDigitsInput(el, maxLen = null) {
  const digits = digitsOnly(el.value);
  el.value = maxLen ? digits.slice(0, maxLen) : digits;
}

function loadDemo() {
  procedureEl.value = 'offshore';
  configurationEl.value = 'standard';
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

function calculateOffshoreStandardPhase1(pa, oat, headwind) {
  const seaLevel = interpolateByTemperature(oat, phase1OffshoreStandard.seaLevelKg);
  const paPenalty = (Math.max(0, pa) / 1000) * phase1OffshoreStandard.paPenaltyKgPer1000Ft;
  const windBonus = interpolateFromPoints(clamp(headwind, 0, 20), phase1OffshoreStandard.headwindBonusKg);
  const maxWeight = clamp(Math.round((seaLevel - paPenalty + windBonus) / 5) * 5, 5800, 6800);
  return {
    maxWeight,
    model: 'phase1_offshore_standard',
    note: 'Fase 1: Offshore Standard com primeira digitalização manual do chart.'
  };
}

function calculateEnvelope({ procedure, configuration, pa, oat, headwind }) {
  if (procedure === 'offshore' && configuration === 'standard') {
    return calculateOffshoreStandardPhase1(pa, oat, headwind);
  }

  return {
    maxWeight: estimatePlaceholderMaxWeight(pa, oat, procedure, configuration, headwind),
    model: 'placeholder',
    note: 'Procedure/configuration ainda em placeholder. Fase 1 real está ligada apenas ao Offshore Standard.'
  };
}

function formatKg(v) {
  return `${Math.round(v).toLocaleString('pt-BR')} kg`;
}

function setNeutralStatus(title, text) {
  statusCard.className = 'card status neutral';
  statusTitle.textContent = title;
  statusText.textContent = text;
  maxWeightEl.textContent = '—';
  marginEl.textContent = '—';
}

function runCalculation() {
  const procedure = procedureEl.value;
  const configuration = configurationEl.value;
  const pa = Number(paEl.value);
  const oat = Number(oatEl.value);
  const actualWeight = Number(weightEl.value);
  const headwind = Number(headwindEl.value || 0);

  if (!procedure || !configuration || [pa, oat, actualWeight].some(Number.isNaN)) {
    setNeutralStatus('Dados incompletos', 'Selecione procedure, configuration e preencha altitude, OAT e peso atual.');
    drawChart();
    return;
  }

  const calc = calculateEnvelope({ procedure, configuration, pa, oat, headwind });
  const margin = calc.maxWeight - actualWeight;
  const within = margin >= 0;

  statusCard.className = `card status ${within ? 'within' : 'out'}`;
  statusTitle.textContent = within ? 'WITHIN ENVELOPE' : 'OUT OF ENVELOPE';
  statusText.textContent = `${within ? 'Peso atual dentro do envelope calculado.' : 'Peso atual acima do envelope calculado.'} ${calc.note}`;
  maxWeightEl.textContent = formatKg(calc.maxWeight);
  marginEl.textContent = `${margin >= 0 ? '+' : ''}${Math.round(margin).toLocaleString('pt-BR')} kg`;

  drawChart({ procedure, configuration, pa, oat, actualWeight, headwind, maxWeight: calc.maxWeight, within, model: calc.model });
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

  ctx.fillStyle = '#8ea0b7';
  ctx.font = '14px sans-serif';
  ctx.fillText('Gross Weight (kg)', gx + gw / 2 - 54, h - 28);
  ctx.save();
  ctx.translate(24, gy + gh / 2 + 40);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Pressure Altitude (ft)', 0, 0);
  ctx.restore();

  const xMin = 5800, xMax = 6800;
  const yMin = 0, yMax = 5000;
  const toX = (value) => gx + ((value - xMin) / (xMax - xMin)) * gw;
  const toY = (value) => gy + gh - ((value - yMin) / (yMax - yMin)) * gh;

  if (!data) {
    ctx.fillStyle = '#b7c7db';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('Aguardando cálculo', gx + 24, gy + 34);
    return;
  }

  const standardActive = data.procedure === 'offshore' && data.configuration === 'standard';
  if (standardActive) {
    ctx.strokeStyle = '#6fa8dc';
    ctx.lineWidth = 1.6;
    phase1OffshoreStandard.temps.forEach((temp) => {
      const seaLevel = interpolateByTemperature(temp, phase1OffshoreStandard.seaLevelKg);
      const x0 = toX(clamp(seaLevel, xMin, xMax));
      const x1 = toX(clamp(seaLevel - 5 * phase1OffshoreStandard.paPenaltyKgPer1000Ft, xMin, xMax));
      ctx.beginPath();
      ctx.moveTo(x0, toY(0));
      ctx.lineTo(x1, toY(5000));
      ctx.stroke();
      ctx.fillStyle = '#8ea0b7';
      ctx.fillText(`${temp}`, clamp(x1 + 8, gx + 4, gx + gw - 30), clamp(toY(5000) + 16, gy + 18, gy + gh - 8));
    });
  } else {
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
  }

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
  ctx.font = '14px sans-serif';
  ctx.fillText(`PA ${data.pa} ft`, gx + 10, y - 10);
  ctx.fillText(`OAT ${data.oat}°C`, gx + 10, y + 12);
  ctx.fillText(`MAX ${Math.round(data.maxWeight)} kg`, Math.min(maxX + 12, gx + gw - 120), Math.max(y - 12, gy + 18));
  ctx.fillText(`ACT ${Math.round(data.actualWeight)} kg`, Math.min(actualX + 12, gx + gw - 120), gy + 22);
  if (data.procedure === 'offshore') {
    ctx.fillText(`HW ${Math.round(data.headwind)} kt`, gx + gw - 96, gy + gh - 12);
  }
  if (data.model === 'phase1_offshore_standard') {
    ctx.fillText('Fase 1 beta', gx + gw - 92, gy + 22);
  }
}

runBtn.addEventListener('click', runCalculation);
demoBtn.addEventListener('click', loadDemo);
toggleChart.addEventListener('click', () => {
  chartPanel.classList.toggle('hidden');
  toggleChart.textContent = chartPanel.classList.contains('hidden') ? 'Mostrar gráfico' : 'Ocultar gráfico';
  if (!chartPanel.classList.contains('hidden')) drawChart();
});

procedureEl.addEventListener('change', () => { toggleHeadwind(); drawChart(); });
configurationEl.addEventListener('change', () => { drawChart(); });

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

if (hintEl) {
  hintEl.textContent = 'Fase 1: motor beta ligado ao Offshore Standard com primeira digitalização manual do chart. As demais configurações ainda usam placeholder.';
}

toggleHeadwind();
setupAutoAdvance();
drawChart();
