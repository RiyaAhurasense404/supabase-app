import { NextResponse } from 'next/server'

export function successResponse(message: string, data?: object, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      ...data,
    },
    { status }
  )
}

export function errorResponse(message: string, errors?: object, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...errors,
    },
    { status }
  )
}