export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const legacyPrefix = '/portfolios';

  const isLegacyPrefix =
    url.pathname === legacyPrefix || url.pathname.startsWith(`${legacyPrefix}/`);
  const targetPath = isLegacyPrefix
    ? url.pathname.slice(legacyPrefix.length) || '/'
    : url.pathname;

  // Do not retrieve cached assets for withdrawn portfolio URLs.
  const isRemovedPortfolio =
    targetPath === '/portfolio' ||
    targetPath.startsWith('/portfolio/') ||
    targetPath === '/assets/portfolio' ||
    targetPath.startsWith('/assets/portfolio/');
  if (isRemovedPortfolio) {
    return new Response('Not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  if (!isLegacyPrefix) {
    return context.next();
  }

  const redirectedUrl = new URL(url.href);
  redirectedUrl.pathname = targetPath;
  return Response.redirect(redirectedUrl.toString(), 301);
}
