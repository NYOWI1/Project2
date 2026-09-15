import { mkdir, copyFile, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await copyFile('public/index.html', 'dist/index.html');
await writeFile('dist/build-info.json', JSON.stringify({ builtAt: new Date().toISOString() }, null, 2));
console.log('Built static demo assets in dist/');
