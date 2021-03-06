import {
  IncomingResponse,
  AliaseContentType,
  resolve,
  isAbsolute,
  RequestAborted,
  IncomingRequest
} from './../mod.ts'

export default class Response implements IncomingResponse {

  private _status = 200

  private _request: IncomingRequest

  private static _isAborted = false
  private static _isFinish = false

  private static _aborted?: RequestAborted

  /**
   * @var _views absolute path to views file
   */
  private _views: string

  public headers: Headers

  public static get aborted(): RequestAborted | null {

    if( typeof Response._aborted !== "undefined" ) {

      return (Response._aborted as RequestAborted)
    } else {

      return null
    }
  }

  public static get isFinish(): boolean {

    return Response._isFinish
  }

  public static get isAborted(): boolean {

    return Response._isAborted
  }

  /**
   * @description while request is not aborted and response have not already emit
   */
  public static get canContinue(): boolean {

    return !Response.isFinish && !Response.isAborted
  }

  public static associateContentType( aliase: AliaseContentType ): string {

    const associator: {[keyname: string]: string | undefined} = {
      html: "text/html",
      htm: "text/html",
      json: "application/json",
      png: "image/png",
      svg: "image/svg+xml",
      css: "text/css",
      js: "application/x-javascript",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      audio: "audio/webm",
      video: "video/webm",
      text: "text/plain"
    }

    return associator[aliase] || aliase
  }

  constructor(worker: {
    views: string,
    request: IncomingRequest
  }) {

    this._views = worker.views
    this._request = worker.request

    this.headers = new Headers

    this.headers.append('Content-Type', 'text/html')
    this.headers.append('X-Powered-By', 'Onde')
  }

  /**
   * @see IncomingResponse
   */
  public removePoweredBy(): void {

    this.headers.delete('X-Powered-By')
  }

  /**
   * @see IncomingResponse
   */
  public setStatus( status: number | string ): boolean {

    if( typeof status === "string" ) {

      status = parseInt( status )
    }

    if( isNaN(status) ) {

      return false
    } else {

      this._status = status
      return true
    }

  }

  /**
   * @see IncomingResponse
   */
  public setContent( content: string ): void {

    content = Response.associateContentType( (content as AliaseContentType) )

    this.headers.set( "Content-Type", content )
  }

  public render( path: string ): Promise<void> {

    if( !isAbsolute( path ) ) {
      path = resolve( this._views, path )
    }

    return this.sendFile( path )

  }

  public sendFile( absolutePath: string ): Promise<void> {

    return new Promise( (resolve: () => void, reject: () => void) => {

      Deno.open(
        absolutePath,
        {
          read: true,
          write: false
        }
      )
      .then( (file: Deno.File): void => {

        this._request.respond({
          status: this._status,
          headers: this.headers,
          body: (file as Deno.Reader)
        }).then( () => {

          this.finalize([file.rid])

          resolve()

        } )
        .catch( (error: any) => {

          Response._isAborted = true

          Response._aborted = {
            reason: "emit response content have fail"
          }

          if( typeof error !== "undefined" ) {

            Response._aborted.error = error
          }

          reject()

        } )

      } )
      .catch( (error: any) => {

        Response._isAborted = true

        Response._aborted = {
          reason: `cant open response file at: "${absolutePath}", check --allow-read permission`
        }

        if( typeof error !== "undefined" ) {

          Response._aborted.error = error
        }

        reject()

      } )

    } )

  }

  public json( content: JSON ): void {

    this.headers.set('Content-Type', 'application/json')

    this._request.respond({
      status: this._status,
      body: JSON.stringify( content ),
      headers: this.headers
    })
    .then( () => {
      this.finalize([])
    } )
    .catch( (error: any) => {

      Response._isAborted = true
      Response._aborted = {
        reason: "native ServerRequest.respond have fail"
      }

      if( typeof error !== "undefined" ) {

        Response._aborted.error = error
      }

    } )
  }

  /**
   * @param rids list of ressources id to close for finalize request
   */
  private finalize( rids: number[] ): void {

    rids.forEach( (rid: number) => {

      Deno.close( rid )

    } )

    Response._isFinish = true
  }
}
