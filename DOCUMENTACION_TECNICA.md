# 📘 Documentación Técnica - S9U Helios Engine

## 1. Visión General
**Proyecto:** Creador de Personajes S9U (Helios Engine)
**Versión:** 2.0 (Modular)
**Descripción:** Aplicación web para la generación, gestión y personalización de personajes del universo S9U. Esta versión ha sido refactorizada desde un archivo monolítico (`indexOriginal.html`) a una arquitectura modular moderna basada en componentes HTML, separación de preocupaciones (SoC) y carga dinámica.

---

## 2. Arquitectura del Sistema

El proyecto sigue una arquitectura **SPA (Single Page Application)** simulada mediante la inyección dinámica de fragmentos HTML (partials).

### Estructura de Carpetas 📂

```text
CreadorDePJProS9U/
│
├── indexOriginal.html      # 📄 ARCHIVO LEGADO (Backup del código original monolítico)
├── extract.ps1             # 🛠️ Script de utilidad usado para la modularización
├── DOCUMENTACION_TECNICA.md # 📘 Este archivo
│
└── mi-sitio/               # 🚀 CARPETA RAÍZ DE LA APLICACIÓN
    ├── index.html          # 🏁 Punto de entrada principal (Orquestador)
    │
    ├── css/                # 🎨 Estilos Visuales
    │   └── styles.css      # Hoja de estilos principal (extraída y limpiada)
    │
    ├── js/                 # 🧠 Lógica de Negocio
    │   ├── main.js         # Motor principal de la aplicación (Helios Engine Core)
    │   └── helios_data.js  # Base de Datos Estática (Universos, Razas, Preguntas)
    │
    ├── partials/           # 🧩 Componentes HTML (Fragmentos)
    │   ├── header.html     # Pantalla de carga (Splash) y encabezados
    │   ├── nav.html        # Barra de navegación, botón flotante y panel de configuración
    │   ├── main.html       # Contenedor principal (Formularios, Terminal, Paneles)
    │   └── footer.html     # Pie de página y créditos
    │
    ├── img/                # 🖼️ Recursos de imagen (actualmente vacía o para futuros assets)
    └── components/         # 📦 Componentes UI reutilizables (estructura futura)
```

---

## 3. Detalle de Componentes

### 3.1. Punto de Entrada (`index.html`)
Es el esqueleto vacío de la aplicación. **No contiene contenido visible** inicialmente.
*   **Función Clave:** Contiene contenedores vacíos con IDs específicos (`header-container`, `nav-container`, etc.).
*   **Script de Carga:** Ejecuta un script al inicio que usa `fetch()` para descargar los archivos `.html` de la carpeta `partials/` e inyectarlos en el DOM.
*   **Inicialización:** Una vez que todos los parciales han cargado (via `Promise.all`), llama a `window.initHelios()` para arrancar la lógica.

### 3.2. Lógica Principal (`js/main.js`)
Contiene toda la interactividad del Helios Engine.
*   **Inicialización Controlada:** La función `window.onload` original fue reemplazada por `window.initHelios`. Esto evita errores de "elemento no encontrado" al asegurar que el HTML existe antes de intentar manipularlo.
*   **Módulos:** Maneja la lógica de pestañas, formularios, generación de historias, integración con gemini (si aplica), y cálculos de estadísticas.

### 3.3. Base de Datos (`js/helios_data.js`)
Archivo crítico que actúa como base de datos local JSON.
*   **Contenido:**
    *   `UNIVERSOS`: Lista de universos disponibles.
    *   `RANGOS`: Jerarquías angelicales y de poder.
    *   `PREGUNTAS`: Cuestionario para el test de personalidad/raza.
    *   `APARIENCIA`: Opciones de personalización visual.

### 3.4. Estilos (`css/styles.css`)
Contiene todas las definiciones visuales.
*   **Diseño:** CSS moderno con variables (CSS Variables) para temas.
*   **Animaciones:** Keyframes para la splash screen, efectos de terminal y transiciones de botones.

---

## 4. Flujo de Ejecución 🔄

1.  **Browser Request:** El usuario abre `index.html`.
2.  **DOM Skeleton:** Se carga la estructura básica (etiquetas `<body>`, `<div>` vacíos).
3.  **Fetch Partials (Paralelo):**
    *   Petición -> `partials/nav.html`
    *   Petición -> `partials/header.html`
4.  **Fetch Main (Secuencial):**
    *   Al terminar Header/Nav -> Petición -> `partials/main.html`
    *   *Nota: Se hace secuencial para asegurar que el contenedor principal respete el layout.*
5.  **Injection:** El contenido HTML se inserta en `innerHTML` de los contenedores.
6.  **Bootstrap:** Se dispara el evento `DOMContentLoaded` (o su promesa) -> Ejecuta `window.initHelios()`.
7.  **App Ready:** Se oculta la splash screen y la app es interactiva.

---

## 5. Guía de Desarrollo y Mantenimiento 🛠️

### Requisitos para Ejecución
Debido al uso de `fetch()` para cargar archivos locales, **NO se puede abrir con doble clic** (`file:// protocol limitation`).
Se requiere un servidor HTTP local.

**Cómo correrlo localmente:**
1.  **Opción A (Python):**
    Abrir terminal en la carpeta `CreadorDePJProS9U`.
    ```bash
    python -m http.server 8080 --directory "mi-sitio"
    ```
    Ir a `http://localhost:8080`

2.  **Opción B (VS Code Live Server):**
    Instalar extensión "Live Server", clic derecho en `mi-sitio/index.html` -> "Open with Live Server".

### Cómo editar una sección
*   **¿Cambiar el menú?** -> Edita `partials/nav.html`.
*   **¿Añadir una pregunta al test?** -> Edita `js/helios_data.js`.
*   **¿Cambiar el color de fondo?** -> Edita `css/styles.css`.
*   **¿Modificar la lógica de dados?** -> Edita `js/main.js`.

---

## 6. Estado Actual y Notas
*   ✅ **Modularización Completa.**
*   ✅ **Datos Restaurados:** `helios_data.js` ubicado correctamente.
*   ⚠️ **Dependencia de Servidor:** Recordar siempre usar entorno HTTP.

---
*Documentación generada automáticamente por Antigravity Agent*
