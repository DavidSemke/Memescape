import { render, screen } from '@testing-library/react'
import Sidebar from "./Sidebar"
import { mockUser } from '@/__tests__/mocks/data/user'
import { NestedUser } from '@/data/api/types/model/types'

let sessionUser: NestedUser

beforeAll(async () => {
    sessionUser = await mockUser(null, true)
})

it('Independent elements', () => {
    render(<Sidebar sessionUser={null}/>)

    expect(screen.getByRole('link', { name: 'Find Memes'})).toHaveAttribute('href', '/memes')
    expect(screen.getByRole('link', { name: 'Create Meme'})).toHaveAttribute('href', '/memes/create')
})

describe('Prop dependent elements', () => {
    it('Valid session user', () => {
        render(<Sidebar sessionUser={sessionUser}/>)
    
        // Profile pic
        expect(screen.getByAltText(/profile picture/)).toBeInTheDocument()
    
        // Links
        expect(screen.getByRole('link', { name: 'Your Profile'})).toHaveAttribute('href', `/${sessionUser.name}`)
        expect(screen.getByRole('link', { name: 'Your Memes'})).toHaveAttribute('href', `/memes?user-id=${sessionUser.id}`)
        expect(screen.queryByRole('link', { name: 'Sign Up'})).toBeNull()
    
        // Buttons
        expect(screen.getByRole('button', { name: 'Sign Out'})).toBeInTheDocument()
    })

    it('Invalid session user', () => {
        render(<Sidebar sessionUser={null}/>)
    
        // Profile pic
        expect(screen.getByLabelText(/profile picture/)).toBeInTheDocument()
    
        // Links
        expect(screen.queryByRole('link', { name: 'Your Profile'})).toBeNull()
        expect(screen.queryByRole('link', { name: 'Your Memes'})).toBeNull()
        expect(screen.getByRole('link', { name: 'Sign Up'})).toHaveAttribute('href', '/sign-up')
    
        // Buttons
        expect(screen.queryByRole('button', { name: 'Sign Out'})).toBeNull()
    })
    
})