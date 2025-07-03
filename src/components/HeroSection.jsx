// import React from 'react'
// import { Link } from 'react-router-dom'

// const HeroSection = ({
//   backgroundImage = '/images/bg_3.jpg', // غيّري المسار حسب الصورة عندك
//   overlayOpacity = 'bg-black/50',
//   subtitle,
//   title,
//   description,
//   buttons = []
// }) => {
//   return (
//     <section
//       className="relative h-screen overflow-hidden"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat'
//       }}
//     >
//       {/* Overlay */}
//       <div className={`absolute inset-0 ${overlayOpacity}`} />

//       {/* Content */}
//       <div className="relative z-10 flex items-center justify-center h-full px-4 md:px-6 lg:px-8 text-center text-white">
//         <div className="max-w-4xl">
//           {subtitle && (
//             <span className="text-primary text-3xl font-semibold mb-4 block arabic-heading-font">
//               {subtitle}
//             </span>
//           )}
//           {title && (
//             <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight arabic-heading-font">
//               {title}
//             </h1>
//           )}
//           {description && (
//             <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 arabic-body">
//               {description}
//             </p>
//           )}
//           {buttons.length > 0 && (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               {buttons.map((button, index) => (
//                 <Link
//                   key={index}
//                   to={button.link}
//                   className={`${button.className} transition-all duration-300 hover:scale-105`}
//                 >
//                   {button.text}
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default HeroSection



// components/HeroSection.jsx
import React from 'react'

const HeroSection = ({
  backgroundImage = '/images/bg_3.jpg',
  overlayOpacity = 'bg-black/50',
  title = '',
}) => {
  return (
    <section
      className="relative  h-screen overflow-hidden flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold arabic-heading-font animate-slide-up opacity-0">{title}</h1>
      </div>
    </section>
  )
}

export default HeroSection

