import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsDir = path.join(root, 'docs');
const write = process.argv.includes('--write');
const maxSummaryLength = 155;

const keywordTags = [
  ['spring batch', 'spring-batch'],
  ['spring cloud', 'spring-cloud'],
  ['spring boot', 'spring-boot'],
  ['virtualthread', 'virtual-thread'],
  ['virtual thread', 'virtual-thread'],
  ['completablefuture', 'completablefuture'],
  ['threadlocal', 'threadlocal'],
  ['jvm', 'jvm'],
  ['jit', 'jit'],
  ['graalvm', 'graalvm'],
  ['garbage collection', 'gc'],
  ['gc', 'gc'],
  ['kotlin', 'kotlin'],
  ['java', 'java'],
  ['golang', 'go'],
  ['goroutine', 'go'],
  ['go', 'go'],
  ['mysql', 'mysql'],
  ['postgresql', 'postgresql'],
  ['postgres', 'postgresql'],
  ['mongodb', 'mongodb'],
  ['redis stream', 'redis-stream'],
  ['redis', 'redis'],
  ['kafka', 'kafka'],
  ['debezium', 'debezium'],
  ['elasticsearch', 'elasticsearch'],
  ['elastic search', 'elasticsearch'],
  ['database', 'database'],
  ['transaction', 'transaction'],
  ['isolation', 'isolation'],
  ['index', 'index'],
  ['rdb', 'database'],
  ['rdbms', 'database'],
  ['docker', 'docker'],
  ['kubernetes', 'kubernetes'],
  ['k8s', 'kubernetes'],
  ['msa', 'msa'],
  ['microservice', 'msa'],
  ['saga', 'saga'],
  ['ddd', 'ddd'],
  ['rest api', 'rest-api'],
  ['grpc', 'grpc'],
  ['protobuf', 'protobuf'],
  ['http', 'http'],
  ['tls', 'tls'],
  ['ssl', 'tls'],
  ['jwt', 'jwt'],
  ['oauth', 'oauth'],
  ['pkce', 'pkce'],
  ['csrf', 'csrf'],
  ['aes', 'cryptography'],
  ['rsa', 'cryptography'],
  ['ecc', 'cryptography'],
  ['gcm', 'cryptography'],
  ['bcrypt', 'cryptography'],
  ['encryption', 'cryptography'],
  ['blockchain', 'blockchain'],
  ['ethereum', 'ethereum'],
  ['eclipse attack', 'eclipse-attack'],
  ['algorithm', 'algorithm'],
  ['bfs', 'algorithm'],
  ['dfs', 'algorithm'],
  ['queue', 'algorithm'],
  ['performance', 'performance'],
  ['benchmark', 'benchmark'],
  ['n+1', 'performance'],
  ['nginx', 'nginx'],
  ['ci/cd', 'ci-cd'],
  ['github package', 'github-packages'],
  ['aws', 'aws'],
  ['bedrock', 'bedrock'],
  ['ollama', 'llm'],
  ['llama', 'llm'],
  ['gzip', 'gzip'],
  ['poi', 'apache-poi'],
  ['excel', 'excel'],
];

const directoryTags = new Map([
  ['Blockchain', ['blockchain', 'ethereum']],
  ['CS', ['computer-science']],
  ['algorithm', ['algorithm']],
  ['network', ['network']],
  ['os', ['operating-system']],
  ['Java', ['java', 'backend']],
  ['Java-Kotlin', ['java', 'kotlin', 'backend']],
  ['NOSQL', ['nosql', 'database']],
  ['alg', ['algorithm', 'problem-solving']],
  ['automation', ['automation']],
  ['benchmark', ['benchmark', 'performance']],
  ['cypto', ['cryptography']],
  ['db', ['database']],
  ['docker', ['docker', 'infra']],
  ['elasticSearch', ['elasticsearch']],
  ['etc', ['etc']],
  ['foxee', ['xai', 'security']],
  ['go', ['go', 'backend']],
  ['msa', ['msa', 'architecture']],
  ['my', ['retrospective']],
  ['pf', ['performance']],
  ['project', ['project', 'chat-server']],
  ['project2', ['project', 'go']],
  ['protocol', ['api', 'protocol']],
  ['toss', ['toss', 'backend']],
  ['toy', ['toy-project']],
]);

const files = [];
walk(docsDir, file => {
  if (file.endsWith('.md') && path.basename(file) !== 'index.md') files.push(file);
});
files.sort();

let changed = 0;
for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const parsed = parseFrontMatter(original);
  if (!parsed) continue;

  const metadata = parseMetadata(parsed.frontMatter);
  const title = metadata.title || titleFromPath(file);
  const bodyText = textFromMarkdown(parsed.body);
  const summary = buildSummary(title, bodyText);
  const tags = buildTags(file, title, bodyText, metadata.parent);
  const nextFrontMatter = upsertMetadata(parsed.frontMatter, summary, tags);
  const next = `---\n${nextFrontMatter}\n---${parsed.body}`;

  if (next !== original) {
    changed += 1;
    if (write) fs.writeFileSync(file, next);
  }
}

console.log(`${write ? 'Updated' : 'Would update'} ${changed} of ${files.length} post file(s).`);

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

function parseMetadata(frontMatter) {
  const data = {};
  for (const line of frontMatter.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = unquote(match[2].trim());
  }
  return data;
}

function upsertMetadata(frontMatter, summary, tags) {
  const lines = frontMatter
    .split('\n')
    .filter(line => !/^summary:\s*/.test(line) && !/^description:\s*/.test(line) && !/^tags:\s*/.test(line));
  const summaryLine = `summary: ${JSON.stringify(summary)}`;
  const tagsLine = `tags: [${tags.map(tag => JSON.stringify(tag)).join(', ')}]`;
  const insertAt = insertionIndex(lines);
  lines.splice(insertAt, 0, summaryLine, tagsLine);
  return trimBlankEdges(lines).join('\n');
}

function insertionIndex(lines) {
  const dateIndex = lines.findIndex(line => /^date:\s*/.test(line));
  if (dateIndex >= 0) return dateIndex + 1;
  const titleIndex = lines.findIndex(line => /^title:\s*/.test(line));
  if (titleIndex >= 0) return titleIndex + 1;
  return Math.min(1, lines.length);
}

function trimBlankEdges(lines) {
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  return lines;
}

function buildSummary(title, bodyText) {
  const cleanTitle = cleanInline(title);
  const normalized = bodyText
    .replace(/\s+/g, ' ')
    .replace(/\bReference\b/gi, '')
    .trim();
  const titlePrefixPattern = new RegExp(`^${escapeRegExp(cleanTitle)}\\s*`, 'i');
  let summary = normalized.replace(titlePrefixPattern, '').trim();

  if (!summary || summary.length < 35) {
    summary = `${cleanTitle}에 대해 정리한 글입니다.`;
  } else if (summary.length > maxSummaryLength) {
    summary = truncateAtBoundary(summary, maxSummaryLength);
  }

  if (!/[.!?。？！]$/.test(summary)) summary += '.';
  return summary;
}

function buildTags(file, title, bodyText, parent) {
  const rel = path.relative(root, file);
  const parts = rel.split(path.sep).slice(1, -1);
  const haystack = `${rel} ${title} ${parent || ''} ${bodyText}`.toLowerCase();
  const tags = [];

  for (const part of parts) {
    const mapped = directoryTags.get(part);
    if (mapped) mapped.forEach(tag => addTag(tags, tag));
    else addTag(tags, normalizeTag(part));
  }

  for (const [needle, tag] of keywordTags) {
    if (matchesKeyword(haystack, needle)) addTag(tags, tag);
  }

  return tags.slice(0, 7);
}

function addTag(tags, tag) {
  const normalized = normalizeTag(tag);
  if (normalized && !tags.includes(normalized)) tags.push(normalized);
}

function normalizeTag(tag) {
  return String(tag)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function textFromMarkdown(markdown) {
  let text = markdown.replace(/\r\n/g, '\n');
  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/`[^`]*`/g, match => match.slice(1, -1));
  text = text.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, ' ');
  text = text.replace(/\[[^\]]+]\((https?:\/\/[^)]+)\)/g, ' ');
  text = text.replace(/\[([^\]]+)]\([^)]*\)/g, '$1');
  text = text.replace(/<br\s*\/?>/gi, ' ');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text
    .split('\n')
    .map(line => line.replace(/^\s{0,3}(#{1,6}|[-*+>]+|\d+\.)\s*/g, '').trim())
    .filter(line => line && !isSkippableLine(line))
    .join(' ');
  return cleanInline(text);
}

function isSkippableLine(line) {
  return /^(reference|references|code|index|목차|table of contents)$/i.test(line) ||
    /^https?:\/\//i.test(line) ||
    /^[-|:\s]+$/.test(line);
}

function cleanInline(value) {
  return unquote(String(value))
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_~`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateAtBoundary(value, maxLength) {
  if (value.length <= maxLength) return value;
  const sentences = value.match(/[^.!?。？！]+[.!?。？！]?/g) || [value];
  let summary = '';
  for (const sentence of sentences) {
    const candidate = `${summary}${sentence}`.trim();
    if (candidate.length > maxLength) break;
    summary = candidate;
  }
  if (summary.length >= 45) return summary;
  return value.slice(0, maxLength - 1).replace(/\s+\S*$/, '').trim() + '...';
}

function matchesKeyword(haystack, needle) {
  const escaped = escapeRegExp(needle).replace(/\\ /g, '\\s+');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystack);
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function titleFromPath(file) {
  return path.basename(file, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
