// ============================================
// Shutterstock-Optimized Metadata Generator
// Produces titles, descriptions, and tags
// following Shutterstock contributor guidelines
// ============================================

import { GeneratorCategory } from "./generators";

interface StockMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
}

// ============================================
// Keyword pools per category
// ============================================

const KEYWORD_POOLS: Record<
  GeneratorCategory,
  {
    primary: string[];
    secondary: string[];
    styles: string[];
    useCases: string[];
  }
> = {
  abstract: {
    primary: [
      "abstract",
      "abstract art",
      "abstract background",
      "modern art",
      "contemporary art",
    ],
    secondary: [
      "flowing",
      "fluid",
      "dynamic",
      "creative",
      "artistic",
      "vibrant",
      "colorful",
      "expressive",
      "bold",
    ],
    styles: [
      "minimalist",
      "digital art",
      "generative art",
      "procedural",
      "algorithmic",
      "organic",
      "futuristic",
      "retro",
    ],
    useCases: [
      "wallpaper",
      "background",
      "desktop wallpaper",
      "website background",
      "banner",
      "poster",
      "cover art",
      "presentation",
    ],
  },
  texture: {
    primary: [
      "texture",
      "surface",
      "material",
      "seamless texture",
      "background texture",
    ],
    secondary: [
      "rough",
      "smooth",
      "natural",
      "organic",
      "grunge",
      "aged",
      "weathered",
      "industrial",
    ],
    styles: [
      "stone texture",
      "wood texture",
      "marble texture",
      "fabric texture",
      "concrete",
      "linen",
      "paper",
      "leather",
    ],
    useCases: [
      "3d rendering",
      "game asset",
      "graphic design",
      "product mockup",
      "packaging design",
      "interior design",
      "architecture",
    ],
  },
  wallpaper: {
    primary: [
      "wallpaper pattern",
      "wallpaper design",
      "seamless pattern",
      "repeating pattern",
      "decorative pattern",
    ],
    secondary: [
      "ornamental",
      "elegant",
      "vintage",
      "classic",
      "luxury",
      "decorative",
      "ornate",
      "stylish",
    ],
    styles: [
      "geometric pattern",
      "art deco",
      "moroccan",
      "damask",
      "hexagonal",
      "diamond pattern",
      "tile pattern",
      "arabesque",
    ],
    useCases: [
      "interior design",
      "textile design",
      "fabric print",
      "wrapping paper",
      "scrapbooking",
      "wall decor",
      "home decor",
    ],
  },
  floral: {
    primary: [
      "flower",
      "flowers",
      "floral",
      "blossom",
      "botanical",
      "floral pattern",
      "flower background",
    ],
    secondary: [
      "blooming",
      "petal",
      "garden",
      "natural",
      "fresh",
      "delicate",
      "romantic",
      "beautiful",
    ],
    styles: [
      "rose",
      "tulip",
      "daisy",
      "wildflower",
      "cherry blossom",
      "sunflower",
      "lavender",
      "lily",
    ],
    useCases: [
      "greeting card",
      "wedding invitation",
      "fabric design",
      "spring background",
      "mothers day",
      "valentines",
      "nature wallpaper",
    ],
  },
  landscape: {
    primary: [
      "landscape",
      "nature landscape",
      "scenery",
      "nature",
      "scenic view",
      "panorama",
    ],
    secondary: [
      "majestic",
      "serene",
      "peaceful",
      "dramatic",
      "breathtaking",
      "beautiful",
      "stunning",
      "tranquil",
    ],
    styles: [
      "mountain landscape",
      "forest",
      "sunset",
      "sunrise",
      "dawn",
      "twilight",
      "night sky",
      "golden hour",
    ],
    useCases: [
      "desktop wallpaper",
      "wall art",
      "canvas print",
      "travel",
      "adventure",
      "nature photography",
      "meditation background",
    ],
  },
  space: {
    primary: [
      "space",
      "galaxy",
      "cosmic",
      "nebula",
      "universe",
      "outer space",
      "space background",
    ],
    secondary: [
      "stellar",
      "celestial",
      "astral",
      "interstellar",
      "deep space",
      "galactic",
      "astronomical",
      "ethereal",
    ],
    styles: [
      "starfield",
      "milky way",
      "aurora",
      "supernova",
      "black hole",
      "constellation",
      "planet",
      "cosmos",
    ],
    useCases: [
      "sci-fi background",
      "game background",
      "movie poster",
      "book cover",
      "presentation",
      "science education",
      "astronomy",
    ],
  },
  geometric: {
    primary: [
      "geometric",
      "geometry",
      "geometric pattern",
      "geometric art",
      "line art",
      "minimal",
    ],
    secondary: [
      "clean",
      "precise",
      "mathematical",
      "symmetric",
      "angular",
      "structured",
      "ordered",
      "modernistic",
    ],
    styles: [
      "sacred geometry",
      "fractal",
      "polygonal",
      "triangular",
      "hexagonal",
      "circular",
      "grid pattern",
      "wireframe",
    ],
    useCases: [
      "logo design",
      "branding",
      "business card",
      "corporate",
      "architecture",
      "modern design",
      "tech background",
    ],
  },
  tropical: {
    primary: [
      "tropical",
      "tropical leaves",
      "palm",
      "jungle",
      "exotic",
      "tropical background",
      "tropical pattern",
    ],
    secondary: [
      "lush",
      "vibrant",
      "green",
      "paradise",
      "rainforest",
      "verdant",
      "wild",
      "botanical",
    ],
    styles: [
      "monstera",
      "palm leaf",
      "banana leaf",
      "fern",
      "hibiscus",
      "plumeria",
      "bird of paradise",
      "coconut palm",
    ],
    useCases: [
      "summer background",
      "beach party",
      "hawaiian",
      "resort",
      "spa",
      "vacation",
      "tropical wedding",
      "fashion print",
    ],
  },
  gradient: {
    primary: [
      "gradient",
      "gradient background",
      "color gradient",
      "colorful background",
      "smooth gradient",
    ],
    secondary: [
      "soft",
      "vibrant",
      "pastel",
      "neon",
      "muted",
      "warm",
      "cool",
      "dreamy",
    ],
    styles: [
      "mesh gradient",
      "aurora",
      "holographic",
      "iridescent",
      "ombre",
      "multicolor",
      "rainbow",
      "duotone",
    ],
    useCases: [
      "app background",
      "ui design",
      "social media",
      "instagram",
      "story background",
      "website design",
      "presentation slide",
    ],
  },
  love: {
    primary: [
      "love",
      "heart",
      "hearts",
      "romantic",
      "romance",
      "valentine",
      "love background",
    ],
    secondary: [
      "passionate",
      "tender",
      "sweet",
      "affectionate",
      "dreamy",
      "magical",
      "enchanting",
      "lovely",
    ],
    styles: [
      "heart pattern",
      "bokeh hearts",
      "heart shape",
      "cupid",
      "love letter",
      "pink hearts",
      "red hearts",
      "floating hearts",
    ],
    useCases: [
      "valentines day",
      "wedding",
      "anniversary",
      "love card",
      "romantic background",
      "couples",
      "engagement",
      "bridal shower",
    ],
  },
};

// ============================================
// Title templates
// ============================================

const TITLE_TEMPLATES: Record<GeneratorCategory, string[]> = {
  abstract: [
    "Abstract {style} background with {adj} {element} composition",
    "{adj} abstract art {element} in {style} style",
    "Modern abstract {element} background with {adj} colors",
    "{style} abstract {adj} {element} digital art wallpaper",
    "Creative abstract {adj} {element} {style} illustration",
  ],
  texture: [
    "{style} {adj} surface background high resolution",
    "{adj} {style} material texture for design",
    "Realistic {style} {adj} texture background closeup",
    "Natural {adj} {style} surface pattern detail",
    "{style} {adj} texture seamless background tile",
  ],
  wallpaper: [
    "{style} {adj} wallpaper pattern seamless repeat",
    "{adj} {style} decorative wallpaper design",
    "Seamless {adj} {style} pattern for interior design",
    "{style} {adj} ornamental tile pattern background",
    "Repeating {style} {adj} wallpaper texture design",
  ],
  floral: [
    "{adj} {style} flowers botanical illustration background",
    "Beautiful {adj} {style} floral pattern design",
    "{style} {adj} blossom and leaves botanical art",
    "{adj} flower garden with {style} blooms illustration",
    "Elegant {adj} {style} floral composition background",
  ],
  landscape: [
    "{adj} {style} landscape scenic nature panorama",
    "Beautiful {style} {adj} mountain scenery illustration",
    "{style} {adj} nature landscape digital painting",
    "{adj} {style} wilderness scenic vista artwork",
    "Dramatic {adj} {style} landscape with atmospheric lighting",
  ],
  space: [
    "{adj} {style} space background cosmic illustration",
    "Deep space {adj} {style} nebula galaxy artwork",
    "{style} {adj} cosmic universe starfield background",
    "{adj} {style} outer space nebula digital art",
    "Stunning {adj} {style} galaxy cosmic background",
  ],
  geometric: [
    "{adj} {style} geometric pattern minimal art",
    "Clean {adj} {style} geometric background modern design",
    "{style} {adj} geometry composition abstract art",
    "Minimal {adj} {style} geometric shapes illustration",
    "{adj} {style} geometric lines modern wallpaper",
  ],
  tropical: {
    0: "Lush {adj} {style} tropical leaves pattern background",
    1: "{adj} {style} tropical paradise botanical illustration",
    2: "Exotic {adj} {style} jungle foliage pattern design",
    3: "{adj} tropical {style} leaf botanical artwork",
    4: "Vibrant {adj} {style} tropical plant background",
  } as unknown as string[],
  gradient: [
    "{adj} {style} gradient background smooth color blend",
    "Beautiful {adj} {style} color gradient wallpaper",
    "{style} {adj} gradient abstract background design",
    "Soft {adj} {style} gradient mesh background",
    "{adj} {style} colorful gradient desktop wallpaper",
  ],
  love: [
    "{adj} {style} romantic love background with hearts",
    "Beautiful {adj} {style} heart pattern valentine design",
    "{adj} romantic {style} love hearts illustration",
    "{style} {adj} valentine hearts bokeh background",
    "Dreamy {adj} {style} romance love background wallpaper",
  ],
};

// ============================================
// Description templates
// ============================================

const DESC_TEMPLATES: Record<GeneratorCategory, string[]> = {
  abstract: [
    "Stunning abstract digital artwork featuring {adj} color compositions and {element} forms. Perfect for modern wall art, website backgrounds, and creative design projects.",
    "A vibrant abstract {style} composition with flowing shapes and harmonious color palette. Ideal for presentations, book covers, and banner designs.",
  ],
  texture: [
    "High-resolution {style} texture with {adj} surface detail. Suitable for 3D rendering, product mockups, and graphic design backgrounds.",
    "Realistic {adj} {style} material surface texture. Great for architectural visualization, game development, and print design.",
  ],
  wallpaper: [
    "Elegant {style} seamless pattern with {adj} decorative elements. Perfect for interior design, textile printing, and wrapping paper.",
    "Beautiful {adj} {style} repeating wallpaper design. Ideal for home decor, fabric design, and scrapbooking projects.",
  ],
  floral: [
    "Beautiful botanical illustration featuring {adj} {style} flowers and lush foliage. Perfect for greeting cards, wedding stationery, and spring-themed designs.",
    "Elegant {adj} floral composition with {style} blooms and botanical elements. Ideal for fabric prints, wall art, and invitation designs.",
  ],
  landscape: [
    "Breathtaking {style} landscape with {adj} atmospheric lighting and dramatic scenery. Perfect for wall art, desktop wallpaper, and travel-themed designs.",
    "Serene {adj} nature landscape featuring {style} elements. Ideal for canvas prints, meditation visuals, and nature-inspired decor.",
  ],
  space: [
    "Mesmerizing {style} deep space scene with {adj} nebula clouds and brilliant starfield. Perfect for sci-fi artwork, game backgrounds, and educational materials.",
    "Stunning {adj} cosmic {style} background featuring galaxies and stellar formations. Ideal for book covers, movie posters, and presentation backgrounds.",
  ],
  geometric: [
    "Clean and modern {style} geometric composition with {adj} precision. Perfect for corporate branding, logo design, and modern interior decor.",
    "Minimal {adj} geometric {style} artwork with balanced proportions. Ideal for office decor, business presentations, and architectural design.",
  ],
  tropical: [
    "Lush {style} tropical botanical illustration with {adj} exotic foliage. Perfect for summer campaigns, resort branding, and beach party designs.",
    "Vibrant {adj} tropical {style} pattern with exotic plants. Ideal for fashion prints, vacation-themed marketing, and spa decor.",
  ],
  gradient: [
    "Smooth {style} color gradient background with {adj} blending. Perfect for app UI design, social media graphics, and modern presentations.",
    "{adj} {style} gradient wallpaper with soft color transitions. Ideal for website backgrounds, poster design, and digital art.",
  ],
  love: [
    "Romantic {style} background with {adj} hearts and soft bokeh effects. Perfect for Valentine's Day cards, wedding invitations, and romantic designs.",
    "Dreamy {adj} {style} love-themed illustration with floating hearts. Ideal for anniversary gifts, engagement announcements, and romantic decor.",
  ],
};

// ============================================
// Generator function
// ============================================

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rand: () => number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}

export function generateMetadata(
  category: GeneratorCategory,
  seed: number,
): StockMetadata {
  const rand = seededRandom(seed + 9999);
  const pool = KEYWORD_POOLS[category];

  const adj = pick(pool.secondary, rand);
  const style = pick(pool.styles, rand);
  const element = pick(pool.secondary, rand);

  // Title
  let titleTemplatesArr: string[];
  const tt = TITLE_TEMPLATES[category];
  if (Array.isArray(tt)) {
    titleTemplatesArr = tt;
  } else {
    titleTemplatesArr = Object.values(tt);
  }
  let title = pick(titleTemplatesArr, rand);
  title = title
    .replace("{adj}", adj)
    .replace("{style}", style)
    .replace("{element}", element);
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Description
  let description = pick(DESC_TEMPLATES[category], rand);
  description = description
    .replace("{adj}", adj)
    .replace("{style}", style)
    .replace("{element}", element);

  // Tags — 30-50 keywords
  const tags: string[] = [
    ...pickN(pool.primary, 4, rand),
    ...pickN(pool.secondary, 5, rand),
    ...pickN(pool.styles, 4, rand),
    ...pickN(pool.useCases, 5, rand),
    // Universal stock tags
    ...pickN(
      [
        "illustration",
        "digital",
        "design",
        "background",
        "wallpaper",
        "decorative",
        "artistic",
        "creative",
        "modern",
        "colorful",
        "vibrant",
        "beautiful",
        "high resolution",
        "4K",
        "HD",
        "stock image",
        "vector style",
        "digital art",
        "horizontal",
        "no people",
        "copy space",
        "clean",
        "professional",
        "premium",
        "trending",
        "popular",
        "best seller",
        "download",
        "commercial use",
      ],
      12,
      rand,
    ),
  ];

  // Deduplicate
  const uniqueTags = [...new Set(tags.map((t) => t.toLowerCase()))];

  // Category for Shutterstock
  const categoryMap: Record<GeneratorCategory, string> = {
    abstract: "Abstract",
    texture: "Backgrounds/Textures",
    wallpaper: "Backgrounds/Textures",
    floral: "Nature",
    landscape: "Nature",
    space: "Science",
    geometric: "Abstract",
    tropical: "Nature",
    gradient: "Abstract",
    love: "Holidays",
  };

  return {
    title,
    description,
    tags: uniqueTags,
    category: categoryMap[category],
  };
}
