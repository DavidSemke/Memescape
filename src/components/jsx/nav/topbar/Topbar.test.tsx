import { render, screen } from '@testing-library/react'
import Topbar from "./Topbar"
import { mockUser } from '@/__tests__/mocks/data/user'
import { NestedUser } from '@/data/api/types/model/types'

/* 
    Presence of search button depends on page and scroll position.
    Therefore, it is ignored here.
*/

let sessionUser: NestedUser

beforeAll(async () => {
    sessionUser = await mockUser()
})

it('Independent elements', () => {
    render(<Topbar sessionUser={null}/>)

    expect(screen.getByRole('link', { name: 'Home'})).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: 'Open sidebar'})).toBeInTheDocument()
})

describe('Prop dependent elements', () => {
    it('Valid session user', () => {
        render(<Topbar sessionUser={sessionUser}/>)

        expect(screen.queryByRole('button', { name: 'Sign In'})).toBeNull()
    })

    it('Invalid session user', () => {
        render(<Topbar sessionUser={null}/>)
    
        expect(screen.getByRole('button', { name: 'Sign In'})).toBeInTheDocument()
    })
    
})