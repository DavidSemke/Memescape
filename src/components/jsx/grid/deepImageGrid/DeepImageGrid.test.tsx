import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DeepImageGrid, { DeepImageGridFetchAction } from './DeepImageGrid'
import { ProcessedImage } from '@/data/api/types/model/types'
import { mockProcessedImage } from '@/__tests__/mocks/data/image'
import userEvent from '@testing-library/user-event'

/*
    Ignore linkRoot and onImageClick params.
    These are handled in the ImageGrid component.
*/

const fetchActionMock: DeepImageGridFetchAction = jest.fn(async (
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
})

function renderSetup(
    initImages: ProcessedImage[] = [],
    pageSize = 1
) {
    render(
        <DeepImageGrid 
            initImages={initImages}
            fetchAction={fetchActionMock}
            query={null}
            pageSize={pageSize}
        />
    )
}

describe('Prop dependent elements', () => {
    it('initImages', () => {
        const initImages: ProcessedImage[] = [
            mockProcessedImage('initImage0'),
            mockProcessedImage('initImage1')
        ]

        renderSetup(initImages)
        expect(screen.getAllByRole('img').length).toBe(initImages.length)
    })

    it('pageSize', async () => {
        renderSetup()
        

        expect(screen.getAllByRole('img').length).toBe(initImages.length)
    })
})