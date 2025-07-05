import React from 'react'
import { useRTL } from '../App'
import HeroSection from './../components/HeroSection'
import Menu from './../pages/Menu'


const Shop = () => {

  const { isArabic } = useRTL()



  return (
  
 <div >
         {/* <HeroSection 
              backgroundImage="/images/bg_3.jpg"
             title={isArabic ? " الدفع" : "Checkout"}
         /> */}

          <Menu
            
          />
 </div>
  )
}

export default Shop 












{/* <div className="pt-16 md:pt-20 min-h-screen">
      <div className="w-full px-4 md:px-6 lg:px-8 section-padding">
        <h1 className="text-4xl font-bold text-center mb-8">Shop</h1>
        <p className="text-center text-gray-600">Coming soon...</p>
      </div>
    </div> */}