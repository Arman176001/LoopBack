import React from 'react'
import VideoList from '@/components/VideoList'

const VideoPage = () => {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">Channel Videos</h1>
      <VideoList />
    </div>
  )
}

export default VideoPage