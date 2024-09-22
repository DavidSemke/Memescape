import { Screen } from '@testing-library/react'
import { UserEvent } from "@testing-library/user-event"

export async function signUpSubmit(
    screen: Screen, 
    user: UserEvent,
    input: {
        username?: string,
        password?: string
    }
) {
    const { username, password } = input

    if (username) {
        const usernameTextbox = screen.getByRole('textbox', { name: /username/i })
        await user.type(usernameTextbox, username)
    }

    if (password) {
        const passwordTextbox = screen.getByLabelText(/password/i)
        await user.type(passwordTextbox, password)
    }

    const submitButton = screen.getByRole('button', { name: 'Sign Up' })
    await user.click(submitButton)
} 