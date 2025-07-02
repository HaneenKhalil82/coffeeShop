import React from 'react'
import { useRTL } from '../App'

const About = () => {
  const { isArabic } = useRTL()

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
    team: {
      title: 'فريقنا',
      description: 'فريق من الخبراء المتحمسين لتقديم أفضل تجربة قهوة',
      members: [
        {
          name: 'أحمد المحمد',
          role: 'مؤسس ومدير عام',
          image: '/images/person_2.jpg'
        },
        {
          name: 'فاطمة السعد',
          role: 'خبيرة تحميص القهوة',
          image: '/images/person_3.jpg'
        },
        {
          name: 'محمد العلي',
          role: 'مدير العمليات',
          image: '/images/person_4.jpg'
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
    team: {
      title: 'Our Team',
      description: 'A team of experts passionate about delivering the best coffee experience',
      members: [
        {
          name: 'Ahmed Al-Mohammed',
          role: 'Founder & General Manager',
          image: '/images/person_2.jpg'
        },
        {
          name: 'Fatima Al-Saad',
          role: 'Coffee Roasting Expert',
          image: '/images/person_3.jpg'
        },
        {
          name: 'Mohammed Al-Ali',
          role: 'Operations Manager',
          image: '/images/person_4.jpg'
        }
      ]
    }
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
            <div className="space-x-4 space-x-reverse">
              <button className="bg-white text-primary px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg lg:text-xl">
                {isArabic ? 'زوروا مقهانا' : 'Visit Our Café'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 