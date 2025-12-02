import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/utils/prisma'
import { DonationStatus } from '@/app/generated/prisma/enums'

export async function POST(req: NextRequest) {
  try {
    const { amount, fromUserId, fromUserAddressWallet, 
      toUserId, toUserAddressWallet,  postId, } = await req.json()

    if (!amount || !fromUserId || !toUserId || !postId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'При создание доната возникла ошибка: не переданы все параметры',
        }, 
        { 
          status: 400,
        },
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Сумма доната должна быть больше 0',
        }, 
        { 
          status: 400,
        },
      )
    }

    const donation = await prisma.donation.create({
      data: {
        amount,
        status: DonationStatus.PENDING,
        fromUserId,
        fromUserAddressWallet,
        toUserId,
        toUserAddressWallet,
        postId,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Донат успшено создан',
      donationId: donation.id,
    })
  } catch (error) {
    console.error('При создание доната возникла ошибка', error)

    return NextResponse.json(
      {
        success: false,
        error: 'При создание доната возникла ошибка',
      }, 
      { 
        status: 500,
      }
    )
  }
}
