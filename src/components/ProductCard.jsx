import { Link } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  // Normalizar campos para compatibilidad
  const productName = product.nombre || product.name || 'Cubo sin nombre'
  const productImage = product.imagen || product.image
  const productBrand = product.marca || product.brand
  const productDescription = product.description || product.descripcion

  // Obtener descripción corta (primeros 80 caracteres)
  const getShortDescription = (description) => {
    if (!description) return 'Cubo de Rubik de alta calidad'
    return description.length > 80 
      ? description.substring(0, 80) + '...' 
      : description
  }

  // Obtener tipo (preferir 'tipo' sobre 'category')
  const getType = () => {
    return product.tipo || product.category || 'Cubo'
  }

  // Obtener etiqueta de categoría para el badge
  const getCategoryLabel = (category) => {
    // Si el producto tiene una categoría específica de precio
    if (product.precio >= 50000) {
      return 'PRO'
    }
    if (product.precio >= 20000 && product.precio < 50000) {
      return 'MEDIO'
    }
    if (product.precio < 10000) {
      return 'BÁSICO'
    }
    
    // Etiquetas por tipo de cubo
    const labels = {
      '3x3': 'BARATO',
      '2x2': 'BÁSICO',
      '4x4': 'MEDIO',
      '5x5': 'AVANZADO',
      'pyraminx': 'BÁSICO',
      'pack': 'PACK',
      'accesorios': 'ACCESORIO'
    }
    return labels[category] || 'BARATO'
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {productImage ? (
          <img src={productImage} alt={productName} />
        ) : (
          <div className="product-placeholder">🧩</div>
        )}
        {product.stock <= 0 && (
          <div className="product-overlay">
            <span className="out-of-stock-badge">Agotado</span>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-name-row">
          <h3 className="product-name">{productName}</h3>
          <div className="product-type-badge">
            {getCategoryLabel(getType())}
          </div>
        </div>
        
        <p className="product-description-short">
          {getShortDescription(productDescription)}
        </p>
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <Link 
            to={`/product/${product.id}`} 
            className="btn-view-detail"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
