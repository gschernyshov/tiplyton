declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        // Основные методы
        ready: () => void
        expand: () => void
        onClose: () => void
        onEvent: (event: string, callback: () => void) => void
        offEvent: (event: string, callback: () => void) => void
        sendData: (data: string) => void
        showNotification: (message: string) => void
        showAlert: (message: string) => void
        showConfirm: (message: string, callback: (ok: boolean) => void) => void

        // Цвета
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void

        // Данные инициализации
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
            language_code?: string
          }
          query_id?: string
          receiver?: { id: number; first_name: string; last_name?: string; username?: string }
          start_param?: string
          auth_date: number
          hash: string
        }

        // Тема
        themeParams: {  
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
          secondary_bg_color?: string
          header_bg_color?: string
          accent_text_color?: string
          section_bg_color?: string
          section_header_text_color?: string
          subtitle_text_color?: string
          destructive_text_color?: string
        }

        // Основная кнопка
        MainButton: {
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          setProgress: (progress: boolean) => void
          isActive: boolean
          isVisible: boolean
          isEnabled: boolean
        }

        // Хаптик
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }

        // Прочее
        viewportHeight?: number
        viewportStableHeight?: number
        isExpanded?: boolean
      }
    }
  }
}

export {}
