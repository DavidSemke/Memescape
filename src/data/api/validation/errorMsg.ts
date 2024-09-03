import { ZodIssueOptionalMessage, ErrorMapCtx } from "zod"

export function minMaxErrorMap(
  fieldName: string, 
  constraints: { min?: number, max?: number }
) {
  const { min, max } = constraints

  if (!min && !max) {
    throw new Error('Neither max nor min length is defined.');
  }

  return (issue: ZodIssueOptionalMessage, ctx: ErrorMapCtx) => {
    if (min && issue.code === 'too_small') {
        return { message: invalidStrLen(fieldName, ctx.data, { min }) }
    }

    if (max && issue.code === 'too_big') {
      return { message: invalidStrLen(fieldName, ctx.data, { max }) }
    }
  
    return { message: ctx.defaultError };
  } 
}

export function invalidStrLen(field: string, value: string, constraints: Constraints) {
  const { min, max } = constraints
  const cappedField = field[0].toUpperCase() + field.slice(1)
  const trunk = `${cappedField} length (${value.length}) must be`

  if (min && max) {
    return `${trunk} ${min} to ${max} characters.`
  } else if (max) {
    return `${trunk} at most ${max} characters.`
  } else if (min) {
    return `${trunk} at least ${min} characters.`
  } else {
    throw new Error(
      `Neither max nor min length is defined for field '${field}'.`,
    )
  }
}

export const error500Msg = 'Something went wrong! Please try again later.'