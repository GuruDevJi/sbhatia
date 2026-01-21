const { DateTime } = require("luxon");
const fs = require('fs');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  const varContent = fs.readFileSync('./src/_data/var.json', 'utf8').replace(/^\uFEFF/, '');
  eleventyConfig.addGlobalData("var", JSON.parse(varContent));

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(new Date(dateObj), { zone: 'utc' }).toFormat("cccc, dd LLLL yyyy");
  });
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
