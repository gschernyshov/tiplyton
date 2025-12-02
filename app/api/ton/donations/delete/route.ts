import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/utils/prisma'

export async function POST(req: NextRequest) {
  try {
    const { donationId } = await req.json()

    if (!donationId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'При удалении доната возникла ошибка: не передан id доната',
        }, 
        { 
          status: 400,
        },
      )
    }

    await prisma.donation.delete({
      where: {
        id: donationId,
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Донат успшено удалён',
    })
  } catch (error) {
    console.error('При удалении доната возникла ошибка', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'При удалении доната возникла ошибка',
      }, 
      { 
        status: 500,
      }
    )
  }
}
