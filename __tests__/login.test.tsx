import { render, screen } from '@testing-library/react'
import Login from '../pages/auth/login'
import '@testing-library/jest-dom'

describe('Login', () => {
    beforeEach(() => {
        render(<Login />)
    })

    it('renders a logo', () => {
        const logo = document.querySelector('img') as HTMLImageElement
        
        expect(logo.src).toContain('logo.png')
    })

    it('renders a email input field', () => {

        const input = document.querySelector('input[type=email]') as HTMLInputElement
        
        expect(input.name).toEqual('email')
    })

    it('renders a password input field', () => {

        const input = document.querySelector('input[type=password]') as HTMLInputElement
        
        expect(input.name).toEqual('password')
    })

    it('renders a forgot password link', () => {

        const link = screen.getByText('Forgot your password?') as HTMLAnchorElement
        
        expect(link.href).toContain('/auth/forgot-password')
    })

    it('renders a sign up link', () => {

        const link = screen.getByText('Sign-up') as HTMLAnchorElement
        
        expect(link.href).toContain('/auth/signup')
    })
})
