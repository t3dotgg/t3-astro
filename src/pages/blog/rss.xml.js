import rss from '@astrojs/rss';
import {getSlugFromPath} from "../../utils/get-slug-from-path";

const postImportResult = import.meta.glob('../../content/posts/*.md', { eager: true });
const allPosts = Object.values(postImportResult);
const sortedPosts = allPosts.sort(
    (a, b) =>
        new Date(b.frontmatter.date).valueOf() -
        new Date(a.frontmatter.date).valueOf(),
);

export const get = () => rss({
    title: 'Theo\'s Blog',
    description: 'I write about tech and content creation. It usually goes to Twitter. Sometimes it goes here instead :)',
    site: import.meta.env.SITE,
    items: sortedPosts.map((post) => ({
        link: "blog/post/" + getSlugFromPath(post.file),
        title: post.frontmatter.title,
        pubDate: post.frontmatter.pubDate,
    }))
});
