const fs = require('fs');
const path = require('path');

const dirs = ['d:/VG/hashprime/app', 'd:/VG/hashprime/components'];

const replacements = [
    { from: /\bbg-white\b/g, to: 'bg-[#121212]' },
    { from: /\bborder-slate-100\b/g, to: 'border-white/5' },
    { from: /\bborder-slate-200\b/g, to: 'border-white/10' },
    { from: /\bborder-slate-300\b/g, to: 'border-white/20' },
    { from: /\btext-slate-800\b/g, to: 'text-slate-100' },
    { from: /\btext-slate-600\b/g, to: 'text-slate-200' },
    { from: /\btext-slate-400\b/g, to: 'text-slate-300' },
    { from: /text-\[\#0B1120\]/g, to: 'text-white' },
    { from: /\btext-navy\b/g, to: 'text-white' },
    { from: /\bbg-slate-50\b/g, to: 'bg-white/5' },
    { from: /bg-\[\#0B1120\]/g, to: 'bg-[#d4af35]' },
    { from: /\bbg-navy\b/g, to: 'bg-[#d4af35]' },
    { from: /\bborder-navy\b/g, to: 'border-[#d4af35]' },
    { from: /hover:bg-\[\#162032\]/g, to: 'hover:bg-[#f5e0a3]' },
    { from: /hover:text-\[\#0B1120\]/g, to: 'hover:text-[#d4af35]' },
    { from: /\btext-black\b/g, to: 'text-white' },
    { from: /\bbg-black\b/g, to: 'bg-white/10' },
    { from: /\bhover:bg-black\b/g, to: 'hover:bg-[#f5e0a3]' },
    { from: /\bbg-transparent\b/g, to: 'bg-transparent text-white' },
];

function processDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const { from, to } of replacements) {
                if (from.test(content)) {
                    content = content.replace(from, to);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

for (const d of dirs) {
    if (fs.existsSync(d)) {
        processDir(d);
    }
}
console.log('Done mapping components to dark theme!');
