import React from 'react'
import VideoList from '@/components/VideoList'
import Navbar from '@/components/Navbar'

const VideoPage = () => {
  return (
    <div className='overflow-x-clip'>
      <Navbar/>
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">Channel Videos</h1>
      <VideoList />
    </div>
  )
}

export default VideoPage