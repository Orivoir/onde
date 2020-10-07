import {
  Route,
  HandleRoute,
  HttpLocation,
  HttpUri,
  OnRequest
} from './../mod.ts'

export default class HttpRoute implements Route, HandleRoute {

  /**
   * @see Route
   */
  public path: HttpLocation

  /**
   * @see Route
   */
  public methods: string[] = []

  /**
   * @see Route
   */
  public callback: OnRequest

  constructor( route: Route ) {

    this.path = route.path
    this.callback = route.callback
    this.methods = route.methods
  }

  /**
   * @param name param name to check exists from `path`
   * @see HandleRoute
   */
  public hasParam( name: string ): boolean {

    return !!this.params.find( (param: string): boolean => (
      param === name
    ) )

  }

  /**
   * @param name uri name to check exists from `path`
   * @see HandleRoute
   */
  public hasUri( name: string ): boolean {

    return !!this.uris.find( (uri: HttpUri): boolean => (
      uri.name === name
    ) )

  }

  /**
   * @var uris separator uri's
   */
  public get uris(): HttpUri[] {

    if( typeof this.path === "string" ) {

      this.path = this.path as string

      const uris: HttpUri[] = HttpRoute.uncompoze( this.path )

      return uris

    } else {

      return []
    }

  }

  public get params(): string[] {

    return this.uris.filter( (uri: HttpUri): boolean => (
      uri.isParam
    ) )
    .map( (uri: HttpUri): string => (
      uri.name.slice( 1, )
    ) )

  }

  public static uncompoze( path: string ): HttpUri[] {

    const uris: HttpUri[] = path
    .split('/')
    .filter( (uri: string): boolean => (
      !!uri.trim().length
    ) )
    .map( (uri: string): HttpUri => {

      uri = uri.trim()
      let isParam: boolean = false

      if( uri.charAt(0) === ":" ) {
        isParam = true
      }

      return {
        name: uri,
        isParam
      }

    } )

    return uris

  }

}
