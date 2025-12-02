import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/utils/prisma'
import { DonationStatus } from '@/app/generated/prisma/enums'
import { Address } from 'ton'

const TONCENTER_API_URL = 'https://toncenter.com/api/v2'
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { amount, fromAddressWallet, 
      toAddressWallet, donationId, } = await req.json()

    if (!amount || !fromAddressWallet || !toAddressWallet || !donationId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'При обработке статуса доната возникла ошибка: не переданы все параметры',
        }, 
        {
          status: 400,
        }
      )
    }

    const normalizedFromAdressWallet = Address.parse(fromAddressWallet).toString()
    const normalizedToAdressWallet = Address.parse(toAddressWallet).toString()

    const url = new URL(`${TONCENTER_API_URL}/getTransactions`)
    url.searchParams.append("address", normalizedToAdressWallet)
    url.searchParams.append("limit", "20")
    if (TONCENTER_API_KEY) {
      url.searchParams.append("api_key", TONCENTER_API_KEY)
    }

    const resp = await fetch(url.toString(), {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
      next: { 
        revalidate: 0,
      },
    })

    if (!resp.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'При обработке статуса доната возникла ошибка: при запросе транзакций возникла ошибка',
        }, 
        { 
          status: 500,
        }
      )
    }

    const data = await resp.json()

    if (!Array.isArray(data.result)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "При запросе транзакций возникла ошибка: пришли некорректные данные",
        }, 
        { 
          status: 500,
        }
      )
    }

    const transactions = data.result;
    const expectedAmountNano = Math.floor(amount * 1e9)

    let matchingTx = null

    for (const tx of transactions) {
      if (!tx.utime) {
        continue
      }

      const now = Math.floor(Date.now() / 1000)
      if (now - tx.utime > 300) {
        continue
      }

      const inMsg = tx.in_msg
      if (!inMsg) {
        continue
      }

      const { source, value } = inMsg

      if (!source || !value) continue

      let normalizedSource
      try {
        normalizedSource = Address.parse(source).toString()
      } catch (e) {
        continue
      }

      if (normalizedSource !== normalizedFromAdressWallet) {
        continue
      }

      const txValue = Number(value)
      if (isNaN(txValue)) {
        continue
      }

      if (txValue < expectedAmountNano * 0.95) {
        continue
      }

      if (txValue >= expectedAmountNano * 1.05) {
        continue
      }

      matchingTx = tx
      break
    }

    if (!matchingTx) {
      return NextResponse.json({
        success: true,
        status: 'PENDING',
        message: 'Статус транзакции не определён',
      })
    }
    
    await prisma.donation.update({
      where: { 
        id: donationId,
      },
      data: {
        status: DonationStatus.COMPLETED,
        transactionHash: matchingTx.transaction_id.hash,
      },
    })

    return NextResponse.json({
      success: true,
      status: "COMPLETED",
      message: 'Статус транзакции определён',
    })
  } catch (error) {
    console.error('При обработке статуса доната возникла ошибка: ', error)

    return NextResponse.json(
      { 
        success: false, 
        error: 'При обработке статуса доната возникла ошибка',
      }, 
      {
        status: 500 
      }
    )
  }
}
