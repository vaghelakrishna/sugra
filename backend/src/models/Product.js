const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    price: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, trim: true },
  },
  { _id: true }
);

const locationInventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    description: { type: String, trim: true, maxlength: 5000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    unitPrice: { type: Number, min: 0 },
    costPerItem: { type: Number, min: 0 },
    chargeTax: { type: Boolean, default: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    barcode: { type: String, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    inventoryByLocation: [locationInventorySchema],
    inventoryTracked: { type: Boolean, default: true },
    continueSelling: { type: Boolean, default: false },
    images: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true, lowercase: true }],
    material: { type: String, trim: true },
    productType: { type: String, trim: true },
    channels: [{ type: String, trim: true }],
    catalogs: [{ type: String, trim: true }],
    shipping: {
      physicalProduct: { type: Boolean, default: true },
      packageName: { type: String, trim: true },
      weight: { type: Number, min: 0 },
      weightUnit: { type: String, enum: ['kg', 'g', 'lb', 'oz'], default: 'kg' },
      countryOfOrigin: { type: String, trim: true },
      hsCode: { type: String, trim: true },
    },
    purchaseOptions: {
      subscriptions: { type: Boolean, default: false },
      preOrder: { type: Boolean, default: false },
    },
    metafields: {
      careInstructions: { type: String, trim: true },
      material: { type: String, trim: true },
      size: { type: String, trim: true },
      snowboardLength: { type: String, trim: true },
      snowboardBindingMount: { type: String, trim: true },
      disclosures: { type: String, trim: true },
    },
    seo: {
      title: { type: String, trim: true, maxlength: 70 },
      description: { type: String, trim: true, maxlength: 320 },
    },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
    variants: [variantSchema],
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
