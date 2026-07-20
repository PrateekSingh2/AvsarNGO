const fs = require('fs');
const path = require('path');

const dirs = [
  'src/pages/math/lessons',
  'src/pages/english/lessons',
  'src/pages/hindi/lessons'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace text-white/70 in header and paragraphs
  content = content.replace(/text-white\/70/g, 'text-slate-700 dark:text-white/70');
  content = content.replace(/text-white\/50/g, 'text-slate-500 dark:text-white/50');
  
  // Replace text-white text-shadow
  content = content.replace(/text-white text-shadow/g, 'text-slate-900 dark:text-white drop-shadow-md');
  
  // Save
  fs.writeFileSync(filePath, content);
}

dirs.forEach(dir => {
  const fullDir = path.join(process.cwd(), dir);
  if (fs.existsSync(fullDir)) {
    fs.readdirSync(fullDir).forEach(file => {
      if (file.endsWith('.tsx')) {
        processFile(path.join(fullDir, file));
        console.log('Fixed', path.join(dir, file));
      }
    });
  }
});
