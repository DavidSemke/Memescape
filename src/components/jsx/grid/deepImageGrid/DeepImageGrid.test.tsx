import '@testing-library/jest-dom'
import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import DeepImageGrid, { DeepImageGridFetchAction } from './DeepImageGrid'
import { mockProcessedImage } from '@/__tests__/mocks/data/image'
import userEvent from '@testing-library/user-event'

/*
    Ignore linkRoot and onImageClick params.
    These are handled in the ImageGrid component.
*/

const fetchAction: DeepImageGridFetchAction = async (
    query,
    page,
    pageSize,
) => {
    "use server"

    const images = []

    for (let i=0; i<pageSize; i++) {
        images.push(mockProcessedImage(`page${page}-image${i}`))
    }

    return images
}
let fetchActionMock: jest.Mock

beforeEach(() => {
    fetchActionMock = jest.fn(fetchAction)
})

afterEach(() => {
    jest.resetAllMocks()
})

function renderSetup(
    addInitImages = false,
    query: string | null = null,
    pageSize = 1
) {
    render(
        <DeepImageGrid 
            addInitImages={addInitImages}
            fetchAction={fetchActionMock}
            query={query}
            pageSize={pageSize}
        />
    )
}

describe('Prop dependent elements', () => {
    it('addInitImages === false', async () => {
        renderSetup(false)
        
        const images = screen.queryAllByRole(
            'img', { name: /page\d+-image\d+/}
        )
        expect(images.length).toBe(0)
    })

    it('addInitImages === true, query === ""', async () => {
        renderSetup(true, '', 1)

        const images = screen.queryAllByRole(
            'img', { name: /page\d+-image\d+/}
        )
        expect(images.length).toBe(0)
    })

    it('addInitImages === true, query !== "", pageSize === 0', async () => {
        renderSetup(true, null, 0)
        
        await waitFor(() => {
            const images = screen.queryAllByRole(
                'img', { name: /page\d+-image\d+/}
            )
            expect(images.length).toBe(0)
        })
    })

    it('addInitImages === true, query !== "", pageSize > 0', async () => {
        const pageSize = 1
        renderSetup(true, null, pageSize)

        const images = await screen.findAllByRole(
            'img', { name: /page\d+-image\d+/}
        )
        expect(images.length).toBe(pageSize)
    })
})

it('Load more images action', async () => {
    const pageSize = 1
    renderSetup(true, null, pageSize)
    const user = userEvent.setup()

    // Load more images on click.
    let moreButton = await screen.findByRole('button', { name: 'More' })
    await user.click(moreButton)
    expect(fetchActionMock).toHaveBeenCalled()

    // addInitImages === true, so it started with pageSize images.
    // Therefore, adding pageSize images means there are pageSize * 2 images.
    const images = await screen.findAllByRole(
        'img', { name: /page\d+-image\d+/}
    )
    expect(images.length).toBe(pageSize * 2)

    // Load more images, but this time there are no more to show.
    fetchActionMock.mockImplementation(async (query, page, pageSize) => {
        "use server"
        return []
    })

    moreButton = await screen.findByRole('button', { name: 'More' })
    await user.click(moreButton)
    expect(fetchActionMock).toHaveBeenCalled()

    // If a page has fewer than pageSize images, it should show text
    // that indicates that there are no more images.
    const endOfResultsText = await screen.findByText(/end of results/i)
    expect(endOfResultsText).toBeInTheDocument()
})