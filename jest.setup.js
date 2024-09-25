import '@testing-library/jest-dom'

Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    configurable: true,
    writable: true,
    value: jest.fn(() => undefined),
});