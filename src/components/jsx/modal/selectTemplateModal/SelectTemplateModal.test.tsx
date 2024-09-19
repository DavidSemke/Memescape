import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { SelectTemplateModal } from './SelectTemplateModal'

describe('Static elements', () => {
    // render(
    //     <SelectTemplateModal 
    //         
    //     />
    // )

    it('Includes heading', () => {
        expect(screen.findByRole('heading', { name: 'Select Template' })).toBeInTheDocument()
    })

    it('Includes searchbar', () => {
        expect(screen.findByRole('search', { name: '/.*template.*/i' })).toBeInTheDocument()
    })

    it('Includes cancel button', () => {
        expect(screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('Includes confirm button', () => {
        expect(screen.findByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })
})

// Use lines to id image by alt text
it('Loads template images on search', () => {
    expect(screen.findAllByRole('img')).toBeInTheDocument()
})