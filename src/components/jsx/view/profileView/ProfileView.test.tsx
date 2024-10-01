import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import ProfileView from "./ProfileView"
import { mockUser } from "@/data/placeholder/create/mocks/user"

describe("Prop dependent elements", () => {
  it("User profile image exists", async () => {
    const user = await mockUser(null, true)
    const alt = 'alt'
    render(
        <ProfileView
            user={user}
            profileAlt={alt}
        />
    )

    expect(screen.queryByTitle(alt)).toBeNull()
    expect(screen.getByRole('img', { name: alt })).toBeInTheDocument()
    expect(screen.getByText(user.name)).toBeInTheDocument()
  })

  it("user.profileImage does not exist", async () => {
    const user = await mockUser()
    const alt = 'alt'
    render(
        <ProfileView
            user={user}
            profileAlt={alt}
        />
    )

    expect(screen.getByTitle(alt)).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: alt })).toBeNull()
    expect(screen.getByText(user.name)).toBeInTheDocument()
  })
})