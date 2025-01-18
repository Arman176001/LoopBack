'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Feature } from '@/components/Feature'
import { ChartBarIcon, ChatBubbleBottomCenterTextIcon, ClockIcon, UserGroupIcon, PaperAirplaneIcon, FaceSmileIcon } from '@heroicons/react/24/outline'

const About = () => {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      <motion.div 
        className='p-8 md:p-24 relative z-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className='text-5xl font-bold mb-12 text-center text-violet-700'
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Revolutionize Your YouTube Engagement
        </motion.h1>

        <motion.p
          className='text-xl text-center mb-16 text-gray-700'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Harness the power of <span className='bg-gradient-to-r font-bold from-violet-600 to-pink-400 bg-clip-text text-transparent'>AI</span> to understand your audience like never before
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Feature 
            title="AI-powered Emotion Analysis"
            description="Gain deep insights into viewer sentiments with our cutting-edge emotion analysis."
            icon={<ChartBarIcon className="w-12 h-12" />}
          />

          <Feature 
            title="AI Comments Summarizer"
            description="Save time with concise, AI-generated summaries of your video comments."
            icon={<ChatBubbleBottomCenterTextIcon className="w-12 h-12" />}
          />

          <Feature 
            title="Comment Timestamp Analysis"
            description="Identify engagement hotspots in your videos with our timestamp analysis."
            icon={<ClockIcon className="w-12 h-12" />}
          />

          <Feature 
            title="Competitor Performance Tracking"
            description="Stay ahead of the curve by comparing your performance with other YouTubers."
            icon={<UserGroupIcon className="w-12 h-12" />}
          />
        </div>

        <motion.h2 
          className='text-4xl font-bold mt-24 mb-12 text-center text-violet-700'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Coming Soon
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Feature 
            title="In-App Comment Replies"
            description="Streamline your engagement process by responding to comments directly through our app."
            icon={<PaperAirplaneIcon className="w-12 h-12" />}
          />

          <Feature 
            title="AI Emoji Reactions"
            description="Let our AI suggest appropriate emoji reactions, making your engagement more expressive."
            icon={<FaceSmileIcon className="w-12 h-12" />}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default About

