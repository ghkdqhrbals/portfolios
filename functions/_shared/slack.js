const DEFAULT_CHANNEL_ID = 'C0BR56YB752';

export async function notifySlack(env, text) {
  try {
    if (env.SLACK_BOT_TOKEN) {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          channel: env.SLACK_CHANNEL_ID || DEFAULT_CHANNEL_ID,
          text
        })
      });
      const payload = await response.json();
      return response.ok && payload.ok === true;
    }

    if (env.SLACK_WEBHOOK_URL) {
      const response = await fetch(env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      return response.ok;
    }
  } catch (_error) {
    return false;
  }
  return false;
}
