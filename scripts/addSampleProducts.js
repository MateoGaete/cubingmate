// Script de ejemplo para agregar productos de muestra a Firebase
// Ejecuta este script desde la raíz del proyecto después de configurar Firebase

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// ⚠️ IMPORTANTE: Reemplaza con tus credenciales de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Productos de ejemplo
const sampleProducts = [
  {
    nombre: "Cubo Rubik 3x3 Speedcube Pro",
    marca: "GAN",
    tipo: "3x3",
    category: "3x3",
    description: "Cubo de alta velocidad diseñado para competencias profesionales. Mecanismo suave y estable con sistema de ajuste magnético.",
    price: 25000,
    stock: 30,
    imagen: "https://via.placeholder.com/400x400?text=Cubo+3x3"
  },
  {
    nombre: "Cubo Rubik 2x2 Mini",
    marca: "MoYu",
    tipo: "2x2",
    category: "2x2",
    description: "Perfecto para principiantes. Tamaño compacto ideal para llevar a todas partes. Mecanismo suave y estable.",
    price: 8000,
    stock: 50,
    imagen: "https://via.placeholder.com/400x400?text=Cubo+2x2"
  },
  {
    nombre: "Cubo Rubik 4x4 Master",
    marca: "QiYi",
    tipo: "4x4",
    category: "4x4",
    description: "Desafío intermedio para cubistas avanzados. Mecanismo mejorado para giros suaves y precisos.",
    price: 35000,
    stock: 20,
    imagen: "https://via.placeholder.com/400x400?text=Cubo+4x4"
  },
  {
    nombre: "Cubo Rubik 5x5 Professor",
    marca: "YJ",
    tipo: "5x5",
    category: "5x5",
    description: "El desafío definitivo. Para los más experimentados en el mundo del cubing. Mecanismo profesional.",
    price: 45000,
    stock: 15,
    imagen: "https://via.placeholder.com/400x400?text=Cubo+5x5"
  },
  {
    nombre: "Speedcube GAN 356 X",
    marca: "GAN",
    tipo: "3x3",
    category: "speedcubes",
    description: "Speedcube profesional de alta gama. Utilizado por campeones mundiales. Sistema GES Pro y núcleo magnético.",
    price: 55000,
    stock: 10,
    imagen: "https://via.placeholder.com/400x400?text=GAN+356"
  },
  {
    nombre: "Pyraminx Profesional",
    marca: "MoYu",
    tipo: "pyraminx",
    category: "accesorios",
    description: "Pyraminx de alta calidad con mecanismo suave. Perfecto para competencias y práctica.",
    price: 18000,
    stock: 25,
    imagen: "https://via.placeholder.com/400x400?text=Pyraminx"
  },
  {
    nombre: "Lubricante para Cubos",
    marca: "CubingMate",
    tipo: "accesorios",
    category: "accesorios",
    description: "Lubricante especializado para mantener tus cubos en perfecto estado. Aumenta la velocidad y suavidad.",
    price: 5000,
    stock: 100,
    imagen: "https://via.placeholder.com/400x400?text=Lubricante"
  },
  {
    nombre: "Timer de Competencia",
    marca: "SpeedTimer",
    tipo: "accesorios",
    category: "accesorios",
    description: "Timer profesional con display LED y sensores de presión. Ideal para competencias oficiales.",
    price: 30000,
    stock: 25,
    imagen: "https://via.placeholder.com/400x400?text=Timer"
  },
  {
    nombre: "Cubo Rubik 3x3 Clásico",
    marca: "Rubik's",
    tipo: "3x3",
    category: "3x3",
    description: "El cubo original. Perfecto para coleccionistas y principiantes. Diseño clásico reconocido mundialmente.",
    price: 12000,
    stock: 40,
    imagen: "https://via.placeholder.com/400x400?text=Cubo+Clasico"
  }
]

async function addProducts() {
  try {
    console.log('Agregando productos de ejemplo...')
    
    for (const product of sampleProducts) {
    // Normalizar campos: usar 'image' si 'imagen' no existe, y 'name' si 'nombre' no existe
    const normalizedProduct = {
      ...product,
      // Compatibilidad: si usa 'nombre', también agregar 'name'
      name: product.nombre || product.name,
      // Compatibilidad: si usa 'imagen', también agregar 'image'
      image: product.imagen || product.image,
      // Compatibilidad: si usa 'marca', también agregar 'brand'
      brand: product.marca || product.brand,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await addDoc(collection(db, 'products'), normalizedProduct)
      console.log(`✅ Producto agregado: ${product.name} (ID: ${docRef.id})`)
    }
    
    console.log('\n✨ ¡Todos los productos han sido agregados exitosamente!')
  } catch (error) {
    console.error('❌ Error agregando productos:', error)
  }
}

// Ejecutar el script
addProducts()
