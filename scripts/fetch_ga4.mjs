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

async function writeJson(filePath, data) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function main() {
	const propertyId = (process.env.GA4_PROPERTY_ID || '').trim();
	const saRaw = process.env.GA4_SERVICE_ACCOUNT_JSON;
	const outDir = (process.env.GA4_OUTPUT_DIR || '_data').trim();
	const generatedAt = new Date().toISOString();

	if (!propertyId || !saRaw) {
		console.log('[ga4] GA4_PROPERTY_ID / GA4_SERVICE_ACCOUNT_JSON not set; writing placeholder data.');
		await writeJson(path.join(outDir, 'ga4_summary.json'), {
			generatedAt,
			enabled: false,
			reason: 'Missing GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_JSON',
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
			reason: 'Missing GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_JSON',
			window: 'last30days',
			series: [],
		});
		return;
	}

	let serviceAccount;
	try {
		serviceAccount = parseServiceAccountJson(saRaw);
	} catch (e) {
		console.error('[ga4] Failed to parse GA4_SERVICE_ACCOUNT_JSON.');
		throw e;
	}

	const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
	const client = new BetaAnalyticsDataClient({
		credentials: {
			client_email: serviceAccount.client_email,
			private_key: serviceAccount.private_key,
		},
	});

	const property = `properties/${propertyId}`;

	const [summary] = await client.runReport({
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

	const row = summary.rows?.[0];
	const values = row?.metricValues?.map((m) => Number(m.value || 0)) || [0, 0, 0, 0, 0];
	const [activeUsers30d, totalUsers30d, newUsers30d, sessions30d, pageViews30d] = values;

	const summaryJson = {
		generatedAt,
		propertyId,
		window: 'last30days',
		metrics: {
			activeUsers: activeUsers30d,
			totalUsers: totalUsers30d,
			newUsers: newUsers30d,
			sessions: sessions30d,
			screenPageViews: pageViews30d,
		},
	};

	const [series] = await client.runReport({
		property,
		dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
		dimensions: [{ name: 'date' }],
		metrics: [{ name: 'activeUsers' }],
		orderBys: [{ dimension: { dimensionName: 'date' } }],
	});

	const timeseries = (series.rows || []).map((r) => ({
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

	console.log('[ga4] Wrote _data/ga4_summary.json and _data/ga4_active_users_30d.json');
}

main().catch((e) => {
	console.error('[ga4] Failed:', e?.message || e);
	process.exitCode = 1;
});
