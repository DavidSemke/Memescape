import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProfileForm from './ProfileForm'
import userEvent from '@testing-library/user-event'
import { NestedUser } from '@/data/api/types/model/types'
import { mockUser } from '@/__tests__/mocks/data/user'
import ProfileView from "../../view/ProfileView"

function renderSetup(
    user: NestedUser
) {
    render(
        <ProfileForm
            user={user}
            profileView={
                <ProfileView 
                    user={profileUser}
                    profileAlt='profile picture'
                />
            }
        />
    )
}

let profileUser: NestedUser

beforeAll(async () => {
    profileUser = await mockUser(null, true)
})

describe('Independent elements', () => {
    it('Includes username input', () => {
        renderSetup(profileUser)
    })

    it('Includes profile picture input', () => {
        renderSetup(profileUser)
    })

    it('Includes submit button', () => {
        renderSetup(profileUser)
    })

    it('Includes cancel button', () => {
        renderSetup(profileUser)
    })
})

describe('Update profile action', () => {
    describe('Invalid username', () => {
        it('Username too long', async () => {
            renderSetup(profileUser)
            const user = userEvent.setup()

            // await signUpSubmit(
            //     screen, 
            //     user, 
            //     { username: 'x'.repeat(usernameLen.max + 1) }
            // )

            // expect(screen.getByText(
            //     /username length \(\d+\) must be .+ characters/i
            // )).toBeInTheDocument()
        })

        it('Username too short', async () => {
            
        })

        it('Username contains invalid character', async () => {
            
        })

        it('Username is listed as illegal', async () => {
           
        })

        it('Username already taken', async () => {
           
        })
    })
})