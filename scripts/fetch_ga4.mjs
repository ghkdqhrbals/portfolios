import fs from 'node:fs/promises';
import path from 'node:path';

function parseServiceAccountJson(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;

	if (trimmed.startsWith('{')) {
		return JSON.parse(trimmed);
	}

	// allow base64-encoded JSON in secrets
	const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
	return JSON.parse(decoded);
}

function looksLikeServiceAccountObject(obj) {
	return (
		obj &&
		typeof obj === 'object' &&
		typeof obj.client_email === 'string' &&
		typeof obj.private_key === 'string' &&
		obj.client_email.length > 3 &&
		obj.private_key.includes('BEGIN PRIVATE KEY')
	);
}

async function writeJson(filePath, data) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function readFileIfExists(filePath) {
	try {
		return await fs.readFile(filePath, 'utf8');
	} catch (e) {
		if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return null;
		throw e;
	}
}

async function loadLocalConfig() {
	const localPath = (process.env.GA4_LOCAL_CONFIG || 'scripts/ga4.local.json').trim();
	const raw = await readFileIfExists(localPath);
	if (!raw) return null;
	try {
		return { path: localPath, data: JSON.parse(raw) };
	} catch (e) {
		console.error(`[ga4] Failed to parse local config JSON: ${localPath}`);
		throw e;
	}
}

async function main() {
	// Hardcoded GA4 Property ID (numeric)
	// NOTE: GA4 Measurement ID (G-XXXX) is different and cannot be used here.
	let propertyId = process.env.GA4_PROPERTY_ID || '351902495';
	let saRaw = process.env.GA4_SERVICE_ACCOUNT_JSON;
	const saFile = (process.env.GA4_SERVICE_ACCOUNT_FILE || '').trim();
	const outDir = (process.env.GA4_OUTPUT_DIR || '_data').trim();
	const generatedAt = new Date().toISOString();
	let localConfigPathUsed = null;

	// Local hardcode option (recommended to keep secrets out of git)
	// - scripts/ga4.local.json (gitignored)
	// - or GA4_SERVICE_ACCOUNT_FILE pointing to a key json file
	if (!saRaw && !saFile) {
		const local = await loadLocalConfig();
		if (local) {
			localConfigPathUsed = local.path;
			const cfg = local.data || {};
			if (!saRaw) {
				if (cfg.serviceAccountJson) saRaw = JSON.stringify(cfg.serviceAccountJson);
				else if (cfg.serviceAccountJsonRaw) saRaw = cfg.serviceAccountJsonRaw;
				else if (cfg.serviceAccountFile) {
					const rawFromFile = await readFileIfExists(String(cfg.serviceAccountFile));
					if (rawFromFile) saRaw = rawFromFile;
				} else if (looksLikeServiceAccountObject(cfg)) {
					// Support local config being the service account JSON itself.
					saRaw = JSON.stringify(cfg);
				}
			}
			console.log(`[ga4] Loaded local config: ${local.path}`);
		}
	}
	if (!saRaw && saFile) {
		saRaw = await readFileIfExists(saFile);
	}

	if (!saRaw) {
		let reason;
		if (localConfigPathUsed) {
			reason = `Missing service account JSON in ${localConfigPathUsed}. Put the service account key JSON there (or set GA4_SERVICE_ACCOUNT_JSON).`;
		} else {
			reason = 'Missing GA4_SERVICE_ACCOUNT_JSON';
		}
		console.log(`[ga4] ${reason}; writing placeholder data.`);
		await writeJson(path.join(outDir, 'ga4_summary.json'), {
			generatedAt,
			enabled: false,
			reason,
			propertyId,
			totalSince2022: {
				activeUsers: 0,
				totalUsers: 0,
				newUsers: 0,
				sessions: 0,
				screenPageViews: 0,
			},
			last30days: {
				activeUsers: 0,
				totalUsers: 0,
				newUsers: 0,
				sessions: 0,
				screenPageViews: 0,
			},
			yesterday: {
				activeUsers: 0,
				totalUsers: 0,
				newUsers: 0,
				sessions: 0,
				screenPageViews: 0,
			},
		});
		await writeJson(path.join(outDir, 'ga4_active_users_30d.json'), {
			generatedAt,
			enabled: false,
			reason,
			propertyId,
			window: 'last30days',
			series: [],
		});
		return;
	}

	let client;
	let property;
	try {
		const serviceAccount = parseServiceAccountJson(saRaw);
		if (!looksLikeServiceAccountObject(serviceAccount)) {
			throw new Error('Service account JSON is missing client_email/private_key');
		}
		const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
		client = new BetaAnalyticsDataClient({
			credentials: {
				client_email: serviceAccount.client_email,
				private_key: serviceAccount.private_key,
			},
		});
		property = `properties/${propertyId}`;
	} catch (e) {
		const reason = e?.message ? String(e.message) : 'GA4 client initialization failed';
		console.error(`[ga4] ${reason}; writing placeholder data.`);
		await writeJson(path.join(outDir, 'ga4_summary.json'), {
			generatedAt,
			enabled: false,
			reason,
			propertyId,
			window: 'last30days',
			metrics: {
				activeUsers: 0,
				totalUsers: 0,
				newUsers: 0,
				sessions: 0,
				screenPageViews: 0,
			},
		});
		await writeJson(path.join(outDir, 'ga4_active_users_30d.json'), {
			generatedAt,
			enabled: false,
			reason,
			propertyId,
			window: 'last30days',
			series: [],
		});
		return;
	}

	let summarySince2022;
	let summary30d;
	let summaryYesterday;
	let series;
	try {
		[summarySince2022] = await client.runReport({
			property,
			dateRanges: [{ startDate: '2022-01-01', endDate: 'yesterday' }],
			metrics: [
				{ name: 'activeUsers' },
				{ name: 'totalUsers' },
				{ name: 'newUsers' },
				{ name: 'sessions' },
				{ name: 'screenPageViews' },
			],
		});

		[summary30d] = await client.runReport({
			property,
			dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
			metrics: [
				{ name: 'activeUsers' },
				{ name: 'totalUsers' },
				{ name: 'newUsers' },
				{ name: 'sessions' },
				{ name: 'screenPageViews' },
			],
		});

		[summaryYesterday] = await client.runReport({
			property,
			dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
			metrics: [
				{ name: 'activeUsers' },
				{ name: 'totalUsers' },
				{ name: 'newUsers' },
				{ name: 'sessions' },
				{ name: 'screenPageViews' },
			],
		});

		[series] = await client.runReport({
			property,
			dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
			dimensions: [{ name: 'date' }],
			metrics: [{ name: 'activeUsers' }],
			orderBys: [{ dimension: { dimensionName: 'date' } }],
		});
	} catch (e) {
		const reason = e?.message ? String(e.message) : 'GA4 API request failed';
		console.error(`[ga4] ${reason}; writing placeholder data.`);
		await writeJson(path.join(outDir, 'ga4_summary.json'), {
			generatedAt,
			enabled: false,
			reason,
			propertyId,
			totalSince2022: {
				activeUsers: 0,
				totalUsers: 0,
				newUsers: 0,
				sessions: 0,
				screenPageViews: 0,
			},
			last30days: {
				activeUsers: 0,
				totalUsers: 0,
				newUsers: 0,
				sessions: 0,
				screenPageViews: 0,
			},
			yesterday: {
				activeUsers: 0,
				totalUsers: 0,
				newUsers: 0,
				sessions: 0,
				screenPageViews: 0,
			},
		});
		await writeJson(path.join(outDir, 'ga4_active_users_30d.json'), {
			generatedAt,
			enabled: false,
			reason,
			propertyId,
			window: 'last30days',
			series: [],
		});
		return;
	}

	const rowSince2022 = summarySince2022?.rows?.[0];
	const valuesSince2022 = rowSince2022?.metricValues?.map((m) => Number(m.value || 0)) || [0, 0, 0, 0, 0];
	const [activeUsersSince2022, totalUsersSince2022, newUsersSince2022, sessionsSince2022, pageViewsSince2022] = valuesSince2022;

	const row30d = summary30d?.rows?.[0];
	const values30d = row30d?.metricValues?.map((m) => Number(m.value || 0)) || [0, 0, 0, 0, 0];
	const [activeUsers30d, totalUsers30d, newUsers30d, sessions30d, pageViews30d] = values30d;

	const rowYesterday = summaryYesterday?.rows?.[0];
	const valuesYesterday = rowYesterday?.metricValues?.map((m) => Number(m.value || 0)) || [0, 0, 0, 0, 0];
	const [activeUsersYesterday, totalUsersYesterday, newUsersYesterday, sessionsYesterday, pageViewsYesterday] = valuesYesterday;

	const summaryJson = {
		generatedAt,
		propertyId,
		totalSince2022: {
			activeUsers: activeUsersSince2022,
			totalUsers: totalUsersSince2022,
			newUsers: newUsersSince2022,
			sessions: sessionsSince2022,
			screenPageViews: pageViewsSince2022,
		},
		last30days: {
			activeUsers: activeUsers30d,
			totalUsers: totalUsers30d,
			newUsers: newUsers30d,
			sessions: sessions30d,
			screenPageViews: pageViews30d,
		},
		yesterday: {
			activeUsers: activeUsersYesterday,
			totalUsers: totalUsersYesterday,
			newUsers: newUsersYesterday,
			sessions: sessionsYesterday,
			screenPageViews: pageViewsYesterday,
		},
	};

	const timeseries = (series?.rows || []).map((r) => ({
		date: r.dimensionValues?.[0]?.value || '',
		activeUsers: Number(r.metricValues?.[0]?.value || 0),
	}));

	await writeJson(path.join(outDir, 'ga4_summary.json'), summaryJson);
	await writeJson(path.join(outDir, 'ga4_active_users_30d.json'), {
		generatedAt,
		propertyId,
		window: 'last30days',
		series: timeseries,
	});

	console.log(`[ga4] Wrote ${outDir}/ga4_summary.json and ${outDir}/ga4_active_users_30d.json`);
}

main().catch((e) => {
	console.error('[ga4] Failed:', e?.message || e);
	process.exitCode = 1;
});
