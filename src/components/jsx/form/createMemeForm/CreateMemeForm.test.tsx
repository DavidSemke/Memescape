import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import CreateMemeForm from "./CreateMemeForm"
import { mockUser } from "@/data/placeholder/create/mocks/user"
import {
  templateFetch,
  selectTemplateWithoutConfirm,
  selectTemplateAndConfirm,
  previewMemeAndConfirm,
  previewMemeWithoutConfirm,
} from "./testUtils"
import userEvent from "@testing-library/user-event"
import { textLineLen as memeTextLineLen } from "@/data/api/validation/meme"
import { useFormState, useFormStatus } from "react-dom"
import { generateMemeImage, postMeme } from "@/data/api/controllers/meme"
import { getOneTemplate } from "@/data/api/controllers/template"
import { mockTemplate } from "@/data/placeholder/create/mocks/template"
import { mockProcessedImage } from "@/data/placeholder/create/mocks/image"

jest.mock("@/data/api/controllers/meme")
jest.mock("@/data/api/controllers/template")

let sessionUserId: string | null

beforeAll(async () => {
  const sessionUser = await mockUser(null, true)
  sessionUserId = sessionUser.id
})

let templateFetchMock: jest.Mock

beforeEach(async () => {
  templateFetchMock = jest.fn(templateFetch)

  const formStateMock = useFormState as jest.Mock
  formStateMock.mockReturnValue([false, undefined])
  const formStatusMock = useFormStatus as jest.Mock
  formStatusMock.mockReturnValue({ pending: false })

  const getOneTemplateMock = getOneTemplate as jest.Mock
  getOneTemplateMock.mockReturnValue(mockTemplate())

  const generateMemeImageMock = generateMemeImage as jest.Mock
  generateMemeImageMock.mockReturnValue(mockProcessedImage())
  const postMemeMock = postMeme as jest.Mock
  postMemeMock.mockReturnValue(true)
})

function renderSetup(sessionUserId: string | null) {
  render(
    <CreateMemeForm
      sessionUserId={sessionUserId}
      templateGridFetchAction={templateFetchMock}
    />,
  )
}

it("Independent elements", () => {
  renderSetup(sessionUserId)

  // Template section
  expect(screen.getByRole("heading", { name: "Template" })).toBeInTheDocument()
  expect(
    screen.getByRole("button", { name: "Search for a template" }),
  ).toBeInTheDocument()

  // Text section
  expect(screen.getByRole("heading", { name: "Text" })).toBeInTheDocument()

  // Sectionless
  expect(screen.getByRole("button", { name: "Preview" })).toBeInTheDocument()
})

describe("Prop dependent elements", () => {
  it("Valid session user", () => {
    renderSetup(sessionUserId)

    expect(
      screen.getByRole("heading", { name: "Metadata" }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole("checkbox", { name: "Private" }),
    ).toBeInTheDocument()
  })

  it("Invalid session user", () => {
    renderSetup(null)

    expect(screen.queryByRole("heading", { name: "Metadata" })).toBeNull()

    expect(screen.queryByRole("checkbox", { name: "Private" })).toBeNull()
  })
})

describe("Selecting template action", () => {
  it("Text inputs hidden before selection", () => {
    renderSetup(sessionUserId)
    const textboxes = screen.queryAllByRole("textbox", { name: /line [1-9]/i })
    expect(textboxes.length).toBe(0)
    expect(screen.getByText(/select a template/i)).toBeInTheDocument()
  })

  it("Confirming selection", async () => {
    renderSetup(sessionUserId)
    const user = userEvent.setup()
    await selectTemplateAndConfirm(screen, user)
  })

  it("Canceling selection", async () => {
    renderSetup(sessionUserId)
    const user = userEvent.setup()
    await selectTemplateWithoutConfirm(screen, user)

    // Cancel
    const modalCancelButton = screen.getByRole("button", { name: "Cancel" })
    await user.click(modalCancelButton)

    expect(
      screen.queryAllByRole("textbox", { name: /line [1-9]/i }).length,
    ).toBe(0)
    expect(screen.getByText(/select a template/i)).toBeInTheDocument()
  })
})

describe("Previewing action", () => {
  describe("Valid session user", () => {
    describe("Failed preview", () => {
      it("Missing template", async () => {
        renderSetup(sessionUserId)
        const user = userEvent.setup()

        const previewButton = screen.getByRole("button", { name: "Preview" })
        await user.click(previewButton)

        const errorText = await screen.findByText(/template is required/i)
        expect(errorText).toBeInTheDocument()
      })

      it("Line textbox exceeds max length", async () => {
        renderSetup(sessionUserId)
        const user = userEvent.setup()

        await selectTemplateAndConfirm(screen, user)

        const lineTextbox = await screen.findByRole("textbox", {
          name: /line 1/i,
        })
        await user.type(lineTextbox, "x".repeat(memeTextLineLen.max + 1))

        const previewButton = screen.getByRole("button", { name: "Preview" })
        await user.click(previewButton)

        const errorText = await screen.findByText(
          /line 1 length \(\d+\) must be .+ characters/i,
        )
        expect(errorText).toBeInTheDocument()
      })
    })

    it("Confirming meme creation", async () => {
      renderSetup(sessionUserId)
      const user = userEvent.setup()
      await previewMemeAndConfirm(screen, user, sessionUserId !== null)
    })

    it("Canceling meme creation", async () => {
      renderSetup(sessionUserId)
      const user = userEvent.setup()
      await previewMemeWithoutConfirm(screen, user, sessionUserId !== null)

      // Cancel
      const modalCancelButton = screen.getByRole("button", { name: "Cancel" })
      await user.click(modalCancelButton)

      expect(screen.queryByRole("dialog")).toBeNull()
    })
  })

  // Redundant tests:
  // 1 - Error message checks
  // 2 - Dialog cancel checks
  describe("Invalid session user", () => {
    const sessionUserId = null

    it("Confirming meme creation", async () => {
      renderSetup(sessionUserId)
      const user = userEvent.setup()
      await previewMemeAndConfirm(screen, user, sessionUserId !== null)
    })
  })
})
