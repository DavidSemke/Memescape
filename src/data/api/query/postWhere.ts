export function pageClause(page: number, pageSize: number) {
  if (page < 1) {
    throw new Error("Page cannot be less than 1.")
  }

  if (pageSize < 1) {
    throw new Error("Page size cannot be less than 1.")
  }

  const offset = (page - 1) * pageSize

  return `LIMIT ${pageSize} OFFSET ${offset}`
}
