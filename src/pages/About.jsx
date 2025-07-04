import React, { useEffect, useState } from 'react'
import { useRTL } from '../App'
import HeroSection from './../components/HeroSection'
import { Link } from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css';


import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCoffee, FaUsers, FaAward, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const About = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
  AOS.init({ duration: 1000 });
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

  // Define stats object
  const stats = {
    customers: 1280,
    coffees: 15000,
    years: 6,
    awards: 12
  };

  // Define content object for FAQ
  const content = {
    faq: {
      title: isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions',
      items: [
        {
          question: isArabic ? 'ما هي ساعات العمل؟' : 'What are your opening hours?',
          answer: isArabic ? 'نحن مفتوحون من الساعة 7 صباحاً حتى 11 مساءً جميع أيام الأسبوع.' : 'We are open from 7 AM to 11 PM every day of the week.'
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
    quote: "““Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small.””",
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
    quote: "“Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small  line of blind text by the name.”",
    name: "Louise Kelly",
    role: "Illustrator Designer",
    image: "/images/rev3.jpg",
   className: "bg-primary w-[250px] h-[250px] mt-80"
  },
  {
    quote: "“Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small  line of blind text by the name.”",
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






  // const content = isArabic ? {
  //   hero: {
  //     title: 'من نحن',
  //     subtitle: 'تعرفوا على قصتنا'
  //   },
  //   story: {
  //     title: 'قصة مقهى المزيج',
  //     description: [
  //       'بدأت رحلتنا في عام 2018 بحلم بسيط: تقديم أفضل قهوة في المنطقة. انطلقنا من شغفنا العميق بالقهوة وإيماننا بأن كوب القهوة الجيد يمكن أن يغير يوم شخص ما.',
  //       'نختار حبوب القهوة بعناية فائقة من أفضل المزارع حول العالم. كل حبة قهوة تمر بعملية فحص دقيق لضمان الجودة العالية. نحمص قهوتنا يومياً لنضمن الطعم الطازج والرائحة العطرة.',
  //       'مقهانا ليس مجرد مكان لتقديم القهوة، بل هو مجتمع صغير يجمع محبي القهوة وعشاق الأجواء الهادئة. نؤمن بأهمية خلق مساحة آمنة ومريحة حيث يمكن للناس الاسترخاء والعمل والتواصل.'
  //     ]
  //   },
  //   values: {
  //     title: 'قيمنا',
  //     items: [
  //       {
  //         title: 'الجودة',
  //         description: 'نلتزم بتقديم أعلى مستويات الجودة في كل ما نقدمه، من حبوب القهوة إلى الخدمة'
  //       },
  //       {
  //         title: 'الأصالة',
  //         description: 'نحافظ على الطرق التقليدية في تحضير القهوة مع لمسة عصرية'
  //       },
  //       {
  //         title: 'المجتمع',
  //         description: 'نسعى لبناء مجتمع قوي من محبي القهوة والثقافة'
  //       },
  //       {
  //         title: 'الاستدامة',
  //         description: 'نهتم بالبيئة ونتعامل مع موردين يشاركوننا نفس القيم'
  //       }
  //     ]
  //   },
  //   team: {
  //     title: 'فريقنا',
  //     description: 'فريق من الخبراء المتحمسين لتقديم أفضل تجربة قهوة',
  //     members: [
  //       {
  //         name: 'أحمد المحمد',
  //         role: 'مؤسس ومدير عام',
  //         image: '/images/person_2.jpg'
  //       },
  //       {
  //         name: 'فاطمة السعد',
  //         role: 'خبيرة تحميص القهوة',
  //         image: '/images/person_3.jpg'
  //       },
  //       {
  //         name: 'محمد العلي',
  //         role: 'مدير العمليات',
  //         image: '/images/person_4.jpg'
  //       }
  //     ]
  //   }
  // } : {
  //   hero: {
  //     title: 'About Us',
  //     subtitle: 'Discover Our Story'
  //   },
  //   story: {
  //     title: 'The CoffeeBlend Story',
  //     description: [
  //       'Our journey began in 2018 with a simple dream: to serve the best coffee in the region. We started with a deep passion for coffee and a belief that a good cup of coffee can change someone\'s day.',
  //       'We carefully select our coffee beans from the finest farms around the world. Every coffee bean goes through a rigorous inspection process to ensure high quality. We roast our coffee daily to guarantee fresh taste and aromatic fragrance.',
  //       'Our café is not just a place to serve coffee, but a small community that brings together coffee lovers and those who appreciate peaceful atmospheres. We believe in the importance of creating a safe and comfortable space where people can relax, work, and connect.'
  //     ]
  //   },
  //   values: {
  //     title: 'Our Values',
  //     items: [
  //       {
  //         title: 'Quality',
  //         description: 'We are committed to providing the highest levels of quality in everything we offer, from coffee beans to service'
  //       },
  //       {
  //         title: 'Authenticity',
  //         description: 'We preserve traditional methods of coffee preparation with a modern touch'
  //       },
  //       {
  //         title: 'Community',
  //         description: 'We strive to build a strong community of coffee and culture lovers'
  //       },
  //       {
  //         title: 'Sustainability',
  //         description: 'We care about the environment and work with suppliers who share our values'
  //       }
  //     ]
  //   },
  //   team: {
  //     title: 'Our Team',
  //     description: 'A team of experts passionate about delivering the best coffee experience',
  //     members: [
  //       {
  //         name: 'Ahmed Al-Mohammed',
  //         role: 'Founder & General Manager',
  //         image: '/images/person_2.jpg'
  //       },
  //       {
  //         name: 'Fatima Al-Saad',
  //         role: 'Coffee Roasting Expert',
  //         image: '/images/person_3.jpg'
  //       },
  //       {
  //         name: 'Mohammed Al-Ali',
  //         role: 'Operations Manager',
  //         image: '/images/person_4.jpg'
  //       }
  //     ]
  //   }
  // }
 
  return (
  <div className="pt-20 md:pt-24">
     <HeroSection
        backgroundImage="/images/bg_3.jpg"
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
    ${isArabic ? 'text-left rtl ' : 'text-right ltr'}`}>
      <div className="heading-section ">
        <span
          className="subheading text-[#c49b63] text-[50px] leading-none "
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
       <div className="absolute top-20 left-[38%] ">

          {/* Testimony  */}
        <div className=" text-center ">
	       <span className="subheading  text-[#c49b63] text-[60px] leading-none" style={{ fontFamily: '"Great Vibes", cursive' }}>Testimony</span>
	       <h2 className="mb-4 text-white text-[45px] "style={{ fontFamily: '"Josefin Sans", Arial, sans-serif' }}>CUSTOMERS SAYS</h2>
	      </div>
       </div>
      
       <div className={`absolute  bottom-0 left-0 gap-0 w-full flex ${isArabic ? 'text-left rtl' : 'text-right ltr'}`}> 
         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
       
           {testimonials.map((t, index) => (
         <div
          key={index}
         className={`${t.className} text-white p-6 shadow-lg flex flex-col justify-between`}>
        <p className="text-sm leading-relaxed italic mb-6">{t.quote}</p>
       <div className="flex items-center gap-3 mt-auto ${isArabic ? 'text-left rtl' : 'text-right ltr'}`}> ">
         <img
          src={t.image}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover"
         />
            <div>
            <h4 className="text-sm font-semibold">{t.name}</h4>
             <p className="text-xs opacity-80">{t.role}</p>
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

        <div className="text-white text-start">
        <span
         className="text-[#c49b63] text-[50px] block"
         style={{ fontFamily: '"Great Vibes", cursive' }}
        >
        {contents.subtitle}
      </span>
      <h2 className="text-4xl font-bold mb-3">{contents.title}</h2>
      <p className="text-lg opacity-80 leading-relaxed mb-8">{contents.description}</p>
    
          <Link
           to="/menu"
           className="inline-block border border-[#c49b63] text-[#c49b63] py-2 px-6 hover:bg-[#c49b63] hover:text-black transition duration-300"
           >
          {isArabic ? 'تصفح القائمة كاملة' : 'View Full Menu'}
          </Link>

        </div>

      </div>
    </section>
   
    <div className="  w-full bg-black/90 relative min-h-[400px]  bg-[1%_30%]   bg-no-repeat bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/chat.png)', }}>
     


   {/* <div className="flex justify-center gap-40 flex-wrap py-40">
  {[
    {
      image: '/images/choose_icon2.png',
      line1: '500',
      line2: 'staff'
    },
    {
      image: '/images/choose_icon2.png',
      line1: '10,567',
      line2: 'Happy Customer'
    },
    {
      image: '/images/choose_icon2.png',
      line1: '85',
      line2: 'Number of Awards'
    },
    {
      image: '/images/choose_icon2.png',
      line1: '2',
      line2: 'Coffe Pranches'
    }
  ].map((item, index) => (
    <div key={index} className="flex flex-col items-center group">
      <button
        className="w-24 h-24 border-2 border-[#c49b63] rounded-md transition-transform duration-300 group-hover:rotate-45 flex items-center justify-center"
      >
        <img src={item.image} alt={`icon-${index}`} className="w-8 h-8" />
      </button>
      <p className="mt-2 text-lg text-[#c49b63] font-semibold">{item.line1}</p>
      <p className="text-xl text-gray-300">{item.line2}</p>
    </div>
  ))}
</div> */}



<div className="flex justify-center gap-20 flex-wrap py-40">
  {[
    { image: '/images/choose_icon2.png', line1: 500, line2: 'Sttaf' },
    { image: '/images/choose_icon2.png', line1: 1280, line2: 'Happy Customer' },
    { image: '/images/choose_icon2.png', line1: 85, line2: 'Number of Awards' },
    { image: '/images/choose_icon2.png', line1: 2, line2: 'Coffe branches' }
  ].map((item, index) => (
    <div
      key={index}
      className="flex flex-col items-center group"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <button className="w-24 h-24 border-2 border-[#c49b63] rounded-md transition-transform duration-300 group-hover:rotate-45 flex items-center justify-center">
        <img src={item.image} alt={`icon-${index}`} className="w-8 h-8" />
      </button>
      
      <p
        className="text-xl text-gray-300 counter"
        data-count={item.line1}
      >
        0
      </p>
       <p className="mt-2 text-lg text-[#c49b63] font-semibold">{item.line2}</p>
    </div>
  ))}
</div>



    </div>
  




    {/* <div className="pt-16 md:pt-20 relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/hhh.jpg)' }}>
      <div className="absolute inset-0 bg-black/70"></div> */}

      {/* Story Section */}
      {/* <section className="section-padding relative z-10">
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
      </section> */}

      {/* Values Section */}
      {/* <section className="section-padding relative z-10">
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
      </section> */}

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
      {/* <section className="section-padding relative z-10">
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
      </section> */}
    {/* </div> */}
</div>
  )
}

export default About 



