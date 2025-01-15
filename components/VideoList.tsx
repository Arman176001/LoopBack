'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface Thumbnail {
  url: string
  width: number
  height: number
}

interface Video {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: Thumbnail
      medium: Thumbnail
      high: Thumbnail
      standard?: Thumbnail
      maxres?: Thumbnail
    }
    channelTitle: string
  }
}

interface YouTubeApiResponse {
  items: Video[]
  nextPageToken?: string
}

const VideoList = () => {
  const searchParams = useSearchParams() || new URLSearchParams()
  const channelId = searchParams.get('channelId')
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchVideos = useCallback(async (pageToken: string | null = null) => {
    if (!channelId) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/youtube-video-search?channelId=${channelId}${pageToken ? `&pageToken=${pageToken}` : ''}`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }
      const data: YouTubeApiResponse = await response.json()
      setVideos(prevVideos => pageToken ? [...prevVideos, ...data.items] : data.items)
      setNextPageToken(data.nextPageToken || null)
    } catch (error) {
      setError('Error fetching videos. Please try again.')
      console.error('Error fetching videos', error)
    } finally {
      setIsLoading(false)
    }
  }, [channelId])

  useEffect(() => {
    if (channelId) {
      fetchVideos()
    }
  }, [channelId, fetchVideos])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !isLoading) {
          fetchVideos(nextPageToken);
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [nextPageToken, isLoading, fetchVideos]);

  const getBestThumbnail = (thumbnails: Video['snippet']['thumbnails']): string => {
    const sizes = ['maxres', 'standard', 'high', 'medium', 'default'] as const
    for (const size of sizes) {
      if (thumbnails[size]) {
        return thumbnails[size]!.url
      }
    }
    return '/placeholder.svg'
  }

  if (!channelId) {
    return <p className="text-center mt-8">No channel ID provided</p>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl ">
      {error && (
        <p className="text-red-500 mb-4 text-center">{error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <Link key={`${video.id.videoId}-${index}`} href={`/results?videoId=${video.id.videoId}`} passHref>
            <Card className="flex flex-col overflow-hidden h-full cursor-pointer transition-transform hover:scale-105">
              <img 
                src={getBestThumbnail(video.snippet.thumbnails) || "/placeholder.svg"} 
                alt={video.snippet.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {video.snippet.description}
                </p>
                <p className="text-sm text-gray-500 mt-auto">
                  {video.snippet.channelTitle}
                </p>
              </div>
            </Card>
          </Link>
        ))}
        {isLoading && videos.length === 0 && (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex flex-col overflow-hidden h-full">
              <Skeleton className="w-full h-48" />
              <div className="p-4 flex-1 flex flex-col">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))
        )}
      </div>
      {nextPageToken && (
        <div ref={loadMoreRef} className="mt-8 flex justify-center">
          {isLoading ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <button 
              onClick={() => fetchVideos(nextPageToken)} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoList

