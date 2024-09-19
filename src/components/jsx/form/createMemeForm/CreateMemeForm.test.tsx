import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import CreateMemeForm from '@/components/jsx/form/createMemeForm/CreateMemeForm'
import { DeepImageGridFetchAction } from '@/components/jsx/grid/DeepImageGrid'
import { mockUser } from '@/__tests__/mocks/data/user'
import { mockProcessedImage } from '@/__tests__/mocks/data/image'

const templateGridFetchAction: DeepImageGridFetchAction = async (
    query,
    page,
    pageSize,
) => {
    "use server"

    const templates = []

    for (let i=0; i<pageSize; i++) {
        templates.push(mockProcessedImage())
    }

    return templates
}

let sessionUserId: string | null

beforeAll(async () => {
    // By default, sessionUserId is not null
    const sessionUser = await mockUser(null, true)
    sessionUserId = sessionUser.id
})

beforeEach(() => {
    render(
        <CreateMemeForm 
            sessionUserId={sessionUserId}
            templateGridFetchAction={templateGridFetchAction}
        />
    )
})

describe('Template section', () => {
    describe('Static elements', () => {
        it('Includes heading', () => {
            expect(screen.getByRole('heading', { name: 'Template' })).toBeInTheDocument()
        })
    
        it('Includes search button', () => {
            expect(screen.getByRole('button', { name: 'Search for a template' })).toBeInTheDocument()
        }) 
    })

    it('Template selected', async () => {
        expect(screen.getByRole('img', { name: 'template' })).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'template' })).toBeInTheDocument()

    })

    it('Template not selected', async () => {
        expect(screen.queryByRole('img', { name: 'template' })).toBeInTheDocument()
    
    })

    it('Select template modal opens', () => {
        expect(screen.getByRole('button', { name: 'Search for a template' })).toBeInTheDocument()
    }) 
})

describe('Text section', () => {
    describe('Static elements', () => {
        it('Includes heading', () => {
            expect(screen.getByRole('heading', { name: 'Text' })).toBeInTheDocument()
        })
    })

    it('Template selected', async () => {
        const button = screen.getByRole('button', { name: 'Search for a template' })
        fireEvent.click(button)

        // expect dialog to be in document
        // 

        // select template button
        // select template
        // select confirm

        expect(screen.findAllByRole('textbox', { name: '/^line \d$/i' }).length).not.toEqual(0)
        expect(screen.queryByText('/.*you must select a template.*/i')).toBeNull()
    })

    it('Template not selected', async () => {
        expect(screen.getAllByRole('textbox', { name: '/^line \d$/i' }).length).toEqual(0)
        expect(screen.getByText('/.*you must select a template.*/i')).toBeInTheDocument()
    })  
})
  
describe('Metadata section', () => {
    it('Session user exists', () => {
        expect(screen.getByRole('heading', { name: 'Metadata' })).toBeInTheDocument()
        expect(screen.getByRole('checkbox', { name: 'private' })).toBeInTheDocument()
    })

    it('Session user does not exist', () => {
        render(
            <CreateMemeForm 
                sessionUserId={null}
                templateGridFetchAction={templateGridFetchAction}
            />
        )
    
        expect(screen.queryByRole('heading', { name: 'Metadata' })).toBeNull()
        expect(screen.queryByRole('checkbox', { name: 'private' })).toBeNull()
    })
})

describe('Preview elements', () => {
    describe('Static elements', () => {
        it('Includes preview button', () => {
            expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument()
        })
    })
    
    describe('Preview button selected', () => {
        describe('Failed preview', () => {
            it('Missing template', () => {

            })
    
            it('Missing text', () => {
                
            })
    
            it('Missing metadata', () => {
                
            })
        })

        it('Create meme modal opens', () => {
            
        })
        
        it('Cancel on preview', () => {

        })

        it('Confirm on preview', () => {

        })
    })
})