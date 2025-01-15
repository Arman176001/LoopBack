'use client'

import React, { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Result {
  id: { kind: string; channelId: string };
  snippet: {
    title: string;
    thumbnails: { default: { url: string } };
  };
}

const Search = () => {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (inputValue) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(inputValue)}`)
        const data = await response.json()
        setResults(data.items || [])
      } catch (error) {
        console.error('Error fetching search results', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">
        Find Your Channel
      </h1>
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter channel name"
            className={`w-full p-4 pr-14 text-lg bg-white border-2 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none ${
              isFocused ? 'border-primary ring-4 ring-primary/20' : 'border-gray-300'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <SearchIcon 
              className={`w-6 h-6 transition-colors duration-300 ${
                isFocused ? 'text-primary' : 'text-gray-400'
              } ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.slice(0, 15).map((result) => (
          <a href={`/videos?channelId=${result.id.channelId}`} key={result.id.channelId} >
          <Card className="flex items-center space-x-4 p-4 overflow-clip">
            <img 
              src={result.snippet.thumbnails.default.url} 
              alt={result.snippet.title} 
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {result.snippet.title}
              </p>
            </div>
          </Card>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Search

