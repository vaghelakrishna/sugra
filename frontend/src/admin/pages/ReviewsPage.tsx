import { useEffect, useState } from 'react'
import {
  Star,
  Check,
  X,
  Trash2,
  Plus,
  Image as ImageIcon,
  ShieldCheck,
  Search,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ReviewItem {
  _id: string
  product?: {
    _id: string
    title: string
    slug: string
    images?: string[]
    price?: number
  }
  user?: {
    name?: string
    email?: string
  }
  authorName?: string
  authorEmail?: string
  rating: number
  title?: string
  comment: string
  images?: string[]
  status: 'pending' | 'approved' | 'rejected'
  isVerifiedPurchase: boolean
  createdAt: string
}

interface ProductOption {
  _id: string
  title: string
  slug: string
  images?: string[]
  price?: number
}

export default function ReviewsPage({ token }: { token: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // New Review Form State
  const [newProductId, setNewProductId] = useState('')
  const [newAuthorName, setNewAuthorName] = useState('')
  const [newAuthorEmail, setNewAuthorEmail] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [newTitle, setNewTitle] = useState('')
  const [newComment, setNewComment] = useState('')
  const [newImages, setNewImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newStatus, setNewStatus] = useState<'approved' | 'pending'>('approved')
  const [newVerified, setNewVerified] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const body = await res.json()
      if (res.ok) setReviews(body.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/admin/products?status=active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const body = await res.json()
      if (res.ok) {
        setProducts(body.data || [])
        if (body.data?.length && !newProductId) setNewProductId(body.data[0]._id)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    void fetchReviews()
    void fetchProducts()
  }, [token])

  const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch(`${API}/admin/reviews/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status } : r))
        )
      }
    } catch {
      // ignore
    }
  }

  const deleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return
    try {
      const res = await fetch(`${API}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== id))
      }
    } catch {
      // ignore
    }
  }

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setNewImages((prev) => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImages((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductId || !newComment.trim()) {
      alert('Please select a product and write a review comment.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API}/admin/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: newProductId,
          authorName: newAuthorName.trim() || 'Verified Customer',
          authorEmail: newAuthorEmail.trim() || undefined,
          rating: newRating,
          title: newTitle.trim(),
          comment: newComment.trim(),
          images: newImages,
          status: newStatus,
          isVerifiedPurchase: newVerified,
        }),
      })
      const body = await res.json()
      if (res.ok) {
        setMsg('Review created successfully!')
        setModalOpen(false)
        setNewTitle('')
        setNewComment('')
        setNewImages([])
        setNewAuthorName('')
        void fetchReviews()
        setTimeout(() => setMsg(''), 4000)
      } else {
        alert(body.message || 'Failed to create review.')
      }
    } catch {
      alert('Failed to connect to server.')
    } finally {
      setSubmitting(false)
    }
  }

  // Filtered Reviews
  const filtered = reviews.filter((r) => {
    const matchesTab = tab === 'all' ? true : r.status === tab
    const query = search.toLowerCase()
    const matchesSearch =
      !query ||
      r.product?.title?.toLowerCase().includes(query) ||
      r.authorName?.toLowerCase().includes(query) ||
      r.user?.name?.toLowerCase().includes(query) ||
      r.title?.toLowerCase().includes(query) ||
      r.comment?.toLowerCase().includes(query)
    return matchesTab && matchesSearch
  })

  // Statistics
  const totalCount = reviews.length
  const approvedCount = reviews.filter((r) => r.status === 'approved').length
  const pendingCount = reviews.filter((r) => r.status === 'pending').length
  const avgRating = totalCount
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : '5.0'

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-[#875c35]" /> Customer Reviews & Testimonials
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage, moderate, and add real customer reviews with photos across your catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1f1915] hover:bg-[#875c35] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-all"
        >
          <Plus size={18} />
          <span>Add New Review</span>
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={18} /> {msg}
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reviews</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Approved</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{approvedCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Approval</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Rating</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
            <div className="flex text-amber-400">
              <Star size={18} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* TABS */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-full md:w-auto">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              tab === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('pending')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              tab === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('approved')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              tab === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('rejected')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              tab === 'rejected' ? 'bg-rose-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, customer, text..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:outline-none focus:border-[#875c35]"
          />
        </div>
      </div>

      {/* REVIEWS LIST */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500">
          <MessageSquare size={36} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-semibold text-gray-800">No reviews found</h3>
          <p className="text-xs text-gray-400 mt-1">Try switching tabs or click "Add New Review" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const author = r.authorName || r.user?.name || 'Customer'
            return (
              <div
                key={r._id}
                className={`bg-white p-5 rounded-xl border transition-all ${
                  r.status === 'pending'
                    ? 'border-amber-300 bg-amber-50/20'
                    : r.status === 'rejected'
                    ? 'border-rose-200 opacity-75'
                    : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* LEFT: PRODUCT & REVIEW INFO */}
                  <div className="flex items-start gap-4">
                    {/* PRODUCT THUMBNAIL */}
                    {r.product?.images?.[0] ? (
                      <img
                        src={r.product.images[0]}
                        alt=""
                        className="h-16 w-14 rounded-md object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-14 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                        SUGRA
                      </div>
                    )}

                    <div>
                      {/* PRODUCT TITLE */}
                      <p className="text-xs font-bold text-gray-900 hover:text-[#875c35]">
                        {r.product?.title || 'Unknown Product'}
                      </p>

                      {/* STAR RATING & DATE */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < r.rating ? 'currentColor' : 'none'}
                              className={i < r.rating ? '' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{r.rating}.0</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* AUTHOR & VERIFIED BADGE */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">{author}</span>
                        {r.authorEmail && <span className="text-gray-400">({r.authorEmail})</span>}
                        {r.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck size={11} /> Verified Buyer
                          </span>
                        )}
                      </div>

                      {/* REVIEW TITLE & BODY */}
                      {r.title && <h4 className="font-bold text-sm text-gray-900 mt-2">{r.title}</h4>}
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">{r.comment}</p>

                      {/* CUSTOMER ATTACHED PHOTOS */}
                      {r.images && r.images.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          {r.images.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPreviewImage(img)}
                              className="group relative h-14 w-14 rounded-lg overflow-hidden border border-gray-200 hover:border-black transition-all"
                            >
                              <img src={img} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: STATUS BADGE & ACTION BUTTONS */}
                  <div className="flex md:flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status}
                    </span>

                    <div className="flex items-center gap-1 mt-1">
                      {r.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(r._id, 'approved')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Approve Review"
                        >
                          <Check size={18} />
                        </button>
                      )}

                      {r.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(r._id, 'rejected')}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="Reject Review"
                        >
                          <X size={18} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteReview(r._id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* =========================================================================
          ADD REVIEW MODAL (ADMIN SIDE)
          ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />

          <div className="relative z-50 w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="text-[#875c35]" size={20} /> Add Review from Admin
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              {/* SELECT PRODUCT */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Product *
                </label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#875c35]"
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} (Rs. {p.price || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* AUTHOR NAME & EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="e.g. Pooja V."
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#875c35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Customer Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={newAuthorEmail}
                    onChange={(e) => setNewAuthorEmail(e.target.value)}
                    placeholder="pooja@gmail.com"
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#875c35]"
                  />
                </div>
              </div>

              {/* STAR RATING SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 transition-transform hover:scale-115"
                    >
                      <Star
                        size={24}
                        fill={star <= newRating ? '#f59e0b' : 'none'}
                        className={star <= newRating ? 'text-[#f59e0b]' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">{newRating} Stars</span>
                </div>
              </div>

              {/* REVIEW TITLE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Gorgeous shine & perfect fit!"
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#875c35]"
                />
              </div>

              {/* REVIEW COMMENT */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Review Feedback / Comment *
                </label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write customer feedback here..."
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#875c35]"
                  required
                />
              </div>

              {/* PHOTOS UPLOAD / URLS */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Customer Review Photos
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (or upload below)..."
                    className="flex-1 p-2 border border-gray-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg"
                  >
                    Add URL
                  </button>
                </div>

                <label className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <ImageIcon size={16} /> Upload Image Files
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                </label>

                {newImages.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {newImages.map((img, idx) => (
                      <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* OPTIONS: STATUS & VERIFIED */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVerified}
                    onChange={(e) => setNewVerified(e.target.checked)}
                    className="accent-black"
                  />
                  <span>Mark as Verified Purchase</span>
                </label>

                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'approved' | 'pending')}
                  className="p-1.5 border border-gray-200 rounded-lg text-xs font-bold bg-white"
                >
                  <option value="approved">Status: Approved</option>
                  <option value="pending">Status: Pending</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#1f1915] hover:bg-[#875c35] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
                >
                  {submitting ? 'Saving...' : 'Save & Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR PREVIEWING REVIEW PHOTO */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh]">
            <img src={previewImage} alt="Review attachment" className="max-h-[80vh] max-w-full rounded-xl object-contain" />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
