// Script rapido de limpieza de data URIs (S9U)
// OBJETIVO: reemplazar img:'data:image/...' por img:'' en helios_data.js.
// USO: node fix_data_script.js
const fs = require('fs');
const path = require('path');

// El archivo objetivo vive en el mismo directorio que este script.
const filePath = path.join(__dirname, 'helios_data.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    console.log('Original size:', content.length);

    // Reemplazar la cadena base64 masiva por un string vacio.
    // Patron: img: 'data:image/...' hasta la comilla de cierre.
    const newContent = content.replace(/img:\s*'data:image\/[^']+'/g, "img: ''");

    console.log('New size:', newContent.length);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully sanitized helios_data.js');
} catch (err) {
    console.error('Error processing file:', err);
}
