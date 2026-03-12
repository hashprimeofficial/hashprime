const fs = require('fs');
const path = require('path');

const dirs = ['d:/VG/hashprime/app', 'd:/VG/hashprime/components'];

function processDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Text gradients
            const textGradientRegex = /text-transparent\s+bg-clip-text\s+bg-gradient-to-[a-z]+\s+from-[^\s]+\s+(via-[^\s]+\s+)?to-[^\s]+/g;
            if (textGradientRegex.test(content)) {
                content = content.replace(textGradientRegex, 'text-[#d4af35]');
                modified = true;
            }

            // bg gradients
            const bgGradientRegex = /bg-gradient-to-[a-z]+\s+from-[^\s]+(\s+via-[^\s]+)?\s+to-[^\s]+/g;
            if (bgGradientRegex.test(content)) {
                content = content.replace(bgGradientRegex, 'bg-[#d4af35]/10');
                modified = true;
            }

            // Remove bg-gradient-to-* alone
            const aloneBgGrad = /\bbg-gradient-to-[a-z]+\b/g;
            if (aloneBgGrad.test(content)) {
                content = content.replace(aloneBgGrad, '');
                modified = true;
            }

            // also replacing left-over colors like blue, cyan, purple, pink, orange, amber
            const obsoleteColors = /\b(blue|cyan|purple|pink|orange|amber)-\d+\/\d+\b/g;
            if (obsoleteColors.test(content)) {
                content = content.replace(obsoleteColors, '#d4af35/10');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed gradients in', fullPath);
            }
        }
    }
}

for (const d of dirs) {
    if (fs.existsSync(d)) {
        processDir(d);
    }
}
console.log('Done mapping gradients!');
