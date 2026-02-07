// Script de limpieza por indice (S9U)
// OBJETIVO: ubicar el primer data URI y reemplazarlo de forma precisa.
// USO: node fix_data_script_v2.js
const fs = require('fs');
const path = require('path');

// El archivo objetivo vive en el mismo directorio que este script.
const filePath = path.join(__dirname, 'helios_data.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    console.log('Original size:', content.length);

    // Clave de busqueda para la primera ocurrencia.
    const key = "img: 'data:image/png;base64,";
    const startIdx = content.indexOf(key);

    if (startIdx !== -1) {
        // Buscar la comilla de cierre desde el final de la key.
        const contentAfterKey = content.substring(startIdx + key.length);
        const endQuoteIdx = contentAfterKey.indexOf("'");

        if (endQuoteIdx !== -1) {
            const realEndIdx = startIdx + key.length + endQuoteIdx + 1; // +1 for the closing quote

            // Construir nuevo contenido: antes + "img: ''" + despues de la comilla.
            // La cadena original es: img: 'data:...'
            // Resultado esperado: img: ''

            const before = content.substring(0, startIdx);
            const after = content.substring(realEndIdx);

            const newContent = before + "img: ''" + after;

            console.log('New size:', newContent.length);
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Successfully sanitized helios_data.js using index lookup');
        } else {
            console.log('Closing quote not found');
        }
    } else {
        console.log('Target string not found');
    }

} catch (err) {
    console.error('Error processing file:', err);
}
