import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import SignForm from "./SignForm"
import { useFormState, useFormStatus } from "react-dom"

// Note that you cannot replace this beforeEach with a __mocks__
// implementation since a mock reset removes it.
beforeEach(() => {
  const formStateMock = useFormState as jest.Mock
  formStateMock.mockReturnValue([
    false,
    undefined,
  ])
  const formStatusMock = useFormStatus as jest.Mock
  formStatusMock.mockReturnValue({ pending: false })
})

it("Independent elements", () => {
  render(<SignForm />)

  expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument()
  expect(screen.getByRole("textbox", { name: "Username" })).toBeInTheDocument()
  expect(screen.getByLabelText("Password")).toBeInTheDocument()
})

describe("Prop dependent elements", () => {
  it("Signing up", () => {
    render(<SignForm signingUp={true} />)

    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument()
    // Alternative link
    expect(screen.getByRole("link", { name: "Sign In" })).toBeInTheDocument()
  })

  it("Not signing up", () => {
    render(<SignForm />)

    expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
    // Alternative link
    expect(screen.getByRole("link", { name: "Sign Up" })).toBeInTheDocument()
  })
})

describe("Signing action", () => {
  it("Invalid username", () => {
    ;(useFormState as jest.Mock).mockReturnValue([
      {
        errors: {
          username: ["Username is invalid"],
        },
      },
      undefined,
    ])

    render(<SignForm signingUp={true} />)

    expect(screen.getByText("Username is invalid")).toBeInTheDocument()
  })

  it("Invalid password", () => {
    ;(useFormState as jest.Mock).mockReturnValue([
      {
        errors: {
          username: ["Password is invalid"],
        },
      },
      undefined,
    ])

    render(<SignForm signingUp={true} />)

    expect(screen.getByText("Password is invalid")).toBeInTheDocument()
  })

  it("Invalid, not field-specific", () => {
    ;(useFormState as jest.Mock).mockReturnValue([
      "Something went wrong",
      undefined,
    ])

    render(<SignForm signingUp={true} />)
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("Valid fields", async () => {
    ;(useFormState as jest.Mock).mockReturnValue([true, undefined])

    render(<SignForm signingUp={true} />)

    expect(screen.getByText(/submission accepted/i)).toBeInTheDocument()
  })
})
