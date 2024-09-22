import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import SignForm from './SignForm'
import userEvent from '@testing-library/user-event'
import { 
    usernameLen, 
    illegalNames,
    passwordLen,
    passwordSpecialChars
} from '@/data/api/validation/user'
import { signUpSubmit } from './testUtils'

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

describe('Signing up action', () => {
    describe('Invalid username', () => {
        it('Username too long', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { username: 'x'.repeat(usernameLen.max + 1) }
            )

            expect(screen.getByText(
                /username length \(\d+\) must be .+ characters/i
            )).toBeInTheDocument()
        })

        it('Username too short', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { username: 'x' }
            )

            expect(screen.getByText(
                /username length \(\d+\) must be .+ characters/i
            )).toBeInTheDocument()
        })

        it('Username contains invalid character', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { username: '/' }
            )

            expect(screen.getByText(
                /username must only contain/i
            )).toBeInTheDocument()
        })

        it('Username is listed as illegal', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { username: illegalNames[0] }
            )

            expect(screen.getByText(
                /username already taken/i
            )).toBeInTheDocument()
        })

        it('Username already taken', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { username: 'username' }
            )

            expect(screen.getByText(
                /username already taken/i
            )).toBeInTheDocument()
        })
    })

    describe('Invalid password', () => {
        it('Password too long', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { password: 'x'.repeat(passwordLen.max + 1) }
            )
            
            expect(screen.getByText(
                /password length \(\d+\) must be .+ characters/i
            )).toBeInTheDocument()
        })

        it('Password too short', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { password: 'x' }
            )

            expect(screen.getByText(
                /password length \(\d+\) must be .+ characters/i
            )).toBeInTheDocument()
        })

        it('Password does not contain digit', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { password: 'x' }
            )

            expect(screen.getByText(
                /password must contain .+ digit/i
            )).toBeInTheDocument()
        })

        it('Password does not contain special character', async () => {
            render(<SignForm signingUp={true}/>)
            const user = userEvent.setup()

            await signUpSubmit(
                screen, 
                user, 
                { password: 'x' }
            )

            expect(screen.getByText(
                new RegExp(
                    `password must contain one of ${passwordSpecialChars}`, 'i'
                )
            )).toBeInTheDocument()
        })
    })

    it('Valid fields', async () => {
        render(<SignForm signingUp={true}/>)
        const user = userEvent.setup()

        await signUpSubmit(
            screen, 
            user, 
            { 
                username: 'username',
                password: '1!aaaaaa'
            }
        )
    })
})