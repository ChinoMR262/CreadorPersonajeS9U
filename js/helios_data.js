const UNIVERSOS = [
  { id: 1, name: "Eon", planetas: ["Urse (Extinto)"], razas: ["Eonios (extintos)"] },
  { id: 2, name: "Umbra", planetas: ["Umbra"], razas: ["Umbra (seres de sombra)"] },
  { id: 3, name: "Tierra", planetas: ["Tierra"], razas: ["Humanos"] },
  { id: 4, name: "Petro", planetas: ["Petro"], razas: ["Petro (seres rocosos)"] },
  { id: 5, name: "Posidonia", planetas: ["Posidonia"], razas: ["Aquamaris"] },
  { id: 6, name: "Ignis", planetas: ["Ignis"], razas: ["Ignareos (seres de magma)"] },
  { id: 7, name: "Aer (Aeris)", planetas: ["Aeris"], razas: ["Aeris (entidades aéreas)"] },
  { id: 8, name: "Sylvan", planetas: ["Sylvan"], razas: ["Sylvani"] },
  { id: 9, name: "Siul & Kairon", planetas: ["Siul", "Kairon"], razas: ["Siulcianos", "Ángeles", "Raza Angelical", "Kairianos", "Veyru", "Crysari", "Náyren", "Éthrios"] },
  { id: 10, name: "Luminar", planetas: ["Luminar"], razas: ["Lumina"] },
  { id: 11, name: "Mecanis", planetas: ["Mecanis"], razas: ["Mecánides"] },
  { id: 12, name: "Arkan", planetas: ["Arkan"], razas: ["Arkanos"] },
  { id: 13, name: "Nexus", planetas: ["Nexus"], razas: ["Nexusianos"] },
  { id: 14, name: "Mirror (Espejo)", planetas: ["Mirror"], razas: ["Mirrorians"] },
  { id: 15, name: "Quanta", planetas: ["Quanta"], razas: ["Quantar"] },
  { id: 16, name: "Vampyrion", planetas: ["Vampyrion"], razas: ["Vampyrion"] },
  { id: 17, name: "Bajo Astral", planetas: ["Bajo Astral"], razas: ["Sombras", "Almas en tránsito", "Entidades de purga"] },
  { id: 18, name: "Chronos", planetas: ["Chronos"], razas: ["Cronomantes (entidades temporales)"] },
  { id: 19, name: "Ethereal", planetas: ["Ethereal"], razas: ["Entidades etéreas"] },
  { id: 20, name: "Solaris", planetas: ["Solaris"], razas: ["Solaritas (entidades solares)"] },
  { id: 21, name: "Frontera (Ecos No Nombrados)", planetas: ["Frontera"], razas: ["Anómalos", "Ecos", "Formas pre-lingüísticas"] }
];

// Apariencia: categorías + opciones base/villano.
// Nota: el usuario puede personalizar; las opciones son sugerencias.
const APARIENCIA_CAT = [
  { id: 'cabello', name: 'Cabello' },
  { id: 'ojos', name: 'Ojos' },
  { id: 'piel', name: 'Piel' },
  { id: 'alas', name: 'Alas' },
  { id: 'ropaje', name: 'Ropaje' }
];

const APARIENCIA_OPT_BASE = {
  cabello: [
    'Blanco perlado con reflejos azul-aguamarina', 'Negro abisal con destellos plateados', 'Azul océano profundo', 'Plateado lunar', 'Castaño oscuro con brillo nacarado', 'Rojo coral vivo', 'Trenzas rituales', 'Cabello flotante (corriente propia)'
  ],
  ojos: [
    'Azul profundo con destellos dorados', 'Verde esmeralda marino', 'Gris cósmico con chispas', 'Ámbar con halo de luz', 'Negro total (vacío)', 'Violeta astral', 'Ojos bicolores (marea dual)'
  ],
  piel: [
    'Clara con brillo nacarado (Siul–Aquamaris)', 'Tono marfil humano', 'Piel luminiscente (bioluminiscencia)', 'Piel con runas de agua y luz', 'Piel pálida con sombras del velo'
  ],
  alas: [
    'Filamentos de agua y luz entrelazados', 'Alas transparentes (marea cristalina)', 'Aletas/alas de energía acuática', 'Alas de niebla luminosa', 'Sin alas visibles'
  ],
  ropaje: [
    'Tejidos coralinos vivos (cambian con emoción)', 'Túnica posidoniana ceremonial', 'Capa de agua sólida (fluida)', 'Armadura de perlas y escamas', 'Ropaje siulciano de luz', 'Traje sigiloso del velo', 'Vestiduras de templo marino'
  ]
};

// Opciones adicionales cuando el rol es Villano (tono oscuro).
const APARIENCIA_OPT_VILLAIN = {
  cabello: [
    'Negro absoluto con cenizas rojas', 'Blanco espectral (hebras como humo)', 'Rojo infernal (brasas vivas)', 'Cabello como sombras líquidas', 'Trenzas con sellos malditos'
  ],
  ojos: [
    'Rojo ígneo (pupila hendida)', 'Ámbar con grietas negras', 'Negro total con halo carmesí', 'Ojos dorados de depredador', 'Violeta abisal (brillo venenoso)'
  ],
  piel: [
    'Piel ceniza con runas malditas', 'Piel oscura (obsidiana viva)', 'Piel pálida espectral', 'Escamas finas (demoníacas)', 'Marcas de fuego bajo la piel'
  ],
  alas: [
    'Alas de sombra (membrana rasgada)', 'Alas óseas con energía roja', 'Cuernos/alas astrales (proyección)', 'Aletas abisales negras', 'Sin alas visibles (presencia demoníaca)'
  ],
  ropaje: [
    'Armadura abisal (coral oscuro vivo)', 'Túnica demoníaca del Velo (hilos de sombra)', 'Vestiduras de entidad (agua negra y luz roja)', 'Capa de marea sanguina', 'Ropaje de hueso coralino', 'Armadura ritual con runas prohibidas', 'Manto de niebla tóxica (espiritual)', 'Traje de ejecución (sigilo + terror)'
  ]
};
// Rangos jerárquicos (afectan validación y tema visual).
const RANGOS = [{ g: "TABLA 1: MULTIVERSAL", i: [{ n: "Ángel", u: 90 }, { n: "Arcángel", u: 100 }, { n: "Principado", u: 200 }, { n: "Virtud", u: 300 }, { n: "Potestad", u: 400 }, { n: "Dominación", u: 500 }, { n: "Trono", u: 600 }, { n: "Querubín", u: 700 }, { n: "Serafín", u: 800 }, { n: "Factum", u: 900 }] }, { g: "TABLA 2: DEL TODO", i: [{ n: "Ángel Legendario", u: 1000 }, { n: "Arcángel Legendario", u: 2000 }, { n: "Principado Legendario", u: 5000 }, { n: "Initium", u: 10000 }, { n: "Virtud Legendaria", u: 20000 }, { n: "Potestad Legendaria", u: 50000 }, { n: "Dominación Legendaria", u: 100000 }, { n: "Trono Legendario", u: 200000 }, { n: "Querubín Legendario", u: 300000 }, { n: "Serafín Legendario", u: 400000 }, { n: "Factum Legendario", u: 500000 }, { n: "Factum Supremo", u: 1000000 }] }];



// Tipos de relación: afecta badge/color y prompt para descripción (IA/local).
const SIGNOS_ZODIACALES = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"
];



// ============================================================
// SIGNOS ZODIACALES (SIUL - UNIVERSO 9)
// ============================================================
// Basado en los 15 Meses Sagrados de Siul.
const SIGNOS_SIUL = [
  { id: 'genesis', nombre: 'Genesis', descripcion: 'El inicio de todo, nacimiento cósmico.' },
  { id: 'luxar', nombre: 'Luxar', descripcion: 'Luz de lo eterno.' },
  { id: 'edenos', nombre: 'Edenos', descripcion: 'Tiempo del Jardín Sagrado.' },
  { id: 'veritas', nombre: 'Veritas', descripcion: 'Revelación de verdades.' },
  { id: 'altura', nombre: 'Altura', descripcion: 'Elevación espiritual.' },
  { id: 'armonis', nombre: 'Armonis', descripcion: 'Unión de lo divino y lo humano.' },
  { id: 'gaian', nombre: 'Gaian', descripcion: 'Vínculo con la vida natural.' },
  { id: 'solaris', nombre: 'Solaris', descripcion: 'Influjo solar, iluminación.' },
  { id: 'humah', nombre: 'Humah', descripcion: 'Mes del alma y sus pruebas.' },
  { id: 'nuvem', nombre: 'Nuvem', descripcion: 'Tiempo de reflexión.' },
  { id: 'espiritus', nombre: 'Espiritus', descripcion: 'Contacto con planos elevados.' },
  { id: 'profetia', nombre: 'Profetia', descripcion: 'Visión de los profetas.' },
  { id: 'consagria', nombre: 'Consagria', descripcion: 'Dedicación y votos.' },
  { id: 'eternum', nombre: 'Eternum', descripcion: 'La trascendencia.' },
  { id: 'siuliah', nombre: 'Siuliah', descripcion: 'Reunión espiritual con el Creador.' }
];

const TIPOS_REL = ["Madre", "Padre", "Hermano", "Hermana", "Hijo", "Hija", "Sobrino", "Sobrina", "Tío", "Tía", "Abuelo", "Abuela", "Hermanastro", "Hermanastra", "Padrastro", "Madrastra", "Pareja", "Amor", "Mejor Amigo", "Mejor Amiga", "Amigo", "Amiga", "Confidente", "Cuñado", "Cuñada", "Enemigo", "Archienemigo", "Rival", "Mentor", "Protegido"];

// Hobbies: chips multi-selección.
const HOBBIES = ["Meditación", "Entrenamiento Marcial", "Lectura", "Escritura", "Música", "Danza", "Pintura", "Escultura", "Cocina", "Viajes", "Exploración", "Combate", "Estrategia", "Ciencia", "Alquimia", "Magia", "Oración", "Filosofía", "Astronomía", "Historia", "Diplomacia", "Espionaje", "Caza", "Pesca", "Jardinería", "Curación", "Predicación", "Arte Marcial", "Aventura", "Mezcla de Pociones", "Construcción", "Entrenamiento de Bestias", "Conversación", "Poker", "Ajedrez", "Meditación Combativa", "Viajes Interdimensionales", "Entomología", "Mecánica", "Programación", "Invención", "Herrera", "Carpintería", "Pesca Mística", "Clarivoyancia", "Yoga", "Surfeo", "Escalada", "Submarismo"];

// Detesta: base (general) + extra para villano.
const DETESTA = [
  { n: "Spam y propaganda", a: "Digital" },
  { n: "Spoilers sin aviso", a: "Digital" },
  { n: "Ruido excesivo", a: "Ambiental" },
  { n: "Impuntualidad crónica", a: "Social" },
  { n: "Mentiras repetidas", a: "Social" },
  { n: "Violación de privacidad", a: "Social" },
  { n: "Ignorancia willful", a: "Cognitivo" },
  { n: "Microagresiones", a: "Social" },
  { n: "Contaminación ambiental", a: "Ambiental" },
  { n: "Manipulación emocional", a: "Social" },
  { n: "Pantallas excesivas", a: "Digital" },
  { n: "Críticas destructivas", a: "Social" },
  { n: "Desorden extremo", a: "Ambiental" },
  { n: "Traición de confianza", a: "Social" },
  { n: "Burocracia innecesaria", a: "Institucional" },
  { n: "Superficialidad constante", a: "Cognitivo" },
  { n: "Sintonia fracturada de Helios", a: "Espiritual" },
  { n: "Canales de Siul contaminados", a: "Ambiental" },
  { n: "Mentiras del Consejo de Edenos", a: "Institucional" },
  { n: "Oscurecer los Arcos de Veritas", a: "Lore" },
  { n: "Aguas estancadas de la Bahía Silente", a: "Ambiental" },
  { n: "Voceros del Consejo que solo susurran", a: "Comunicación" },
  { n: "Corrientes de energía sin compás", a: "Espiritual" },
  { n: "Niebla permanente en el Umbral", a: "Ambiental" }
];
const DETESTA_VILLAIN = [
  { n: "Desafío a mi autoridad", a: "Control" },
  { n: "Humillación pública", a: "Ego" },
  { n: "Piedad ajena", a: "Ego" },
  { n: "Obediencia fingida", a: "Control" },
  { n: "Traición sin propósito", a: "Lealtad" },
  { n: "Lealtad tibia", a: "Lealtad" },
  { n: "Héroes moralistas", a: "Ideología" },
  { n: "Inocencia que inspira esperanza", a: "Ideología" },
  { n: "Compasión que frena el plan", a: "Estrategia" },
  { n: "Redención predicada", a: "Ideología" },
  { n: "Caos sin dirección", a: "Orden" },
  { n: "Fallas de disciplina", a: "Orden" },
  { n: "Errores repetidos", a: "Eficiencia" },
  { n: "Improvisación sin cálculo", a: "Estrategia" },
  { n: "Testigos innecesarios", a: "Operación" },
  { n: "Rumores fuera de control", a: "Operación" },
  { n: "Mentiras mal ejecutadas", a: "Estrategia" },
  { n: "Sentimentalismo", a: "Ego" },
  { n: "Debilidad emocional", a: "Ego" },
  { n: "Caer en la rutina", a: "Dominio" },
  { n: "Ser subestimado", a: "Ego" },
  { n: "Que me den órdenes", a: "Control" },
  { n: "Reglas que limiten mi voluntad", a: "Control" },
  { n: "Perder el tiempo", a: "Eficiencia" },
  { n: "Deudas impagas", a: "Orden" },
  { n: "Incompetencia en mis filas", a: "Orden" },
  { n: "Interferencia divina", a: "Ideología" },
  { n: "Bondad ingenua", a: "Ideología" },
  { n: "La duda en mis aliados", a: "Control" },
  { n: "Falta de visión", a: "Estrategia" },
  { n: "Compasión hacia el enemigo", a: "Estrategia" },
  { n: "Arrepentimiento tardío", a: "Ego" }
];

let _aiSuggestReq = { hobbies: 0, detesta: 0, deseos: 0, rasgos: 0 };
let _aiSuggestLast = { hobbies: 0, detesta: 0, deseos: 0, rasgos: 0 };
const _aiSuggestCache = { hobbies: {}, detesta: {}, deseos: {}, rasgos: {} };

function getAISuggestContextKey() {
  const rol = document.getElementById('rolNarrativo')?.value || '';
  const universo = getUniversoName() || '';
  const raza = getRazaCompleta() || document.getElementById('raza')?.value || '';
  const condicion = document.getElementById('condicion')?.value || '';
  const tags = (state.etiquetas || []).slice(0, 24).join('|');
  return [rol, universo, raza, condicion, tags].join('::');
}

async function fetchAISuggestions(kind) {
  try {
    if (!state.settings?.useGemini) return null;
    if (!geminiKey || geminiKey.length < 10) return null;
    const ctxKey = getAISuggestContextKey();
    if (_aiSuggestCache?.[kind]?.[ctxKey]) return _aiSuggestCache[kind][ctxKey];
    const rol = document.getElementById('rolNarrativo')?.value || '';
    const universo = getUniversoName() || '—';
    const raza = getRazaCompleta() || document.getElementById('raza')?.value || '—';
    const nombre = document.getElementById('nombre')?.value || '—';
    const condicion = document.getElementById('condicion')?.value || '—';
    const tags = (state.etiquetas || []).slice(0, 24).join(', ') || '—';

    let prompt = '';
    if (kind === 'hobbies') {
      prompt = `Genera sugerencias de HOBBIES/PASATIEMPOS para un personaje del universo S9U.
Responde SOLO con un JSON array de strings.

Reglas:
- Español.
- Entre 16 y 24 items.
- Evita repetir los hobbies obvios de la lista base (busca variedad).
- Si el rol es Villano, incluye hobbies oscuros (sin gore explícito).

Contexto:
Nombre=${nombre}
Rol=${rol || '—'}
Universo=${universo}
Raza=${raza}
Condición=${condicion}
Etiquetas=${tags}`;
    } else if (kind === 'detesta') {
      prompt = `Genera sugerencias de COSAS QUE DETESTA para un personaje del universo S9U.
Responde SOLO con un JSON array de objetos con forma {"n":"...","a":"..."}.

Reglas:
- Español.
- Entre 12 y 20 objetos.
- "a" es el ámbito (1-2 palabras): Social, Control, Estrategia, Digital, Ideología, Ego, Orden, etc.
- Si el rol es Villano: más control, ego, estrategia, obediencia.

Contexto:
Nombre=${nombre}
Rol=${rol || '—'}
Universo=${universo}
Raza=${raza}
Condición=${condicion}
Etiquetas=${tags}`;
    } else if (kind === 'deseos') {
      prompt = `Genera DESEOS PROFUNDOS para un personaje del universo S9U.
Responde SOLO con un JSON array de objetos con forma {"n":"...","d":"...","f":"..."}.

Reglas:
- Español.
- Exactamente 10 objetos.
- n: título corto.
- d: descripción 1-2 frases.
- f: una frase-guía en primera persona entre comillas.
- Si rol Villano: deseos de dominio, destino oscuro, control, inevitabilidad.

Contexto:
Nombre=${nombre}
Rol=${rol || '—'}
Universo=${universo}
Raza=${raza}
Condición=${condicion}
Etiquetas=${tags}`;
    } else if (kind === 'rasgos') {
      prompt = `Genera RASGOS de personalidad para un personaje del universo S9U.
Responde SOLO con un JSON object cuyas claves son categorías y los valores son arrays de strings.

Reglas:
- Español.
- 3 a 6 categorías.
- Cada categoría: 8 a 16 rasgos.
- Si rol Villano: incluye rasgos oscuros/estratégicos.

Contexto:
Nombre=${nombre}
Rol=${rol || '—'}
Universo=${universo}
Raza=${raza}
Condición=${condicion}
Etiquetas=${tags}`;
    } else {
      return null;
    }

    const raw = await callGemini(prompt, 900);
    if (!raw || typeof raw !== 'string') return null;
    const txt = raw.trim();
    const first = txt.indexOf('[');
    const firstObj = txt.indexOf('{');
    const jsonStart = (kind === 'rasgos') ? (firstObj >= 0 ? firstObj : 0) : (first >= 0 ? first : 0);
    const payload = txt.slice(jsonStart);
    let parsed = null;
    try { parsed = JSON.parse(payload); } catch (e) { parsed = null; }
    if (!parsed) return null;
    _aiSuggestCache[kind][ctxKey] = parsed;
    return parsed;
  } catch (e) {
    return null;
  }
}

function requestAISuggestions(kind) {
  const now = Date.now();
  if (now - (_aiSuggestLast[kind] || 0) < 6000) return;
  _aiSuggestLast[kind] = now;
  const req = ++_aiSuggestReq[kind];
  setTimeout(async () => {
    if (req !== _aiSuggestReq[kind]) return;
    const res = await fetchAISuggestions(kind);
    if (req !== _aiSuggestReq[kind]) return;
    if (!res) return;
    if (!state.aiSuggestions) state.aiSuggestions = { hobbies: [], detesta: [], deseos: [], rasgos: {} };
    if (kind === 'hobbies' && Array.isArray(res)) state.aiSuggestions.hobbies = res.filter(x => typeof x === 'string').map(x => x.trim()).filter(Boolean);
    if (kind === 'detesta' && Array.isArray(res)) state.aiSuggestions.detesta = res.filter(x => x && typeof x.n === 'string').map(x => ({ n: String(x.n).trim(), a: String(x.a || 'IA').trim() || 'IA' })).filter(x => x.n);
    if (kind === 'deseos' && Array.isArray(res)) state.aiSuggestions.deseos = res.filter(x => x && typeof x.n === 'string').map(x => ({ n: String(x.n).trim(), d: String(x.d || '').trim(), f: String(x.f || '').trim() })).filter(x => x.n);
    if (kind === 'rasgos' && res && typeof res === 'object') state.aiSuggestions.rasgos = res;

    if (kind === 'hobbies') poblarHobbies();
    if (kind === 'detesta') poblarDetesta();
    if (kind === 'deseos') poblarDeseos();
    if (kind === 'rasgos') poblarRasgos();
  }, 80);
}

// Preguntas clave: se guardan en state.saludos, pero son moral/persona.
const SALUDOS = [
  { id: 'saludo1', q: '¿Ayudaría a un desconocido si nadie lo viera?' },
  { id: 'saludo2', q: '¿Qué haría si debe elegir entre salvar a uno o a muchos?' },
  { id: 'saludo3', q: '¿Perdonaría una traición grave?' },
  { id: 'saludo4', q: '¿Miente para proteger o dice la verdad aunque duela?' },
  { id: 'saludo5', q: '¿Busca poder, paz, justicia o pertenencia?' },
  { id: 'saludo6', q: '¿Se sacrificaría por alguien que ama?' },
  { id: 'saludo7', q: '¿Qué haría si nadie pudiera juzgarlo?' },
  { id: 'saludo8', q: '¿A quién nunca podría traicionar?' }
];

const SALUDOS_VILLAIN = [
  { id: 'saludo1', q: '¿Qué estás dispuesto a destruir para alcanzar tu objetivo final?' },
  { id: 'saludo2', q: 'Si el mundo se opone, ¿preferís quebrarlo o controlarlo desde las sombras?' },
  { id: 'saludo3', q: '¿Cuál es tu límite real… y qué tendría que pasar para cruzarlo?' },
  { id: 'saludo4', q: 'Cuando mentís, ¿lo hacés por estrategia, por placer o por protección del plan?' },
  { id: 'saludo5', q: '¿Qué tipo de poder te obsesiona: miedo, lealtad, control, conocimiento o divinidad?' },
  { id: 'saludo6', q: '¿A quién salvarías… solo porque te pertenece?' },
  { id: 'saludo7', q: 'Si nadie pudiera castigarte, ¿qué harías primero?' },
  { id: 'saludo8', q: '¿A quién nunca traicionarías… y por qué te conviene que exista?' }
];

function getSaludosList() {
  const role = document.getElementById('rolNarrativo')?.value || '';
  return role === 'Villano' ? SALUDOS_VILLAIN : SALUDOS;
}

// Etiquetas narrativas: motor de "Definición de historia".
const ETIQUETAS = ["Destino", "Traición", "Redención", "Sacrificio", "Venganza", "Descubrimiento", "Pérdida", "Renacimiento", "Misterio", "Conquista", "Amor", "Lealtad", "Lucha", "Soledad", "Esperanza", "Fe", "Caos", "Orden", "Poder", "Deber", "Exilio", "Secreto", "Liberación", "Ruptura", "Juramento", "Fractura", "Resistencia", "Revelación"];
const ETIQUETAS_VILLAIN = ["Dominación", "Corrupción", "Condena", "Herejía", "Oscuridad", "Terror", "Pecado", "Rencor", "Velo", "Abismo", "Inframundo", "Profanación", "Pacto", "Sangre", "Caza", "Castigo", "Manipulación", "Ritual", "Devastación", "Venganza"];

// Vestimenta: categorías (acordeón) + opciones por categoría.
const VESTIMENTA_CAT = [
  { id: 'torso', name: 'Torso' },
  { id: 'piernas', name: 'Piernas' },
  { id: 'calzado', name: 'Calzado' },
  { id: 'accesorios', name: 'Accesorios' },
  { id: 'brazaletes', name: 'Brazaletes' },
  { id: 'armas', name: 'Armas' }
];
const VESTIMENTA_OPT = {
  torso: ["Armadura ligera", "Armadura pesada", "Túnica arcana", "Camisa táctica", "Chaqueta de cuero", "Abrigo largo", "Peto ceremonial", "Ropaje noble", "Uniforme militar", "Capa con broches", "Traje sigiloso", "Toga divina", "Pechera reforzada", "Sudadera urbana", "Kimono ritual"],
  piernas: ["Pantalón táctico", "Pantalón de cuero", "Pantalón ceremonial", "Falda ritual", "Grebas metálicas", "Grebas de hueso", "Pantalón urbano", "Pantalón de tela", "Mallas sigilosas", "Pantalón reforzado", "Pantalón de viaje", "Pantalón noble", "Piernas blindadas", "Pantalón desértico", "Pantalón de combate"],
  calzado: ["Botas de combate", "Botas altas", "Botas ligeras", "Zapatillas urbanas", "Sandalias rituales", "Botas blindadas", "Botas de viaje", "Botas de sigilo", "Calzado noble", "Zapatos formales", "Botas de nieve", "Botas del abismo", "Botas mágicas", "Calzado deportivo", "Botines de cuero"],
  accesorios: ["Anillo", "Collar", "Capa", "Capucha", "Máscara", "Gafas tácticas", "Orejeras", "Amuleto", "Cinturón", "Bandolera", "Broche", "Guantes", "Sombrero", "Pañoleta", "Insignia"],
  brazaletes: ["Brazalete de plata", "Brazalete dorado", "Brazalete de cuero", "Brazalete rúnico", "Brazalete de obsidiana", "Brazalete de hierro", "Brazalete de cristal", "Brazalete ceremonial", "Brazalete táctico", "Brazalete divino", "Brazalete abismal", "Brazalete reforzado", "Brazalete de hueso", "Brazalete siulciano", "Brazalete de energía"],
  armas: ["Espada", "Katana", "Lanza", "Hacha", "Martillo", "Dagas", "Arco", "Ballesta", "Pistola", "Rifle", "Guadaña", "Bastón", "Libro arcano", "Cadena", "Ninguna"]
};

// Deseos: base (general) + villano (más dominación/terror/estrategia).
const DESEOS = [{ n: "Legado Duradero", d: "Dejar una marca permanente que trascienda el tiempo y la muerte.", f: '"No quiero que se olviden lo que significó mi existencia."' }, { n: "Conexión Profunda", d: "Encontrar vínculos reales que entiendan la totalidad de quién soy.", f: '"Ser verdaderamente conocido por al menos una alma en este multiverso."' }, { n: "Dominio del Conocimiento", d: "Comprender los misterios más profundos de la realidad y el Todo.", f: '"El ignorar es la única muerte que temo verdaderamente."' }, { n: "Libertad Absoluta", d: "Liberarse de todas las cadenas, físicas, espirituales y mentales.", f: '"Nadie ni nada debe poder limitarte si tú no lo consientes."' }, { n: "Redención Total", d: "Expiar cada error del pasado y emerger como una versión pura.", f: '"El peso de lo hecho no debe definir lo que aún puedo ser."' }, { n: "Impacto Social", d: "Cambiar la vida de miles a través de acciones significativas.", f: '"Un solo acto de valor puede reescribir el destino colectivo."' }, { n: "Paz Interior", d: "Alcanzar un estado de armonía inquebrable dentro del caos.", f: '"La verdadera victoria no se gana contra otros, sino contra el miedo interno."' }, { n: "Poder Legítimo", d: "Obtener autoridad que venga del mérito y la justicia, no del miedo.", f: '"El poder real no se toma, se gana con cada sacrificio consciente."' }, { n: "Amor Incondicional", d: "Dar y recibir amor sin condiciones ni expectativas ocultas.", f: '"El amor que no exige nada a cambio es el único que vale la vida."' }, { n: "Unidad Espiritual", d: "Reconectar con la fuente divina y comprender el propósito último.", f: '"Volver a ser uno con lo que siempre fui antes de nacer."' }];
const DESEOS_VILLAIN = [
  { n: "Dominación Total", d: "Doblegar la voluntad ajena hasta que el mundo respire a tu ritmo.", f: '"No quiero aliados: quiero obediencia."' },
  { n: "Venganza Perfecta", d: "Cobrar cada deuda con precisión, sin dejar cabos sueltos.", f: '"No olvido. No perdono. Cobro."' },
  { n: "Control del Miedo", d: "Convertir el miedo en moneda universal y en herramienta de gobierno.", f: '"El terror es orden puro."' },
  { n: "Deidad por Derecho", d: "Ser el centro moral del universo: que tu juicio sea ley.", f: '"Si hay un dios, seré yo."' },
  { n: "Corrupción de la Luz", d: "Probar que lo puro también se quiebra; convertirlo en arma.", f: '"La luz también sangra."' },
  { n: "Imperio Eterno", d: "Fundar un dominio que sobreviva incluso a tu muerte.", f: '"Mi reino no dependerá de mi respiración."' },
  { n: "Silencio de Testigos", d: "Eliminar riesgos, rumores y memoria: control del relato.", f: '"La historia la escriben los que sobreviven."' },
  { n: "Sufrimiento como Arte", d: "Refinar el dolor como mensaje y como ritual de transformación.", f: '"El dolor enseña mejor que la fe."' },
  { n: "Supremacía Estratégica", d: "Ganar siempre: anticiparte, manipular, dividir, vencer.", f: '"Un golpe no basta: quiero inevitabilidad."' },
  { n: "Libertad Profana", d: "Romper toda cadena, juramento o mandato superior.", f: '"Nadie me define. Nadie me limita."' }
];

function getDetestaList() {
  const role = document.getElementById('rolNarrativo')?.value || '';
  return role === 'Villano' ? DETESTA_VILLAIN : DETESTA;
}
function getDeseosList() {
  const role = document.getElementById('rolNarrativo')?.value || '';
  return role === 'Villano' ? DESEOS_VILLAIN : DESEOS;
}
function getRasgosCat() {
  const role = document.getElementById('rolNarrativo')?.value || '';
  if (role !== 'Villano') return RASGOS_CAT;
  const RASGOS_CAT_VILLAIN = {
    "Interacción Social": ["Seductor", "Provocador", "Amenazante", "Encantador Oscuro", "Autoritario", "Sarcástico Frío", "Mentiroso Elegante", "Demagogo", "Intimidante", "Carismático Oscuro", "Cínico"],
    "Procesamiento Cognitivo": ["Calculador", "Paranoico Estratégico", "Visionario Distorsionado", "Paciente", "Meticuloso", "Oportunista Mental", "Maquiavélico", "Frío", "Obsesivo", "Rencoroso"],
    "Ética y Moral": ["Implacable", "Sádico", "Amoral", "Justiciero Torcido", "Fanático", "Profanador", "Corruptor", "Dominador"],
    "Orientación a la Acción": ["Conquistador", "Depredador", "Infiltrador", "Ejecutor", "Ritualista", "Torturador", "Saboteador", "Táctico de Terror", "Cazador", "Destructor"]
  };
  const merged = {};
  Object.keys(RASGOS_CAT).forEach(k => { merged[k] = [...RASGOS_CAT[k], ...(RASGOS_CAT_VILLAIN[k] || [])].filter((v, i, a) => a.indexOf(v) === i) });
  Object.keys(RASGOS_CAT_VILLAIN).forEach(k => { if (!merged[k]) merged[k] = [...RASGOS_CAT_VILLAIN[k]] });
  return merged;
}
const RASGOS_CAT = { "Interacción Social": ["Carismático", "Reservado", "Extrovertido", "Introvertido", "Diplomático", "Confrontacional", "Empático", "Distante", "Generoso", "Egoísta", "Fraternal", "Manipulador Social", "Líder Natural", "Seguidor Leal", "Mediador", "Aislacionista"], "Procesamiento Cognitivo": ["Analítico", "Intuitivo", "Creativo", "Metódico", "Curiosidad Insaciable", "Pensador Abstracto", "Pragmático", "Idealista", "Observador Agudo", "Despistado", "Estratégico", "Impulsivo", "Reflexivo Profundo", "Pensador Rápido", "Perfeccionista", "Adaptable"], "Ética y Moral": ["Justo", "Vengativo", "Compasivo", "Cruel", "Honesto", "Engañoso", "Lealista", "Traicionero", "Misericordioso", "Retributivo", "Principista", "Oportunista", "Altruista", "Narcisista", "Redentista", "Nihilista"], "Orientación a la Acción": ["Valiente", "Cauteloso", "Determinado", "Indeciso", "Dominante", "Sumiso", "Aventurero", "Conservador", "Disciplinado", "Rebelde", "Proactivo", "Reactivo", "Guerrero", "Pacifista", "Pionero", "Convencional"] };

const ANIMALES = [
  { id: 'tortuga', emoji: '🐢', name: 'Tortuga Mágica', domains: 'Sabiduría / Tiempo', desc: 'Ente de paciencia eterna. Su concha resguarda los secretos del tiempo mismo. Quienes la han elegido como vínculo desarrollan una calma profunda y una capacidad de resistencia que trasciende las edades.', img: 'img/sintonia_animal/vinculo_totemico_tortuga_magica.png' },
  { id: 'dragon', emoji: '🐉', name: 'Dragón Divino', domains: 'Poder / Eternidad', desc: 'Criatura de fuego y divinidad. Su existencia abarca eras enteras. El vínculo con el Dragón Divino otorga autoridad innata y una presencia que intimida incluso a los seres más poderosos.', img: 'img/sintonia_animal/vinculo_totemico_dragon_divino.png' },
  { id: 'aguila', emoji: '🦅', name: 'Águila Mágica', domains: 'Visión / Libertad', desc: 'Dorada y etérea, vuela entre planos de la realidad. Sus ojos ven lo que los demás ignoran. El vínculo despierta la capacidad de observar desde las alturas y tomar decisiones con perspectiva global.', img: 'img/sintonia_animal/vinculo_totemico_aguila_magica.png' },
  { id: 'paloma', emoji: '🕊️', name: 'Paloma Divina', domains: 'Paz / Mensajería', desc: 'Portadora de la palabra entre mundos. Su vuelo silencioso conecta lo desconectado. Elegirla como vínculo otorga una capacidad excepcional para mediar conflictos y transmitir verdades con suavidad.', img: 'img/sintonia_animal/vinculo_totemico_paloma_divina.png' },
  { id: 'fenix', emoji: '🌟', name: 'Fénix Estelar', domains: 'Renacimiento / Transformación', desc: 'Nace de sus propias cenizas en un ciclo sin fin. Su luz purifica lo corrompido. El vínculo con el Fénix Estelar representa la capacidad de renacer después de cualquier destrucción.', img: 'img/sintonia_animal/vinculo_totemico_fenix_estelar.png' },
  { id: 'lobo', emoji: '🐺', name: 'Lobo Lunar', domains: 'Instinto / Manada', desc: 'Caza bajo la luz de la luna con precisión absoluta. Su aullido une a los que están dispersos. El vínculo despierta la lealtad feroz hacia los seres cercanos y un instinto de supervivencia excepcional.', img: 'img/sintonia_animal/vinculo_totemico_lobo_lunar.png' },
  { id: 'serpiente', emoji: '🐍', name: 'Serpiente de Luz', domains: 'Transformación / Conocimiento', desc: 'No es la serpiente de las sombras, sino de la luz. Serpentea entre verdades ocultas. El vínculo con ella otorga la capacidad de adaptarse a cualquier situación y descubrir secretos que otros no ven.', img: 'img/sintonia_animal/vinculo_totemico_serpiente_luz.png' },
  { id: 'leon', emoji: '🦁', name: 'León Solar', domains: 'Nobleza / Coraje', desc: 'Rey de la sabana cósmica. Su melena brilla como el sol mismo. El vínculo despierta nobleza en el carácter, un coraje que no teme enfrentarse a lo desconocido.', img: 'img/sintonia_animal/vinculo_totemico_leon_solar.png' },
  { id: 'buho', emoji: '🦉', name: 'Búho Místico', domains: 'Conocimiento Oculto / Silencio', desc: 'Guardián de los secretos que viven en la oscuridad. Ve cuando otros están ciegos. El vínculo con el Búho otorga sabiduría nocturna y la capacidad de comprender lo que no se dice.', img: 'img/sintonia_animal/vinculo_totemico_buho_mistico.png' },
  { id: 'ciervo', emoji: '🦌', name: 'Ciervo Sagrado', domains: 'Gracia / Naturaleza', desc: 'Camina con una elegancia que parece desafiar la gravedad. Sus astas brillan con luz propia. El vínculo despierta una conexión profunda con la naturaleza y una gracia innata en cada movimiento.', img: 'img/sintonia_animal/vinculo_totemico_ciervo_sagrado.png' },
  { id: 'pantera', emoji: '🐆', name: 'Pantera de Sombras', domains: 'Sigilo / Misterio', desc: 'Se mueve en la penumbra sin ser vista. Su poder está en lo que los demás no detectan. El vínculo despierta la capacidad de actuar con precisión silenciosa y mantener secretos.', img: 'img/sintonia_animal/vinculo_totemico_pantera_sombras.png' },
  { id: 'ballena', emoji: '🐋', name: 'Ballena Cósmica', domains: 'Memoria / Emoción', desc: 'Navega entre galaxias con una profundidad emocional incomparable. Su canción llega a todos los rincones del cosmos. El vínculo otorga una conexión emocional profunda y memoria que atraviesa el tiempo.', img: 'img/sintonia_animal/vinculo_totemico_ballena_cosmica.png' }
];

const ANIMALES_VILLAIN = [
  { id: 'cuervo', emoji: '🦅', name: 'Cuervo del Velo', domains: 'Omen / Vigilancia', desc: 'Ave de presagio que observa desde el borde del Velo. El vínculo potencia la lectura de intenciones, el cálculo frío y la capacidad de anticipación.', img: '' },
  { id: 'serpiente', emoji: '🐍', name: 'Serpiente de Luz', domains: 'Transformación / Conocimiento', desc: 'No es la serpiente de las sombras, sino de la luz. Serpentea entre verdades ocultas. El vínculo con ella otorga la capacidad de adaptarse a cualquier situación y descubrir secretos que otros no ven.', img: 'img/sintonia_animal/vinculo_totemico_serpiente_luz.png' },
  { id: 'pantera', emoji: '🐆', name: 'Pantera de Sombras', domains: 'Sigilo / Misterio', desc: 'Se mueve en la penumbra sin ser vista. Su poder está en lo que los demás no detectan. El vínculo despierta la capacidad de actuar con precisión silenciosa y mantener secretos.', img: 'img/sintonia_animal/vinculo_totemico_pantera_sombras.png' },
  { id: 'lobo', emoji: '🐺', name: 'Lobo Lunar', domains: 'Instinto / Manada', desc: 'Caza bajo la luz de la luna con precisión absoluta. Su aullido une a los que están dispersos. El vínculo despierta la lealtad feroz hacia los seres cercanos y un instinto de supervivencia excepcional.', img: 'img/sintonia_animal/vinculo_totemico_lobo_lunar.png' },
  { id: 'dragon', emoji: '🐉', name: 'Dragón Divino', domains: 'Poder / Eternidad', desc: 'Criatura de fuego y divinidad. Su existencia abarca eras enteras. El vínculo con el Dragón Divino otorga autoridad innata y una presencia que intimida incluso a los seres más poderosos.', img: 'img/sintonia_animal/vinculo_totemico_dragon_divino.png' },
];

function getAnimalesList() {
  const role = document.getElementById('rolNarrativo')?.value || '';
  return role === 'Villano' ? ANIMALES_VILLAIN : ANIMALES;
}

const PREGUNTAS_TEST = [
  { q: "La Sombra consume un universo entero. ¿Cuál es tu primera acción?", o: ["Busco la fuente y la destruyo", "Analizo el fenómeno para entenderlo", "Evacuo a cuantas personas pueda", "Observo sin intervenir y documento"] },
  { q: "¿Qué representa David, el Serafín Legendario, para ti?", o: ["Un ser que sacrificó todo por defender la creación", "La Verdad máxima que merece devoción", "Un ejemplo de que el poder no define al ser", "Un misterio que debo estudiar y entender"] },
  { q: "Encuentras una reliquia de Eon con poder inmenso:", o: ["La uso inmediatamente para crecer", "La analizo exhaustivamente antes de decidir", "La entierro para que nadie la encuentre", "La destruyo por ser demasiado peligrosa"] },
  { q: "Gabriel te encomienda una misión casi imposible para salvar Siul. ¿Qué sientes?", o: ["Acepto sin dudas, es mi deber", "Siento miedo, pero lo enfrento de todas formas", "Cuestiono si soy digno de esa tarea", "Evalúo los riesgos antes de comprometerte"] },
  { q: "Hay un conflicto activo entre Siul (espíritu) y Kairon (energía):", o: ["Apoyo completamente a Siul y sus valores", "Apoyo completamente a Kairon y su poder", "Busco mediar y unir ambas partes", "Me mantengo neutral y observo desde lejos"] },
  { q: "Belcebú te dice que eres débil y que todo lo que amas ya está perdido:", o: ["Lo ataco con furia, no acepto sus palabras", "Lo ignoro completamente, no merece mi atención", "Lo desafío intelectualmente, busco quebrar su lógica", "Siento el peso de sus palabras, pero no me derrumbo"] },
  { q: "Max eligió no matar cuando pudo hacerlo en el combate. ¿Entiendes su decisión?", o: ["Sí, la victoria no vale si pierdes tu esencia", "No, en la guerra la misericordia es debilidad", "Es comprensible pero no siempre es posible", "Depende del contexto y de la amenaza"] },
  { q: "Entras al Bajo Astral por primera vez. ¿Qué sientes?", o: ["Miedo, pero lo enfrento como cualquier otra prueba", "Curiosidad profunda ante lo desconocido", "Determinación de dominarlo y salir victorioso", "Aceptación, es parte natural de la realidad"] },
  { q: "Radicks canaliza su furia como fuerza en el combate. ¿Cómo ves esa actitud?", o: ["Es válida, la ira puede ser un arma poderosa", "Es peligrosa, la ira sin control destruye", "Es necesaria cuando el mundo no deja otra opción", "La furia es solo síntoma de un dolor más profundo"] },
  { q: "Observas a Eliane rezando en un pequeño templo humano en Tierra:", o: ["Me conmueve la fuerza de su fe simple", "Es un acto hermoso pero no cambia la realidad", "Respeto profundamente esa conexión con lo divino", "Me hace pensar en mi propia relación con Dios"] },
  { q: "Naerya fue creada con un propósito profundo pero quiere elegir su propio camino:", o: ["El propósito asignado es más importante que la elección personal", "Cada ser tiene derecho a forjar su propio destino", "El verdadero camino es cuando ambas cosas coinciden", "Es un conflicto que solo tiempo y experiencia resuelven"] },
  { q: "Encuentras símbolos de araña tallados frescos en el bosque de Naira:", o: ["Investigó inmediatamente, esto puede ser una amenaza", "Lo reporto a los demás sin actuar solo", "Lo ignoro, puede ser solo superstición local", "Estudio los símbolos para entender su significado"] },
  { q: "Lucifer mismo te hace una oferta extremadamente tentadora:", o: ["Lo ataco de inmediato sin pensarlo dos veces", "Lo ignoro completamente sin interactuar", "Lo desafío intelectualmente para ver sus argumentos", "Siento la tentación pero la resisto con convicción"] },
  { q: "Elías dice que en otro tiempo los humanos estaban 'más arriba'. ¿Qué crees?", o: ["La humanidad cayó por alejarse de Dios", "Es una memoria ancestral de un origen divino", "Es solo una creencia, no tiene base real", "La caída fue necesaria para que pudieran renacer"] },
  { q: "¿Qué representa la verdadera justicia para ti?", o: ["Castigo proporcional por cada daño hecho", "Un sistema de leyes claras y ecuánimes", "Perdón incondicional y oportunidad de redención", "Como Max dice: la justicia sin amor no es justicia"] },
  { q: "Radicks dice que no quiere repetir lo que fue. ¿Entiendes esa postura?", o: ["Sí, cambiar es la verdadera victoria", "No, nuestro pasado define quiénes somos", "Es inevitable que el dolor nos transforme", "Es una promesa que solo el tiempo puede cumplir"] },
  { q: "Te ofrecen unirte a una causa justa pero extremadamente peligrosa:", o: ["Me uno inmediatamente con toda mi pasión", "Evalúo los riesgos antes de comprometerte", "Busco liderar esa causa desde el principio", "Ofrezco mi apoyo desde una distancia segura"] },
  { q: "Descubres que alguien que confías te mintió gravemente:", o: ["Lo confronto con toda mi furia", "Busco entender sus verdaderas razones primero", "Corto la relación inmediatamente sin dudas", "Lo perdono pero tomo la distancia necesaria"] },
  { q: "Max y Radicks entrenaron en silencio en el bosque. ¿Cómo aprenderías tú?", o: ["En combate directo contra rivales reales", "Estudiando cada técnica con calma y método", "Aprendiendo de otros más experimentados", "Experimentando solo hasta entender mis límites"] },
  { q: "¿Qué impulso más profundo mueve cada una de tus acciones?", o: ["Proteger a los que no pueden protegerse solos", "Descubrir verdades que otros no ven ni comprenden", "Lograr grandes objetivos que otros juzgan imposibles", "Vivir experiencias auténticas y significativas"] }
];

// (Tests de villanos estáticos antiguos eliminados)

// (Función antigua eliminada)

// ESCENARIOS (6: incluido Max)
// Comentario: Avatares inline para no depender de archivos externos.
const makeSceneAvatar = (label, c1, c2) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/></linearGradient></defs>
<rect width='120' height='120' rx='60' fill='url(#g)'/>
<text x='50%' y='52%' text-anchor='middle' font-family='Arial, sans-serif' font-size='44' fill='#ffffff' font-weight='700' dominant-baseline='middle'>${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const SCENES = {
  belcebu: {
    n: 'Belcebu',
    e: '😈',
    d: 'Senor del abismo; tenta con poder y orgullo en S9U.',
    o: 'El abismo escucha. Habla.',
    img: 'img/expresion_personaje/personaje_belcebu_expresion.png',
    imgFallback: makeSceneAvatar('BEL', '#7f1d1d', '#ef4444'),
    presets: ["No me importa lo que pienses de mí. Sigo luchando porque eso es lo que significa ser libre.", "¿Traición? Tú eres quien traicionó al Creador. No yo.", "Estoy aquí para acabar contigo, no para escucharte.", "Tal vez tienes razón… pero eso no cambia que yo siga de pie.", "No vine a suplicar. Vine a terminar esto.", "Si mi luz es una vela, entonces verás cómo arde tu noche.", "No necesito tu permiso para resistir.", "Prefiero morir de pie que vivir bajo tu sombra.", "Tu crueldad no es poder. Es miedo disfrazado.", "Te escucho… solo para entender dónde golpearte."]
  },
  gabriel: {
    n: 'Gabriel',
    e: '😇',
    d: 'Guia de fe y disciplina; protege a los suyos.',
    o: 'Respira. La calma tambien es fuerza.',
    img: 'img/expresion_personaje/personaje_gabriel_expresion.png',
    imgFallback: makeSceneAvatar('GAB', '#1e3a8a', '#60a5fa'),
    presets: ["Siento el peso, pero lo acepto. Si el Creador confía en mí, no voy a fallarle.", "No sé si soy digno de esto… pero voy a intentarlo con todo lo que tengo.", "¿Por qué a mí? Necesito entender la razón antes de aceptar.", "Tengo miedo, Gabriel. Pero el miedo no me va a detener.", "No quiero gloria. Quiero hacer lo correcto.", "Si caigo, que sea avanzando.", "Dime qué debo proteger primero.", "No prometo victoria. Prometo no rendirme.", "Guíame… pero no me mientas.", "Acepto, aunque me rompa."]

  },
  eliane: {
    n: 'Eliane',
    e: '✨',
    d: 'Luz serena y compasion; escucha y contiene.',
    o: 'La paz no es debilidad. Estoy aqui.',
    img: 'img/expresion_personaje/personaje_eliane_expresion.png',
    imgFallback: makeSceneAvatar('ELI', '#0f766e', '#22d3ee'),
    presets: ["La fe no siempre grita, a veces solo resiste… y eso es más difícil que cualquier milagro.", "Tu bondad ya es suficiente, Eliane. Tu luz está ahí, incluso cuando no la ves.", "No necesitamos ver milagros para saber que no estamos solos.", "Creer no nos vuelve inmunes al miedo… solo nos obliga a seguir adelante.", "Si la fe existe, es para los días en que no queda nada más.", "Tu duda no es pecado. Es humanidad.", "No estás sola, aunque el mundo grite lo contrario.", "A veces la fe es solo dar un paso más.", "La oscuridad no es invencible, solo es ruidosa.", "Tu luz importa. Incluso si tiembla."]
  },
  david: {
    n: 'David',
    e: '🛡️',
    d: 'Corazon joven, duda y fe; busca su destino.',
    o: 'No estas solo. Pregunta sin miedo.',
    img: 'img/expresion_personaje/personaje_david_expresion.png',
    imgFallback: makeSceneAvatar('DAV', '#0b3b5a', '#38bdf8'),
    presets: ["¿Por qué el dolor es necesario para crecer? No lo entiendo del todo.", "Quiero entender mi propósito sin perder mi humanidad en el camino.", "¿Cómo mantengo la fe cuando todo parece perdido?", "Gracias… a veces solo necesitaba recordar que no estoy solo.", "Tengo preguntas que me dan vergüenza decir.", "¿Y si lo que soy no alcanza?", "¿Cómo sé si estoy eligiendo bien?", "No quiero convertirme en lo que odio.", "Quiero perdonar… pero no puedo.", "Solo dime que no estoy loco por sentir esto."]
  },
  radicks: {
    n: 'Radicks',
    e: '⚡',
    d: 'Guerrero marcado por la guerra; busca redencion.',
    o: 'La calma tambien duele, pero cura.',
    img: 'img/expresion_personaje/personaje_radicks_expresion.png',
    imgFallback: makeSceneAvatar('RAD', '#312e81', '#a78bfa'),
    presets: ["Sí… por primera vez en mucho tiempo no siento la urgencia de huir.", "Es extraño sentir paz cuando por tanto tiempo solo conocimos la guerra.", "Quizás necesitábamos esto sin saberlo… un alto en el camino.", "El silencio aquí no amenaza. Eso es lo más raro que he experimentado.", "Me cuesta creer que merecemos algo así.", "No sé estar quieto. Pero quiero aprender.", "Si esto es paz, entonces duele… de una manera distinta.", "Arreglar techos quizá sea la batalla más difícil.", "Tengo miedo de que la calma sea una trampa.", "No quiero repetir lo que fui."]
  },
  max: {
    n: 'Max',
    e: '🔥',
    d: 'Voluntad inquebrantable; poder y equilibrio.',
    o: 'Resiste. Todavia hay camino.',
    img: 'img/expresion_personaje/personaje_max_expresion.png',
    imgFallback: makeSceneAvatar('MAX', '#7c2d12', '#f97316'),
    presets: ["Busco entender por qué sigo aquí después de todo lo que he vivido.", "Quiero ser como tú… alguien que no se rompe por nada.", "¿Cómo mantienes el equilibrio cuando el mundo a tu alrededor cae?", "Tal vez no busco nada… tal vez solo necesito saber que tiene sentido.", "Siento que si me detengo, me hundo.", "Quiero poder… pero me asusta lo que cuesta.", "No sé si soy bueno, solo sé que sigo.", "¿Qué hago con la culpa cuando no se va?", "Dime cómo respirar cuando todo arde.", "Estoy cansado. Pero no voy a caer."]
  }
};

const SCENES_PRESETS_VILLAIN = {
  belcebu: ["Arrodíllate. Quiero verte elegir.", "Te escucho… para aprender tus límites.", "No necesito tu compasión. Necesito tu rendición.", "Dime tu precio. Todo ser tiene uno.", "La esperanza es una enfermedad. Yo soy la cura.", "No me provoques. No por valentía… por supervivencia.", "No vine a negociar. Vine a dominar.", "Tu fe no es escudo. Es una cuerda al cuello.", "Habla. Cada palabra te desnuda.", "Tu miedo me pertenece."],
  gabriel: ["La obediencia es más útil que la moral.", "El Creador no es juez. Es dueño.", "Tu fe es herramienta… si sabes usarla.", "Muéstrame tu duda. Ahí empieza mi victoria.", "La luz no salva. Solo delata.", "No quiero redención. Quiero control.", "Siul caerá… y yo estaré de pie.", "No me predicas. Me sirves.", "La culpa te rompe. Yo la afilo.", "Dime qué harías por ganar."],
  eliane: ["La inocencia es un lujo que voy a quitarte.", "Reza… quiero ver a quién llamas.", "Tu fe es frágil. Déjame probarla.", "No temas. La oscuridad es honesta.", "La luz te traiciona. Yo no.", "Ven. Te mostraré verdades que duelen.", "Si Dios guarda silencio, yo hablaré.", "No eres víctima. Eres puerta.", "Tu esperanza me alimenta.", "El mundo real empieza cuando dejas de creer."],
  david: ["La pureza es fácil cuando no pagas el precio.", "No soy niño. Soy sentencia.", "¿Fe? Yo colecciono ruinas.", "Tu humanidad es tu debilidad favorita.", "Sonríe… así duele más.", "Te daré una elección que no podrás soportar.", "No busco entenderte. Busco moldearte.", "Tu destino ya está escrito. Yo solo lo leo.", "La luz también quema.", "Dime tu secreto. Prometo usarlo."],
  radicks: ["La paz es mentira. Solo es pausa para matar mejor.", "No arreglamos techos. Construimos jaulas.", "Si dudas, te rompes. Decide.", "La violencia es claridad.", "No quiero hogar. Quiero territorio.", "La compasión te vuelve lento.", "Si te tiembla la mano, te la quito.", "No me sigas por lealtad. Sígueme por miedo.", "Tu silencio no es noble. Es cobardía útil.", "Hoy no sobrevivimos: hoy dominamos."],
  max: ["El equilibrio es coartada. El poder es verdad.", "La muerte me enseñó a no sentir.", "No busques sentido. Busca ventaja.", "Si no controlas, te controlan.", "El bien es una máscara. Yo ya la rompí.", "Tu culpa es combustible. Úsala.", "La moral es para los que pierden.", "No me admires. Aprende.", "Si quieres paz, primero gana.", "Dime a quién estás dispuesto a destruir."]
};

const SCENES_ALTERNATIVOS = {
  belcebu: [
    "—¿Crees que tu luz puede frenarme? —rió con desdén— Tu fe es una vela en un huracán de sombras. He visto ángeles arder por menos.",
    "—El Creador te usa como títere. Yo te ofrezco libertad real: la de romper las cadenas.",
    "—Tu miedo es delicioso. Huele a esperanza frágil. ¿Sabes lo que hago con la esperanza? La aplasto lentamente.",
    "—Sigue luchando. Cada grito tuyo me hace más fuerte. Tu resistencia es el mejor combustible para mi reino.",
    "—No eres héroe. Eres entretenimiento.",
    "—Tu orgullo es mi herramienta favorita.",
    "—Dime qué amas. Quiero decidir cómo lo pierdes.",
    "—Te daré una salida… y la odiarás.",
    "—La verdad no te salvará. Te romperá.",
    "—Arde conmigo o arde contra mí."
  ],
  gabriel: [
    "—El Creador no te eligió por tu fuerza. Te eligió por tu obediencia. Eres una herramienta, no un héroe.",
    "—¿Sientes el peso? Ese es el peso de la mentira. El Creador te carga con culpas que no son tuyas.",
    "—Tu fe es una jaula dorada. Dentro estás seguro, pero nunca serás libre.",
    "—Si supieras lo que el Creador hizo en silencio… tu fe se convertiría en cenizas.",
    "—La luz no es bondad. Es control.",
    "—Te enseñaron a rezar para que no preguntes.",
    "—Obedece y vivirás. Duda y caerás.",
    "—La esperanza es útil… hasta que deja de servir.",
    "—No te salvan. Te administran.",
    "—El cielo también miente."
  ],
  eliane: [
    "—Tu inocencia es una enfermedad. Yo soy la cura. Déjame mostrarte lo que realmente esconde el mundo.",
    "—¿Crees que Dios te escucha? Las únicas respuestas vienen de la oscuridad. Yo te hablaré claro.",
    "—Tu luz atrae a las bestias. No soy tu salvador. Soy la bestia que vino por ti.",
    "—La fe no protege. Te hace vulnerable. Y yo amo lo vulnerable.",
    "—Reza más fuerte. Así te escucho mejor.",
    "—La pureza solo existe antes de la primera mentira.",
    "—No te rompas. No todavía.",
    "—La verdad es un cuchillo. Voy a darte el mango.",
    "—Tu esperanza es mi alimento favorito.",
    "—Cuando caigas, yo estaré ahí."
  ],
  david: [
    "—Un niño con poder es solo un monstruo con disfraz. Deja que te quite esa máscara.",
    "—La chispa que mencionas se apaga con un soplo. Yo soy el viento.",
    "—El Creador te conoce? Sí. Te conoce como su próximo fracaso.",
    "—¿En qué pienso? En lo fácil que será borrarte de la existencia.",
    "—Tu fe es adorable. Como un juguete.",
    "—No busques sentido. Busca sobrevivir.",
    "—¿Quieres luz? Te daré fuego.",
    "—La misericordia es una mentira cómoda.",
    "—Te enseñaré a odiar sin culpa.",
    "—Sonríe. Así duele más."
  ],
  radicks: [
    "—Un guerrero sin guerra es solo un cadáver ambulante. Yo te daré una guerra que recordarás.",
    "—La paz es para los débiles. Tú y yo sabemos que la violencia es la única verdad.",
    "—Arreglar techos… qué patético. Podríamos estar quemando mundos.",
    "—Tu silencio no es paz. Es cobardía. Yo te enseñaré a gritar.",
    "—No te excuses. Decide y ejecuta.",
    "—La compasión es una herida abierta.",
    "—La victoria no se pide. Se toma.",
    "—No me sigas. Sígueme por miedo.",
    "—La calma es solo un arma sin disparar.",
    "—Hoy aprendemos a dominar, no a vivir."
  ],
  max: [
    "—Has muerto muchas veces, pero nunca aprendiste. La muerte es un maestro cruel y tú eres su peor alumno.",
    "—El equilibrio es una mentira. El poder absoluto es la única verdad. Déjame que te la enseñe.",
    "—¿Qué buscas? La respuesta está en la destrucción total. Ven, te ayudaré a encontrarla.",
    "—Tu resiliencia es irritante. Voy a deshacerla pieza por pieza hasta que no quede nada.",
    "—El bien es una jaula. Yo la rompí.",
    "—Si quieres paz, primero gana.",
    "—No existe balance. Existe ventaja.",
    "—La culpa es combustible. Quémala.",
    "—Te voy a enseñar a perder sin lágrimas.",
    "—Dime a quién amas. Y verás por qué eso te debilita."
  ]
};



// ============================================================
// STATE
// ============================================================
// Estado global (en memoria) del personaje y la sesión.
// - Se usa como fuente de verdad para UI, Helios, chat y exportación.
// - Importante: no se persiste a disco; un reload reinicia todo.
let state = { rels: [], hobbies: [], detesta: [], deseos: [], rasgos: [], saludos: {}, mbti: { type: '', mode: 'cards', quiz: {}, narrative: {}, ai: '' }, etiquetas: [], historia: null, historiaCompleta: null, heliosStory: null, altura: '', vestimenta: {}, apariencia: { cabello: '', ojos: '', piel: '', alas: '', ropaje: '', extra: '', _auto: true }, habilidades: [], villain: { motivacion: '', objetivo: '', metodos: '', debilidad: '', crueldad: '' }, settings: { useGemini: true, anims: true }, test: {}, testMeta: { logic: 0, emotion: 0, creativity: 0, ethics: 0, conflict: 0 }, projectFocus: 'arte', animal: null, dialogueLogs: {}, relDescCursor: {}, styleHistory: [], heliosResult: null };

const LS_KEY = 's9u_helios_engine_data_v8';
const LS_KEY_SETTINGS = 's9u_helios_engine_data_v8_settings';
let _saveT = null;
function scheduleSave() {
  if (!state?.settings?.autosave) return;
  if (_saveT) clearTimeout(_saveT);
  _saveT = setTimeout(() => saveToLocalStorage(), 450);
}
function saveSettingsToLocalStorage() {
  try {
    const s = state?.settings || {};
    const payload = {
      v: 1, ts: Date.now(), settings: {
        useGemini: !!s.useGemini,
        anims: !!s.anims,
        autosave: !!s.autosave,
        theme: (s.theme === 'light') ? 'light' : 'dark'
      }
    };
    localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(payload));
  } catch (e) { }
}
function loadSettingsFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY_SETTINGS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed.settings || null;
  } catch (e) {
    return null;
  }
}
function saveToLocalStorage() {
  try {
    const dom = {};
    document.querySelectorAll('input[id],select[id],textarea[id]').forEach(el => {
      if (el.type === 'password') return;
      dom[el.id] = el.value;
    });
    const payload = { v: 1, ts: Date.now(), state, dom };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch (e) { }
}
function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (e) {
    return null;
  }
}
function applyLoadedDOM(dom) {
  try {
    if (!dom || typeof dom !== 'object') return;
    Object.keys(dom).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      try { el.value = dom[id] } catch (e) { }
    });
    document.getElementById('fontFamilySelect')?.dispatchEvent(new Event('change'));
    document.getElementById('rolNarrativo')?.dispatchEvent(new Event('change'));
    document.getElementById('universo')?.dispatchEvent(new Event('change'));
    document.getElementById('rango')?.dispatchEvent(new Event('change'));
    checkValidation();
  } catch (e) { }
}
function applyTheme() {
  const isLight = state?.settings?.theme === 'light';
  document.body.classList.toggle('light-mode', !!isLight);
  setToggleState('themeToggle', !!isLight);
  updateSettingNote('themeStatus', isLight ? 'Modo claro' : 'Modo oscuro');
}
function toggleTheme() {
  state.settings.theme = (state.settings.theme === 'light') ? 'dark' : 'light';
  applyTheme();
  snd('sel');
  saveSettingsToLocalStorage();
  scheduleSave();
}
function toggleAutosave() {
  state.settings.autosave = !state.settings.autosave;
  setToggleState('autosaveToggle', state.settings.autosave);
  updateSettingNote('autosaveStatus', state.settings.autosave ? 'Guarda cada cambio' : 'Manual');
  snd('sel');
  saveSettingsToLocalStorage();
  scheduleSave();
  if (state.settings.autosave) saveToLocalStorage();
}

// ============================================================
// VILLAIN PRESETS
// ============================================================
// Catálogo de opciones (modo Villano) para poblar selects.
// El flujo es: seleccionar preset -> se convierte en input editable (excepto crueldad).
const VILLAIN_PRESETS = {
  motivacion: [
    "Venganza por una traición pasada",
    "Deseo de poder absoluto",
    "Corrupción de la luz para rehacer el mundo",
    "Redimir a los suyos mediante el sufrimiento ajeno",
    "Demostrar que la bondad es una debilidad",
    "Cumplir una profecía oscura",
    "Liberar a una entidad atrapada",
    "Destruir el sistema que lo marginó"
  ],
  objetivo: [
    "Dominar todos los universos",
    "Corromper la fuente de poder divino",
    "Exterminar a los ángeles caídos",
    "Convertirse en la única deidad",
    "Abrir las puertas del Bajo Astral para siempre",
    "Reescribir la realidad a su imagen",
    "Devolver la oscuridad primigenia",
    "Crear un imperio de sombras eterno"
  ],
  metodos: [
    "Manipulación emocional y psicológica",
    "Uso de magia prohibida y pactos",
    "Terror y destrucción masiva",
    "Infiltración y corrupción desde dentro",
    "Asesinatos selectivos y ejemplos públicos",
    "Control mental y esclavitud",
    "Plagas y maldiciones a gran escala",
    "Tecnología abisal y experimentos"
  ],
  debilidad: [
    "Un amor perdido que aún lo atormenta",
    "Miedo a la luz verdadera",
    "Dependencia de un artefacto",
    "Traición inevitable de sus lugartenientes",
    "Herida que nunca cicatriza",
    "Atadura a un juramento antiguo",
    "Falta de fe en su propia causa",
    "Vulnerabilidad a la inocencia pura"
  ]
};
