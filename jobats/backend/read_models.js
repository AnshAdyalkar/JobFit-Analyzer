const fs = require('fs');

try {
    const content = fs.readFileSync('models.txt', 'utf16le'); // PowerShell output is UTF-16LE
    const lines = content.split('\n');
    console.log("Total lines:", lines.length);
    const geminiModels = lines.filter(l => l.toLowerCase().includes('gemini'));
    console.log("Gemini Models Found:", geminiModels.length);
    geminiModels.forEach(m => console.log(m.trim()));
    fs.writeFileSync('gemini_names.txt', geminiModels.join('\n'));
} catch (e) {
    console.error("Error reading file:", e.message);
}
