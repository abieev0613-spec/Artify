const categoryData = {
  Paintings: [
    'Sunset Reverie',
    'Ocean Muse',
    'Monsoon Window',
    'Lotus Calm',
    'Abstract Bloom',
    'Golden Fields',
    'Indigo Dream',
    'Terracotta Sky',
    'Forest Whisper',
    'Moonlit Lake'
  ],

  Crafts: [
    'Clay Bloom Vase',
    'Macrame Wall Art',
    'Paper Quilling Frame',
    'Wooden Keepsake',
    'Jute Basket',
    'Resin Tray',
    'Coconut Shell Art',
    'Terracotta Diyas',
    'Handpainted Box',
    'Boho Dreamcatcher'
  ],

  Crochet: [
    'Crochet Daisy Bag',
    'Soft Teddy',
    'Rainbow Coaster',
    'Cloud Cushion',
    'Berry Bucket Hat',
    'Tulip Pouch',
    'Granny Square Tote',
    'Mini Bunny',
    'Crochet Plant Hanger',
    'Sunflower Mat'
  ],

  'Home Decor': [
    'Rattan Lamp',
    'Boho Mirror',
    'Candle Holder',
    'Ceramic Planter',
    'Woven Basket',
    'Wall Hanging',
    'Wooden Shelf',
    'Scented Pot',
    'Table Sculpture',
    'Photo Hoop'
  ],

  Jewellery: [
    'Pearl Drop',
    'Terracotta Necklace',
    'Beaded Bracelet',
    'Moon Studs',
    'Thread Jhumka',
    'Shell Pendant',
    'Oxidised Ring',
    'Floral Anklet',
    'Resin Earrings',
    'Daisy Chain'
  ],

  Bouquets: [
    'Rose Story',
    'Lavender Haze',
    'Sunflower Burst',
    'Pastel Garden',
    'Dried Meadow',
    'Lily Love',
    'Mini Wildflower',
    'Peach Bloom',
    'Purple Dream',
    'Rustic Bouquet'
  ]
};

const icons = {
  Paintings: '🎨',
  Crafts: '🪵',
  Crochet: '🧶',
  'Home Decor': '🏡',
  Jewellery: '💎',
  Bouquets: '💐'
};

const palettes = {
  Paintings: 'paint',
  Crafts: 'craft',
  Crochet: 'crochet',
  'Home Decor': 'decor',
  Jewellery: 'jewel',
  Bouquets: 'bouquet'
};

const products = [];

let nextId = 1;

Object.entries(categoryData).forEach(([category, names]) =>
  names.forEach((name, index) => {
    products.push({
      id: nextId++,
      name,
      category,
      icon: icons[category],
      palette: palettes[category],
      price:
        449 +
        index * 137 +
        (category === 'Jewellery' ? 180 : 0),
      rating: (
        4.1 +
        ((index * 7) % 9) / 10
      ).toFixed(1),
      description: `A thoughtfully handmade ${category.toLowerCase()} piece designed to bring warmth, character and a personal touch to your space.`,
      image: `${String(nextId - 1)
        .padStart(2, '0')}-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}.jpg`
    });
  })
);
