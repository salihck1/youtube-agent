import { NextResponse } from 'next/server'

export async function GET() {
  // Mock response data
  const mockScript = {
    script: `Welcome to our video on how to bake a cake! First, gather ingredients:
- 2 cups of flour
- 1 cup of sugar
- 3 eggs
- 1 cup of milk
- 1/2 cup of butter

Let's start by preheating the oven to 350°F (175°C). While that's heating up, we'll mix our dry ingredients together.`,
    mediaNotes: [
      "Show close-up of measuring cups",
      "Display oven temperature setting",
      "Show mixing bowl with dry ingredients",
      "Include text overlay with ingredient measurements"
    ]
  }

  return NextResponse.json(mockScript)
} 