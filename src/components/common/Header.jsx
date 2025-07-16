import React from 'react'
import { useRTL } from '../../App'


const Header = () => {
const { isArabic } = useRTL()


 

  const content2 = isArabic
    ? {
        subtitle: 'اكتشف',
        title: 'قصتنا',
        paragraph:
          ' بدأت رحلتنا في عام 2018 بحلم بسيط: تقديم أفضل قهوة في المنطقة. انطلقنا من شغفنا العميق بالقهوة وإيماننا بأن كوب القهوة الجيد يمكن أن يغير يوم شخص ما. نختار حبوب القهوة بعناية فائقة من أفضل المزارع حول العالم. كل حبة قهوة تمر بعملية فحص دقيق لضمان الجودة العالية. نحمص قهوتنا يومياً لنضمن الطعم الطازج والرائحة العطرة. قهانا ليس مجرد مكان لتقديم القهوة، بل هو مجتمع صغير يجمع محبي القهوة وعشاق الأجواء الهادئة. نؤمن بأهمية خلق مساحة آمنة ومريحة حيث يمكن للناس الاسترخاء والعمل والتواصل.'
      }
    : {
        subtitle: 'Discover',
        title: 'Our Story',
        paragraph:
          "Our journey began in 2018 with a simple dream: to serve the best coffee in the region. We started with a deep passion for coffee and a belief that a good cup of coffee can change someone's day. We carefully select our coffee beans from the finest farms around the world. Every coffee bean goes through a rigorous inspection process to ensure high quality. We roast our coffee daily to guarantee fresh taste and aromatic fragrance. Our café is not just a place to serve coffee, but a small community that brings together coffee lovers and those who appreciate peaceful atmospheres. We believe in the importance of creating a safe and comfortable space where people can relax, work, and connect."
      }

  return (
    <div className=" m-0">
      <div className="relative w-full h-screen flex">
        {/* Left Image */}
        <div className="w-1/2 h-full">
          <img
            src="/images/bg_4.jpg"
            alt="Left"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Image */}
        <div className="w-1/2 h-full">
          <img
            src="/images/about.jpg"
            alt="Right"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay Text Box */}
        <div
          className={`absolute top-1/2 left-[43%] w-[40%] h-[70%] bg-black/40 text-gray-400 p-3 m-1 rounded-lg backdrop-blur-sm shadow-lg transform -translate-y-1/2
             ${isArabic ? 'text-left rtl ' : 'text-right ltr'}`}
        >
          <div className="heading-section">
            <span
              className="subheading text-[#c49b63] text-[50px] leading-none"
              style={{ fontFamily: '"Great Vibes", cursive' }}
            >
              {content2.subtitle}
            </span>
            <h2
              className="mb-0 text-[30px] text-white p-2"
              style={{ fontFamily: '"Josefin Sans", Arial, sans-serif' }}
            >
              {content2.title}
            </h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed opacity-90 p-2">
            {content2.paragraph}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header
