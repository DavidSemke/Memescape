const originalModule = jest.requireActual("react-dom");
  
module.exports = {
    ...originalModule,
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