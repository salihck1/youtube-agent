import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received script approval:', body)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Script approved successfully' 
    })
  } catch (error) {
    console.error('Error in approveScript:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to approve script' },
      { status: 500 }
    )
  }
} 