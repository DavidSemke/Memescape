import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import FormStateView from "./FormStateView"
import { useFormStatus } from "react-dom"

beforeEach(async () => {
  const formStatusMock = useFormStatus as jest.Mock
  formStatusMock.mockReturnValue({ pending: false })
})

describe("Prop dependent elements", () => {
  it("state === false", () => {
    const { container } = render(<FormStateView state={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it("state === true", () => {
    render(<FormStateView state={true} />)

    expect(screen.getByText(/accepted/i)).toBeInTheDocument()
  })

  it("state === string", () => {
    const state = "Something went wrong"
    render(<FormStateView state={state} />)

    expect(screen.getByText(state)).toBeInTheDocument()
  })

  it("state === error object", () => {
    const errorsObject = { errors: {} }
    render(<FormStateView state={errorsObject} />)

    expect(screen.getByText(/rejected/i)).toBeInTheDocument()
  })
})

it("pending === true", () => {
  const formStatusMock = useFormStatus as jest.Mock
  formStatusMock.mockReturnValue({ pending: true })

  render(<FormStateView state={false} />)

  expect(screen.getByText(/pending/i)).toBeInTheDocument()
})
