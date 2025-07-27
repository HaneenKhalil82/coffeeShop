import React, { useEffect, useState } from 'react'
import { useRTL } from '../App'
import HeroSection from './../components/HeroSection'
import { Link } from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import IBM Plex Sans Arabic font from Google Fonts
import './About.css'

import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCoffee, FaUsers, FaAward, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const About = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
    // Add Google Fonts link for IBM Plex Sans Arabic
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    AOS.init({ duration: 1000 });

    return () => {
      // Cleanup: remove the font link when component unmounts
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    const speed = 100;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = Math.ceil(target / speed);

            if (count < target) {
              counter.innerText = count + increment;
              setTimeout(updateCount, 20);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 1 });

    counters.forEach(counter => observer.observe(counter));
  }, []);

  const { isArabic } = useRTL()

  // Define content object for FAQ
  const content = {
    faq: {
      title: isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions',
      items: [
        {
          question: isArabic ? 'ما هي ساعات العمل؟' : 'What are your opening hours?',
          answer: isArabic ? 'نحن نعمل من الساعة 7 صباحاً حتى 11 مساءً جميع أيام الأسبوع.' : 'We are open from 7 AM to 11 PM every day of the week.'
        },
        {
          question: isArabic ? 'هل تقدمون قهوة خالية من الكافيين؟' : 'Do you serve decaf coffee?',
          answer: isArabic ? 'نعم، نقدم مجموعة متنوعة من القهوة الخالية من الكافيين.' : 'Yes, we offer a variety of decaffeinated coffee options.'
        },
        {
          question: isArabic ? 'هل يمكن حجز طاولة؟' : 'Can I make a reservation?',
          answer: isArabic ? 'نعم، يمكنكم حجز طاولة عبر الهاتف أو موقعنا الإلكتروني.' : 'Yes, you can make a reservation by phone or through our website.'
        },
        {
          question: isArabic ? 'هل تقدمون خدمة التوصيل؟' : 'Do you offer delivery service?',
          answer: isArabic ? 'نعم، نقدم خدمة التوصيل المجاني للطلبات التي تزيد عن 50 ريال.' : 'Yes, we offer free delivery for orders over 50 SAR.'
        }
      ]
    }
  };

 const testimonials = isArabic ? [
  
  {
    quote: "“يقدم المقهى مجموعة متنوعة من المشروبات الساخنة والباردة، بما في ذلك القهوة بأنواعها، والشاي، والعصائر، والمشروبات الغازية. كما يقدم وجبات خفيفة، بالإضافة إلى الحلويات اللذيذة..”",
    name: "Yasein Mohamed",
    role: " Designer",
    image: "/images/rev1.jpg",
    className: "bg-primary w-[250px] h-[250px] mt-80"
  },
  {
    quote: "“جودة القهوة ممتازة، ويتم تحضيرها بعناية فائقة. المكونات المستخدمة طازجة وعالية الجودة,تعتبر الأسعار معقولة ومناسبة للقيمة التي يقدمها المقهى.تجربتي بدأت مع اللاتيه بالفانيليا، وكان رائعًا! المذاق متوازن والقهوة محمصة بشكل ممتاز.”",
    name: "Hamza Mahmoud",
    role: "Illustrator Designer",
    image: "/images/rev2.jpg",
    className: "bg-primary/90 w-[250px] h-[300px] mt-[270px]"
  },
  {
    quote: "“الخدمة سريعة وودودة، والعاملون مدربون جيدًا ويتعاملون مع الزبائن بلطف واحترافية.لديهم تنوّع كبير في المشروبات الساخنة والباردة، مع خيارات نباتية أيضًا.”",
    name: "Tena Goreg",
    role: " Designer",
    image: "/images/rev3.jpg",
   className: "bg-primary w-[250px] h-[250px] mt-80"
  },
  {
    quote: "“يتميز المقهى بجو مريح وهادئ، مما يجعله مكانًا مثاليًا للاسترخاء والاجتماع مع الأصدقاء أو لقضاء بعض الوقت بمفردك.الخدمة ممتازة، الموظفون بشوشين وسريعين في تلبية الطلبات. ما فيش تأخير، والمكان بيحترم الخصوصية، سواء جاي تشتغل أو تقابل أصدقاء.”",
    name: "Abdallah Mohameed",
    role: " Designer",
    image: "/images/quote_img.png",
    className: "bg-primary/90 w-[250px] h-[300px] mt-[270px]"
  },
  {
    quote: "“بمجرد دخولك إلى الكافيه، تستقبلك رائحة البن الطازج والموسيقى الهادئة التي تُضفي أجواءً من الاسترخاء. التصميم الداخلي أنيق جدًا، الإضاءة دافئة، والمكان نظيف ومنظم.”",
    name: "Mohamed Ali",
    role: "Designer",
    image: "/images/person_4.jpg",
    className: "bg-primary w-[250px] h-[250px] mt-80"
    
  },
  
]:[
  {
    quote: "“Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small.”",
    name: "Louise Kelly",
    role: "Illustrator Designer",
    image: "/images/person_3.jpg",
   className: "bg-primary w-[250px] h-[250px] mt-80"
  },
  {
    quote: "“Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.”",
    name: "Louise Kelly",
    role: "Illustrator Designer",
    image: "/images/person_2.jpg",
     className: "bg-primary/90 w-[250px] h-[300px] mt-[270px]"
  },
  {
    quote: "“Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small  line of blind text by the name. ”",
    name: "Louise Kelly",
    role: "Illustrator Designer",
    image: "/images/rev3.jpg",
    className: "bg-primary w-[250px] h-[250px] mt-80"
  },
  {
    quote: "“Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small  line of blind text by the name. ”",
    name: "Louise Kelly",
    role: "Illustrator Designer",
    image: "/images/quote_img.png",
    className: "bg-primary/90 w-[250px] h-[300px] mt-[270px]"
  },
  {
    quote: "“Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however.”",
    name: "Louise Kelly",
    role: "Illustrator Designer",
    image: "/images/person_4.jpg",
   className: "bg-primary w-[250px] h-[250px] mt-80"
  },

]

 const contents = isArabic
    ? {
        subtitle: 'اكتشف',
        title: 'قائمتنا',
        description:
          'نحن فخورون بتقديم أجود أنواع القهوة المحمصة طازجة يومياً. تجربة فريدة تجمع بين الطعم الأصيل والجودة العالمية..',
      }
    : {
        subtitle: 'Discover',
        title: 'OUR MENU',
        description:
          'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live right at the coast of the Semantics, a large language ocean.',
      }
   

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
          'Our journey began in 2018 with a simple dream: to serve the best coffee in the region. We started with a deep passion for coffee and a belief that a good cup of coffee can change someone\'s day.We carefully select our coffee beans from the finest farms around the world. Every coffee bean goes through a rigorous inspection process to ensure high quality. We roast our coffee daily to guarantee fresh taste and aromatic fragrance.Our café is not just a place to serve coffee, but a small community that brings together coffee lovers and those who appreciate peaceful atmospheres. We believe in the importance of creating a safe and comfortable space where people can relax, work, and connect.'
      }

  return (
  <div className="pt-20 md:pt-24">
     <HeroSection
        backgroundImage="/images/bg13.jpeg"
        title={isArabic ? "من نحن" : "About Us"}
      />

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
    ${isArabic ? 'text-left rtl about-arabic-text' : 'text-right ltr about-english-text'}`}>
      <div className="heading-section">
        <span
          className="subheading text-[#c49b63] text-[50px] leading-none about-subtitle-ibm"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          {content2.subtitle}
        </span>
        <h2
          className="mb-0 text-[30px] text-white p-2 about-title-ibm"
        >
          {content2.title}
        </h2>
      </div>
      <p className="text-sm md:text-base leading-relaxed opacity-90 p-2 about-content-ibm">
        {content2.paragraph}
      </p>
    </div>
    {/* </div> */}


    </div>
    <div className={`relative w-full h-screen flex ${isArabic ? 'text-left rtl' : 'text-right ltr'}`}> 
      <div className="w-full h-full">
        <img
          src="/images/bg_1.jpg"
          alt="Left"
          className="w-full h-full object-cover"
        />
      </div>
       <div className="absolute top-20 left-[38%]">

          {/* Testimony  */}
        <div className="text-center">
	       <span className="subheading text-[#c49b63] text-[60px] leading-none about-subtitle-ibm" style={{ fontFamily: '"Great Vibes", cursive' }}> {isArabic ? "" : "Testimony"}</span>
	       <h2 className="mb-4 text-white text-[45px] about-title-ibm"> {isArabic ? "ماذا يقول عملائنا" : "CUSTOMERS SAYS"}</h2>
	      </div>
       </div>
      
       <div className={`absolute bottom-0 left-0 gap-0 w-full flex ${isArabic ? 'text-left rtl' : 'text-right ltr'}`}> 
         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
       
           {testimonials.map((t, index) => (
         <div
          key={index}
         className={`${t.className} text-white p-6 shadow-lg flex flex-col justify-between about-ibm-font`}>
        <p className="text-sm leading-relaxed italic mb-6 about-content-ibm">{t.quote}</p>
       <div className={`flex items-center gap-3 mt-auto ${isArabic ? 'text-left rtl' : 'text-right ltr'}`}>
         <img
          src={t.image}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover"
         />
            <div>
            <h4 className="text-sm font-semibold about-title-ibm">{t.name}</h4>
             <p className="text-xs opacity-80 about-content-ibm">{t.role}</p>
            </div>
          </div>
         </div>
             ))}
         </div>
        </div>
       
    </div>
  <section className="w-full py-20 bg-cover bg-center bg-no-repeat " style={{ backgroundImage: "url('/images/bg_4.jpg')" }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* ✅ Left: Images Grid */}
        <div className="grid grid-cols-2 gap-4">
          <img src="/images/menu-2.jpg" alt="coffee1" className="rounded-lg w-full h-auto object-cover" />
          <img src="/images/menu-1.jpg" alt="coffee2" className="rounded-lg w-full h-auto object-cover" />
          <img src="/images/menu-4.jpg" alt="coffee3" className="rounded-lg w-full h-auto object-cover" />
          <img src="/images/menu-3.jpg" alt="coffee4" className="rounded-lg w-full h-auto object-cover" />
        </div>

        <div className={`text-white text-start about-ibm-font ${isArabic ? 'about-arabic-text' : 'about-english-text'}`}>
        <span
         className="text-[#c49b63] text-[50px] block about-subtitle-ibm"
         style={{ fontFamily: '"Great Vibes", cursive' }}
        >
        {contents.subtitle}
      </span>
      <h2 className="text-4xl font-bold mb-3 about-title-ibm">{contents.title}</h2>
      <p className="text-lg opacity-80 leading-relaxed mb-8 about-content-ibm">{contents.description}</p>
    
          <Link
           to="/menu"
           className="inline-block border border-[#c49b63] text-[#c49b63] py-2 px-6 hover:bg-[#c49b63] hover:text-black transition duration-300 about-ibm-font"
           >
          {isArabic ? 'تصفح القائمة كاملة' : 'View Full Menu'}
          </Link>

        </div>

      </div>
    </section>
   
    <div className="  w-full bg-black/90 relative min-h-[400px]  bg-[1%_30%]   bg-no-repeat bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/chat.png)', }}>
     



<div className="flex justify-center gap-20 flex-wrap py-40">
  {[
    { image: '/images/choose_icon2.png', line1: 500, line2: 'Staff' },
    { image: '/images/choose_icon2.png', line1: 1280, line2: 'Happy Customer' },
    { image: '/images/choose_icon2.png', line1: 85, line2: 'Number of Awards' },
    { image: '/images/choose_icon2.png', line1: 2, line2: 'Coffee branches' }
  ].map((item, index) => (
    <div
      key={index}
      className="flex flex-col items-center group about-ibm-font"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <button className="w-24 h-24 border-2 border-[#c49b63] rounded-md transition-transform duration-300 group-hover:rotate-45 flex items-center justify-center">
        <img src={item.image} alt={`icon-${index}`} className="w-8 h-8" />
      </button>
      
      <p
        className="text-xl text-gray-300 counter about-title-ibm"
        data-count={item.line1}
      >
        0
      </p>
       <p className="mt-2 text-lg text-[#c49b63] font-semibold about-content-ibm">{item.line2}</p>
    </div>
  ))}
</div>



    </div>
  
      {/* FAQ Section */}
      <section className="section-padding relative z-10"
      style={{ backgroundImage: "url(/images/bg_4.jpg)" }}>
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-primary about-faq-title-ibm ${isArabic ? 'about-arabic-text' : 'about-english-text'}`}>
              {content.faq.title}
            </h2>
          </div>
          
          <div className="space-y-4">
            {content.faq.items.map((item, index) => (
              <div key={index} className="backdrop-blur-sm rounded-xl border-2 border-primary/30">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-primary/10 transition-colors duration-300"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <h3 className={`text-lg font-semibold text-white about-faq-title-ibm ${isArabic ? 'about-arabic-text' : 'about-english-text'}`}>{item.question}</h3>
                  {expandedFAQ === index ? (
                    <FaChevronUp className="text-primary" />
                  ) : (
                    <FaChevronDown className="text-primary" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className={`text-gray-300 about-faq-content-ibm ${isArabic ? 'about-arabic-text' : 'about-english-text'}`}>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
</div>
  )
}

export default About 



