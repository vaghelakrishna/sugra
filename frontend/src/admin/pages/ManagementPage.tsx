import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, Order, Product, Review } from '../types'
import { money, pic, pill, when, whenTime, Icons, Modal, Toast } from '../components/ui'
import ProductForm from '../components/ProductForm'

type Kind = 'Products' | 'Categories' | 'Inventory' | 'Orders' | 'Reviews'
type RecordItem = Product | Category | Order | Review

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const endpoints: Record<Kind, string> = {
  Products: '/admin/products',
  Categories: '/admin/categories',
  Inventory: '/admin/inventory',
  Orders: '/admin/orders?limit=100',
  Reviews: '/admin/reviews',
}

export default function ManagementPage({ kind, token }: { kind: Kind; token: string }) {
  const [data, setData] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)

  // Modals & form states
  const [add, setAdd] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [categoryModal, setCategoryModal] = useState<{ isOpen: boolean; category?: Category | null }>({ isOpen: false })
  const [orderModal, setOrderModal] = useState<Order | null>(null)
  const [adjustment, setAdjustment] = useState<{ id: string; title: string; currentStock: number; scope: object } | null>(null)

  // CSV Import / Export states
  const [csvModalOpen, setCsvModalOpen] = useState(false)
  const [csvData, setCsvData] = useState<Record<string, string>[]>([])
  const [csvFileName, setCsvFileName] = useState('')
  const [csvImporting, setCsvImporting] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const r = await fetch(API + endpoints[kind], { headers: { Authorization: `Bearer ${token}` } })
      const b = await r.json()
      if (!r.ok) throw new Error(b.message || 'Could not load data')
      setData(Array.isArray(b.data) ? b.data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setQ('')
    setFilter('')
    void load()
  }, [kind, token])

  const patch = async (path: string, body: object, successMsg = 'Updated successfully') => {
    try {
      const r = await fetch(API + path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const b = await r.json()
      if (!r.ok) throw new Error(b.message || 'Update failed')
      showToast(successMsg)
      void load()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Update failed', 'error')
    }
  }

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return
    try {
      let url = `${API}/products/${id}`
      if (kind === 'Categories') url = `${API}/categories/${id}`
      if (kind === 'Reviews') url = `${API}/admin/reviews/${id}`

      const r = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!r.ok) {
        const b = await r.json().catch(() => ({}))
        throw new Error(b.message || 'Delete failed')
      }
      showToast(`"${title}" deleted successfully`)
      void load()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Delete failed', 'error')
    }
  }

  const saveCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') || '').trim()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const payload = {
      name,
      slug,
      description: f.get('description'),
      image: f.get('image'),
      isActive: f.get('isActive') === 'on',
    }

    try {
      const isEditing = categoryModal.category?._id
      const url = isEditing ? `${API}/categories/${categoryModal.category?._id}` : `${API}/categories`
      const method = isEditing ? 'PATCH' : 'POST'
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const b = await r.json()
      if (!r.ok) throw new Error(b.message || 'Could not save category')
      showToast(isEditing ? 'Category updated' : 'Category created successfully')
      setCategoryModal({ isOpen: false })
      void load()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Operation failed', 'error')
    }
  }

  const saveAdjustment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!adjustment) return
    const value = Number(new FormData(event.currentTarget).get('quantity'))
    if (!Number.isInteger(value) || value === 0) {
      showToast('Please enter a valid non-zero quantity change', 'error')
      return
    }
    await patch(`/admin/inventory/${adjustment.id}`, { quantity: value, ...adjustment.scope }, `Stock adjusted by ${value > 0 ? '+' : ''}${value}`)
    setAdjustment(null)
  }

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''))
    const results: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const values: string[] = []
      let inQuotes = false
      let current = ''
      for (let c = 0; c < line.length; c++) {
        const char = line[c]
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^["']|["']$/g, ''))
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim().replace(/^["']|["']$/g, ''))
      const obj: Record<string, string> = {}
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || ''
      })
      results.push(obj)
    }
    return results
  }

  const downloadSampleTemplate = () => {
    let content = ''
    let filename = ''
    if (kind === 'Products') {
      content =
        'title,sku,category,price,compareAtPrice,stock,description,material,images\n' +
        '"Solitaire Diamond Ring","SUG-RNG-001","Rings",1499,1999,25,"18K Gold plated statement ring","Stainless Steel","https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"\n' +
        '"Crystal Drop Earrings","SUG-EAR-002","Earrings",1299,1699,18,"Waterproof anti-tarnish finish","18K Gold Plated","https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"'
      filename = 'products_sample_template.csv'
    } else if (kind === 'Inventory') {
      content =
        'sku,title,stock,price,compareAtPrice\n' +
        '"SUG-RNG-001","Solitaire Diamond Ring",50,1499,1999\n' +
        '"SUG-EAR-002","Crystal Drop Earrings",30,1299,1699'
      filename = 'inventory_sample_template.csv'
    }
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCurrentDataCSV = () => {
    let content = ''
    let filename = ''
    if (kind === 'Products') {
      content = 'title,sku,category,price,compareAtPrice,stock,description,material,images\n'
      data.forEach((item: any) => {
        const title = `"${(item.title || '').replace(/"/g, '""')}"`
        const sku = `"${(item.sku || '').replace(/"/g, '""')}"`
        const cat = `"${(item.category?.name || item.category || '').replace(/"/g, '""')}"`
        const price = item.price || 0
        const compareAtPrice = item.compareAtPrice || ''
        const stock = item.stock || 0
        const desc = `"${(item.description || '').replace(/"/g, '""')}"`
        const mat = `"${(item.material || '').replace(/"/g, '""')}"`
        const imgs = `"${(Array.isArray(item.images) ? item.images.join(';') : '').replace(/"/g, '""')}"`
        content += `${title},${sku},${cat},${price},${compareAtPrice},${stock},${desc},${mat},${imgs}\n`
      })
      filename = `products_export_${Date.now()}.csv`
    } else if (kind === 'Inventory') {
      content = 'sku,title,stock,price,compareAtPrice\n'
      data.forEach((item: any) => {
        const sku = `"${(item.sku || '').replace(/"/g, '""')}"`
        const title = `"${(item.title || '').replace(/"/g, '""')}"`
        const stock = item.stock || 0
        const price = item.price || 0
        const compareAtPrice = item.compareAtPrice || ''
        content += `${sku},${title},${stock},${price},${compareAtPrice}\n`
      })
      filename = `inventory_export_${Date.now()}.csv`
    }
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (text) {
        const parsed = parseCSV(text)
        setCsvData(parsed)
      }
    }
    reader.readAsText(file)
  }

  const handleRunBulkImport = async () => {
    if (csvData.length === 0) {
      showToast('No rows found in uploaded CSV file', 'error')
      return
    }
    setCsvImporting(true)
    try {
      const endpoint = kind === 'Products' ? '/admin/products/bulk-import' : '/admin/inventory/bulk-import'
      const r = await fetch(API + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: csvData }),
      })
      const b = await r.json()
      if (!r.ok) throw new Error(b.message || 'Import failed')
      showToast(b.message || `Successfully processed ${csvData.length} items!`)
      setCsvModalOpen(false)
      setCsvData([])
      setCsvFileName('')
      void load()
    } catch (err: any) {
      showToast(err.message || 'Bulk import failed', 'error')
    } finally {
      setCsvImporting(false)
    }
  }

  const list = useMemo(() => {
    return data.filter((x) => {
      const a = x as Product & Category & Order & Review
      const term = q.toLowerCase().trim()
      const matchesQ =
        !term ||
        (a.title && a.title.toLowerCase().includes(term)) ||
        (a.name && a.name.toLowerCase().includes(term)) ||
        (a.orderNumber && a.orderNumber.toLowerCase().includes(term)) ||
        (a.sku && a.sku.toLowerCase().includes(term)) ||
        (a.user?.name && a.user.name.toLowerCase().includes(term)) ||
        (a.user?.email && a.user.email.toLowerCase().includes(term)) ||
        (a.comment && a.comment.toLowerCase().includes(term))

      let matchesFilter = true
      if (filter) {
        if (kind === 'Products') {
          matchesFilter = a.status === filter
        } else if (kind === 'Categories') {
          matchesFilter = filter === 'active' ? Boolean(a.isActive) : !a.isActive
        } else if (kind === 'Inventory') {
          if (filter === 'out') matchesFilter = a.stock === 0
          else if (filter === 'low') matchesFilter = a.stock > 0 && a.stock <= 5
          else if (filter === 'in') matchesFilter = a.stock > 5
        } else if (kind === 'Orders') {
          matchesFilter = a.status === filter
        } else if (kind === 'Reviews') {
          matchesFilter = a.status === filter
        }
      }

      return matchesQ && matchesFilter
    })
  }, [data, q, filter, kind])

  if (add && kind === 'Products') {
    return (
      <ProductForm
        token={token}
        onClose={() => setAdd(false)}
        onCreated={() => {
          setAdd(false)
          showToast('Product created successfully')
          void load()
        }}
      />
    )
  }

  if (editProduct && kind === 'Products') {
    return (
      <ProductForm
        token={token}
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onCreated={() => {
          setEditProduct(null)
          showToast('Product updated successfully')
          void load()
        }}
      />
    )
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {error && (
        <div className="admin-panel" style={{ color: 'var(--admin-danger)', marginBottom: '20px' }}>
          <b>Error:</b> {error}
        </div>
      )}

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Icons.Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${kind.toLowerCase()} by name, SKU, customer...`}
          />
        </div>

        <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses / filters</option>
          {kind === 'Products' && (
            <>
              <option value="active">Active only</option>
              <option value="draft">Draft only</option>
              <option value="archived">Archived only</option>
            </>
          )}
          {kind === 'Categories' && (
            <>
              <option value="active">Active categories</option>
              <option value="inactive">Inactive categories</option>
            </>
          )}
          {kind === 'Inventory' && (
            <>
              <option value="low">Low stock (≤ 5)</option>
              <option value="out">Out of stock (0)</option>
              <option value="in">In stock (&gt; 5)</option>
            </>
          )}
          {kind === 'Orders' && (
            <>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </>
          )}
          {kind === 'Reviews' && (
            <>
              <option value="pending">Pending review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </>
          )}
        </select>

        {(q || filter) && (
          <button
            type="button"
            className="admin-btn admin-btn-sm"
            onClick={() => {
              setQ('')
              setFilter('')
            }}
          >
            Clear filters
          </button>
        )}

        {(kind === 'Products' || kind === 'Inventory') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <button
              type="button"
              className="admin-btn admin-btn-sm"
              onClick={exportCurrentDataCSV}
              title="Export all records to CSV"
            >
              Export CSV
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-sm"
              onClick={() => {
                setCsvData([])
                setCsvFileName('')
                setCsvModalOpen(true)
              }}
              title="Bulk import or update via CSV / Excel"
            >
              Import CSV / Excel
            </button>
            {kind === 'Products' && (
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => setAdd(true)}
              >
                <Icons.Plus /> Add product
              </button>
            )}
          </div>
        )}

        {kind === 'Categories' && (
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setCategoryModal({ isOpen: true, category: null })}
          >
            <Icons.Plus /> Add category
          </button>
        )}
      </div>

      {/* TABLE DATA */}
      {loading ? (
        <div className="admin-table-card">
          <div className="admin-empty">Loading {kind.toLowerCase()}...</div>
        </div>
      ) : list.length === 0 ? (
        <div className="admin-table-card">
          <div className="admin-empty">
            <h3>No {kind.toLowerCase()} found</h3>
            <p>{q || filter ? 'Try adjusting your search query or filters.' : `There are no ${kind.toLowerCase()} in your store yet.`}</p>
          </div>
        </div>
      ) : (
        <Table
          kind={kind}
          data={list}
          patch={patch}
          remove={remove}
          onEditCategory={(c) => setCategoryModal({ isOpen: true, category: c })}
          onEditProduct={setEditProduct}
          onViewOrder={setOrderModal}
          onAdjust={(id, title, currentStock, scope) => setAdjustment({ id, title, currentStock, scope })}
        />
      )}

      {/* CATEGORY MODAL */}
      {categoryModal.isOpen && (
        <Modal
          title={categoryModal.category ? 'Edit Category' : 'Create Category'}
          subtitle="Categories help customers browse collections in the store."
          onClose={() => setCategoryModal({ isOpen: false })}
        >
          <form onSubmit={saveCategory}>
            <div className="admin-form-group">
              <label>Category name *</label>
              <input
                name="name"
                defaultValue={categoryModal.category?.name || ''}
                placeholder="e.g. Silk Sarees, Luxe Shawls"
                required
                autoFocus
              />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                name="description"
                defaultValue={categoryModal.category?.description || ''}
                placeholder="Brief description for category banner..."
                rows={3}
              />
            </div>
            <div className="admin-form-group">
              <label>Cover image URL (optional)</label>
              <input
                name="image"
                type="url"
                defaultValue={categoryModal.category?.image || ''}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
              <input
                id="catActive"
                name="isActive"
                type="checkbox"
                defaultChecked={categoryModal.category?.isActive ?? true}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="catActive" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                Active in storefront navigation &amp; catalog
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="admin-btn"
                onClick={() => setCategoryModal({ isOpen: false })}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary">
                {categoryModal.category ? 'Save changes' : 'Create category'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* STOCK ADJUSTMENT MODAL */}
      {adjustment && (
        <Modal
          title="Adjust inventory quantity"
          subtitle={adjustment.title}
          onClose={() => setAdjustment(null)}
        >
          <form onSubmit={saveAdjustment}>
            <div style={{ background: '#faf7f2', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Current available stock:</span>
              <strong style={{ display: 'block', fontSize: '20px', color: 'var(--admin-text-main)', marginTop: '2px' }}>
                {adjustment.currentStock} units
              </strong>
            </div>

            <div className="admin-form-group">
              <label>Quantity change (+ to add, - to reduce) *</label>
              <input
                id="stockInput"
                name="quantity"
                type="number"
                step="1"
                placeholder="Example: +5 or -2"
                autoFocus
                required
              />
              <small>Enter positive value to add stock, or negative value to decrease.</small>
            </div>

            <div style={{ margin: '10px 0 16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 600 }}>Quick adjustments:</span>
              <div className="stock-presets">
                {['+1', '+5', '+10', '+25', '-1', '-5'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('stockInput') as HTMLInputElement | null
                      if (input) input.value = val.replace('+', '')
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="admin-btn"
                onClick={() => setAdjustment(null)}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary">
                Apply adjustment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ORDER DETAILS MODAL */}
      {orderModal && (
        <Modal
          title={`Order ${orderModal.orderNumber}`}
          subtitle={`Placed on ${whenTime(orderModal.createdAt)}`}
          onClose={() => setOrderModal(null)}
        >
          <div className="order-detail-sec">
            <h4>Customer details</h4>
            <div className="order-info-grid">
              <div className="order-info-box">
                <span>Customer name</span>
                <b>{orderModal.user?.name || orderModal.shippingAddress?.recipientName || 'Guest customer'}</b>
              </div>
              <div className="order-info-box">
                <span>Contact email</span>
                <b>{orderModal.user?.email || 'N/A'}</b>
              </div>
            </div>
          </div>

          <div className="order-detail-sec">
            <h4>Shipping address</h4>
            <div className="order-info-box">
              <span>Delivery destination</span>
              <b>{orderModal.shippingAddress?.recipientName || 'Customer'}</b>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-main)', marginTop: '4px', lineHeight: 1.5 }}>
                {orderModal.shippingAddress ? (
                  <>
                    {orderModal.shippingAddress.line1}
                    {orderModal.shippingAddress.line2 ? `, ${orderModal.shippingAddress.line2}` : ''}
                    <br />
                    {orderModal.shippingAddress.city}, {orderModal.shippingAddress.state} - {orderModal.shippingAddress.postalCode}
                    <br />
                    {orderModal.shippingAddress.country}
                    {orderModal.shippingAddress.phone ? ` • Phone: ${orderModal.shippingAddress.phone}` : ''}
                  </>
                ) : (
                  'No address details recorded'
                )}
              </div>
            </div>
          </div>

          <div className="order-detail-sec">
            <h4>Ordered pieces ({orderModal.items?.length || 0})</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {orderModal.items?.map((item, idx) => (
                <div className="order-item-row" key={idx}>
                  {pic(item.image, item.title)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ fontSize: '13px', display: 'block' }}>{item.title}</b>
                    <small style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                      SKU: {item.sku || 'N/A'} • Qty: {item.quantity} × {money(item.unitPrice)}
                    </small>
                  </div>
                  <strong style={{ fontSize: '13px' }}>{money(item.lineTotal || item.unitPrice * item.quantity)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="order-detail-sec">
            <h4>Payment &amp; Financials</h4>
            <div className="order-summary-totals">
              <div className="order-summary-line">
                <span>Subtotal</span>
                <span>{money(orderModal.subtotal || orderModal.total)}</span>
              </div>
              {Number(orderModal.shippingFee) > 0 && (
                <div className="order-summary-line">
                  <span>Shipping fee</span>
                  <span>{money(orderModal.shippingFee)}</span>
                </div>
              )}
              {Number(orderModal.discount) > 0 && (
                <div className="order-summary-line">
                  <span>Discount</span>
                  <span>-{money(orderModal.discount)}</span>
                </div>
              )}
              <div className="order-summary-line total">
                <span>Grand total</span>
                <span>{money(orderModal.total)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', display: 'block' }}>Payment status</span>
                {pill(orderModal.payment?.status || 'pending')}
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '4px' }}>Order status</span>
                <select
                  className="admin-select"
                  value={orderModal.status}
                  onChange={(e) => {
                    const newStatus = e.target.value
                    void patch(`/admin/orders/${orderModal._id}/status`, { status: newStatus }, `Order status updated to ${newStatus}`)
                    setOrderModal({ ...orderModal, status: newStatus })
                  }}
                >
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => setOrderModal(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* CSV / EXCEL BULK IMPORT MODAL */}
      {csvModalOpen && (
        <Modal
          title={`Bulk Import ${kind} via CSV / Excel`}
          subtitle={`Upload a spreadsheet to bulk create or update ${kind.toLowerCase()} in your store.`}
          onClose={() => setCsvModalOpen(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Step 1: Download Sample Template */}
            <div style={{ background: '#faf7f2', padding: '14px', borderRadius: '8px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <b style={{ fontSize: '13px', display: 'block', color: 'var(--admin-text-main)' }}>
                    Need a template format?
                  </b>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    Download our formatted CSV template with column headers and sample data.
                  </span>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm"
                  onClick={downloadSampleTemplate}
                  style={{ background: '#fff' }}
                >
                  Download Sample CSV
                </button>
              </div>
            </div>

            {/* Step 2: Upload File */}
            <div className="admin-form-group">
              <label>Select CSV / Excel (.csv) File</label>
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleCSVUpload}
                style={{ padding: '8px', background: '#fff', border: '1px dashed #ccc', borderRadius: '6px' }}
              />
              {csvFileName && (
                <small style={{ color: 'var(--admin-success)', fontWeight: 600 }}>
                  Selected: {csvFileName} ({csvData.length} rows parsed)
                </small>
              )}
            </div>

            {/* Step 3: Parsed Preview */}
            {csvData.length > 0 && (
              <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', background: '#f5f2eb', fontSize: '12px', fontWeight: 600 }}>
                  Preview: First 5 of {csvData.length} records ready to import
                </div>
                <div style={{ maxHeight: '180px', overflowY: 'auto', fontSize: '11px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee', textAlign: 'left' }}>
                        {Object.keys(csvData[0] || {}).map((k) => (
                          <th key={k} style={{ padding: '6px 10px', textTransform: 'capitalize' }}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          {Object.values(row).map((v, i) => (
                            <td key={i} style={{ padding: '6px 10px', whiteSpace: 'nowrap', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="admin-btn"
                onClick={() => setCsvModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={csvImporting || csvData.length === 0}
                onClick={handleRunBulkImport}
              >
                {csvImporting ? 'Processing Import...' : `Import & Sync ${csvData.length} Records`}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

function Table({
  kind,
  data,
  patch,
  remove,
  onEditCategory,
  onEditProduct,
  onViewOrder,
  onAdjust,
}: {
  kind: Kind
  data: RecordItem[]
  patch: (path: string, body: object, msg?: string) => Promise<void>
  remove: (id: string, title: string) => Promise<void>
  onEditCategory?: (category: Category) => void
  onEditProduct?: (product: Product) => void
  onViewOrder?: (order: Order) => void
  onAdjust?: (id: string, title: string, currentStock: number, scope: object) => void
}) {
  if (kind === 'Products') {
    return (
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Last updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data as Product[]).map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-table-item">
                      {pic(p.images?.[0], p.title)}
                      <div>
                        <b>{p.title}</b>
                        <small>SKU: {p.sku || 'No SKU'}</small>
                      </div>
                    </div>
                  </td>
                  <td>{p.category?.name || 'Uncategorized'}</td>
                  <td>
                    <strong>{money(p.price)}</strong>
                    {p.compareAtPrice ? (
                      <small style={{ display: 'block', textDecoration: 'line-through', color: 'var(--admin-text-subtle)' }}>
                        {money(p.compareAtPrice)}
                      </small>
                    ) : null}
                  </td>
                  <td>
                    {pill(p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? `${p.stock} low stock` : `${p.stock} in stock`)}
                  </td>
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => void patch(`/products/${p._id}`, { status: e.target.value }, `Product status set to ${e.target.value}`)}
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--admin-border)', fontSize: '12px' }}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td>{when(p.updatedAt || p.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm"
                        onClick={() => onEditProduct?.(p)}
                        title="Edit product"
                      >
                        <Icons.Edit /> Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => void remove(p._id, p.title)}
                        title="Delete product"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (kind === 'Categories') {
    return (
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th>Last updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data as Category[]).map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="admin-table-item">
                      {pic(c.image, c.name)}
                      <div>
                        <b>{c.name}</b>
                        {c.description && <small>{c.description.slice(0, 45)}...</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: '11px', background: '#f4ede6', padding: '3px 6px', borderRadius: '4px' }}>
                      {c.slug || c.name.toLowerCase()}
                    </code>
                  </td>
                  <td>
                    <strong>{c.productCount || 0}</strong> products
                  </td>
                  <td>{pill(c.isActive ? 'Active' : 'Inactive')}</td>
                  <td>{when(c.updatedAt || c.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm"
                        onClick={() => onEditCategory?.(c)}
                        title="Edit category"
                      >
                        <Icons.Edit /> Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm"
                        onClick={() =>
                          void patch(`/categories/${c._id}`, { isActive: !c.isActive }, `Category marked as ${!c.isActive ? 'active' : 'inactive'}`)
                        }
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => void remove(c._id, c.name)}
                        title="Delete category"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (kind === 'Inventory') {
    return (
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Available stock</th>
                <th>Inventory status</th>
                <th style={{ textAlign: 'right' }}>Adjust stock</th>
              </tr>
            </thead>
            <tbody>
              {(data as Product[]).map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-table-item">
                      {pic(p.images?.[0], p.title)}
                      <div>
                        <b>{p.title}</b>
                        <small>{p.category?.name || 'SUGRA Collection'}</small>
                      </div>
                    </div>
                  </td>
                  <td>{p.sku || '—'}</td>
                  <td>{money(p.price)}</td>
                  <td>
                    <strong style={{ fontSize: '15px' }}>{p.stock}</strong> units
                  </td>
                  <td>{pill(p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? 'Low stock' : 'In stock')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary admin-btn-sm"
                        onClick={() => onAdjust?.(p._id, p.title, p.stock, {})}
                      >
                        Adjust stock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (kind === 'Orders') {
    return (
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order number</th>
                <th>Customer</th>
                <th>Items summary</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data as Order[]).map((o) => (
                <tr key={o._id}>
                  <td>
                    <strong style={{ color: 'var(--admin-gold-hover)' }}>{o.orderNumber}</strong>
                  </td>
                  <td>
                    <b>{o.user?.name || o.shippingAddress?.recipientName || 'Customer'}</b>
                    <small>{o.user?.email || o.shippingAddress?.phone || '—'}</small>
                  </td>
                  <td>
                    <div className="admin-table-item">
                      {pic(o.items[0]?.image, o.items[0]?.title)}
                      <div>
                        <b>{o.items[0]?.title || 'Order Item'}</b>
                        {o.items?.length > 1 && <small>+{o.items.length - 1} more item(s)</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{money(o.total)}</strong>
                  </td>
                  <td>{pill(o.payment?.status || 'pending')}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        void patch(`/admin/orders/${o._id}/status`, { status: e.target.value }, `Order status updated to ${e.target.value}`)
                      }
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--admin-border)', fontSize: '12px' }}
                    >
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{when(o.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-sm"
                      onClick={() => onViewOrder?.(o)}
                      title="View full order details"
                    >
                      <Icons.Eye /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Reviews
  return (
    <div className="admin-table-card">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data as Review[]).map((r) => (
              <tr key={r._id}>
                <td>
                  <div className="admin-table-item">
                    {pic(r.product?.images?.[0], r.product?.title)}
                    <b>{r.product?.title || 'Product'}</b>
                  </div>
                </td>
                <td>
                  <b>{r.user?.name || 'Anonymous'}</b>
                  <small>{r.user?.email || '—'}</small>
                </td>
                <td>
                  <span style={{ color: 'var(--admin-gold)', fontSize: '14px', letterSpacing: '1px' }}>
                    {'★'.repeat(r.rating)}
                    {'☆'.repeat(5 - r.rating)}
                  </span>
                </td>
                <td style={{ maxWidth: '280px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-main)', lineHeight: 1.4 }}>
                    {r.comment}
                  </p>
                </td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      void patch(`/admin/reviews/${r._id}/status`, { status: e.target.value }, `Review marked as ${e.target.value}`)
                    }
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--admin-border)', fontSize: '12px' }}
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </td>
                <td>{when(r.createdAt)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => void remove(r._id, `Review by ${r.user?.name || 'customer'}`)}
                    title="Delete review"
                  >
                    <Icons.Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
