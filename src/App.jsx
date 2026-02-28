import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutFailure from './pages/CheckoutFailure'
import CheckoutPending from './pages/CheckoutPending'
import TransferInstructions from './pages/TransferInstructions'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import OrderDetail from './pages/OrderDetail'
import Admin from './pages/Admin'
import FirebaseDiagnostics from './pages/FirebaseDiagnostics'
import { isAdmin } from './utils/admin'
import './App.css'

// Componente para proteger la ruta de admin
function ProtectedAdminRoute({ children }) {
  const { currentUser } = useAuth()
  
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  
  if (!isAdmin(currentUser)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/transfer" element={<TransferInstructions />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/failure" element={<CheckoutFailure />} />
                <Route path="/checkout/pending" element={<CheckoutPending />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/firebase-diagnostics" element={<FirebaseDiagnostics />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedAdminRoute>
                      <Admin />
                    </ProtectedAdminRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
