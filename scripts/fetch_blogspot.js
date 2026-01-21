// scripts/fetch_blogspot.js
// Fetches Blogspot posts via RSS and saves as JSON for Eleventy

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Replace with your Blogspot RSS feed URL
const BLOGSPOT_RSS_URL = 'https://finerpcloud.blogspot.com/feeds/posts/default?alt=rss';
const OUTPUT_PATH = path.join(__dirname, '../src/_data/blog.json');

async function fetchBlogspotPosts() {
  try {
    const res = await fetch(BLOGSPOT_RSS_URL);
    if (!res.ok) throw new Error('Failed to fetch RSS feed');
    const xml = await res.text();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);
    const items = result.rss.channel[0].item || [];
    const posts = items.map(item => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate[0],
      description: item.description[0],
      // Add more fields as needed
    }));
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(posts, null, 2));
    console.log(`Fetched and saved ${posts.length} posts to blog.json`);
  } catch (err) {
    console.error('Error fetching Blogspot posts:', err);
    process.exit(1);
  }
}

fetchBlogspotPosts();
