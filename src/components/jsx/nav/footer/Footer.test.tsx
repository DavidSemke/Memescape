import { render, screen } from '@testing-library/react'
import Footer from "./Footer"

it('Includes logo link', () => {
    render(
        <Footer />
    )

    expect(screen.getByRole('link', { name: 'Home'})).toHaveAttribute('href', '/')})

it('Includes copyright', () => {
    render(
        <Footer />
    )

    expect(screen.getByText('©', { exact: false })).toBeInTheDocument()
})