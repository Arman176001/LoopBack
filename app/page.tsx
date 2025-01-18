import Footer from '@/components/Footer'
import Home from '@/components/home'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <nav className="fixed left-0 right-0 z-50 bg-white">
        <Navbar/>
      </nav>
      <Home />
      <Footer/>
    </div>
  )
}

export default page
