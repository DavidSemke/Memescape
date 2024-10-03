import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { CreateMemeModal } from "./CreateMemeModal"
import userEvent from "@testing-library/user-event"
import { generateMemeImage } from "@/data/api/controllers/meme"
import { mockProcessedImage } from "@/data/placeholder/create/mocks/image"

jest.mock("@/data/api/controllers/meme")

beforeEach(() => {
  const generateMemeImageMock = generateMemeImage as jest.Mock
  generateMemeImageMock.mockReturnValue(mockProcessedImage())
})

function renderSetup(
  signedInPairs?: {
    userId: string
    private?: "private"
  },
  onCancel: jest.Mock = jest.fn(),
  onConfirm: jest.Mock = jest.fn(),
) {
  const formData = new FormData()
  const lineCount = 2

  for (let i = 0; i < lineCount; i++) {
    formData.append(`line${i}`, "x")
  }

  formData.append("template-id", "x")
  let download = false

  if (signedInPairs) {
    formData.append("user-id", signedInPairs.userId)

    const privateMeme = signedInPairs.private

    if (privateMeme !== undefined) {
      formData.append("private", privateMeme)
    }
  } else {
    download = true
  }

  render(
    <CreateMemeModal
      lineCount={2}
      formData={formData}
      onCancel={onCancel}
      onConfirm={onConfirm}
      download={download}
    />
  )
}

it("Independent elements", async () => {
  const alt = "Meme image"
  const generateMemeImageMock = generateMemeImage as jest.Mock
  generateMemeImageMock.mockReturnValue(mockProcessedImage(alt))

  renderSetup()

  // Meme image
  const memeImage = await screen.findByRole("img", { name: alt })
  expect(memeImage).toBeInTheDocument()

  // Cancel button
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
})

describe("Prop dependent elements", () => {
  it("Valid session user", async () => {
    renderSetup({ userId: "x" })

    // Meme image state update ignored, so have to use findby here.
    // Otherwise, you get the not wrapped in act(...) warning.
    expect(
      await screen.findByRole("heading", { name: "Create this Meme?" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
    expect(screen.getByText("Private:")).toBeInTheDocument()
  })

  it("Invalid session user", async () => {
    renderSetup()

    // Using findby to avoid act() warning.
    expect(
      await screen.findByRole("heading", { name: "Download this Meme?" }),
    ).toBeInTheDocument()
    // Download link uses aria-labelledby, which is not found using
    // getByRole + name
    expect(screen.getByLabelText("Confirm")).toBeInTheDocument()
    expect(screen.queryByText("Private:")).toBeNull()
  })
})

describe("Confirm action", () => {
  it("Valid session user", async () => {
    const onConfirm = jest.fn()
    renderSetup({ userId: "x" }, undefined, onConfirm)
    const user = userEvent.setup()

    await user.click(screen.getByRole("button", { name: "Confirm" }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it("Invalid session user", async () => {
    const onConfirm = jest.fn((event) => event.preventDefault())
    renderSetup(undefined, undefined, onConfirm)
    const user = userEvent.setup()
    // Download link
    const link = await screen.findByLabelText("Confirm", { selector: 'a' })
    await user.click(link)
    expect(onConfirm).toHaveBeenCalled()
  })
})

it("Cancel action", async () => {
  const onCancel = jest.fn()
  renderSetup(undefined, onCancel)
  const user = userEvent.setup()

  await user.click(screen.getByRole("button", { name: "Cancel" }))
  expect(onCancel).toHaveBeenCalled()
})
