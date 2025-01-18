import React from 'react'
import VideoList from '@/components/VideoList'
import Navbar from '@/components/Navbar'
import { Saira_Stencil_One } from 'next/font/google'
const saira = Saira_Stencil_One({ weight: "400", subsets: ["latin"] })
const VideoPage = () => {
  return (
    <div className='overflow-x-clip'>
      <Navbar/>
      <h1 className="py-6 text-5xl font-bold text-center text-gray-800 "><span className={saira.className}>Channel Videos</span></h1>
      <VideoList />
    </div>
  )
}

export default VideoPage