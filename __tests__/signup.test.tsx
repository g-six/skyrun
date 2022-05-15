import { render, screen } from '@testing-library/react'
import SignUp from '../pages/auth/signup'
import '@testing-library/jest-dom'

describe('Signup', () => {
    beforeEach(() => {
        render(<SignUp />)
    })

    it('renders a logo', () => {
        const logo = document.querySelector('img') as HTMLImageElement
        
        expect(logo.src).toContain('logo.png')
    })

    it('renders right title', () => {
        const title = screen.getByText('Sign up')
        
        expect(title).toBeInTheDocument()
    })

    it('renders a email input field', () => {

        const input = document.querySelector('input[type=email]') as HTMLInputElement
        
        expect(input.name).toEqual('email')
    })

    it('renders a password input field', () => {

        const input = document.querySelector('input[name=password]') as HTMLInputElement
        
        expect(input.type).toEqual('password')
    })
    it('renders a password confirmation input field', () => {

        const input = document.querySelector('input[name=confirm_password]') as HTMLInputElement
        
        expect(input.type).toEqual('password')
    })

    it('renders a login link', () => {

        const link = screen.getByText('Login') as HTMLAnchorElement
        
        expect(link.href).toContain('/auth/login')
    })
})
