// The menu: sections in her order, each with its published posts, newest first.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export interface MenuSection {
  id: string;
  title: string;
  blurb?: string;
  order: number;
  posts: Post[];
}

/** Posts whose section file no longer exists land here instead of vanishing. */
export const UNSORTED: Omit<MenuSection, 'posts'> = {
  id: 'specials',
  title: 'Specials',
  blurb: "things that don't have a shelf yet",
  order: Number.MAX_SAFE_INTEGER,
};

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getMenu(): Promise<MenuSection[]> {
  const [sections, posts] = await Promise.all([getCollection('sections'), getPublishedPosts()]);
  const menu: MenuSection[] = sections
    .map((s) => ({ id: s.id, title: s.data.title, blurb: s.data.blurb, order: s.data.order, posts: [] as Post[] }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  const byId = new Map(menu.map((s) => [s.id, s]));
  const unsorted: MenuSection = { ...UNSORTED, posts: [] };
  for (const post of posts) {
    (byId.get(post.data.section) ?? unsorted).posts.push(post);
  }
  if (unsorted.posts.length) menu.push(unsorted);
  // Empty sections are still shown: a heading with nothing under it reads as "coming soon".
  return menu;
}
