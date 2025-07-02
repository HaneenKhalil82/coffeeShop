import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPhone, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaCoffee, FaUsers, FaHeart } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useRTL } from '../App'

const Home = () => {
  const { isArabic } = useRTL()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    date: '',
    time: '',
    phone: '',
    message: ''
  })

  const heroSlides = [
    {
      image: '/images/bg_1.jpg',
      subtitle: 'أهلاً وسهلاً',
      title: 'أفضل تجربة لتذوق القهوة',
      description: 'نقدم لكم أجود أنواع القهوة المحمصة حديثاً في جو مريح وأجواء رائعة'
    },
    {
      image: '/images/bg_2.jpg',
      subtitle: 'Welcome',
      title: 'Amazing Taste & Beautiful Place',
      description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.'
    },
    {
      image: '/images/bg_3.jpg',
      subtitle: 'Welcome',
      title: 'Creamy Hot and Ready to Serve',
      description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.'
    }
  ]

  const services = [
    {
      icon: FaCoffee,
      title: 'Coffee Beans',
      description: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life'
    },
    {
      icon: FaUsers,
      title: 'Coffee & Pastry',
      description: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life'
    },
    {
      icon: FaHeart,
      title: 'Non Dairy',
      description: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life'
    }
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroSlides.length])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', formData)
    // Handle form submission
  }

  const content = isArabic ? {
    hero: {
      subtitle: 'أهلاً وسهلاً',
      title: 'أفضل تجربة لتذوق القهوة',
      description: 'نقدم لكم أجود أنواع القهوة المحمصة حديثاً في جو مريح وأجواء رائعة',
      orderButton: 'اطلب الآن',
      menuButton: 'تصفح القائمة'
    },
    welcome: {
      title: 'مرحباً بكم في مقهى المزيج',
      description: 'استمتعوا بأجود أنواع القهوة في أجواء جميلة. نقدم حبوب القهوة المحمصة طازجة والمعجنات اللذيذة في بيئة مريحة ودافئة.'
    },
    services: {
      title: 'خدماتنا',
      subtitle: 'ما نقدمه لكم',
      items: [
        {
          title: 'قهوة عربية أصيلة',
          description: 'نقدم أجود أنواع القهوة العربية المحمصة بعناية لتمنحكم طعماً لا يُنسى'
        },
        {
          title: 'معجنات وحلويات',
          description: 'مجموعة متنوعة من المعجنات الطازجة والحلويات اللذيذة التي تكمل تجربة القهوة'
        },
        {
          title: 'أجواء مريحة',
          description: 'استمتعوا بأجواء هادئة ومريحة مثالية للاسترخاء أو العمل أو اللقاءات مع الأصدقاء'
        }
      ]
    },
    about: {
      subtitle: 'اكتشفوا',
      title: 'قصتنا',
      description: 'بدأت رحلتنا من حب القهوة الأصيل والرغبة في تقديم تجربة فريدة لعشاق القهوة. نختار أجود حبوب القهوة من أفضل المزارع ونحمصها بعناية فائقة لنضمن لكم طعماً استثنائياً في كل رشفة. مقهانا ليس مجرد مكان لشرب القهوة، بل هو ملتقى للأصدقاء ومكان للإبداع والاسترخاء.',
      button: 'اقرأ المزيد'
    }
  } : {
    hero: {
      subtitle: 'Welcome',
      title: 'The Best Coffee Testing Experience',
      description: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
      orderButton: 'Order Now',
      menuButton: 'View Menu'
    },
    welcome: {
      title: 'Welcome to CoffeeBlend',
      description: 'Experience the finest coffee in a beautiful atmosphere. We serve freshly roasted coffee beans and delicious pastries in a cozy environment.'
    },
    services: {
      title: 'Coffee',
      subtitle: 'Coffee Services',
      items: [
        {
          title: 'Authentic Arabic Coffee',
          description: 'We serve the finest Arabic coffee beans, carefully roasted to give you an unforgettable taste'
        },
        {
          title: 'Pastries & Sweets',
          description: 'A variety of fresh pastries and delicious sweets that complement your coffee experience'
        },
        {
          title: 'Cozy Atmosphere',
          description: 'Enjoy a quiet and comfortable atmosphere perfect for relaxation, work, or meetings with friends'
        }
      ]
    },
    about: {
      subtitle: 'Discover',
      title: 'Our Story',
      description: 'Our journey began with a genuine love for coffee and a desire to provide a unique experience for coffee lovers. We select the finest coffee beans from the best farms and roast them with exceptional care to ensure you an extraordinary taste in every sip.',
      button: 'Read More'
    }
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/bg_1.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container-custom h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl">
            <span className="text-primary text-lg font-semibold mb-4 block arabic-heading-font">
              {content.hero.subtitle}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight arabic-heading-font">
              {content.hero.title}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 arabic-body">
              {content.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-primary">
                {content.hero.orderButton}
              </Link>
              <Link to="/menu" className="btn-secondary">
                {content.hero.menuButton}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8 arabic-heading-font">
              {content.welcome.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto arabic-body leading-relaxed">
              {content.welcome.description}
            </p>
          </div>
        </div>
      </section>

      {/* Info & Booking Section */}
      <section className="bg-white py-0">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row shadow-lg bg-white">
            {/* Contact Info */}
            <div className="lg:flex-1 bg-gray-50 p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="text-primary text-2xl">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">000 (123) 456 7890</h3>
                    <p className="text-gray-600">A small river named Duden flows by their place and supplies.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-primary text-2xl">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">198 West 21th Street</h3>
                    <p className="text-gray-600">203 Fake St. Mountain View, San Francisco, California, USA</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-primary text-2xl">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Open Monday-Friday</h3>
                    <p className="text-gray-600">8:00am - 9:00pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:w-96 bg-primary p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-white mb-6">Book a Table</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-primary"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="3"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-primary resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-primary py-3 px-6 rounded font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  Make Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-lg arabic-heading-font">
              {content.services.title}
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 arabic-heading-font">
              {content.services.subtitle}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.items.map((service, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary text-2xl">
                    {index === 0 ? '☕' : index === 1 ? '🥐' : '🏡'}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 arabic-heading-font">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed arabic-body">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="h-96 lg:h-full bg-cover bg-center rounded-lg"
              style={{ backgroundImage: 'url(/images/about.jpg)' }}
            />
            <div className="space-y-6">
              <div>
                <span className="text-primary font-semibold text-lg arabic-heading-font">
                  {content.about.subtitle}
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6 arabic-heading-font">
                  {content.about.title}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed arabic-body">
                {content.about.description}
              </p>
              <Link 
                to="/about" 
                className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 transition-colors duration-300"
              >
                {content.about.button}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 