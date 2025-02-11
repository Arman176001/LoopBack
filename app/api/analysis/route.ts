import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoId = searchParams.get('videoId')

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID parameter is required' }, { status: 400 })
  }

  // Create an AbortController to handle the timeout.
  const controller = new AbortController()
  // Set a timeout of 5 minutes (300,000 milliseconds).
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000)

  try {
    const apiUrl = new URL('https://youtubevideocommentsinsights.onrender.com/analyze')
    apiUrl.searchParams.append('videoId', videoId)

    // Pass the controller's signal to the fetch call.
    const response = await fetch(apiUrl.toString(), { signal: controller.signal })

    // Clear the timeout if the request completes in time.
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after 5 minutes')
    } else {
      console.error('Error fetching sentiment analysis:', error)
    }
    return NextResponse.json({ error: 'Failed to fetch sentiment analysis' }, { status: 500 })
  }
}
