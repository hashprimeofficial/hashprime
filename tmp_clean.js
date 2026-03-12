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

            // Fix invalid #d4af35/10 replacements without brackets
            const invalidColorsRegex = /(from|to|via|bg)-#d4af35(\/\d+)/g;
            if (invalidColorsRegex.test(content)) {
                content = content.replace(invalidColorsRegex, '$1-[#d4af35]$2');
                modified = true;
            }

            // Also check for bg-gradient-to-* as user requested no gradients.
            // But we already removed them. Wait, did we? The user said "Dont use gradients, Just dark and gold colors though the overall webistes."
            // If we remove bg-gradient-to-* we might end up with just "from-[...] to-[...]" which does nothing without a gradient utility, except tailwind might just ignore it.
            // For a solid bg, it's better to just use `bg-[#d4af35]/10` and remove `bg-gradient-to...` completely.

            if (content.includes('bg-gradient-to-')) {
                content = content.replace(/bg-gradient-to-[a-z]+/g, '');
                modified = true;
            }
            if (content.includes('text-transparent')) {
                content = content.replace(/text-transparent/g, '');
                modified = true;
            }
            if (content.includes('bg-clip-text')) {
                content = content.replace(/bg-clip-text/g, '');
                modified = true;
            }
            if (content.match(/\b(from|via|to)-\[[#a-zA-Z0-9]+\](\/\d+)?/g)) {
                // content = content.replace(/\b(from|via|to)-\[[#a-zA-Z0-9]+\](\/\d+)?\s?/g, '');
                // modified = true;
            }

            // Wait, for background gradients if we remove them, the element might not have a background visible if it relied on from-/to-.
            // e.g. `<div className="absolute ... from-[#d4af35]/10 to-transparent">`
            // Instead of breaking layout, let's just make it a solid bg:
            content = content.replace(/\bfrom-\[[^\]]+\](\/\d+)?\s+to-transparent/g, 'bg-[#d4af35]/5');
            content = content.replace(/\bfrom-\[[^\]]+\](\/\d+)?\s+(via-\[[^\]]+\](\/\d+)?\s+)?to-\[[^\]]+\](\/\d+)?/g, 'bg-[#d4af35]/5');

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed invalid classes in', fullPath);
            }
        }
    }
}

for (const d of dirs) {
    if (fs.existsSync(d)) {
        processDir(d);
    }
}
console.log('Done!');
