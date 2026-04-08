import React from 'react'
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-semibold text-lg mb-4">About Clinic 360</h3>
            <ul className="space-y-3">
              {['Our Services', 'Medical Team', 'Facilities', 'Testimonials'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-blue-400 font-semibold text-lg mb-4">Contact Us</h3>
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="w-5 h-5" />
              <span className="text-sm">+1 (234) 567-890</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-5 h-5" />
              <span className="text-sm">contact@clinic360.com</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-blue-400 font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' }
              ].map((social) => (
                <a 
                  key={social.label}
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-400">
              © 2024 <span className="text-blue-400">Clinic 360</span>. All rights reserved.
            </span>
            <div className="flex gap-6">
              {['Terms', 'Privacy', 'Cookies'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer