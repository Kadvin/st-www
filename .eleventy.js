module.exports = function(eleventyConfig) {
  // 静态资源直接复制
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/images");

  // 忽略静态资源目录中的html文件
  eleventyConfig.ignores.add("src/assets/**");
  eleventyConfig.ignores.add("src/images/**");

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
