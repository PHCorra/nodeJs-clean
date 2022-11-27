import { HttpResponse } from "../helpers/http-response"

type httpRequest = {
  body?: any
  headers?: any
  params?: any
  query?: any
} | undefined

export class LoginRouter {
  authUseCase: any
  constructor(authUseCase: any) {
    this.authUseCase = authUseCase
  }

  async route(httpRequest: httpRequest) {
    try {
      const { email, password } = httpRequest!.body
      if (!email) {
        return HttpResponse.badRequest('email');
      }
      if (!password) {
        return HttpResponse.badRequest('password');
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