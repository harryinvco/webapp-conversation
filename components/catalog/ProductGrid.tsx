'use client'

import { Product } from '@/data/products'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onSelectProduct?: (product: Product) => void
}

export function ProductGrid({ products, onSelectProduct }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  )
}
