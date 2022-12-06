export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

export class MissingServerError extends Error {
  constructor(serverArgumentError: string) {
    super(`Missing server argument: ${serverArgumentError}`)
    this.name = 'ServerError'
  }
}