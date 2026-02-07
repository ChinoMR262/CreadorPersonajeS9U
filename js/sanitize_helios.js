// Script de sanitizacion Helios (S9U)
// OBJETIVO: eliminar data URIs masivos en helios_data.js para reducir peso y evitar bloqueos.
// USO: node sanitize_helios.js
const fs = require('fs');
const path = require('path');

// El archivo objetivo vive en el mismo directorio que este script.
const filePath = path.join(__dirname, 'helios_data.js');

try {
    // Leer el archivo como texto completo. Node puede manejarlo en memoria.
    const data = fs.readFileSync(filePath, 'utf8');

    // Separar por lineas para procesar linea por linea.
    const lines = data.split(/\r?\n/);

    const newLines = lines.map(line => {
        // Target the Tortuga line
        if (line.trim().startsWith("{ id: 'tortuga'") && line.includes("var metadata =")) {
            // The specific line seen in the view_file had a massive string. 
            // We'll just match roughly to be safe, or exact if possible.
            // Actually, the view_file showed: 379:       { id: 'tortuga', emoji: '🐢', ... img: 'data:image...
            // It did NOT show "var metadata =".
            // Let's rely on the id content and the presence of the data URI.
        }

        if (line.includes("{ id: 'tortuga'") && line.includes("data:image")) {
            console.log("Cleaning Tortuga line...");
            return "      { id: 'tortuga', emoji: '🐢', name: 'Tortuga Mágica', domains: 'Sabiduría / Tiempo', desc: 'Ente de paciencia eterna. Su concha resguarda los secretos del tiempo mismo. Quienes la han elegido como vínculo desarrollan una calma profunda y una capacidad de resistencia que trasciende las edades.', img: '' },";
        }

        // Target the Dragon line
        if (line.includes("{ id: 'dragon'") && line.includes("data:image")) {
            console.log("Cleaning Dragon line...");
            return "      { id: 'dragon', emoji: '🐉', name: 'Dragón Divino', domains: 'Poder / Eternidad', desc: 'Criatura de fuego y divinidad. Su existencia abarca eras enteras. El vínculo con el Dragón Divino otorga autoridad innata y una presencia que intimida incluso a los seres más poderosos.', img: '' },";
        }

        return line;
    });

    const newData = newLines.join('\n');
    fs.writeFileSync(filePath, newData, 'utf8');
    console.log('Successfully sanitized helios_data.js');

} catch (err) {
    console.error('Error processing file:', err);
}
