import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getProducts,
  addProduct,
  deleteProduct,
} from "../firebase/services";
import { uploadImageToCloudinary } from "../firebase/cloudinary";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  shipped: "bg-purple-100 text-purple-700 border-purple-300",
  delivered: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirm",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancel",
};

const PAYMENT_LABELS = { unpaid: "waiting", paid: "Paid", cod: "COD" };
const PAYMENT_COLORS = {
  unpaid: "bg-red-100 text-red-600",
  paid: "bg-green-100 text-green-600",
  cod: "bg-gray-100 text-gray-600",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    tag: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    if (tab === "orders" || tab === "dashboard") {
      const data = await getOrders();
      setOrders(data);
    }
    if (tab === "products") {
      const data = await getProducts();
      setProducts(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, field, value) => {
    await updateOrderStatus(orderId, { [field]: value });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, [field]: value } : o)),
    );
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("এই অর্ডারটি মুছে ফেলবেন?")) return;
    await deleteOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Select a picture");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const imageUrl = await uploadImageToCloudinary(
        imageFile,
        setUploadProgress,
      );
      const result = await addProduct({
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice),
        image: imageUrl,
      });
      if (result.success) {
        setShowAddProduct(false);
        setNewProduct({ name: "", price: "", originalPrice: "", tag: "" });
        setImageFile(null);
        setImagePreview("");
        setUploadProgress(0);
        fetchData();
      }
    } catch {
      alert("Picture upload failed, try again latter");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete the product?")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const todayOrders = orders.filter((o) => {
    if (!o.createdAt?.seconds) return false;
    return (
      new Date(o.createdAt.seconds * 1000).toDateString() ===
      new Date().toDateString()
    );
  }).length;

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch =
      !search || o.name?.includes(search) || o.phone?.includes(search);
    return matchStatus && matchSearch;
  });

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "orders", label: "Order", icon: "📦" },
    { id: "products", label: "Products", icon: "🛍️" },
  ];

  const switchTab = (id) => {
    setTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ══ HEADER ══ */}
      <header className="bg-[#1a3a5c] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
         
            <div>
             <img className="max-h-[70px] max-w-[70px] rounded-t-lg rounded-br-2xl" src="main-logo.jpg" alt="logo" />
              <div className="text-blue-300 text-xs leading-tight hidden sm:block">
                Admin Panel
              </div>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/10 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id
                    ? "bg-white text-[#1a3a5c] shadow"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden sm:flex text-xs bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg transition-colors items-center gap-1"
            >
              🌐 <span className="hidden lg:inline">See user panel</span>
            </a>
            <button
              onClick={handleLogout}
              className="text-xs bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors font-semibold flex items-center gap-1"
            >
              🚪 <span className="hidden sm:inline">LogOut</span>
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-white/15 hover:bg-white/25 p-2 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#122d4a]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`w-full text-left px-5 py-3 text-sm font-semibold flex items-center gap-3 transition-colors ${
                  tab === t.id
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
            <a
              href="/"
              className="w-full text-left px-5 py-3 text-sm text-white/70 hover:text-white flex items-center gap-3"
            >
              🌐 User site
            </a>
          </div>
        )}
      </header>

      {/* ══ PAGE CONTENT ══ */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-6">
        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  label: "Total revenue",
                  value: `৳${totalRevenue.toLocaleString()}`,
                  color: "from-green-500 to-emerald-600",
                  icon: "💰",
                },
                {
                  label: "Total Order",
                  value: orders.length,
                  color: "from-blue-500 to-blue-700",
                  icon: "📦",
                },
                {
                  label: "Pending",
                  value: pendingCount,
                  color: "from-yellow-400 to-orange-500",
                  icon: "⏳",
                },
                {
                  label: "Today's order",
                  value: todayOrders,
                  color: "from-purple-500 to-violet-600",
                  icon: "📅",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 overflow-hidden relative"
                >
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${s.color} opacity-10 rounded-bl-full`}
                  />
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">Recent orders</h3>
                <button
                  onClick={() => setTab("orders")}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  
See all →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      {["ছবি", "গ্রাহক", "পণ্য", "মোট", "স্ট্যাটাস"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left font-semibold"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr
                        key={o.id}
                        className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          {o.productImage ? (
                            <img
                              src={o.productImage}
                              alt={o.productName}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                              🛍️
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">
                            {o.name}
                          </div>
                          <div className="text-xs text-gray-400">{o.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {o.productName}{" "}
                          <span className="text-gray-400">×{o.quantity}</span>
                        </td>
                        <td className="px-4 py-3 font-black text-[#1a3a5c]">
                          ৳{o.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[o.status]}`}
                          >
                            {STATUS_LABELS[o.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-400"
                        >
                          
No order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔍
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a3a5c] text-sm bg-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none bg-white text-sm font-medium text-gray-700"
              >
                <option value="all">All status</option>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Orders count */}
            <div className="text-sm text-gray-500 font-medium">
              Total{" "}
              <span className="text-[#1a3a5c] font-black">
                {filteredOrders.length}
              </span>
             order
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-3 sm:gap-4">
                        {/* Product image */}
                        <div className="flex-shrink-0">
                          {order.productImage ? (
                            <img
                              src={order.productImage}
                              alt={order.productName}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                              🛍️
                            </div>
                          )}
                        </div>

                        {/* Order info */}
                        <div className="flex-1 min-w-0">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <span className="font-black text-gray-900 text-sm sm:text-base">
                                {order.name}
                              </span>
                              <span className="text-gray-400 text-xs ml-2">
                                {order.phone}
                              </span>
                            </div>
                            <div className="font-black text-[#1a3a5c] text-base sm:text-lg flex-shrink-0">
                              ৳{order.totalAmount?.toLocaleString()}
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex gap-1.5 flex-wrap mt-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.status]}`}
                            >
                              {STATUS_LABELS[order.status]}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_COLORS[order.paymentStatus]}`}
                            >
                              {PAYMENT_LABELS[order.paymentStatus]}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                              {order.paymentMethod === "cod"
                                ? "💵 COD"
                                : "📱 Bkash"}
                            </span>
                          </div>

                          {/* Details */}
                          <p className="text-xs text-gray-500 mt-1.5 truncate">
                            📍 {order.address}, {order.district}
                          </p>
                          <p className="text-xs text-gray-700 font-medium mt-0.5">
                            🛍️ {order.productName}
                            {order.productTag && (
                              <span className="ml-1 bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                                {order.productTag}
                              </span>
                            )}
                            <span className="text-gray-400 font-normal ml-1">
                              × {order.quantity}
                            </span>
                          </p>
                          {order.note && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              📝 {order.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action row */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50 flex-wrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              "status",
                              e.target.value,
                            )
                          }
                          className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white font-medium text-gray-700 outline-none focus:border-[#1a3a5c]"
                        >
                          {Object.entries(STATUS_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              "paymentStatus",
                              e.target.value,
                            )
                          }
                          className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white font-medium text-gray-700 outline-none focus:border-[#1a3a5c]"
                        >
                          <option value="unpaid">Waiting</option>
                          <option value="paid">Paid</option>
                          <option value="cod">COD</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-20 text-gray-400">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-semibold">No orders found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-black text-xl text-gray-900">
                  Product management
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Total {products.length} products
                </p>
              </div>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-[#1a3a5c] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold hover:bg-[#2563a8] transition-colors text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                {showAddProduct ? "✕ CANCEL" : "+ Upload New product"}
              </button>
            </div>

            {/* Add product form */}
            {showAddProduct && (
              <form
                onSubmit={handleAddProduct}
                className="bg-white rounded-2xl border-2 border-blue-100 p-5 sm:p-6 shadow-sm"
              >
                <h3 className="font-black text-gray-900 mb-5 text-lg flex items-center gap-2">
                  🛍️ ADD NEW PRODUCTS
                </h3>

                {/* Image upload */}
                <div className="mb-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Preview */}
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-50">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-3xl">🖼️</div>
                          <div className="text-xs text-gray-400 mt-1">
                            preview
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-[#1a3a5c] transition-all">
                        <div className="text-2xl mb-1">📁</div>
                        <div className="text-sm font-semibold text-gray-600">
                          Select the picture
                        </div>
                        <div className="text-xs text-gray-400">
                          JPG, PNG, WEBP — highest 10MB
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      {imageFile && (
                        <div className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1">
                          ✅ {imageFile.name}
                        </div>
                      )}

                      {/* Progress bar */}
                      {uploading && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>
Uploading to Cloudinary...</span>
                            <span className="font-bold">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-[#1a3a5c] to-blue-500 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Text fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      
Product Name *
                    </label>
                    <input
                      type="text"
                      placeholder="inter your products name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a3a5c] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      selling price (৳) *
                    </label>
                    <input
                      type="number"
                      placeholder="1200"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, price: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a3a5c] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      
                    Original price (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="1800"
                      value={newProduct.originalPrice}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          originalPrice: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a3a5c] transition-colors text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="enter your description"
                      value={newProduct.tag}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, tag: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1a3a5c] transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 sm:flex-none bg-[#1a3a5c] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#2563a8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-md cursor-pointer"
                  >
                    {uploading
                      ? `⏳ ${uploadProgress}% Uploading...`
                      : "✅ Upload the product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false);
                      setImagePreview("");
                      setImageFile(null);
                    }}
                    className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Products grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                  >
                    <div className="h-40 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative overflow-hidden h-40 sm:h-48 bg-gray-100">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🛍️
                        </div>
                      )}
                      {p.tag && (
                        <span className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs font-black px-2 py-0.5 rounded-full">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h4 className="font-black text-gray-900 text-sm leading-tight line-clamp-2">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[#1a3a5c] font-black text-sm">
                          ৳{Number(p.price).toLocaleString()}
                        </span>
                        {p.originalPrice &&
                          Number(p.originalPrice) > Number(p.price) && (
                            <span className="text-gray-400 line-through text-xs">
                              ৳{Number(p.originalPrice).toLocaleString()}
                            </span>
                          )}
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="mt-3 w-full text-xs bg-red-50 text-red-500 hover:bg-red-100 py-2 rounded-xl font-semibold transition-colors"
                      >
                        🗑️ Delete Product
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    <div className="text-5xl mb-3">📦</div>
                    <p className="font-semibold">No Products found</p>
                    <p className="text-xs mt-1">
                      Click the "+ New Product" button above.

                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
       <footer className="bg-[#1a3a5c] text-gray-400 py-8 sm:py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
            {/* Brand */}
            <div className="text-center sm:text-left">
             <img className="max-h-[50px] max-w-[50px]" src="main-logo.jpg" alt="logo" />
              <p className="text-white text-xs sm:text-sm mt-1">সেরা মানের ফ্যাশন, সেরা দামে</p>
            </div>
 
            {/* Quick links */}
            <div className="flex gap-4 sm:gap-6 text-sm">
              {["#products", "#how-it-works", "#reviews", "#order-section"].map((href, i) => (
                <a key={href} href={href}
                  className="hover:text-white transition-colors">
                  {["পণ্য", "কীভাবে?", "রিভিউ", "অর্ডার"][i]}
                </a>
              ))}
            </div>
          </div>
 
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <p>📞 01700-000000 &nbsp;|&nbsp; ✉️ fashionbd@email.com</p>
            <p>© 2026 FashionBD. সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
 
          {/* ── Creator credit ── */}
          <div className="mt-5 pt-4 border-t border-gray-800/50 text-center">
            <a
              href="https://www.facebook.com/profile.php?id=61578355676474"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 group"
            >
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                Created by
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1877f2] to-[#42a5f5] text-white text-xs font-black px-3 py-1.5 rounded-full shadow group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-200">
                <svg className="w-3.5 h-3.5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Website Creator
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}