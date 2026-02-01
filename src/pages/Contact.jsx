import { Phone, Mail, Building2 } from 'lucide-react'
import './Contact.css'

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1 className="contact-title">Contáctanos</h1>
        <p className="contact-subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
        <p className="contact-hours">Horario de atención: Lunes a Viernes de 16:00 a 18:00</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-card card-phone">
            <div className="contact-icon-wrapper phone-icon">
              <Phone size={40} strokeWidth={2} />
            </div>
            <h3>Teléfono</h3>
            <p className="contact-value">+56 9 72696956</p>
            <p className="contact-hours-info">Disponible de 16:00 a 18:00</p>
            <div className="contact-decoration"></div>
          </div>
          
          <div className="contact-card card-email">
            <div className="contact-icon-wrapper email-icon">
              <Mail size={40} strokeWidth={2} />
            </div>
            <h3>Email</h3>
            <p className="contact-value">mateogaete214@gmail.com</p>
            <p className="contact-hours-info">Disponible de 16:00 a 18:00</p>
            <div className="contact-decoration"></div>
          </div>
          
          <div className="contact-card card-company">
            <div className="contact-icon-wrapper company-icon">
              <Building2 size={40} strokeWidth={2} />
            </div>
            <h3>Nombre de la Empresa</h3>
            <p className="contact-value">CubingMate</p>
            <div className="contact-decoration"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
