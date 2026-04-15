import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: 'Essence Mascara Lash Princess',
    description:
      'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
    category: 'beauty',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
  },
  {
    name: 'Eyeshadow Palette with Mirror',
    description:
      "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
    category: 'beauty',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp',
  },
  {
    name: 'Powder Canister',
    description:
      'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.',
    category: 'beauty',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp',
  },
  {
    name: 'Red Lipstick',
    description:
      'The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.',
    category: 'beauty',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp',
  },
  {
    name: 'Red Nail Polish',
    description:
      'The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.',
    category: 'beauty',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp',
  },
  {
    name: 'Calvin Klein CK One',
    description:
      "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
    category: 'fragrances',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp',
  },
  {
    name: 'Chanel Coco Noir Eau De',
    description:
      'Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.',
    category: 'fragrances',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp',
  },
  {
    name: "Dior J'adore",
    description:
      "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.",
    category: 'fragrances',
    imageUrl:
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
  },
  {
    name: 'Dolce Shine Eau de',
    description:
      "Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.",
    category: 'fragrances',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp',
  },
  {
    name: 'Gucci Bloom Eau de',
    description:
      "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.",
    category: 'fragrances',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp',
  },
  {
    name: 'Annibale Colombo Bed',
    description:
      'The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.',
    category: 'furniture',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp',
  },
  {
    name: 'Annibale Colombo Sofa',
    description:
      'The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.',
    category: 'furniture',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp',
  },
  {
    name: 'Bedside Table African Cherry',
    description:
      'The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.',
    category: 'furniture',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp',
  },
  {
    name: 'Knoll Saarinen Executive Conference Chair',
    description:
      'The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.',
    category: 'furniture',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp',
  },
  {
    name: 'Wooden Bathroom Sink With Mirror',
    description:
      'The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.',
    category: 'furniture',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp',
  },
];

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Products already seeded (${existing} found), skipping.`);
    return;
  }

  console.log('Seeding products...');
  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
