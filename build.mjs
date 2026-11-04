// Compila la experiencia en un único index.html autocontenido.
// Uso: node build.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const template = read('src/template.html');
const css = read('src/style.css');
const data = read('src/data.js');
const map = read('src/mapdata.js');
const app = [
  'src/core.js',
  'src/ui.js',
  'src/scene1.js',
  'src/scene2.js',
  'src/scene3.js',
  'src/scene4.js',
  'src/scene5.js',
  'src/scene6.js',
  'src/scene7.js',
  'src/scene8.js',
  'src/scene9.js',
  'src/scene10.js',
  'src/main.js'
].map(read).join('\n\n');

let out = template;
out = out.replace('/*__CSS__*/', () => css);
out = out.replace('/*__DATA__*/', () => data);
out = out.replace('/*__MAP__*/', () => map);
out = out.replace('/*__APP__*/', () => app);

fs.writeFileSync(path.join(root, 'index.html'), out, 'utf8');
const kb = (Buffer.byteLength(out, 'utf8') / 1024).toFixed(1);
console.log(`index.html generado · ${kb} KB · ${out.split('\n').length} líneas`);
