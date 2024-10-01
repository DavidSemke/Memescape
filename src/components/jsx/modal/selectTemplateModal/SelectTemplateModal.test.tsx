import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import { SelectTemplateModal } from "./SelectTemplateModal"
import { DeepImageGridFetchAction } from "../../grid/deepImageGrid/DeepImageGrid"
import { mockProcessedImage } from "@/data/placeholder/create/mocks/image"
import userEvent from "@testing-library/user-event"

const templateFetch: DeepImageGridFetchAction = async (
  query,
  page,
  pageSize,
) => {
  "use server"

  const templates = []

  for (let i = 0; i < pageSize; i++) {
    templates.push(mockProcessedImage(`template${i}`))
  }

  return templates
}

function renderSetup(
  fetchAction = jest.fn(templateFetch),
  onTemplateSelect = jest.fn(),
  onCancel = jest.fn(),
  onConfirm = jest.fn(),
) {
  render(
    <SelectTemplateModal
      fetchAction={fetchAction}
      onTemplateSelect={onTemplateSelect}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

it("Independent elements", () => {
  renderSetup()

  expect(screen.getByRole('heading', { name: 'Select Template' })).toBeInTheDocument()
  expect(screen.getByRole('search')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
})

it("Template search action", async () => {
  renderSetup()
  const user = userEvent.setup()

  await waitFor(() => {
    expect(
      screen.queryAllByRole('img', { name: /template\d/ }).length
    ).toBe(0)
  })
  
  await user.type(
    screen.getByRole('searchbox'),
    'test'
  )

  expect(
    (await screen.findAllByRole('img', { name: /template\d/ })).length
  ).not.toBe(0)
})

it('Select action', async () => {
  const onTemplateSelect = jest.fn()
  renderSetup(undefined, onTemplateSelect)
  const user = userEvent.setup()

  await user.type(
    screen.getByRole('searchbox'),
    'test'
  )

  await user.click(
    await screen.findByRole('img', { name: 'template0' })
  )

  expect(onTemplateSelect).toHaveBeenCalled()
})

it('Confirm action', async () => {
  const onConfirm = jest.fn()
  renderSetup(undefined, undefined, undefined, onConfirm)
  const user = userEvent.setup()

  await user.click(
    screen.getByRole('button', { name: 'Confirm' })
  )

  expect(onConfirm).toHaveBeenCalled()
})

it('Cancel action', async () => {
  const onCancel = jest.fn()
  renderSetup(undefined, undefined, onCancel)
  const user = userEvent.setup()

  await user.click(
    screen.getByRole('button', { name: 'Cancel' })
  )

  expect(onCancel).toHaveBeenCalled()
})