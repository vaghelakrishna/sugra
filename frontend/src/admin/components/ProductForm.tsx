import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, Product } from '../types'
import './ProductForm.css'
import './ProductExtras.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
type Props = { token: string; onClose: () => void; onCreated: () => void; product?: Product }
const Toggle = ({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) => <label className="switch-row"><span>{label}</span><input name={name} type="checkbox" defaultChecked={defaultChecked} /><i /></label>
const Field = ({ name, label, type = 'text', placeholder, defaultValue }: { name: string; label: string; type?: string; placeholder?: string; defaultValue?: string | number }) => <label className="field"><span>{label}</span><input name={name} type={type} min={type === 'number' ? '0' : undefined} placeholder={placeholder} defaultValue={defaultValue} /></label>

export default function ProductForm({ token, onClose, onCreated, product }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [media, setMedia] = useState<string[]>(product?.images || [])
  const [variants, setVariants] = useState((product?.variants || []).map(v => ({ name: v.name, sku: v.sku, price: String(v.price || ''), stock: String(v.stock || '') })) || [{ name: '', sku: '', price: '', stock: '' }])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { fetch(API + '/categories').then(r => r.json()).then(b => setCategories(b.data || [])).catch(() => { }) }, [])
  const addFiles = async (files: FileList | null) => {
    if (!files) return
    setUploading(true)
    const data = new FormData();[...files].forEach(file => data.append('media', file))
    try {
      const r = await fetch(API + '/products/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: data })
      const body = await r.json(); if (!r.ok) throw Error(body.message || 'Media upload failed')
      setMedia(old => [...old, ...body.data.map((item: { url: string }) => item.url)])
    } catch (e) { setError(e instanceof Error ? e.message : 'Media upload failed') } finally { setUploading(false) }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError('')
    const f = new FormData(e.currentTarget); const number = (key: string) => f.get(key) === '' ? undefined : Number(f.get(key))
    const payload = {
      title: f.get('title'), slug: String(f.get('title') || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), description: f.get('description'), category: f.get('category') || undefined,
      productType: f.get('productType'), status: f.get('status'), channels: f.getAll('channels'), catalogs: f.getAll('catalogs'),
      price: number('price') ?? 0, compareAtPrice: number('compareAtPrice'), unitPrice: number('unitPrice'), costPerItem: number('costPerItem'), chargeTax: f.get('chargeTax') === 'on',
      stock: number('stock') ?? 0, inventoryTracked: f.get('inventoryTracked') === 'on', continueSelling: f.get('continueSelling') === 'on', sku: f.get('sku'), barcode: f.get('barcode'),
      images: media, variants: variants.filter(v => v.name || v.sku).map(v => ({ ...v, price: Number(v.price) || 0, stock: Number(v.stock) || 0 })),
      inventoryByLocation: [{ name: 'My Custom Location', quantity: number('customLocation') ?? 0 }, { name: 'Shop location', quantity: number('shopLocation') ?? 0 }],
      shipping: { physicalProduct: f.get('physicalProduct') === 'on', packageName: f.get('packageName'), weight: number('weight'), weightUnit: f.get('weightUnit'), countryOfOrigin: f.get('countryOfOrigin'), hsCode: f.get('hsCode') },
      purchaseOptions: { subscriptions: f.get('subscriptions') === 'on', preOrder: f.get('preOrder') === 'on' },
      metafields: { careInstructions: f.get('careInstructions'), material: f.get('material'), size: f.get('size'), snowboardLength: f.get('snowboardLength'), snowboardBindingMount: f.get('snowboardBindingMount'), disclosures: f.get('disclosures') },
      seo: { title: f.get('seoTitle'), description: f.get('seoDescription') },
    }
    const r = await fetch(API + (product ? `/products/${product._id}` : '/products'), { method: product ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
    if (!r.ok) { const b = await r.json(); setError(b.message || `Could not ${product ? 'update' : 'create'} product`); return }
    onCreated()
  }
  return <form className="product-editor" onSubmit={submit}>
    <div className="editor-top"><div><span>PRODUCTS / {product ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</span><h2>{product ? 'Edit product' : 'Add product'}</h2></div><div><button type="button" onClick={onClose}>Cancel</button><button className="primary">{product ? 'Save changes' : 'Save product'}</button></div></div>
    {error && <p className="error">{error}</p>}
    <div className="editor-layout">
      <div className="editor-main">
        <section className="editor-card">
          <Field name="title" label="Title" placeholder="Short sleeve t-shirt" defaultValue={product?.title} />
          <div className="form-grid">
            <label className="field">
              <span>Category</span>
              <select name="category" defaultValue={product?.category?._id || ''}>
                <option value="">Choose a product category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <small>Determines tax rates and improves search and filters.</small>
            </label>
            <label className="field">
              <span>Status</span>
              <select name="status" defaultValue={product?.status || 'draft'}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
          <Field name="productType" label="Product type" defaultValue={product?.productType} />
          <label className="field">
            <span>Description</span>
            <div className="rich-toolbar">B &nbsp; I &nbsp; <u>U</u> &nbsp; • List &nbsp; ↗</div>
            <textarea name="description" placeholder="Write a product description…" defaultValue={product?.description} />
          </label>
        </section>
        <section className="editor-card">
          <h3>Media</h3>
          <label className="dropzone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); void addFiles(e.dataTransfer.files) }}>
            <input type="file" accept="image/*,video/*,.glb,.gltf,.usdz" multiple onChange={e => void addFiles(e.target.files)} />
            <b>{uploading ? 'Uploading media…' : 'Drop media to upload'}</b>
            <button type="button">Select existing</button>
            <small>Accepts images, videos, or 3D models</small>
          </label>
          {media.length > 0 && (
            <div className="media-list">
              {media.map((src, i) => (
                <div key={src}>
                  {/\.(mp4|webm|mov)$/i.test(src) ? <video src={API.replace('/api', '') + src} /> : <img src={API.replace('/api', '') + src} />}
                  <button type="button" onClick={() => setMedia(m => m.filter((_, x) => x !== i))}>×</button>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="editor-card">
          <h3>Pricing</h3>
          <div className="form-grid">
            <Field name="price" label="Price" type="number" defaultValue={product?.price} />
            <Field name="compareAtPrice" label="Compare-at price" type="number" defaultValue={product?.compareAtPrice} />
            <Field name="unitPrice" label="Unit price" type="number" defaultValue={product?.unitPrice} />
            <Field name="costPerItem" label="Cost per item" type="number" defaultValue={product?.costPerItem} />
          </div>
          <Toggle name="chargeTax" label="Charge tax on this product" defaultChecked={product?.chargeTax ?? true} />
        </section>
        <section className="editor-card">
          <h3>Inventory</h3>
          <Toggle name="inventoryTracked" label="Inventory tracked" defaultChecked={product?.inventoryTracked ?? true} />
          <div className="form-grid">
            <Field name="sku" label="SKU" defaultValue={product?.sku} />
            <Field name="barcode" label="Barcode" defaultValue={product?.barcode} />
          </div>
          <div className="location-line">
            <b>My Custom Location</b>
            <span>Quantity available</span>
            <input name="customLocation" type="number" min="0" defaultValue={product?.stock || 0} />
          </div>
          <div className="location-line">
            <b>Shop location</b>
            <span>Quantity available</span>
            <input name="shopLocation" type="number" min="0" defaultValue="0" />
          </div>
          <Toggle name="continueSelling" label="Sell when out of stock" defaultChecked={product?.continueSelling} />
        </section>
        <section className="editor-card">
          <h3>Shipping</h3>
          <Toggle name="physicalProduct" label="Physical product" defaultChecked={product?.shipping?.physicalProduct ?? true} />
          <div className="form-grid">
            <label className="field">
              <span>Package</span>
              <select name="packageName" defaultValue={product?.shipping?.packageName || 'Store default'}>
                <option>Store default</option>
                <option>Sample box - 22 × 13.7 × 4.2 cm, 0 kg</option>
              </select>
            </label>
            <Field name="weight" label="Product weight" type="number" defaultValue={product?.shipping?.weight} />
            <label className="field">
              <span>Weight unit</span>
              <select name="weightUnit" defaultValue={product?.shipping?.weightUnit || 'kg'}>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
              </select>
            </label>
            <Field name="countryOfOrigin" label="Country of origin" defaultValue={product?.shipping?.countryOfOrigin} />
            <Field name="hsCode" label="HS Code" defaultValue={product?.shipping?.hsCode} />
          </div>
        </section>
        <section className="editor-card">
          <div className="section-heading">
            <h3>Variants</h3>
            <button type="button" onClick={() => setVariants(v => [...v, { name: '', sku: '', price: '', stock: '' }])}>Add variant</button>
          </div>
          {variants.map((variant, index) => (
            <div className="variant-row" key={index}>
              <input placeholder="Option name (e.g. Blue / M)" value={variant.name} onChange={e => setVariants(v => v.map((x, i) => i === index ? { ...x, name: e.target.value } : x))} />
              <input placeholder="SKU" value={variant.sku} onChange={e => setVariants(v => v.map((x, i) => i === index ? { ...x, sku: e.target.value } : x))} />
              <input type="number" min="0" placeholder="Price" value={variant.price} onChange={e => setVariants(v => v.map((x, i) => i === index ? { ...x, price: e.target.value } : x))} />
              <input type="number" min="0" placeholder="Stock" value={variant.stock} onChange={e => setVariants(v => v.map((x, i) => i === index ? { ...x, stock: e.target.value } : x))} />
              {variants.length > 1 && <button type="button" onClick={() => setVariants(v => v.filter((_, i) => i !== index))}>×</button>}
            </div>
          ))}
        </section>
        <section className="editor-card">
          <h3>Sales channels & organization</h3>
          <div className="form-grid">
            <label className="field">
              <span>Channels</span>
              <select name="channels" multiple defaultValue={product?.channels || []}>
                <option>Online Store</option>
                <option>Point of Sale</option>
              </select>
            </label>
            <label className="field">
              <span>Catalogs</span>
              <select name="catalogs" multiple defaultValue={product?.catalogs || []}>
                <option>Default catalog</option>
              </select>
            </label>
          </div>
        </section>
        <section className="editor-card">
          <h3>Purchase options</h3>
          <Toggle name="subscriptions" label="Offer subscription plans" defaultChecked={product?.purchaseOptions?.subscriptions} />
          <Toggle name="preOrder" label="Allow pre-orders" defaultChecked={product?.purchaseOptions?.preOrder} />
        </section>
        <section className="editor-card">
          <h3>Product metafields</h3>
          <div className="form-grid">
            {[['careInstructions', 'Care Instructions'], ['material', 'Material'], ['size', 'Size'], ['snowboardLength', 'Snowboard length'], ['snowboardBindingMount', 'Snowboard binding mount'], ['disclosures', 'Disclosures']].map(([name, label]) => <Field key={name} name={name} label={label} />)}
          </div>
        </section>
        <section className="editor-card">
          <h3>Search engine listing</h3>
          <p>Add a title and description to see how this product might appear in a search engine listing.</p>
          <Field name="seoTitle" label="Page title" />
          <label className="field"><span>Meta description</span><textarea name="seoDescription" /></label>
        </section>
      </div>
    </div>
  </form>
}
