import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import ImageGrid from "./ImageGrid"
import { ProcessedImage } from "@/data/api/types/model/types"
import { mockProcessedImage } from "@/data/placeholder/create/mocks/image"
import userEvent from "@testing-library/user-event"

const imageGroups: ProcessedImage[][] = [
  [mockProcessedImage("image0")],
  [mockProcessedImage("image1")],
]

function renderSetup(
  linkRoot?: string,
  onImageClick?: (image: ProcessedImage) => void,
) {
  render(
    <ImageGrid
      imageGroups={imageGroups}
      linkRoot={linkRoot}
      onImageClick={onImageClick}
    />,
  )
}

describe("Prop dependent elements", () => {
  it("imageGroups", () => {
    renderSetup()
    expect(screen.getAllByRole("img").length).toBe(2)
  })

  it("Defined linkRoot", () => {
    renderSetup("/images")
    expect(screen.getAllByRole("link").length).toBe(2)
  })

  it("Defined onImageClick", async () => {
    const onImageClick = jest.fn((image) => {})
    renderSetup(undefined, onImageClick)
    const user = userEvent.setup()

    await user.click(screen.getAllByRole("img")[0])

    expect(onImageClick).toHaveBeenCalled()
  })
})
