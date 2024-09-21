import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CreateMemeForm from '@/components/jsx/form/createMemeForm/CreateMemeForm'
import { DeepImageGridFetchAction } from '@/components/jsx/grid/DeepImageGrid'
import { mockUser } from '@/__tests__/mocks/data/user'
import { mockProcessedImage } from '@/__tests__/mocks/data/image'
import { 
    selectTemplateWithoutConfirm,
    selectTemplateAndConfirm,
    previewMemeAndConfirm,
    previewMemeWithoutConfirm
} from './testUtils'
import userEvent from '@testing-library/user-event'
import { textLineLen as memeTextLineLen } from '@/data/api/validation/meme'

// Module mocks
jest.mock('@/data/api/controllers/template')
jest.mock('@/data/api/controllers/meme')

// Component prop mocks
const templateGridFetchAction: DeepImageGridFetchAction = async (
    query,
    page,
    pageSize,
) => {
    "use server"

    const templates = []

    for (let i=0; i<pageSize; i++) {
        templates.push(mockProcessedImage(`template${i}`))
    }

    return templates
}
let sessionUserId: string | null

beforeAll(async () => {
    // By default, sessionUserId is not null
    const sessionUser = await mockUser(null, true)
    sessionUserId = sessionUser.id
})

describe('Independent elements', () => {
    beforeEach(() => {
        render(
            <CreateMemeForm 
                sessionUserId={sessionUserId}
                templateGridFetchAction={templateGridFetchAction}
            />
        )
    })

    describe('Template section', () => {
        it('Includes heading', () => {
            expect(screen.getByRole('heading', { name: 'Template' })).toBeInTheDocument()
        })
    
        it('Includes search button', () => {
            expect(screen.getByRole('button', { name: 'Search for a template' })).toBeInTheDocument()
        }) 
    })

    describe('Text section', () => {
        it('Includes heading', () => {
            expect(screen.getByRole('heading', { name: 'Text' })).toBeInTheDocument()
        })
    })

    it('Includes preview button', () => {
        expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument()
    })
})

describe('Prop dependent elements', () => {
    describe('Valid session user', () => {
        beforeEach(() => {
            render(
                <CreateMemeForm 
                    sessionUserId={sessionUserId}
                    templateGridFetchAction={templateGridFetchAction}
                />
            )
        })

        it('Includes heading', () => {
            expect(screen.getByRole('heading', { name: 'Metadata' })).toBeInTheDocument()
        })

        it('Includes private checkbox', () => {
            expect(screen.getByRole('checkbox', { name: 'Private' })).toBeInTheDocument()
        })
    })

    describe('Invalid session user', () => {
        const sessionUserId = null

        beforeEach(() => {
            render(
                <CreateMemeForm 
                    sessionUserId={sessionUserId}
                    templateGridFetchAction={templateGridFetchAction}
                />
            )
        })

        it('Excludes heading', () => {
            expect(screen.queryByRole('heading', { name: 'Metadata' })).toBeNull()
        })

        it('Excludes private checkbox', () => {
            expect(screen.queryByRole('checkbox', { name: 'Private' })).toBeNull()
        })
    })
})

describe('Selecting template action', () => {
    beforeEach(() => {
        render(
            <CreateMemeForm 
                sessionUserId={sessionUserId}
                templateGridFetchAction={templateGridFetchAction}
            />
        )
    })
        
    it('Text inputs hidden before selection', () => {
        const textboxes = screen.queryAllByRole('textbox', { name: /line [1-9]/i })
        expect(textboxes.length).toBe(0)
        expect(screen.getByText(/select a template/i)).toBeInTheDocument()
    })

    it('Confirming selection', async () => {
        const user = userEvent.setup()
        await selectTemplateAndConfirm(screen, user)
    })
    
    it('Canceling selection', async () => {
        const user = userEvent.setup()
        await selectTemplateWithoutConfirm(screen, user)

        // Cancel
        const modalCancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(modalCancelButton)

        expect(screen.queryAllByRole('textbox', { name: /line [1-9]/i }).length).toBe(0)
        expect(screen.getByText(/select a template/i)).toBeInTheDocument()
    })
})

describe('Previewing action', () => {
    describe('Valid session user', () => {
        beforeEach(() => {
            render(
                <CreateMemeForm 
                    sessionUserId={sessionUserId}
                    templateGridFetchAction={templateGridFetchAction}
                />
            )
        })

        describe('Failed preview', () => {
            it('Missing template', async () => {
                const user = userEvent.setup()
                
                const previewButton = screen.getByRole('button', { name: 'Preview' })
                await user.click(previewButton)

                const errorText = await screen.findByText(/template is required/i)
                expect(errorText).toBeInTheDocument()
            })

            it('Line textbox exceeds max length', async () => {
                const user = userEvent.setup()

                await selectTemplateAndConfirm(screen, user)

                const lineTextbox = await screen.findByRole('textbox', { name: /line 1/i })
                await user.type(lineTextbox, 'x'.repeat(memeTextLineLen.max + 1))

                const previewButton = screen.getByRole('button', { name: 'Preview' })
                await user.click(previewButton)

                const errorText = await screen.findByText(
                    /line 1 length \(\d+\) must be .+ characters/i
                )
                expect(errorText).toBeInTheDocument()
            })
        })

        it('Confirming meme creation', async () => {
            const user = userEvent.setup()
            await previewMemeAndConfirm(screen, user, sessionUserId !== null)
        })
        
        it('Canceling meme creation', async () => {
            const user = userEvent.setup()
            await previewMemeWithoutConfirm(screen, user, sessionUserId !== null)

            // Cancel
            const modalCancelButton = screen.getByRole('button', { name: 'Cancel' })
            await user.click(modalCancelButton)

            expect(screen.queryByRole('dialog')).toBeNull()
        })
    })

    // Redundant tests:
    // 1 - Error message checks
    // 2 - Dialog cancel checks
    describe('Invalid session user', () => {
        const sessionUserId = null
        
        beforeEach(() => {
            render(
                <CreateMemeForm 
                    sessionUserId={sessionUserId}
                    templateGridFetchAction={templateGridFetchAction}
                />
            )
        })

        it('Confirming meme creation', async () => {
            const user = userEvent.setup()
            await previewMemeAndConfirm(screen, user, sessionUserId !== null)
        })
    })    
})