import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const HeroSlider = ({ 
  slides, 
  height = 'h-screen', 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  overlayOpacity = 'bg-black/50'
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, slides.length])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <section className={`relative ${height} overflow-hidden`}>
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-110'
            }`}
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.02)' : 'scale(1.1)',
              transition: 'all 1.5s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />

      {/* Content */}
      <div className="relative w-full px-4 md:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl animate-fade-in">
          {slides[currentSlide].subtitle && (
            <span className="text-primary text-3xl font-semibold mb-4 block arabic-heading-font animate-slide-up">
              {slides[currentSlide].subtitle}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight arabic-heading-font animate-slide-up-delay-1">
            {slides[currentSlide].title}
          </h1>
          {slides[currentSlide].description && (
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 arabic-body animate-slide-up-delay-2">
              {slides[currentSlide].description}
            </p>
          )}
          {slides[currentSlide].buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-3">
              {slides[currentSlide].buttons.map((button, btnIndex) => (
                <Link
                  key={btnIndex}
                  to={button.link}
                  className={`${button.className} transition-all duration-300 hover:scale-105`}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 disabled:opacity-50"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 disabled:opacity-50"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 disabled:opacity-50 ${
                index === currentSlide
                  ? 'bg-primary shadow-lg'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      )}
    </section>
  )
}

export default HeroSlider 