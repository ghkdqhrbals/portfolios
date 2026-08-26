import fs from 'node:fs/promises';

const summaryPath = (process.env.GA4_SUMMARY_FILE || '_data/ga4_summary.json').trim();
const threshold = Number(process.env.GA4_ALERT_THRESHOLD || 2);
const summary = JSON.parse(await fs.readFile(summaryPath, 'utf8'));

if (summary.enabled === false) {
	throw new Error(summary.reason || 'GA4 summary generation failed');
}

const report = summary.yesterday || {};
const result = {
	notify: Number(report.activeUsers || 0) > threshold,
	date: summary.reportDate || '',
	activeUsers: Number(report.activeUsers || 0),
	sessions: Number(report.sessions || 0),
	pageViews: Number(report.screenPageViews || 0),
	threshold,
};

if (process.env.GITHUB_OUTPUT) {
	const lines = [
		`notify=${result.notify}`,
		`date=${result.date}`,
		`active_users=${result.activeUsers}`,
		`sessions=${result.sessions}`,
		`page_views=${result.pageViews}`,
	];
	await fs.appendFile(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`, 'utf8');
}

console.log(JSON.stringify(result));
