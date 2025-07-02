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
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative h-96">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/bg_2.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container-custom h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4 arabic-heading-font">
              {content.hero.title}
            </h1>
            <p className="text-xl opacity-90 arabic-body">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div
              className="h-96 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: 'url(/images/about.jpg)' }}
            />
            <div className="space-y-6">
              <h2 className="text-4xl font-bold arabic-heading-font">
                {content.story.title}
              </h2>
              {content.story.description.map((paragraph, index) => (
                <p key={index} className="text-gray-600 leading-relaxed arabic-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 arabic-heading-font">
              {content.values.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.values.items.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 arabic-heading-font">
                  {value.title}
                </h3>
                <p className="text-gray-600 arabic-body">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 arabic-heading-font">
              {content.team.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto arabic-body">
              {content.team.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.team.members.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 arabic-heading-font">
                  {member.name}
                </h3>
                <p className="text-primary arabic-body">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6 arabic-heading-font">
            {isArabic ? 'انضموا إلى مجتمعنا' : 'Join Our Community'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 arabic-body">
            {isArabic 
              ? 'اكتشفوا عالم القهوة معنا واستمتعوا بتجربة فريدة تجمع بين الجودة والأصالة'
              : 'Discover the world of coffee with us and enjoy a unique experience that combines quality and authenticity'
            }
          </p>
          <div className="space-x-4 space-x-reverse">
            <button className="bg-white text-primary px-8 py-3 rounded hover:bg-gray-100 transition-colors duration-300">
              {isArabic ? 'زوروا مقهانا' : 'Visit Our Café'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 