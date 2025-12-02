import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type TSendEmailData = {
  email: string
  subject: string
  message: string
}

type TsendEmailResponse = 
  { 
    success: true
    message: string 
  } 
  | 
  { 
    success: false
    error: string 
  }

export async function sendEmail(
  data: TSendEmailData
): Promise<
  TsendEmailResponse
> {
  try {
    if (!data || !data.email || !data.subject || !data.message) {
      return {
        success: false,
        error: 'При отправке письма возникла ошибка: не все данные переданы',
      }
    }

    const { email, subject, message } = data

    const { error } = await resend.emails.send({
      from: 'tiplyton@gschernyshov.ru', 
      to: [email],
      subject,
      text: message,
    })

    if (error) {
      return { 
        success: false,
        error: 'При отправке письма возникла ошибка',
      }
    }

    return {
      success: true,
      message: 'Письмо c новым паролем отправлено на Вашу почту',
    }
  } catch (error) {
      console.error('При отправке письма возникла ошибка: ', error)
      
      return {
        success: false,
        error: 'При отправке письма возникла ошибка',
      }
  }
}