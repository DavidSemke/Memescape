import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import ProfileForm from "./ProfileForm"
import ProfileView from "../../view/ProfileView"
import userEvent from "@testing-library/user-event"
import { mockUser } from "@/__tests__/mocks/data/user"
import { useFormState, useFormStatus } from "react-dom"
import { NestedUser } from "@/data/api/types/model/types"

const renderSetup = (profileUser: NestedUser) => {
  render(
    <ProfileForm
      user={profileUser}
      profileView={
        <ProfileView user={profileUser} profileAlt="profile picture" />
      }
    />,
  )
}

let profileUser: NestedUser

beforeAll(async () => {
  profileUser = await mockUser(null, true)
})

// Note that you cannot replace this beforeEach with a __mocks__
// implementation since a mock reset removes it.
beforeEach(() => {
  const mockedFormState = useFormState as jest.Mock
  mockedFormState.mockImplementation((action, initState) => [
    initState,
    undefined,
  ])
  const mockedFormStatus = useFormStatus as jest.Mock
  mockedFormStatus.mockImplementation(() => ({ pending: false }))
})

afterEach(() => {
  jest.resetAllMocks()
})

it("Independent elements", async () => {
  renderSetup(profileUser)
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

    renderSetup(profileUser)
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

    renderSetup(profileUser)
    const user = userEvent.setup()

    await user.click(screen.getByRole("button", { name: "Open profile form" }))

    expect(screen.getByText("Username is invalid")).toBeInTheDocument()
  })

  it("Valid inputs", async () => {
    const mockedFormState = useFormState as jest.Mock
    mockedFormState.mockReturnValue([true, undefined])

    renderSetup(profileUser)
    const user = userEvent.setup()

    await user.click(screen.getByRole("button", { name: "Open profile form" }))

    expect(screen.getByText(/submission accepted/i)).toBeInTheDocument()
  })
})

it("Cancel profile update action", async () => {
  renderSetup(profileUser)
  const user = userEvent.setup()

  expect(screen.queryByRole("form")).toBeNull()

  await user.click(screen.getByRole("button", { name: "Open profile form" }))

  expect(screen.getByRole("form")).toBeInTheDocument()

  await user.click(screen.getByRole("button", { name: "Cancel" }))

  expect(screen.queryByRole("form")).toBeNull()
})
