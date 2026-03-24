
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
const exportPdfBtn = document.getElementById('exportPdfBtn');
const chartPanel = document.getElementById('chartPanel');
const chartCanvas = document.getElementById('chartCanvas');
const chartBaseImage = document.getElementById('chartBaseImage');
const chartExportPageImage = new Image();
chartExportPageImage.src = 'docs/page-07.png';
const EXPORT_PAGE_PLACEMENT = { scale: 0.740971986, offsetX: 273.206409, offsetY: 594.946143 };
const ctx = chartCanvas.getContext('2d');
let currentResult = null;
const statusCard = document.getElementById('statusCard');
const statusBadge = statusCard.querySelector('.status-badge');
const statusTitle = document.getElementById('statusTitle');
const statusText = document.getElementById('statusText');
const maxWeightEl = document.getElementById('maxWeight');
const marginEl = document.getElementById('margin');

const OFFSHORE_STANDARD_EXACT = {"image": "assets/offshore_standard_chart_clip.png", "main": {"xMin": 81.379, "xMax": 271.707, "kgMin": 5800, "kgMax": 6800, "yZeroFt": 388.388, "yTopFt": 165.047, "maxPaFt": 5000}, "headwind": {"yTop": 436.584, "yBottom": 488.12, "maxKt": 20}, "tempCurves": {"-40": [[271.707, 433.182], [271.707, 165.047]], "-30": [[271.707, 433.182], [271.707, 182.876], [270.762, 180.671], [270.223, 179.962], [269.681, 179.253], [269.138, 178.546], [268.592, 177.839], [268.045, 177.133], [267.497, 176.428], [266.947, 175.723], [266.397, 175.018], [265.846, 174.314], [265.295, 173.609], [264.744, 172.905], [264.193, 172.2], [263.643, 171.495], [263.093, 170.789], [262.545, 170.083], [261.998, 169.376], [261.452, 168.669], [260.908, 167.96], [260.367, 167.251], [258.603, 165.047]], "-20": [[271.707, 433.182], [271.707, 232.017], [271.329, 229.812], [269.628, 227.544], [267.183, 224.395], [264.741, 221.243], [262.302, 218.087], [259.867, 214.928], [257.435, 211.766], [255.005, 208.601], [252.579, 205.433], [250.156, 202.263], [247.736, 199.09], [245.319, 195.914], [242.906, 192.736], [240.495, 189.557], [238.087, 186.375], [235.682, 183.191], [233.28, 180.006], [230.88, 176.819], [228.484, 173.631], [226.091, 170.442], [223.7, 167.251], [221.999, 165.047]], "-10": [[271.707, 433.182], [271.707, 278.954], [271.329, 276.686], [267.927, 272.275], [263.739, 266.802], [259.558, 261.324], [255.383, 255.841], [251.216, 250.353], [247.055, 244.859], [242.902, 239.359], [238.756, 233.854], [234.619, 228.343], [230.491, 222.825], [226.371, 217.301], [222.26, 211.77], [218.159, 206.232], [214.067, 200.686], [209.986, 195.134], [205.915, 189.573], [201.855, 184.005], [197.806, 178.429], [193.768, 172.844], [189.742, 167.251], [188.167, 165.047]], "0": [[271.707, 433.182], [271.707, 323.622], [270.762, 321.417], [264.724, 313.528], [258.712, 305.628], [252.727, 297.715], [246.767, 289.79], [240.83, 281.854], [234.915, 273.905], [229.022, 265.944], [223.148, 257.971], [217.293, 249.985], [211.456, 241.988], [205.635, 233.978], [199.828, 225.956], [194.036, 217.921], [188.256, 209.875], [182.487, 201.816], [176.728, 193.745], [170.979, 185.661], [165.237, 177.565], [159.501, 169.457], [156.351, 165.047]], "10": [[271.707, 433.182], [271.707, 368.29], [271.139, 366.085], [269.438, 363.817], [267.738, 361.612], [264.391, 357.175], [261.048, 352.735], [257.709, 348.292], [254.375, 343.845], [251.045, 339.396], [247.719, 334.943], [244.399, 330.487], [241.083, 326.027], [237.773, 321.563], [234.468, 317.095], [231.168, 312.623], [227.874, 308.147], [224.586, 303.667], [221.304, 299.182], [218.028, 294.693], [214.758, 290.198], [211.495, 285.699], [208.238, 281.195], [204.988, 276.686], [203.35, 274.481], [201.775, 272.275], [200.137, 270.007], [198.812, 268.123], [197.487, 266.239], [196.16, 264.356], [194.833, 262.474], [193.505, 260.593], [192.176, 258.712], [190.847, 256.832], [189.517, 254.952], [188.187, 253.073], [186.856, 251.194], [185.525, 249.315], [184.194, 247.437], [182.862, 245.558], [181.531, 243.68], [180.199, 241.801], [178.867, 239.923], [177.536, 238.044], [176.204, 236.165], [174.873, 234.285], [173.298, 232.017], [171.723, 229.812], [170.296, 227.816], [168.872, 225.819], [167.448, 223.82], [166.026, 221.821], [164.605, 219.82], [163.184, 217.819], [161.764, 215.817], [160.344, 213.815], [158.925, 211.813], [157.506, 209.811], [156.086, 207.809], [154.666, 205.807], [153.245, 203.806], [151.823, 201.806], [150.401, 199.806], [148.977, 197.808], [147.551, 195.811], [146.124, 193.816], [144.695, 191.822], [142.805, 189.617], [140.978, 187.349], [139.151, 185.144]], "20": [[271.707, 433.182], [271.707, 410.753], [270.825, 408.485], [269.124, 406.28], [265.788, 401.851], [262.457, 397.417], [259.133, 392.979], [255.814, 388.537], [252.502, 384.09], [249.194, 379.639], [245.893, 375.184], [242.597, 370.724], [239.307, 366.261], [236.022, 361.794], [232.742, 357.322], [229.468, 352.847], [226.198, 348.368], [222.934, 343.885], [219.676, 339.399], [216.422, 334.909], [213.173, 330.415], [209.928, 325.918], [206.689, 321.417], [205.114, 319.149], [203.539, 316.944], [201.964, 314.676], [200.633, 312.796], [199.302, 310.915], [197.971, 309.033], [196.64, 307.152], [195.309, 305.27], [193.978, 303.388], [192.647, 301.506], [191.315, 299.624], [189.983, 297.743], [188.651, 295.861], [187.319, 293.98], [185.986, 292.099], [184.652, 290.219], [183.318, 288.34], [181.983, 286.461], [180.648, 284.583], [179.312, 282.706], [177.975, 280.829], [176.637, 278.954], [175.062, 276.686], [171.912, 272.275], [170.455, 270.248], [169.007, 268.215], [167.566, 266.177], [166.128, 264.136], [164.693, 262.093], [163.257, 260.05], [161.819, 258.01], [160.377, 255.973], [158.927, 253.941], [157.468, 251.916], [155.998, 249.9], [154.514, 247.894], [153.015, 245.9], [151.497, 243.92], [149.959, 241.956], [148.399, 240.008], [146.814, 238.079], [145.202, 236.171], [143.561, 234.285], [141.734, 232.017], [139.907, 229.812], [138.08, 227.544]], "30": [[258.036, 433.182], [257.972, 433.119], [256.335, 430.851], [253.392, 426.884], [250.455, 422.914], [247.525, 418.942], [244.601, 414.965], [241.684, 410.986], [238.772, 407.003], [235.866, 403.016], [232.966, 399.026], [230.072, 395.032], [227.182, 391.035], [224.298, 387.033], [221.42, 383.028], [218.546, 379.018], [215.676, 375.004], [212.812, 370.987], [209.952, 366.964], [207.096, 362.938], [204.245, 358.907], [201.397, 354.871], [199.759, 352.666], [198.184, 350.461], [196.609, 348.193], [195.343, 346.431], [194.078, 344.668], [192.814, 342.905], [191.55, 341.141], [190.287, 339.377], [189.024, 337.613], [187.762, 335.848], [186.499, 334.083], [185.237, 332.318], [183.975, 330.553], [182.713, 328.788], [181.451, 327.023], [180.188, 325.258], [178.926, 323.494], [177.663, 321.729], [176.399, 319.965], [175.135, 318.202], [173.871, 316.439], [172.606, 314.676], [171.031, 312.471], [169.392, 310.203], [167.82, 308.329], [166.249, 306.454], [164.681, 304.577], [163.113, 302.699], [161.547, 300.819], [159.982, 298.939], [158.418, 297.058], [156.855, 295.176], [155.292, 293.293], [153.729, 291.411], [152.167, 289.528], [150.605, 287.645], [149.042, 285.763], [147.479, 283.881], [145.916, 281.999], [144.352, 280.118], [142.788, 278.238], [141.222, 276.359], [139.655, 274.481], [137.829, 272.275], [136.001, 270.007], [134.174, 267.802]], "40": [[228.677, 433.182], [228.613, 433.119], [226.976, 430.851], [225.401, 428.646], [224.553, 427.468], [223.706, 426.29], [222.858, 425.112], [222.01, 423.934], [221.162, 422.756], [220.314, 421.578], [219.466, 420.4], [218.618, 419.222], [217.77, 418.044], [216.921, 416.867], [216.072, 415.689], [215.224, 414.512], [214.374, 413.335], [213.525, 412.159], [212.675, 410.982], [211.825, 409.806], [210.974, 408.63], [210.123, 407.455], [209.272, 406.28], [207.697, 404.075], [206.059, 401.807], [205.122, 400.516], [204.186, 399.223], [203.251, 397.93], [202.316, 396.637], [201.383, 395.342], [200.45, 394.048], [199.517, 392.753], [198.584, 391.458], [197.652, 390.163], [196.719, 388.868], [195.786, 387.573], [194.853, 386.279], [193.919, 384.985], [192.984, 383.691], [192.048, 382.398], [191.111, 381.106], [190.173, 379.815], [189.234, 378.525], [188.293, 377.236], [186.403, 375.031], [184.513, 372.763], [182.686, 370.558], [180.133, 367.511], [177.582, 364.463], [175.034, 361.412], [172.488, 358.36], [169.943, 355.307], [167.4, 352.252], [164.859, 349.196], [162.319, 346.139], [159.781, 343.08], [157.243, 340.021], [154.706, 336.961], [152.171, 333.901], [149.635, 330.84], [147.1, 327.779], [144.566, 324.717], [142.031, 321.655], [139.496, 318.594], [136.961, 315.532], [134.426, 312.471], [132.599, 310.203], [130.772, 307.997]], "50": [[194.845, 433.182], [194.782, 433.119], [192.901, 430.887], [191.019, 428.656], [189.136, 426.426], [187.253, 424.197], [185.37, 421.967], [183.486, 419.738], [181.603, 417.509], [179.721, 415.279], [177.839, 413.049], [175.959, 410.817], [174.08, 408.585], [172.202, 406.351], [170.326, 404.116], [168.452, 401.879], [166.581, 399.639], [164.712, 397.397], [162.846, 395.153], [160.983, 392.906], [159.123, 390.656], [157.296, 388.388]]}, "headwindCurves": {"5800": [[81.379, 437.089], [82.198, 439.105], [84.34, 441.688], [87.49, 444.271], [89.369, 445.469], [91.312, 446.604], [93.312, 447.681], [95.364, 448.701], [97.462, 449.67], [99.6, 450.591], [101.772, 451.466], [103.972, 452.3], [106.195, 453.097], [108.435, 453.859], [110.686, 454.591], [112.941, 455.296], [115.196, 455.977], [117.444, 456.638], [119.679, 457.283], [121.897, 457.915], [124.089, 458.538], [126.252, 459.155], [128.379, 459.77], [138.207, 462.353], [148.539, 464.873], [152.774, 465.885], [157.015, 466.885], [161.262, 467.873], [165.514, 468.849], [169.771, 469.816], [174.032, 470.775], [178.296, 471.726], [182.563, 472.67], [186.832, 473.61], [191.102, 474.545], [195.373, 475.477], [199.645, 476.407], [203.915, 477.336], [208.185, 478.265], [212.453, 479.196], [216.719, 480.129], [220.981, 481.066], [225.24, 482.007], [229.495, 482.954], [240.08, 485.537], [249.153, 488.12]], "6000": [[119.432, 436.584], [120.251, 439.104], [122.456, 441.687], [126.11, 444.27], [131.213, 446.853], [133.291, 447.738], [135.393, 448.59], [137.519, 449.411], [139.665, 450.203], [141.83, 450.968], [144.01, 451.706], [146.205, 452.421], [148.411, 453.114], [150.626, 453.786], [152.849, 454.44], [155.076, 455.076], [157.305, 455.698], [159.535, 456.305], [161.764, 456.902], [163.987, 457.488], [166.205, 458.066], [168.413, 458.638], [170.611, 459.205], [172.795, 459.769], [183.316, 462.352], [194.341, 464.872], [197.318, 465.525], [200.291, 466.19], [203.259, 466.868], [206.225, 467.554], [209.188, 468.249], [212.148, 468.95], [215.108, 469.654], [218.066, 470.362], [221.025, 471.069], [223.983, 471.776], [226.943, 472.48], [229.904, 473.178], [232.867, 473.871], [235.834, 474.555], [238.803, 475.229], [241.777, 475.891], [244.755, 476.539], [247.739, 477.172], [250.728, 477.787], [260.682, 480.37], [269.691, 482.953], [271.707, 485.536], [271.707, 488.12]], "6200": [[157.485, 436.584], [158.871, 439.104], [161.832, 441.687], [166.179, 444.27], [171.975, 446.853], [178.969, 449.436], [187.033, 452.019], [195.979, 454.603], [205.807, 457.186], [216.392, 459.769], [227.606, 462.352], [237.56, 464.872], [247.704, 467.455], [258.539, 470.038], [270.132, 472.621], [271.707, 475.204], [271.707, 488.12]], "6400": [[195.538, 436.584], [197.869, 439.104], [201.649, 441.687], [204.433, 443.117], [207.255, 444.45], [210.11, 445.693], [212.997, 446.854], [215.911, 447.941], [218.849, 448.961], [221.81, 449.924], [224.789, 450.835], [227.784, 451.704], [230.791, 452.538], [233.807, 453.345], [236.83, 454.133], [239.856, 454.909], [242.883, 455.682], [245.906, 456.459], [248.924, 457.249], [251.932, 458.058], [254.929, 458.896], [257.91, 459.769], [267.486, 462.352], [271.707, 464.872], [271.707, 488.12]], "6600": [[233.465, 436.584], [236.678, 439.104], [241.277, 441.687], [247.136, 444.27], [254.193, 446.853], [262.446, 449.436], [271.139, 452.019], [271.707, 454.603], [271.707, 488.12]], "6800": [[271.518, 436.584], [271.707, 439.104], [271.707, 488.12]]}, "limits": {"maxOat": [[157.296, 388.388], [155.847, 386.183], [154.461, 383.915], [153.075, 381.71], [151.626, 379.505], [150.24, 377.237], [148.854, 375.032], [147.468, 372.764], [146.019, 370.559], [144.633, 368.291], [143.246, 366.086], [141.861, 363.817], [140.537, 361.612], [139.025, 359.344], [137.45, 357.139], [135.938, 354.871], [134.489, 352.666], [133.104, 350.461], [131.591, 348.193], [130.016, 345.988], [128.378, 343.72], [126.74, 341.515], [125.165, 339.247], [123.59, 337.042]], "hdLimit": [[140.096, 165.047], [140.096, 168.89], [140.033, 173.174], [139.97, 177.458], [139.908, 181.679], [139.782, 185.901], [139.718, 190.122], [139.592, 194.343], [139.466, 198.564], [139.341, 202.722], [139.214, 206.943], [139.088, 211.101], [138.9, 215.259], [138.647, 219.354], [138.395, 223.513], [138.143, 227.608], [137.829, 231.766], [137.45, 235.861], [137.136, 239.893], [136.758, 243.988], [136.379, 248.083], [136.001, 252.115], [135.623, 256.147], [135.245, 260.18], [134.867, 264.212], [134.489, 268.181], [134.175, 272.213], [133.796, 276.182], [133.481, 280.151], [133.104, 284.12], [132.725, 288.089], [132.347, 292.058], [131.906, 295.965], [131.528, 299.871], [131.024, 303.777], [130.583, 307.683], [130.016, 311.589], [129.449, 315.495], [128.882, 319.338], [128.189, 323.244], [127.496, 327.087], [126.74, 330.931], [125.228, 334.774], [123.59, 338.554]]}};

const autoAdvanceRules = [
  { el: paEl, next: oatEl, minDigits: 3 },
  { el: oatEl, next: weightEl, minDigits: 2 },
  { el: weightEl, next: headwindEl, minDigits: 4, offshoreOnly: true },
  { el: weightEl, next: runBtn, minDigits: 4, offshoreOnly: false },
  { el: headwindEl, next: runBtn, minDigits: 1 }
];

function digitsOnly(value) {
  return String(value ?? '').replace(/[^0-9-]/g, '');
}

function sanitizeDigitsInput(el, maxLen = null) {
  const isNegativeAllowed = el === oatEl;
  let raw = String(el.value ?? '');
  let negative = '';
  if (isNegativeAllowed && raw.startsWith('-')) negative = '-';
  const digits = raw.replace(/[^0-9]/g, '');
  el.value = negative + (maxLen ? digits.slice(0, maxLen) : digits);
}

function canAdvance(rule) {
  if (rule.offshoreOnly === true && procedureEl.value !== 'offshore') return false;
  if (rule.offshoreOnly === false && procedureEl.value === 'offshore') return false;
  const raw = String(rule.el.value ?? '');
  const digits = raw.replace(/[^0-9]/g, '');
  if (rule.el === oatEl) return digits.length === rule.minDigits;
  return digits.length >= rule.minDigits;
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

function loadDemo() {
  procedureEl.value = 'offshore';
  configurationEl.value = 'standard';
  paEl.value = '100';
  oatEl.value = '30';
  weightEl.value = '6600';
  headwindEl.value = '0';
  toggleHeadwind();
  runCalculation();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function interp1(x, xp, fp) {
  if (xp.length !== fp.length || xp.length === 0) return NaN;
  if (x <= xp[0]) return fp[0];
  if (x >= xp[xp.length - 1]) return fp[fp.length - 1];
  for (let i = 0; i < xp.length - 1; i++) {
    if (x >= xp[i] && x <= xp[i + 1]) {
      const t = (x - xp[i]) / (xp[i + 1] - xp[i]);
      return fp[i] + t * (fp[i + 1] - fp[i]);
    }
  }
  return fp[fp.length - 1];
}

function formatKg(v) {
  return `${Math.round(v).toLocaleString('pt-BR')} kg`;
}

function toPoints(rawPoints) {
  return rawPoints.map(([x, y]) => ({ x, y }));
}

function xToKg(x) {
  const m = OFFSHORE_STANDARD_EXACT.main;
  return m.kgMin + ((x - m.xMin) / (m.xMax - m.xMin)) * (m.kgMax - m.kgMin);
}

function kgToX(kg) {
  const m = OFFSHORE_STANDARD_EXACT.main;
  return m.xMin + ((kg - m.kgMin) / (m.kgMax - m.kgMin)) * (m.xMax - m.xMin);
}

function paToY(paFt) {
  const m = OFFSHORE_STANDARD_EXACT.main;
  const pa = clamp(paFt, 0, m.maxPaFt);
  return m.yZeroFt - (pa / m.maxPaFt) * (m.yZeroFt - m.yTopFt);
}

function hwToY(hwKt) {
  const hw = OFFSHORE_STANDARD_EXACT.headwind;
  const kt = clamp(hwKt, 0, hw.maxKt);
  return hw.yTop + (kt / hw.maxKt) * (hw.yBottom - hw.yTop);
}

function xAtY(points, y) {
  const intersections = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const yMin = Math.min(p1.y, p2.y);
    const yMax = Math.max(p1.y, p2.y);
    if (Math.abs(y - p1.y) < 0.001) intersections.push(p1.x);
    if (Math.abs(y - p2.y) < 0.001) intersections.push(p2.x);
    if (y >= yMin - 0.001 && y <= yMax + 0.001 && Math.abs(p2.y - p1.y) > 0.0001) {
      const t = (y - p1.y) / (p2.y - p1.y);
      if (t >= -0.001 && t <= 1.001) {
        intersections.push(p1.x + t * (p2.x - p1.x));
      }
    }
  }
  if (!intersections.length) return NaN;
  return Math.max(...intersections);
}

function getSortedTemps() {
  return Object.keys(OFFSHORE_STANDARD_EXACT.tempCurves).map(Number).sort((a, b) => a - b);
}

function getCurveForTemp(temp) {
  return toPoints(OFFSHORE_STANDARD_EXACT.tempCurves[String(temp)]);
}

function getNoWindLimit(paFt, oat) {
  const temps = getSortedTemps();
  const paY = paToY(paFt);

  if (oat < temps[0] || oat > temps[temps.length - 1]) {
    return { error: 'OAT fora da faixa do chart Offshore Standard (-40°C a 50°C).' };
  }

  let lower = temps[0];
  let upper = temps[temps.length - 1];
  for (const t of temps) {
    if (t <= oat) lower = t;
    if (t >= oat) {
      upper = t;
      break;
    }
  }

  const lowerCurve = getCurveForTemp(lower);
  const upperCurve = getCurveForTemp(upper);
  const lowerX = xAtY(lowerCurve, paY);
  const upperX = xAtY(upperCurve, paY);

  if (Number.isNaN(lowerX) || Number.isNaN(upperX)) {
    return { error: 'O ponto de altitude/OAT saiu da família explícita de curvas do chart Standard.' };
  }

  let interpolatedX = lowerX;
  if (lower !== upper) {
    const t = (oat - lower) / (upper - lower);
    interpolatedX = lowerX + t * (upperX - lowerX);
  }

  return {
    paY,
    lowerTemp: lower,
    upperTemp: upper,
    lowerCurve,
    upperCurve,
    lowerX,
    upperX,
    noWindX: interpolatedX,
    noWindKg: xToKg(interpolatedX)
  };
}

function getHeadwindAdjustedLimit(baseKg, headwindKt) {
  const hw = clamp(headwindKt, 0, OFFSHORE_STANDARD_EXACT.headwind.maxKt);
  const familyBases = Object.keys(OFFSHORE_STANDARD_EXACT.headwindCurves).map(Number).sort((a, b) => a - b);
  const targetY = hwToY(hw);
  const familyValues = familyBases.map((base) => {
    const curve = toPoints(OFFSHORE_STANDARD_EXACT.headwindCurves[String(base)]);
    const x = xAtY(curve, targetY);
    return xToKg(x);
  });
  return {
    hwY: targetY,
    familyBases,
    familyValues,
    maxKg: interp1(clamp(baseKg, familyBases[0], familyBases[familyBases.length - 1]), familyBases, familyValues)
  };
}

function roundToFive(value) {
  return Math.round(value / 5) * 5;
}

function calculateExactOffshoreStandard(paFt, oat, actualWeightKg, headwindKt) {
  const noWind = getNoWindLimit(paFt, oat);
  if (noWind.error) return noWind;

  const hw = getHeadwindAdjustedLimit(noWind.noWindKg, headwindKt);
  const maxWeight = roundToFive(Math.min(6800, hw.maxKg));
  const margin = maxWeight - actualWeightKg;
  return {
    mode: 'offshore-standard-exact',
    exact: true,
    noWind,
    hw,
    maxWeight,
    margin,
    within: margin >= 0,
    actualWeightKg,
    paFt,
    oat,
    headwindKt
  };
}

function setCanvasSizeToImage() {
  const rect = chartBaseImage.getBoundingClientRect();
  const displayWidth = Math.max(1, Math.round(rect.width || chartBaseImage.naturalWidth || 900));
  const displayHeight = Math.max(1, Math.round(rect.height || (displayWidth * (chartBaseImage.naturalHeight || 1137) / (chartBaseImage.naturalWidth || 900))));
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  chartCanvas.width = Math.round(displayWidth * dpr);
  chartCanvas.height = Math.round(displayHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawBackgroundImage() {
  return !!(chartBaseImage.complete && chartBaseImage.naturalWidth);
}

function ensureCanvasReady() {
  if (!drawBackgroundImage()) return false;
  setCanvasSizeToImage();
  return true;
}

function mapPdfToCanvasX(x) {
  const clip = { x0: 35, y0: 145, x1: 320, y1: 505 };
  return ((x - clip.x0) / (clip.x1 - clip.x0)) * chartCanvas.getBoundingClientRect().width;
}
function mapPdfToCanvasY(y) {
  const clip = { x0: 35, y0: 145, x1: 320, y1: 505 };
  return ((y - clip.y0) / (clip.y1 - clip.y0)) * chartCanvas.getBoundingClientRect().height;
}

function drawPdfPolyline(points, color, width = 2, dashed = false) {
  if (!points?.length) return;
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(dashed ? [10, 8] : []);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  points.forEach((point, index) => {
    const x = mapPdfToCanvasX(point.x);
    const y = mapPdfToCanvasY(point.y);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.restore();
}

function drawMarker(xPdf, yPdf, color, radius = 7) {
  const x = mapPdfToCanvasX(xPdf);
  const y = mapPdfToCanvasY(yPdf);
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#081019';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawOverlay(result) {
  if (!ensureCanvasReady()) return;
  const rect = chartCanvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  const hasImage = drawBackgroundImage();

  if (!result || result.error) {
    if (!hasImage) {
      ctx.fillStyle = '#0b1017';
      ctx.fillRect(0, 0, rect.width, rect.height);
    }
    ctx.fillStyle = '#e8eef7';
    ctx.font = '700 28px Inter, system-ui, sans-serif';
    ctx.fillText('Offshore Standard - overlay PDF', 32, 48);
    ctx.fillStyle = '#8ea0b7';
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillText('O cálculo exato aparece aqui quando você rodar o chart Standard.', 32, 84);
    return;
  }

  const withinColor = result.within ? '#14b86a' : '#df4f5f';
  const blue = '#52a8ff';
  const amber = '#f3b447';

  // reference overlays
  drawPdfPolyline(toPoints(OFFSHORE_STANDARD_EXACT.limits.maxOat), '#5b6bd4', 2, true);
  drawPdfPolyline(toPoints(OFFSHORE_STANDARD_EXACT.limits.hdLimit), '#5b6bd4', 2, true);

  // highlight bracketing temperature curves
  drawPdfPolyline(result.noWind.lowerCurve, amber, 3);
  if (result.noWind.upperTemp !== result.noWind.lowerTemp) {
    drawPdfPolyline(result.noWind.upperCurve, amber, 3);
  }

  const paY = result.noWind.paY;
  const noWindX = result.noWind.noWindX;
  const actualX = kgToX(result.actualWeightKg);
  const maxX = kgToX(result.maxWeight);
  const hwY = result.hw.hwY;

  // altitude line on main chart
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(mapPdfToCanvasX(81.379), mapPdfToCanvasY(paY));
  ctx.lineTo(mapPdfToCanvasX(271.707), mapPdfToCanvasY(paY));
  ctx.stroke();

  // actual weight vertical
  ctx.setLineDash([]);
  ctx.strokeStyle = blue;
  ctx.beginPath();
  ctx.moveTo(mapPdfToCanvasX(actualX), mapPdfToCanvasY(388.388));
  ctx.lineTo(mapPdfToCanvasX(actualX), mapPdfToCanvasY(488.12));
  ctx.stroke();

  // max weight vertical
  ctx.strokeStyle = withinColor;
  ctx.beginPath();
  ctx.moveTo(mapPdfToCanvasX(maxX), mapPdfToCanvasY(388.388));
  ctx.lineTo(mapPdfToCanvasX(maxX), mapPdfToCanvasY(488.12));
  ctx.stroke();

  // headwind line
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(mapPdfToCanvasX(81.379), mapPdfToCanvasY(hwY));
  ctx.lineTo(mapPdfToCanvasX(271.707), mapPdfToCanvasY(hwY));
  ctx.stroke();
  ctx.restore();

  drawMarker(noWindX, paY, '#ffffff', 7);
  drawMarker(actualX, paY, blue, 6);
  drawMarker(maxX, hwY, withinColor, 7);

  // top callout
  ctx.save();
  ctx.fillStyle = 'rgba(11,15,20,0.82)';
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRect(ctx, 18, 18, rect.width - 36, 96, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e8eef7';
  ctx.font = '700 24px Inter, system-ui, sans-serif';
  ctx.fillText(`Offshore Standard - extração vetorial do PDF`, 32, 50);
  ctx.font = '18px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#c9d6e8';
  ctx.fillText(`PA ${
    Math.round(result.paFt)
  } ft | OAT ${
    result.oat
  }°C | HW ${
    Math.round(result.headwindKt)
  } kt`, 32, 80);
  ctx.fillText(`No wind ${
    Math.round(result.noWind.noWindKg)
  } kg -> Final ${
    Math.round(result.maxWeight)
  } kg`, 32, 104);
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}


function drawLegendRow(targetCtx, startX, startY, items) {
  targetCtx.save();
  targetCtx.font = '20px Inter, system-ui, sans-serif';
  targetCtx.textBaseline = 'middle';
  let x = startX;
  items.forEach((item) => {
    targetCtx.fillStyle = item.color;
    targetCtx.beginPath();
    targetCtx.arc(x + 9, startY, 9, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.fillStyle = '#c9d6e8';
    targetCtx.fillText(item.label, x + 28, startY + 1);
    x += 28 + targetCtx.measureText(item.label).width + 38;
  });
  targetCtx.restore();
}

function renderCompositeCanvas(result = currentResult) {
  if (!chartBaseImage.complete || !chartBaseImage.naturalWidth) return null;

  const pageImageReady = chartExportPageImage.complete && chartExportPageImage.naturalWidth;
  const useFullPage = pageImageReady;
  const baseWidth = useFullPage ? chartExportPageImage.naturalWidth : chartBaseImage.naturalWidth;
  const baseHeight = useFullPage ? chartExportPageImage.naturalHeight : chartBaseImage.naturalHeight;

  const exportCanvas = document.createElement('canvas');
  const footerExtra = useFullPage ? 190 : 0;
  exportCanvas.width = baseWidth;
  exportCanvas.height = baseHeight + footerExtra;
  const ex = exportCanvas.getContext('2d');
  ex.fillStyle = '#ffffff';
  ex.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  if (useFullPage) {
    ex.drawImage(chartExportPageImage, 0, 0);
  } else {
    ex.drawImage(chartBaseImage, 0, 0);
  }

  if (useFullPage && footerExtra > 0) {
    ex.fillStyle = '#ffffff';
    ex.fillRect(0, baseHeight, baseWidth, footerExtra);
  }

  const clipPlacement = useFullPage
    ? {
        x: EXPORT_PAGE_PLACEMENT.offsetX,
        y: EXPORT_PAGE_PLACEMENT.offsetY,
        width: chartBaseImage.naturalWidth * EXPORT_PAGE_PLACEMENT.scale,
        height: chartBaseImage.naturalHeight * EXPORT_PAGE_PLACEMENT.scale
      }
    : { x: 0, y: 0, width: chartBaseImage.naturalWidth, height: chartBaseImage.naturalHeight };

  const pxX = (x) => clipPlacement.x + ((x - 35) / (320 - 35)) * clipPlacement.width;
  const pxY = (y) => clipPlacement.y + ((y - 145) / (505 - 145)) * clipPlacement.height;

  const drawPolyline = (points, color, lineWidth = 2, dashed = false) => {
    if (!points?.length) return;
    ex.save();
    ex.beginPath();
    ex.setLineDash(dashed ? [10, 8] : []);
    ex.strokeStyle = color;
    ex.lineWidth = lineWidth;
    points.forEach((point, index) => {
      const x = pxX(point.x);
      const y = pxY(point.y);
      if (index === 0) ex.moveTo(x, y);
      else ex.lineTo(x, y);
    });
    ex.stroke();
    ex.restore();
  };

  const marker = (xPdf, yPdf, color, radius = 7) => {
    const x = pxX(xPdf);
    const y = pxY(yPdf);
    ex.save();
    ex.fillStyle = color;
    ex.strokeStyle = '#081019';
    ex.lineWidth = 2;
    ex.beginPath();
    ex.arc(x, y, radius, 0, Math.PI * 2);
    ex.fill();
    ex.stroke();
    ex.restore();
  };

  if (result && !result.error) {
    const withinColor = result.within ? '#14b86a' : '#df4f5f';
    const blue = '#52a8ff';
    const amber = '#f3b447';
    drawPolyline(toPoints(OFFSHORE_STANDARD_EXACT.limits.maxOat), '#5b6bd4', 2, true);
    drawPolyline(toPoints(OFFSHORE_STANDARD_EXACT.limits.hdLimit), '#5b6bd4', 2, true);
    drawPolyline(result.noWind.lowerCurve, amber, 3);
    if (result.noWind.upperTemp !== result.noWind.lowerTemp) drawPolyline(result.noWind.upperCurve, amber, 3);

    const paY = result.noWind.paY;
    const noWindX = result.noWind.noWindX;
    const actualX = kgToX(result.actualWeightKg);
    const maxX = kgToX(result.maxWeight);
    const hwY = result.hw.hwY;

    ex.save();
    ex.strokeStyle = '#ffffff';
    ex.lineWidth = 2.5;
    ex.setLineDash([12, 10]);
    ex.beginPath();
    ex.moveTo(pxX(81.379), pxY(paY));
    ex.lineTo(pxX(271.707), pxY(paY));
    ex.stroke();

    ex.setLineDash([]);
    ex.strokeStyle = blue;
    ex.beginPath();
    ex.moveTo(pxX(actualX), pxY(388.388));
    ex.lineTo(pxX(actualX), pxY(488.12));
    ex.stroke();

    ex.strokeStyle = withinColor;
    ex.beginPath();
    ex.moveTo(pxX(maxX), pxY(388.388));
    ex.lineTo(pxX(maxX), pxY(488.12));
    ex.stroke();

    ex.setLineDash([10, 8]);
    ex.strokeStyle = '#ffffff';
    ex.beginPath();
    ex.moveTo(pxX(81.379), pxY(hwY));
    ex.lineTo(pxX(271.707), pxY(hwY));
    ex.stroke();
    ex.restore();

    const dotRadius = useFullPage ? 5.5 : 7;
    marker(noWindX, paY, '#ffffff', dotRadius + 1);
    marker(actualX, paY, blue, dotRadius);
    marker(maxX, hwY, withinColor, dotRadius + 1);

    const boxX = 56;
    const boxY = 56;
    const boxW = useFullPage ? 940 : baseWidth - 36;
    const boxH = useFullPage ? 168 : 96;
    ex.save();
    ex.fillStyle = 'rgba(255,255,255,0.88)';
    ex.strokeStyle = 'rgba(8,16,25,0.16)';
    ex.lineWidth = 1;
    ex.beginPath();
    roundRect(ex, boxX, boxY, boxW, boxH, 18);
    ex.fill();
    ex.stroke();
    ex.fillStyle = '#081019';
    ex.font = useFullPage ? '700 28px Inter, system-ui, sans-serif' : '700 24px Inter, system-ui, sans-serif';
    ex.fillText('WAC 6800 - interpolação documentada sobre a página do RFM', boxX + 22, boxY + 40);
    ex.font = useFullPage ? '20px Inter, system-ui, sans-serif' : '18px Inter, system-ui, sans-serif';
    ex.fillStyle = '#223247';
    ex.fillText(`Procedure: Offshore Helideck | Configuration: Standard`, boxX + 22, boxY + 76);
    ex.fillText(`PA ${Math.round(result.paFt)} ft | OAT ${result.oat}°C | WT ${Math.round(result.actualWeightKg)} kg | HW ${Math.round(result.headwindKt)} kt`, boxX + 22, boxY + 106);
    ex.fillText(`No wind ${Math.round(result.noWind.noWindKg)} kg | Final ${Math.round(result.maxWeight)} kg | Margin ${result.margin >= 0 ? '+' : ''}${Math.round(result.margin)} kg`, boxX + 22, boxY + 136);
    ex.restore();

    const legendY = useFullPage ? baseHeight + 36 : baseHeight - 100;
    drawLegendRow(ex, 80, legendY, [
      { color: '#ffffff', label: 'Max weight interpolado' },
      { color: '#52a8ff', label: 'Peso atual' },
      { color: '#14b86a', label: 'Dentro' },
      { color: '#df4f5f', label: 'Fora' }
    ]);

    ex.save();
    ex.fillStyle = '#223247';
    ex.font = '18px Inter, system-ui, sans-serif';
    ex.fillText('Fonte: Leonardo AW139 Rotorcraft Flight Manual (RFM), Issue 2, Rev. 32.', 80, legendY + 50);
    ex.fillText('Figure 4-7 — Weight Limitations for CAT A Offshore Helideck Procedure.', 80, legendY + 78);
    ex.fillText('Sempre consulte as publicações oficiais e atualizadas. Esta ferramenta não as substitui.', 80, legendY + 106);
    ex.restore();
  }

  return exportCanvas;
}

function downloadPdfFromCanvas(canvas, filename) {
  const jpegData = canvas.toDataURL('image/jpeg', 0.92);
  const base64 = jpegData.split(',')[1];
  const imageBytes = atob(base64);
  const imgLen = imageBytes.length;
  const pageWidth = 595.28;
  const pageHeight = pageWidth * canvas.height / canvas.width;

  const pdfParts = [];
  const offsets = [];
  const push = (s) => pdfParts.push(typeof s === 'string' ? s : s);
  const offset = () => pdfParts.reduce((n, part) => n + (typeof part === 'string' ? new TextEncoder().encode(part).length : part.length), 0);
  const bin = Uint8Array.from(imageBytes, c => c.charCodeAt(0));

  push(`%PDF-1.4\n`);
  offsets.push(offset()); push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  offsets.push(offset()); push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`);
  offsets.push(offset()); push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  offsets.push(offset()); push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLen} >>\nstream\n`); push(bin); push(`\nendstream\nendobj\n`);
  const content = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;
  offsets.push(offset()); push(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
  const xrefStart = offset();
  push(`xref\n0 6\n0000000000 65535 f \n`);
  for (const off of offsets) push(`${String(off).padStart(10,'0')} 00000 n \n`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  const blob = new Blob(pdfParts, { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportInterpolatedPdf() {
  const procedure = procedureEl.value;
  const configuration = configurationEl.value;
  if (!(procedure === 'offshore' && configuration === 'standard') || !currentResult || currentResult.error) {
    alert('Rode primeiro um cálculo válido em Offshore Helideck + Standard para exportar o PDF interpolado.');
    return;
  }
  const canvas = renderCompositeCanvas(currentResult);
  if (!canvas) {
    alert('O gráfico ainda não carregou. Abra a visualização do gráfico e tente novamente.');
    return;
  }
  const filename = `wac6800_offshore_standard_fullpage_PA${Math.round(currentResult.paFt)}_OAT${currentResult.oat}_WT${Math.round(currentResult.actualWeightKg)}_HW${Math.round(currentResult.headwindKt)}.pdf`;
  downloadPdfFromCanvas(canvas, filename);
}
function runCalculation() {
  const procedure = procedureEl.value;
  const configuration = configurationEl.value;
  const pa = Number(paEl.value);
  const oat = Number(oatEl.value);
  const actualWeight = Number(weightEl.value);
  const headwind = Number(headwindEl.value || 0);

  if (!procedure || !configuration || [pa, oat, actualWeight].some(Number.isNaN)) {
    statusCard.className = 'card status neutral';
    statusBadge.textContent = 'AGUARDANDO DADOS';
    statusTitle.textContent = 'Envelope check';
    statusText.textContent = 'Selecione procedure, configuration e preencha altitude, OAT e peso atual.';
    maxWeightEl.textContent = '—';
    marginEl.textContent = '—';
    currentResult = null;
    currentResult = null;
    drawOverlay();
    return;
  }

  if (!(procedure === 'offshore' && configuration === 'standard')) {
    statusCard.className = 'card status neutral';
    statusBadge.textContent = 'STANDARD RESTAURADO';
    statusTitle.textContent = 'Modo ainda não calibrado';
    statusText.textContent = 'Nesta etapa, Offshore Helideck + Standard permanece restaurado e validado. EAPS ON e os demais perfis ficam bloqueados até nova calibração exata.';
    maxWeightEl.textContent = '—';
    marginEl.textContent = '—';
    currentResult = null;
    drawOverlay();
    return;
  }

  const result = calculateExactOffshoreStandard(pa, oat, actualWeight, headwind);
  if (result.error) {
    statusCard.className = 'card status neutral';
    statusBadge.textContent = 'PONTO FORA DA FAIXA';
    statusTitle.textContent = 'Validação manual necessária';
    statusText.textContent = result.error;
    maxWeightEl.textContent = '—';
    marginEl.textContent = '—';
    currentResult = result;
    drawOverlay(result);
    return;
  }

  statusCard.className = `card status ${result.within ? 'within' : 'out'}`;
  statusBadge.textContent = result.exact ? 'EXATO PDF STANDARD' : 'STANDARD';
  statusTitle.textContent = result.within ? 'WITHIN ENVELOPE' : 'OUT OF ENVELOPE';
  statusText.textContent = result.within
    ? 'Resultado calculado com base nas curvas vetoriais do PDF do Offshore Standard.'
    : 'Resultado calculado com base nas curvas vetoriais do PDF do Offshore Standard.';
  maxWeightEl.textContent = formatKg(result.maxWeight);
  marginEl.textContent = `${result.margin >= 0 ? '+' : ''}${Math.round(result.margin).toLocaleString('pt-BR')} kg`;
  currentResult = result;
  drawOverlay(result);
}


toggleChart.addEventListener('click', () => {
  chartPanel.classList.toggle('hidden');
  toggleChart.textContent = chartPanel.classList.contains('hidden') ? 'Mostrar gráfico' : 'Ocultar gráfico';
  if (!chartPanel.classList.contains('hidden')) drawOverlay();
});

exportPdfBtn.addEventListener('click', exportInterpolatedPdf);
demoBtn.addEventListener('click', loadDemo);
runBtn.addEventListener('click', runCalculation);
procedureEl.addEventListener('change', () => {
  toggleHeadwind();
  runCalculation();
});
configurationEl.addEventListener('change', runCalculation);

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

window.addEventListener('appinstalled', () => {
  installBtn.classList.add('hidden');
});

chartBaseImage.addEventListener('load', () => {
  if (!chartPanel.classList.contains('hidden')) drawOverlay(currentResult);
});

window.addEventListener('resize', () => {
  if (!chartPanel.classList.contains('hidden')) drawOverlay(currentResult);
});

setupAutoAdvance();
toggleHeadwind();
drawOverlay();
