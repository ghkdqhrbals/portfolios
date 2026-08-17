export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const legacyPrefix = '/portfolios';

  const isLegacyPrefix =
    url.pathname === legacyPrefix || url.pathname.startsWith(`${legacyPrefix}/`);
  if (!isLegacyPrefix) {
    return context.next();
  }

  const remaining = url.pathname.slice(legacyPrefix.length) || '/';
  const targetPath = remaining.startsWith('/') ? remaining : `/${remaining}`;
  const redirectedUrl = new URL(url.href);
  redirectedUrl.pathname = targetPath;
  return Response.redirect(redirectedUrl.toString(), 301);
}
