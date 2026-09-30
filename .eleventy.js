module.exports = function(eleventyConfig) {
  // Copy assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css.css");
  eleventyConfig.addPassthroughCopy("src/dropdown.js");
  eleventyConfig.addPassthroughCopy("src/fire.js");
  eleventyConfig.addPassthroughCopy("src/back-to-top.js");
  eleventyConfig.addPassthroughCopy("src/backend.js");
  eleventyConfig.addPassthroughCopy("src/comment-widget.js");

  eleventyConfig.addPassthroughCopy("src/blog/posts/**/*.png");
  eleventyConfig.addPassthroughCopy("src/blog/posts/**/*.jpg");
  eleventyConfig.addPassthroughCopy("src/blog/posts/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("src/blog/posts/**/*.webp");
  eleventyConfig.addPassthroughCopy("src/blog/posts/**/*.gif");


 // --- Helper to guarantee categories is always an array ---
  const getCategoriesArray = (categories) => {
    if (!categories) return [];
    if (Array.isArray(categories)) return categories;
    return [categories]; 
  };

    // --- 2. Category Cloud Collection (Alphabetical Order) ---
  eleventyConfig.addCollection("categoryCloud", function(collectionApi) {
    const categoryMap = new Map();
    const posts = collectionApi.getFilteredByTag('post');
    
    // 1. Count the categories
    posts.forEach(item => {
      if ("categories" in item.data) {
        let cats = getCategoriesArray(item.data.categories);
        cats.forEach(cat => {
          categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
        });
      }
    });

    let cloudArray = Array.from(categoryMap, ([name, count]) => ({ name, count }));
    
    // 2. Find the highest and lowest counts to calculate the font size scale
    const counts = cloudArray.map(c => c.count);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    
    // 3. Define your smallest and largest font sizes (in rem)
    const minFontSize = 0.7;  // ~14px (smallest category)
    const maxFontSize = 2.2;  // ~35px (most popular category)

    // 4. Calculate the exact font size for each category
    cloudArray = cloudArray.map(cat => {
      let size = minFontSize;
      if (maxCount > minCount) {
        size = minFontSize + ((cat.count - minCount) / (maxCount - minCount)) * (maxFontSize - minFontSize);
      }
      return {
        name: cat.name,
        count: cat.count,
        fontSize: size.toFixed(2) 
      };
    });

    // 5. SORT ALPHABETICALLY (Case-insensitive)
    return cloudArray.sort((a, b) => a.name.localeCompare(b.name));
  });
  // --- 1. Excerpt Shortcode ---
  eleventyConfig.addShortcode("excerpt", (post) => {
    const content = post.templateContent || "";
    const endIndex = content.indexOf('</p>');
    if (endIndex > 0) {
      return content.substring(0, endIndex + 4);
    }
    return content;
  });

  // --- 2. Categories Collection ---
  eleventyConfig.addCollection("categories", function(collectionApi) {
    let categories = new Set();
    let posts = collectionApi.getFilteredByTag('post');
    
    posts.forEach(p => {
      let cats = getCategoriesArray(p.data.categories);
      cats.forEach(c => categories.add(c));
    });
    
    return Array.from(categories);
  });

  // --- 3. Filter by Category ---
  eleventyConfig.addFilter("filterByCategory", function(posts, cat) {
    cat = cat.toLowerCase();
    return posts.filter(p => {
      let cats = getCategoriesArray(p.data.categories).map(s => s.toLowerCase());
      return cats.includes(cat);
    });
  }); // <-- ✅ CLOSED PROPERLY HERE

  // --- 4. niceDate Filter ---
  eleventyConfig.addFilter("niceDate", function(dateObj, showYear = true) {
    const options = { 
      month: 'long', 
      day: 'numeric' 
    };
    
    // Only add the year if showYear is true
    if (showYear) {
      options.year = 'numeric';
    }

    return new Intl.DateTimeFormat("en", options).format(dateObj);
  });

  eleventyConfig.addPassthroughCopy("blog/images/*");


  return {
    dir: {
      input: "src",         // Looks inside src for index.liquid
      output: "public",     // Outputs to public
      includes: "_includes" // Looks inside src/_includes for base.liquid
    }
  };
};

