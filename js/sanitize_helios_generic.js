// Script generico de sanitizacion Helios (S9U)
// OBJETIVO: detectar lineas enormes con data:image y limpiarlas.
// USO: node sanitize_helios_generic.js
const fs = require('fs');
const path = require('path');

// El archivo objetivo vive en el mismo directorio que este script.
const filePath = path.join(__dirname, 'helios_data.js');

try {
    console.log("Reading file...");
    const data = fs.readFileSync(filePath, 'utf8');
    console.log("File read. Splitting...");
    const lines = data.split('\n');
    console.log(`Total lines: ${lines.length}`);

    let dirty = false;
    const newLines = lines.map((line, index) => {
        if (line.length > 5000 && line.includes('data:image')) {
            console.log(`Line ${index + 1} is massive (${line.length} chars). Cleaning...`);

            // Intentar extraer ID y nombre para reconstruir una linea segura.
            const idMatch = line.match(/id:\s*'([^']+)'/);
            const nameMatch = line.match(/name:\s*'([^']+)'/);
            const id = idMatch ? idMatch[1] : 'unknown';
            const name = nameMatch ? nameMatch[1] : 'Unknown';

            // Reemplazo robusto:
            // Asume formato `img: 'data:...'` o `img: "data:..."`.
            if (id !== 'unknown') {
                // Intento: reemplazo directo por regex.
                const replaced = line.replace(/img:\s*['"]data:image\/[^'"]+['"]/g, "img: ''");

                if (replaced.length < 1000) {
                    console.log(`  -> Cleaned via regex. New length: ${replaced.length}`);
                    dirty = true;
                    return replaced;
                } else {
                    console.log(`  -> Regex result still large (${replaced.length}). Nuke and reconstruct.`);
                    dirty = true;
                    return `      { id: '${id}', name: '${name}', img: '' }, // Auto-sanitized massive line`;
                }
            } else {
                console.log("  -> Could not identify ID. Replacing with empty comment.");
                dirty = true;
                return "// [Deleted massive line with no ID]";
            }
        }
        return line;
    });

    if (dirty) {
        console.log("Writing sanitized file...");
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        console.log('Successfully sanitized helios_data.js');
    } else {
        console.log('No massive lines found to clean.');
    }

} catch (err) {
    console.error('Error:', err);
}
