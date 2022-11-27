import { MissingParamError, MissingServerError } from "./missing-param-error"
import { UnauthorizedError } from "./unauthorizedError"

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

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static ok(data: any) {
    return {
      statusCode: 200,
      body: data
    }
  }
}