import React, { useState, useEffect } from 'react'
import { useRTL } from '../App'
import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCoffee, FaUsers, FaAward, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const About = () => {
  const { isArabic } = useRTL()
  const [showNewsletterModal, setShowNewsletterModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [stats, setStats] = useState({ customers: 0, coffees: 0, years: 0, awards: 0 })
  const [email, setEmail] = useState('')

  const content = isArabic ? {
    hero: {
      title: 'من نحن',
      subtitle: 'تعرفوا على قصتنا'
    },
    story: {
      title: 'قصة مقهى المزيج',
      description: [
        'بدأت رحلتنا في عام 2018 بحلم بسيط: تقديم أفضل قهوة في المنطقة. انطلقنا من شغفنا العميق بالقهوة وإيماننا بأن كوب القهوة الجيد يمكن أن يغير يوم شخص ما.',
        'نختار حبوب القهوة بعناية فائقة من أفضل المزارع حول العالم. كل حبة قهوة تمر بعملية فحص دقيق لضمان الجودة العالية. نحمص قهوتنا يومياً لنضمن الطعم الطازج والرائحة العطرة.',
        'مقهانا ليس مجرد مكان لتقديم القهوة، بل هو مجتمع صغير يجمع محبي القهوة وعشاق الأجواء الهادئة. نؤمن بأهمية خلق مساحة آمنة ومريحة حيث يمكن للناس الاسترخاء والعمل والتواصل.'
      ]
    },
    values: {
      title: 'قيمنا',
      items: [
        {
          title: 'الجودة',
          description: 'نلتزم بتقديم أعلى مستويات الجودة في كل ما نقدمه، من حبوب القهوة إلى الخدمة'
        },
        {
          title: 'الأصالة',
          description: 'نحافظ على الطرق التقليدية في تحضير القهوة مع لمسة عصرية'
        },
        {
          title: 'المجتمع',
          description: 'نسعى لبناء مجتمع قوي من محبي القهوة والثقافة'
        },
        {
          title: 'الاستدامة',
          description: 'نهتم بالبيئة ونتعامل مع موردين يشاركوننا نفس القيم'
        }
      ]
    },
    
    
    faq: {
      title: 'أسئلة شائعة',
      items: [
        {
          question: 'ما هي ساعات العمل؟',
          answer: 'نحن مفتوحون يومياً من 7:00 صباحاً حتى 11:00 مساءً'
        },
        {
          question: 'هل تقدمون خدمة التوصيل؟',
          answer: 'نعم، نقدم خدمة التوصيل في جميع أنحاء المدينة خلال 30 دقيقة'
        },
        {
          question: 'هل يمكنني حجز طاولة؟',
          answer: 'نعم، يمكنكم حجز طاولة عبر الاتصال بنا أو من خلال تطبيقنا'
        }
      ]
    }
  } : {
    hero: {
      title: 'About Us',
      subtitle: 'Discover Our Story'
    },
    story: {
      title: 'The CoffeeBlend Story',
      description: [
        'Our journey began in 2018 with a simple dream: to serve the best coffee in the region. We started with a deep passion for coffee and a belief that a good cup of coffee can change someone\'s day.',
        'We carefully select our coffee beans from the finest farms around the world. Every coffee bean goes through a rigorous inspection process to ensure high quality. We roast our coffee daily to guarantee fresh taste and aromatic fragrance.',
        'Our café is not just a place to serve coffee, but a small community that brings together coffee lovers and those who appreciate peaceful atmospheres. We believe in the importance of creating a safe and comfortable space where people can relax, work, and connect.'
      ]
    },
    values: {
      title: 'Our Values',
      items: [
        {
          title: 'Quality',
          description: 'We are committed to providing the highest levels of quality in everything we offer, from coffee beans to service'
        },
        {
          title: 'Authenticity',
          description: 'We preserve traditional methods of coffee preparation with a modern touch'
        },
        {
          title: 'Community',
          description: 'We strive to build a strong community of coffee and culture lovers'
        },
        {
          title: 'Sustainability',
          description: 'We care about the environment and work with suppliers who share our values'
        }
      ]
    },
  
    
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What are your opening hours?',
          answer: 'We are open daily from 7:00 AM to 11:00 PM'
        },
        {
          question: 'Do you offer delivery service?',
          answer: 'Yes, we offer delivery service throughout the city within 30 minutes'
        },
        {
          question: 'Can I make a reservation?',
          answer: 'Yes, you can make a reservation by calling us or through our app'
        }
      ]
    }
  }

  // Animated counter effect
  useEffect(() => {
    const targetStats = { customers: 5000, coffees: 50000, years: 6, awards: 15 }
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    const timers = Object.keys(targetStats).map((key) => {
      const increment = targetStats[key] / steps
      let currentValue = 0

      return setInterval(() => {
        currentValue += increment
        if (currentValue >= targetStats[key]) {
          currentValue = targetStats[key]
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(currentValue) }))
      }, stepDuration)
    })

    const timeout = setTimeout(() => {
      timers.forEach(timer => clearInterval(timer))
    }, duration)

    return () => {
      timers.forEach(timer => clearInterval(timer))
      clearTimeout(timeout)
    }
  }, [])

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    alert(isArabic ? 'شكراً لاشتراكك في النشرة الإخبارية!' : 'Thank you for subscribing to our newsletter!')
    setEmail('')
    setShowNewsletterModal(false)
  }

  return (
    <div className="pt-16 md:pt-20 relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/hhh.jpg)' }}>
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Story Section */}
      <section className="section-padding relative z-10">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-none mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center mb-20 w-full">
            <div
              className="h-[550px] bg-cover bg-center rounded-xl shadow-2xl w-full border-2 border-primary/30 lg:col-span-3"
              style={{ backgroundImage: 'url(/images/about2.webp)' }}
            />
            <div className="space-y-8 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-8 md:p-10 lg:p-12 lg:col-span-2">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold arabic-heading-font text-primary">
                {content.story.title}
              </h2>
              {content.story.description.map((paragraph, index) => (
                <p key={index} className="text-gray-300 leading-relaxed arabic-body text-base sm:text-lg lg:text-xl">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding relative z-10">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 arabic-heading-font text-primary">
              {content.values.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {content.values.items.map((value, index) => (
              <div key={index} className="text-center p-8 backdrop-blur-sm rounded-xl shadow-2xl border border-primary/20 hover:border-primary/80 transition-all duration-300">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/80">
                  <span className="text-primary text-3xl font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-3xl sm:text-2xl font-semibold mb-4 arabic-heading-font text-primary">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-2xl arabic-body text-base sm:text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-padding relative z-10">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 backdrop-blur-sm  rounded-xl p-8 border-2 border-primary/30">
            <div className="text-center">
              <FaUsers className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{stats.customers.toLocaleString()}</div>
              <p className="text-gray-300 arabic-body">{isArabic ? 'عميل سعيد' : 'Happy Customers'}</p>
            </div>
            <div className="text-center">
              <FaCoffee className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{stats.coffees.toLocaleString()}</div>
              <p className="text-gray-300 arabic-body">{isArabic ? 'كوب قهوة' : 'Cups Served'}</p>
            </div>
            <div className="text-center">
              <FaHeart className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{stats.years}</div>
              <p className="text-gray-300 arabic-body">{isArabic ? 'سنوات خبرة' : 'Years Experience'}</p>
            </div>
            <div className="text-center">
              <FaAward className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{stats.awards}</div>
              <p className="text-gray-300 arabic-body">{isArabic ? 'جائزة' : 'Awards Won'}</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* FAQ Section */}
      <section className="section-padding relative z-10">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 arabic-heading-font text-primary">
              {content.faq.title}
            </h2>
          </div>
          
          <div className="space-y-4">
            {content.faq.items.map((item, index) => (
              <div key={index} className="backdrop-blur-sm  rounded-xl border-2 border-primary/30">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-primary/10 transition-colors duration-300"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-white arabic-heading-font">{item.question}</h3>
                  {expandedFAQ === index ? (
                    <FaChevronUp className="text-primary" />
                  ) : (
                    <FaChevronDown className="text-primary" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 arabic-body">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding relative z-10">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto text-center">
          <div className="backdrop-blur-sm bg-primary/90 rounded-xl p-10 md:p-14 lg:p-16 shadow-2xl border border-primary/30">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 arabic-heading-font text-white">
              {isArabic ? 'انضموا إلى مجتمعنا' : 'Join Our Community'}
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl mb-10 max-w-4xl mx-auto text-white/90 arabic-body leading-relaxed">
              {isArabic 
                ? 'اكتشفوا عالم القهوة معنا واستمتعوا بتجربة فريدة تجمع بين الجودة والأصالة'
                : 'Discover the world of coffee with us and enjoy a unique experience that combines quality and authenticity'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowContactModal(true)}
                className="bg-white text-primary px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg lg:text-xl"
              >
                {isArabic ? 'تواصل معنا' : 'Contact Us'}
              </button>
              <button 
                onClick={() => setShowNewsletterModal(true)}
                className="bg-transparent border-2 border-white text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg lg:text-xl"
              >
                {isArabic ? 'اشترك في النشرة' : 'Subscribe Newsletter'}
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Newsletter Modal */}
      {showNewsletterModal && (
        <div className="fixed inset-0  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 arabic-heading-font">
                  {isArabic ? 'اشترك في النشرة الإخبارية' : 'Subscribe to Newsletter'}
                </h3>
                <button
                  onClick={() => setShowNewsletterModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isArabic ? 'ادخل بريدك الإلكتروني' : 'Enter your email'}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
                >
                  {isArabic ? 'اشترك' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 arabic-heading-font">
                  {isArabic ? 'تواصل معنا' : 'Contact Us'}
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-primary" />
                  <span className="text-gray-700">+966 11 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-primary" />
                  <span className="text-gray-700">info@coffeemix.sa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-primary" />
                  <span className="text-gray-700">
                    {isArabic ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default About 