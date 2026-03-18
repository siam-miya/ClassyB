import { useState } from "react";
 
export default function ProductCard({ product, onOrder }) {
  const sizes  = product.sizes  || [];
  const colors = product.colors || [];
  const [selectedSize,  setSelectedSize]  = useState(sizes[1] || sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(0);
 
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
 
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-blue-50 group flex flex-col">
 
      {/* ── Image ── */}
      <div className="relative overflow-hidden h-44 sm:h-56 md:h-60 flex-shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🛍️</div>
        )}
 
        {/* Badges */}
        {product.tag && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs font-black px-2 py-0.5 rounded-full shadow">
            {product.tag}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow">
            -{discount}%
          </span>
        )}
      </div>
 
      {/* ── Info ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
 
        {/* Name */}
        <h3 className="font-black text-gray-900 text-sm sm:text-base leading-tight line-clamp-2 mb-2">
          {product.name}
        </h3>
 
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg sm:text-xl font-black text-[#1a3a5c]">
            ৳{Number(product.price).toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-xs sm:text-sm">
              ৳{Number(product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>
 
        {/* Colors */}
        {colors.length > 0 && (
          <div className="mb-2.5">
            <span className="text-xs text-gray-500 font-semibold block mb-1">রং:</span>
            <div className="flex gap-1.5 flex-wrap">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(i)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all flex-shrink-0 ${
                    selectedColor === i ? "border-blue-600 scale-110" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
 
        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-gray-500 font-semibold block mb-1">সাইজ:</span>
            <div className="flex gap-1.5 flex-wrap">
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                    selectedSize === s
                      ? "bg-[#1a3a5c] text-white border-[#1a3a5c]"
                      : "text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
 
        {/* Order button — pushed to bottom */}
        <div className="mt-auto pt-2">
          <button
            onClick={() => onOrder({ ...product, selectedSize, selectedColor })}
            className="w-full bg-[#1a3a5c] text-white font-black text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl hover:bg-[#2563a8] active:scale-[0.98] transition-all shadow-md"
          >
            🛒 Order Now
          </button>
        </div>
      </div>
    </div>
  );
}