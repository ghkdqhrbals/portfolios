import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(process.argv[2] || '_site');
const baseUrls = Array.from(
  new Set(
    (process.argv.slice(3).length > 0 ? process.argv.slice(3) : ['']).map(normalizeBaseUrl)
  )
).filter(Boolean);
baseUrls.push('');
const htmlFiles = [];
const failures = [];

walk(siteDir, file => {
  if (file.endsWith('.html')) htmlFiles.push(file);
});

const existingFiles = new Set();
walk(siteDir, file => existingFiles.add(path.resolve(file)));

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const attrs = [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/gi)];
  const ids = collectIds(html);

  for (const match of attrs) {
    const raw = match[1].trim();
    const parsed = parseInternalUrl(raw);
    if (!parsed) continue;

    const targetPath = resolveTarget(file, parsed.pathname);
    if (!targetPath) {
      failures.push(`${relative(file)} -> ${raw} (missing file)`);
      continue;
    }

    if (parsed.hash) {
      const targetHtml = fs.readFileSync(targetPath, 'utf8');
      const targetIds = targetPath === path.resolve(file) ? ids : collectIds(targetHtml);
      const anchor = decodeURIComponent(parsed.hash.slice(1));
      if (anchor && !targetIds.has(anchor)) {
        failures.push(`${relative(file)} -> ${raw} (missing anchor)`);
      }
    }
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} broken internal link(s):`);
  failures.slice(0, 100).forEach(failure => console.error(`- ${failure}`));
  if (failures.length > 100) {
    console.error(`...and ${failures.length - 100} more`);
  }
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML file(s); internal links are valid.`);

function walk(dir, onFile) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, onFile);
    else if (entry.isFile()) onFile(fullPath);
  }
}

function parseInternalUrl(value) {
  if (!value || value.startsWith('#')) return null;
  const normalized = value.replace(/^\(+/, '');
  if (/^(?:https?:)?\/\//i.test(normalized)) return null;
  if (/^(?:mailto|tel|javascript|data):/i.test(value)) return null;

  const withoutQuery = value.split('?')[0];
  const [pathname, hash = ''] = withoutQuery.split('#');
  if (!pathname && !hash) return null;

  return { pathname, hash: hash ? `#${hash}` : '' };
}

function resolveTarget(fromFile, pathname) {
  let cleanPath = decodeURIComponent(pathname || '');
  if (cleanPath === '/portfolios') {
    cleanPath = '/';
  } else if (cleanPath.startsWith('/portfolios/')) {
    cleanPath = cleanPath.slice('/portfolios'.length);
  }
  const normalized = baseUrls.filter(Boolean);

  for (const baseUrl of normalized) {
    if (baseUrl && cleanPath.startsWith(baseUrl + '/')) {
      cleanPath = cleanPath.slice(baseUrl.length);
      break;
    }
    if (baseUrl && cleanPath === baseUrl) {
      cleanPath = '/';
      break;
    }
  }

  const sanitizedPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
  const absolute = cleanPath.startsWith('/')
    ? path.join(siteDir, sanitizedPath)
    : path.resolve(path.dirname(fromFile), sanitizedPath || '');

  const candidates = [
    absolute,
    path.join(absolute, 'index.html'),
    absolute.endsWith('.html') ? absolute : `${absolute}.html`,
  ].map(candidate => path.resolve(candidate));

  return candidates.find(candidate => existingFiles.has(candidate)) || null;
}

function collectIds(html) {
  const ids = new Set();
  for (const match of html.matchAll(/\sid=["']([^"']+)["']/gi)) {
    ids.add(decodeHtml(match[1]));
  }
  for (const match of html.matchAll(/\sname=["']([^"']+)["']/gi)) {
    ids.add(decodeHtml(match[1]));
  }
  return ids;
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeBaseUrl(value) {
  if (!value || value === '/') return '';
  return value.startsWith('/') ? value.replace(/\/$/, '') : `/${value.replace(/\/$/, '')}`;
}

function relative(file) {
  return path.relative(process.cwd(), file);
}
