import { MissingParamError, MissingServerError } from "../errors"
import { UnauthorizedError } from "../errors"

export class HttpResponse {
  static badRequest(error: any) {
    return {
      statusCode: 400,
      body: error
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