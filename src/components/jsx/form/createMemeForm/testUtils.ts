import { Screen } from '@testing-library/react'
import { UserEvent } from '@testing-library/user-event'
import { within } from '@testing-library/react'

type CreateMemeFormScreen = Screen<typeof import(
    "c:/Users/David/Programming/WebDevelopment/Projects/Portfolio/Memescape/node_modules/@testing-library/dom/types/queries"
)>

export async function selectTemplateWithoutConfirm(
    screen: CreateMemeFormScreen, 
    user: UserEvent
) {
    // Open select template modal
    const button = screen.getByRole('button', { name: 'Search for a template' })
    await user.click(button)

    // Trigger mock data fetch by inputting search query
    const searchbarInput = await screen.findByRole('searchbox', { name: 'Template Searchbar' })
    await user.type(searchbarInput, 'test')

    // Select img with alt template0
    const img = await screen.findByRole('img', { name: 'template0' })
    await user.click(img)
}

export async function selectTemplateAndConfirm(
    screen: CreateMemeFormScreen, 
    user: UserEvent
) {
    await selectTemplateWithoutConfirm(screen, user)

    // Confirm
    const modalConfirmButton = screen.getByRole('button', { name: 'Confirm' })
    await user.click(modalConfirmButton)

    expect(screen.queryByRole('dialog')).toBeNull()

    const textboxes = await screen.findAllByRole('textbox', { name: /line [1-9]/i })
    expect(textboxes.length).not.toBe(0)
    expect(screen.queryByText(/select a template/i)).toBeNull()
}

export async function previewMemeWithoutConfirm(
    screen: CreateMemeFormScreen, 
    user: UserEvent,
    sessionUserIsValid: boolean
) {
    await selectTemplateAndConfirm(screen, user)

    const previewButton = screen.getByRole('button', { name: 'Preview' })
    await user.click(previewButton)

    const dialog = await screen.findByRole('dialog')

    if (sessionUserIsValid) {
        // Private option should be visible
        expect(within(dialog).getByText('Private:')).toBeInTheDocument()
    }
}

export async function previewMemeAndConfirm(
    screen: CreateMemeFormScreen, 
    user: UserEvent,
    sessionUserIsValid: boolean
) {
    await previewMemeWithoutConfirm(screen, user, sessionUserIsValid)

    if (sessionUserIsValid) {
        const modalConfirmButton = screen.getByRole('button', { name: 'Confirm' })
        // Confirm
        await user.click(modalConfirmButton)

        return
    }
    
    // Skip clicking link unless you have mocked window location
    expect(screen.getByRole('link', { name: 'Download' })).toBeInTheDocument()
}