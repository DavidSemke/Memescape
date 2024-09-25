import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import SignForm from './SignForm'
import { useFormState, useFormStatus } from 'react-dom'

// Note that you cannot replace this beforeEach with a __mocks__
// implementation since a mock reset removes it.
beforeEach(() => {
    const mockedFormState = (useFormState as jest.Mock)
    mockedFormState.mockImplementation((action, initState) => [
        initState,
        undefined,
    ])
    const mockedFormStatus = (useFormStatus as jest.Mock)
    mockedFormStatus.mockImplementation(() => ({ pending: false }))
})

afterEach(() => {
    jest.resetAllMocks()
})

describe('Independent elements', () => {
    it('Includes home link', () => {
        render(<SignForm />)
        expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    }) 

    it('Includes username input', () => {
        render(<SignForm />)
        expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument()
    })

    it('Includes password input', () => {
        render(<SignForm />)
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
    }) 
})

describe('Prop dependent elements', () => {
    describe('Signing up', () => {
        it('Includes heading', () => {
            render(<SignForm signingUp={true} />)
            expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument()
        })

        it('Includes submit button', () => {
            render(<SignForm signingUp={true} />)
            expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
        })

        it('Includes alternative link', () => {
            render(<SignForm signingUp={true} />)
            expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
        })
    })

    describe('Not signing up', () => {
        it('Includes heading', () => {
            render(<SignForm />)
            expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
        })

        it('Includes submit button', () => {
            render(<SignForm />)
            expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
        })

        it('Includes alternative link', () => {
            render(<SignForm />)
            expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument()
        })
    })
})

describe('Signing action', () => {
    it('Invalid username', () => {
        (useFormState as jest.Mock).mockReturnValue([
            { 
                errors: { 
                    username: ['Username is invalid'] 
                } 
            }, 
            undefined
        ])
        
        render(<SignForm signingUp={true}/>)

        expect(screen.getByText('Username is invalid')).toBeInTheDocument()
    })

    it('Invalid password', () => {
        (useFormState as jest.Mock).mockReturnValue([
            { 
                errors: { 
                    username: ['Password is invalid'] 
                } 
            }, 
            undefined
        ])
        
        render(<SignForm signingUp={true}/>)

        expect(screen.getByText('Password is invalid')).toBeInTheDocument()
    })

    it('Invalid, not field-specific', () => {
        (useFormState as jest.Mock).mockReturnValue([
            'Something went wrong',
            undefined
        ])
        
        render(<SignForm signingUp={true}/>)
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('Valid fields', async () => {
        (useFormState as jest.Mock).mockReturnValue([
            true, 
            undefined
        ])

        render(<SignForm signingUp={true}/>)

        expect(screen.getByText(/submission accepted/i)).toBeInTheDocument()
    })
})