import { HttpResponse } from "../helpers/http-response"
import { InvalidParamError } from "../errors"
import { MissingParamError } from "../errors"

type httpRequest = {
  body?: any
  headers?: any
  params?: any
  query?: any
} | undefined

export class LoginRouter {
  authUseCase: any
  emailValidator: any
  constructor(authUseCase: any, emailValidator: any) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route(httpRequest: httpRequest) {
    try {
      const { email, password } = httpRequest!.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'));
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'));
      }
      const acessToken = await this.authUseCase.auth(email, password)
      if (!acessToken) {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.ok({ acessToken });
    } catch (error) {
      return HttpResponse.serverError('ServerError')
    }



    // if (!httpRequest || null || !this.authUseCase || !this.authUseCase.auth) {
    //   return HttpResponse.serverError('no httpRequest provided');
    // }
    // if (!httpRequest.body) {
    //   return HttpResponse.serverError('no body provided');
    // }

  }
}