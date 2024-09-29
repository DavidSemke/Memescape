module.exports = {
  ...jest.requireActual("react-dom"),
  useFormState: jest.fn(),
  useFormStatus: jest.fn(),
}
