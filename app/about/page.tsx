import Navbar from '@/components/Navbar';
import Link from 'next/link';
import React from 'react';

const About: React.FC = () => {
  return (
    <div className='overflow-x-clip'>
        <Navbar/>
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">About Loopback</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Welcome to <span className="text-indigo-600 font-semibold">Loopback</span>, your ultimate tool for analyzing YouTube comments with ease and precision. Our app leverages advanced AI and machine learning technologies to help you gain actionable insights from user-generated content on YouTube.
        </p>
        <div className="my-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Key Features</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Sentiment Analysis: Understand the tone and emotions behind user comments.</li>
            <li>Summary Generator: Creates a summary by leveraging the power of AI to save your time and effort</li>
            <li>TimeStamp Filter: Filter out comments that have a specific timestamp to get feedback of a specific part of the video</li>
          </ul>
        </div>
        <div className="my-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At <span className="text-indigo-600 font-semibold">Loopback</span>, we aim to simplify the process of analyzing YouTube data so creators, businesses, and marketers can make informed decisions. By turning raw data into meaningful insights, we empower our users to grow and connect with their audiences effectively.
          </p>
        </div>
        <div className="my-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Why Choose Us?</h2>
          <p className="text-gray-600 leading-relaxed">
            Unlike generic analysis tools, <span className="text-indigo-600 font-semibold">Loopback</span> is built specifically for YouTube content. With our state-of-the-art algorithms and user-friendly interface, you get unparalleled accuracy and ease of use. Whether you’re a content creator, digital marketer, or data enthusiast, Loopback is designed to meet your needs.
          </p>
        </div>
        <div className="text-center mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Get Started Today!</h2>
          <p className="text-gray-600 mt-2">Sign up now and take the first step towards smarter decision-making with YouTube analytics.</p>
          <Link href='/'>
          <button className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
            Explore Loopback
          </button>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;
