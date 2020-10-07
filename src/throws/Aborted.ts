import {
  RequestAborted,
  ServerRequest,
  resolve
} from './../../mod.ts'

export default class AbortedError {

  public static getTemplate( aborted: RequestAborted, request: ServerRequest ): string {

    return `
    <!DOCTYPE html>

    <html>
      <head>
        <meta charset="utf-8">
        <title>500 Internal Error</title>
      </head>

      <body>
        <h1>Request have been aborted</h1>

        <div>
          <code>${request.method} "${request.url}"</code>
        </div>

        <p class="reason">${aborted.reason}</p>
      </body>
    </html>
    `
  }

  constructor(
    aborted: RequestAborted,
    request: ServerRequest
  ) {

    const responseHeader = new Headers

    responseHeader.append( 'Content-Type', 'text/html' )

    request.respond({
      status: 500,
      headers: responseHeader,
      body: AbortedError.getTemplate( aborted, request )
    })

  }
}
