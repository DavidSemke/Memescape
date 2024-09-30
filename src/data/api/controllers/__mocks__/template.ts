import { mockTemplate } from "@/data/placeholder/create/mocks/template"

module.exports = {
  ...jest.requireActual("@/data/api/controllers/template"),
  getOneTemplate: jest.fn(async (id: string, includeImage: boolean = false) => {
    return mockTemplate({ id })
  }),
}
