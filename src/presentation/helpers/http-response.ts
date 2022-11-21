import { MissingParamError, MissingServerError } from "./missing-param-error"

export class HttpResponse {
  static badRequest(paramName: string) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError(serverArgumentError: string) {
    return {
      statusCode: 500,
      body: new MissingServerError(serverArgumentError)
    }
  }
}