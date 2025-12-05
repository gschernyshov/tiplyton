# 💎 TiplyTon

Приложение **TiplyTon** —  мой pet-проект, разработанный на стеке **Next.js + TypeScript + Tailwind CSS & HeroUI + Prisma**. Проект представляет собой Telegram Mini App для создания и просмотра постов с возможностью донатов через TON Wallet.

---

## 🚀 Технологии

- **Next.js 16**  
- **React 19**  
- **TypeScript**  
- **TailwindCSS & HeroUI**  
- **Prisma** (PostgreSQL)
- **Auth.js** (аутентификация)  
- **Zustand** (state management)  
- **Zod** (валидация)  
- **Resend** (API электронной почты)  

---

## 📂 Структура проекта

```
app/                  # Основные страницы и API маршруты
├── api/              # Серверные API маршруты
│   ├── auth/         # Аутентификация (Auth)
│   └── ton/          # Работа с TON (создание, удаление, подтверждение донатов)
├── create-post/      # Страница создания поста
├── login/            # Страница входа
├── page.tsx          # Главная страница
├── post/             # Просмотр одного поста
├── posts/            # Список постов
├── profile/          # Профиль пользователя
└── registration/     # Страница регистрации
src/                  # Основная логика и компоненты
├── actions/          # Функции действий (CRUD, лайки, фавориты, донаты)
├── components/       # UI-компоненты
│   ├── common/       # Общие компоненты (алерты, спиннеры и др.)
│   └── layout/       # Компоненты для отображения страниц, постов и др.
├── forms/            # Формы (регистрация, вход, посты, донаты и др.)
├── hooks/            # React хуки для работы с данными и состоянием
├── lib/              # Утилиты (валидация email и др.)
├── providers/        # Провайдеры контекста (Auth, Telegram и др.)
├── schema/           # Схемы валидации (Zod)
├── store/            # State management (Zustand)
├── types/            # Типы TypeScript
└── utils/            # Утилиты для работы с пользователями, постами, Prisma, email
prisma/               # База данных и миграции
public/               # Статические ресурсы (изображения, favicon)
```

---

## 🏗️ Архитектура проекта

Проект построен по принципу **слойной архитектуры**:

1. **Presentation Layer (app/ + components/ + forms/)**  
   - Отвечает за отображение страниц и компонентов UI.  
   - Формы, компоненты и страницы взаимодействуют с хуками и actions для получения и отправки данных.

2. **Business Logic Layer (src/actions/ + src/hooks/)**  
   - Actions содержат логику обработки данных (вход, регистрация, создание и удаление поста, лайки, избранные и др.).  
   - Хуки обеспечивают реактивное взаимодействие с компонентами и абстрагируют работу с API.

3. **Data Layer (Prisma + src/utils/prisma.ts)**  
   - Работа с базой данных через Prisma Client.  
   - Все операции с моделями User, Post, Like, Favorite, Donation централизованы.

4. **State Management (src/store/)**  
   - Хранение состояния пользователя, авторизации, Ton Wallet и Telegram интеграции через **Zustand**.

5. **Integration Layer**  
   - Работа с внешними сервисами (TON Wallet, TonConnect, email, Telegram) через отдельные провайдеры и утилиты.

---

## ⚡ Основные функции

- Регистрация, авторизация и сброс пароля пользователей  
- Редактирование данных пользователя
- Создание, просмотр и удаление постов  
- Лайки и избранное  
- Донаты через TON Wallet  

---

## 🛠️ Установка и запуск

1. Клонируем репозиторий:

```bash
git clone https://github.com/gschernyshov/tiplyton
cd TiplyTon
```

2. Устанавливаем зависимости:

```bash
npm install
```

3. Настраиваем переменные окружения:  
Создайте файл `.env` в корне проекта:

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your-api-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
RESEND_API_KEY="your-resend-api-key"
TONCENTER_API_KEY="your-toncenter-api-key"
```

4. Запуск проекта в режиме разработки:

```bash
npm run dev
```

Проект будет доступен по адресу: `http://localhost:3000`

---

## ⚡ Скрипты

| Команда | Описание |
|---------|----------|
| `dev` | Запуск проекта в режиме разработки |
| `build` | Генерация Prisma Client и сборка проекта для продакшена |
| `start` | Запуск проекта в продакшен режиме |