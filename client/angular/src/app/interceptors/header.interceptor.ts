import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http'

import { Globals } from '../globals'

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const token = Globals.currentToken()

    const useToken = () => {

      return token && req.url !== '/api/token-google' && req.url !== '/api/token' && !(req.url === '/api/account' && req.method === 'POST')
    }

    const headers = useToken() ? { token: Globals.currentToken() } : {}

    const newRequest = req.clone({ setHeaders: headers })

    return next.handle(newRequest)
  }
}
