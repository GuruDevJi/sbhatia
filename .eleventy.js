module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addGlobalData("var", 
    JSON.parse(fs.readFileSync('./src/_data/var.json'))
  );  
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
