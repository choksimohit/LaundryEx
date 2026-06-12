import React from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://laundry-express.co.uk';

// Private/transactional pages that should never appear in search results
const NOINDEX_PATHS = [
  '/cart',
  '/checkout',
  '/order-confirmation',
  '/dashboard',
  '/admin',
  '/forgot-password',
  '/reset-password',
];

// Renders the canonical URL (and robots meta for private pages) for the
// current route. React 19 hoists <link>/<meta> rendered anywhere into <head>.
export const Seo = () => {
  const { pathname } = useLocation();

  // Normalize: strip trailing slashes so /blog/ and /blog share one canonical
  let path = pathname.replace(/\/+$/, '');
  if (path === '') path = '/';

  const noindex = NOINDEX_PATHS.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  return (
    <>
      <link rel="canonical" href={path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`} />
      {noindex && <meta name="robots" content="noindex" />}
    </>
  );
};
