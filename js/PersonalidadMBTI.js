// ============================================================
// PERSONALIDAD MBTI (S9U)
// - Selección manual o por encuesta rápida
// - Integra esencias narrativas del S9U
// ============================================================
/*
Este módulo administra la sección PERSONALIDAD MBTI – ESENCIAS S9U,
agrupa la selección manual/encuesta y produce lecturas narrativas
que integran el lore del Noveno Universo con la estructura MBTI.
*/
(function () {
  // Definición de los cuatro grupos MBTI utilizados en la UI (Analistas, Diplomáticos, etc.).
  const MBTI_GROUPS = [
    { id: "Analistas", tag: "N/T", desc: "Intuitivos + Pensantes" },
    { id: "Diplomaticos", tag: "N/F", desc: "Intuitivos + Sentimentales" },
    { id: "Centinelas", tag: "S/J", desc: "Observadores + Juzgadores" },
    { id: "Exploradores", tag: "S/P", desc: "Observadores + Flexibles" }
  ];

  // Cada tipo MBTI incluye rasgos S9U, sombras, motivaciones y etiquetas usadas en las tarjetas.
  const MBTI_TYPES = [
    {
      code: "INTJ",
      name: "Estrategico Visionario",
      title: "Estratega logico, planificador del destino.",
      group: "Analistas",
      essence: "Esencia S9U: Cartografo del Destino",
      motor: "Busca patrones ocultos y estructura el futuro.",
      shadow: "Rigidez, distancia emocional, obsesion por el control.",
      decision: "Decide por proyeccion logica y eficiencia.",
      arc: "Aprender a confiar y delegar sin perder la vision.",
      focus: "Estratégico",
      traits: ["Visionario", "Analitico", "Reservado", "Determinante"]
    },
    {
      code: "INTP",
      name: "Mente Logica",
      title: "Innovador curioso, buscador del conocimiento.",
      group: "Analistas",
      essence: "Esencia S9U: Archivista del Velo",
      motor: "Explora teorias y desmonta supuestos.",
      shadow: "Paralisis por analisis, desconexion practica.",
      decision: "Prioriza coherencia interna y verdad conceptual.",
      arc: "Transformar la teoria en impacto real.",
      focus: "Analítico",
      traits: ["Curioso", "Logico", "Innovador", "Independiente"]
    },
    {
      code: "ENTJ",
      name: "Comandante",
      title: "Lider decisivo que impulsa grandes cambios.",
      group: "Analistas",
      essence: "Esencia S9U: Forjador de Imperios",
      motor: "Organiza fuerzas y dirige hacia metas altas.",
      shadow: "Impatiencia, dureza, exceso de dominio.",
      decision: "Toma decisiones rapidas basadas en resultados.",
      arc: "Equilibrar poder con empatia estrategica.",
      focus: "Directivo",
      traits: ["Lider", "Directo", "Ambicioso", "Estratega"]
    },
    {
      code: "ENTP",
      name: "Debatidor Innovador",
      title: "Ingenioso y creativo, rompe paradigmas.",
      group: "Analistas",
      essence: "Esencia S9U: Disruptor de Corrientes",
      motor: "Provoca cambios a traves de ideas nuevas.",
      shadow: "Dispersion, desafio constante, falta de cierre.",
      decision: "Explora opciones y redefine el marco.",
      arc: "Canalizar la creatividad hacia una causa.",
      focus: "Creativo",
      traits: ["Ingenioso", "Audaz", "Curioso", "Versatil"]
    },
    {
      code: "INFJ",
      name: "Defensor Profundo",
      title: "Idealista compasivo con vision unica.",
      group: "Diplomaticos",
      essence: "Esencia S9U: Guia del Umbral",
      motor: "Busca sentido profundo y coherencia moral.",
      shadow: "Autoexigencia, aislamiento, sobrecarga emocional.",
      decision: "Elige por valores y significado.",
      arc: "Cuidar su propia energia sin perder su fe.",
      focus: "Intuitivo",
      traits: ["Idealista", "Empatico", "Intuitivo", "Sereno"]
    },
    {
      code: "INFP",
      name: "Mediador Reflexivo",
      title: "Sensible, bondadoso y fiel a sus valores.",
      group: "Diplomaticos",
      essence: "Esencia S9U: Custodio de la Llama Interior",
      motor: "Protege su mundo interno y su etica.",
      shadow: "Evasion, sensibilidad extrema, indecision.",
      decision: "Prioriza autenticidad y compasion.",
      arc: "Convertir la sensibilidad en valentia activa.",
      focus: "Idealista",
      traits: ["Sensible", "Leal", "Creativo", "Idealista"]
    },
    {
      code: "ENFJ",
      name: "Protagonista Empatico",
      title: "Lider inspirador y comunicativo.",
      group: "Diplomaticos",
      essence: "Esencia S9U: Orador de la Luz",
      motor: "Moviliza a otros hacia un proposito comun.",
      shadow: "Exceso de carga, necesidad de aprobacion.",
      decision: "Busca armonia y crecimiento colectivo.",
      arc: "Equilibrar servicio con identidad propia.",
      focus: "Empático",
      traits: ["Carismatico", "Protector", "Comunicativo", "Inspirador"]
    },
    {
      code: "ENFP",
      name: "Activista Optimista",
      title: "Entusiasta, creativo y expresivo.",
      group: "Diplomaticos",
      essence: "Esencia S9U: Catalizador de Suenos",
      motor: "Abre caminos nuevos con energia emocional.",
      shadow: "Inconstancia, fuga ante la rutina.",
      decision: "Elige por significado y posibilidades.",
      arc: "Sostener el impulso sin perder foco.",
      focus: "Inspirador",
      traits: ["Entusiasta", "Imaginativo", "Empatico", "Libre"]
    },
    {
      code: "ISTJ",
      name: "Responsable y Metodico",
      title: "Fuerte sentido del deber y estabilidad.",
      group: "Centinelas",
      essence: "Esencia S9U: Guardian de Juramentos",
      motor: "Sostiene el orden y la coherencia.",
      shadow: "Rigidez, resistencia al cambio.",
      decision: "Prioriza hechos, normas y continuidad.",
      arc: "Aprender a flexibilizar sin perder estructura.",
      focus: "Responsable",
      traits: ["Constante", "Leal", "Ordenado", "Confiable"]
    },
    {
      code: "ISFJ",
      name: "Protector Leal",
      title: "Cuidadoso y comprometido con su entorno.",
      group: "Centinelas",
      essence: "Esencia S9U: Sanador de Corrientes",
      motor: "Protege a los suyos con devocion.",
      shadow: "Autoanulacion, miedo a decepcionar.",
      decision: "Se guia por deber y cuidado.",
      arc: "Reconocer sus propias necesidades.",
      focus: "Cuidador",
      traits: ["Leal", "Protector", "Paciente", "Prudente"]
    },
    {
      code: "ESTJ",
      name: "Organizacional",
      title: "Eficiente gestor de estructuras.",
      group: "Centinelas",
      essence: "Esencia S9U: Arquitecto del Orden",
      motor: "Construye sistemas y hace que funcionen.",
      shadow: "Dureza, poca tolerancia al caos.",
      decision: "Define reglas claras y ejecuta.",
      arc: "Incorporar flexibilidad y escucha.",
      focus: "Organizado",
      traits: ["Directo", "Pragmatico", "Ordenado", "Responsable"]
    },
    {
      code: "ESFJ",
      name: "Consul Sociable",
      title: "Cooperativo, atento y calido.",
      group: "Centinelas",
      essence: "Esencia S9U: Tejedor de Alianzas",
      motor: "Fomenta armonia y cohesion social.",
      shadow: "Dependencia de validacion externa.",
      decision: "Prioriza el bienestar del grupo.",
      arc: "Defender su criterio sin perder empatia.",
      focus: "Relacional",
      traits: ["Sociable", "Atento", "Organizado", "Solidario"]
    },
    {
      code: "ISTP",
      name: "Virtuoso Adaptable",
      title: "Practico, observador y resolutivo.",
      group: "Exploradores",
      essence: "Esencia S9U: Armero del Instante",
      motor: "Resuelve problemas con precision tecnica.",
      shadow: "Aislamiento, riesgo de frialdad.",
      decision: "Actua con eficiencia y pragmatismo.",
      arc: "Conectar accion con proposito emocional.",
      focus: "Pragmático",
      traits: ["Pragmatico", "Observador", "Autonomo", "Calmo"]
    },
    {
      code: "ISFP",
      name: "Aventurero Creativo",
      title: "Comodo con el cambio, espontaneo.",
      group: "Exploradores",
      essence: "Esencia S9U: Artista del Abismo",
      motor: "Expresa belleza y libertad personal.",
      shadow: "Evasion, indecision, exceso de sensibilidad.",
      decision: "Elige por experiencia y autenticidad.",
      arc: "Convertir sensibilidad en accion constante.",
      focus: "Sensorial",
      traits: ["Creativo", "Flexible", "Sensible", "Libre"]
    },
    {
      code: "ESTP",
      name: "Emprendedor Dinamico",
      title: "Energetico, audaz y centrado en la accion.",
      group: "Exploradores",
      essence: "Esencia S9U: Acelerador de Destinos",
      motor: "Busca desafios y oportunidades inmediatas.",
      shadow: "Impulsividad, riesgo y exceso.",
      decision: "Resuelve rapido con tactica y coraje.",
      arc: "Aprender a medir el impacto a largo plazo.",
      focus: "Táctico",
      traits: ["Audaz", "Energetico", "Tactico", "Seguro"]
    },
    {
      code: "ESFP",
      name: "Animador Sociable",
      title: "Entusiasta y vibrante en la interaccion.",
      group: "Exploradores",
      essence: "Esencia S9U: Portador de la Marea Viva",
      motor: "Eleva el ambiente y conecta con otros.",
      shadow: "Superficialidad, fuga ante el dolor.",
      decision: "Prioriza experiencia y espontaneidad.",
      arc: "Sostener la alegria aun en la adversidad.",
      focus: "Expresivo",
      traits: ["Sociable", "Vibrante", "Calido", "Flexible"]
    }
  ];

  // Variantes visuales para tarjetas MBTI (basadas en la imagen base)
  // Asigna variantes cromáticas y atmosféricas para cada código MBTI en el grid.
  const MBTI_CARD_VARIANTS = {
    INTJ: "night",
    INTP: "cosmic",
    ENTJ: "electric",
    ENTP: "night",
    INFJ: "pine",
    INFP: "cosmic",
    ENFJ: "burgundy",
    ENFP: "electric",
    ISTJ: "charcoal",
    ISFJ: "pine",
    ESTJ: "burgundy",
    ESFJ: "charcoal",
    ISTP: "night",
    ISFP: "cosmic",
    ESTP: "electric",
    ESFP: "burgundy"
  };

  // Generadores de lectura local: producen textos narrativos variados según el tipo y entradas del usuario.
  const LOCAL_READING_BUILDERS = [
    ctx => {
      const narr = ctx.narr;
      const lines = [
        `Tipo ${ctx.t.code} - ${ctx.t.name}. ${ctx.t.title}`,
        `En S9U, su esencia ${ctx.t.essence.toLowerCase()} acompaña un motor que ${ctx.t.motor.toLowerCase()}`,
        narr.motiv ? `Identidad: ${narr.motiv.trim()}.` : "",
        narr.conflict ? `Conflictos: ${narr.conflict.trim()}.` : "",
        narr.dreams ? `Sueños: ${narr.dreams.trim()}.` : "",
        `Sombra: ${ctx.t.shadow.toLowerCase()}. Fortalezas: ${ctx.t.traits.slice(0, 3).join(", ").toLowerCase()}.`
      ].filter(Boolean);
      return lines.join(" ");
    },
    ctx => {
      const narr = ctx.narr;
      return [
        `${ctx.t.name} se mueve entre ${ctx.t.group.toLowerCase()}s y responde con enfoque ${ctx.t.focus?.toLowerCase() || "equilibrado"}.`,
        narr.motiv ? `Su identidad se centra en ${narr.motiv.toLowerCase()}.` : "",
        narr.conflict ? `Ante el conflicto, opta por ${narr.conflict.toLowerCase()}.` : "",
        narr.dreams ? `Su prioridad es ${narr.dreams.toLowerCase()}, como dicta la narrativa de su mundo.` : "",
        `El universo le obliga a equilibrar ${ctx.t.motor.toLowerCase()} con la amenaza de ${ctx.t.shadow.toLowerCase()}.`
      ].filter(Boolean).join(" ");
    },
    ctx => {
      const narr = ctx.narr;
      const trait = ctx.t.traits[0]?.toLowerCase() || "su energía";
      return [
        `La lectura MBTI revela que ${ctx.t.name} utiliza ${trait} para sostener su propósito.`,
        narr.motiv ? `Identidad/valor: ${narr.motiv}.` : "",
        narr.conflict ? `Su reacción típica: ${narr.conflict}.` : "",
        narr.dreams ? `Sueña con ${narr.dreams} mientras pregunta a sí mismo qué significa en S9U.` : "",
        `El resto de su historia alterna entre ${ctx.t.motor.toLowerCase()} y la sombra de ${ctx.t.shadow.toLowerCase()}.`
      ].filter(Boolean).join(" ");
    },
    ctx => {
      const narr = ctx.narr;
      return [
        `${ctx.t.name} recorre el cosmos S9U como ${ctx.t.title.toLowerCase()}, marcado por la esencia ${ctx.t.essence.toLowerCase()}.`,
        narr.motiv ? `Su brújula se orienta hacia ${narr.motiv.toLowerCase()}.` : "",
        narr.conflict ? `Cuando la historia presiona, responde con ${narr.conflict.toLowerCase()} y un pulso firme.` : "",
        narr.dreams ? `Sus sueños están hechos de ${narr.dreams.toLowerCase()} y constancia.` : "",
        `El motor ${ctx.t.motor.toLowerCase()} convive con la sombra ${ctx.t.shadow.toLowerCase()}, obligándolo a equilibrar ${ctx.t.focus?.toLowerCase() || "su enfoque"}.`
      ].filter(Boolean).join(" ");
    },
    ctx => {
      const narr = ctx.narr;
      const strengths = ctx.t.traits.slice(0, 3).map(x => x.toLowerCase()).join(", ");
      return [
        `${ctx.t.code} se mueve entre los ${ctx.t.group.toLowerCase()} con una presencia de ${strengths}.`,
        narr.motiv ? `Identidad: ${narr.motiv.toLowerCase()}, con una corte de motivos simbólicos.` : "",
        narr.conflict ? `La narrativa lo empuja a resolverlo con ${narr.conflict.toLowerCase()} sin perder temple.` : "",
        narr.dreams ? `Sigue soñando con ${narr.dreams.toLowerCase()}, esa prioridad que lo mantiene despierto.` : "",
        `${strengths ? `Fortalezas: ${strengths}.` : ""} El equilibrio emocional se sostiene entre ${ctx.t.motor.toLowerCase()} y ${ctx.t.shadow.toLowerCase()}.`
      ].filter(Boolean).join(" ");
    }
  ];

  function getMbtiVariant(code) {
    return MBTI_CARD_VARIANTS[code] || "night";
  }


  // Preguntas del mini quiz que ayudan a deducir un MBTI cuando el usuario elige ENCUESTA RÁPIDA.
  const MBTI_QUESTIONS = [
    {
      id: "energy",
      label: "A. Como recarga su energia? (E/I)",
      options: [
        { v: "E", label: "En contacto con otros" },
        { v: "I", label: "En soledad" }
      ]
    },
    {
      id: "info",
      label: "B. Como procesa la informacion? (S/N)",
      options: [
        { v: "S", label: "Basado en hechos" },
        { v: "N", label: "Basado en intuiciones" }
      ]
    },
    {
      id: "decision",
      label: "C. Como decide? (T/F)",
      options: [
        { v: "T", label: "Logica primero" },
        { v: "F", label: "Valores / empatia" }
      ]
    },
    {
      id: "order",
      label: "D. Como organiza su vida? (J/P)",
      options: [
        { v: "J", label: "Orden y estructura" },
        { v: "P", label: "Flexible y espontaneo" }
      ]
    }
  ];

  // Acceso sencillo por id para mantener el código más limpio.
  function byId(id) { return document.getElementById(id); }

  // Inicializa o normaliza el estado global utilizado por la sección, manteniendo persistencia.
  function ensureState() {
    if (!window.state) return;
    if (!state.mbti || typeof state.mbti !== "object") {
      state.mbti = { type: "", mode: "cards", quiz: {}, narrative: {}, localReading: "", readingSeed: 0 };
    } else {
      state.mbti.mode = state.mbti.mode || "cards";
      state.mbti.quiz = state.mbti.quiz || {};
      state.mbti.narrative = state.mbti.narrative || {};
      state.mbti.localReading = state.mbti.localReading || "";
      state.mbti.readingSeed = state.mbti.readingSeed || 0;
    }
  }

  // Normaliza cadenas para comparar valores en modo insensible a acentos.
  function normalizeText(txt) {
    try {
      return (txt || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    } catch (e) {
      return (txt || "").toString().toLowerCase();
    }
  }

  // Retorna la definición completa de un código MBTI.
  function getTypeData(code) {
    return MBTI_TYPES.find(t => t.code === code) || null;
  }

  // Genera pistas adicionales cuando el personaje está en modos Villano/Héroe/etc.
  function getRoleHint(type, roleRaw) {
    if (!roleRaw) return "";
    const role = normalizeText(roleRaw);
    const motor = type.motor.toLowerCase();
    const shadow = type.shadow.toLowerCase();
    if (role.includes("villano")) {
      return `En modo villano, su motor (${motor}) se radicaliza y la sombra (${shadow}) gana terreno.`;
    }
    if (role.includes("antihero")) {
      return `Como antiheroe, su motor (${motor}) convive con su sombra (${shadow}) en tension constante.`;
    }
    if (role.includes("heroe")) {
      return `Como heroe, su motor (${motor}) se orienta a proteger y trascender.`;
    }
    if (role.includes("neutral")) {
      return `En neutralidad, equilibra su motor (${motor}) con su sombra (${shadow}).`;
    }
    return "";
  }

  // Construye las tarjetas MBTI agrupadas y las inyecta en el panel de selección manual.
  function renderCards() {
    const panel = byId("mbtiCardsPanel");
    if (!panel) return;
    panel.innerHTML = "";
    MBTI_GROUPS.forEach(g => {
      const groupWrap = document.createElement("div");
      groupWrap.className = "mbti-group";
      groupWrap.innerHTML = `
        <div class="mbti-group-title">
          <span>${g.id.toUpperCase()} - ${g.desc}</span>
          <span class="mbti-group-tag">${g.tag}</span>
        </div>
        <div class="mbti-grid" id="mbtiGrid_${g.id}"></div>
      `;
      panel.appendChild(groupWrap);
      const grid = byId(`mbtiGrid_${g.id}`);
      MBTI_TYPES.filter(t => t.group === g.id).forEach(t => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "mbti-card";
        card.dataset.code = t.code;
        // Variante de color para la tarjeta (la base es mbti_all_esencia.png en CSS)
        card.dataset.variant = getMbtiVariant(t.code);
        const strengths = (t.traits || []).slice(0, 3).join(" / ") || "—";
        const focusLabel = t.focus || "Flexible";
        card.innerHTML = `
          <div class="mbti-card-header">
            <div>
              <div class="mbti-code">${t.code}</div>
              <div class="mbti-name">${t.name}</div>
            </div>
            <div class="mbti-card-group">
              <span class="mbti-card-group-name">${t.group}</span>
              ${g.tag ? `<span class="mbti-card-group-tag">${g.tag}</span>` : ""}
            </div>
          </div>
          <p class="mbti-card-desc">${t.title}</p>
          <div class="mbti-card-body">
            <p class="mbti-card-essence"><strong>Esencia:</strong> ${t.essence}</p>
            <p class="mbti-card-focus"><strong>Enfoque mental:</strong> ${focusLabel}</p>
          </div>
          <div class="mbti-card-footer">
            <span class="mbti-card-strengths"><strong>Fortalezas:</strong> ${strengths}</span>
            <span class="mbti-card-motor">${t.motor}</span>
          </div>
        `;
        card.addEventListener("click", () => selectType(t.code, "manual"));
        grid.appendChild(card);
      });
    });
  }

  // Muestra el cuestionario rápido con botones y progreso.
  function renderQuiz() {
    const panel = byId("mbtiQuizPanel");
    if (!panel) return;
    panel.innerHTML = "";
    const quiz = document.createElement("div");
    quiz.className = "mbti-quiz";
    MBTI_QUESTIONS.forEach(q => {
      const item = document.createElement("div");
      item.className = "mbti-quiz-item";
      const opts = q.options.map(o => {
        return `<button type="button" class="mbti-opt" data-q="${q.id}" data-v="${o.v}"><strong>${o.v}</strong> - ${o.label}</button>`;
      }).join("");
      item.innerHTML = `
        <div class="mbti-q">${q.label}</div>
        <div class="mbti-opts">${opts}</div>
      `;
      quiz.appendChild(item);
    });
    const footer = document.createElement("div");
    footer.className = "mbti-quiz-footer";
    footer.innerHTML = `<span id="mbtiQuizProgress">Progreso: 0 / ${MBTI_QUESTIONS.length}</span>`;
    quiz.appendChild(footer);
    panel.appendChild(quiz);

    panel.querySelectorAll(".mbti-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const qid = btn.getAttribute("data-q");
        const val = btn.getAttribute("data-v");
        selectQuizAnswer(qid, val);
      });
    });
  }

  // Vincula los botones principales con su lógica (tabs, reset, generación, etc.).
  function bindControls() {
    byId("mbtiModeCardsBtn")?.addEventListener("click", () => setMode("cards"));
    byId("mbtiModeQuizBtn")?.addEventListener("click", () => setMode("quiz"));
    byId("mbtiResetBtn")?.addEventListener("click", resetMBTI);
    byId("mbtiAiBtn")?.addEventListener("click", generateMBTIReading);
    byId("mbtiAiClearBtn")?.addEventListener("click", clearMBTIReading);

    const roleSelect = byId("rolNarrativo");
    if (roleSelect) roleSelect.addEventListener("change", updateResult);

    const narrativeMap = [
      { id: "mbtiNarrativeMotiv", key: "motiv" },
      { id: "mbtiNarrativeConflict", key: "conflict" },
      { id: "mbtiNarrativeDreams", key: "dreams" }
    ];
    narrativeMap.forEach(n => {
      const el = byId(n.id);
      if (!el) return;
      el.value = state.mbti.narrative?.[n.key] || "";
      el.addEventListener("input", () => {
        state.mbti.narrative[n.key] = el.value;
        updateAutomaticReading();
        if (typeof scheduleSave === "function") scheduleSave();
      });
    });
  }

  // Cambia entre selección manual y encuesta rápida en la UI.
  function setMode(mode) {
    state.mbti.mode = mode;
    updateMode();
    if (typeof snd === "function") snd("sel");
    if (typeof scheduleSave === "function") scheduleSave();
  }

  // Reinicia la selección MBTI y limpia estados relacionados.
  function resetMBTI() {
    state.mbti = { type: "", mode: state.mbti.mode || "cards", quiz: {}, narrative: {}, localReading: "", readingSeed: 0 };
    const section = byId("mbtiSection");
    if (section) {
      section.classList.add("mbti-resetting");
      setTimeout(() => section.classList.remove("mbti-resetting"), 280);
    }
    updateMode();
    updateCards();
    updateQuiz();
    updateResult();
    updateStatus();
    clearAIReading();
    if (typeof snd === "function") snd("des");
    if (typeof scheduleSave === "function") scheduleSave();
  }

  // Selecciona un tipo MBTI desde la tarjeta o la encuesta y refresca estados asociados.
  function selectType(code, source) {
    const t = getTypeData(code);
    if (!t) return;
    state.mbti.type = code;
    if (source) state.mbti.mode = source === "quiz" ? "quiz" : "cards";
    updateCards();
    updateResult();
    updateStatus();
    updateGenerateButtonState();
    updateAutomaticReading();
    if (typeof snd === "function") snd("sel");
    if (typeof scheduleSave === "function") scheduleSave();
    if (typeof checkValidation === "function") checkValidation();
  }

  // Almacena una respuesta del quiz y recalcula el tipo.
  function selectQuizAnswer(qid, val) {
    state.mbti.quiz[qid] = val;
    updateQuiz();
    const code = computeTypeFromQuiz();
    if (code) selectType(code, "quiz");
    if (typeof scheduleSave === "function") scheduleSave();
  }

  // Concatena letras seleccionadas para deducir el código MBTI.
  function computeTypeFromQuiz() {
    const q = state.mbti.quiz || {};
    const letters = [q.energy, q.info, q.decision, q.order];
    if (letters.some(l => !l)) return null;
    return letters.join("");
  }

  // Ajusta las clases y visibilidad de los paneles según modo activo.
  function updateMode() {
    const cardsPanel = byId("mbtiCardsPanel");
    const quizPanel = byId("mbtiQuizPanel");
    const btnCards = byId("mbtiModeCardsBtn");
    const btnQuiz = byId("mbtiModeQuizBtn");
    const showCards = state.mbti.mode !== "quiz";
    if (cardsPanel) {
      cardsPanel.classList.toggle("active", showCards);
      cardsPanel.setAttribute("aria-hidden", showCards ? "false" : "true");
      cardsPanel.style.display = showCards ? "flex" : "none";
    }
    if (quizPanel) {
      quizPanel.classList.toggle("active", !showCards);
      quizPanel.setAttribute("aria-hidden", !showCards ? "false" : "true");
      quizPanel.style.display = showCards ? "none" : "flex";
    }
    btnCards?.classList.toggle("active", showCards);
    btnQuiz?.classList.toggle("active", !showCards);
  }

  // Marca visualmente la tarjeta activa correspondiente al tipo seleccionado.
  function updateCards() {
    document.querySelectorAll(".mbti-card").forEach(card => {
      const code = card.getAttribute("data-code");
      card.classList.toggle("active", code === state.mbti.type);
    });
  }

  // Refresca el progreso y el estado del quiz rápido.
  function updateQuiz() {
    const q = state.mbti.quiz || {};
    document.querySelectorAll(".mbti-opt").forEach(btn => {
      const qid = btn.getAttribute("data-q");
      const val = btn.getAttribute("data-v");
      btn.classList.toggle("active", q[qid] === val);
    });
    const answered = MBTI_QUESTIONS.filter(x => q[x.id]).length;
    const prog = byId("mbtiQuizProgress");
    if (prog) prog.textContent = `Progreso: ${answered} / ${MBTI_QUESTIONS.length}`;
  }

  // Actualiza el texto de estado con el tipo MBTI actual.
  function updateStatus() {
    const status = byId("mbtiStatus");
    if (!status) return;
    const t = getTypeData(state.mbti.type);
    status.textContent = t ? `Tipo actual: ${t.code} - ${t.name}` : "Tipo actual: —";
  }

  // Rellena el panel de resultado con los detalles del tipo y rol narrativo.
  function updateResult() {
    const res = byId("mbtiResult");
    if (!res) return;
    const t = getTypeData(state.mbti.type);
    if (!t) {
      res.style.display = "none";
      return;
    }
    const group = MBTI_GROUPS.find(g => g.id === t.group);
    const role = byId("rolNarrativo")?.value || "";
    const roleHint = getRoleHint(t, role);
    res.style.display = "block";
    res.innerHTML = `
      <div class="mbti-result-head">
        <div class="mbti-badge">${t.code}</div>
        <div>
          <div class="mbti-title">${t.name}</div>
          <div class="mbti-meta">${t.title}</div>
          <div class="mbti-meta">${t.group}${group ? " (" + group.tag + ")" : ""}</div>
        </div>
      </div>
      <div class="mbti-result-grid">
        <div class="mbti-result-item"><span>ESENCIA S9U</span>${t.essence}</div>
        <div class="mbti-result-item"><span>MOTOR</span>${t.motor}</div>
        <div class="mbti-result-item"><span>SOMBRA</span>${t.shadow}</div>
        <div class="mbti-result-item"><span>DECISION</span>${t.decision}</div>
        <div class="mbti-result-item"><span>ARCO RECOMENDADO</span>${t.arc}</div>
        <div class="mbti-result-item"><span>RASGOS CLAVE</span>${t.traits.join(", ")}</div>
      </div>
      ${roleHint ? `<div style="margin-top:10px;font-size:11px;opacity:.7"><strong>Rol narrativo:</strong> ${roleHint}</div>` : ""}
    `;
  }

  // Genera una lectura automática según el tipo y las respuestas narrativas.
  function refreshLocalReading(forceSeed = false) {
    const t = getTypeData(state.mbti.type);
    if (!t || !narrativeComplete()) {
      state.mbti.localReading = "";
      return;
    }
    if (forceSeed || !state.mbti.readingSeed) {
      state.mbti.readingSeed = Date.now();
    }
    const ctx = { t, narr: state.mbti.narrative || {} };
    const baseValue =
      t.code.charCodeAt(0) +
      (ctx.narr.motiv || "").length +
      (ctx.narr.conflict || "").length +
      (ctx.narr.dreams || "").length +
      (state.mbti.readingSeed || 0);
    const idx = Math.abs(baseValue) % LOCAL_READING_BUILDERS.length;
    state.mbti.localReading = LOCAL_READING_BUILDERS[idx](ctx);
  }

  // Escapa caracteres HTML para evitar inyección en las lecturas.
  function escapeHTML(str = "") {
    return String(str || "").replace(/[&<>"']/g, s => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[s]));
  }

  // Determina el texto que se muestra en el bloque de lectura narrativa.
  function getReadingContent() {
    if (!state.mbti.type) {
      return {
        text: "Selecciona un tipo MBTI para activar la lectura narrativa.",
        placeholder: true
      };
    }
    if (!narrativeComplete()) {
      return {
        text: "Responde las preguntas narrativas para generar una interpretación MBTI adaptada al universo S9U.",
        placeholder: true
      };
    }
    if (state.mbti.localReading) {
      return { text: state.mbti.localReading, placeholder: false };
    }
    return {
      text: "Pulsa Generar lectura MBTI para crear una interpretación narrativamente rica.",
      placeholder: true
    };
  }

  // Renderiza la lectura narrativa dentro del contenedor dedicado.
  function updateReadingOutput() {
    const out = byId("mbtiAiResult");
    if (!out) return;
    const content = getReadingContent();
    const placeholderAttr = content.placeholder ? ' class="mbti-reading-placeholder"' : "";
    out.innerHTML = `
      <div class="mbti-reading">
        <div class="mbti-reading-label">Lectura MBTI narrativa</div>
        <p${placeholderAttr}>${escapeHTML(content.text)}</p>
      </div>
    `;
  }

  // Refresca lectura y estado cuando cambia algún dato narrativo.
  function updateAutomaticReading() {
    refreshLocalReading();
    updateReadingOutput();
    updateGenerateButtonState();
  }

  // Chequea si las tres preguntas narrativas tienen texto.
  function narrativeComplete() {
    const narr = state.mbti.narrative || {};
    return ["motiv", "conflict", "dreams"].every(k => (narr[k] || "").trim().length > 0);
  }

  // Activa/desactiva el botón de generar lectura según requisitos cumplidos.
  function updateGenerateButtonState() {
    const btn = byId("mbtiAiBtn");
    if (!btn) return;
    const ready = !!state.mbti.type && narrativeComplete();
    btn.disabled = !ready;
    btn?.setAttribute("aria-disabled", (!ready).toString());
    btn.classList.toggle("disabled", !ready);
  }

  // Añade comportamiento a los botones de sugerencias rápidas en las preguntas narrativas.
  function bindNarrativeExamples() {
    document.querySelectorAll(".mbti-example").forEach(btn => {
      btn.addEventListener("click", () => {
        const field = btn.getAttribute("data-field");
        const value = btn.textContent.trim();
        const el = byId(field);
        if (!el) return;
        el.value = value;
        el.dispatchEvent(new Event("input"));
        el.focus();
      });
    });
  }

  // Limpia la lectura generada y la prepara para rehacerla.
  function clearMBTIReading() {
    state.mbti.localReading = "";
    if (typeof scheduleSave === "function") scheduleSave();
    updateReadingOutput();
    updateGenerateButtonState();
  }

  // Trigger manual que reconstruye la lectura local con semilla nueva.
  function generateMBTIReading() {
    const ready = !!state.mbti.type && narrativeComplete();
    if (!ready) {
      updateReadingOutput();
      updateGenerateButtonState();
      return;
    }
    state.mbti.readingSeed = Date.now();
    refreshLocalReading(true);
    updateReadingOutput();
    updateGenerateButtonState();
    if (typeof scheduleSave === "function") scheduleSave();
  }

  // Expone los datos actuales MBTI para otras partes de la app.
  function getMBTIData() {
    const t = getTypeData(state.mbti.type);
    if (!t) return null;
    return {
      ...t,
      mode: state.mbti.mode,
      quiz: { ...state.mbti.quiz },
      narrative: { ...state.mbti.narrative },
      reading: state.mbti.localReading
    };
  }

  // Devuelve un resumen en texto plano o HTML del perfil activo.
  function getMBTISummary(format = "text") {
    const t = getTypeData(state.mbti.type);
    if (!t) return "";
    if (format === "short") return `${t.code} - ${t.name}. ${t.title}`;
    const group = MBTI_GROUPS.find(g => g.id === t.group);
    const role = byId("rolNarrativo")?.value || "";
    const roleHint = getRoleHint(t, role);
    const lines = [
      `Tipo: ${t.code} - ${t.name}`,
      `Grupo: ${t.group}${group ? " (" + group.tag + ")" : ""}`,
      `Esencia S9U: ${t.essence}`,
      `Motor: ${t.motor}`,
      `Sombra: ${t.shadow}`,
      `Decision: ${t.decision}`,
      `Arco: ${t.arc}`
    ];
    if (roleHint) lines.push(`Rol: ${roleHint}`);
    const narr = state.mbti.narrative || {};
    const narrLine = [narr.motiv, narr.conflict, narr.dreams].filter(Boolean).join(" | ");
    if (narrLine) lines.push(`Narrativa: ${narrLine}`);
    if (format === "html") return lines.join("<br>");
    return lines.join("\n");
  }

  // Inicializa el módulo MBTI cuando la página contiene la sección correspondiente.
  function initMBTI() {
    if (!byId("mbtiSection")) return;
    ensureState();
    renderCards();
    renderQuiz();
    bindControls();
    bindNarrativeExamples();
    updateMode();
    updateCards();
    updateQuiz();
    updateResult();
    updateStatus();
    updateAutomaticReading();
    const out = byId("mbtiAiResult");
    if (out) updateReadingOutput();
    if (typeof checkValidation === "function") checkValidation();
  }

  // Se exportan funciones para que otros módulos puedan inicializar o leer los datos MBTI.
  window.initMBTI = initMBTI;
  window.getMBTIData = getMBTIData;
  window.getMBTISummary = getMBTISummary;
})();
