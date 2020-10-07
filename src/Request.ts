import {
  IncomingRequest,
  ServerRequest,
  HttpRoute,
  HandleRoute,
  HttpUri
} from './../mod.ts'

export default class Request extends ServerRequest implements IncomingRequest, HandleRoute {

  private _route: HttpRoute
  private _static: string | null = null

  constructor(worker: {
    route: HttpRoute,
    static: string | null
  }) {

    super()

    this._route = worker.route
    this._static = worker.static
  }

  public get isStaticFile(): boolean {

    if( this._static === null ) {
      // have not define static directory
      return false
    }

    const staticUris: string[] = HttpRoute
      .uncompoze( this._static )
      .map( (uri: HttpUri): string => uri.name )

    const requestUris: string[] = this._route.uris
      .map( (uri: HttpUri): string => uri.name )

    let isMatch = true

    staticUris.forEach( (uri: string, index: number) => {

      if( uri !== requestUris[index] ) {
        isMatch = false
      }

    } )

    return isMatch
  }

  public get params(): {
    [keyname: string]: string
  } {

    const realUris: HttpUri[] = HttpRoute.uncompoze( this.url )

    const params: {[keyname: string]: string} = {}

    this._route.uris.forEach( (uri: HttpUri, index: number): void => {

      if( uri.isParam ) {

        params[ uri.name ] = realUris[index].name

      }

    } )

    return params
  }

  /**
   * @see HandleRoute
   */
  public hasParam(name: string): boolean {

    return this._route.hasParam( name )
  }

  /**
   * @see HandleRoute
   */
  public hasUri(name: string): boolean {

    return this._route.hasUri( name )
  }

}
