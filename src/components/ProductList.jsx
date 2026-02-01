import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { getProducts, getProductsByCategory } from '../firebase/products'
import './ProductList.css'

function ProductList({ category = null }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = category 
          ? await getProductsByCategory(category)
          : await getProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar productos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category])

  if (loading) {
    return <div className="loading">Cargando productos...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (products.length === 0) {
    return <div className="no-products">No hay productos disponibles</div>
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList
