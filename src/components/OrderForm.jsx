import { useState } from "react";
import { submitOrder } from "../firebase/services";
 
const DISTRICTS = [
  "ঢাকা","চট্টগ্রাম","সিলেট","রাজশাহী","খুলনা","বরিশাল","রংপুর",
  "ময়মনসিংহ","কুমিল্লা","নারায়ণগঞ্জ","গাজীপুর","টাঙ্গাইল","ফরিদপুর",
  "যশোর","বগুড়া","নোয়াখালী","ব্রাহ্মণবাড়িয়া","মুন্সিগঞ্জ","মাদারীপুর","শরীয়তপুর",
];
 
export default function OrderForm({ selectedProduct, onSuccess }) {
  const [quantity,       setQuantity]       = useState(1);
  const [paymentMethod,  setPaymentMethod]  = useState("cod");
  const [form,           setForm]           = useState({ name:"", phone:"", address:"", district:"", note:"" });
  const [loading,        setLoading]        = useState(false);
  const [errors,         setErrors]         = useState({});
 
  const deliveryCharge = form.district === "ঢাকা" ? 60 : 120;
  const subtotal       = selectedProduct ? Number(selectedProduct.price) * quantity : 0;
  const total          = subtotal + deliveryCharge;
 
  const validate = () => {
    const e = {};
    if (!form.name.trim())                        e.name     = "নাম আবশ্যক";
    if (!/^01[3-9]\d{8}$/.test(form.phone))      e.phone    = "সঠিক ফোন নম্বর দিন";
    if (!form.address.trim())                     e.address  = "ঠিকানা আবশ্যক";
    if (!form.district)                           e.district = "জেলা সিলেক্ট করুন";
    return e;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
 
    setLoading(true);
    const result = await submitOrder({
      name: form.name, phone: form.phone,
      address: form.address, district: form.district, note: form.note,
      productId:            selectedProduct.id,
      productName:          selectedProduct.name,
      productImage:         selectedProduct.image        || "",
      productPrice:         selectedProduct.price,
      productOriginalPrice: selectedProduct.originalPrice || selectedProduct.price,
      productTag:           selectedProduct.tag          || "",
      quantity, paymentMethod, deliveryCharge, subtotal, totalAmount: total,
    });
    setLoading(false);
    if (result.success) onSuccess();
    else alert("অর্ডার ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
  };
 
  const inp = (field) =>
    `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 bg-white text-gray-900 text-sm outline-none transition-all focus:border-[#1a3a5c] ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;
 
  /* ── No product selected ── */
  if (!selectedProduct) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl text-center">
        <div className="text-5xl sm:text-6xl mb-3">☝️</div>
        <p className="font-semibold text-gray-500 text-sm sm:text-base">
          উপরে কোনো পণ্যের{" "}
          <strong className="text-[#1a3a5c]">"অর্ডার করুন"</strong> বাটনে ক্লিক করুন
        </p>
      </div>
    );
  }
 
  const disc = selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;
 
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
 
      {/* ── Selected product preview ── */}
      <div className="bg-[#f0f6ff] border-b border-blue-100 p-4 sm:p-5">
        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">
          আপনি যে পণ্যটি অর্ডার করছেন
        </p>
        <div className="flex gap-3 sm:gap-4 items-center">
          {selectedProduct.image ? (
            <img src={selectedProduct.image} alt={selectedProduct.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow border-2 border-white flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">🛍️</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="font-black text-gray-900 text-sm sm:text-base leading-tight">{selectedProduct.name}</h3>
              {selectedProduct.tag && (
                <span className="bg-yellow-400 text-gray-800 text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0">
                  {selectedProduct.tag}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg sm:text-xl font-black text-[#1a3a5c]">৳{Number(selectedProduct.price).toLocaleString()}</span>
              {disc > 0 && (
                <>
                  <span className="text-gray-400 line-through text-xs">৳{Number(selectedProduct.originalPrice).toLocaleString()}</span>
                  <span className="text-red-500 text-xs font-bold">-{disc}%</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
 
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
 
        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">আপনার নাম *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="পূর্ণ নাম লিখুন" className={inp("name")} />
            {errors.name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">মোবাইল নম্বর *</label>
            <input name="phone" value={form.phone} onChange={handleChange}
              placeholder="01XXXXXXXXX" className={inp("phone")} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</p>}
          </div>
        </div>
 
        {/* Address */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
          <textarea name="address" value={form.address} onChange={handleChange}
            rows={2} placeholder="বাসা নং, রাস্তা, এলাকা..."
            className={inp("address") + " resize-none"} />
          {errors.address && <p className="text-red-500 text-xs mt-1">⚠️ {errors.address}</p>}
        </div>
 
        {/* District */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">জেলা *</label>
          <select name="district" value={form.district} onChange={handleChange} className={inp("district")}>
            <option value="">জেলা বাছুন</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.district && <p className="text-red-500 text-xs mt-1">⚠️ {errors.district}</p>}
        </div>
 
        {/* Quantity */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">পরিমাণ</label>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 font-black text-lg hover:bg-gray-200 transition-colors flex-shrink-0">
              −
            </button>
            <span className="w-8 text-center font-black text-lg text-[#1a3a5c]">{quantity}</span>
            <button type="button" onClick={() => setQuantity(q => q + 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 font-black text-lg hover:bg-gray-200 transition-colors flex-shrink-0">
              +
            </button>
            <span className="text-xs sm:text-sm text-gray-400 ml-1">
              × ৳{Number(selectedProduct.price).toLocaleString()} ={" "}
              <strong className="text-gray-700">৳{subtotal.toLocaleString()}</strong>
            </span>
          </div>
        </div>
 
        {/* Payment method */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">পেমেন্ট পদ্ধতি</label>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[
              { v: "cod",   icon: "💵", label: "ক্যাশ অন ডেলিভারি", sub: "পণ্য পেয়ে টাকা দিন" },
              { v: "bkash", icon: "📱", label: "বিকাশ",              sub: "অগ্রিম পেমেন্ট" },
            ].map(pm => (
              <button key={pm.v} type="button" onClick={() => setPaymentMethod(pm.v)}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === pm.v ? "border-[#1a3a5c] bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}>
                <span className="text-xl sm:text-2xl flex-shrink-0">{pm.icon}</span>
                <div className="min-w-0">
                  <div className={`font-bold text-xs sm:text-sm truncate ${paymentMethod === pm.v ? "text-[#1a3a5c]" : "text-gray-700"}`}>
                    {pm.label}
                  </div>
                  <div className="text-gray-400 text-xs hidden sm:block">{pm.sub}</div>
                </div>
                {paymentMethod === pm.v && <span className="ml-auto text-[#1a3a5c] font-black flex-shrink-0">✓</span>}
              </button>
            ))}
          </div>
        </div>
 
        {/* Note */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
            বিশেষ নির্দেশনা <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
          </label>
          <input name="note" value={form.note} onChange={handleChange}
            placeholder="কোনো বিশেষ চাহিদা থাকলে লিখুন..." className={inp("note")} />
        </div>
 
        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100 text-sm space-y-1.5">
          <div className="font-bold text-gray-700 text-xs sm:text-sm mb-1">অর্ডার সারসংক্ষেপ</div>
          <div className="flex justify-between text-gray-600 text-xs sm:text-sm">
            <span className="truncate mr-2">{selectedProduct.name} × {quantity}</span>
            <span className="flex-shrink-0">৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs sm:text-sm">
            <span>ডেলিভারি {form.district ? `(${form.district})` : ""}</span>
            <span>৳{deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-black text-[#1a3a5c] text-sm sm:text-base border-t border-gray-200 pt-1.5">
            <span>সর্বমোট</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
        </div>
 
        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full bg-[#1a3a5c] text-white font-black text-sm sm:text-base py-3.5 sm:py-4 rounded-xl hover:bg-[#2563a8] transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg">
          {loading ? "⏳ অর্ডার পাঠানো হচ্ছে..." : "✅ Order Now"}
        </button>
 
        <p className="text-center text-xs text-gray-400">🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ</p>
      </div>
    </form>
  );
}