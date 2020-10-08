import {
  IncomingRequest,
  ServerRequest,
  HttpRoute,
  HandleRoute,
  HttpUri
} from './../mod.ts'

export default class Request extends ServerRequest implements IncomingRequest, HandleRoute {

  private _route: HttpRoute

  constructor(worker: {
    route: HttpRoute
  }) {

    super()

    this._route = worker.route
  }

  /**
   * @see IncomingRequest
   */
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
   * @see IncomingRequest
   */
  public get query(): {
    [keyname: string]: string
  } {

    const query: {
      [keyname: string]: string
    } = {}

    const querystring: string | null = this.url.split('?')[1] || null

    if( !querystring ) {

      return {}
    }

    (querystring.split('&') as string[]).forEach( (queryArg: string) => {

      const [name, value] = queryArg.split('=')

      query[name] = value

    } )

    return query
  }

  /**
   * @see IncomingRequest
   */
  public get pathname(): string {

    const pathname: string = this.url.split('?')[0]
    return pathname

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
