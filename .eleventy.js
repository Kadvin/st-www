module.exports = function(eleventyConfig) {
  // 静态资源直接复制
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // 忽略静态资源目录中的html文件
  eleventyConfig.ignores.add("src/css/**");
  eleventyConfig.ignores.add("src/js/**");
  eleventyConfig.ignores.add("src/images/**");
  eleventyConfig.ignores.add("src/fonts/**");

  // 配置开发服务器
  eleventyConfig.setServerOptions({
    port: 8080,
    showAllHosts: true
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
