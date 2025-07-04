
import React from 'react'

const HeroSection = ({
  backgroundImage = '/images/bg_3.jpg',
   overlayOpacity = 'bg-black/30',
  title = '',
}) => {
  return (
    <section
      className="relative bg-cover  bg-fixed h-screen overflow-hidden flex items-center justify-center text-center text-[#c49b63]"
      style={{
        
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
       
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

