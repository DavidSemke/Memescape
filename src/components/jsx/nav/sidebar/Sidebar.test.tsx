import { render, screen } from '@testing-library/react'
import { User } from "@prisma/client"
import createUserData from "@/data/placeholder/create/createUserData"
import Sidebar from "./Sidebar"

let sessionUser: User

beforeAll(async () => {
    [sessionUser] = await createUserData([], 1)
})

it('Session user exists', () => {
    render(
        <Sidebar sessionUser={sessionUser}/>
    )

    // Links
    expect(screen.getByRole('link', { name: 'Your Profile'})).toHaveAttribute('href', `/${sessionUser.name}`)
    expect(screen.getByRole('link', { name: 'Your Memes'})).toHaveAttribute('href', `/memes?user-id=${sessionUser.id}`)
    expect(screen.queryByRole('link', { name: 'Sign Up'})).toBeNull()

    // Buttons
    expect(screen.getByRole('button', { name: 'Sign Out'})).toBeInTheDocument()
})

it('Session user does not exist', () => {
    render(
        <Sidebar sessionUser={null}/>
    )

    // Links
    expect(screen.queryByRole('link', { name: 'Your Profile'})).toBeNull()
    expect(screen.queryByRole('link', { name: 'Your Memes'})).toBeNull()
    expect(screen.getByRole('link', { name: 'Sign Up'})).toHaveAttribute('href', '/sign-up')

    // Buttons
    expect(screen.queryByRole('button', { name: 'Sign Out'})).toBeNull()
})

it('Includes static links', () => {
    render(
        <Sidebar sessionUser={null}/>
    )

    expect(screen.getByRole('link', { name: 'Find Memes'})).toHaveAttribute('href', '/memes')
    expect(screen.getByRole('link', { name: 'Create Meme'})).toHaveAttribute('href', '/memes/create')
})