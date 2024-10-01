import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import ProfileForm from "./ProfileForm"
import userEvent from "@testing-library/user-event"
import { mockUser } from "@/data/placeholder/create/mocks/user"
import { useFormState, useFormStatus } from "react-dom"
import { NestedUser } from "@/data/api/types/model/types"

let profileUser: NestedUser

beforeAll(async () => {
  profileUser = await mockUser(null, true)
})

// Note that you cannot replace this beforeEach with a __mocks__
// implementation since a mock reset removes it.
beforeEach(() => {
  const formStateMock = useFormState as jest.Mock
  formStateMock.mockReturnValue([false, undefined])
  const formStatusMock = useFormStatus as jest.Mock
  formStatusMock.mockReturnValue({ pending: false })
})

const renderSetup = () => {
  render(<ProfileForm user={profileUser} profileView={<></>} />)
}

it("Independent elements", async () => {
  renderSetup()
  const user = userEvent.setup()

  await user.click(screen.getByRole("button", { name: "Open profile form" }))

  // Username input
  expect(screen.getByRole("textbox", { name: "Username" })).toBeInTheDocument()

  // Profile picture input
  expect(screen.getByLabelText("Profile Image")).toBeInTheDocument()

  // Submit button
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()

  // Cancel button
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
})

describe("Update profile action", () => {
  it("Invalid profile image", async () => {
    const mockedFormState = useFormState as jest.Mock
    mockedFormState.mockReturnValue([
      {
        errors: {
          profileImage: ["Profile image is invalid"],
        },
      },
      undefined,
    ])

    renderSetup()
    const user = userEvent.setup()

    await user.click(screen.getByRole("button", { name: "Open profile form" }))

    expect(screen.getByText("Profile image is invalid")).toBeInTheDocument()
  })

  it("Invalid username", async () => {
    const mockedFormState = useFormState as jest.Mock
    mockedFormState.mockReturnValue([
      {
        errors: {
          profileImage: ["Username is invalid"],
        },
      },
      undefined,
    ])

    renderSetup()
    const user = userEvent.setup()

    await user.click(screen.getByRole("button", { name: "Open profile form" }))

    expect(screen.getByText("Username is invalid")).toBeInTheDocument()
  })

  it("Valid inputs", async () => {
    const mockedFormState = useFormState as jest.Mock
    mockedFormState.mockReturnValue([true, undefined])

    renderSetup()
    const user = userEvent.setup()

    await user.click(screen.getByRole("button", { name: "Open profile form" }))

    expect(screen.getByText(/submission accepted/i)).toBeInTheDocument()
  })
})

it("Cancel profile update action", async () => {
  renderSetup()
  const user = userEvent.setup()

  expect(screen.queryByRole("form")).toBeNull()

  await user.click(screen.getByRole("button", { name: "Open profile form" }))

  expect(screen.getByRole("form")).toBeInTheDocument()

  await user.click(screen.getByRole("button", { name: "Cancel" }))

  expect(screen.queryByRole("form")).toBeNull()
})
