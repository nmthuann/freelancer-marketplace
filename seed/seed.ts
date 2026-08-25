/**
 * Seed dữ liệu cho Freelancer Marketplace (kiến trúc microservice).
 *
 * Mỗi service có DB Mongo RIÊNG → không FK/populate được giữa các service.
 * Vì vậy mọi tham chiếu cross-service (buyerId, sellerId, postId, orderId...)
 * đều lưu dưới dạng ID string. Các ID được sinh trước rồi tái sử dụng nhất quán
 * qua cả 3 DB để dữ liệu "khớp" nhau.
 *
 * Chạy:  npm run seed
 * (đọc URI/DB name từ .env, có thể override bằng biến môi trường)
 */
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const URI = process.env.SEED_MONGO_URI || 'mongodb://localhost:27017';
const USER_DB = process.env.USER_MONGO_DB_NAME || 'fm_user_db';
const POST_DB = process.env.POST_MONGO_DB_NAME || 'fm_post_db';
const ORDER_DB = process.env.ORDER_MONGO_DB_NAME || 'fm_order_db';

const oid = () => new mongoose.Types.ObjectId();
const now = new Date();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86_400_000);

async function main() {
  const password = await bcrypt.hash('password123', 12);

  // ─── Sinh ID trước để tái sử dụng cross-service ───
  const adminId = oid();
  const aliceId = oid(); // seller
  const bobId = oid(); // seller
  const carolId = oid(); // buyer
  const daveId = oid(); // buyer

  const catTechId = oid();
  const catDesignId = oid();
  const catMktId = oid();

  const gigNestId = oid(); // alice
  const gigApiId = oid(); // alice
  const gigLogoId = oid(); // bob
  const gigLandingId = oid(); // bob (draft)

  const orderCompletedId = oid();
  const orderDesignDoneId = oid();
  const orderInProgressId = oid();
  const orderPendingId = oid();

  const review1Id = oid();
  const review2Id = oid();

  // ══════════════════════════════════════════════
  // USER SERVICE DB  (fm_user_db)
  // ══════════════════════════════════════════════
  const userConn = await mongoose
    .createConnection(URI, { dbName: USER_DB })
    .asPromise();

  await userConn.collection('users').deleteMany({});
  await userConn.collection('profiles').deleteMany({});

  await userConn.collection('users').insertMany([
    mkUser(adminId, 'admin@fm.dev', 'admin', 'Site Admin', 'admin', password),
    mkUser(aliceId, 'alice@fm.dev', 'alice_dev', 'Alice Nguyen', 'seller', password, 'Vietnam'),
    mkUser(bobId, 'bob@fm.dev', 'bob_design', 'Bob Tran', 'seller', password, 'Singapore'),
    mkUser(carolId, 'carol@fm.dev', 'carol_buyer', 'Carol Le', 'buyer', password, 'USA'),
    mkUser(daveId, 'dave@fm.dev', 'dave_buyer', 'Dave Pham', 'buyer', password, 'Australia'),
  ]);

  await userConn.collection('profiles').insertMany([
    {
      _id: oid(),
      user: aliceId, // ref cùng DB → ObjectId hợp lệ
      title: 'Senior Full-stack Developer',
      bio: 'NestJS & React specialist, 6+ years building web apps.',
      description: 'I build scalable backends and clean frontends.',
      skills: ['NestJS', 'Node.js', 'React', 'MongoDB', 'TypeScript'],
      languages: ['English', 'Vietnamese'],
      hourlyRate: 45,
      stats: { averageRating: 5, totalReviews: 1, completedOrders: 1 },
      level: 'Experienced Seller',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: oid(),
      user: bobId,
      title: 'Brand & Logo Designer',
      bio: 'Minimalist logo and brand identity designer.',
      description: 'Clean, memorable logos that tell your story.',
      skills: ['Logo Design', 'Branding', 'Illustrator', 'Figma'],
      languages: ['English'],
      hourlyRate: 35,
      stats: { averageRating: 4, totalReviews: 1, completedOrders: 1 },
      level: 'New Seller',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // ══════════════════════════════════════════════
  // POST SERVICE DB  (fm_post_db)
  // ══════════════════════════════════════════════
  const postConn = await mongoose
    .createConnection(URI, { dbName: POST_DB })
    .asPromise();

  await postConn.collection('categories').deleteMany({});
  await postConn.collection('posts').deleteMany({});
  await postConn.collection('reviews').deleteMany({});

  await postConn.collection('categories').insertMany([
    mkCategory(catTechId, 'Programming & Tech', 'programming-tech', [
      'Web Development',
      'Mobile Apps',
      'API & Backend',
    ]),
    mkCategory(catDesignId, 'Graphics & Design', 'graphics-design', [
      'Logo Design',
      'Landing Page',
      'Brand Identity',
    ]),
    mkCategory(catMktId, 'Digital Marketing', 'digital-marketing', [
      'SEO',
      'Social Media',
    ]),
  ]);

  await postConn.collection('posts').insertMany([
    {
      _id: gigNestId,
      title: 'I will build a full-stack web app with NestJS and React',
      description:
        'Production-ready full-stack app: REST API, auth, database, and a React frontend.',
      sellerId: aliceId.toString(), // cross-service ref (string)
      category: 'Programming & Tech',
      subCategory: 'Web Development',
      tags: ['nestjs', 'react', 'fullstack', 'api', 'mongodb'],
      pricingType: 'tiered',
      packages: [
        mkPkg('Basic', 'Simple CRUD app, 1 page', 150, 5, 1, ['1 page', 'REST API']),
        mkPkg('Standard', 'Multi-page app + auth', 400, 10, 2, ['Up to 5 pages', 'Auth', 'Database']),
        mkPkg('Premium', 'Full app + admin panel', 800, 20, 3, ['Unlimited pages', 'Admin panel', 'Deployment']),
      ],
      gallery: [],
      status: 'active',
      isFeatured: true,
      stats: { views: 320, orders: 4, completedOrders: 1, averageRating: 5, totalReviews: 1, favorites: 12 },
      languages: ['English', 'Vietnamese'],
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: gigApiId,
      title: 'I will create a REST API with Node.js',
      description: 'Clean, documented REST API with tests.',
      sellerId: aliceId.toString(),
      category: 'Programming & Tech',
      subCategory: 'API & Backend',
      tags: ['nodejs', 'api', 'express'],
      pricingType: 'single',
      packages: [
        mkPkg('Standard', 'REST API up to 10 endpoints', 200, 7, 2, ['10 endpoints', 'Swagger docs', 'Unit tests']),
      ],
      gallery: [],
      status: 'active',
      isFeatured: false,
      stats: { views: 88, orders: 1, completedOrders: 0, averageRating: 0, totalReviews: 0, favorites: 3 },
      languages: ['English'],
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: gigLogoId,
      title: 'I will design a modern minimalist logo',
      description: 'Unique, memorable logo with source files.',
      sellerId: bobId.toString(),
      category: 'Graphics & Design',
      subCategory: 'Logo Design',
      tags: ['logo', 'branding', 'minimalist'],
      pricingType: 'tiered',
      packages: [
        mkPkg('Basic', '1 concept, 2 revisions', 50, 3, 2, ['1 concept', 'PNG file']),
        mkPkg('Standard', '3 concepts, source files', 120, 5, 4, ['3 concepts', 'Source files', 'Social kit']),
        mkPkg('Premium', 'Full brand identity', 300, 7, -1, ['Unlimited concepts', 'Brand guide', 'Stationery']),
      ],
      gallery: [],
      status: 'active',
      isFeatured: true,
      stats: { views: 210, orders: 2, completedOrders: 1, averageRating: 4, totalReviews: 1, favorites: 25 },
      languages: ['English'],
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: gigLandingId,
      title: 'I will design a high-converting landing page',
      description: 'Figma landing page design (draft, chưa submit duyệt).',
      sellerId: bobId.toString(),
      category: 'Graphics & Design',
      subCategory: 'Landing Page',
      tags: ['landing', 'figma', 'ui'],
      pricingType: 'single',
      packages: [
        mkPkg('Standard', '1 landing page in Figma', 90, 4, 2, ['Figma file', '2 revisions']),
      ],
      gallery: [],
      status: 'draft',
      isFeatured: false,
      stats: { views: 0, orders: 0, completedOrders: 0, averageRating: 0, totalReviews: 0, favorites: 0 },
      languages: ['English'],
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await postConn.collection('reviews').insertMany([
    {
      _id: review1Id,
      postId: gigNestId.toString(),
      orderId: orderCompletedId.toString(),
      buyerId: carolId.toString(),
      sellerId: aliceId.toString(),
      rating: 5,
      comment: 'Amazing work, delivered ahead of schedule. Highly recommend!',
      sellerReply: 'Thank you Carol, was a pleasure!',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: review2Id,
      postId: gigLogoId.toString(),
      orderId: orderDesignDoneId.toString(),
      buyerId: daveId.toString(),
      sellerId: bobId.toString(),
      rating: 4,
      comment: 'Good logo, minor revisions needed but overall happy.',
      sellerReply: null,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // ══════════════════════════════════════════════
  // ORDER SERVICE DB  (fm_order_db)
  // ══════════════════════════════════════════════
  const orderConn = await mongoose
    .createConnection(URI, { dbName: ORDER_DB })
    .asPromise();

  await orderConn.collection('orders').deleteMany({});

  await orderConn.collection('orders').insertMany([
    {
      _id: orderCompletedId,
      orderNumber: 'FM-20260820-0001',
      postId: gigNestId.toString(),
      buyerId: carolId.toString(),
      sellerId: aliceId.toString(),
      packageName: 'Standard',
      package: mkPkg('Standard', 'Multi-page app + auth', 400, 10, 2, ['Up to 5 pages', 'Auth', 'Database']),
      amount: 400,
      quantity: 1,
      status: 'completed',
      requirements: 'A booking web app with login and admin dashboard.',
      deliveries: [
        { message: 'Here is the final build + repo link.', attachments: [], deliveredAt: daysFromNow(-2) },
      ],
      revisionsUsed: 1,
      dueAt: daysFromNow(-3),
      completedAt: daysFromNow(-1),
      cancelReason: null,
      createdAt: daysFromNow(-12),
      updatedAt: daysFromNow(-1),
    },
    {
      _id: orderDesignDoneId,
      orderNumber: 'FM-20260821-0002',
      postId: gigLogoId.toString(),
      buyerId: daveId.toString(),
      sellerId: bobId.toString(),
      packageName: 'Basic',
      package: mkPkg('Basic', '1 concept, 2 revisions', 50, 3, 2, ['1 concept', 'PNG file']),
      amount: 50,
      quantity: 1,
      status: 'completed',
      requirements: 'Logo for a coffee shop named "Bean There".',
      deliveries: [
        { message: 'Final logo attached.', attachments: [], deliveredAt: daysFromNow(-4) },
      ],
      revisionsUsed: 2,
      dueAt: daysFromNow(-5),
      completedAt: daysFromNow(-3),
      cancelReason: null,
      createdAt: daysFromNow(-8),
      updatedAt: daysFromNow(-3),
    },
    {
      _id: orderInProgressId,
      orderNumber: 'FM-20260824-0003',
      postId: gigApiId.toString(),
      buyerId: carolId.toString(),
      sellerId: aliceId.toString(),
      packageName: 'Standard',
      package: mkPkg('Standard', 'REST API up to 10 endpoints', 200, 7, 2, ['10 endpoints', 'Swagger docs', 'Unit tests']),
      amount: 200,
      quantity: 1,
      status: 'in_progress',
      requirements: 'Inventory management API, 8 endpoints.',
      deliveries: [],
      revisionsUsed: 0,
      dueAt: daysFromNow(6),
      completedAt: null,
      cancelReason: null,
      createdAt: daysFromNow(-1),
      updatedAt: daysFromNow(-1),
    },
    {
      _id: orderPendingId,
      orderNumber: 'FM-20260825-0004',
      postId: gigNestId.toString(),
      buyerId: daveId.toString(),
      sellerId: aliceId.toString(),
      packageName: 'Premium',
      package: mkPkg('Premium', 'Full app + admin panel', 800, 20, 3, ['Unlimited pages', 'Admin panel', 'Deployment']),
      amount: 800,
      quantity: 1,
      status: 'pending_payment',
      requirements: 'Marketplace MVP with admin panel.',
      deliveries: [],
      revisionsUsed: 0,
      dueAt: null,
      completedAt: null,
      cancelReason: null,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // ─── Xong ───
  console.log('✅ Seed hoàn tất:');
  console.log(`   ${USER_DB}: 5 users, 2 profiles`);
  console.log(`   ${POST_DB}: 3 categories, 4 gigs, 2 reviews`);
  console.log(`   ${ORDER_DB}: 4 orders`);
  console.log('   Login thử: alice@fm.dev / carol@fm.dev ... mật khẩu: password123');

  await Promise.all([userConn.close(), postConn.close(), orderConn.close()]);
}

// ─── Helpers ───
function mkUser(
  _id: mongoose.Types.ObjectId,
  email: string,
  username: string,
  fullName: string,
  role: string,
  password: string,
  country = '',
) {
  return {
    _id,
    email,
    username,
    password,
    fullName,
    avatar: '',
    role,
    country,
    isActive: true,
    lastLoginAt: null,
    refreshToken: null,
    createdAt: now,
    updatedAt: now,
  };
}

function mkCategory(
  _id: mongoose.Types.ObjectId,
  name: string,
  slug: string,
  subCategories: string[],
) {
  return {
    _id,
    name,
    slug,
    subCategories,
    icon: '',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}

function mkPkg(
  name: string,
  description: string,
  price: number,
  deliveryDays: number,
  revisions: number,
  features: string[],
) {
  return { name, description, price, deliveryDays, revisions, features };
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed lỗi:', err);
    process.exit(1);
  });
