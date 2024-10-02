import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import TabbedView from "./TabbedView"
import userEvent from "@testing-library/user-event"

describe("Prop dependent elements", () => {
  it("Zero tabs", async () => {
    jest.spyOn(console, "error").mockImplementation(() => null)

    expect(() => {
      render(<TabbedView tabs={[]} />)
    }).toThrow()
  })

  it("One tab (or more)", async () => {
    const viewText = "test"
    const tabs = [{ label: "One", view: <>{viewText}</> }]
    render(<TabbedView tabs={tabs} />)

    expect(
      screen.getByRole("button", { name: tabs[0].label }),
    ).toBeInTheDocument()
    expect(screen.getByText(viewText)).toBeInTheDocument()
  })
})

it.only("Switch tabs action", async () => {
  const viewTexts = ["view0", "view1"]
  const tabs = viewTexts.map((viewText) => ({
    label: viewText + "-label",
    view: <>{viewText}</>,
  }))
  render(<TabbedView tabs={tabs} />)
  const user = userEvent.setup()

  // Start with view at index 0 open
  expect(screen.getByText(viewTexts[0])).not.toHaveClass("hidden")
  // View at index 1 hidden
  expect(screen.getByText(viewTexts[1])).toHaveClass("hidden")

  // Switch to index 1 view
  await user.click(screen.getByRole("button", { name: tabs[1].label }))

  expect(screen.getByText(viewTexts[0])).toHaveClass("hidden")
  expect(screen.getByText(viewTexts[1])).not.toHaveClass("hidden")
})
