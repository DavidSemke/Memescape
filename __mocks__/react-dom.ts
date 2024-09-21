module.exports = {
    ...jest.requireActual("react-dom"),
    useFormState: () => [
    [
        // mock state
        false,
        // mock setState function
        jest.fn(),
    ],
    ],
    useFormStatus: () => ({ pending: false }),
};