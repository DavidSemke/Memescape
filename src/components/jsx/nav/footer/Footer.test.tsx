import { render, screen } from '@testing-library/react'
import Footer from "./Footer"

it('Independent elements', () => {
    render(<Footer />)

    // logo link
    expect(screen.getByRole('link', { name: 'Home'})).toHaveAttribute('href', '/')
    // copyright
    expect(screen.getByText(/©/)).toBeInTheDocument()
})