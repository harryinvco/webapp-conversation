'use client'

import { useState, useEffect } from 'react'
import { Product, Category, getProductsByCategory } from '@/data/products'

interface CatalogDrawerProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  categories: Category[]
  onSelectProduct?: (product: Product) => void
}

export function CatalogDrawer({
  isOpen,
  onClose,
  products,
  categories,
  onSelectProduct,
}: CatalogDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => setShouldRender(false), 300)
    }
  }, [isOpen])

  useEffect(() => {
    setFilteredProducts(getProductsByCategory(activeCategory))
  }, [activeCategory])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Κατάλογος Προϊόντων</h2>
            <p className="text-xs text-gray-400">{filteredProducts.length} προϊόντα</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="px-4 pb-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-4 pb-8">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
              <p className="text-sm">Δεν υπάρχουν προϊόντα</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onSelectProduct?.(product)}
                  className="group bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-md active:scale-95 transition-all border-2 border-gray-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-1">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-xl bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="px-2 py-2">
                    <h3 className="font-medium text-gray-800 text-xs leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
