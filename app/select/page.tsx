import Navbar from '@/components/Navbar'
import Search from '@/components/Search'
import React from 'react'

const page = async () => {

  return (
    <div>

    <div className='overflow-x-clip'>
        <Navbar/>
        <Search/>
    </div>
      
    </div>
  )
}

export default page