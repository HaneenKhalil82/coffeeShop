import React from 'react'
import { Link } from 'react-router-dom'
import { useRTL } from '../App'
import HeroSlider from '../components/HeroSlider'
import ProductsSection from '../components/ProductsSection'
import Header from '../components/common/Header'

const Home = () => {
  const { isArabic } = useRTL()

  // Hero slider data
  const heroSlides = isArabic ? [
    {
      image: '/images/latest_blog2.jpg',
      subtitle: 'أهلاً وسهلاً',
      title: 'أفضل تجربة لتذوق القهوة',
      description: 'استمتعوا بتجربة فريدة من نوعها مع أجود أنواع القهوة المحمصة بعناية فائقة',
      buttons: [
        {
          text: 'اطلبوا الآن',
          link: '/Menu',
          className: 'btn-primary'
        },
        {
          text: 'تصفحوا القائمة',
          link: '/menu',
          className: 'btn-secondary'
        }
      ]
    },
    {
      image: '/images/chat.png',
      subtitle: 'قهوة مميزة',
      title: 'طعم لا يُنسى في كل رشفة',
      description: 'من أفضل مزارع القهوة في العالم، نقدم لكم تشكيلة متنوعة من النكهات الرائعة',
      buttons: [
        {
          text: 'اكتشفوا المزيد',
          link: '/about',
          className: 'btn-primary'
        },
        {
          text: 'تصفحوا القائمة',
          link: '/menu',
          className: 'btn-secondary'
        }
      ]
    },
    {
      image: '/images/02.jpg',
      subtitle: 'أجواء مثالية',
      title: 'مكان مثالي للاسترخاء والعمل',
      description: 'استمتعوا بأجواء هادئة ومريحة، مثالية للقاء الأصدقاء أو العمل في هدوء',
      buttons: [
        {
          text: 'زوروا مقهانا',
          link: '/contact',
          className: 'btn-primary'
        },

      ]
    },
    {
      image: '/images/about2.webp',
      subtitle: 'تجربة شاملة',
      title: 'من القهوة إلى الحلويات الشهية',
      description: 'تشكيلة واسعة من المشروبات الساخنة والباردة مع أشهى الحلويات والمعجنات',
      buttons: [
        {
          text: 'القائمة الكاملة',
          link: '/menu',
          className: 'btn-primary'
        },
        {
          text: 'التوصيل',
          link: '/shop',
          className: 'btn-secondary'
        }
      ]
    }
  ] : [
    {
      image: '/images/bg_1.jpg',
      subtitle: 'Welcome',
      title: 'The Best Coffee Experience',
      description: 'Enjoy a unique experience with the finest roasted coffee beans, carefully selected for perfection',
      buttons: [
        {
          text: 'Order Now',
          link: '/shop',
          className: 'btn-primary'
        },
        {
          text: 'View Menu',
          link: '/menu',
          className: 'btn-secondary'
        }
      ]
    },
    {
      image: '/images/bg_2.jpg',
      subtitle: 'Premium Coffee',
      title: 'Unforgettable Taste in Every Sip',
      description: 'From the best coffee farms around the world, we offer you a diverse selection of amazing flavors',
      buttons: [
        {
          text: 'Discover More',
          link: '/about',
          className: 'btn-primary'
        },
        {
          text: 'View Menu',
          link: '/menu',
          className: 'btn-secondary'
        }
      ]
    },
    {
      image: '/images/bg_3.jpg',
      subtitle: 'Perfect Atmosphere',
      title: 'Ideal Place to Relax and Work',
      description: 'Enjoy a quiet and comfortable atmosphere, perfect for meeting friends or working in peace',
      buttons: [
        {
          text: 'Visit Our Café',
          link: '/contact',
          className: 'btn-primary'
        },

      ]
    },
    {
      image: '/images/bg_4.jpg',
      subtitle: 'Complete Experience',
      title: 'From Coffee to Delicious Desserts',
      description: 'Wide selection of hot and cold beverages with the most delicious desserts and pastries',
      buttons: [
        {
          text: 'Full Menu',
          link: '/menu',
          className: 'btn-primary'
        },
        {
          text: 'Delivery',
          link: '/shop',
          className: 'btn-secondary'
        }
      ]
    }
  ]

  const content = isArabic ? {
    welcome: {
      title: 'مرحباً بكم في مقهى المزيج',
      description: 'نحن فخورون بتقديم أجود أنواع القهوة المحمصة طازجة يومياً. تجربة فريدة تجمع بين الطعم الأصيل والجودة العالمية.'
    },

    about: {
      subtitle: 'قصتنا',
      title: 'شغف القهوة منذ سنوات',
      description: 'بدأت رحلتنا من حلم بسيط: تقديم أفضل فنجان قهوة في المنطقة. اليوم، نحن نفخر بكوننا واحداً من أفضل المقاهي التي تقدم تجربة قهوة استثنائية تجمع بين التقاليد العريقة والحداثة.',
      button: 'اقرأ المزيد'
    }
  } : {
    welcome: {
      title: 'Welcome to CoffeeBlend',
      description: 'We are proud to serve the finest coffee beans roasted fresh daily. A unique experience that combines authentic taste with world-class quality.'
    },

    about: {
      subtitle: 'Our Story',
      title: 'Coffee Passion for Years',
      description: 'Our journey began with a simple dream: to serve the best cup of coffee in the region. Today, we pride ourselves on being one of the finest cafés offering an exceptional coffee experience that combines rich traditions with modernity.',
      button: 'Read More'
    }
  }

  return (
    <div className="pt-20 md:pt-24">
      {/* Hero Slider Section */}
      <HeroSlider 
        slides={heroSlides}
        height="h-screen"
        autoPlay={true}
        autoPlayInterval={4000}
        showArrows={false}
        showDots={false}
      />
      <Header/>
      {/* Welcome Section */}
      <section className="py-16 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
        <div className="absolute inset-0 "></div>
        <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8 arabic-heading-font text-primary">
              {content.welcome.title}
            </h2>
            <p className="text-white max-w-2xl mx-auto arabic-body leading-relaxed text-2xl">
              {content.welcome.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <ProductsSection />

      {/* About Preview Section */}
      <section className="section-padding bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/images/bg_4.jpg)' }}>
        <div className="absolute inset-0 "></div>
        <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden">
              <img 
                src="/images/cart1.jpg" 
                alt="Coffee Shop Interior" 
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            <div className="space-y-6 border-2 border-primary/40 hover:border-primary/80 transition-all duration-300 p-8 rounded-lg">
              <div>
                <span className="text-primary font-semibold text-4xl arabic-heading-font">
                  {content.about.subtitle}
                </span>
                <h2 className="text-4xl font-bold text-primary mt-2 mb-6 arabic-heading-font">
                  {content.about.title}
                </h2>
              </div>
              <p className="text-white text-2xl leading-relaxed arabic-body">
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