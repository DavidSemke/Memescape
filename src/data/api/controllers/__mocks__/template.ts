import { mockTemplate } from "@/__tests__/mocks/data/template"

module.exports = {
  ...jest.requireActual("@/data/api/controllers/template"),
  getOneTemplate: jest.fn(async (id: string, includeImage: boolean = false) => {
    return mockTemplate({ id })
  }),
}
