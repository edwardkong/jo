/** Prefix a site-relative path with the deploy base ("/" on Netlify, "/repo/" on GitHub project pages). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
