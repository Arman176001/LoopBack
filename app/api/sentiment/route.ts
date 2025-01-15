import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoId = searchParams.get('videoId')

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID parameter is required' }, { status: 400 })
  }

  try {
    const apiUrl = new URL('http://127.0.0.1:5000/sentiment')
    apiUrl.searchParams.append('videoId', videoId)

    const response = await fetch(apiUrl.toString())
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching sentiment analysis:', error)
    return NextResponse.json({ error: 'Failed to fetch sentiment analysis' }, { status: 500 })
  }
}

