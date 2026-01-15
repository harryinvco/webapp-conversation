'use client'

import { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
  onSelect?: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div
      onClick={() => onSelect?.(product)}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
    >
      <div className="p-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {product.price}
        </span>
      </div>
    </div>
  )
}
