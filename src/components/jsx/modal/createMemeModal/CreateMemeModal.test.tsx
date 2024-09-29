import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CreateMemeModal } from './CreateMemeModal'

jest.mock('@/data/api/controllers/meme')

function renderSetup(
    signedInPairs?: {
        'user-id': string
        'private': 'private' | null
    }
) {
    const formData = new FormData()
    const lineCount = 2

    for (let i=0; i<lineCount; i++) {
        formData.append(`line${i}`, 'x')
    }

    formData.append('template-id', 'x')
    let download = false

    if (signedInPairs) {
        formData.append('user-id', signedInPairs['user-id'])

        const privateMeme = signedInPairs['private']

        if (privateMeme !== null) {
            formData.append('private', privateMeme)
        }
    }
    else {
        download = true
    }

    render(
        <CreateMemeModal
            lineCount={2}
            formData={formData}
            onCancel={() => {}}
            onConfirm={() => {}}
            download={download}
        />
    )
}

it('Independent elements', async () => {
    renderSetup()

    // Cancel button
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    // Meme image
    expect(await screen.findByRole('img')).toBeInTheDocument()
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