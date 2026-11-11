import { readFile, writeFile } from 'node:fs/promises';
import { build, createServer } from 'vite';

await build();

// Use Vite's JSX/module loader to render the same homepage as the browser.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  const indexPath = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(indexPath, 'utf8');
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) throw new Error('Cannot find the homepage prerender placeholder.');
  await writeFile(indexPath, template.replace(placeholder, () => `<div id="root">${render()}</div>`));
  console.log('Prerendered homepage content into dist/index.html.');
} finally {
  await server.close();
}
