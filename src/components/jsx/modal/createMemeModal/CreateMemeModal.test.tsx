import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CreateMemeModal } from './CreateMemeModal'

function renderSetup() {
    render(
        <CreateMemeModal
            lineCount={2}
            formData={new FormData()}
            onCancel={() => {}}
            onConfirm={() => {}}
        />
    )
}

describe('Independent elements', () => {
    it('Includes cancel button', () => {
    })

    it('Includes meme image', () => {
        // expect(screen.findByRole('img')).toBeInTheDocument()
    })
})

describe('Prop dependent elements', () => {
    it('Valid session user', () => {
        // expect(screen.findByRole('heading', { name: 'Create Meme' })).toBeInTheDocument()
        // expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
        // expect(screen.getByText('Private:')).toBeInTheDocument()
    })

    it('Invalid session user', () => {
        // expect(screen.findByRole('heading', { name: 'Download Meme' })).toBeInTheDocument()
        // expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
        // expect(screen.queryByText('Private:')).toBeNull()
    })
})