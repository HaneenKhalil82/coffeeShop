import React, { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import { useRTL } from '../App'
import HeroSection from './../components/HeroSection'

const Contact = () => {
  const { isArabic } = useRTL()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [showModal, setShowModal] = useState(false)

  const content = isArabic ? {
    hero: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا لمساعدتكم'
    },
    info: {
      title: 'معلومات التواصل',
      address: {
        title: 'العنوان',
        value: 'شارع الملك فهد، حي العليا، الرياض 12345، المملكة العربية السعودية'
      },
      phone: {
        title: 'الهاتف',
        value: '+966 11 123 4567'
      },
      email: {
        title: 'البريد الإلكتروني',
        value: 'info@coffeemix.sa'
      },
      hours: {
        title: 'ساعات العمل',
        values: [
          'السبت - الخميس: 7:00 ص - 11:00 م',
          'الجمعة: 2:00 م - 11:00 م'
        ]
      }
    },
    form: {
      title: 'أرسل لنا رسالة',
      fields: {
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        subject: 'الموضوع',
        message: 'الرسالة'
      },
      placeholders: {
        name: 'اكتب اسمك الكامل',
        email: 'اكتب بريدك الإلكتروني',
        phone: 'اكتب رقم هاتفك',
        subject: 'اكتب موضوع الرسالة',
        message: 'اكتب رسالتك هنا...'
      },
      button: 'إرسال الرسالة'
    },
    social: {
      title: 'تابعونا على وسائل التواصل الاجتماعي',
      description: 'ابقوا على اطلاع بآخر أخبارنا وعروضنا الخاصة'
    }
  } : {
    hero: {
      title: 'Contact Us',
      subtitle: 'We\'re Here to Help'
    },
    info: {
      title: 'Contact Information',
      address: {
        title: 'Address',
        value: 'King Fahd Road, Al Olaya District, Riyadh 12345, Saudi Arabia'
      },
      phone: {
        title: 'Phone',
        value: '+966 11 123 4567'
      },
      email: {
        title: 'Email',
        value: 'info@coffeemix.sa'
      },
      hours: {
        title: 'Opening Hours',
        values: [
          'Saturday - Thursday: 7:00 AM - 11:00 PM',
          'Friday: 2:00 PM - 11:00 PM'
        ]
      }
    },
    form: {
      title: 'Send Us a Message',
      fields: {
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone Number',
        subject: 'Subject',
        message: 'Message'
      },
      placeholders: {
        name: 'Enter your full name',
        email: 'Enter your email',
        phone: 'Enter your phone number',
        subject: 'Enter message subject',
        message: 'Write your message here...'
      },
      button: 'Send Message'
    },
    social: {
      title: 'Follow Us on Social Media',
      description: 'Stay updated with our latest news and special offers'
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    // Show success modal
    setShowModal(true)
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook', color: 'bg-blue-600' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'bg-blue-400' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'bg-pink-600' }
  ]

  return (

   <div className="pt-20 md:pt-24">
     <HeroSection
        backgroundImage="/images/bg13.jpeg"
        title={isArabic ? " اتصل بنا" : "Contact Us"}
      />
    <div className="pt-16 md:pt-20 relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
      <div className="absolute inset-0"></div>

      {/* Contact Information and Form */}
      <section className="section-padding relative z-10">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8 backdrop-blur-sm rounded-xl p-8 border-2 border-primary/30">
              <div>
                <h2 className="text-3xl font-bold mb-8 arabic-heading-font text-primary">
                  {content.info.title}
                </h2>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 arabic-heading-font text-white">
                    {content.info.address.title}
                  </h3>
                  <p className="text-gray-300 text-xl arabic-body">
                    {content.info.address.value}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 arabic-heading-font text-white">
                    {content.info.phone.title}
                  </h3>
                  <p className="text-gray-300 text-xl arabic-body" dir="ltr">
                    {content.info.phone.value}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 arabic-heading-font text-white">
                    {content.info.email.title}
                  </h3>
                  <p className="text-gray-300 text-xl arabic-body" dir="ltr">
                    {content.info.email.value}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaClock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 arabic-heading-font text-white">
                    {content.info.hours.title}
                  </h3>
                  {content.info.hours.values.map((time, index) => (
                    <p key={index} className="text-gray-300 text-xl arabic-body">
                      {time}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="backdrop-blur-sm p-8 rounded-xl border-2 border-primary/30">
              <h2 className="text-3xl font-bold mb-8 arabic-heading-font text-primary">
                {content.form.title}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-xl font-medium text-white mb-2 arabic-body">
                    {content.form.fields.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={content.form.placeholders.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300 arabic-body"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-xl font-medium text-white mb-2 arabic-body">
                      {content.form.fields.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={content.form.placeholders.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300 arabic-body"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-xl font-medium text-white mb-2 arabic-body">
                      {content.form.fields.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={content.form.placeholders.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300 arabic-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-xl font-medium text-white mb-2 arabic-body">
                    {content.form.fields.subject}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={content.form.placeholders.subject}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300 arabic-body"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-xl font-medium text-white mb-2 arabic-body">
                    {content.form.fields.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={content.form.placeholders.message}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300 arabic-body resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
                >
                  {content.form.button}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 relative z-10">
        <div className="w-full px-4 md:px-6 lg:px-8 text-center backdrop-blur-sm rounded-xl mx-auto max-w-4xl p-8 border-2 border-primary/30">
          <h2 className="text-3xl font-bold mb-4 arabic-heading-font text-primary">
            {content.social.title}
          </h2>
          <p className="text-gray-300 mb-8 arabic-body">
            {content.social.description}
          </p>
          
          <div className="flex justify-center space-x-6 space-x-reverse">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 backdrop-blur-sm shadow-2xl border-2 border-primary/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 arabic-heading-font">
                {isArabic ? 'تم الإرسال بنجاح!' : 'Message Sent Successfully!'}
              </h3>
              <p className="text-gray-600 mb-6 arabic-body">
                {isArabic 
                  ? 'شكراً لتواصلكم معنا. سنقوم بالرد عليكم في أقرب وقت ممكن.'
                  : 'Thank you for contacting us. We will get back to you as soon as possible.'
                }
              </p>
              <button
                onClick={closeModal}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
              >
                {isArabic ? 'حسناً' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  </div>
  )
}

export default Contact 