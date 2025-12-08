jest.mock('@heroui/modal', () => ({
  useDisclosure: jest.fn(() => ({
    isOpen: false,
    onOpen: jest.fn(),
    onOpenChange: jest.fn(),
  })),
}))

jest.mock('../../hooks/useLogin', () => ({
  useLogin: jest.fn(),
}))

jest.mock('@heroui/form', () => ({
  Form: ({ children, onSubmit }: any) => (
    <form 
      onSubmit={(e) => { 
        e.preventDefault()
        onSubmit?.(e)
      }}
    >
      {children}
    </form>
  ),
}))

jest.mock('@heroui/input', () => ({
  Input: ({ 
    isRequired, 
    isDisabled, 
    label, 
    name, 
    value, 
    type, 
    onChange, 
  }: any) => (
    <div>
      <label htmlFor={name}>
        {label} {isRequired && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        required={isRequired}     
        disabled={isDisabled}   
        name={name}
        value={value}
        type={type}
        onChange={onChange}  
        data-testid={`input-${name}`}
      />
    </div>
  ),
}))

jest.mock('@heroui/checkbox', () => ({
  Checkbox: ({ 
    children, 
    isRequired, 
    defaultSelected,
  }: any) => (
    <label>
      <input 
        required={isRequired}      
        defaultChecked={defaultSelected}   
        type="checkbox"                
      />
      {children}
    </label>
  ),
}))

jest.mock('@heroui/button', () => ({
  Button: ({ 
    children, 
    isLoading, 
    isDisabled, 
    onPress, 
    ...props
   }: any) => {
    const handleClick = onPress ? { onClick: onPress } : {}
    return (
      <button   
        aria-busy={isLoading} 
        disabled={isDisabled}   
        type="button"     
        {...props} 
        {...handleClick}
      >
        {children}
      </button>
    )
  },
}))

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: any) => <span data-icon={icon} {...props} />,
}))

jest.mock('../../components/common/Alert', () => ({
  Alert: ({ message }: any) => <div data-testid="alert">{message}</div>,
}))

jest.mock('../../components/layout/ResetPassword', () => ({
  ResetPassword: () => <div data-testid="reset-password-modal" />,
}))

import { render, screen } from '@testing-library/react'
import { LoginForm } from '../login'

describe('LoginForm', () => {
  const useLoginMock = require('../../hooks/useLogin').useLogin

  beforeEach(() => {
    useLoginMock.mockReset()
    useLoginMock.mockReturnValue({
      formData: { email: '', password: '' },
      isLoadingLogin: false,
      stateError: { error: false, message: '' },
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
    })
  })

  it('должен отрендерить поле Email и Пароль', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument()
  })

  it('должен отрендерить кнопку "Войти"', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument()
  })

  it('должен отображать сообщение об ошибке, если stateError.error true', () => {
    const useLoginMock = require('../../hooks/useLogin').useLogin
    useLoginMock.mockReturnValue({
      formData: { email: '', password: '' },
      isLoadingLogin: false,
      stateError: { error: true, message: 'Ошибка входа' },
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
    })

    render(<LoginForm />)
    expect(screen.getByTestId('alert')).toHaveTextContent('Ошибка входа')
  })

  it('должен отображать модальное окно восстановления пароля', () => {
    const useDisclosureMock = require('@heroui/modal').useDisclosure
    useDisclosureMock.mockReturnValue({
      isOpen: true,
      onOpen: jest.fn(),
      onOpenChange: jest.fn(),
    })

    render(<LoginForm />)
    expect(screen.getByTestId('reset-password-modal')).toBeInTheDocument()
  })
})
