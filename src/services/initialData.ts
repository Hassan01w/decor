import { BlogPost, Category, HomepageConfig, NavigationItem, SiteSettings, MediaItem, Subscriber, AdminUser } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'decor',
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Elevate your sanctuary with warm minimalism, timeless furnishings, layered textiles, and modern organic styling.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#2F3A32',
    displayOrder: 1,
  },
  {
    id: 'diy',
    name: 'DIY & Crafts',
    slug: 'diy',
    description: 'Creative weekend transformations, handcrafted decor, wood refinishing, and budget-friendly architectural accents.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#A68B6A',
    displayOrder: 2,
  },
  {
    id: 'organization',
    name: 'Organization',
    slug: 'organization',
    description: 'Mindful decluttering systems, walk-in pantry perfection, linen closet zen, and small-space storage genius.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#475B4D',
    displayOrder: 3,
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Dining',
    slug: 'kitchen',
    description: 'Rustic sourdough rituals, open-shelving styling, artisanal coffee corners, and wholesome farm-to-table recipes.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#8C7355',
    displayOrder: 4,
  },
  {
    id: 'cleaning',
    name: 'Cleaning Rituals',
    slug: 'cleaning',
    description: 'Non-toxic cleaning solutions, seasonal home resets, natural linen care, and daily 15-minute maintenance routines.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#3E4D42',
    displayOrder: 5,
  },
  {
    id: 'gardening',
    name: 'Garden & Plants',
    slug: 'gardening',
    description: 'Flourishing indoor jungles, patio herb gardens, cut-flower arranging, and botanical wellness throughout the seasons.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#2F3A32',
    displayOrder: 6,
  },
  {
    id: 'improvement',
    name: 'Home Improvement',
    slug: 'home-improvement',
    description: 'Practical renos, board-and-batten accent walls, peel-and-stick tile guides, and smart lighting upgrades.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#A68B6A',
    displayOrder: 7,
  },
  {
    id: 'lifestyle',
    name: 'Mindful Lifestyle',
    slug: 'lifestyle',
    description: 'Intentional morning routines, slow Sunday rituals, cozy reading nooks, and finding stillness at home.',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#C8A97E',
    displayOrder: 8,
  },
];

export const AUTHORS = [
  {
    id: 'sam',
    name: 'Sam Sterling',
    role: 'Editor-in-Chief & Lead Interior Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Sam is an architect turned home stylist passionate about natural organic luxury, heritage craftsmanship, and creating mindful sanctuary spaces.',
  },
  {
    id: 'elena',
    name: 'Elena Vance',
    role: 'Editorial Director & Interior Stylist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Elena is an architect turned home stylist passionate about warm minimalism, heritage craftsmanship, and creating restorative home spaces.',
  },
  {
    id: 'marcus',
    name: 'Marcus Hayes',
    role: 'DIY & Renovation Editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Marcus has spent 12 years restoring historic craftsman bungalows and teaching readers how to transform rooms on realistic weekend budgets.',
  },
  {
    id: 'sophia',
    name: 'Sophia Lin',
    role: 'Holistic Home & Botanical Expert',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Sophia shares non-toxic cleaning rituals, herbal teas, houseplant care, and slow-living philosophy.',
  },
  {
    id: 'julian',
    name: 'Julian Davies',
    role: 'Woodworking & Sustainable Living Contributor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Julian is a bespoke furniture artisan and writer dedicated to sustainable timber sourcing and mindful woodworking.',
  }
];

export const INITIAL_USERS: AdminUser[] = [
  {
    id: 'user-admin',
    name: 'Alex Morgan',
    username: 'admin',
    password: 'vip123',
    email: 'thedecordiarystore@gmail.com',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    title: 'Store Administrator',
    bio: 'Lead store administrator and curator.',
    authorId: 'admin',
    createdAt: '2026-01-01'
  },
  {
    id: 'user-editor',
    name: 'Sarah Jenkins',
    username: 'editor',
    password: 'vip123',
    email: 'editor@thedecordiarystore.com',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    title: 'Editorial Director',
    bio: 'Store administrator and editorial director.',
    authorId: 'editor',
    createdAt: '2026-01-10'
  }
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Art of Warm Minimalism: How to Create a Cozy, Calming Home Without the Clutter',
    slug: 'art-of-warm-minimalism-cozy-home',
    excerpt: 'Discover the secret to minimalist interiors that feel soulful and inviting rather than sterile — using rich textures, earthy limewash, and natural curved wood.',
    categoryId: 'decor',
    tags: ['Interior Design', 'Warm Minimalism', 'Living Room', 'Organic Modern'],
    author: AUTHORS[0],
    publishedAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-20T14:30:00Z',
    readingTimeMinutes: 6,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 3420,
    savesCount: 890,
    featuredImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'A sunlit living room featuring tactile linen, travertine coffee table, and soft beige lime plaster walls.',
    imageAlt: 'Warm minimalist living room with neutral linen sofa and large olive tree',
    seo: {
      seoTitle: 'The Art of Warm Minimalism: Cozy Home Decor Guide 2026',
      metaDescription: 'Learn how to master warm minimalism in your home decor. Balance calm simplicity with tactile linen, warm tones, and natural organic materials.',
      focusKeyword: 'warm minimalism home decor',
      canonicalUrl: 'https://thedecordiary.store/blog/art-of-warm-minimalism-cozy-home',
      ogImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'b1',
        type: 'paragraph',
        content: {
          text: 'For years, minimalism earned an unfair reputation for cold concrete floors, stark white walls, and clinical furniture that felt more like an art gallery than a sanctuary. But the new era of design is defined by something far more human: warm minimalism.'
        }
      },
      {
        id: 'b2',
        type: 'quote',
        content: {
          text: 'Warm minimalism is not about depriving yourself of possessions; it is about choosing only what breathes peace into your everyday life.',
          author: 'Elena Vance, Interior Stylist'
        }
      },
      {
        id: 'b3',
        type: 'heading2',
        content: {
          text: '1. Layer Tactile Textures in a Monochromatic Palette'
        }
      },
      {
        id: 'b4',
        type: 'paragraph',
        content: {
          text: 'When you eliminate visual clutter, texture becomes the visual story. Instead of relying on bright colors for visual interest, introduce subtle depth through varied tactile materials: chunky boucle, raw flax linen, unpolished travertine, honed marble, and wire-brushed white oak.'
        }
      },
      {
        id: 'b5',
        type: 'image',
        content: {
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
          caption: 'Combining woven wool throws, ceramic vases, and warm timber balances clean architectural lines.',
          alt: 'Cozy neutral interior styling with ceramic vessel and linen throw'
        }
      },
      {
        id: 'b6',
        type: 'callout',
        content: {
          calloutType: 'tip',
          calloutTitle: 'The 60-30-10 Neutral Rule',
          text: 'Use 60% warm creamy base (bone or oat white), 30% grounding natural tones (warm walnut, clay, or jute), and 10% dark contrast (oil-rubbed bronze or charcoal ceramics).'
        }
      },
      {
        id: 'b7',
        type: 'heading2',
        content: {
          text: '2. Celebrate Negative Space as a Design Feature'
        }
      },
      {
        id: 'b8',
        type: 'paragraph',
        content: {
          text: 'Every object in a warm minimalist room should have breathing room. Resist the urge to fill every corner with side tables or wall niches with knickknacks. A single oversized ceramic urn with wild dried branches makes a far more memorable statement than five small picture frames.'
        }
      },
      {
        id: 'b9',
        type: 'bullet_list',
        content: {
          items: [
            'Choose multi-functional storage furniture with seamless concealed doors.',
            'Opt for low-profile furniture that allows natural light to glide freely.',
            'Incorporate organic curved silhouettes to soften rectangular architectural edges.',
            'Install warm 2700K ambient lighting layered with dimmable picture lights.'
          ]
        }
      },
      {
        id: 'b10',
        type: 'button',
        content: {
          buttonText: 'Save This Guide to Your Pinterest Board',
          buttonUrl: 'https://www.pinterest.com/thedecordiary1214/',
          buttonStyle: 'primary'
        }
      }
    ]
  },
  {
    id: 'post-2',
    title: '12 Walk-In Pantry Organization Ideas That Look Like an Editorial Dream',
    slug: 'walk-in-pantry-organization-ideas',
    excerpt: 'Step-by-step guidance on transforming a cluttered pantry into an organized, aesthetic haven with decanted glass jars, woven baskets, and label typography.',
    categoryId: 'organization',
    tags: ['Pantry Goals', 'Kitchen Organization', 'Decluttering', 'Storage Hacks'],
    author: AUTHORS[1],
    publishedAt: '2026-08-16T09:15:00Z',
    updatedAt: '2026-08-19T11:00:00Z',
    readingTimeMinutes: 5,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 4190,
    savesCount: 1420,
    featuredImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'A beautifully styled walk-in butler pantry with amber glass spice jars and wicker storage baskets.',
    imageAlt: 'Organized pantry shelves with glass jars, matching wood scoops, and seagrass bins',
    seo: {
      seoTitle: '12 Walk-In Pantry Organization Ideas & Aesthetic Tips',
      metaDescription: 'Transform your pantry with these 12 genius organization tips. Master decanting, tiered risers, and uniform aesthetic storage.',
      focusKeyword: 'walk in pantry organization ideas',
      canonicalUrl: 'https://thedecordiary.store/blog/walk-in-pantry-organization-ideas',
      ogImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p1',
        type: 'paragraph',
        content: {
          text: 'There is a profound sense of calm that comes with opening your pantry door in the morning to discover a beautifully categorized, decanted array of whole grains, spices, and dried herbs. Organizing your pantry is one of the highest-impact weekend projects for your daily rhythm.'
        }
      },
      {
        id: 'p2',
        type: 'heading2',
        content: {
          text: 'Step 1: The Full Empty & Deep Wipe-Down'
        }
      },
      {
        id: 'p3',
        type: 'paragraph',
        content: {
          text: 'Before you buy a single bin or jar, pull everything out. Group by categories on your dining table: baking staples, breakfast grains, canned sauces, oils & vinegars, snacks, and specialty imports.'
        }
      },
      {
        id: 'p4',
        type: 'image',
        content: {
          url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
          caption: 'Consistent glass cannisters with acacia wood lids create timeless harmony on open shelving.',
          alt: 'Glass food storage jars with bamboo lids'
        }
      },
      {
        id: 'p5',
        type: 'callout',
        content: {
          calloutType: 'info',
          calloutTitle: 'Pro-Organizer Secret',
          text: 'Keep a small chalk marker or embossed tape label maker inside the pantry drawer to date newly opened decanted ingredients on the bottom of each jar.'
        }
      },
      {
        id: 'p6',
        type: 'heading3',
        content: {
          text: 'The Ultimate Zone Breakdown'
        }
      },
      {
        id: 'p7',
        type: 'number_list',
        content: {
          items: [
            'Eye-level shelves: Daily essentials like oats, coffee beans, olive oil, and raw honey.',
            'Lower shelves: Heavy bulk items, cast-iron Dutch ovens, and woven crates for root vegetables.',
            'Upper shelves: Seasonal bakeware, holiday table linens, and extra paper goods.',
            'Door racks: Narrow spice risers and specialty condiments for instant visibility.'
          ]
        }
      }
    ]
  },
  {
    id: 'post-3',
    title: 'DIY Limewash Accent Wall: A Complete Beginner Weekend Guide',
    slug: 'diy-limewash-accent-wall-guide',
    excerpt: 'Learn how to apply mineral limewash paint to achieve that cloudy, Old-World European texture on ordinary drywall with zero previous plaster experience.',
    categoryId: 'diy',
    tags: ['DIY', 'Limewash', 'Paint Transformation', 'Weekend Project', 'Budget Home'],
    author: AUTHORS[1],
    publishedAt: '2026-08-14T14:20:00Z',
    updatedAt: '2026-08-17T09:00:00Z',
    readingTimeMinutes: 7,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 2850,
    savesCount: 970,
    featuredImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Cloudy, textured beige mineral limewash gives depth and tactile elegance to a bedroom feature wall.',
    imageAlt: 'Textured limewash painted wall behind a cozy minimalist bed',
    seo: {
      seoTitle: 'How to Paint a Limewash Wall: DIY Step-by-Step Tutorial',
      metaDescription: 'Master the cross-hatch brush technique to create stunning cloudy limewash walls. Complete tool list, primer recommendations, and coat drying times.',
      focusKeyword: 'diy limewash accent wall',
      canonicalUrl: 'https://thedecordiary.store/blog/diy-limewash-accent-wall-guide',
      ogImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'd1',
        type: 'paragraph',
        content: {
          text: 'Few design treatments can elevate a standard builder-grade drywall room quite like authentic mineral limewash. It reacts with atmospheric carbon dioxide to form a velvety, calcified surface that catches daylight with mesmerizing subtlety.'
        }
      },
      {
        id: 'd2',
        type: 'heading2',
        content: {
          text: 'Essential Tools & Supplies Checklist'
        }
      },
      {
        id: 'd3',
        type: 'bullet_list',
        content: {
          items: [
            'Mineral primer formulated specifically for slaked lime coatings',
            'Authentic slaked lime paint (warm oat or chalk stone tone)',
            'Large 6-inch natural block brush (essential for cloud blooms)',
            'Clean water spray mister bottle for dampening working zones',
            'Painter’s delicate surface tape & canvas drop cloths'
          ]
        }
      },
      {
        id: 'd4',
        type: 'callout',
        content: {
          calloutType: 'warning',
          calloutTitle: 'Crucial Application Rule',
          text: 'Never "cut in" edges first and roll the center! Limewash must be applied in a continuous wet-edge cross-hatch (figure-8 or X-stroke) pattern across the entire wall to prevent visible overlap lines.'
        }
      },
      {
        id: 'd5',
        type: 'image',
        content: {
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
          caption: 'The cross-hatch brushstrokes create natural watercolor bloom effects as the mineral paint cures.',
          alt: 'Close up of natural textured wall paint finish'
        }
      }
    ]
  },
  {
    id: 'post-4',
    title: 'The Slow Sunday Morning: Cultivating Restorative Kitchen & Baking Rituals',
    slug: 'slow-sunday-morning-baking-rituals',
    excerpt: 'How waking up thirty minutes earlier on Sunday for artisanal pour-over coffee and wild-yeast sourdough can reset your nervous system for the week ahead.',
    categoryId: 'kitchen',
    tags: ['Kitchen Rituals', 'Slow Living', 'Sourdough', 'Mindful Morning'],
    author: AUTHORS[2],
    publishedAt: '2026-08-11T08:00:00Z',
    updatedAt: '2026-08-12T10:00:00Z',
    readingTimeMinutes: 4,
    status: 'published',
    isFeatured: true,
    isPopular: false,
    viewsCount: 1980,
    savesCount: 620,
    featuredImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'A sunlit kitchen counter set with ceramic mugs, fresh rosemary focaccia, and fresh olive oil.',
    imageAlt: 'Cozy rustic kitchen table with freshly baked artisan bread and steaming coffee',
    seo: {
      seoTitle: 'Slow Sunday Kitchen Rituals: Morning Routines for Mindful Living',
      metaDescription: 'Embrace the beauty of slow Sundays at home with gentle coffee brewing, sourdough baking, and intentional quiet rituals.',
      focusKeyword: 'slow sunday morning kitchen rituals',
      canonicalUrl: 'https://thedecordiary.store/blog/slow-sunday-morning-baking-rituals',
      ogImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'k1',
        type: 'paragraph',
        content: {
          text: 'In our fast-paced modern world, Sunday mornings represent an sacred sanctuary. It is the one time of the week where timers and notifications can be muted in favor of sensory connection.'
        }
      },
      {
        id: 'k2',
        type: 'quote',
        content: {
          text: 'When we take time to knead flour, watch the bloom of water over dark roast, and sit in quiet morning light, home ceases to be a shelter and becomes a temple of peace.',
          author: 'Sophia Lin'
        }
      }
    ]
  },
  {
    id: 'post-5',
    title: 'Non-Toxic Cleaning Rituals: 5 Natural Formulas for a Sparkling Sanctuary',
    slug: 'non-toxic-cleaning-rituals-natural-formulas',
    excerpt: 'Ditch harsh synthetic fragrances. Harness the antimicrobial power of distilled white vinegar, castile soap, thyme essential oil, and baking soda.',
    categoryId: 'cleaning',
    tags: ['Non-Toxic Living', 'Natural Cleaning', 'Eco Friendly', 'Essential Oils'],
    author: AUTHORS[2],
    publishedAt: '2026-08-08T11:30:00Z',
    updatedAt: '2026-08-10T16:00:00Z',
    readingTimeMinutes: 5,
    status: 'published',
    isFeatured: false,
    isPopular: true,
    viewsCount: 2210,
    savesCount: 780,
    featuredImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Amber glass spray bottles with handwritten labels, natural sisal cleaning brushes, and linen towels.',
    imageAlt: 'Eco friendly cleaning supplies with amber glass spray bottles and wooden dish brushes',
    seo: {
      seoTitle: '5 Non-Toxic DIY Natural Cleaning Recipes for Every Room',
      metaDescription: 'Safe, fragrant, and effective cleaning solutions made from simple pantry ingredients. All-purpose spray, glass cleaner, and grout paste.',
      focusKeyword: 'non toxic natural cleaning recipes',
      canonicalUrl: 'https://thedecordiary.store/blog/non-toxic-cleaning-rituals-natural-formulas',
      ogImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'c1',
        type: 'paragraph',
        content: {
          text: 'Your home is your most intimate environment. Breathing in artificial fragrance and harsh chemicals is unnecessary when gentle, time-tested natural compounds can sanitize surfaces just as effectively.'
        }
      },
      {
        id: 'c2',
        type: 'heading2',
        content: {
          text: 'The Rosemary & Lemon All-Surface Spray'
        }
      },
      {
        id: 'c3',
        type: 'bullet_list',
        content: {
          items: [
            '1 cup distilled white vinegar infused with lemon rinds for 2 weeks',
            '1 cup distilled water',
            '10 drops organic French lavender essential oil',
            '8 drops sweet orange or bergamot essential oil'
          ]
        }
      }
    ]
  },
  {
    id: 'post-6',
    title: 'Botanical Living: 8 Low-Light Houseplants That Instantly Refresh Any Room',
    slug: 'botanical-living-low-light-houseplants',
    excerpt: 'Even northern-facing apartments can flourish with these sculptural, air-purifying foliage varieties that require minimal maintenance.',
    categoryId: 'gardening',
    tags: ['Houseplants', 'Indoor Jungle', 'Plant Styling', 'Low Light Plants'],
    author: AUTHORS[2],
    publishedAt: '2026-08-05T13:00:00Z',
    updatedAt: '2026-08-07T08:00:00Z',
    readingTimeMinutes: 6,
    status: 'published',
    isFeatured: false,
    isPopular: false,
    viewsCount: 1650,
    savesCount: 510,
    featuredImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'A thriving collection of sculptural Monstera, ZZ plants, and pothos trailing from floating oak shelves.',
    imageAlt: 'Abundant green houseplants styled on wooden shelf in sunny corner',
    seo: {
      seoTitle: '8 Best Low Light Houseplants for Indoor Home Decor',
      metaDescription: 'Discover hardy, gorgeous indoor plants that thrive in dim corners. Care guides for ZZ plants, Snake plants, Cast Iron plants, and Pothos.',
      focusKeyword: 'low light houseplants home decor',
      canonicalUrl: 'https://thedecordiary.store/blog/botanical-living-low-light-houseplants',
      ogImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'g1',
        type: 'paragraph',
        content: {
          text: 'Living green foliage is nature’s ultimate interior accessory. Plants bring sculptural life, soften stark angles, and improve indoor humidity while connecting us to the natural world.'
        }
      }
    ]
  },
  {
    id: 'post-7',
    title: 'Small Bedroom Transformations: 7 Designer Tricks to Maximize Space & Light',
    slug: 'small-bedroom-decor-ideas-maximize-space',
    excerpt: 'How to turn a compact bedroom into a cozy, boutique hotel haven with floating nightstands, vertical curtains, and layered warm lighting.',
    categoryId: 'decor',
    tags: ['Small Spaces', 'Bedroom Design', 'Decor Hacks', 'Lighting Tips'],
    author: AUTHORS[0],
    publishedAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-04T12:00:00Z',
    readingTimeMinutes: 5,
    status: 'published',
    isFeatured: false,
    isPopular: true,
    viewsCount: 3100,
    savesCount: 1120,
    featuredImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Floor-to-ceiling linen drapes and wall-mounted brass reading sconces elevate this intimate bedroom retreat.',
    imageAlt: 'Small stylish bedroom with linen bedding, wall sconce, and warm ambient light',
    seo: {
      seoTitle: 'Small Bedroom Decor Ideas: How to Make Small Rooms Look Luxe',
      metaDescription: 'Make your small bedroom feel expansive and restorative with these 7 designer styling tricks and space-saving furniture recommendations.',
      focusKeyword: 'small bedroom decor ideas',
      canonicalUrl: 'https://thedecordiary.store/blog/small-bedroom-decor-ideas-maximize-space',
      ogImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'b1',
        type: 'paragraph',
        content: {
          text: 'Small bedrooms often possess an innate sense of intimacy that cavernous master suites lack. With the right design strategy, square footage limitations can become an asset rather than a compromise.'
        }
      }
    ]
  },
  {
    id: 'post-8',
    title: 'Curated Open Shelving: The Art of Functional Kitchen Styling',
    slug: 'open-shelving-kitchen-styling-guide',
    excerpt: 'Avoid clutter and dust with these practical rules for curating everyday ceramics, glassware, and wooden cutting boards on open kitchen shelves.',
    categoryId: 'kitchen',
    tags: ['Kitchen Shelves', 'Ceramics', 'Open Shelving', 'Rustic Modern'],
    author: AUTHORS[0],
    publishedAt: '2026-07-29T15:30:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    readingTimeMinutes: 4,
    status: 'published',
    isFeatured: false,
    isPopular: false,
    viewsCount: 1420,
    savesCount: 490,
    featuredImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Stacking everyday stoneware dishes alongside vintage olive oil cruets keeps open shelving both functional and beautiful.',
    imageAlt: 'Open wooden shelves styled with neutral handmade pottery and wine glasses',
    seo: {
      seoTitle: 'How to Style Open Kitchen Shelves: Practical & Beautiful Guide',
      metaDescription: 'Learn the rule of thirds, stacking heights, and everyday dishware placement for open kitchen shelves that stay clean and inspiring.',
      focusKeyword: 'open shelving kitchen styling',
      canonicalUrl: 'https://thedecordiary.store/blog/open-shelving-kitchen-styling-guide',
      ogImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'o1',
        type: 'paragraph',
        content: {
          text: 'The key to open shelves that do not collect dust is to only display items that you reach for daily. When plates, bowls, and mugs are constantly cycled through the dishwasher, your shelves remain effortless to maintain.'
        }
      }
    ]
  },
  {
    id: 'post-9',
    title: 'The Linen Closet Sanctuary: Folding Techniques & Cedar Scenting',
    slug: 'linen-closet-sanctuary-folding-scenting',
    excerpt: 'Master the hotel roll method, waffle towel stacks, and lavender-cedar sachets to keep your sheets and towels perpetually fresh.',
    categoryId: 'organization',
    tags: ['Linen Care', 'Closet Organization', 'Home Rituals'],
    author: AUTHORS[1],
    publishedAt: '2026-07-25T09:00:00Z',
    updatedAt: '2026-07-25T09:00:00Z',
    readingTimeMinutes: 4,
    status: 'published',
    isFeatured: false,
    isPopular: true,
    viewsCount: 2190,
    savesCount: 620,
    featuredImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Crisp folded white waffle towels and organic linen sheets stored in ventilated slatted shelving.',
    imageAlt: 'Organized linen closet with folded white towels and baskets',
    seo: {
      seoTitle: 'Linen Closet Organization & Folding Guide',
      metaDescription: 'Keep your linens fresh, organized, and hotel-crisp with these simple folding rituals.',
      focusKeyword: 'linen closet organization',
      canonicalUrl: 'https://thedecordiary.store/blog/linen-closet-sanctuary-folding-scenting',
      ogImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'l1',
        type: 'paragraph',
        content: {
          text: 'Folding linens with intention transforms a mundane chore into a calming home care ritual. Utilizing cedar rings and pure dried lavender keeps natural fabrics insect-free and lightly fragrant.'
        }
      }
    ]
  },
  {
    id: 'post-10',
    title: 'Handcrafted Heritage: The Beginner Guide to Reclaimed White Oak Furniture',
    slug: 'guide-to-reclaimed-white-oak-furniture',
    excerpt: 'Step-by-step masterclass on selecting sustainable salvaged lumber, applying non-toxic hardwax oil finishes, and building heirloom coffee tables.',
    categoryId: 'diy',
    tags: ['Woodworking', 'DIY Furniture', 'Reclaimed Timber', 'Sustainable Living'],
    author: AUTHORS[3], // Julian Davies
    publishedAt: '2026-08-25T09:00:00Z',
    updatedAt: '2026-08-22T10:00:00Z',
    readingTimeMinutes: 7,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 2840,
    savesCount: 780,
    featuredImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Artisan white oak joinery treated with matte organic hardwax oil.',
    imageAlt: 'Handcrafted wooden table with organic grain finish',
    seo: {
      seoTitle: 'Reclaimed White Oak Furniture Guide & DIY Finishing Tips',
      metaDescription: 'Discover how to craft and finish heirloom-grade reclaimed wood tables with non-toxic matte wax.',
      focusKeyword: 'reclaimed white oak furniture diy',
      canonicalUrl: 'https://thedecordiary.store/blog/guide-to-reclaimed-white-oak-furniture',
      ogImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'w1',
        type: 'paragraph',
        content: {
          text: 'There is an incomparable soulfulness to timber that has already lived a lifetime — barn beams, warehouse floor joists, and salvaged wine barrels transformed into dining tables.'
        }
      },
      {
        id: 'w2',
        type: 'callout',
        content: {
          calloutType: 'tip',
          calloutTitle: 'Finishing with Hardwax Oil',
          text: 'Avoid plastic polyurethane topcoats. Two coats of plant-based hardwax oil preserve the raw, velvety touch of oak while protecting from wine spills.'
        }
      }
    ]
  },
  {
    id: 'post-11',
    title: 'Parisian Elegance: Mixing Gilded Antique Mirrors with Modern Bouclé',
    slug: 'parisian-elegance-antique-mirrors-boucle',
    excerpt: 'How French apartment stylists balance ornate Louis Philippe gilded frames, herringbone parquet floors, and sculptural contemporary seating.',
    categoryId: 'decor',
    tags: ['French Decor', 'Vintage Antiques', 'Living Room', 'Luxury'],
    author: AUTHORS[1], // Elena Vance
    publishedAt: '2026-08-28T11:00:00Z',
    updatedAt: '2026-08-28T11:00:00Z',
    readingTimeMinutes: 5,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 3950,
    savesCount: 1120,
    featuredImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'A tall ornate gilt mirror reflecting modern cloud-shaped bouclé chairs and neutral drapes.',
    imageAlt: 'Parisian style living room with antique gold mirror and modern furniture',
    seo: {
      seoTitle: 'Parisian Elegance: How to Mix Antiques with Modern Bouclé',
      metaDescription: 'Learn how to master French apartment aesthetic by pairing historic gilded mirrors with contemporary curved furniture.',
      focusKeyword: 'parisian home decor style',
      canonicalUrl: 'https://thedecordiary.store/blog/parisian-elegance-antique-mirrors-boucle',
      ogImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p11-1',
        type: 'paragraph',
        content: {
          text: 'The essence of Parisian chic is calculated nonchalance. Rather than matching every period, French stylists lean into the tension between antique grandeur and modern minimalism.'
        }
      }
    ]
  },
  {
    id: 'post-12',
    title: 'The 15-Minute Nightly Kitchen Reset: A Stress-Free Evening Ritual',
    slug: 'nightly-kitchen-reset-stress-free-ritual',
    excerpt: 'End each day with clarity by executing a simple, sequential 15-minute cleanup checklist that makes waking up a restorative joy.',
    categoryId: 'cleaning',
    tags: ['Kitchen Rituals', 'Cleaning Rituals', 'Slow Living', 'Evening Routine'],
    author: AUTHORS[2], // Sophia Lin
    publishedAt: '2026-08-29T18:00:00Z',
    updatedAt: '2026-08-29T18:00:00Z',
    readingTimeMinutes: 4,
    status: 'published',
    isFeatured: false,
    isPopular: true,
    viewsCount: 4210,
    savesCount: 1350,
    featuredImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Gleaming stone countertop and freshly wiped brass sink bathed in warm 2700K pendant light.',
    imageAlt: 'Clean modern kitchen at night with ambient lighting',
    seo: {
      seoTitle: 'The 15-Minute Nightly Kitchen Reset: Daily Routine Guide',
      metaDescription: 'Discover the gentle evening ritual to reset your kitchen counters, sink, and dishes in 15 peaceful minutes.',
      focusKeyword: 'kitchen reset routine',
      canonicalUrl: 'https://thedecordiary.store/blog/nightly-kitchen-reset-stress-free-ritual',
      ogImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p12-1',
        type: 'paragraph',
        content: {
          text: 'Waking up to a spotless kitchen with a clear sink and clean kettle is the highest form of self-care. It changes your mental cadence before your morning coffee even brews.'
        }
      }
    ]
  },
  {
    id: 'post-13',
    title: 'Low-Light Houseplants: 7 Sculptural Botanicals That Thrive Anywhere',
    slug: 'low-light-houseplants-sculptural-botanicals',
    excerpt: 'From architectural ZZ plants to velvety Marantas, elevate dark corners and hallway niches with air-purifying, low-maintenance greenery.',
    categoryId: 'gardening',
    tags: ['Indoor Plants', 'Botanicals', 'Plant Styling', 'Low Light'],
    author: AUTHORS[2], // Sophia Lin
    publishedAt: '2026-08-30T09:00:00Z',
    updatedAt: '2026-08-30T09:00:00Z',
    readingTimeMinutes: 5,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 3180,
    savesCount: 940,
    featuredImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Sculptural potted foliage styled in handmade terracotta urns on a travertine bench.',
    imageAlt: 'Indoor plants in ceramic pots styled on wooden table',
    seo: {
      seoTitle: 'Low-Light Houseplants: 7 Sculptural Varieties for Modern Homes',
      metaDescription: 'Discover the best resilient, architectural houseplants for low-light rooms and dark apartment corners.',
      focusKeyword: 'low light indoor plants',
      canonicalUrl: 'https://thedecordiary.store/blog/low-light-houseplants-sculptural-botanicals',
      ogImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p13-1',
        type: 'paragraph',
        content: {
          text: 'Plants are the living sculptural art of interior design. Choosing varieties that naturally thrive under the forest canopy ensures they stay verdant and lush even in north-facing spaces.'
        }
      }
    ]
  },
  {
    id: 'post-14',
    title: 'Wabi-Sabi Dining: Creating an Earthy Table Setting with Raw Clay & Linen',
    slug: 'wabi-sabi-dining-earthy-table-setting',
    excerpt: 'Elevate dinner gatherings with unpolished pottery, hand-torn unbleached linen napkins, beeswax tapers, and wild olive branches.',
    categoryId: 'kitchen',
    tags: ['Dining Room', 'Wabi-Sabi', 'Table Styling', 'Ceramics'],
    author: AUTHORS[0], // Sam Sterling
    publishedAt: '2026-08-31T14:00:00Z',
    updatedAt: '2026-08-31T14:00:00Z',
    readingTimeMinutes: 6,
    status: 'published',
    isFeatured: false,
    isPopular: true,
    viewsCount: 2650,
    savesCount: 810,
    featuredImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Handcrafted stoneware plates layered with natural linen runner and ambient brass candleholders.',
    imageAlt: 'Artisan dining table set with stoneware plates and linen napkins',
    seo: {
      seoTitle: 'Wabi-Sabi Table Setting: Earthy Dining Guide 2026',
      metaDescription: 'Master the art of organic, welcoming tablescapes with raw ceramics, natural linens, and soft candle glow.',
      focusKeyword: 'wabi sabi table setting',
      canonicalUrl: 'https://thedecordiary.store/blog/wabi-sabi-dining-earthy-table-setting',
      ogImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p14-1',
        type: 'paragraph',
        content: {
          text: 'True luxury at the dining table is not about stiff formality; it is about tactile honesty. The subtle thumbprint on a potter’s mug and the gentle wrinkles in pure flax linen invite guests to unwind.'
        }
      }
    ]
  },
  {
    id: 'post-15',
    title: 'Small Bedroom Magic: How Floating Nightstands & Sconces Double Your Room',
    slug: 'small-bedroom-floating-nightstands-sconces',
    excerpt: 'Freeing up floor space is the fundamental optical trick for compact sanctuaries. Here is how to install and style wall-mounted bedside essentials.',
    categoryId: 'decor',
    tags: ['Bedroom Design', 'Small Spaces', 'Warm Minimalism', 'Lighting'],
    author: AUTHORS[1], // Elena Vance
    publishedAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    readingTimeMinutes: 5,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 3820,
    savesCount: 1190,
    featuredImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'A cozy minimalist bedroom with warm walnut floating drawer and plug-in brass swing-arm lamp.',
    imageAlt: 'Small modern bedroom with floating nightstand and brass wall sconce',
    seo: {
      seoTitle: 'Small Bedroom Ideas: Floating Nightstands & Wall Sconces',
      metaDescription: 'Maximize every square foot in your bedroom with wall-mounted bedside tables, warm sconces, and neutral bed linen.',
      focusKeyword: 'small bedroom design floating nightstand',
      canonicalUrl: 'https://thedecordiary.store/blog/small-bedroom-floating-nightstands-sconces',
      ogImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p15-1',
        type: 'paragraph',
        content: {
          text: 'The human eye measures the size of a bedroom by how much continuous flooring is visible. By lifting nightstands and lighting off the ground, the room instantly feels airy and expansive.'
        }
      }
    ]
  },
  {
    id: 'post-16',
    title: 'Weekend DIY: Board and Batten Accent Wall with Earthy Sage Olive Paint',
    slug: 'diy-board-and-batten-accent-wall-olive-paint',
    excerpt: 'Detailed measurement blueprint, miter saw guide, and caulk tips to craft architectural wall paneling in just 48 hours.',
    categoryId: 'improvement',
    tags: ['DIY Wall Paneling', 'Board and Batten', 'Paint Transformation', 'Home Improvement'],
    author: AUTHORS[3], // Julian Davies
    publishedAt: '2026-09-02T13:00:00Z',
    updatedAt: '2026-09-02T13:00:00Z',
    readingTimeMinutes: 8,
    status: 'published',
    isFeatured: false,
    isPopular: true,
    viewsCount: 4120,
    savesCount: 1420,
    featuredImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Custom craftsman style board and batten paneling painted in matte olive green with brass switch plates.',
    imageAlt: 'DIY board and batten feature wall in olive green with wooden bench',
    seo: {
      seoTitle: 'How to Build a Board and Batten Wall: Easy Weekend DIY',
      metaDescription: 'Step-by-step DIY guide to installing board and batten wall paneling on any budget.',
      focusKeyword: 'diy board and batten wall',
      canonicalUrl: 'https://thedecordiary.store/blog/diy-board-and-batten-accent-wall-olive-paint',
      ogImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p16-1',
        type: 'paragraph',
        content: {
          text: 'Flat drywall often lacks character. Adding grid or vertical batten moldings immediately brings architectural weight and timeless heritage into newer builder-grade homes.'
        }
      }
    ]
  },
  {
    id: 'post-17',
    title: 'The Art of Slow Living: Morning Lighting Rituals & Natural Scent Curation',
    slug: 'art-of-slow-living-morning-lighting-scent',
    excerpt: 'Ditch harsh blue screens and aggressive alarms. Cultivate stillness through sunrise amber bulbs, hinoki wood diffuser notes, and mindful tea.',
    categoryId: 'lifestyle',
    tags: ['Slow Living', 'Morning Rituals', 'Aromatherapy', 'Wellness'],
    author: AUTHORS[2], // Sophia Lin
    publishedAt: '2026-09-03T07:30:00Z',
    updatedAt: '2026-09-03T07:30:00Z',
    readingTimeMinutes: 5,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 3590,
    savesCount: 970,
    featuredImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'A quiet morning tea corner with steaming ceramic cup, natural linen throw, and soft dawn sunlight.',
    imageAlt: 'Slow morning scene with ceramic tea cup, book, and linen blanket',
    seo: {
      seoTitle: 'Slow Living: Morning Lighting Rituals & Home Scenting',
      metaDescription: 'How to design peaceful, unhurried morning routines with warm light and botanical aromatics.',
      focusKeyword: 'slow living morning routine',
      canonicalUrl: 'https://thedecordiary.store/blog/art-of-slow-living-morning-lighting-scent',
      ogImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p17-1',
        type: 'paragraph',
        content: {
          text: 'How you begin your morning within your four walls sets the emotional tone for everything that follows. Soft indirect lighting and grounding botanical scents anchor your nervous system.'
        }
      }
    ]
  },
  {
    id: 'post-18',
    title: 'Deep Pantry Makeover: Transparent Glass Jars, Bamboo Turntables & Custom Labels',
    slug: 'deep-pantry-makeover-glass-jars-bamboo',
    excerpt: 'Convert deep, dark pantry cupboards into a chef-worthy apothecary with tiered risers, lazy susans, and airtight uniform containers.',
    categoryId: 'organization',
    tags: ['Pantry Organization', 'Kitchen Styling', 'Zero Waste', 'Storage Hacks'],
    author: AUTHORS[0], // Sam Sterling
    publishedAt: '2026-09-04T11:00:00Z',
    updatedAt: '2026-09-04T11:00:00Z',
    readingTimeMinutes: 6,
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 4890,
    savesCount: 1650,
    featuredImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80',
    imageCaption: 'Uniform fluted glass canisters filled with grains and spices on natural bamboo turntable trays.',
    imageAlt: 'A beautifully organized pantry with glass jars and wooden shelving',
    seo: {
      seoTitle: 'Deep Pantry Organization Ideas: Glass Jars & Lazy Susans',
      metaDescription: 'Eliminate pantry chaos and food waste with transparent glass canisters, lazy susans, and uniform labeling.',
      focusKeyword: 'pantry makeover organization ideas',
      canonicalUrl: 'https://thedecordiary.store/blog/deep-pantry-makeover-glass-jars-bamboo',
      ogImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80',
    },
    contentBlocks: [
      {
        id: 'p18-1',
        type: 'paragraph',
        content: {
          text: 'Deep pantry shelves are notoriously difficult to navigate. When items disappear into shadowy back corners, ingredients expire and shopping lists duplicate. Transparent groupings solve this forever.'
        }
      }
    ]
  }
];

export const INITIAL_NAVIGATION: NavigationItem[] = [
  { id: 'nav-1', label: 'Home', url: '/', order: 1, isEnabled: true },
  { id: 'nav-2', label: 'Decor', url: '/category/home-decor', order: 2, isEnabled: true },
  { id: 'nav-3', label: 'DIY', url: '/category/diy', order: 3, isEnabled: true },
  { id: 'nav-4', label: 'Organization', url: '/category/organization', order: 4, isEnabled: true },
  { id: 'nav-5', label: 'Kitchen', url: '/category/kitchen', order: 5, isEnabled: true },
  { id: 'nav-6', label: 'Cleaning', url: '/category/cleaning', order: 6, isEnabled: true },
  { id: 'nav-7', label: 'Gardening', url: '/category/gardening', order: 7, isEnabled: true },
  { id: 'nav-8', label: 'Lifestyle', url: '/category/lifestyle', order: 8, isEnabled: true },
  { id: 'nav-9', label: 'All Articles', url: '/blog', order: 9, isEnabled: true },
];

export const INITIAL_HOMEPAGE_CONFIG: HomepageConfig = {
  hero: {
    badge: 'Curated Living & Modern Interiors',
    title: 'Creating Spaces of Quiet Beauty, Comfort &',
    highlightWord: 'Intentional Living',
    subtitle: 'Step inside our editorial journal for mindful interior styling, transformative DIY guides, pantry organization rituals, and slow-living inspirations.',
    ctaText: 'Explore Latest Articles',
    ctaLink: '/blog',
    secondaryCtaText: 'Browse Categories',
    secondaryCtaLink: '#categories',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    imageCaption: 'Featured: The Art of Warm Minimalism in Modern Architecture'
  },
  sectionTitles: {
    featuredTitle: 'Featured Editorial Stories',
    featuredSubtitle: 'Handpicked transformations, design essays, and masterclasses from our editorial team.',
    latestTitle: 'Latest From The Journal',
    latestSubtitle: 'Fresh ideas, seasonal recipes, and step-by-step guides updated every week.',
    categoriesTitle: 'Browse by Lifestyle Category',
    categoriesSubtitle: 'Explore tailored inspiration for every corner and ritual of your home sanctuary.',
    pinterestTitle: 'Save & Pin For Later Inspiration',
    pinterestSubtitle: 'Join 150,000+ home lovers discovering daily moodboards on our verified Pinterest profile.',
    curatedTitle: 'The Curated Decor Spotlight',
    curatedSubtitle: 'Our top recommendation for slow living and timeless design this season.'
  },
  sectionsOrder: [
    { id: 'hero', name: 'Editorial Hero Banner', enabled: true },
    { id: 'trending_bar', name: 'Trending Topics Ticker', enabled: true },
    { id: 'featured', name: 'Featured Stories Grid', enabled: true },
    { id: 'categories', name: 'Popular Category Tiles', enabled: true },
    { id: 'curated_spotlight', name: 'Curated Reading Spotlight', enabled: true },
    { id: 'latest', name: 'Latest Articles Feed', enabled: true },
    { id: 'pinterest_grid', name: 'Pinterest Moodboard & Saves', enabled: true },
    { id: 'newsletter', name: 'Newsletter Subscription Box', enabled: true },
  ],
  pinterestBanner: {
    title: 'Pin Your Dream Home Moodboard',
    description: 'Save these curated color palettes, pantry systems, and DIY plans directly to your Pinterest boards with a single click.',
    handle: '@thedecordiary1214',
    profileUrl: 'https://www.pinterest.com/thedecordiary1214/',
    followersCount: '154k Pins Saved Monthly',
    boardImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    ]
  }
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'The Decor Diary',
  siteTagline: 'Your Home Decor Destination',
  siteDescription: 'An online home decor store bringing you the best in aesthetic room accessories, minimalist furniture, and trending wall art. Elevate your space today.',
  logoText: 'THE DECOR DIARY',
  logoSubtext: 'ONLINE HOME DECOR STORE',
  footerAbout: 'The Decor Diary is your destination for curated home decor, modern aesthetic accessories, and elegant minimalist furniture.',
  copyrightNotice: '© 2026 The Decor Diary. All rights reserved.',
  contactEmail: 'thedecordiarystore@gmail.com',
  contactPhone: '+1 (555) 382-9100',
  contactAddress: 'New York, NY',
  siteUrl: 'https://thedecordiary.store/',
  socialLinks: {
    pinterest: 'https://www.pinterest.com/thedecordiary1214/',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
    youtube: 'https://youtube.com',
    twitter: 'https://twitter.com',
  },
  googleAnalyticsId: 'G-DECOR2026',
  googleAdsenseId: 'ca-pub-2818671808304288',
  headerAnnouncement: {
    enabled: true,
    text: '✨ Spring Sanctuary Issue Now Live: Read our New Arrivals',
    linkText: 'Read Now',
    linkUrl: '/blog'
  }
};

export const INITIAL_MEDIA_LIBRARY: MediaItem[] = [
  {
    id: 'med-1',
    name: 'Warm Minimalist Living Room',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    alt: 'Warm minimalist living room with neutral sofa and olive tree',
    category: 'Decor',
    createdAt: '2026-08-01'
  },
  {
    id: 'med-2',
    name: 'Walk-In Butler Pantry with Baskets',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80',
    alt: 'Organized walk-in pantry with wicker baskets and glass jars',
    category: 'Organization',
    createdAt: '2026-08-02'
  },
  {
    id: 'med-3',
    name: 'Textured Limewash Bedroom Wall',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Textured beige limewash wall with natural linen bed',
    category: 'DIY',
    createdAt: '2026-08-03'
  },
  {
    id: 'med-4',
    name: 'Rustic Kitchen Counter & Coffee',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Artisan kitchen counter with coffee and sourdough',
    category: 'Kitchen',
    createdAt: '2026-08-04'
  },
  {
    id: 'med-5',
    name: 'Amber Glass Cleaning Bottles',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1600&q=80',
    alt: 'Amber spray bottles and wooden scrub brushes',
    category: 'Cleaning',
    createdAt: '2026-08-05'
  },
  {
    id: 'med-6',
    name: 'Lush Monstera & Indoor Plants',
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80',
    alt: 'Green indoor houseplants on wooden display shelf',
    category: 'Gardening',
    createdAt: '2026-08-06'
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: 'sub-1', email: 'claire.designs@gmail.com', subscribedAt: '2026-08-10T12:00:00Z', source: 'Homepage Hero', status: 'active' },
  { id: 'sub-2', email: 'jessica.home@outlook.com', subscribedAt: '2026-08-12T15:30:00Z', source: 'Article Footer', status: 'active' },
  { id: 'sub-3', email: 'oliver.arch@yahoo.com', subscribedAt: '2026-08-15T09:10:00Z', source: 'Pantry Guide', status: 'active' },
  { id: 'sub-4', email: 'hannah.slowlife@gmail.com', subscribedAt: '2026-08-18T18:45:00Z', source: 'Pinterest Referral', status: 'active' },
];
