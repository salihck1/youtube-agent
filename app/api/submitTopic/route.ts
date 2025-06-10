import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received topic submission:', body)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Topic submitted successfully' 
    })
  } catch (error) {
    console.error('Error in submitTopic:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit topic' },
      { status: 500 }
    )
  }
} 