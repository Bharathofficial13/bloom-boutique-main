// ============================================
// BACKEND API - Node.js + Express
// ============================================
// File: server.js or routes/products.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "cloudinary";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// DATABASE SCHEMAS
// ============================================

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    price: { type: String, required: true },
    category: { type: String, required: true, index: true },
    description: String,
    didYouKnow: String,
    image: { 
      url: String,
      cloudinaryId: String 
    },
    stock: { type: Number, default: 100 },
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

// Create indexes for performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  icon: String,
  description: String,
  productCount: { type: Number, default: 0 },
});

const Category = mongoose.model("Category", categorySchema);

// ============================================
// API ENDPOINTS
// ============================================

// 1. GET ALL PRODUCTS (WITH PAGINATION & FILTERING)
app.get("/api/products", async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search,
      sort = "newest" 
    } = req.query;

    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    let sortOrder = {};
    if (sort === "newest") sortOrder = { createdAt: -1 };
    if (sort === "oldest") sortOrder = { createdAt: 1 };
    if (sort === "price_low") sortOrder = { price: 1 };
    if (sort === "price_high") sortOrder = { price: -1 };
    if (sort === "popular") sortOrder = { rating: -1 };

    // Execute query
    const products = await Product
      .find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // .lean() for faster queries when not modifying

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET SINGLE PRODUCT
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET ALL CATEGORIES
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ADMIN ENDPOINTS (PROTECTED WITH AUTH)
// ============================================

// Middleware: Check admin authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  next();
};

// 4. CREATE PRODUCT (Admin)
app.post("/api/admin/products", authenticate, async (req, res) => {
  try {
    const { name, price, category, description, didYouKnow, image, stock } = req.body;

    // In your server.js POST /api/admin/products
const product = new Product({
  name,
  price,
  category,
  description,
  didYouKnow,
  image: {
    url: typeof image === 'string' ? image : image.url, // Handle string or object
    cloudinaryId: image.cloudinaryId || "", 
  },
  stock,
});
    await product.save();

    // Update category product count
    await Category.findOneAndUpdate(
      { id: category },
      { $inc: { productCount: 1 } }
    );

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. UPDATE PRODUCT (Admin)
app.put("/api/admin/products/:id", authenticate, async (req, res) => {
  try {
    const { name, price, category, description, didYouKnow, image, stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description, didYouKnow, image, stock },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. DELETE PRODUCT (Admin)
app.delete("/api/admin/products/:id", authenticate, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    // Update category product count
    await Category.findOneAndUpdate(
      { id: product.category },
      { $inc: { productCount: -1 } }
    );

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. IMAGE UPLOAD (Admin)
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/admin/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No file provided" });

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "glam-grip" },
      (error, result) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        res.json({ 
          success: true, 
          image: {
            url: result.secure_url,
            cloudinaryId: result.public_id,
          }
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// SEARCH & ANALYTICS ENDPOINTS
// ============================================

// 8. SEARCH PRODUCTS
app.get("/api/search", async (req, res) => {
  try {
    const { query, category, limit = 10 } = req.query;

    let searchQuery = {};
    if (query) {
      searchQuery.$text = { $search: query };
    }
    if (category) {
      searchQuery.category = category;
    }

    const results = await Product
      .find(searchQuery)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. GET PRODUCT STATISTICS (Admin)
app.get("/api/admin/stats", authenticate, async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const byCategory = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const avgRating = await Product.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts: total,
        byCategory,
        avgRating: avgRating[0]?.avgRating || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// ---------------------------------------------------------
// CATEGORY ADMIN ROUTES
// ---------------------------------------------------------

// CREATE a new category
app.post("/api/admin/categories", authenticate, async (req, res) => {
  try {
    const { id, name, icon, description } = req.body;
    
    // Check if category ID already exists
    const existing = await Category.findOne({ id });
    if (existing) return res.status(400).json({ success: false, error: "Category ID already exists" });

    const category = new Category({ id, name, icon, description });
    await category.save();
    
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a category
app.delete("/api/admin/categories/:id", authenticate, async (req, res) => {
  try {
    // Note: req.params.id refers to the MongoDB _id
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE a category
app.put("/api/admin/categories/:id", authenticate, async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, description },
      { new: true }
    );
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("Database connection failed:", err));

export default app;

// ============================================
// ENVIRONMENT VARIABLES (.env)
// ============================================
/*
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/glamgrip
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_TOKEN=your_secure_admin_token
PORT=5000
*/

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Get first page of products
GET /api/products?page=1&limit=20

// Get hair clips
GET /api/products?category=hairclips&page=1

// Search products
GET /api/products?search=clip&limit=20

// Search with filters
GET /api/products?search=clip&category=hairclips&sort=newest

// Get specific product
GET /api/products/product-id

// Get all categories
GET /api/categories

// Admin: Add product
POST /api/admin/products
Body: { name, price, category, description, didYouKnow, image, stock }

// Admin: Update product
PUT /api/admin/products/product-id
Body: { ...updated fields }

// Admin: Delete product
DELETE /api/admin/products/product-id

// Admin: Upload image
POST /api/admin/upload
Body: FormData with 'file' field

// Search with text search
GET /api/search?query=clip&category=hairclips&limit=10

// Get statistics
GET /api/admin/stats
*/