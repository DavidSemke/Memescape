import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Input from "./Input"

it("Independent elements", async () => {
  render(<Input name="x" />)

  expect(screen.getByRole("textbox")).toBeInTheDocument()
})

describe("Prop dependent elements", () => {
  it("Name hyphenated, label undefined", () => {
    render(<Input name="one-two" />)

    expect(screen.getByLabelText("One Two")).toBeInTheDocument()
  })

  it("Label defined", () => {
    const label = "label"
    render(<Input name="x" label={label} />)

    expect(screen.getByLabelText(label)).toBeInTheDocument()
  })

  it("Errors defined, input type hidden", () => {
    const errors = ["1 error", "2 error"]
    render(
      <Input
        name="x"
        errors={errors}
        attrs={{
          input: {
            type: "hidden",
          },
        }}
      />,
    )

    // Input is hidden?
    expect(screen.queryByRole("textbox")).toBeNull()

    // If errors are provided, they should be visible even if
    // the input type is hidden.
    for (const error of errors) {
      expect(screen.getByText(error)).toBeInTheDocument()
    }
  })
})
