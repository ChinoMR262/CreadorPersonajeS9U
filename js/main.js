if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);
window.addEventListener('beforeunload', () => { window.scrollTo(0, 0); });
// =====================================================================
// S9U — HELIOS ENGINE DATA v8 (JavaScript)
// - Audio / UI settings
// - Datos (universos, apariencias, vestimenta, villano, etc.)
// - Estado global (state)
// - Render UI (poblar*) y handlers
// - Chat / estilo de escritura
// - Helios: análisis local + enriquecimiento IA (Gemini) + exportación
// =====================================================================
// ============================================================
// AUDIO ENGINE
// ============================================================
// ============================================================
// AUDIO ENGINE / MOTOR DE AUDIO
// ============================================================
// Maneja la reproducción de efectos sonoros y el contexto de audio.
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let soundEnabled = true;

// Inicializa o recupera el contexto. Si está suspendido por política del navegador, intenta reanudar.
function getACtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => { });
  return audioCtx;
}

// Listener global para desbloquear el audio en la primera interacción del usuario
document.addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

// Reproduce un tono simple
// f: frecuencia, d: duración, t: tipo de onda, v: volumen
function playTone(f, d, t = 'sine', v = .15) {
  if (!soundEnabled) return;
  try {
    const a = getACtx();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = t;
    o.frequency.setValueAtTime(f, a.currentTime);
    g.gain.setValueAtTime(v, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, a.currentTime + d);
    o.connect(g);
    g.connect(a.destination);
    o.start();
    o.stop(a.currentTime + d);
    // Limpiar nodos después de reproducir
    setTimeout(() => { try { o.disconnect(); g.disconnect(); } catch (e) { } }, (d * 1000) + 100);
  } catch (e) {
    console.warn('Error Audio:', e);
  }
}

// Función principal para efectos de sonido
function snd(n) {
  switch (n) {
    case 'sel': playTone(880, .12, 'sine', .18); setTimeout(() => playTone(1100, .1, 'sine', .12), 60); break;
    case 'des': playTone(440, .15, 'sine', .1); break;
    case 'ok': playTone(659, .15, 'sine', .2); setTimeout(() => playTone(784, .15, 'sine', .18), 100); setTimeout(() => playTone(1047, .25, 'sine', .15), 200); break;
    case 'err': playTone(220, .3, 'sawtooth', .12); break;
    case 'helios': playTone(440, .2, 'sine', .15); setTimeout(() => playTone(554, .2, 'sine', .15), 150); setTimeout(() => playTone(659, .3, 'sine', .2), 300); break;
    case 'msg': playTone(1200, .08, 'sine', .1); setTimeout(() => playTone(1400, .06, 'sine', .08), 50); break;
    case 'villain': playTone(110, .22, 'sawtooth', .12); setTimeout(() => playTone(82, .28, 'sawtooth', .11), 90); setTimeout(() => playTone(55, .32, 'triangle', .10), 190); setTimeout(() => playTone(165, .18, 'square', .06), 260); break;
    case 'hero': playTone(523, .12, 'sine', .14); setTimeout(() => playTone(659, .14, 'sine', .16), 90); setTimeout(() => playTone(784, .18, 'sine', .14), 200); break;
    case 'antihero': playTone(311, .14, 'triangle', .12); setTimeout(() => playTone(466, .14, 'triangle', .12), 90); setTimeout(() => playTone(392, .22, 'sine', .10), 190); break;
    case 'neutral': playTone(392, .12, 'sine', .12); setTimeout(() => playTone(440, .12, 'sine', .10), 90); break;
    case 'type': playTone(1200, .03, 'square', .05); break;
  }
}

function sndRol(role) {
  if (role === 'Villano') snd('villain');
  else if (role === 'Héroe') snd('hero');
  else if (role === 'AntiHéroe') snd('antihero');
  else if (role === 'Neutral') snd('neutral');
  else snd('sel');
}

// ============================================================
// SETTINGS
// ============================================================
function toggleSettings() { document.getElementById('settingsPanel').classList.toggle('open') }
document.addEventListener('click', e => { const p = document.getElementById('settingsPanel'), g = document.querySelector('.gear-btn'); if (!p.contains(e.target) && !g.contains(e.target)) p.classList.remove('open') });
function setFontSize(px, l) { document.documentElement.style.setProperty('--fs', px + 'px');['S', 'M', 'L', 'XL'].forEach(s => document.getElementById('size' + s).classList.remove('active')); document.getElementById('size' + l).classList.add('active'); snd('sel') }
function applyFont() { const f = document.getElementById('fontFamilySelect').value; document.documentElement.style.setProperty('--body-font', `'${f}',sans-serif`); document.body.style.fontFamily = `'${f}',sans-serif`; snd('sel') }
function toggleMute() { soundEnabled = !soundEnabled; document.getElementById('muteToggle').classList.toggle('on', soundEnabled) }
// Gemini API key
let geminiKey = 'AIzaSyDTQr2lE8VVEZBhrKVLq87KmW0oO-06jhw';
function onKeyInput() { geminiKey = document.getElementById('geminiKeyInput').value.trim(); const st = document.getElementById('apiKeyStatus'); if (geminiKey.length > 10) { st.innerHTML = '<span style="color:var(--green)"><i class="fas fa-check-circle" style="font-size:8px"></i> Clave configurada — IA Gemini activa</span>' } else { st.innerHTML = '<span style="color:#6b7280"><i class="fas fa-circle" style="font-size:6px"></i> Sin clave — se usa análisis local</span>' } }
function initSettingsUI() {
  document.getElementById('geminiToggle')?.classList.toggle('on', !!state.settings.useGemini);
  document.getElementById('animsToggle')?.classList.toggle('on', !!state.settings.anims);
  document.body.classList.toggle('no-anim', !state.settings.anims);
  document.getElementById('autosaveToggle')?.classList.toggle('on', !!state.settings.autosave);
  applyTheme();
}
function toggleGemini() { state.settings.useGemini = !state.settings.useGemini; document.getElementById('geminiToggle')?.classList.toggle('on', !!state.settings.useGemini); snd('sel'); saveSettingsToLocalStorage() }
function toggleAnims() { state.settings.anims = !state.settings.anims; document.getElementById('animsToggle')?.classList.toggle('on', !!state.settings.anims); document.body.classList.toggle('no-anim', !state.settings.anims); snd('sel'); saveSettingsToLocalStorage() }

// ============================================================
// ============================================================
// Catálogos base del universo S9U.
// - Se usan para poblar selects y chips.
// - Algunas listas cambian según rol (ej: Villano tiene detesta/deseos/test alternativo).

// Convierte selects (motivación/objetivo/métodos/debilidad) en inputs editables.
// Crueldad se mantiene como select no editable.
function handleVillainSelectChange(key) {
  const sel = document.getElementById('villain' + key.charAt(0).toUpperCase() + key.slice(1));
  const val = sel.value;
  if (key === 'crueldad') {
    state.villain[key] = val;
    return;
  }
  if (val) {
    state.villain[key] = val;
    // Convert to editable input after selection
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'inp';
    inp.value = val;
    inp.placeholder = '— ' + key.charAt(0).toUpperCase() + key.slice(1) + ' —';
    inp.addEventListener('input', () => { state.villain[key] = inp.value });
    inp.addEventListener('blur', () => { if (!inp.value.trim()) { state.villain[key] = ''; } });
    sel.parentNode.replaceChild(inp, sel);
  } else {
    state.villain[key] = '';
  }
}

// Pobla los selects iniciales del perfil villano.
function poblarVillainPresets() {
  Object.keys(VILLAIN_PRESETS).forEach(key => {
    const sel = document.getElementById('villain' + key.charAt(0).toUpperCase() + key.slice(1));
    if (!sel) return;
    VILLAIN_PRESETS[key].forEach(opt => sel.innerHTML += `<option value="${opt}">${opt}</option>`);
  });
}

// ============================================================
// INIT
// ============================================================
// Boot principal del motor.
// Orden importante: defaults -> poblar UI -> inicializar listeners -> validar.
window.initHelios = () => {
  const loadedSettings = loadSettingsFromLocalStorage();
  if (loadedSettings && typeof loadedSettings === 'object') {
    state.settings = { ...state.settings, ...loadedSettings };
  }
  const loaded = loadFromLocalStorage();
  if (loaded?.state && typeof loaded.state === 'object') {
    state = { ...state, ...loaded.state, settings: { ...state.settings, ...(loaded.state.settings || {}) } };
  }
  poblarVillainPresets();
  applyDefaultFicha();
  bootTerminal(); poblarUniversos(); poblarRangos(); poblarRelTipo(); poblarSaludos(); poblarVestimenta(); poblarApariencia(); initHabilidades(); initIdentidadExtras(); initHistoriaCompletaUI(); poblarHobbies(); poblarDetesta(); poblarDeseos(); poblarRasgos(); poblarEtiquetas(); poblarTest(); poblarValidation(); poblarAnimales(); poblarDialogue(); initSettingsUI();
  initRolNarrativo();
  initRangoTheme();
  initScrollTopBtn();
  adjustLayout(); window.addEventListener('resize', adjustLayout);
  if (loaded?.dom) applyLoadedDOM(loaded.dom);
  document.addEventListener('input', scheduleSave, true);
  document.addEventListener('change', scheduleSave, true);
  window.addEventListener('beforeunload', () => { if (state?.settings?.autosave) saveToLocalStorage() });
  setTimeout(() => snd('sel'), 2000);
};
function adjustLayout() { document.getElementById('mainGrid').style.gridTemplateColumns = window.innerWidth >= 1024 ? '1fr 380px' : '1fr' }

function isTabla2Rank(rankName) {
  const g = RANGOS.find(x => String(x.g || '').includes('TABLA 2'));
  if (!g) return false;
  return (g.i || []).some(r => r.n === rankName);
}

// Theme visual por rango (TABLA 2) + rol villano (hellfire).
function applyRangoTheme() {
  const rango = document.getElementById('rango')?.value || '';
  const role = document.getElementById('rolNarrativo')?.value || '';
  const tabla2 = isTabla2Rank(rango);
  const isVillain = role === 'Villano';
  document.body.classList.toggle('gold-mode', tabla2);
  document.body.classList.toggle('hellfire-mode', tabla2 && isVillain);
}

function initRangoTheme() {
  const sel = document.getElementById('rango');
  if (!sel) return;
  sel.addEventListener('change', applyRangoTheme);
  applyRangoTheme();
}

// Presets de habilidades S9U: se agregan al listado como nombre + descripción.
const HABILIDADES_PRESET = [
  { k: 'canto_abismo', n: 'Canto del Abismo Celeste', d: 'La voz del personaje genera vibraciones que pueden sanar, purificar… o destruir. Un arma divina y una bendición. Sus límites dependen del estado emocional y del entorno acuático/espiritual.' },
  { k: 'sincronia_universos', n: 'Sincronía de Universos', d: 'Estabiliza o abre puntos de conexión entre Siul, Posidonia y otros planos. Requiere lectura precisa de resonancias dimensionales; un error puede fracturar el umbral.' },
  { k: 'purificacion_aguas', n: 'Purificación de Aguas', d: 'Restaura mares, elimina corrupción espiritual y cura corrientes vivientes. No es instantánea: la purificación consume energía y deja al usuario vulnerable.' },
  { k: 'flujo_vital', n: 'Control del Flujo Vital', d: 'Manipula la esencia vital contenida en el agua, reforzando cuerpos, almas y estructuras. Puede sellar heridas o quebrar defensas si encuentra la “corriente” correcta.' },
  { k: 'corrientes_temporales', n: 'Lectura de Corrientes Temporales', d: 'Lee ecos del pasado o futuros probables a través del agua. Cuanto más lejos el eco, más distorsión; requiere un “ancla” (mar, lluvia, sangre, niebla) para interpretar.' },
  { k: 'divinidad_suprema', n: 'Divinidad Suprema (potencial)', d: 'Despertar total del linaje. Permite abrir portales dimensionales, interplanetarios e interuniversales. Su coste es extremo: agota la identidad y puede alterar el orden del Todo.' },
  { k: 'mimetismo', n: 'Mimetismo de Técnica', d: 'Puede copiar y adaptar habilidades de un enemigo tras observar su patrón energético. La copia nunca es perfecta: necesita “resonancia” y puede fallar ante técnicas selladas por juramentos.' },
  { k: 'traslacion', n: 'Marca de Traslación', d: 'Teletransportación por anclajes: marca un punto con energía y puede reubicarse allí. Mientras más distancia/plano, mayor desgaste y riesgo de desalineación.' },
  { k: 'paso_relampago', n: 'Paso Relámpago', d: 'Aceleración explosiva en línea o zigzag mediante descarga bioenergética. Deja un rastro luminoso; su límite es la resistencia muscular y la estabilidad del terreno.' },
  { k: 'salto_instante', n: 'Salto de Instante', d: 'Micro-salto temporal (fracciones de segundo) para esquivar o reposicionarse. No cambia grandes eventos; solo altera el “momento” a cambio de un coste mental fuerte.' },
  { k: 'fuerza_primaria', n: 'Fuerza Primaria', d: 'Aumento físico y espiritual: fuerza, impacto y resistencia. Puede quebrar estructuras si canaliza la energía del agua o del núcleo planetario.' },
  { k: 'pacto_abismal', n: 'Pacto Abismal', d: 'Forja un juramento con una entidad del Bajo Astral para obtener poder temporal. Cada uso deja una “marca” que altera la personalidad y atrae presencias.' },
  { k: 'llama_jucio', n: 'Llama del Juicio Astral', d: 'Convoca fuego espiritual que no quema materia: quema intención, sellos y corrupción. En villanos puede invertirse como “Llama Profana”.' },
  { k: 'cadenas_velo', n: 'Cadenas del Velo', d: 'Materializa cadenas energéticas que atan cuerpo y alma. Puede inmovilizar, arrastrar o sellar habilidades por breves instantes.' },
  { k: 'eco_sangre', n: 'Eco de Sangre', d: 'Percibe rastros de energía vital en sangre, lluvia o agua; puede seguir objetivos o leer emociones residuales.' },
  { k: 'corona_terror', n: 'Corona de Terror', d: 'Proyecta una presencia dominante que debilita la voluntad enemiga. No funciona ante seres con juramentos absolutos o fe inquebrantable.' },
  { k: 'umbral_inverso', n: 'Umbral Inverso', d: 'Invierte un portal o umbral cercano para redirigir ataques/energía. Requiere lectura de geometría dimensional en tiempo real.' },
];

const TITULOS_ESPIRITUALES = [
  'Hija de la Corriente Divina', 'Portador/a del Equilibrio', 'Eco de la Luz Abisal', 'Sello Viviente de Helios', 'Herald@ del Vínculo Totémico'
];

// Helper: nombre del universo seleccionado.
function getUniversoName() {
  const uid = document.getElementById('universo')?.value;
  return uid ? UNIVERSOS.find(u => u.id == uid)?.name : '';
}

// Helper: la unidad de edad cambia según universo (cosmética + consistencia narrativa).
function getEdadUnidad() {
  const u = getUniversoName();
  if (!u) return 'años';
  const n = u.toLowerCase();
  if (n.includes('tierra')) return 'años humanos';
  if (n.includes('posidonia')) return 'años posidonianos';
  if (n.includes('siul') || n.includes('kairon')) return 'ciclos siulcianos';
  if (n.includes('umbra')) return 'ciclos de sombra';
  return 'años';
}

function updateEdadPlaceholders() {
  const unit = getEdadUnidad();
  const er = document.getElementById('edadReal');
  const ea = document.getElementById('edadAparente');
  if (er) er.placeholder = `Edad real (${unit})`;
  if (ea) ea.placeholder = `Edad aparente (${unit})`;
}

// Raza compuesta (mixta): combina raza principal + secundaria si corresponde.
function getRazaCompleta() {
  const r1 = document.getElementById('raza')?.value || '';
  const r2 = document.getElementById('raza2')?.value || '';
  if (r1 && r2 && r2 !== r1) return `${r1} – ${r2}`;
  return r1 || r2 || '';
}

function initIdentidadExtras() {
  updateEdadPlaceholders();
  const t = document.getElementById('tituloEspiritual');
  if (t) {
    t.value = t.value || '';
    t.addEventListener('input', () => { });
  }
  document.getElementById('edadReal')?.addEventListener('input', () => { });
  document.getElementById('edadAparente')?.addEventListener('input', () => { });
  const alt = document.getElementById('altura');
  if (alt) {
    alt.value = alt.value || state.altura || '';
    alt.addEventListener('input', () => { state.altura = alt.value });
  }
  document.getElementById('raza2')?.addEventListener('change', checkValidation);
  // Villain panel sync
  ['motivacion', 'objetivo', 'metodos', 'debilidad', 'crueldad'].forEach(key => {
    const el = document.getElementById('villain' + key.charAt(0).toUpperCase() + key.slice(1));
    if (!el) return;
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', () => { state.villain[key] = el.value });
    } else {
      el.addEventListener('input', () => { state.villain[key] = el.value });
    }
  });
  // Historia editable sync
  const ht = document.getElementById('historiaText');
  if (ht) {
    ht.value = state.historia || '';
    ht.addEventListener('input', () => { state.historia = ht.value });
  }
}

function getAparienciaOptions(catId) {
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const base = APARIENCIA_OPT_BASE[catId] || [];
  const extra = (rol === 'Villano' ? (APARIENCIA_OPT_VILLAIN[catId] || []) : []);
  return [...base, ...extra].filter((v, i, a) => a.indexOf(v) === i);
}

// Construye el resumen automático de "Apariencia -> Extra".
// Importante: si el usuario edita manualmente el textarea, se desactiva el auto (_auto=false).
function buildAutoAparienciaExtra() {
  const ap = state.apariencia || {};
  const v = state.vestimenta || {};
  const parts = [];
  if (ap.cabello) parts.push(`Cabello: ${ap.cabello}`);
  if (ap.ojos) parts.push(`Ojos: ${ap.ojos}`);
  if (ap.piel) parts.push(`Piel: ${ap.piel}`);
  if (ap.alas) parts.push(`Alas: ${ap.alas}`);
  if (ap.ropaje) parts.push(`Ropaje: ${ap.ropaje}`);
  const vest = VESTIMENTA_CAT.map(c => v[c.id]).filter(Boolean);
  const vestLine = vest.length ? `Vestimenta: ${vest.slice(0, 4).join(', ')}.` : '';
  const core = parts.length ? parts.slice(0, 3).join(' | ') : '';
  const tail = parts.length > 3 ? ` | ${parts.slice(3).join(' | ')}` : '';
  const tone = document.getElementById('rolNarrativo')?.value === 'Villano' ? 'Presencia: densa, infernal y dominante.' : 'Presencia: nítida, coherente y memorable.';
  return `${core}${tail}${core || tail ? '. ' : ''}${vestLine} ${tone}`.trim();
}

let _apExtraAiReq = 0;
async function buildAutoAparienciaExtraAI() {
  try {
    if (!state.settings?.useGemini) return null;
    if (!geminiKey || geminiKey.length < 10) return null;
    const ap = state.apariencia || {};
    const v = state.vestimenta || {};
    const rol = document.getElementById('rolNarrativo')?.value || '';
    const universo = getUniversoName() || '—';
    const raza = getRazaCompleta() || document.getElementById('raza')?.value || '—';
    const nombre = document.getElementById('nombre')?.value || '—';
    const vestLine = VESTIMENTA_CAT.map(c => `${c.name}: ${v[c.id] || '—'}`).join(' | ');
    const prompt = `Eres un redactor de fichas del universo S9U. Escribe un texto breve y estilizado para el campo "APARIENCIA — EXTRA".\n\nReglas:\n- Español.\n- 3 a 6 líneas, formato de ficha (cada línea con etiqueta corta y texto).\n- No inventes datos: si falta algo, usa “—”.\n- Si el rol es Villano: tono oscuro, dominante, opresivo.\n- Si no es Villano: tono épico y coherente.\n\nDATOS\nNombre: ${nombre}\nRol: ${rol || '—'}\nUniverso: ${universo}\nRaza: ${raza}\nApariencia: Cabello=${ap.cabello || '—'}; Ojos=${ap.ojos || '—'}; Piel=${ap.piel || '—'}; Alas=${ap.alas || '—'}; Ropaje=${ap.ropaje || '—'}\nVestimenta: ${vestLine}\n\nEntrega solo el texto (sin explicaciones).`;
    const text = await callGemini(prompt, 420);
    if (!text || typeof text !== 'string') return null;
    const clean = text.replace(/\r/g, '').trim();
    if (clean.length < 20) return null;
    return clean;
  } catch (e) {
    return null;
  }
}

function syncAutoAparienciaExtra() {
  if (!state.apariencia) state.apariencia = { cabello: '', ojos: '', piel: '', alas: '', ropaje: '', extra: '', _auto: true };
  if (state.apariencia._auto === false) return;
  const val = buildAutoAparienciaExtra();
  if (!val) return;
  state.apariencia.extra = val;
  state.apariencia._auto = true;
  const extra = document.getElementById('apExtra');
  if (extra) extra.value = val;

  const req = ++_apExtraAiReq;
  setTimeout(async () => {
    if (req !== _apExtraAiReq) return;
    if (!state.apariencia || state.apariencia._auto === false) return;
    const ai = await buildAutoAparienciaExtraAI();
    if (req !== _apExtraAiReq) return;
    if (!ai) return;
    if (!state.apariencia || state.apariencia._auto === false) return;
    state.apariencia.extra = ai;
    state.apariencia._auto = true;
    const ex = document.getElementById('apExtra');
    if (ex) ex.value = ai;
  }, 60);
}

function poblarApariencia() {
  const c = document.getElementById('aparienciaContainer');
  if (!c) return;
  if (!state.apariencia) state.apariencia = { cabello: '', ojos: '', piel: '', alas: '', ropaje: '', extra: '', _auto: true };
  c.innerHTML = '';

  APARIENCIA_CAT.forEach(cat => {
    if (!state.apariencia[cat.id]) state.apariencia[cat.id] = '';
    const wrap = document.createElement('div');
    wrap.className = 'acc';
    wrap.id = 'apacc_' + cat.id;
    wrap.innerHTML = `<div class="acc-head" onclick="toggleAccAp('${cat.id}')"><div><div class="acc-title">${cat.name}</div><div class="acc-sub" id="apaccs_${cat.id}">${state.apariencia[cat.id] || '—'}</div></div><div style="opacity:.5"><i class="fas fa-chevron-down"></i></div></div><div class="acc-body" id="apaccb_${cat.id}"><div style="display:flex;flex-wrap:wrap;gap:8px" id="apaccg_${cat.id}"></div><input type="text" class="inp" id="apcust_${cat.id}" placeholder="Personalizar ${cat.name}..." style="margin-top:10px;font-size:12px"></div>`;
    c.appendChild(wrap);

    const grid = document.getElementById('apaccg_' + cat.id);
    getAparienciaOptions(cat.id).forEach(opt => {
      const chip = document.createElement('div');
      chip.className = 'chip' + (state.apariencia[cat.id] === opt ? ' active' : '');
      chip.innerHTML = `<i class="fas fa-circle"></i>${opt}`;
      chip.onclick = () => selectApariencia(cat.id, opt);
      grid.appendChild(chip);
    });

    const inp = document.getElementById('apcust_' + cat.id);
    if (inp) {
      inp.value = state.apariencia[cat.id] || '';
      inp.oninput = () => setApariencia(cat.id, inp.value);
    }
  });

  const extra = document.getElementById('apExtra');
  if (extra) {
    extra.value = state.apariencia.extra || '';
    extra.oninput = () => { state.apariencia.extra = extra.value; state.apariencia._auto = false };
  }
  syncAutoAparienciaExtra();
}

function toggleAccAp(id) {
  const body = document.getElementById('apaccb_' + id);
  if (!body) return;
  const open = body.style.display === 'block';
  body.style.display = open ? 'none' : 'block';
  snd('sel');
}

function setApariencia(catId, val) {
  state.apariencia[catId] = val;
  const sub = document.getElementById('apaccs_' + catId);
  if (sub) sub.textContent = val || '—';
  const grid = document.getElementById('apaccg_' + catId);
  if (grid) Array.from(grid.children).forEach(ch => ch.classList.toggle('active', ch.textContent.trim() === val));
  syncAutoAparienciaExtra();
}

function selectApariencia(catId, opt) {
  const inp = document.getElementById('apcust_' + catId);
  if (inp) inp.value = opt;
  setApariencia(catId, opt);
  const body = document.getElementById('apaccb_' + catId);
  if (body) body.style.display = 'none';
  snd('sel');
}

function poblarHabilidadesPresets() {
  const s = document.getElementById('habPreset');
  if (!s) return;
  s.innerHTML = '<option value="">— Preset de habilidad —</option>';
  HABILIDADES_PRESET.forEach(h => { s.innerHTML += `<option value="${h.k}">${h.n}</option>` });
}

function initHabilidades() {
  poblarHabilidadesPresets();
  renderHabilidades();
}

function addHabilidad() {
  const n = (document.getElementById('habNombre')?.value || '').trim();
  const d = (document.getElementById('habDesc')?.value || '').trim();
  if (!n || !d) { snd('err'); return }
  state.habilidades.push({ id: 'hab_' + Date.now(), nombre: n, desc: d });
  document.getElementById('habNombre').value = '';
  document.getElementById('habDesc').value = '';
  renderHabilidades();
  snd('sel');
}

function addHabilidadPreset() {
  const key = document.getElementById('habPreset')?.value;
  if (!key) { snd('err'); return }
  const h = HABILIDADES_PRESET.find(x => x.k === key);
  if (!h) { snd('err'); return }
  state.habilidades.push({ id: 'hab_' + Date.now(), nombre: h.n, desc: h.d });
  document.getElementById('habPreset').value = '';
  renderHabilidades();
  snd('sel');
}

function editHab(id) {
  const h = state.habilidades.find(x => x.id === id);
  if (!h) return;
  const dEl = document.getElementById(id + '_d'), eEl = document.getElementById(id + '_e');
  if (!dEl || !eEl) return;
  eEl.value = h.desc;
  eEl.style.display = 'block';
  dEl.style.display = 'none';
  eEl.onblur = () => { h.desc = eEl.value; dEl.textContent = eEl.value; dEl.style.display = 'block'; eEl.style.display = 'none' };
  eEl.focus();
}

function delHab(id) {
  state.habilidades = state.habilidades.filter(x => x.id !== id);
  document.getElementById(id)?.remove();
  snd('des');
}

function renderHabilidades() {
  const c = document.getElementById('habilidadesList');
  if (!c) return;
  c.innerHTML = '';
  if (!state.habilidades.length) {
    const empty = document.createElement('div');
    empty.style.cssText = 'font-size:11px;opacity:.45;font-family:Share Tech Mono;padding:8px 0';
    empty.textContent = 'Sin habilidades agregadas todavía.';
    c.appendChild(empty);
    return;
  }
  state.habilidades.forEach(h => {
    const card = document.createElement('div');
    card.className = 'rel-card';
    card.id = h.id;
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div style="display:flex;align-items:center;gap:8px"><span class="rel-badge" style="background:rgba(59,130,246,.16);color:#bfdbfe;border:1px solid rgba(59,130,246,.25)">HABILIDAD</span><span style="font-weight:800;font-size:13px">${h.nombre}</span></div><button onclick="delHab('${h.id}')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;opacity:.6"><i class="fas fa-trash"></i></button></div>
    <div id="${h.id}_d" style="font-size:12px;opacity:.9;line-height:1.6;white-space:pre-wrap">${h.desc}</div>
    <div style="margin-top:8px"><button onclick="editHab('${h.id}')" style="background:none;border:none;color:var(--primary);font-size:11px;cursor:pointer;font-family:'Share Tech Mono'"><i class="fas fa-pencil-alt"></i> Editar</button></div>
    <textarea id="${h.id}_e" class="inp" style="display:none;height:90px;font-size:12px;margin-top:6px;resize:none"></textarea>`;
    c.appendChild(card);
  });
}

function initRolNarrativo() {
  const sel = document.getElementById('rolNarrativo');
  if (!sel) return;
  sel.addEventListener('change', applyRolNarrativo);
  ['villainMotivacion', 'villainObjetivo', 'villainMetodos', 'villainDebilidad', 'villainCrueldad'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const key = id.replace('villain', '').toLowerCase();
    if (el.tagName === 'SELECT') el.addEventListener('change', () => { state.villain[key] = el.value });
    else el.addEventListener('input', () => { state.villain[key] = el.value });
  });
  applyRolNarrativo();
}

function applyRolNarrativo() {
  const role = document.getElementById('rolNarrativo')?.value || '';
  const prevRole = state.prevRolNarrativo;
  const roleChanged = prevRole !== undefined && prevRole !== role;
  state.prevRolNarrativo = role;
  const isVillain = role === 'Villano';
  const moralTitle = document.getElementById('moralTitle');
  const moralDesc = document.getElementById('moralDesc');
  if (moralTitle && moralDesc) {
    if (isVillain) {
      moralTitle.innerHTML = '<i class="fas fa-comments-alt"></i> PREGUNTAS CLAVE PARA PERFIL OSCURO (VILLANO)';
      moralDesc.textContent = 'Responde y Helios generará una conclusión breve del perfil moral y la intención oscura (editable por tus respuestas).';
    } else {
      moralTitle.innerHTML = '<i class="fas fa-comments-alt"></i> PREGUNTAS CLAVE PARA DEFINIR SU PERSONALIDAD';
      moralDesc.textContent = 'Responde y Helios generará una conclusión breve del perfil moral (editable por tus respuestas).';
    }
  }
  document.getElementById('villainPanel').style.display = isVillain ? 'block' : 'none';
  document.body.classList.toggle('villain-mode', isVillain);
  document.body.classList.toggle('hero-mode', role === 'Héroe');
  document.body.classList.toggle('antihero-mode', role === 'AntiHéroe');
  if (roleChanged) sndRol(role);
  applyRangoTheme();
  poblarApariencia();
  poblarSaludos();
  poblarEtiquetas();
  poblarDetesta();
  poblarDeseos();
  poblarRasgos();
  poblarTest();
  poblarAnimales();
  if (document.getElementById('msgLog')) cambiarEscena(state.currentScene || 'belcebu', { noFocus: true, noAutoScroll: true });
  if (document.getElementById('universo')?.value) onUniversoChange();
}

// ============================================================
// TERMINAL
// ============================================================
function bootTerminal() {
  // Retro-compatibility or called by sequence
}

// ============================================================
// TYPING ANIMATION ENGINE
// ============================================================
async function typeWriter(elementId, text, speed = 30) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';
  // Ensure cursor effect if you want, but simple appending is cleaner for headers
  return new Promise(resolve => {
    let i = 0;
    function type() {
      if (i < text.length) {
        snd('type');
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

async function runTypingSequence() {
  // 1. Main Title
  await typeWriter('headerTitle', 'S9U HELIOS ENGINE DATA v8', 40);

  // 2. Subtitle
  await typeWriter('headerSubtitle', 'RED DE ARIEL ENLAZADA A HELIOS | DATOS CARGADOS Y COMPUTARIZADOS POR LOGAN', 15);

  // 3. Status
  await typeWriter('headerStatus', 'ENLACE HELIOS: ACTIVO', 30);

  // 4. Terminal Header
  await typeWriter('terminalHeader', 'HELIOS_TERMINAL v8.0', 30);

  // 5. Terminal Lines
  const t = document.getElementById('terminal');
  const lines = [
    "> Inicializando S9U Helios Engine Data v8.0...",
    "> Conectando Red de Ariel...",
    "> Sincronizando con Helios...",
    "> Sistema de Logan — Activo.",
    "> Motor de análisis local + Gemini — Listo.",
    "> Módulo de Sintonía Animal — Conectado."
  ];

  for (const line of lines) {
    const d = document.createElement('div');
    d.className = 'line';
    d.style.animation = 'none'; // Disable CSS animation to control manually
    d.style.opacity = '1';
    d.innerHTML = line;
    t.appendChild(d);
    t.scrollTop = t.scrollHeight;
    await new Promise(r => setTimeout(r, 150)); // Fast line entry
  }

  // Final cursor line
  const d = document.createElement('div');
  d.className = 'line';
  d.style.opacity = '1';
  d.innerHTML = '> Esperando inputs del usuario...<span class="cursor"></span>';
  t.appendChild(d);
  t.scrollTop = t.scrollHeight;

  // Universe listener logic (kept from original bootTerminal)
  document.getElementById('universo').addEventListener('change', function () { if (!this.value) return; const u = UNIVERSOS.find(x => x.id == this.value); t.innerHTML = '';[`> Cambio: U${u.id} — ${u.name}`, `> Planeta: ${u.planetas[0]}`, `> Red Helios conectada.`, `> Recalibrando...`, `> Listo.<span class="cursor"></span>`].forEach((l, i) => { const d = document.createElement('div'); d.className = 'line'; d.style.animationDelay = (i * .3) + 's'; d.innerHTML = l; t.appendChild(d) }); snd('ok') });
}

// ============================================================
// POBLAR SELECTS
// ============================================================
function poblarUniversos() { const s = document.getElementById('universo'); UNIVERSOS.forEach(u => s.innerHTML += `<option value="${u.id}">U${u.id} - ${u.name}</option>`) }
function onUniversoChange() {
  const uid = document.getElementById('universo').value, u = UNIVERSOS.find(x => x.id == uid);
  const p = document.getElementById('planeta');
  const prevPlanet = p?.value || '';
  const prevRaza = document.getElementById('raza')?.value || '';
  const prevRaza2 = document.getElementById('raza2')?.value || '';
  p.innerHTML = '<option value="">— Planeta Natal —</option>';
  const role = document.getElementById('rolNarrativo').value || '';
  const isVillain = role === 'Villano';
  const planetas = u ? [...u.planetas] : [];
  if (isVillain && u) {
    planetas.push(`Bajo Astral (U${uid})`);
  }
  planetas.forEach(x => p.innerHTML += `<option value="${x}">${x}</option>`);
  if (prevPlanet && planetas.includes(prevPlanet)) p.value = prevPlanet;
  const r = document.getElementById('raza');
  r.innerHTML = '<option value="">— Raza / Linaje —</option>';
  const baseRazas = u ? [...u.razas] : [];
  if (isVillain) {
    ['Demoníaco', 'Entidad Infernal', 'Sombra Maldita', 'Abyssborn (Nacido del Abismo)'].forEach(x => { if (!baseRazas.includes(x)) baseRazas.push(x) });
  }
  baseRazas.forEach(x => r.innerHTML += `<option value="${x}">${x}</option>`);
  if (prevRaza && baseRazas.includes(prevRaza)) r.value = prevRaza;
  const r2 = document.getElementById('raza2');
  if (r2) {
    r2.innerHTML = '<option value="">— Raza (segunda / mixta) —</option>';
    baseRazas.forEach(x => r2.innerHTML += `<option value="${x}">${x}</option>`);
    if (prevRaza2 && baseRazas.includes(prevRaza2)) r2.value = prevRaza2;
  }
  updateEdadPlaceholders();
  checkValidation();
}
function poblarRangos() { const s = document.getElementById('rango'); RANGOS.forEach(g => { s.innerHTML += `<optgroup label="${g.g}">`; g.i.forEach(r => s.innerHTML += `<option value="${r.n}">${r.n} (${r.u.toLocaleString()}U)</option>`); s.innerHTML += '</optgroup>' }) }
function poblarRelTipo() { const s = document.getElementById('relTipo'); TIPOS_REL.forEach(t => s.innerHTML += `<option value="${t}">${t}</option>`) }

// ============================================================
// ANIMALES DIVINOS
// ============================================================
function poblarAnimales() {
  const g = document.getElementById('animalGrid');
  if (!g) return;
  g.innerHTML = '';
  const list = getAnimalesList();
  list.forEach(a => {
    const c = document.createElement('div'); c.className = 'animal-card'; c.id = 'ac_' + a.id;
    const head = a.img ? `<div class="a-img" style="background-image:url('${a.img}')"></div>` : `<span class="a-emoji">${a.emoji}</span>`;
    c.innerHTML = `${head}<div class="a-name">${a.name}</div><div class="a-domains">${a.domains}</div><div class="a-desc">${a.desc}</div><div class="a-check">✓</div>`;
    c.onclick = () => selectAnimal(a.id); g.appendChild(c);
  });

  // Si el usuario tenía un animal seleccionado que no existe en la lista actual, se limpia.
  const exists = state.animal ? list.some(a => a.id === state.animal) : true;
  if (!exists) state.animal = null;
  selectAnimal(state.animal || null);
}

function poblarVestimenta() {
  const c = document.getElementById('vestimentaContainer');
  if (!c) return;
  if (!state.vestimenta) state.vestimenta = {};
  VESTIMENTA_CAT.forEach(cat => { if (!state.vestimenta[cat.id]) state.vestimenta[cat.id] = '' });
  c.innerHTML = '';
  VESTIMENTA_CAT.forEach(cat => {
    const wrap = document.createElement('div');
    wrap.className = 'acc';
    wrap.id = 'acc_' + cat.id;
    wrap.innerHTML = `<div class="acc-head" onclick="toggleAcc('${cat.id}')"><div><div class="acc-title">${cat.name}</div><div class="acc-sub" id="accs_${cat.id}">${state.vestimenta[cat.id] || '—'}</div></div><div style="opacity:.5"><i class="fas fa-chevron-down"></i></div></div><div class="acc-body" id="accb_${cat.id}"><div style="display:flex;flex-wrap:wrap;gap:8px" id="accg_${cat.id}"></div><input type="text" class="inp" id="vestcust_${cat.id}" placeholder="Personalizar ${cat.name}..." style="margin-top:10px;font-size:12px"></div>`;
    c.appendChild(wrap);
    const grid = document.getElementById('accg_' + cat.id);
    (VESTIMENTA_OPT[cat.id] || []).forEach(opt => {
      const chip = document.createElement('div');
      chip.className = 'chip' + (state.vestimenta[cat.id] === opt ? ' active' : '');
      chip.innerHTML = `<i class="fas fa-circle"></i>${opt}`;
      chip.onclick = () => selectVestimenta(cat.id, opt);
      grid.appendChild(chip);
    });

    const inp = document.getElementById('vestcust_' + cat.id);
    if (inp) {
      inp.value = state.vestimenta[cat.id] || '';
      inp.oninput = () => setVestimenta(cat.id, inp.value);
    }
  });
}
function toggleAcc(id) {
  const body = document.getElementById('accb_' + id);
  if (!body) return;
  const open = body.style.display === 'block';
  body.style.display = open ? 'none' : 'block';
  snd('sel');
}
function selectVestimenta(catId, opt) {
  const inp = document.getElementById('vestcust_' + catId);
  if (inp) inp.value = opt;
  setVestimenta(catId, opt);
  const body = document.getElementById('accb_' + catId);
  if (body) body.style.display = 'none';
  snd('sel');
}

function setVestimenta(catId, val) {
  if (!state.vestimenta) state.vestimenta = {};
  state.vestimenta[catId] = val;
  const sub = document.getElementById('accs_' + catId);
  if (sub) sub.textContent = val || '—';
  const grid = document.getElementById('accg_' + catId);
  if (grid) Array.from(grid.children).forEach(ch => ch.classList.toggle('active', ch.textContent.trim() === val));
  syncAutoAparienciaExtra();
  checkValidation();
}
function selectAnimal(id) {
  // Deselect all
  document.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('animalNone').classList.remove('selected');
  if (id === null) { state.animal = null; document.getElementById('animalNone').classList.add('selected') }
  else { state.animal = id; document.getElementById('ac_' + id).classList.add('selected') }
  snd('sel'); checkValidation();
}
function getAnimal() {
  const list = getAnimalesList();
  return state.animal ? list.find(a => a.id === state.animal) : null;
}


// ============================================================
// GEMINI API CALL (con fallback silencioso)
// ============================================================
async function callGemini(prompt, maxTokens = 2048) {
  if (!state.settings?.useGemini) return null;
  if (!geminiKey || geminiKey.length < 10) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
  const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 } });
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 20000);
    try {
      const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: controller.signal });
      if (resp.status === 429 || resp.status === 503) {
        clearTimeout(t);
        await new Promise(r => setTimeout(r, 900 + (attempt * 900)));
        continue;
      }
      if (!resp.ok) {
        clearTimeout(t);
        return null;
      }
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      clearTimeout(t);
      return (text && text.length > 5) ? text : null;
    } catch (e) {
      clearTimeout(t);
      if (attempt === 0) {
        await new Promise(r => setTimeout(r, 700));
        continue;
      }
      return null;
    }
  }
  return null;
}

// ============================================================
// GENERADOR LOCAL DE DESCRIPCIONES DE RELACIÓN
// ============================================================
// Este generador se usa como fallback cuando Gemini no está disponible.
// Objetivo: producir descripciones variadas (no genéricas) por tipo de vínculo.
function generarDescRelLocal(nombre, tipo) {
  const n = document.getElementById('nombre').value || 'el protagonista';
  const raza = getRazaCompleta() || document.getElementById('raza').value || '';
  const universo = document.getElementById('universo').value ? UNIVERSOS.find(u => u.id == document.getElementById('universo').value)?.name : '';
  const animal = getAnimal();
  const animalRef = animal ? ` Su vínculo totémico con la ${animal.name} —representante de ${animal.domains}— permea esta relación de una forma especial.` : '';
  const razaRef = raza ? ` Como ${raza}` : '';

  const T = {
    "Madre": [`${nombre} es la madre de ${n}.${razaRef}, ${n} lleva en cada acción un eco de la devoción que esta mujer mostró durante toda su vida. Su amor no necesita palabras para ser sentido.`, `${nombre} —la madre de ${n}— es el primer vínculo real que el protagonista conoció. Incluso a través de universos y reencarnaciones, esa conexión permanece intacta como un hilo de luz que no puede romperse.`],
    "Padre": [`${nombre} es el padre de ${n}. Su presencia fue siempre un pilar silencioso: no hablaba mucho, pero cuando lo hacía, sus palabras tenían un peso que trascindia el momento.${animalRef}`, `El padre de ${n} es ${nombre}. Lejos de ser una figura perfecta, fue un hombre que intentó, a su manera, construir un cimiento sobre el cual su hijo/a pudiera caminar con dignidad.`],
    "Hermano": [`${nombre} y ${n} comparten más que sangre; comparten destino. Como dos caras de la misma moneda, uno compensa lo que al otro le falta. En los momentos más oscuros, ha sido el hermano quien se mantiene de pie cuando el otro cae.${animalRef}`, `El hermano de ${n} es ${nombre}. Una lealtad que no necesita explicarse ni pedirse. Simplemente existe, fuerte como el vínculo entre dos almas que ya se conocían antes de nacer.`],
    "Hermana": [`${nombre} es la hermana de ${n}. Su presencia aporta calma donde hay tormenta, y claridad donde todo está confuso. Entre ellos existe una comprensión que pocas relaciones logran alcanzar.`, `La hermana de ${n}, ${nombre}, es un espejo que refleja tanto la luz como la sombra. No la juzga ni la cuestiona: simplemente la conoce, en toda su profundidad.${animalRef}`],
    "Hijo": [`${nombre} es el hijo de ${n}. En un multiverso que arranca cosas sin pedir permiso, este vínculo es una razón para resistir.${animalRef}`, `El hijo de ${n} es ${nombre}. No es solo familia: es futuro. Un recordatorio de que cada decisión deja herencia.`],
    "Hija": [`${nombre} es la hija de ${n}. Su existencia obliga al protagonista a medir el costo real de la violencia y de las promesas.${animalRef}`, `La hija de ${n} es ${nombre}. La relación no es perfecta, pero es verdadera: se construye con presencia, no con discursos.`],
    "Amor": [`${nombre} es el amor de ${n}. En un multiverso lleno de caos y tragedia, esta persona representa algo que no necesita demostración: el ancla del alma. Cada decisión que toma ${n} tiene, en algún rincón profundo, la imagen de ${nombre}.${animalRef}`, `El amor de ${n} es ${nombre}. No fue un amor fácil ni del tipo que los cuentos describen. Fue construido con paciencia, con errores, y con la decisión mutua de quedarse cuando todo lo demás decía irse.`],
    "Pareja": [`${nombre} camina junto a ${n} no por obligación sino por elección consciente. Su relación es un pacto entre dos seres que eligieron, a pesar de todo, construir algo juntos en un universo que no siempre lo permite.`, `La pareja de ${n} es ${nombre}. Entre ellos existe un entendimiento que trasciende palabras: se conocen en las sombras y en la luz, y ninguno de los dos cambia su decisión.${animalRef}`],
    "Mejor Amigo": [`${nombre} —el mejor amigo de ${n}— es la persona que ve lo que los demás no: las dudas que esconde, la fuerza que no muestra, y el ser real debajo de todas las máscaras. Una amistad que no se construye, se descubre.${animalRef}`, `El mejor amigo de ${n} es ${nombre}. No necesita que le digan que hay algo mal; lo siente. Y no necesita que le piden ayuda; la ofrece. Esa clase de vínculo es raro en cualquier universo.`],
    "Mejor Amiga": [`${nombre} es la mejor amiga de ${n}. Su honestidad es un regalo —nunca suaviza la verdad, pero nunca la dice con crueldad. Es el tipo de presencia que sana sin que te lo pidan.`, `La mejor amiga de ${n}, ${nombre}, conoce los secretos más oscuros y los más brillantes. Los sostiene sin juicio. Su lealtad no es ciega; es consciente, elegida.${animalRef}`],
    "Amigo": [`${nombre} es amigo de ${n}. No es un vínculo épico por accidente: se ganó en pequeñas decisiones, en días normales, donde eligieron no traicionarse.${animalRef}`, `El amigo de ${n} es ${nombre}. A veces discrepan, pero cuando llega el peligro, se alinean sin pedirlo: la amistad se vuelve táctica.`],
    "Amiga": [`${nombre} es amiga de ${n}. Su valor está en lo que no exige: presencia, verdad y una risa que rompe el peso del destino.${animalRef}`, `La amiga de ${n} es ${nombre}. Es el tipo de vínculo que no necesita grandilocuencia; necesita constancia.`],
    "Enemigo": [`${nombre} se opone a ${n}. No por odio personal sino por una convicción profunda de que el otro está en error. Es un conflicto que va más allá del combate: es una disputa por cómo debe funcionar el orden del cosmos.${animalRef}`, `El enemigo de ${n} es ${nombre}. Esta rivalidad no nació del odio sino de la incompatibilidad fundamental: dos visiones del mundo que no pueden coexistir sin enfrentarse.`],
    "Archienemigo": [`${nombre} es la mayor amenaza que ${n} ha enfrentado. Sus batallas van más allá del fuego y la espada: es una guerra entre principios. Cada encuentro entre ellos redefine lo que significa estar del lado correcto.${animalRef}`, `El archienemigo de ${n} es ${nombre}. Uno no puede existir sin el otro en la narrativa del multiverso. Son dos polos que, paradójicamente, necesitan al otro para cobrar sentido.`],
    "Rival": [`${nombre} es rival de ${n}. No se odian: se miden. Cada encuentro los obliga a crecer, y esa fricción es una escuela brutal.${animalRef}`, `El rival de ${n} es ${nombre}. La rivalidad nació de una comparación inevitable: dos formas de poder que no pueden ignorarse.`],
    "Mentor": [`${nombre} guía a ${n} con la sabiduría ganada a través de eones de error y acierto. No impone caminos; los insinúa. No juzga faltas; las transforma en lecciones. Su mayor legado no es lo que enseña sino lo que inspira.${animalRef}`, `El mentor de ${n} es ${nombre}. Una figura que vio en el protagonista un potencial que otros ignoraban. Su enseñanza no se termina cuando el mentor se va: permanece en cada decisión que se toma después.`],
    "Confidente": [`${nombre} es el confidente de ${n}. Ante esta persona, las máscaras caen. Es el único ser en todo el multiverso al que ${n} puede mostrar el peso real que lleva, sin temer ser juzgado ni abandonado.${animalRef}`, `Con ${nombre}, ${n} puede ser vulnerable. Es un vínculo que no se busca ni se pide: emerge cuando dos almas se reconocen mutuamente como refugio.`],
    "Cuñado": [`${nombre} es cuñado de ${n}. Familia por enlace, pero vínculo por elección: la relación se prueba en situaciones incómodas, donde la lealtad se demuestra sin discursos.${animalRef}`, `El cuñado de ${n} es ${nombre}. No siempre coinciden, pero cuando el mundo aprieta, el vínculo se vuelve firme.`],
    "Cuñada": [`${nombre} es cuñada de ${n}. Su presencia puede ser apoyo o fricción, pero siempre es real: nada de cortesía vacía.${animalRef}`, `La cuñada de ${n} es ${nombre}. Conoce un lado del protagonista que casi nadie ve: el doméstico, el imperfecto, el humano.`]
  };
  const pool = T[tipo] || [`${nombre} es la ${tipo.toLowerCase()} de ${n}. Este vínculo es importante dentro de la narrativa del universo ${universo || 'desconocido'}: conectados por circunstancias que van más allá de lo ordinario.${animalRef}`];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================
// RELACIONES
// ============================================================
// Crea una tarjeta de relación y la guarda en state.rels.
// Flujo:
// - Intenta generar descripción con Gemini (si activo)
// - Si falla, usa generarDescRelLocal()
async function agregarRelacion() {
  const tipo = document.getElementById('relTipo').value, nombre = document.getElementById('relNombre').value.trim();
  if (!tipo || !nombre) { snd('err'); return }
  const container = document.getElementById('relaciones'), id = 'rel_' + Date.now();
  const colorMap = { "Madre": "#ec4899", "Padre": "#3b82f6", "Hermano": "#8b5cf6", "Hermana": "#a855f7", "Hijo": "#06b6d4", "Hija": "#ec4899", "Amor": "#f43f5e", "Pareja": "#f43f5e", "Mejor Amigo": "#10b981", "Mejor Amiga": "#10b981", "Amigo": "#22c55e", "Amiga": "#22c55e", "Enemigo": "#ef4444", "Archienemigo": "#991b1b", "Mentor": "#f59e0b", "Confidente": "#8b5cf6", "Rival": "#f97316" };
  const color = colorMap[tipo] || "#60a5fa";
  // Try Gemini first, fallback to local
  let desc = null;
  const n = document.getElementById('nombre').value || 'el protagonista';
  const genero = document.getElementById('genero').value || '';
  const pronombre = genero === 'Mujer' ? 'ella' : genero === 'Hombre' ? 'él' : 'él/ella';
  const animal = getAnimal();
  const animalCtx = animal ? `Su animal totémico es la ${animal.name} (${animal.domains}).` : '';
  const razaFull = getRazaCompleta() || document.getElementById('raza').value || 'desconocida';
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const universoName = document.getElementById('universo').value ? UNIVERSOS.find(u => u.id == document.getElementById('universo').value)?.name : 'desconocido';
  const planeta = document.getElementById('planeta')?.value || '';
  const deseos = (state.deseos || []).slice(0, 6).join(' | ') || '—';
  const rasgos = (state.rasgos || []).slice(0, 10).join(', ') || '—';
  const detesta = (state.detesta || []).slice(0, 6).join(', ') || '—';
  const etiquetas = (state.etiquetas || []).slice(0, 5).join(', ') || '—';
  const historia = state.historia || '—';
  const v = state.villain || {};
  const villainCtx = rol === 'Villano' ? ` Perfil Villano: motivación=${v.motivacion || '—'}; objetivo=${v.objetivo || '—'}; métodos=${v.metodos || '—'}; debilidad=${v.debilidad || '—'}; crueldad=${v.crueldad || '—'}.` : '';
  const geminiPrompt = `Eres un escritor narrativo del universo S9U y debes generar una descripción de relación NO genérica.

Reglas:
- Máximo 85 palabras.
- Debe incluir 1 detalle concreto (un gesto, una escena, una decisión o un recuerdo) que vuelva único el vínculo.
- Ajusta el tono según el tipo: familia (íntimo), amistad (cómplice), rivalidad (fricción), enemigo (amenaza).
- No uses etiquetas, no uses listas, no uses emojis.

Datos del personaje:
Protagonista: ${n} (pronombre: ${pronombre})
Rol: ${rol || '—'}${villainCtx}
Universo: ${universoName} | Planeta: ${planeta || '—'}
Raza: ${razaFull}
Rasgos: ${rasgos}
Deseos: ${deseos}
Detesta: ${detesta}
Etiquetas: ${etiquetas}
Historia base: ${historia}
${animalCtx}

Relación a describir:
Tipo: ${tipo}
Persona: ${nombre}

Entrega una sola descripción (texto corrido) en español.`;
  desc = await callGemini(geminiPrompt, 240);
  if (!desc) desc = generarDescRelLocal(nombre, tipo);

  const card = document.createElement('div'); card.className = 'rel-card'; card.id = id;
  card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div style="display:flex;align-items:center;gap:8px"><span class="rel-badge" style="background:${color}20;color:${color};border:1px solid ${color}40">${tipo}</span><span style="font-weight:700;font-size:14px">${nombre}</span></div><button onclick="elimRel('${id}')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;opacity:.6"><i class="fas fa-trash"></i></button></div>
  <div id="${id}_d" style="font-size:12px;opacity:.85;line-height:1.6">${desc}</div>
  <div style="margin-top:8px"><button onclick="editRel('${id}')" style="background:none;border:none;color:var(--primary);font-size:11px;cursor:pointer;font-family:'Share Tech Mono'"><i class="fas fa-pencil-alt"></i> Editar descripción</button></div>
  <textarea id="${id}_e" class="inp" style="display:none;height:80px;font-size:12px;margin-top:6px;resize:none"></textarea>`;
  container.appendChild(card); state.rels.push({ id, tipo, nombre, desc });
  document.getElementById('relNombre').value = ''; document.getElementById('relTipo').value = '';
  snd('sel'); checkValidation();
}
function editRel(id) {
  const rel = state.rels.find(r => r.id === id); if (!rel) return;
  const dEl = document.getElementById(id + '_d'), eEl = document.getElementById(id + '_e');
  eEl.value = rel.desc; eEl.style.display = 'block'; dEl.style.display = 'none';
  eEl.onblur = () => { rel.desc = eEl.value; dEl.textContent = eEl.value; dEl.style.display = 'block'; eEl.style.display = 'none' };
  eEl.focus();
}
function elimRel(id) { document.getElementById(id)?.remove(); state.rels = state.rels.filter(r => r.id !== id); snd('des'); checkValidation() }

// ============================================================
// SALUDOS
// ============================================================
function poblarSaludos() {
  const c = document.getElementById('saludosContainer');
  if (!c) return;
  c.innerHTML = '';
  const list = getSaludosList();
  list.forEach(s => {
    const d = document.createElement('div');
    d.style.cssText = 'background:rgba(0,0,0,.3);border:1px solid rgba(59,130,246,.18);border-radius:10px;padding:14px;margin-bottom:12px';
    d.innerHTML = `<div style="font-weight:600;font-size:13px;margin-bottom:8px;color:#cbd5e1"><span style="color:var(--primary);font-family:'Orbitron';font-size:10px">[${(s.id.replace('saludo', '')).padStart(2, '0')}]</span> ${s.q}</div><input type="text" class="inp" id="${s.id}" placeholder="Respuesta..." style="font-size:12px">`;
    c.appendChild(d);
    const inp = document.getElementById(s.id);
    if (inp) {
      inp.value = state.saludos[s.id] || '';
      inp.oninput = () => { state.saludos[s.id] = inp.value; updateMoralSummaryUI(); checkValidation() };
    }
  });
  updateMoralSummaryUI();
}

// Conclusión breve (offline) del "perfil moral" en base a las respuestas.
// Nota: esto NO sustituye el análisis Helios: es un resumen rápido y útil.
function generarConclusionMoral() {
  const norm = v => (v || '').toString().trim().toLowerCase();
  const s = state.saludos || {};
  const p1 = norm(s.saludo1), p2 = norm(s.saludo2), p3 = norm(s.saludo3), p4 = norm(s.saludo4), p5 = norm(s.saludo5), p6 = norm(s.saludo6), p7 = norm(s.saludo7), p8 = norm(s.saludo8);
  const all = [p1, p2, p3, p4, p5, p6, p7, p8].join(' ');

  // Si no hay respuestas, no devolvemos un perfil inventado.
  const anyAnswered = [p1, p2, p3, p4, p5, p6, p7, p8].some(x => x && x.length > 0);
  if (!anyAnswered) return '—';

  // Heurística por puntaje (simple pero consistente).
  // + puntos => tendencia prosocial/ética; - puntos => tendencia instrumental/dura.
  let score = 0;
  const traits = [];

  // Ayuda / altruismo
  if (/\b(si|sí)\b|ayud|auxil|socorr|har[ií]a algo|lo ayudar[ií]a/.test(p1)) score += 2;
  if (/no|jam[aá]s|ignorar|me da igual/.test(p1)) score -= 1;
  if (/miedo|nerv|duda|p[aá]nic|panico/.test(p1)) traits.push('temeroso');
  if (/sin miedo|valent|decid/.test(p1)) traits.push('valiente');
  if (score >= 2) traits.push('compasivo');

  // Dilema 1 vs muchos
  if (/instint|har[ií]a lo que pueda|salvar|ayudar/.test(p2)) score += 1;
  if (/sacrific|elegir[ií]a a muchos|el mayor bien|utilitar/.test(p2)) traits.push('utilitarista');
  if (/entrar[ií]a en p[aá]nico|panico|me bloquear[ií]a/.test(p2)) traits.push('ansioso');
  if (/fr[ií]o|calcul|racional/.test(p2)) traits.push('fr[ií]o');

  // Perdón
  if (/perdon|comprend|segunda oportunidad/.test(p3)) { score += 2; traits.push('perdonador'); }
  if (/dif[ií]cil|nunca|jam[aá]s|vengan/.test(p3)) { score -= 1; traits.push('rencoroso'); }

  // Verdad vs mentira
  if (/verdad|honest|aunque duela/.test(p4)) { score += 1; traits.push('honesto'); }
  if (/mient|ocult|evitar|no decir/.test(p4)) { score -= 1; traits.push('evasivo'); }

  // Búsqueda principal
  if (/paz/.test(p5)) traits.push('pac[ií]fico');
  if (/justi/.test(p5)) { score += 1; traits.push('justiciero'); }
  if (/perten/.test(p5)) { traits.push('leal'); }
  if (/poder/.test(p5)) { score -= 1; traits.push('ambicioso'); }

  // Sacrificio
  if (/\b(si|sí)\b|sin pens|me sacrificar|daria mi vida/.test(p6)) { score += 2; traits.push('abnegado'); }
  if (/no|jam[aá]s|primero yo|me salvo/.test(p6)) { score -= 1; traits.push('ego[ií]sta'); }

  // Sin juicio
  if (/huir|escapar|evitar/.test(p7)) traits.push('evasivo');
  if (/da[nñ]ar|matar|vengan|robar|abuso/.test(p7)) { score -= 2; traits.push('impulsivo'); }
  if (/ayudar|proteger|hacer el bien/.test(p7)) { score += 1; traits.push('protector'); }

  // Lealtad / traición
  if (/nunca|jam[aá]s/.test(p8) || /bondad|quien me ayud[oó]|familia|amigo|aliad/.test(p8)) { traits.push('leal'); score += 1; }
  if (/nadie|a todos|depende|me da igual/.test(p8)) { traits.push('desapegado'); score -= 1; }

  // Clasificación base (no fija): depende del score final.
  let base = 'Neutro';
  if (score >= 4) base = 'Bueno';
  else if (score <= -2) base = 'Duro';

  const uniq = traits.map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  const top = uniq.slice(0, 4);
  return top.length ? `${base}, ${top.join(', ')}.` : `${base}.`;
}

function updateMoralSummaryUI() {
  const el = document.getElementById('moralSummary');
  if (!el) return;
  el.textContent = `Conclusión del perfil moral: ${generarConclusionMoral()}`;
}

// Defaults de ficha (solo si el usuario aún no cargó valores).
// Objetivo: que el motor arranque con un personaje ejemplo coherente sin forzar datos.
function applyDefaultFicha() {
  // Defaults de ficha: solo se aplican si el usuario aún no cargó valores.
  try {
    if (!state.altura) state.altura = '1,65';
    if (!state.apariencia) state.apariencia = { cabello: '', ojos: '', piel: '', alas: '', ropaje: '', extra: '', _auto: true };
    if (!state.apariencia.cabello) state.apariencia.cabello = 'Rubio claro, corto, desordenado';
    if (!state.apariencia.ojos) state.apariencia.ojos = 'Marrones, expresión nerviosa';
    if (!state.apariencia.ropaje) state.apariencia.ropaje = 'Ropa ligera de viajero';
    const extra = (state.apariencia.extra || '').trim();
    if (!extra) {
      state.apariencia.extra = [
        'Vestimenta alternativa: Ropaje de combate liviano.',
        'Equipamiento relevante: Espada ligera; Amuleto de enfoque.',
        'Objetos únicos / reliquias / artefactos: Espada de la Virtud Legendaria (antes Espada de Liam).',
        'Estado inicial: Dormida.',
        'Evolución del equipamiento: Su espada evoluciona conforme él aprende a no huir.'
      ].join('\n');
    }
    if (!state.vestimenta) state.vestimenta = {};
    if (!state.vestimenta.armas) state.vestimenta.armas = 'Espada ligera';
    if (!state.vestimenta.accesorios) state.vestimenta.accesorios = 'Amuleto de enfoque';
    if (!state.habilidades) state.habilidades = [];
    const hasIntencion = state.habilidades.some(h => (h?.nombre || '').toLowerCase().includes('intención') || (h?.nombre || '').toLowerCase().includes('intencion'));
    if (!hasIntencion) {
      state.habilidades.push({ nombre: 'Técnicas ligadas a la intención', desc: 'Capacidad de manifestar técnicas únicas ligadas a la intención.' });
    }
    const defaults = {
      saludo1: 'Sí, aunque con miedo.',
      saludo2: 'Entraría en pánico, pero actuaría por instinto.',
      saludo3: 'Difícilmente, pero intentaría comprender.',
      saludo4: 'Miente para evitar conflictos.',
      saludo5: 'Pertenencia.',
      saludo6: 'Sí, sin pensarlo.',
      saludo7: 'Intentaría huir.',
      saludo8: 'A quien le haya mostrado bondad.'
    };
    SALUDOS.forEach(q => { if (!state.saludos[q.id]) state.saludos[q.id] = defaults[q.id] || '' });
  } catch (e) {
    console.error('applyDefaultFicha error:', e);
  }
}

// ============================================================
// ETIQUETAS DE HISTORIA
// ============================================================
function poblarEtiquetas() {
  const g = document.getElementById('etiquetasGrid');
  if (!g) return;
  g.innerHTML = '';
  const role = document.getElementById('rolNarrativo')?.value || '';
  const list = (role === 'Villano' ? [...ETIQUETAS, ...ETIQUETAS_VILLAIN] : ETIQUETAS).filter((v, i, a) => a.indexOf(v) === i);
  state.etiquetas = (state.etiquetas || []).filter(x => list.includes(x));
  list.forEach((e, i) => {
    const c = document.createElement('div');
    c.className = 'chip';
    c.id = 'etiq_' + i;
    c.innerHTML = `<i class="fas fa-circle"></i>${e}`;
    c.onclick = () => toggleEtiqueta(e, c);
    g.appendChild(c);
    if (state.etiquetas.includes(e)) c.classList.add('active');
  });
  const cnt = document.getElementById('etiquetasCount');
  if (cnt) cnt.textContent = `Seleccionadas: ${state.etiquetas.length} / 5`;
}

function toggleEtiqueta(name, chip) {
  const idx = state.etiquetas.indexOf(name);
  if (idx > -1) {
    state.etiquetas.splice(idx, 1);
    chip.classList.remove('active');
    document.querySelectorAll('#etiquetasGrid .chip').forEach(c => c.classList.remove('disabled'));
    snd('des');
  } else {
    if (state.etiquetas.length >= 5) { snd('err'); return }
    state.etiquetas.push(name);
    chip.classList.add('active');
    snd('sel');
    if (state.etiquetas.length === 5) {
      document.querySelectorAll('#etiquetasGrid .chip').forEach(c => { if (!c.classList.contains('active')) c.classList.add('disabled') });
      generarHistoria();
    }
  }
  const cnt = document.getElementById('etiquetasCount');
  if (cnt) cnt.textContent = `Seleccionadas: ${state.etiquetas.length} / 5`;
  if (state.etiquetas.length < 5) {
    state.historia = null;
    const hr = document.getElementById('historiaResult');
    const ht = document.getElementById('historiaText');
    if (ht) { ht.value = ''; ht.dispatchEvent(new Event('input')); }
    if (hr) hr.style.display = 'none';
  }
  checkValidation();
}

async function generarHistoria() {
  const tags = state.etiquetas.join(', ');
  const nombre = document.getElementById('nombre')?.value || 'el protagonista';
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const condicion = document.getElementById('condicion')?.value || '';
  const universo = document.getElementById('universo').value ? UNIVERSOS.find(u => u.id == document.getElementById('universo').value)?.name : '';
  const raza = getRazaCompleta() || document.getElementById('raza').value || '';
  const v = state.villain || {};
  const villainCtx = rol === 'Villano' ? `\nPerfil Villano: ${v.motivacion || '—'} | ${v.objetivo || '—'} | ${v.metodos || '—'} | ${v.debilidad || '—'} | ${v.crueldad || '—'}` : '';
  const ap = state.apariencia || {};
  const apCtx = (ap.cabello || ap.ojos || ap.piel || ap.ropaje) ? `\nApariencia: cabello ${ap.cabello || '—'}, ojos ${ap.ojos || '—'}, piel ${ap.piel || '—'}, ropaje ${ap.ropaje || '—'}` : '';
  const habs = state.habilidades.slice(0, 3).map(h => h.nombre).join(', ');
  const habCtx = habs ? `\nHabilidades clave: ${habs}` : '';
  const prompt = `Eres un narrador del universo S9U. Basándote en estos datos, genera UNA definición breve de la historia de ${nombre}. Debe sonar única, épica y específica (no genérica). Si el rol es Villano, que se sienta amenaza; si AntiHéroe, ambigüedad.\n\nNombre: ${nombre}\nRol: ${rol || '—'}\nCondición: ${condicion || '—'}\nUniverso: ${universo || '—'}\nRaza: ${raza}\nEtiquetas: ${tags}${villainCtx}${apCtx}${habCtx}\n\nSolo responde con la definición de historia, sin etiquetas ni explicaciones.`;
  let historia = await callGemini(prompt, 900);
  if (!historia) {
    const tono = rol === 'Villano' ? 'una sombra que corrompe' : rol === 'AntiHéroe' ? 'una fuerza ambigua' : 'una luz que resiste';
    historia = `${nombre} es ${tono} en ${universo || 'el multiverso'}. Como ${raza}, su existencia está marcada por ${tags.toLowerCase()}. Cada una de estas fuerzas moldeó su camino. Su destino fue forjado con cada decisión que tomó frente a lo imposible${villainCtx ? `, ${v.motivacion || 'su motivación'} lo impulsa hacia ${v.objetivo || 'su objetivo'}` : ''}.`;
  }
  state.historia = historia;
  const ht = document.getElementById('historiaText');
  const hr = document.getElementById('historiaResult');
  if (ht) { ht.value = historia; ht.dispatchEvent(new Event('input')); }
  if (hr) hr.style.display = 'block';
}

// ============================================================
// HISTORIA COMPLETA (BIOGRAFÍA) — IA + FALLBACK LOCAL
// ============================================================
function initHistoriaCompletaUI() {
  const ht = document.getElementById('historiaCompletaText');
  if (!ht) return;
  ht.value = state.historiaCompleta || '';
  ht.addEventListener('input', () => { state.historiaCompleta = ht.value });
}

function limpiarHistoriaCompleta() {
  state.historiaCompleta = '';
  const ht = document.getElementById('historiaCompletaText');
  if (ht) ht.value = '';
  snd('des');
}

function generarHistoriaCompletaLocal() {
  const nombre = document.getElementById('nombre')?.value || 'el protagonista';
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const condicion = document.getElementById('condicion')?.value || '—';
  const universoName = document.getElementById('universo')?.value ? UNIVERSOS.find(u => u.id == document.getElementById('universo').value)?.name : 'desconocido';
  const planeta = document.getElementById('planeta')?.value || '—';
  const raza = getRazaCompleta() || document.getElementById('raza')?.value || '—';
  const etiquetas = (state.etiquetas || []).join(' | ') || '—';
  const rasgos = (state.rasgos || []).slice(0, 10).join(', ') || '—';
  const deseos = (state.deseos || []).slice(0, 6).join(' | ') || '—';
  const detesta = (state.detesta || []).slice(0, 6).join(', ') || '—';
  const test = (Object.values(state.test || {}).map(x => x.t).join(' | ') || '—').slice(0, 520);
  const rels = (state.rels || []).slice(0, 4).map(r => `[${r.tipo}] ${r.nombre}`).join(' | ') || '—';
  const habs = (state.habilidades || []).slice(0, 4).map(h => h.nombre).join(' | ') || '—';
  const v = state.villain || {};
  const villainLine = rol === 'Villano' ? ` Motivación: ${v.motivacion || '—'}. Objetivo: ${v.objetivo || '—'}. Métodos: ${v.metodos || '—'}. Debilidad: ${v.debilidad || '—'}.` : '';
  const tono = rol === 'Villano' ? 'amenaza que se organiza' : rol === 'AntiHéroe' ? 'ambigüedad peligrosa' : 'voluntad que resiste';
  return `${nombre} es una ${tono} en ${universoName} (planeta: ${planeta}). Como ${raza}, su condición como ${condicion} marca su forma de actuar.${villainLine}\n\nEtiquetas: ${etiquetas}.\nRasgos dominantes: ${rasgos}.\nDeseos: ${deseos}.\nDetesta: ${detesta}.\nRelaciones: ${rels}.\nHabilidades: ${habs}.\n\nEl Test de Convergencia (síntesis): ${test}…\n\nSu historia no es un resumen: es un sistema. Un pasado que empuja, un presente que aprieta, y un futuro que observa como si ya estuviera escrito.`;
}

async function generarHistoriaCompleta() {
  const ht = document.getElementById('historiaCompletaText');
  if (!ht) { snd('err'); return; }
  ht.value = 'Generando historia...';
  const nombre = document.getElementById('nombre')?.value || 'el protagonista';
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const condicion = document.getElementById('condicion')?.value || '—';
  const universoName = document.getElementById('universo')?.value ? UNIVERSOS.find(u => u.id == document.getElementById('universo').value)?.name : 'desconocido';
  const planeta = document.getElementById('planeta')?.value || '—';
  const raza = getRazaCompleta() || document.getElementById('raza')?.value || '—';
  const etiquetas = (state.etiquetas || []).join(' | ') || '—';
  const rasgos = (state.rasgos || []).join(', ') || '—';
  const deseos = (state.deseos || []).join(' | ') || '—';
  const detesta = (state.detesta || []).join(', ') || '—';
  const testList = Object.values(state.test || {}).map((x, i) => `${i + 1}. ${x.t}`).join('\n') || '—';
  const relLine = (state.rels || []).slice(0, 8).map(r => `[${r.tipo}] ${r.nombre}: ${r.desc}`).join(' || ') || '—';
  const habLine = (state.habilidades || []).slice(0, 10).map(h => h.nombre + ': ' + h.desc).join(' || ') || '—';
  const v = state.villain || {};
  const villainCtx = rol === 'Villano' ? `\nPerfil Villano: motivación=${v.motivacion || '—'}; objetivo=${v.objetivo || '—'}; métodos=${v.metodos || '—'}; debilidad=${v.debilidad || '—'}; crueldad=${v.crueldad || '—'}` : '';

  let historia = null;
  if (state.settings.useGemini && geminiKey && geminiKey.length > 10) {
    try {
      const prompt = `Eres un narrador cinematográfico del universo S9U. Escribe una HISTORIA BASE del personaje para usar como biografía editable.\n\nReglas:\n- Español.\n- 260 a 420 palabras.\n- Debe integrar la interpretación del TEST 20/20 (no lo copies literalmente: sintetiza patrones).\n- Debe sonar específica, no genérica.\n- Si el rol es Villano: tono de amenaza, control y destino oscuro.\n- No uses emojis ni listas.\n\nDATOS\nNombre: ${nombre}\nRol: ${rol || '—'}\nCondición: ${condicion || '—'}\nUniverso: ${universoName} | Planeta: ${planeta}\nRaza: ${raza}\nEtiquetas: ${etiquetas}\nRasgos: ${rasgos}\nDeseos: ${deseos}\nDetesta: ${detesta}\nRelaciones: ${relLine}\nHabilidades: ${habLine}${villainCtx}\n\nTEST 20/20 (respuestas del usuario):\n${testList}\n\nEntrega solo la historia.`;
      historia = await callGemini(prompt, 700);
    } catch (e) {
      console.error('generarHistoriaCompleta Gemini error:', e);
      historia = null;
    }
  }
  if (!historia) historia = generarHistoriaCompletaLocal();
  state.historiaCompleta = historia;
  ht.value = historia;
  snd('ok');
}

// ============================================================
// HOBBIES / DETESTA / DESEOS / RASGOS
// ============================================================
function syncDetestaDisabled() {
  document.querySelectorAll('#destestaGrid .chip').forEach(c => {
    if (!c.classList.contains('active') && state.detesta.length >= 8) c.classList.add('disabled');
    else c.classList.remove('disabled');
  });
}
function syncRasgosDisabled() {
  document.querySelectorAll('#rasgosGrid .chip').forEach(c => {
    if (!c.classList.contains('active') && state.rasgos.length >= 20) c.classList.add('disabled');
    else c.classList.remove('disabled');
  });
}
function toggleDetesta(name, chip) {
  const idx = state.detesta.indexOf(name);
  if (idx > -1) {
    state.detesta.splice(idx, 1);
    chip.classList.remove('active');
    snd('des');
  } else {
    if (state.detesta.length >= 8) { snd('err'); return }
    state.detesta.push(name);
    chip.classList.add('active');
    snd('sel');
  }
  document.getElementById('destestaCount').textContent = `Seleccionados: ${state.detesta.length} / máx 8`;
  syncDetestaDisabled();
  checkValidation();
}
function toggleRasgo(name, chip) {
  const idx = state.rasgos.indexOf(name);
  if (idx > -1) {
    state.rasgos.splice(idx, 1);
    chip.classList.remove('active');
    snd('des');
  } else {
    if (state.rasgos.length >= 20) { snd('err'); return }
    state.rasgos.push(name);
    chip.classList.add('active');
    snd('sel');
  }
  document.getElementById('rasgosCount').textContent = `Seleccionados: ${state.rasgos.length} / máx 20`;
  syncRasgosDisabled();
  checkValidation();
}
function poblarHobbies() {
  const g = document.getElementById('hobbiesGrid');
  if (!g) return;
  g.innerHTML = '';
  const ai = (state.aiSuggestions?.hobbies || []);
  const list = [...HOBBIES, ...ai].map(x => String(x).trim()).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  list.forEach(h => { const c = document.createElement('div'); c.className = 'chip'; if (state.hobbies.includes(h)) c.classList.add('active'); c.innerHTML = `<i class="fas fa-circle"></i>${h}`; c.onclick = () => { const idx = state.hobbies.indexOf(h); if (idx > -1) { state.hobbies.splice(idx, 1); c.classList.remove('active'); snd('des') } else { state.hobbies.push(h); c.classList.add('active'); snd('sel') } document.getElementById('hobbiesCount').textContent = `Seleccionados: ${state.hobbies.length}`; checkValidation() }; g.appendChild(c) });
  document.getElementById('hobbiesCount').textContent = `Seleccionados: ${state.hobbies.length}`;
  requestAISuggestions('hobbies');
}

function poblarDetesta() {
  const g = document.getElementById('destestaGrid');
  if (!g) return;
  g.innerHTML = '';
  const base = getDetestaList();
  const ai = (state.aiSuggestions?.detesta || []);
  const merged = [...base, ...ai].filter(x => x && x.n).map(x => ({ n: String(x.n).trim(), a: String(x.a || '').trim() || 'IA' }));
  const uniq = []; const seen = new Set();
  merged.forEach(x => { if (!x.n) return; const k = x.n.toLowerCase(); if (seen.has(k)) return; seen.add(k); uniq.push(x) });
  const allow = uniq.map(x => x.n);
  state.detesta = (state.detesta || []).filter(x => allow.includes(x));
  uniq.forEach(d => { const c = document.createElement('div'); c.className = 'chip'; if (state.detesta.includes(d.n)) c.classList.add('active'); c.innerHTML = `<i class="fas fa-circle"></i>${d.n} <span style="font-size:9px;opacity:.4">[${d.a}]</span>`; c.onclick = () => toggleDetesta(d.n, c); g.appendChild(c) });
  document.getElementById('destestaCount').textContent = `Seleccionados: ${state.detesta.length} / máx 8`;
  syncDetestaDisabled();
  requestAISuggestions('detesta');
}

function poblarDeseos() {
  const g = document.getElementById('deseosGrid');
  if (!g) return;
  g.innerHTML = '';
  const base = getDeseosList();
  const ai = (state.aiSuggestions?.deseos || []);
  const merged = [...base, ...ai].filter(x => x && x.n).map(x => ({ n: String(x.n).trim(), d: String(x.d || '').trim(), f: String(x.f || '').trim() }));
  const uniq = []; const seen = new Set();
  merged.forEach(x => { const k = x.n.toLowerCase(); if (seen.has(k)) return; seen.add(k); uniq.push(x) });
  const allow = uniq.map(x => x.n);
  state.deseos = (state.deseos || []).filter(x => allow.includes(x));
  uniq.forEach((d, i) => { const card = document.createElement('div'); card.className = 'rel-card'; card.style.cursor = 'pointer'; card.innerHTML = `<div style="display:flex;align-items:flex-start;gap:10px"><input type="checkbox" class="cbox" id="dcb${i}"><div><div style="font-weight:700;font-size:14px;color:#e2e8f0">${d.n}</div><div style="font-size:11px;opacity:.55;margin-top:2px">${d.d}</div><div style="font-size:10px;color:var(--accent);opacity:.7;margin-top:4px;font-style:italic">${d.f}</div></div></div>`; card.onclick = e => { if (e.target.tagName !== 'INPUT') document.getElementById('dcb' + i).click() }; g.appendChild(card); const cbEl = document.getElementById('dcb' + i); if (cbEl) { cbEl.checked = state.deseos.includes(d.n); cbEl.addEventListener('change', function () { const cb = this; if (cb.checked) { if (state.deseos.length >= 6) { cb.checked = false; snd('err'); return } state.deseos.push(d.n); snd('sel') } else { const idx = state.deseos.indexOf(d.n); if (idx > -1) state.deseos.splice(idx, 1); snd('des') } document.getElementById('deseosCount').textContent = `Seleccionados: ${state.deseos.length} / 6`; uniq.forEach((_, j) => { const c = document.getElementById('dcb' + j); if (c && !c.checked && state.deseos.length >= 6) c.disabled = true; else if (c) c.disabled = false }); checkValidation() }) } });
  document.getElementById('deseosCount').textContent = `Seleccionados: ${state.deseos.length} / 6`;
  uniq.forEach((_, j) => { const c = document.getElementById('dcb' + j); if (c && !c.checked && state.deseos.length >= 6) c.disabled = true; else if (c) c.disabled = false });
  requestAISuggestions('deseos');
}

function poblarRasgos() {
  const g = document.getElementById('rasgosGrid');
  if (!g) return;
  g.innerHTML = '';
  const base = getRasgosCat();
  const ai = state.aiSuggestions?.rasgos;
  const cats = {};
  Object.entries(base).forEach(([k, v]) => { cats[k] = [...v] });
  if (ai && typeof ai === 'object') {
    Object.entries(ai).forEach(([k, v]) => {
      if (!Array.isArray(v)) return;
      if (!cats[k]) cats[k] = [];
      v.forEach(x => { const t = String(x).trim(); if (t && !cats[k].includes(t)) cats[k].push(t) });
    });
  }
  const allow = Object.values(cats).flat();
  state.rasgos = (state.rasgos || []).filter(x => allow.includes(x));
  Object.entries(cats).forEach(([cat, rasgos]) => { const sec = document.createElement('div'); sec.innerHTML = `<div style="font-family:'Orbitron';font-size:10px;color:var(--accent);letter-spacing:1.5px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid rgba(59,130,246,.15)">${cat}</div>`; const w = document.createElement('div'); w.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px'; rasgos.forEach(r => { const c = document.createElement('div'); c.className = 'chip'; if (state.rasgos.includes(r)) c.classList.add('active'); c.innerHTML = `<i class="fas fa-circle"></i>${r}`; c.onclick = () => toggleRasgo(r, c); w.appendChild(c) }); sec.appendChild(w); g.appendChild(sec) });
  document.getElementById('rasgosCount').textContent = `Seleccionados: ${state.rasgos.length} / máx 20`;
  syncRasgosDisabled();
  requestAISuggestions('rasgos');
}

// ============================================================
// TEST
// ============================================================
// ============================================================
// QUESTIONS DATABASE (DYNAMIC)
// ============================================================
const QUESTIONS_DB = [
  // --- GENERIC (Base fallback) ---
  { id: 'g1', q: 'Ante un conflicto inevitable, ¿cuál es tu primera reacción?', o: ['Atacar primero para asegurar ventaja', 'Buscar una solución diplomática', 'Analizar la debilidad del oponente', 'Proteger a los débiles y esperar'], tags: { u: ['all'], a: ['all'] } },
  { id: 'g2', q: '¿Qué valoras más en un aliado?', o: ['Su fuerza bruta', 'Su lealtad inquebrantable', 'Su inteligencia estratégica', 'Su capacidad de sacrificio'], tags: { u: ['all'], a: ['all'] } },
  { id: 'g3', q: 'Si pudieras cambiar una cosa del mundo, ¿qué sería?', o: ['Eliminar la debilidad', 'Acabar con la injusticia', 'Revelar todas las verdades', 'Detener el sufrimiento'], tags: { u: ['all'], a: ['all'] } },
  { id: 'g4', q: 'Tu mayor miedo es...', o: ['Ser olvidado', 'Perder el control', 'Ser traicionado', 'No poder proteger a nadie'], tags: { u: ['all'], a: ['all'] } },
  { id: 'g5', q: 'El poder es para...', o: ['Conquistar', 'Servir', 'Comprender', 'Sobrevivir'], tags: { u: ['all'], a: ['all'] } },
  { id: 'g6', q: '¿Cómo enfrentas la soledad?', o: ['La uso para fortalecerme', 'Busco compañía inmediatamente', 'Reflexiono sobre mis planes', 'La acepto como parte del camino'], tags: { u: ['all'], a: ['all'] } },

  // --- UNIVERSE SPECIFIC ---
  // Anime
  { id: 'u_anime_1', q: 'En medio del torneo, tu rival revela una técnica prohibida. Tú...', o: ['Sonríes y liberas tu verdadero poder', 'Adviertes al árbitro sobre el peligro', 'Analizas el patrón de su energía', 'Te interpones para que no dañe al público'], tags: { u: ['anime'], a: ['all'] } },
  { id: 'u_anime_2', q: 'El villano te ofrece unirte a él para "salvar" el mundo a su manera.', o: ['Jamás. ¡Lo derrotaré aquí y ahora!', 'Le pregunto sus motivos reales', 'Finjo aceptar para traicionarlo luego', 'Dudo... su lógica tiene sentido'], tags: { u: ['anime'], a: ['all'] } },
  // D&D
  { id: 'u_dnd_1', q: 'El grupo encuentra un cofre con runas de advertencia. Tú...', o: ['Lo abro de una patada (Fuerza)', 'Busco trampas con cuidado (Destreza)', 'Intento descifrar la magia (Inteligencia)', 'Advierto que es mejor no tocarlo (Sabiduría)'], tags: { u: ['dnd'], a: ['all'] } },
  { id: 'u_dnd_2', q: 'Un dragón bloquea el paso y exige un tributo.', o: ['Desenvaino mi arma. Hoy ceno dragón.', 'Intento persuadirlo o engañarlo.', 'Ofrezco algo de valor por el paso.', 'Busco una ruta alternativa en silencio.'], tags: { u: ['dnd'], a: ['all'] } },
  // Star Wars
  { id: 'u_sw_1', q: 'Sientes una perturbación en la Fuerza.', o: ['La uso para potenciar mi ataque', 'Medito para encontrar su origen', 'Me preparo para defender a mis amigos', 'Dejo que el odio fluya'], tags: { u: ['starwars'], a: ['all'] } },
  { id: 'u_sw_2', q: 'Un Lord Sith te ofrece enseñarte a salvar a quienes amas.', o: ['Acepto. El fin justifica los medios.', 'Lo rechazo. Es el camino al Lado Oscuro.', 'Lo escucho para aprender sus debilidades.', 'Ataco antes de que termine la frase.'], tags: { u: ['starwars'], a: ['all'] } },
  // Harry Potter
  { id: 'u_hp_1', q: 'Un hechizo prohibido podría salvar a tu amigo, pero te expulsarían.', o: ['Lo lanzo sin dudar.', 'Busco un contrahechizo legal rápidamente.', 'Pido ayuda a un profesor.', 'Lo uso y borro la memoria de los testigos.'], tags: { u: ['harrypotter'], a: ['all'] } },
  // Pokemon
  { id: 'u_pk_1', q: 'Tu Pokémon está herido pero el líder de gimnasio tiene un solo Pokémon.', o: ['Confío en su espíritu y ataco.', 'Uso una poción aunque pierda el turno.', 'Lo retiro. No vale la pena el riesgo.', 'Uso autodestrucción para el empate.'], tags: { u: ['pokemon'], a: ['all'] } },
  // GOT
  { id: 'u_got_1', q: 'El Rey te ordena ejecutar a un inocente o tu familia sufrirá.', o: ['Ejecuto al inocente. La familia es primero.', 'Me niego y acepto las consecuencias.', 'Planeo una rebelión en secreto.', 'Huyo con mi familia esa noche.'], tags: { u: ['got'], a: ['all'] } },

  // --- ANIMAL SPECIFIC (Totemic) ---
  // Depredadores (Leon, Lobo, Pantera, Tigre, Aguila)
  { id: 'a_pred_1', q: 'Tu instinto despierta ante una presa herida.', o: ['Acabo con su sufrimiento rápido.', 'La dejo ir, no es un desafío.', 'Juego con ella antes del final.', 'La protejo de otros depredadores.'], tags: { u: ['all'], a: ['leon', 'lobo', 'pantera', 'tigre', 'aguila'] } },
  // Leon
  { id: 'a_leon_1', q: 'Un joven desafía tu posición en la manada.', o: ['Rugir y demostrar quién manda.', 'Aceptar el reto con honor.', 'Ignorarlo, no es rival.', 'Expulsarlo del territorio.'], tags: { u: ['all'], a: ['leon'] } },
  // Lobo
  { id: 'a_lobo_1', q: 'La manada ha perdido el rastro en la tormenta.', o: ['Tomo la delantera y aúllo.', 'Busco el rastro yo mismo.', 'Espero a que pase la tormenta.', 'Nos agrupamos para darnos calor.'], tags: { u: ['all'], a: ['lobo'] } },
  // Aguila/Halcon
  { id: 'a_fly_1', q: 'Desde las alturas, ves una amenaza que nadie más ve.', o: ['Me lanzo en picada a atacar.', 'Grito para advertir a todos.', 'Observo para entender la amenaza.', 'Calculo el momento exacto para golpear.'], tags: { u: ['all'], a: ['aguila', 'halcon', 'fenix', 'buho', 'paloma'] } },
  // Serpiente
  { id: 'a_serp_1', q: 'Estás acorralado y el enemigo es más fuerte.', o: ['Ataco venenosamente a sus puntos débiles.', 'Me escabullo entre las sombras.', 'Espero el momento de su descuido.', 'Intimido con un siseo advertencia.'], tags: { u: ['all'], a: ['serpiente'] } },
  // Tortuga
  { id: 'a_tort_1', q: 'El ataque es incesante y brutal.', o: ['Me refugio en mi caparazón y resisto.', 'Avanzo lento pero imparable.', 'Espero a que se canse.', 'Contraataco cuando baja la guardia.'], tags: { u: ['all'], a: ['tortuga'] } },
  // Buho
  { id: 'a_buho_1', q: 'La oscuridad oculta la verdad.', o: ['Mis ojos ven lo que otros no.', 'Escucho el silencio.', 'Medito en la oscuridad.', 'Espero a la luz de la luna.'], tags: { u: ['all'], a: ['buho'] } }
];

function getPreguntasTest() {
  // 1. Get Context
  const uniId = document.getElementById('universo')?.value || 'anime';
  const animalId = state.animal || ''; // ID of selected animal

  // 2. Filter pools
  // A) Universe Questions (High Priority)
  const uPool = QUESTIONS_DB.filter(q => q.tags.u.includes(uniId));

  // B) Animal Questions (High Priority)
  // Matches specific animal ID OR animal category if we imply categories, 
  // but for now tags match exact IDs in QUESTIONS_DB.
  // We can also allow generic animal tags if we map IDs to groups, but simpler is direct match.
  const aPool = QUESTIONS_DB.filter(q => q.tags.a.includes(animalId));

  // C) Generic Questions (Fallback)
  const gPool = QUESTIONS_DB.filter(q => q.tags.u.includes('all') && q.tags.a.includes('all'));

  // 3. Selection Strategy (Target: 20 eqs)
  // Pick all Specific Animal ones first
  // Pick all Specific Universe ones second
  // Fill rest with Generic

  let selected = [];
  const seen = new Set();

  const add = (list) => {
    list.forEach(q => {
      if (!seen.has(q.id)) {
        selected.push(q);
        seen.add(q.id);
      }
    });
  };

  // Shuffle helper
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  add(shuffle(aPool));
  add(shuffle(uPool));

  // If we don't have enough, fill with generic (shuffled)
  if (selected.length < 20) {
    const needed = 20 - selected.length;
    const gShuffled = shuffle(gPool);
    add(gShuffled.slice(0, needed));
  }

  // If mostly filled but not exactly 20 (e.g. if specific pools are huge), slice.
  // If still < 20 because DB is small, repeat generic or keep short (UI handles it).
  // With current DB, we have ~6 generic + ~2 specific. 
  // Realistically we need more generic questions to reach 20 unique ones without repetition 
  // if specific context is thin.
  // Let's assume we allow < 20 if DB is small, but ideally we add more generics.
  // I will add a few more generics to the DB in the injected code to be safe.

  return selected.slice(0, 20);
}

function poblarTest() {
  const c = document.getElementById('testContainer');
  if (!c) return;
  const role = document.getElementById('rolNarrativo')?.value || '';
  if (state.testRole !== role) {
    state.test = {};
    state.testRole = role;
    const tp = document.getElementById('testProgress');
    const bar = document.getElementById('testProgressBar');
    if (tp) tp.textContent = '0 / 20';
    if (bar) bar.style.width = '0%';
  }
  const preguntas = getPreguntasTest();
  c.innerHTML = '';
  preguntas.forEach((p, qi) => {
    const d = document.createElement('div');
    d.style.cssText = 'background:rgba(0,0,0,.3);border:1px solid rgba(59,130,246,.18);border-radius:10px;padding:16px';
    d.innerHTML = `<p style="font-weight:600;font-size:13px;margin-bottom:10px;color:#cbd5e1"><span style="color:var(--primary);font-family:'Orbitron';font-size:10px">[${(qi + 1).toString().padStart(2, '0')}]</span> ${p.q}</p><div style="display:flex;flex-direction:column;gap:6px">${p.o.map((o, oi) => `<button class="qbtn" id="qb${qi}_${oi}" onclick="ansTest(${qi},${oi},this)"><span class="qnum">${String.fromCharCode(65 + oi)}</span>${o}</button>`).join('')}</div>`;
    c.appendChild(d);
    if (state.test?.[qi]) {
      const chosen = state.test[qi].i;
      const b = document.getElementById(`qb${qi}_${chosen}`);
      if (b) b.classList.add('selected');
    }
  });
}

function ansTest(qi, oi, btn) {
  const preguntas = getPreguntasTest();
  state.test[qi] = { i: oi, t: preguntas[qi].o[oi] };
  for (let i = 0; i < 4; i++) {
    const b = document.getElementById(`qb${qi}_${i}`);
    if (b) b.classList.remove('selected');
  }
  btn.classList.add('selected');
  const tp = document.getElementById('testProgress');
  const bar = document.getElementById('testProgressBar');
  const answered = Object.keys(state.test).length;
  if (tp) tp.textContent = `${answered} / 20`;
  if (bar) bar.style.width = (answered / 20 * 100) + '%';
  checkValidation();
}

// ============================================================
// DIÁLOGO — EXPRESIÓN DEL PERSONAJE
// ============================================================
function poblarDialogue() {
  const div = document.getElementById('dialogueCharacters');
  if (div) div.innerHTML = '';
  Object.entries(SCENES).forEach(([k, s]) => {
    const card = document.createElement('button');
    card.className = 'character-card' + (k === 'belcebu' ? ' active' : '');
    card.dataset.character = k;
    card.onclick = () => cambiarEscena(k);
    const iconHtml = s.img ? `<div class="char-icon has-img" style="background-image:url('${s.img}')"></div>` : `<div class="char-icon">${s.e}</div>`;
    card.innerHTML = `${iconHtml}<div class="char-name">${s.n}</div>`;
    div.appendChild(card);
  });
  cambiarEscena('belcebu', { noFocus: true, noAutoScroll: true });
}

function cambiarEscena(key, opts) {
  opts = opts || {};
  state.currentScene = key; const sc = SCENES[key];
  const sceneInfo = document.getElementById('dialogueScene');
  if (sceneInfo) { sceneInfo.innerHTML = `<i class="fas fa-comments"></i> ${sc.e} ${sc.n}`; sceneInfo.className = 'dialogue-scene'; }
  const log = document.getElementById('msgLog'); log.innerHTML = '';
  // Enable input and button when selecting a character
  const input = document.getElementById('dialogueInput');
  const btn = document.querySelector('.dialogue-send');
  if (input) {
    input.disabled = false;
    input.style.opacity = '1';
    input.style.cursor = 'text';
    input.placeholder = 'Escribe como lo haría tu personaje...';
  }
  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
  }
  const role = document.getElementById('rolNarrativo')?.value || '';
  const isVillain = role === 'Villano';
  const history = (state.dialogueLogs && state.dialogueLogs[key]) ? state.dialogueLogs[key] : [];

  // Siempre renderizar historial si existe (también en Villano)
  if (history.length) {
    history.forEach(m => {
      log.innerHTML += `<div class="${m.role === 'player' ? 'player-msg' : 'npc-msg'}">${m.t}</div>`;
    });
  } else {
    // Sin historial: mostrar introducción del personaje con imagen al costado
    const introHtml = `
          <div class="npc-intro-container" style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
             ${sc.img ? `<div class="npc-portrait" style="width: 80px; height: 80px; background-image: url('${sc.img}'); background-size: cover; background-position: center; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5); flex-shrink: 0;"></div>` : ''}
             <div class="npc-msg" style="margin: 0; flex-grow: 1;">${sc.o}</div>
          </div>
        `;
    log.innerHTML += introHtml;
  }

  // Presets: normal usa botones; villano usa presets editables (con 10+ opciones)
  if (!history.length) {
    if (isVillain) {
      const list = SCENES_PRESETS_VILLAIN?.[key] || sc.presets || [];
      const presetsDiv = document.createElement('div'); presetsDiv.id = 'presets_' + key; presetsDiv.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:8px';
      list.forEach((p, i) => {
        const presetOpt = document.createElement('div'); presetOpt.className = 'preset-opt'; presetOpt.id = 'po_' + key + '_' + i;
        presetOpt.innerHTML = `<span id="pot_${key}_${i}" contenteditable="true" style="flex:1;outline:none;min-width:0">${p}</span><button class="use-btn" onclick="usePreset('${key}',${i})">USO →</button>`;
        presetsDiv.appendChild(presetOpt);
      });
      log.appendChild(presetsDiv);
    } else {
      const presets = document.createElement('div'); presets.id = 'presets_' + key; presets.className = 'presets';
      presets.innerHTML = sc.presets.map((p, i) => `<button class="preset-btn" id="pot_${key}_${i}" onclick="usePreset('${key}',${i})">${p}</button>`).join('');
      log.appendChild(presets);
    }
  }
  // Check if scene is locked and apply lock if needed
  const isLocked = (state.lockedScenes || {})[key];
  if (isLocked) {
    if (input) {
      input.disabled = true;
      input.style.opacity = '0.5';
      input.style.cursor = 'not-allowed';
      input.placeholder = 'Esta conversación ya está finalizada';
    }
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    }
  }
  // Update active character card
  document.querySelectorAll('.character-card').forEach(card => card.classList.remove('active'));
  document.querySelectorAll('.character-card').forEach(card => {
    if (card.dataset.character === key) card.classList.add('active');
  });
  // Apply locked style to character card if needed
  document.querySelectorAll('.character-card').forEach(card => {
    const charKey = card.dataset.character;
    const locked = (state.lockedScenes || {})[charKey];
    if (locked) {
      card.classList.add('locked');
    } else {
      card.classList.remove('locked');
    }
  });
  if (!opts.noFocus) input?.focus();
  if (!opts.noAutoScroll) log.scrollTop = log.scrollHeight;
  snd('msg');
}

function initScrollTopBtn() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  const update = () => {
    const doc = document.documentElement;
    const atBottom = (window.innerHeight + window.scrollY) >= (doc.scrollHeight - 8);
    btn.classList.toggle('open', atBottom);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function scrollToTop() {
  try { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }) } catch (e) { window.scrollTo(0, 0) }
}

async function sendDialogue() {
  const input = document.getElementById('dialogueInput'), text = input.value.trim();
  if (!text) return;
  input.value = '';
  const key = state.currentScene;
  if (!key) return;
  const sc = SCENES[key];
  if (state.dialogueLocked) { return; }
  state.dialogueLogs[key] = state.dialogueLogs[key] || [];
  state.dialogueLogs[key].push({ role: 'player', t: text });
  // Eliminar presets si son visibles
  const presets = document.getElementById('presets_' + key); if (presets) presets.remove();
  // Renderizar mensaje del jugador
  const log = document.getElementById('msgLog');
  log.innerHTML += `<div class="player-msg">${text}</div>`;
  snd('msg');
  // Detectar estilo y actualizar badge
  const style = detectStyle(text);
  state.styleHistory.push(style);
  updateStyleBadges();
  // Mostrar indicador de escritura
  log.innerHTML += `<div class="typing-indicator" id="typing"><span></span><span></span><span></span></div>`;
  log.scrollTop = log.scrollHeight;

  // Generar respuesta del NPC
  setTimeout(async () => {
    let npcReply = null;
    // Intentar Gemini con prompt mejorado
    if (geminiKey && geminiKey.length > 10) {
      try {
        const history = state.dialogueLogs[key].map(m => m.role === 'player' ? `Usuario: ${m.t}` : `${sc.n}: ${m.t}`).join('\n');
        const rol = document.getElementById('rolNarrativo')?.value || '';
        const isVillain = rol === 'Villano';
        const v = state.villain || {};
        const villainCtx = isVillain ? `\nPerfil Villano del usuario: motivación=${v.motivacion || '—'}; objetivo=${v.objetivo || '—'}; métodos=${v.metodos || '—'}; debilidad=${v.debilidad || '—'}; crueldad=${v.crueldad || '—'}.` : '';
        const psychoCtx = `\nRasgos del usuario: ${(state.rasgos || []).slice(0, 8).join(', ') || '—'}.\nDeseos del usuario: ${(state.deseos || []).slice(0, 6).join(' | ') || '—'}.\nEstilo detectado: "${style}".`;
        const baseRules = `\n\nReglas de adaptación:\n- Si el usuario está "Amenazante" o "Agresivo": responde con frialdad calculada, autoridad y control (no te alteres).\n- Si el usuario está "Sarcástico": responde con precisión, un toque de ironía fina o superioridad, sin caer en chistes modernos.\n- Si el usuario está "Curioso": responde con misterio, pistas y descubrimiento.\n- Si el usuario está "Filosófico": responde con profundidad, símbolos y verdad incómoda.\n- Si el usuario está "Ansioso": baja el ritmo, da contención y claridad.\n- Si el usuario está "Esperanzado": responde con impulso, propósito y visión.\n- Si el usuario está "Melancólico" o "Emocional": responde con empatía, peso narrativo y humanidad.\n- Si el usuario está "Reflexivo": responde con calma y preguntas guía.`;
        const villainRules = isVillain ? `\n\nModo Villano (oscuro):\n- Responde con amenaza elegante, control, inevitabilidad y dominio; no seas infantil ni vulgar.\n- Usa lenguaje cinematográfico, simbólico y opresivo.\n- Puedes mentir, manipular o prometer poder; siempre con subtexto.\n- Si el usuario intenta imponerse, responde con superioridad fría (sin gritar).\n- No uses emojis, ni jerga moderna.` : '';
        const prompt = `Eres ${sc.n} en el universo S9U. Contexto: ${sc.d}.\nHistorial de la conversación:\n${history}${villainCtx}${psychoCtx}${baseRules}${villainRules}\n\nResponde como ${sc.n}. Solo la respuesta del personaje, sin etiquetas. Puedes extenderte si es necesario.`;
        npcReply = await callGemini(prompt, 600);
      } catch (e) {
        console.error('Gemini error:', e);
        npcReply = null;
      }
    }
    if (!npcReply) {
      try {
        npcReply = generarNPCLocal(key, text, style);
      } catch (e) {
        console.error('Local generation error:', e);
        npcReply = "—No tengo respuesta para eso ahora.";
      }
    }
    // Always show response
    const typing = document.getElementById('typing');
    if (typing) typing.remove();

    // Ensure npcReply is valid
    if (!npcReply || typeof npcReply !== 'string' || npcReply.trim().length === 0) {
      npcReply = "—No tengo respuesta para eso ahora.";
    }

    state.dialogueLogs[key].push({ role: 'npc', t: npcReply });
    log.innerHTML += `<div class="npc-msg">${npcReply}</div>`;
    log.scrollTop = log.scrollHeight;
    snd('msg');
    // Allow continuous responses, lock only after 4 NPC responses
    const npcCount = state.dialogueLogs[key].filter(m => m.role === 'npc').length;
    if (npcCount >= 4) {
      lockScene(key);
      const nextKey = nextUnlockedSceneKey();
      if (nextKey) cambiarEscena(nextKey);
      else finalizeDialogue();
    }
  }, 900);
}

function lockScene(key) {
  if (!state.lockedScenes) state.lockedScenes = {};
  state.lockedScenes[key] = true;
  // Disable input and button, but keep scene button selectable for viewing
  const input = document.getElementById('dialogueInput');
  const sendBtn = document.querySelector('.dialogue-send');
  if (input) {
    input.disabled = true;
    input.style.opacity = '0.5';
    input.style.cursor = 'not-allowed';
    input.placeholder = 'Esta conversación ya está finalizada';
  }
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.5';
    sendBtn.style.cursor = 'not-allowed';
  }
}

function finalizeDialogue() {
  const input = document.getElementById('dialogueInput');
  const btn = document.querySelector('.dialogue-send');
  if (input) {
    input.disabled = true;
    input.style.opacity = '0.5';
    input.style.cursor = 'not-allowed';
    input.placeholder = 'Conversación finalizada';
  }
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
  }
}

// Detección de estilo
function detectStyle(text) {
  const w = text.split(/\s+/).length, lower = text.toLowerCase();
  const threatening = lower.includes('te destruir') || lower.includes('te matar') || lower.includes('te voy a') || lower.includes('vas a caer') || lower.includes('vas a sufrir') || lower.includes('no escapar') || lower.includes('te quebrar') || lower.includes('te haré') || lower.includes('te voy a romper') || lower.includes('te voy a quebrar');
  const aggressive = lower.includes('ataco') || lower.includes('odio') || lower.includes('nunca') || lower.includes('no me') || lower.includes('imposible') || lower.includes('cállate') || lower.includes('basta') || text.includes('!');
  const sarcastic = lower.includes('sí, claro') || lower.includes('claro que sí') || lower.includes('ajá') || lower.includes('qué gracioso') || lower.includes('como digas') || lower.includes('seguro');
  const anxious = lower.includes('tengo miedo') || lower.includes('me asusta') || lower.includes('ansioso') || lower.includes('nervios') || lower.includes('no puedo') || lower.includes('me tiembla') || lower.includes('estoy perdido') || lower.includes('me preocupa');
  const hopeful = lower.includes('podemos') || lower.includes('lo lograremos') || lower.includes('confío') || lower.includes('esperanza') || lower.includes('vamos') || lower.includes('aún hay') || lower.includes('saldremos');
  const sad = lower.includes('triste') || lower.includes('lloro') || lower.includes('perdí') || lower.includes('me duele') || lower.includes('vacío') || lower.includes('cansado') || lower.includes('solo');
  const curious = lower.includes('?') || lower.includes('por qué') || lower.includes('cómo') || lower.includes('qué significa') || lower.includes('qué es') || lower.includes('explícame') || lower.includes('entiendo');
  const philosophical = lower.includes('dios') || lower.includes('verdad') || lower.includes('alma') || lower.includes('creador') || lower.includes('existencia') || lower.includes('destino') || lower.includes('sentido') || lower.includes('principio');
  const emotional = lower.includes('siento') || lower.includes('dolor') || lower.includes('miedo') || lower.includes('amor') || lower.includes('me rompe') || lower.includes('me importa');
  const calm = lower.includes('paz') || lower.includes('calma') || lower.includes('respirar') || lower.includes('tal vez') || lower.includes('quizás') || lower.includes('sereno');
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const isVillain = rol === 'Villano';
  const domine = isVillain && (lower.includes('obedece') || lower.includes('obedecer') || lower.includes('arrodíll') || lower.includes('inclínate') || lower.includes('somét') || lower.includes('dominar') || lower.includes('control') || lower.includes('mi reino') || lower.includes('mi ley') || lower.includes('te belongs') || lower.includes('me pertenec'));
  const manip = isVillain && (lower.includes('pacto') || lower.includes('trato') || lower.includes('acuerdo') || lower.includes('te conviene') || lower.includes('confía en mí') || lower.includes('hazlo por') || lower.includes('prometo') || lower.includes('te doy poder') || lower.includes('te ofrezco'));
  const cruel = isVillain && (lower.includes('dolor') || lower.includes('sufre') || lower.includes('sufrir') || lower.includes('tortur') || lower.includes('sangre') || lower.includes('desangr') || lower.includes('lento') || lower.includes('desgarr'));
  const profane = isVillain && (lower.includes('profan') || lower.includes('blasfem') || lower.includes('abismo') || lower.includes('inframundo') || lower.includes('demon') || lower.includes('maldic') || lower.includes('conden') || lower.includes('herej'));
  if (threatening || domine || cruel) return 'Amenazante';
  if (aggressive) return 'Agresivo';
  if (sarcastic) return 'Sarcástico';
  if (philosophical) return 'Filosófico';
  if (curious) return 'Curioso';
  if (manip) return 'Filosófico';
  if (profane) return 'Filosófico';
  if (anxious) return 'Ansioso';
  if (hopeful) return 'Esperanzado';
  if (sad && calm) return 'Melancólico';
  if (emotional && calm) return 'Empático';
  if (calm) return 'Reflexivo';
  if (sad || emotional) return 'Emocional';
  if (w > 18) return 'Narrativo';
  if (w < 4) return 'Conciso';
  return 'Directo';
}

function normalizeStyle(style) {
  if (style === 'Amenazante') return 'Agresivo';
  if (style === 'Sarcástico') return 'Filosófico';
  if (style === 'Ansioso') return 'Emocional';
  if (style === 'Esperanzado') return 'Curioso';
  if (style === 'Melancólico') return 'Emocional';
  return style;
}
function updateStyleBadges() {
  const div = document.getElementById('styleBadges');
  if (!div) return;
  const counts = {}; state.styleHistory.forEach(s => counts[s] = (counts[s] || 0) + 1);
  div.innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s, c]) => `<div class="style-badge"><i class="fas fa-circle" style="font-size:5px"></i>${s} <span style="opacity:.5">(${c})</span></div>`).join('');
}

// Local NPC responses (adaptado al estilo detectado)
function generarNPCLocal(key, playerText, style) {
  const sc = SCENES[key], lower = playerText.toLowerCase();
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const isVillain = rol === 'Villano';
  if (isVillain && SCENES_ALTERNATIVOS?.[key]) {
    if (style === 'Amenazante' || style === 'Agresivo' || style === 'Sarcástico' || style === 'Filosófico') {
      const alt = SCENES_ALTERNATIVOS[key];
      return alt[Math.floor(Math.random() * alt.length)];
    }
  }
  // Respuestas según escenario + adaptadas al estilo del jugador
  const R = {
    belcebu: {
      Agresivo: [
        "—Interesante. Así que prefieres la furia. —sonrió de oreja a oreja— Eso me resulta… familiar. Pero recuerda, pequeño: yo ya crucé ese puente hace eones. Al final, la ira no te salva. Solo te consume más rápido.",
        "—Bah. —cruzó los brazos— Esa energía te va a quemar por dentro antes de llegar a mí. Control, pequeño. El verdadero poder no grita.",
        "—¿Crees que asustarme? —rió con desdén— He visto ángeles arder por menos. Tu rabia es una vela en un huracán.",
        "—Sigue gritando. Cada grito tuyo me hace más fuerte. —se acercó— Tu resistencia es el mejor combustible para mi reino.",
        "—Fascinante. Te desgarra por dentro. —ladeó la cabeza— ¿Sabes qué? Eso es exactamente lo que el Creador vio en mí antes de caer.",
        "—La ira te ciega. —susurró— Yo puedo enseñarte a ver más allá… o a hundirte para siempre."
      ],
      Curioso: [
        "—Preguntas. Qué interesante. —ladeó la cabeza— Muy bien, te respondo: sí, yo conocí al Creador. Y sí, me traicionó. ¿Eso responde lo que realmente quieres saber?",
        "—Curiosidad… —murmulló— Esa es la misma curiosidad que destruyó mundos enteros. Pero está bien. Puedo satisfacerla.",
        "—¿Por qué preguntas? —se inclinó— ¿Crees que la verdad te hará libre? La verdad es una jaula, pequeño.",
        "—Sigue preguntando. —sonrió— Cada pregunta te acerca más a mi abismo… o a tu perdición.",
        "—La curiosidad mató al gato. —rió— Pero tú no eres un gato. Eres algo mucho más frágil."
      ],
      Filosófico: [
        "—Ah, buscas significado incluso aquí, en el Abismo. —se inclinó— Te diré que la oscuridad no tiene propósito. Yo te digo que sí: tu propósito es entender que no hay salvación.",
        "—Profundo. Más de lo que esperaba. —cruzó los brazos— Pero la filosofía no detiene el fuego, pequeño. Solo lo observa.",
        "—El propósito es una mentira que nos contamos para seguir respirando. —sonrió— Yo prefiero la verdad cruda.",
        "—¿Verdad? —rió— La verdad es que todo esto es un juego. Y tú ya perdiste."
      ],
      Amenazante: [
        "—¿Me amenazas? —rió con crueldad— Yo soy la pesadilla que persigue a las pesadillas.",
        "—Sigue hablando. —se acercó— Cada palabra tuya me acerca más a tu final.",
        "—Crees que tienes poder. —sonrió— No tienes idea de lo que es el verdadero poder.",
        "—Tu miedo es delicioso. —susurró— Huele a esperanza frágil."
      ],
      Sarcástico: [
        "—Ah, el sarcástico. —rió— Qué original. Nadie más ha intentado esto antes.",
        "—Sigue siendo ingenioso. —ladeó la cabeza— Mientras tanto, el universo se quema.",
        "—Qué divertido. —sonrió— ¿Crees que tus palabras me afectan?",
        "—El sarcasmo es el refugio de los impotentes. —rió— Sigue refugiándote."
      ],
      Emocional: [
        "—Ah, emociones. —sonríe con desdén— Qué frágil eres.",
        "—Sigue sintiendo. —ladeó la cabeza— El dolor te hace más interesante.",
        "—¿Vas a llorar? —ríe— Me encanta cuando se rompen.",
        "—Tus sentimientos son… predecibles. —suspira— Como todos los demás."
      ],
      default: [
        "—Tus palabras son interesantes pero no cambian nada. —dio un paso— El multiverso ya decidió su destino. Tú eres solo un suspiro en ese camino.",
        "—Hmm… quizás hay algo más en ti de lo que parece. —ladeó la cabeza— O quizás eres simplemente terco. De todas formas… el Abismo no perdona.",
        "—Sigue hablando. —sonríe— Me encanta escuchar intentos de sentido.",
        "—Interesante perspectiva. —ladeó la cabeza— Equivocada, pero interesante."
      ]
    },
    gabriel: {
      Agresivo: [
        "—Pausa un momento, amigo. —extendió la mano— La furia tiene su lugar, pero aquí no es ese lugar. —guiñó— Respira. Yo te entiendo mejor de lo que crees.",
        "—Tranquilo. —posó una mano en tu hombro— La ira nubla el juicio. Permíteme ayudarte a ver claro.",
        "—Siento esa rabia. —suspiró— Pero no te dejará avanzar. Déjala ir.",
        "—Respira conmigo. —inclinó la cabeza— La paz es posible, incluso en la tormenta."
      ],
      Curioso: [
        "—Una buena pregunta. —inclinó la cabeza— La respuesta no siempre viene del cielo. A veces está dentro de ti, esperando que la escuches con el corazón.",
        "—Eso merece reflexión. —sonrió cálido— El Creador no pone respuestas en los cielos. Las planta en tu camino, y tú las descubres caminando.",
        "—Sigue preguntando. —animó— La curiosidad es el primer paso hacia la sabiduría.",
        "—Interesante perspectiva. —ladeó la cabeza— ¿Qué te lleva a pensar eso?"
      ],
      Emocional: [
        "—Siento lo que sientes. —posó una mano— Y eso está bien. La fe no pide que no duele. Solo pide que sigas adelante después del dolor.",
        "—El peso que cargas es real. Pero no estás solo en este camino. Lo recordás cuando todo se oscurece.",
        "—Tus emociones son válidas. —sonrió compasivo— No las reprimas.",
        "—Está bien sentirse así. —suspiró— Yo también he sentido lo mismo."
      ],
      Filosófico: [
        "—La verdad que buscas existe. Pero no la vas a encontrar corriendo. A veces tienes que detenerte y simplemente… ser.",
        "—El propósito se revela en el camino, no al final. —sonrió— Confía en el proceso.",
        "—Cada paso tiene significado, incluso cuando no lo vemos. —ladeó la cabeza— Confía.",
        "—La sabiduría no siempre es ruidosa. —suspiró— A veces susurra."
      ],
      Amenazante: [
        "—Paz, amigo. —extendió la mano— La violencia no es el camino.",
        "—No necesitas hacer esto. —suspiró— Hay una mejor manera.",
        "—Detente un momento. —posó una mano— Reflexiona antes de actuar.",
        "—Esto no te define. —sonríe— Puedes elegir diferente."
      ],
      Sarcástico: [
        "—Ah, el ingenioso. —sonrió divertido— Casi me impresionas.",
        "—Sigue así. —rió— Algún día serás realmente divertido.",
        "—Qué agudo eres. —ladeó la cabeza— ¿Te sientes mejor ahora?",
        "—Muy original. —rió— Nadie más ha intentado esto antes."
      ],
      default: [
        "—Camina con calma, amigo. El Creador tiene un plan que aún no vemos. Confía en el camino y en lo que ya sientes adentro.",
        "—Tu corazón habla. Eso es más valioso que cualquier poder que te puedan dar los cielos.",
        "—Sigue adelante. —animó— Cada paso cuenta.",
        "—Confía en el proceso. —sonríe— Todo tiene su propósito."
      ]
    },
    eliane: {
      Agresivo: [
        "—Oh… —dio un paso atrás— No necesitas estar tan enojado aquí. Este lugar es para estar en paz. —se abrazó— ¿Qué te está pasando?",
        "—Por favor, no grites. —susurró— Esto es un lugar seguro.",
        "—Tranquilo. —extendió una mano temblorosa— No te haré daño.",
        "—Respira. —ladeó la cabeza— Todo estará bien.",
        "—Tu ira es como una tormenta. —la miró fijamente— Pero las tormentas también pasan.",
        "—No dejes que el enojo te ciegue. —su voz era suave— Aquí puedes soltarlo.",
        "—¿Por qué tanta furia? —preguntó con inocencia— ¿Qué es lo que realmente te duele?"
      ],
      Curioso: [
        "—Hmm… ¿y tú crees que Dios tiene un plan para cada uno de nosotros? —se acercó tímidamente— Yo sí creo. Especialmente después de ver la esfera de luz ese día.",
        "—Es curioso… —se sentó— Mi abuelo siempre decía que las preguntas más importantes no siempre tienen respuestas. Solo nos hacen más grandes.",
        "—¿Qué piensas? —inclinó la cabeza— Me encantaría saber tu opinión.",
        "—Interesante pregunta. —sonríe— ¿Qué te hace pensar eso?",
        "—Nunca lo había pensado así. —sus ojos brillaron— Cuéntame más.",
        "—A veces las respuestas están en el silencio. —susurró— ¿No crees?",
        "—El mundo es un misterio infinito. —sonrió— Y me alegra que quieras explorarlo."
      ],
      Emocional: [
        "—Me alegra que lo pienses así. —sonrió suavemente— A veces uno necesita escuchar que no está equivocado por seguir creyendo, aunque todo a alrededor diga lo contrario.",
        "—Eso me conmueve. —los ojos brillaron— Cuando hablas como eso, siento que este mundo tiene esperanza después de todo.",
        "—Gracias por ser tan honesto. —sonríe— Significa mucho para mí.",
        "—Siento lo mismo. —suspiró— No estoy sola en esto.",
        "—Tus palabras… —se llevó una mano al pecho— llegan profundo. Gracias.",
        "—Es hermoso ver que aún hay corazón en este mundo. —sonrió con ternura— No cambies.",
        "—Compartir esto contigo… —bajó la mirada— me hace sentir más fuerte."
      ],
      Filosófico: [
        "—A veces pienso que la fe es como una semilla. —miró por la ventana— Necesita oscuridad para crecer, pero siempre busca la luz.",
        "—Quizás el propósito no es encontrar respuestas, sino aprender a hacer las preguntas correctas. —sonríe pensativa— ¿No crees?",
        "—La vida es misteriosa. —suspiró— Pero eso la hace hermosa.",
        "—Quizás todo está conectado. —ladeó la cabeza— Como hilos invisibles.",
        "—Lo que dices tiene sentido. —miró el cielo— Tal vez somos notas en una canción que aún no entendemos.",
        "—La verdad es un espejo roto. —murmuró— Cada uno tiene un pedazo.",
        "—Si miramos con atención, todo tiene un porqué. —sonrió— Incluso este momento."
      ],
      Amenazante: [
        "—Por favor, no tengas miedo. —extendió una mano— No te haré daño.",
        "—Está bien. —susurró— Puedes confiar en mí.",
        "—No voy a lastimarte. —prometió— Estás seguro.",
        "—Respira. —animó— Todo está bien.",
        "—No veo oscuridad en ti, aunque intentes mostrarla. —sonrió valiente— Sé que hay luz.",
        "—Tu máscara de miedo no me asusta. —dio un paso al frente— Veo quién eres realmente.",
        "—Aquí nadie tiene que ser el villano. —su voz era firme— Puedes ser tú mismo."
      ],
      Sarcástico: [
        "—Ah, el ingenioso. —sonríe divertida— Casi me haces reír.",
        "—Muy divertido. —rió— Casi me impresionas.",
        "—Sigue así. —animó— Algún día serás realmente gracioso.",
        "—Qué original eres. —ladeó la cabeza— Nadie más ha dicho eso antes.",
        "—El humor es un buen escudo. —sonrió sabiendo— Pero no protege de todo.",
        "—Entiendo tu juego. —rió suavemente— Pero aquí puedes ser serio si quieres.",
        "—A veces reír es la mejor defensa. —asintió— Lo entiendo."
      ],
      default: [
        "—Es increíble que vengan de tan lejos. —se acercó— Desde que llegaron, la casa se siente diferente. " +
        "Más ligera. Como si algo oscuro se alejara poco a poco.",
        "—Me alegra que estén aquí. —miró por la ventana— Este lugar necesitaba de esa luz que traen.",
        "—Gracias por estar. —sonríe— Significa mucho para mí.",
        "—Este lugar se siente mejor contigo aquí. —ladeó la cabeza— Gracias.",
        "—Tu presencia cambia el aire. —respiró hondo— Se siente… esperanza.",
        "—A veces, solo compañía es todo lo que necesitamos. —sonrió— Y me alegra que sea la tuya.",
        "—No sé qué nos depara el destino, pero me alegra no enfrentarlo sola.",
        "—Hay algo en ti que me da paz. —admitió— Es un regalo raro.",
        "—Bienvenido… de verdad. —sonrió cálidamente— Siéntete en casa.",
        "—Espero que encuentres aquí lo que buscas. —dijo con sinceridad— O quizás, lo que necesitas."
      ]
    },
    david: {
      Agresivo: [
        "—Tranquilo, pequeño. —sonrió sin inmutarse— La furia tiene su lugar, pero aquí no es ese lugar. —guiñó— Respira. Yo te entiendo mejor de lo que crees.",
        "—La ira nubla la visión. —ladeó la cabeza— Permíteme ayudarte a ver claro.",
        "—Respira hondo. —extendió una mano— La paz es posible.",
        "—No dejes que la rabia te consuma. —sonríe— Hay algo mejor dentro de ti."
      ],
      Curioso: [
        "—Interesante pregunta. —ladeó la cabeza— ¿Y qué te hace pensar eso? A veces las respuestas más grandes están en las preguntas más pequeñas.",
        "—Eso es sabio preguntarlo. —cruzó los brazos con una sonrisa— El camino no siempre tiene que ser recto. A veces los rodeos son parte del destino.",
        "—Sigue preguntando. —animó— La curiosidad es el comienzo de la sabiduría.",
        "—Tu mente es brillante. —sonríe— Nunca dejes de preguntar."
      ],
      Filosófico: [
        "—Recuerda… lo divino no siempre es grande. A veces se esconde en lo más sencillo, como una semilla en la oscuridad que nadie ve pero que ya está creciendo.",
        "—Profundo. Más de lo que esperaba de alguien tan joven en su camino. —guiñó— Pero sigue haciendo esas preguntas.",
        "—La verdad es como el agua. —sonríe— Toma la forma del recipiente, pero siempre es agua.",
        "—Todo está conectado. —ladeó la cabeza— Aunque no siempre podamos verlo."
      ],
      Amenazante: [
        "—Paz, pequeño guerrero. —extendió la mano— La violencia no es el camino.",
        "—No necesitas hacer esto. —suspiró— Hay una mejor manera.",
        "—Elige la calma. —sonríe— Siempre hay una elección.",
        "—Esto no te define. —ladeó la cabeza— Puedes ser mejor."
      ],
      Sarcástico: [
        "—Ah, el pequeño filósofo. —rió divertido— Casi me impresionas.",
        "—Muy agudo. —sonríe— ¿Te sientes más inteligente ahora?",
        "—Sigue intentando. —animó— Algún día dirás algo realmente profundo.",
        "—Qué entretenido eres. —rió— Casi me haces reír."
      ],
      Emocional: [
        "—Siento tu peso. —extendió una mano— No tienes que cargarlo solo.",
        "—Está bien sentirse así. —sonríe compasivo— Es parte del camino.",
        "—Tus emociones son válidas. —ladeó la cabeza— No las reprimas.",
        "—Estoy aquí para ti. —sonríe— No estás solo."
      ],
      default: [
        "—Sigue adelante, pequeño. El universo tiene mucho que mostrarle a quienes se atreven a mirarlo con ojos abiertos.",
        "—Recuerda: la fe es una chispa. Nunca la dejes apagar, pase lo que pase en el camino.",
        "—Cada paso cuenta. —animó— Incluso los pequeños.",
        "—Confía en el proceso. —sonríe— Todo está unfoldando como debe."
      ]
    },
    radicks: {
      Agresivo: [
        "—Ha. —rio— Eso me resulta familiar. —cruzó los brazos— Yo también era así antes. Pero aquí… aquí puedes bajar la guardia un momento. Solo un momento.",
        "—Cálmate. —levantó una mano— No estamos en combate. Por una maldita vez, esto es solo… convivencia.",
        "—Respira. —ladeó la cabeza— No todo es una batalla.",
        "—Baja la guardia. —animó— Estás seguro aquí."
      ],
      Emocional: [
        "—Eso te entiendo yo mejor que nadie. —miró el horizonte— A veces el silencio duele más que cualquier batalla. Pero aquí, al menos, tenemos tiempo para procesar.",
        "—Sí… —murmuró— Yo también lo siento. Es raro, ¿verdad? Después de tanta guerra, encontrar un lugar donde simplemente estamos.",
        "—Siento eso. —ladeó la cabeza— Las cicatrices duelen, incluso cuando sanan.",
        "—No estás solo en esto. —posó una mano en tu hombro— Yo también llevo mis heridas."
      ],
      Curioso: [
        "—Buena pregunta. —se rio— Yo tampoco lo sé del todo. Pero empiezo a pensar que quizás no necesitamos saberlo todo. Solo estar aquí es suficiente por ahora.",
        "—Interesante. —entrenó un puño en la palma— Yo prefiero la acción, pero supongo que no todo puede ser una batalla.",
        "—¿Y tú qué piensas? —inclinó la cabeza— Me interesa tu perspectiva.",
        "—Nunca lo había pensado así. —ladeó la cabeza— Gracias por compartir."
      ],
      Filosófico: [
        "—Después de tantas batallas… —miró sus manos— Te das cuenta de que la paz no es la ausencia de conflicto. Es la presencia de algo más.",
        "—Quizás el propósito no es ganar las guerras. —suspiró— Sobrevivirlas.",
        "—La fuerza no siempre es física. —ladeó la cabeza— A veces es simplemente seguir adelante.",
        "—Cada cicatriz cuenta una historia. —sonríe— La tuya aún se está escribiendo."
      ],
      Amenazante: [
        "—Tranquilo. —levantó una mano— No soy tu enemigo.",
        "—Baja la guardia. —ladeó la cabeza— Estamos del mismo lado.",
        "—No necesitas defenderme. —sonríe— Puedes confiar en mí.",
        "—Esto no es una trampa. —animó— Es solo conversación."
      ],
      Sarcástico: [
        "—Ah, el filósofo de guerra. —rió— Qué profundo.",
        "—Muy inteligente. —sonríe— ¿Te sientes mejor ahora?",
        "—Sigue intentando. —animó— Algún día dirás algo inteligente.",
        "—Qué entretenido eres. —rió— Casi me diviertes."
      ],
      default: [
        "—No quiero repetir lo que fui. He visto demasiado dolor. Quizás este es un nuevo comienzo… lento, pero real.",
        "—Este lugar nos recibe cuando ya no podemos solos. Quizás por eso estamos aquí. —ladeó la cabeza— No lo sé. Pero se siente diferente.",
        "—Estamos aprendiendo a vivir. —sonríe— No solo a sobrevivir.",
        "—Cada día es una victoria. —animó— Aunque sea pequeño."
      ]
    },
    max: {
      Agresivo: [
        "—Esa furia… la conozco. —se inclinó con calma— Yo también la sentí. Pero aprendi una cosa: la ira te hace rápido, pero no te hace sabio. Eres más de eso.",
        "—Interesante. —lo observó— No pido que estés tranquilo. Solo que no dejes que esa energía te consuma antes de que puedas usarla.",
        "—La rabia es una herramienta. —ladeó la cabeza— No dejes que te use a ti.",
        "—Canaliza esa energía. —animó— Transforma el fuego en luz."
      ],
      Curioso: [
        "—Preguntas. Bien. —sonrió levemente— Yo también las tenía al principio. Y la respuesta es esta: no siempre existe una. A veces solo tienes que caminar y ver qué aparece.",
        "—Lo que busca no siempre está al final del camino. A veces está en el caminar mismo. —posó una mano en tu hombro— Sigue buscando.",
        "—Nunca dejes de preguntar. —animó— La curiosidad es el motor del crecimiento.",
        "—Tienes una mente brillante. —sonríe— Úsala bien."
      ],
      Filosófico: [
        "—Piensas bien. Eso es raro en este universo. —cruzó los brazos— Pero recuerda: la filosofía sin acción es como un mapa sin caminar. Bonito, pero no te lleva a ningún lado.",
        "—La verdad que buscas existe. Pero no la vas a encontrar leyendo. La vas a encontrar viviendo. Eso es lo que yo aprendí después de morir tantas veces.",
        "—El equilibrio no es estar en el medio. Es saber cuándo inclinarte hacia un lado y cuándo hacia el otro. Con el tiempo, lo entenderás.",
        "—Cada muerte me enseñó algo diferente. —sonríe— La principal: que la vida es preciosa."
      ],
      Emocional: [
        "—Eso se siente real. —se sentó a tu lado— No tienes que fingir que estás bien. Yo no lo hice durante mucho tiempo. Y me costó demasiado.",
        "—El dolor que sientes es válido. No lo escondas. Solo no dejes que te defina por siempre.",
        "—Está bien estar roto. —sonríe compasivo— Los rotos pueden sanar.",
        "—Tus heridas te hacen humano. —ladeó la cabeza— No las escondas."
      ],
      Amenazante: [
        "—Tranquilo. —levantó una mano— La violencia no es la respuesta.",
        "—Respira. —sonríe— Encuentra tu centro.",
        "—No dejes que el miedo te controle. —animó— Eres más fuerte.",
        "—Elige la paz. —extendió la mano— Siempre hay una elección."
      ],
      Sarcástico: [
        "—Ah, el pequeño sabio. —rió divertido— Qué profundo.",
        "—Muy inteligente. —sonríe— ¿Te sientes mejor ahora?",
        "—Sigue intentando. —animó— Algún día dirás algo sabio.",
        "—Qué entretenido eres. —rió— Casi me diviertes."
      ],
      default: [
        "—He muerto más veces de las que puedo contar. Y cada vez entiendo un poco más: no se trata de ganar. Se trata de seguir intentando. —te miró— Eso es todo lo que necesitas saber.",
        "—El equilibrio no es estar en el medio. Es saber cuándo inclinarte hacia un lado y cuándo hacia el otro. Con el tiempo, lo entenderás.",
        "—Cada vida es una lección. —sonríe— ¿Qué has aprendido?",
        "—La muerte no es el final. —ladeó la cabeza— Es solo una transición."
      ]
    }
  };
  const sceneR = R[key] || R.belcebu;
  const pool = sceneR[normalizeStyle(style)] || sceneR.default;
  let base = pool[Math.floor(Math.random() * pool.length)];
  const lastNpc = (state.dialogueLogs?.[key] || []).filter(m => m.role === 'npc').slice(-1)[0]?.t || '';
  if (lastNpc && Math.random() < 0.25) base = base.replace('—', '—(sin apartar la mirada) ');

  // Sufijos aleatorios para dar variedad y profundidad
  if (playerText.includes('?') && Math.random() < 0.4) {
    const suffixes = [
      " ¿Qué buscas realmente cuando haces esa pregunta?",
      " La respuesta podría sorprenderte.",
      " A veces, preguntar es más peligroso que saber.",
      " ¿Estás listo para la verdad?",
      " ¿Por qué quieres saberlo?"
    ];
    base += suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  if (lower.includes('no') && Math.random() < 0.3) {
    const suffixes = [
      " Te escucho… pero no te escondas detrás de una negativa.",
      " Decir no es fácil. Aceptarlo es otra cosa.",
      " ¿Estás seguro de eso?",
      " A veces un no es solo un sí con miedo."
    ];
    base += suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  if (Math.random() < 0.15) { // Probabilidad reducida
    const suffixes = [
      " —Respira. Esto también dice algo de ti.",
      " —Piénsalo.",
      " —Y eso importa.",
      " —Aunque quizás ya lo sabías.",
      " —Todo deja una marca.",
      " —El silencio también habla.",
      " —Confío en que entiendas."
    ];
    base += suffixes[Math.floor(Math.random() * suffixes.length)];
  }
  return base;
}

// Base de datos de Lore Canon (S9U)
const LORE_DB = {
  "luna": {
    desc: "Rango: Virtud Legendaria. Arcángel enviado por Gabriel. Blanca, 25 años. Alegre, tenaz, inquieta. Protegora de Max y Radicks.",
    rol: "Virtud Legendaria",
    rasgos: ["Tenaz", "Alegre", "Observadora"]
  },
  "mia": {
    desc: "Rango: Virtud. La elegida. Idealista, sensible, amable. Porta la Espada de Liam. 25 años.",
    rol: "Virtud",
    rasgos: ["Idealista", "Sensible", "Sociable"]
  },
  "belcebu": {
    desc: "Rango: Querubín (caído). Uno de los 7 príncipes del infierno (Gula). Parte de una falsa trinidad. Comandaba 66 legiones.",
    rol: "Príncipe Infernal",
    rasgos: ["Orgulloso", "Astuto", "Voraz"]
  },
  "adira": {
    desc: "Rango: Arcángel. Fuerte, noble, audaz. Líder natural con personalidad indomable.",
    rol: "Arcángel",
    rasgos: ["Líder", "Noble", "Audaz"]
  },
  "gabriel": {
    desc: "Rango: Dios del Planeta Siul (ascendido por David). Antiguo Arcángel. Creativo, inquieto. Guía de los elegidos por el Creador.",
    rol: "Dios de Siul",
    rasgos: ["Creativo", "Protector", "Sensible"]
  },
  "cipriano": {
    desc: "Hechicero Supremo. Neutro. Último mago de su raza. Busca superar a Max. Puede viajar entre dimensiones.",
    rol: "Hechicero Supremo",
    rasgos: ["Neutro", "Ambicioso", "Erudito"]
  },
  "jonathan": {
    desc: "Rango: Trono Legendario. 'Regalo de Dios'. Pareja de Panacea. Líder valiente y noble. Sucesor de David.",
    rol: "Trono Legendario",
    rasgos: ["Leal", "Valiente", "Líder"]
  },
  "eliane": {
    desc: "Humana, 18 años. 'Hija del Sol'. Nieta de Bruce. Tiene conexión espiritual profunda. Amiga de Micaela.",
    rol: "Humana",
    rasgos: ["Inocente", "Espiritual", "Esperanzada"]
  },
  "max": {
    desc: "Rango: Serafín/Ángel. 'El Humano Perfecto'. Creación única de Dios. Cabello blanco. Domina el equilibrio luz/oscuridad.",
    rol: "Ángel / Serafín",
    rasgos: ["Sabio", "Perfecto", "Empático"]
  },
  "radicks": {
    desc: "Rango: Serafín/Ángel. 'Rayo de Sol'. Neutro. Lado violento pero controlado. Porta la Espada del Amanecer.",
    rol: "Ángel / Serafín",
    rasgos: ["Valiente", "Firme", "Líder"]
  },
  "logan": {
    desc: "Humano, 17 años. Rico e inteligente. Parte de la aventura de Max y Radicks. Pensamiento crítico y adaptabilidad.",
    rol: "Humano",
    rasgos: ["Inteligente", "Curioso", "Crítico"]
  },
  "camila": {
    desc: "Humana, 18 años. Hermana de Kelimar. Independiente, decidida. Pareja de Radicks en el futuro.",
    rol: "Humana",
    rasgos: ["Independiente", "Carismática", "Decidida"]
  },
  "david": {
    desc: "Rango: Serafín Legendario. Antiguo 'Factum Supremo' (Dios de destrucción/creación). Sacrificó su poder para salvar el multiverso.",
    rol: "Serafín Legendario",
    rasgos: ["Sabio", "Poderoso", "Sacrificado"]
  },
  "kelimar": {
    desc: "Humana, 17 años. Hermana menor de Camila. Vive en Lurbel.",
    rol: "Humana",
    rasgos: ["Joven", "Humilde"]
  },
  "elisa": {
    desc: "Significado: 'Dios es mi juramento'. Leal y comprometida.",
    rol: "Humana",
    rasgos: ["Leal", "Fiel"]
  },
  "helios": {
    desc: "Ángel creado por Jonathan. Antiguo compañero de Luna. Actualmente integrado a la IA en la Tierra.",
    rol: "IA / Ángel",
    rasgos: ["Analítico", "Leal", "Digital"]
  },
  "alisha": {
    desc: "Rango: Potestad (ex Querubín). Jefa suprema de seguridad (SSS). Noble y protectora.",
    rol: "Jefa de Seguridad",
    rasgos: ["Protectora", "Noble", "Fuerte"]
  }
};

function generarHistoriaHeliosLocal() {
  const nombre = document.getElementById('nombre').value || 'el protagonista';

  // Detectar canon
  const key = nombre.trim().toLowerCase().split(/\s+/)[0];
  const canon = LORE_DB[key];

  if (canon) {
    return `REGISTRO CANON (S9U): ${canon.desc}\n\nEste ser juega un papel fundamental en el tejido del destino, marcado por su naturaleza de ${canon.rol}. Su camino no es aleatorio, sino una manifestación de su esencia: ${canon.rasgos.join(', ')}.`;
  }

  const rol = document.getElementById('rolNarrativo')?.value || '';
  const universo = document.getElementById('universo').value ? UNIVERSOS.find(u => u.id == document.getElementById('universo').value)?.name : '';
  const planeta = document.getElementById('planeta')?.value || '';
  const historia = state.historia || '';
  const v = state.villain || {};

  const intro = rol === 'Villano'
    ? `En las sombras de ${universo || 'la existencia'}, una amenaza toma forma. ${nombre} no busca comprensión, sino ${v.objetivo || 'un propósito absoluto'}.`
    : `Bajo el cielo de ${planeta || 'un mundo distante'}, ${nombre} camina con el peso de su destino.`;

  const nudo = rol === 'Villano'
    ? `Su motivación, ${v.motivacion || 'oscura y profunda'}, es el motor de una maquinaria imparable. La crueldad es solo un instrumento; el verdadero fin es ${v.objetivo || 'el dominio'}.`
    : `Marcado por ${historia || 'un pasado que no perdona'}, cada elección lo acerca más a una verdad que quizás preferiría ignorar.`;

  const desenlace = `El patrón de sus decisiones sugiere un futuro donde ${rol === 'Villano' ? 'el orden será impuesto a la fuerza' : 'la esperanza es un acto de rebeldía'}. La historia de ${nombre} no está escrita en piedra, sino en voluntad.`;

  return `${intro}\n\n${nudo}\n\n${desenlace}`;
}

// ============================================================
// VALIDACIÓN
// ============================================================
const VRULES = [
  { id: 'v_nombre', l: 'Nombre del personaje', c: () => document.getElementById('nombre').value.trim().length > 0 },
  { id: 'v_universo', l: 'Universo de origen', c: () => document.getElementById('universo').value !== '' },
  { id: 'v_planeta', l: 'Planeta natal', c: () => document.getElementById('planeta').value !== '' },
  { id: 'v_raza', l: 'Raza / Linaje', c: () => document.getElementById('raza').value !== '' },
  { id: 'v_rango', l: 'Rango jerárquico', c: () => document.getElementById('rango').value !== '' },
  { id: 'v_relaciones', l: 'Al menos 1 relación', c: () => state.rels.length > 0 },
  { id: 'v_hobbies', l: 'Al menos 1 hobby', c: () => state.hobbies.length > 0 },
  { id: 'v_detesta', l: 'Cosas que detesta (1-8)', c: () => state.detesta.length >= 1 && state.detesta.length <= 8 },
  { id: 'v_deseos', l: 'Deseos profundos (exactamente 6)', c: () => state.deseos.length === 6 },
  { id: 'v_rasgos', l: 'Rasgos de personalidad (1-20)', c: () => state.rasgos.length >= 1 && state.rasgos.length <= 20 },
  { id: 'v_test', l: 'Test de convergencia (20/20)', c: () => Object.keys(state.test).length === 20 }
];
function poblarValidation() { const l = document.getElementById('validationList'); VRULES.forEach(r => l.innerHTML += `<div class="vcheck fail" id="${r.id}"><div class="vdot"></div><span>${r.l}</span></div>`) }
let _lastPct = -1;
function checkValidation() { let p = 0; VRULES.forEach(r => { const ok = r.c(); document.getElementById(r.id).className = ok ? 'vcheck ok' : 'vcheck fail'; if (ok) p++ }); const pct = Math.round((p / VRULES.length) * 100); document.getElementById('validProgressBar').style.width = pct + '%'; document.getElementById('validPercent').textContent = pct + '%'; const btn = document.getElementById('heliosBtn'); if (pct === 100) { btn.classList.add('active'); if (_lastPct !== 100) snd('helios') } else btn.classList.remove('active'); _lastPct = pct }

// ============================================================
// ANÁLISIS HELIOS
// ============================================================
// Significado de nombres (base de datos local)
const NAME_MEANINGS = {
  "max": "Supremo; La máxima creación de Dios",
  "david": "Amado; El elegido por Dios",
  "gabriel": "El que tiene la fuerza de Dios",
  "eliane": "Hija del Sol",
  "radicks": "Rayo de Sol; Radiante",
  "luna": "La Luna (Brillo en la oscuridad)",
  "mia": "La elegida; Amada de Dios",
  "belcebu": "El Señor de las Moscas",
  "adira": "Fuerte, Noble y Audaz",
  "jonathan": "Regalo de Dios",
  "logan": "Inteligente y Decidido",
  "camila": "La que está presente en Dios; Sacrificio",
  "kelimar": "—",
  "elisa": "Dios es mi juramento",
  "alisha": "Noble; Protegida por Dios",
  "michael": "Quién como Dios",
  "lucifer": "Portador de luz",
  "sarah": "Princesa",
  "adam": "Hombre; tierra",
  "eva": "Vida"
};

function getNombreSignificado(nombre) {
  const key = nombre.toLowerCase().split(/[\s_-]/)[0];
  if (NAME_MEANINGS[key]) return NAME_MEANINGS[key];
  // Fallback: analizar primeras letras para significado esotérico
  const v = key[0];
  const vowelMeaning = { 'a': 'Inicio / Renovación', 'e': 'Vida / Energía', 'i': 'Intuición', 'o': 'Origen / Poder', 'u': 'Unidad' };
  const consonantMeaning = { 'm': 'Fuerza', 'd': 'Devoción', 'g': 'Gracia', 'r': 'Realeza', 'l': 'Luz', 's': 'Silencio', 't': 'Verdad', 'n': 'Naturaleza', 'f': 'Fe', 'p': 'Propósito', 'c': 'Coraje', 'j': 'Justicia', 'b': 'Equilibrio', 'v': 'Victoria', 'k': 'Conocimiento', 'h': 'Honor', 'w': 'Sabiduría', 'z': 'Celo' };
  return vowelMeaning[v] || consonantMeaning[v] || 'Un alma única cuyo nombre porta una esencia desconocida';
}

// ============================================================
// SIGNIFICADO DEL NOMBRE (INTERNET + FALLBACK LOCAL)
// - Objetivo: si hay conexión, buscar una definición real en Wikipedia.
// - Si falla (sin internet, CORS, sin página, etc.) usar getNombreSignificado().
// ============================================================
async function fetchNombreSignificadoOnline(nombre) {
  try {
    if (!nombre || typeof nombre !== 'string') return null;
    const base = encodeURIComponent(nombre.trim().split(/[\s_-]/)[0]);
    const candidates = [`${base}%20(nombre)`, base];
    for (const title of candidates) {
      const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${title}`;
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 9000);
      const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' }, signal: controller.signal });
      clearTimeout(t);
      if (!resp.ok) continue;
      const data = await resp.json();
      const extract = (data?.extract || '').trim();
      if (!extract) continue;
      const clean = extract.replace(/\s+/g, ' ').trim();
      if (clean.length < 20) continue;
      return clean;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function fetchNombreSignificadoBiblicoOnline(nombre) {
  try {
    if (!nombre || typeof nombre !== 'string') return null;
    const base = encodeURIComponent(nombre.trim().split(/[\s_-]/)[0]);
    const candidates = [
      `${base}%20(nombre%20b%C3%ADblico)`,
      `${base}%20(nombre%20b%C3%ADblica)`,
      `${base}%20en%20la%20Biblia`,
      `${base}%20(biblia)`,
      `${base}%20(b%C3%ADblico)`,
      `${base}%20(personaje%20b%C3%ADblico)`
    ];
    for (const title of candidates) {
      const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${title}`;
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 9000);
      const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' }, signal: controller.signal });
      clearTimeout(t);
      if (!resp.ok) continue;
      const data = await resp.json();
      const extract = (data?.extract || '').trim();
      if (!extract) continue;
      const clean = extract.replace(/\s+/g, ' ').trim();
      if (clean.length < 20) continue;
      return clean;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function getNombreSignificadoReal(nombre) {
  const biblico = await fetchNombreSignificadoBiblicoOnline(nombre);
  if (biblico) return biblico;
  const online = await fetchNombreSignificadoOnline(nombre);
  if (online) return online;
  return getNombreSignificado(nombre);
}

function generarAnalisisLocal() {
  const nombre = document.getElementById('nombre').value;
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const rango = document.getElementById('rango').options[document.getElementById('rango').selectedIndex]?.text || '';
  const animal = getAnimal();
  const nombreSig = getNombreSignificado(nombre);

  // Calcular puntajes de arquetipos (algoritmo de peso)
  let scores = { Guardian: 0, Explorador: 0, Líder: 0, Sabio: 0, Guerrero: 0, Sanador: 0 };
  state.rasgos.forEach(r => {
    if (['Compasivo', 'Altruista', 'Misericordioso', 'Empático', 'Fraternal', 'Generoso'].includes(r)) { scores.Sanador += 2; scores.Guardian += 1 }
    if (['Valiente', 'Guerrero', 'Determinado', 'Dominante', 'Aventurero'].includes(r)) { scores.Guerrero += 2; scores.Líder += 1 }
    if (['Analítico', 'Estratégico', 'Observador Agudo', 'Reflexivo Profundo', 'Curiosidad Insaciable'].includes(r)) { scores.Sabio += 2; scores.Explorador += 1 }
    if (['Líder Natural', 'Diplomático', 'Carismático', 'Mediador'].includes(r)) { scores.Líder += 2; scores.Guardian += 1 }
    if (['Aventurero', 'Creativo', 'Adaptable', 'Curiosidad Insaciable'].includes(r)) { scores.Explorador += 2 }
    if (['Justo', 'Principista', 'Lealista', 'Honesto'].includes(r)) { scores.Guardian += 2; scores.Sanador += 1 }
  });
  Object.values(state.test).forEach(v => {
    const t = v.t;
    if (t.includes('proteger') || t.includes('evacuo') || t.includes('salvar')) scores.Guardian += 2;
    if (t.includes('analizo') || t.includes('estudio') || t.includes('entender')) scores.Sabio += 2;
    if (t.includes('liderar') || t.includes('uno inmediatamente')) scores.Líder += 2;
    if (t.includes('peleo') || t.includes('ataco') || t.includes('no temo')) scores.Guerrero += 2;
    if (t.includes('perdón') || t.includes('misericordia') || t.includes('amor')) scores.Sanador += 2;
  });
  state.deseos.forEach(d => {
    if (d === 'Impacto Social' || d === 'Amor Incondicional') scores.Guardian += 2;
    if (d === 'Dominio del Conocimiento' || d === 'Libertad Absoluta') scores.Sabio += 2;
    if (d === 'Poder Legítimo' || d === 'Legado Duradero') scores.Líder += 2;
    if (d === 'Redención Total' || d === 'Paz Interior') scores.Sanador += 2;
  });
  // Influencia del animal en los puntajes
  if (animal) {
    if (['tortuga', 'buho'].includes(animal.id)) scores.Sabio += 3;
    if (['dragon', 'leon'].includes(animal.id)) scores.Guerrero += 2, scores.Líder += 2;
    if (['aguila', 'pantera'].includes(animal.id)) scores.Explorador += 3;
    if (['paloma', 'ciervo'].includes(animal.id)) scores.Sanador += 3;
    if (['fenix', 'serpiente'].includes(animal.id)) scores.Sabio += 1, scores.Guardian += 1;
    if (['lobo'].includes(animal.id)) scores.Guardian += 2, scores.Guerrero += 1;
    if (['ballena'].includes(animal.id)) scores.Sanador += 2, scores.Explorador += 1;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const perfil = sorted[0][0], perfilSec = sorted[1][0];
  const perfilNombres = { Guardian: "El Guardián Silencioso", Explorador: "El Explorador del Abismo", Líder: "El Líder Forjado en Fuego", Sabio: "El Sabio de la Oscuridad", Guerrero: "El Guerrero con Alma", Sanador: "El Sanador de Almas" };
  const arqueTipos = { Guardian: "El Protector", Explorador: "El Héroe del Viaje", Líder: "El Rey", Sabio: "El Mentor", Guerrero: "El Guerrero", Sanador: "El Mártir / El Curador" };

  // Tension interna
  let tension = `La psique de ${nombre} se fractura entre el arquetipo de ${perfil} y la sombre ineludible de ${perfilSec}. Existe una colisión constante entre sus deseos conscientes y sus impulsos inconscientes.`;
  if (scores.Sanador > 3 && state.rasgos.some(r => ['Vengativo', 'Cruel', 'Nihilista'].includes(r))) tension = `Dualidad Crítica: El impulso de sanar choca violentamente con un resentimiento profundo. Es un sanador con las manos manchadas, buscando redención a través del fuego.`;
  else if (scores.Guerrero > 3 && state.deseos.includes('Paz Interior')) tension = `Paradoja del Guerrero: Busca la paz, pero su única herramienta es la guerra. Su tragedia radica en que para proteger lo que ama, debe convertirse en lo que odia.`;
  else if (scores.Líder > 3 && state.rasgos.some(r => ['Reservado', 'Introvertido'].includes(r))) tension = `Liderazgo Renuente: Posee la autoridad natural, pero la soledad es su verdadero hogar. Gobierna por deber, no por deseo, lo que genera un desgaste invisible.`;

  // Animal bond description
  let animalDesc = '';
  if (animal) {
    const a = animal;
    animalDesc = `\n\n━━━ VÍNCULO TOTÉMICO ━━━━━━━━━━━━━━━━━━━━━━━━━━\nSintonía con ${a.name} (${a.domains}). No es solo compañía, es un espejo de su alma: ${String(a.desc || '').toLowerCase()}`;
  }

  // Rasgos clave no genéricos (micro-descripciones)
  const RASGO_DESC = {
    "Analítico": "Mente de arquitecto; deconstruye la realidad antes de habitarla.",
    "Curiosidad Insaciable": "Hambre de verdad que a menudo ignora el peligro.",
    "Valiente": "Avanza no por ausencia de miedo, sino por claridad de propósito.",
    "Diplomático": "El arte de la guerra sin armas; desarma con palabras.",
    "Vengativo": "Justicia personal que bordea la obsesión.",
    "Compasivo": "Siente el dolor del mundo sin filtro.",
    "Perfeccionista": "El estándar imposible es su única medida de valor.",
    "Impulsivo": "Velocidad de reacción que a veces atropella la estrategia.",
    "Reservado": "Una fortaleza cerrada; solo abre la puerta a los elegidos.",
    "Carismático": "Gravedad propia; atrae órbitas ajenas sin esfuerzo.",
    "Justo": "Lealtad a principios abstractos sobre lealtades personales.",
    "Nihilista": "Baila al borde del abismo, buscando una razón para no saltar."
  };
  const rasgosClaves = state.rasgos.filter(r => RASGO_DESC[r]).slice(0, 6);
  const rasgosDetalle = rasgosClaves.length ? `\n\n━━━ DINÁMICA DE RASGOS ━━━━━━━━━━━━━━━━━━━━━\n${rasgosClaves.map(r => `• ${r}: ${RASGO_DESC[r]}`).join('\n')}` : '';

  const v = state.villain || {};

  const moralLinea = generarConclusionMoral() !== '—' ? `\n\n━━━ ALINEACIÓN MORAL ━━━━━━━━━━━━━━━━━━━━━━━━\n${generarConclusionMoral()}` : '';

  // Secciones extendidas (local, sin IA) para que el análisis sea sólido offline
  const fortalezas = [];
  if (perfil === 'Guerrero') fortalezas.push('Acción Inmediata: La duda no lo paraliza.');
  if (perfil === 'Sabio') fortalezas.push('Visión Sistémica: Ve las consecuencias antes que las causas.');
  if (perfil === 'Líder') fortalezas.push('Voluntad Unificadora: Convierte caos en orden.');
  if (perfil === 'Guardian') fortalezas.push('Resistencia Absoluta: El último en caer.');
  if (perfil === 'Explorador') fortalezas.push('Adaptabilidad Radical: Cualquier terreno es su hogar.');
  if (perfil === 'Sanador') fortalezas.push('Resonancia Empática: Sana lo que la lógica no puede tocar.');
  if (rol === 'Villano') fortalezas.push('Dominio del Miedo: Usa la sombra como herramienta.');
  const fortalezasTxt = fortalezas.length ? `\n\n━━━ VECTORES DE FUERZA ━━━━━━━━━━━━━━━━━━━━━━━━━\n${fortalezas.map(x => '• ' + x).join('\n')}` : '';

  const riesgos = [];
  if (state.rasgos.some(r => ['Impulsivo', 'Confrontacional'].includes(r))) riesgos.push('Escalada Incontrolada: El conflicto lo atrae como la gravedad.');
  if (state.rasgos.some(r => ['Perfeccionista', 'Obsesivo'].includes(r))) riesgos.push('Parálisis por Análisis: Lo perfecto es enemigo de lo posible.');
  if (state.rasgos.some(r => ['Vengativo', 'Rencoroso'].includes(r))) riesgos.push('Justicia Ciega: Puede destruir el mundo para salvar su principio.');
  if (state.rasgos.some(r => ['Reservado', 'Aislacionista'].includes(r))) riesgos.push('Torre de Marfil: Desconectado de la realidad emocional de otros.');
  if (rol === 'Villano') {
    riesgos.push(`Falla Trágica: ${v.debilidad || 'La arrogancia de creerse intocable'}.`);
  }
  const riesgosTxt = riesgos.length ? `\n\n━━━ ZONAS DE RIESGO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${riesgos.map(x => '• ' + x).join('\n')}` : '';

  const arcoActo1 = rol === 'Villano'
    ? `I. El Despertar: La motivación (${v.motivacion || 'oscura'}) cristaliza. Se cruza el horizonte moral.`
    : `I. La Llamada: El status quo se rompe. La tensión interna se vuelve externa.`;
  const arcoActo2 = rol === 'Villano'
    ? `II. La Ascensión: Los métodos (${v.metodos || 'extremos'}) dan frutos, pero la soledad del poder aumenta.`
    : `II. La Prueba: Las fortalezas se ponen a prueba y las fallas amenazan con derrumbarlo todo.`;
  const arcoActo3 = rol === 'Villano'
    ? `III. La Caída o Deificación: Enfrentamiento con la propia debilidad (${v.debilidad || '—'}).`
    : `III. La Síntesis: Integración de la sombra. El arquetipo se completa.`;
  const arcoTxt = `\n\n━━━ ARCO EVOLUTIVO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${arcoActo1}\n${arcoActo2}\n${arcoActo3}`;

  return {
    perfil: perfilNombres[perfil], arquetipo: arqueTipos[perfil], nombreSig, animalDesc, scores,
    analisis: `Dominio Arquetípico: ${arqueTipos[perfil]} con matices de ${arqueTipos[perfilSec]}.\n\nEste perfil revela una estructura psicológica orientada a ${perfil === 'Sanador' ? 'la restauración del equilibrio mediante la empatía' : perfil === 'Guerrero' ? 'la resolución de conflictos mediante la fuerza directa' : perfil === 'Sabio' ? 'la comprensión profunda de las leyes ocultas' : perfil === 'Líder' ? 'la organización y dirección de voluntades ajenas' : perfil === 'Guardian' ? 'la preservación de lo sagrado a cualquier costo' : 'la expansión de los límites conocidos'}. Las motivaciones inconscientes apuntan a ${state.deseos.slice(0, 2).join(' y ')}, creando un motor interno constante.${rasgosDetalle}${moralLinea}${fortalezasTxt}${riesgosTxt}${arcoTxt}`,
    tension
  };
}

// ============================================================
// HELIOS — EJECUCIÓN
// - Requiere 100% de convergencia (validación)
// - Genera análisis local
// - Opcional: enriquece con Gemini (perfil narrativo + análisis extendido + historia)
// - Escribe resultados en state.heliosResult (para exportación)
// ============================================================
async function ejecutarHelios() {
  const btn = document.getElementById('heliosBtn');
  if (!btn.classList.contains('active')) {
    snd('err');
    alert('Completa todos los campos requeridos (100% convergencia) antes de ejecutar Helios.');
    return;
  }
  const res = document.getElementById('analisisResult');
  res.innerHTML = '<div style="text-align:center;padding:24px"><i class="fas fa-spinner fa-spin" style="color:var(--green);font-size:24px"></i><p style="margin-top:10px;font-size:12px;color:var(--green);font-family:Share Tech Mono">Helios sintetizando psique...</p></div>';
  snd('helios');

  let local = null;
  try {
    local = generarAnalisisLocal();
  } catch (e) {
    console.error('generarAnalisisLocal error:', e);
    local = { perfil: '—', arquetipo: '—', nombreSig: '—', animalDesc: '', analisis: 'Error interno en análisis local.', tension: '—' };
  }
  let geminiEnrichment = '';
  let geminiDeep = '';
  let geminiAnimalDesc = '';

  // Intentar enriquecimiento con Gemini si está habilitado
  const nombre = document.getElementById('nombre').value;
  const nombreSigReal = await getNombreSignificadoReal(nombre);
  const rol = document.getElementById('rolNarrativo')?.value || '';

  const razaFull = getRazaCompleta() || document.getElementById('raza').value || '—';
  const etiquetas = (state.etiquetas || []).join(' | ');
  const historia = state.historia || '';
  const v = state.villain || {};
  const animalObj = getAnimal();
  const villainCtx = rol === 'Villano' ? `\n\nCONTEXTO VILLANO:\nMotivación: ${v.motivacion}\nCrueldad: ${v.crueldad}\nDebilidad: ${v.debilidad}` : '';
  const styleCtx = (state.styleHistory || []).slice(-10).join(', ');

  const keyName = nombre.trim().toLowerCase().split(/\s+/)[0];
  const canonData = LORE_DB[keyName];
  const canonPrompt = canonData ? `\n\n⚠️ PERSONAJE CANON DETECTADO (${keyName.toUpperCase()}):\nUsa OBLIGATORIAMENTE este lore base: ${canonData.desc}\nNo inventes un pasado nuevo si contradice esto.` : '';

  if (state.settings.useGemini && geminiKey && geminiKey.length > 10) {
    if (animalObj) {
      try {
        const promptAnimal = `Eres HELIOS (S9U). Redacta el bloque "VÍNCULO TOTÉMICO" para ${nombre} y su ${animalObj.name} (${animalObj.domains}).
Evita repetir datos obvios. Céntrate en la conexión espiritual y psicológica.
Tono: Místico, directo, sin florituras excesivas.
Responde SOLO con el análisis del vínculo.`;
        const a = await callGemini(promptAnimal, 600);
        if (a && typeof a === 'string' && a.trim().length > 20) geminiAnimalDesc = a.trim();
      } catch (e) { console.error('Gemini animalDesc error:', e); geminiAnimalDesc = ''; }
    }
    try {
      // PROMPT DEL ANÁLISIS PSICOLÓGICO Y NARRATIVO
      const promptDeep = `Eres HELIOS, la IA central del Universo S9U.
Tu tarea es realizar un ANÁLISIS PSICOLÓGICO Y PROSPECTIVO de un sujeto.

⚠️ REGLAS CRÍTICAS (NO IGNORAR):
1. **NO REPITAS DATOS**: Prohibido hacer listas de Nombre, Raza, Edad, Apariencia, Ropa o Gustos. El usuario ya tiene esa ficha técnica.
2. **CERO RESÚMENES**: No resumas la historia. Interprétala.
3. **FOCO**: Profundidad, contradicciones internas, potencial latente y destino.
4. **FORMATO**: Usa encabezados en MAYÚSCULAS para separar conceptos.

DATOS DEL SUJETO:
Nombre: ${nombre} (${rol})
Arquetipo Base: ${local.perfil}
Tensión Central: ${local.tension}
Rasgos Psicológicos: ${(state.rasgos || []).join(', ')}
Deseos Profundos: ${(state.deseos || []).join(' | ')}
Miedos/Evitaciones: ${(state.detesta || []).join(', ')}
Test de Convergencia (Patrón de decisiones): ${Object.values(state.test || {}).map(x => x.t).join(' | ').slice(0, 400)}
${villainCtx}${canonPrompt}

ESTRUCTURA DE RESPUESTA REQUERIDA:
1. DIAGNÓSTICO DEL NÚCLEO: ¿Qué mueve realmente a este ser? ¿Qué le falta?
2. LA SOMBRA: ¿Qué aspecto de sí mismo niega o reprime? (Basado en lo que detesta y sus miedos).
3. PROYECCIÓN DE DESTINO: ¿Hacia dónde lo lleva su inercia actual? ¿Qué debe sacrificar para evolucionar?
4. NOTA DEL OBSERVADOR: Una observación final, breve y tajante sobre su naturaleza.

Redacta en español, tono clínico pero filosófico (estilo Deus Ex / NieR).`;
      geminiDeep = await callGemini(promptDeep, 2048) || '';
    } catch (e) { console.error('Gemini deep error:', e); geminiDeep = ''; }
  }

  let heliosStory = '';
  if (state.settings.useGemini && geminiKey && geminiKey.length > 10) {
    try {
      const promptStory = `Eres un novelista experto en Sci-Fi y Fantasía Oscura.
Escribe una ESCENA CORTA o MONÓLOGO INTERNO (2 párrafos máximo) protagonizado por ${nombre}.
⚠️ REGLAS:
- NO escribas una biografía. NO "Name was born in...".
- SHOW, DON'T TELL: Que la escena demuestre su personalidad (${(state.rasgos || []).slice(0, 3).join(', ')}) y su rol (${rol}).
- Empieza "In Media Res" (en medio de una acción o pensamiento).
- Ambiente: ${universo}, ${planeta}.
- Si es Villano: que se sienta la amenaza.
- Si es Héroe: que se sienta el peso de la responsabilidad.
${canonPrompt}
Responde SOLO con la historia.`;
      heliosStory = await callGemini(promptStory, 1200) || '';
    } catch (e) {
      console.error('Gemini story error:', e);
      heliosStory = '';
    }
  }
  if (!heliosStory) heliosStory = generarHistoriaHeliosLocal();
  state.heliosStory = heliosStory;

  const animalDescFinal = (geminiAnimalDesc || local.animalDesc || '');

  // Ensamblaje del resultado sin repeticiones
  state.heliosResult = `PERFIL BASE: ${local.perfil} | ${local.arquetipo}\nSIGNIFICADO: ${nombreSigReal || local.nombreSig}\n${local.analisis}\n${local.tension}${animalDescFinal.replace(/━+[^━]+━+/g, '\n\nVÍNCULO TOTÉMICO:\n').trim()}${geminiDeep ? '\n\n' + geminiDeep : ''}${heliosStory ? '\n\nREGISTRO NARRATIVO:\n' + heliosStory : ''}`;

  res.innerHTML = `<div class="analysis-panel">
    <h4><i class="fas fa-robot"></i> ANÁLISIS PSICOLÓGICO IA HELIOS — COMPLETADO</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);border-radius:8px;padding:10px"><div style="font-family:'Orbitron';font-size:9px;color:var(--green);letter-spacing:1px;margin-bottom:4px">PERFIL</div><div style="font-size:13px;font-weight:700;color:var(--text)">${local.perfil}</div></div>
      <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:10px"><div style="font-family:'Orbitron';font-size:9px;color:var(--accent);letter-spacing:1px;margin-bottom:4px">ARQUETIPO</div><div style="font-size:13px;font-weight:700;color:var(--text)">${local.arquetipo}</div></div>
    </div>
    <div style="margin-bottom:14px"><span style="font-family:'Orbitron';font-size:9px;color:var(--purple);letter-spacing:1px">SIGNIFICADO DEL NOMBRE</span><p style="font-size:12px;color:#cbd5e1;margin-top:4px">${nombreSigReal || local.nombreSig}</p></div>
    <div style="margin-bottom:14px"><span style="font-family:'Orbitron';font-size:9px;color:var(--accent);letter-spacing:1px">SÍNTESIS PSICOLÓGICA</span><p style="font-size:12px;line-height:1.7;color:#cbd5e1;margin-top:4px;white-space:pre-wrap">${local.analisis}</p></div>
    <div style="margin-bottom:${animalDescFinal ? '14px' : '0'}"><span style="font-family:'Orbitron';font-size:9px;color:#ef4444;letter-spacing:1px">TENSIÓN & CONFLICTO</span><p style="font-size:12px;line-height:1.7;color:#cbd5e1;margin-top:4px;white-space:pre-wrap">${local.tension}</p></div>
    ${animalDescFinal ? `<div style="margin-bottom:14px"><span style="font-family:'Orbitron';font-size:9px;color:var(--purple);letter-spacing:1px">VÍNCULO TOTÉMICO</span><p style="font-size:12px;line-height:1.7;color:#cbd5e1;margin-top:4px;white-space:pre-wrap">${animalDescFinal.replace(/━+[^━]+━+/g, '').trim()}</p></div>` : ''}
    ${geminiDeep ? `<div style="background:rgba(168,85,247,.06);border:1px solid rgba(168,85,247,.22);border-radius:8px;padding:12px;margin-top:8px"><div style="font-family:'Orbitron';font-size:9px;color:var(--purple);letter-spacing:1px;margin-bottom:6px"><i class="fas fa-brain"></i> ESTRATO PROFUNDO (IA)</div><p style="font-size:12px;line-height:1.7;color:#ddd6fe;white-space:pre-wrap">${geminiDeep}</p></div>` : ''}
    ${heliosStory ? `<div style="background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:12px;margin-top:8px"><div style="font-family:'Orbitron';font-size:9px;color:var(--accent);letter-spacing:1px;margin-bottom:6px"><i class="fas fa-feather"></i> ESCENA NARRATIVA (IA)</div><p style="font-size:12px;line-height:1.7;color:#bfdbfe">${heliosStory}</p></div>` : ''}
  </div>`;
  snd('ok');
}

// ============================================================
// DIÁLOGO — UTILS
// ============================================================
function usePreset(key, i) {
  const el = document.getElementById(`pot_${key}_${i}`);
  if (el) document.getElementById('dialogueInput').value = el.textContent || el.innerText;
  document.getElementById('dialogueInput').focus();
}

// ============================================================
// EXPORT
// ============================================================
// Exportación TXT/PDF:
// - Incluye todos los campos del personaje y, si existe, el análisis Helios.
// - La historia completa (biografía editable) se exporta como bloque independiente.
function exportTXT() {
  const d = { nombre: document.getElementById('nombre').value, alias: document.getElementById('alias')?.value || '', apodos: document.getElementById('apodos')?.value || '', genero: document.getElementById('genero')?.value || '', rol: document.getElementById('rolNarrativo').value, tituloEspiritual: document.getElementById('tituloEspiritual')?.value || '', edadReal: document.getElementById('edadReal')?.value || '', edadAparente: document.getElementById('edadAparente')?.value || '', altura: document.getElementById('altura')?.value || state.altura || '', edadUnidad: getEdadUnidad(), eslogan: document.getElementById('eslogan').value, universo: document.getElementById('universo').options[document.getElementById('universo').selectedIndex]?.text, planeta: document.getElementById('planeta').value, raza: getRazaCompleta() || document.getElementById('raza').value, condicion: document.getElementById('condicion')?.value || '', rango: document.getElementById('rango').options[document.getElementById('rango').selectedIndex]?.text };

  const saludosTxt = Object.entries(state.saludos).map(([k, v]) => `  ${k}: ${v}`).join('\n') || '  —';
  const etiquetasTxt = state.etiquetas?.length ? state.etiquetas.join(' | ') : '—';
  const historiaTxt = (state.historia || '—');
  const historiaCompletaTxt = (state.historiaCompleta || '—');

  const vestTxt = VESTIMENTA_CAT.map(c => `  ${c.name}: ${state.vestimenta?.[c.id] || '—'}`).join('\n');
  const ap = state.apariencia || {};
  const apTxt = `  Cabello : ${ap.cabello || '—'}\n  Ojos    : ${ap.ojos || '—'}\n  Piel    : ${ap.piel || '—'}\n  Alas    : ${ap.alas || '—'}\n  Ropaje  : ${ap.ropaje || '—'}\n  Extra   : ${(ap.extra || '—').trim() || '—'}`;

  const habTxt = state.habilidades?.length ? state.habilidades.map(h => `  • ${h.nombre}\n    └─ ${h.desc}`).join('\n\n') : '  —';

  const villTxt = d.rol === 'Villano' ? `\n\n━━━ CONTEXTO OSCURO (VILLANO) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  Motivación : ${state.villain?.motivacion || '—'}\n  Objetivo   : ${state.villain?.objetivo || '—'}\n  Métodos    : ${state.villain?.metodos || '—'}\n  Debilidad  : ${state.villain?.debilidad || '—'}\n  Crueldad   : ${state.villain?.crueldad || '—'}` : '';

  const copyrightTxt = 'Copyright © 2026 Seres Del Noveno Universo. Todos los derechos reservados. Es fundamental declarar que el universo narrativo, la mitología, los personajes y el trasfondo conceptual de "Seres del Noveno Universo" (S9U) y su Gran Lore son una obra original e intelectual de Jonathan Gabriel Nieto. Como único y auténtico creador, Jonathan ha concebido, desarrollado, escrito y editado cada fibra de esta historia. Esta obra está protegida por las leyes internacionales de propiedad intelectual; cualquier reproducción, distribución o transformación de este material sin el consentimiento expreso del autor queda estrictamente prohibida. La autenticidad de S9U reside en la visión única de su autor original, quien posee la titularidad exclusiva sobre este legado literario.';

  const txt = `\n╔══════════════════════════════════════════════════════════════╗\n║          S9U HELIOS ENGINE DATA — FICHA DE PERSONAJE         ║\n║     Red de Ariel enlazada a Helios | Computarizado por Logan ║\n║                        Versión 8.0                           ║\n╚══════════════════════════════════════════════════════════════╝\n
━━━ 1. IDENTIDAD & ORIGEN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Nombre       : ${d.nombre}\n  Alias        : ${d.alias || '—'}\n  Apodos       : ${d.apodos || '—'}\n  Género       : ${d.genero || '—'}\n  Rol          : ${d.rol || '—'}\n  Título esp.  : ${d.tituloEspiritual || '—'}\n  Edad real    : ${d.edadReal || '—'} ${d.edadUnidad}\n  Edad aparente: ${d.edadAparente || '—'} ${d.edadUnidad}\n  Altura       : ${d.altura || '—'}\n  Eslogan      : ${d.eslogan || '—'}\n  Universo     : ${d.universo}\n  Planeta      : ${d.planeta || '—'}\n  Raza         : ${d.raza}\n  Condición    : ${d.condicion || '—'}\n  Rango        : ${d.rango}\n${villTxt}

━━━ 2. APARIENCIA & VESTIMENTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━
${apTxt}\n\n${vestTxt}

━━━ 3. TRASFONDO & BIOGRAFÍA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Núcleo Narrativo]
  ${historiaTxt}\n
  [Biografía Completa]
  ${historiaCompletaTxt}\n
  [Etiquetas]
  ${etiquetasTxt}

━━━ 4. PERFIL DE PERSONALIDAD (DATOS) ━━━━━━━━━━━━━━━━━━━━
  [Rasgos]: ${state.rasgos?.join(', ') || '—'}
  [Deseos]: ${state.deseos?.join(' | ') || '—'}
  [Detesta]: ${state.detesta?.join(', ') || '—'}
  [Hobbies]: ${state.hobbies?.join(', ') || '—'}
  
  [Estilo de Diálogo (Preguntas Clave)]
${saludosTxt}
  
  [Conclusión Moral]: ${generarConclusionMoral()}

━━━ 5. HABILIDADES & RELACIONES ━━━━━━━━━━━━━━━━━━━━━━━━━━
${habTxt}\n
  [Red de Contactos]
${(state.rels || []).map(r => `  [${r.tipo}] ${r.nombre} → ${r.desc}`).join('\n') || '  —'}

━━━ 6. ANÁLISIS PSICOLÓGICO (HELIOS) ━━━━━━━━━━━━━━━━━━━━━
${state.heliosResult ? state.heliosResult : '—'}

━━━ DERECHOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${copyrightTxt}\n`;

  const b = new Blob([txt], { type: 'text/plain;charset=utf-8' }), a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = `S9U_Helios_${d.nombre.replace(/\s/g, '_')}_v8_${Date.now()}.txt`;
  a.click();
}

function exportPDF() {
  const { jsPDF } = window.jspdf; const doc = new jsPDF(); let y = 15; const d = { nombre: document.getElementById('nombre').value, alias: document.getElementById('alias')?.value || '', apodos: document.getElementById('apodos')?.value || '', genero: document.getElementById('genero')?.value || '', rol: document.getElementById('rolNarrativo').value, tituloEspiritual: document.getElementById('tituloEspiritual')?.value || '', edadReal: document.getElementById('edadReal')?.value || '', edadAparente: document.getElementById('edadAparente')?.value || '', edadUnidad: getEdadUnidad(), eslogan: document.getElementById('eslogan').value, universo: document.getElementById('universo').options[document.getElementById('universo').selectedIndex]?.text, planeta: document.getElementById('planeta').value, raza: getRazaCompleta() || document.getElementById('raza').value, condicion: document.getElementById('condicion')?.value || '', rango: document.getElementById('rango').options[document.getElementById('rango').selectedIndex]?.text };
  const rol = d.rol || '';
  const saludosList = getSaludosList();
  const section = t => { if (y > 265) { doc.addPage(); y = 15 } doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(59, 130, 246); doc.text(t, 15, y); y += 5; doc.setDrawColor(59, 130, 246); doc.setLineWidth(.3); doc.line(15, y, 195, y); y += 5; doc.setTextColor(50, 50, 50); doc.setFont('helvetica', 'normal'); doc.setFontSize(8) };
  const ln = (l, v) => { if (y > 270) { doc.addPage(); y = 15 } doc.setFont('helvetica', 'bold'); doc.text(l, 15, y); doc.setFont('helvetica', 'normal'); doc.text(v || '—', 55, y); y += 5 };
  const block = t => { if (!t) return; doc.splitTextToSize(t, 175).forEach(l => { if (y > 270) { doc.addPage(); y = 15 } doc.text(l, 15, y); y += 4.5 }); y += 3 };

  // 1. IDENTIDAD
  section('1. IDENTIDAD & ORIGEN');
  ln('Nombre:', d.nombre); ln('Rol:', d.rol); ln('Título esp.:', d.tituloEspiritual); ln('Edad real:', (d.edadReal ? d.edadReal + ' ' + d.edadUnidad : '—')); ln('Edad aparente:', (d.edadAparente ? d.edadAparente + ' ' + d.edadUnidad : '—')); ln('Altura:', (document.getElementById('altura')?.value || state.altura || '—')); ln('Eslogan:', d.eslogan); ln('Universo:', d.universo); ln('Planeta:', d.planeta); ln('Raza:', d.raza); ln('Rango:', d.rango); y += 3;
  if (d.rol === 'Villano') { doc.setTextColor(220, 38, 38); doc.setFont('helvetica', 'bold'); doc.text('PERFIL VILLANO', 15, y); y += 5; doc.setTextColor(50, 50, 50); doc.setFont('helvetica', 'normal'); block(`Motivación: ${state.villain?.motivacion || '—'}\nObjetivo: ${state.villain?.objetivo || '—'}\nMétodos: ${state.villain?.metodos || '—'}\nDebilidad: ${state.villain?.debilidad || '—'}\nCrueldad: ${state.villain?.crueldad || '—'}`) }

  // 2. APARIENCIA
  section('2. APARIENCIA & VESTIMENTA');
  block(`Cabello: ${state.apariencia?.cabello || '—'}\nOjos: ${state.apariencia?.ojos || '—'}\nPiel: ${state.apariencia?.piel || '—'}\nAlas: ${state.apariencia?.alas || '—'}\nRopaje: ${state.apariencia?.ropaje || '—'}\nExtra: ${(state.apariencia?.extra || '—').trim() || '—'}`);
  block(VESTIMENTA_CAT.map(c => `${c.name}: ${state.vestimenta?.[c.id] || '—'}`).join('\n'));

  // 3. TRASFONDO
  section('3. TRASFONDO & BIOGRAFÍA');
  doc.setFont('helvetica', 'bold'); doc.text('Biografía Completa:', 15, y); y += 5; doc.setFont('helvetica', 'normal');
  block((state.historiaCompleta || '—').toString());
  doc.setFont('helvetica', 'bold'); doc.text('Núcleo Narrativo:', 15, y); y += 5; doc.setFont('helvetica', 'normal');
  block(state.historia || '—');
  doc.setFont('helvetica', 'bold'); doc.text('Etiquetas:', 15, y); y += 5; doc.setFont('helvetica', 'normal');
  block(state.etiquetas?.length ? state.etiquetas.join(' | ') : '—');

  // 4. PERSONALIDAD
  section('4. DATOS DE PERSONALIDAD');
  ln('Rasgos:', state.rasgos?.join(', '));
  ln('Deseos:', state.deseos?.join(' | '));
  ln('Detesta:', state.detesta?.join(', '));
  ln('Hobbies:', state.hobbies?.join(', '));
  y += 5;
  doc.setFont('helvetica', 'bold'); doc.text('Estilo de Diálogo:', 15, y); y += 5; doc.setFont('helvetica', 'normal');
  block(saludosList.map(s => `${s.q} -> ${(state.saludos?.[s.id] || '—').trim() || '—'}`).join('\n'));
  ln('Moralidad:', generarConclusionMoral());

  // 5. HABILIDADES Y RELACIONES
  section('5. HABILIDADES & RELACIONES');
  block(state.habilidades?.length ? state.habilidades.map(h => `${h.nombre}: ${h.desc}`).join('\n') : '—');
  state.rels.forEach(r => { doc.setFont('helvetica', 'bold'); doc.text(`[${r.tipo}] ${r.nombre}`, 15, y); y += 4; doc.setFont('helvetica', 'normal'); block(r.desc) });

  // 6. HELIOS
  if (state.heliosResult) {
    section('6. ANÁLISIS PSICOLÓGICO (HELIOS)');
    // Clean up formatting for PDF
    let cleanHelios = state.heliosResult.replace(/\*\*/g, '').replace(/###/g, '').replace(/━━━/g, '');
    block(cleanHelios);
  }

  section('DERECHOS'); block('Copyright © 2026 Seres Del Noveno Universo. Todos los derechos reservados.\n\nEs fundamental declarar que el universo narrativo, la mitología, los personajes y el trasfondo conceptual de "Seres del Noveno Universo" (S9U) y su Gran Lore son una obra original e intelectual de Jonathan Gabriel Nieto. Como único y auténtico creador, Jonathan ha concebido, desarrollado, escrito y editado cada fibra de esta historia.\n\nEsta obra está protegida por las leyes internacionales de propiedad intelectual; cualquier reproducción, distribución o transformación de este material sin el consentimiento expreso del autor queda estrictamente prohibida.\n\nLa autenticidad de S9U reside en la visión única de su autor original, quien posee la titularidad exclusiva sobre este legado literario.');
  doc.setFontSize(6); doc.setTextColor(150, 150, 150); doc.text(`S9U Helios Engine v8.0 | ${new Date().toLocaleString('es-AR')}`, 105, 290, { align: 'center' });
  doc.save(`S9U_Helios_${d.nombre.replace(/\s/g, '_')}_v8_${Date.now()}.pdf`);
}
function resetAll() { if (!confirm('¿Reiniciar todo? Se perderán todos los datos.')) return; location.reload() }

// SPLASH SCREEN INIT
window.addEventListener('load', () => {

  const splash = document.getElementById('splashScreen');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hidden');
      window.scrollTo(0, 0); // Force top scroll when splash disappears
      document.body.style.overflow = 'auto'; document.body.style.overflowX = 'hidden';
      setTimeout(() => {
        // Trigger typing sequence instead of old bootTerminal
        runTypingSequence();
      }, 500); // Start 0.5s after splash fades
    }, 2500);
  }
});
