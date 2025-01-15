import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const channelId = searchParams.get('channelId')
  const pageToken = searchParams.get('pageToken')

  if (!channelId) {
    return NextResponse.json({ error: 'Channel ID parameter is required' }, { status: 400 })
  }

  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Google API key is not configured' }, { status: 500 })
  }

  try {
    const apiUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    apiUrl.searchParams.append('channelId', channelId)
    apiUrl.searchParams.append('part', 'snippet')
    apiUrl.searchParams.append('order', 'date')
    apiUrl.searchParams.append('type', 'video')
    apiUrl.searchParams.append('maxResults', '10')
    apiUrl.searchParams.append('key', process.env.GOOGLE_API_KEY)
    if (pageToken) {
      apiUrl.searchParams.append('pageToken', pageToken)
    }

    const response = await fetch(apiUrl.toString())
    
    if (!response.ok) {
      throw new Error(`YouTube API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching search results', error)
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 })
  }
}

