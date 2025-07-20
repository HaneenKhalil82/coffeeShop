import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useRTL } from '../App'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { isArabic } = useRTL()

  const content = isArabic ? {
    companyDescription: 'اكتشفوا عالم القهوة معنا واستمتعوا بتجربة فريدة تجمع بين الجودة والأصالة',
    quickLinks: {
      title: 'روابط سريعة',
      links: [
        { path: '/', label: 'الرئيسية' },
        { path: '/about', label: 'من نحن' },
        { path: '/menu', label: 'قائمة الطعام' },

        { path: '/contact', label: 'اتصل بنا' }
      ]
    },

    contact: {
      title: 'هل لديكم أسئلة؟',
      address: 'الفرع الأول : مصر -بني سويف-الأباصيري ',
      address2: 'الفرع الثاني : مصر -بني سويف-شارع عبد السلام عارف',
      phone: '+2011 112 007 610',
      email: 'blalra77ma@gmail.com  '
    },
    copyright: `حقوق الطبع والنشر ©${currentYear} جميع الحقوق محفوظة`,
    links: {
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة'
    }
  } : {
    companyName: 'CoffeeBlend',
    companyDescription: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
    quickLinks: {
      title: 'Quick Links',
      links: [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/menu', label: 'Menu' },

        { path: '/contact', label: 'Contact' }
      ]
    },

    contact: {
      title: 'Have a Questions?',
      address: '203 Fake St. Mountain View, San Francisco, California, USA',
      phone: '+2 392 3929 210',
      email: 'info@yourdomain.com'
    },
    copyright: `Copyright ©${currentYear} All rights reserved | This template is made with by CoffeeBlend`,
    links: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    }
  }

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://www.facebook.com', label: 'Facebook' },
   { icon: FaTwitter, href: 'https://x.com', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://www.instagram.com', label: 'Instagram' },
    { icon: FaLinkedinIn, href: 'https://www.linkedin.com', label: 'LinkedIn' }
  ]

  return (
    <footer className="bg-cover bg-center bg-no-repeat relative bg-[#120f0f]" 
    // style={{ backgroundImage: 'url(/images/hhh.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/80"></div>
      <div className="w-full px-4 md:px-6 lg:px-8 section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary arabic-heading-font">
              {content.companyName}
            </h3>
            <p className="text-gray-300 leading-relaxed arabic-body">
              {content.companyDescription}
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg text-primary font-semibold mb-6 arabic-heading-font">
              {content.quickLinks.title}
            </h4>
            <ul className="space-y-3">
              {content.quickLinks.links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary transition-colors duration-300 arabic-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>



          {/* Contact Info */}
          <div>
            <h4 className="text-lg text-primary font-semibold mb-6 arabic-heading-font">
              {content.contact.title}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <FaMapMarkerAlt className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300 arabic-body">
                  {content.contact.address} 
                </span>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <FaMapMarkerAlt className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300 arabic-body">
                  {content.contact.address2} 
                </span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <FaPhone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300 arabic-body" dir="ltr">
                  {content.contact.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <FaEnvelope className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300 arabic-body" dir="ltr">
                  {content.contact.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className=" mt-12 pt-8 center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm arabic-body">
              {content.copyright}
            </p>
           
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 