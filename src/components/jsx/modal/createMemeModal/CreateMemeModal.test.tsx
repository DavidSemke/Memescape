import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CreateMemeModal } from './CreateMemeModal'

describe('Static elements', () => {
    // render(
    //     <CreateMemeModal 
    //         lineCount={2}
    //         formData={}
    //     />
    // )

    it('Includes cancel button', () => {
        expect(screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })
})

// Use lines to id image by alt text
it('Loads meme image', () => {
    expect(screen.findByRole('img')).toBeInTheDocument()
})

it('Session user exists', () => {
    expect(screen.findByRole('heading', { name: 'Create Meme' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByText('Private:')).toBeInTheDocument()
})

it('Session user does not exist', () => {
    expect(screen.findByRole('heading', { name: 'Download Meme' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    expect(screen.queryByText('Private:')).toBeNull()
})