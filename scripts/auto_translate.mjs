import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsDir = path.join(root, 'docs');
const write = process.argv.includes('--write');
const all = process.argv.includes('--all');
const apiKey = process.env.OPENAI_API_KEY || '';
const model = process.env.OPENAI_TRANSLATION_MODEL || 'gpt-5-mini';
const openAiEndpoint = 'https://api.openai.com/v1/responses';

const files = [];
walk(docsDir, file => {
  if (file.endsWith('.md') && path.basename(file) !== 'index.md') files.push(file);
});
files.sort();

let scanned = 0;
let skipped = 0;
let updated = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontMatter(original);
  if (!parsed) continue;

  const meta = parseFrontMatterFields(parsed.frontMatter);
  const enabled = all || meta.auto_translate === 'true';
  if (!enabled) continue;
  scanned += 1;

  if (meta.hasTranslationEn) {
    skipped += 1;
    continue;
  }

  const source = buildSource(meta, parsed.body);
  const sourceSha = sha256(source);

  if (!apiKey) {
    console.log(`Skip ${relative(file)}: OPENAI_API_KEY is not set.`);
    skipped += 1;
    continue;
  }

  let translated = '';
  try {
    translated = await translate(source, file);
  } catch (error) {
    console.warn(`Skip ${relative(file)}: ${error.message}`);
    skipped += 1;
    continue;
  }
  const nextFrontMatter = upsertBlockField(
    upsertScalarField(parsed.frontMatter, 'translation_source_sha', sourceSha),
    'translation_en',
    translated,
  );
  const next = `---\n${nextFrontMatter}\n---${parsed.body}`;

  if (next !== original) {
    updated += 1;
    if (write) fs.writeFileSync(file, next);
    console.log(`${write ? 'Updated' : 'Would update'} ${relative(file)}`);
  }
}

console.log(`${write ? 'Updated' : 'Would update'} ${updated}; skipped ${skipped}; scanned ${scanned}.`);

function walk(dir, onFile) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, onFile);
    else if (entry.isFile()) onFile(fullPath);
  }
}

function parseFrontMatter(content) {
  if (!content.startsWith('---\n')) return null;
  const end = content.indexOf('\n---', 4);
  if (end < 0) return null;
  return {
    frontMatter: content.slice(4, end),
    body: content.slice(end + 4),
  };
}

function parseFrontMatterFields(frontMatter) {
  const data = {};
  const lines = frontMatter.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const scalar = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!scalar) continue;

    const key = scalar[1];
    const value = scalar[2].trim();
    if (value === '|') {
      const block = [];
      i += 1;
      while (i < lines.length && /^(?:  |\s*$)/.test(lines[i])) {
        block.push(lines[i].startsWith('  ') ? lines[i].slice(2) : '');
        i += 1;
      }
      i -= 1;
      data[key] = block.join('\n').trim();
      if (key === 'translation_en') data.hasTranslationEn = true;
    } else {
      data[key] = unquote(value);
      if (key === 'translation_en') data.hasTranslationEn = true;
    }
  }
  return data;
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  return value;
}

function buildSource(meta, body) {
  const title = meta.title ? `# ${meta.title}\n\n` : '';
  const summary = meta.summary ? `Summary: ${meta.summary}\n\n` : '';
  return `${title}${summary}${body.trim()}\n`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

async function translate(source, file) {
  const response = await fetch(openAiEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: [
                'Translate this Korean technical blog post into natural English Markdown.',
                'Preserve Markdown structure, code fences, tables, links, image paths, frontmatter-free body content, and technical terms.',
                'Do not add commentary, prefaces, or extra sections.',
                'Keep the authorial tone direct and engineering-focused.',
              ].join('\n'),
            },
          ],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: source }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI translation failed for ${relative(file)}: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const output = extractOutputText(data).trim();
  if (!output) throw new Error(`OpenAI translation returned empty output for ${relative(file)}.`);
  return output;
}

function extractOutputText(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') chunks.push(content.text);
    }
  }
  return chunks.join('\n');
}

function upsertScalarField(frontMatter, key, value) {
  const lines = removeField(frontMatter.split('\n'), key);
  const insertAt = findInsertIndex(lines);
  lines.splice(insertAt, 0, `${key}: ${JSON.stringify(value)}`);
  return trimBlankEdges(lines).join('\n');
}

function upsertBlockField(frontMatter, key, value) {
  const lines = removeField(frontMatter.split('\n'), key);
  lines.push(`${key}: |`);
  for (const line of value.split('\n')) lines.push(`  ${line}`);
  return trimBlankEdges(lines).join('\n');
}

function removeField(lines, key) {
  const next = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match || match[1] !== key) {
      next.push(line);
      continue;
    }

    if (match[2].trim() === '|') {
      i += 1;
      while (i < lines.length && /^(?:  |\s*$)/.test(lines[i])) i += 1;
      i -= 1;
    }
  }
  return next;
}

function findInsertIndex(lines) {
  const autoTranslateIndex = lines.findIndex(line => /^auto_translate:\s*/.test(line));
  if (autoTranslateIndex >= 0) return autoTranslateIndex + 1;
  const tagsIndex = lines.findIndex(line => /^tags:\s*/.test(line));
  if (tagsIndex >= 0) return tagsIndex + 1;
  return Math.min(lines.length, 1);
}

function trimBlankEdges(lines) {
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  return lines;
}

function relative(file) {
  return path.relative(root, file);
}
