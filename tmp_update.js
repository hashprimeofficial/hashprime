const fs = require('fs');
const path = require('path');

const dirs = ['d:/VG/hashprime/app', 'd:/VG/hashprime/components'];

const replacements = [
    { from: /#39FF14/g, to: '#d4af35' },
    { from: /\bfrom-emerald-\d+\/(\d+)\b/g, to: 'from-[#d4af35]/$1' },
    { from: /\bfrom-green-\d+\/(\d+)\b/g, to: 'from-[#d4af35]/$1' },
    { from: /\bto-emerald-\d+\/(\d+)\b/g, to: 'to-[#d4af35]/$1' },
    { from: /\bto-green-\d+\/(\d+)\b/g, to: 'to-[#d4af35]/$1' },
    { from: /\btext-emerald-400\b/g, to: 'text-[#d4af35]' },
    { from: /\btext-green-400\b/g, to: 'text-[#d4af35]' },
    { from: /\bbg-emerald-400\b/g, to: 'bg-[#d4af35]' },
    { from: /\bbg-green-400\b/g, to: 'bg-[#d4af35]' },
    { from: /\bborder-emerald-400\b/g, to: 'border-[#d4af35]' },
    { from: /\bbg-green-500\b/g, to: 'bg-amber-500' },
    { from: /\btext-green-500\b/g, to: 'text-amber-500' },
    { from: /\bhover:bg-green-600\b/g, to: 'hover:bg-amber-600' },
    { from: /\bbg-lime-400\b/g, to: 'bg-amber-400' },
    { from: /\btext-lime-400\b/g, to: 'text-amber-400' },
    { from: /\btext-lime-300\b/g, to: 'text-amber-300' },
    { from: /\bg-lime-500\b/g, to: 'bg-amber-500' },
    { from: /\btext-lime-500\b/g, to: 'text-amber-500' },
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
                console.log('Updated greens in', fullPath);
            }
        }
    }
}

for (const d of dirs) {
    if (fs.existsSync(d)) {
        processDir(d);
    }
}
console.log('Done mapping greens to golden theme!');
