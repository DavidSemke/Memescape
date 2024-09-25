import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { SelectTemplateModal } from './SelectTemplateModal'

// function renderSetup() {
//     render(
//         <SelectTemplateModal
            
//         />
//     )
// }

describe('Independent elements', () => {
    it('Includes heading', () => {
        // expect(screen.findByRole('heading', { name: 'Select Template' })).toBeInTheDocument()
    })

    it('Includes searchbar', () => {
        // expect(screen.findByRole('search', { name: '/.*template.*/i' })).toBeInTheDocument()
    })

    it('Includes cancel button', () => {
        // expect(screen.findByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('Includes confirm button', () => {
        // expect(screen.findByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })
})

describe('Template search action', () => {
    // Use lines to id image by alt text
    it('Loads template images on search', () => {
        // expect(screen.findAllByRole('img')).toBeInTheDocument()
    })
})