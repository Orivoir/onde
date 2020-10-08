import {
  isAbsolute,
  resolve,
  normalize,

  OndeConfig,
  OndeRouter,
  OndeDone,

  OnRequest,
  HttpRoute,
  HttpLocation,
  Route,
  HttpUri,
  Response,
  Request,
  AbortedError,
  RequestAborted,

  ServerRequest,
  Server
} from './../mod.ts'

class Onde implements OndeConfig, OndeRouter, OndeDone {

  static get PERMISSION_REQUIRED(): string[] {

    return [
      "--allow-read"
    ]

  }

  private _views = "./views"
  private _routes: Array<HttpRoute> = []

  /**
   * @see OndeConfig
   */
  get views(): string {
    return !isAbsolute(this._views) ? resolve( Deno.cwd(), this._views ): this._views
  }
  set views(path: string) {

    this._views = this.set( "views", path )
  }

  public listen(server: Server): void {

    // fx async wrap because top-level-async only work for modules
    // @see <https://github.com/denoland/deno/issues/4207>
    ( async() => {

      for await (const r of server) {

        const request = r as ServerRequest

        const routes = this.findRoutes( request )

        if( !routes.length ) {
          // 404
        }

        routes.forEach( (route: HttpRoute): void => {

          if( Response.isFinish ) {
            // http response have already emit
          }

          if( Response.isAborted ) {

            new AbortedError(
              (Response.aborted as RequestAborted),
              request
            )

          }

          if( Response.canContinue ) {

            const incomingRequest = new Request( { route } )

            const incomingResponse = new Response( {
              views: this.views,
              request: incomingRequest
            } )

            route.callback( incomingRequest, incomingResponse )
          }

        } )
      }

    } )()
  }

  /**
   * @see OndeRouter
   */
  public get(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde {

    this.addRoute({
      path: location,
      callback: onRequest,
      methods: [ "GET" ]
    })

    return this
  }

  /**
   * @see OndeRouter
   */
  public post(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde {

    this.addRoute({
      path: location,
      callback: onRequest,
      methods: [ "POST" ]
    })

    return this
  }

  /**
   * @see OndeRouter
   */
  public put(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde {

    this.addRoute({
      path: location,
      callback: onRequest,
      methods: [ "PUT" ]
    })

    return this
  }

  /**
   * @see OndeRouter
   */
  public patch(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde {

    this.addRoute({
      path: location,
      callback: onRequest,
      methods: [ "PATCH" ]
    })

    return this
  }

  /**
   * @see OndeRouter
   */
  public delete(
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde {

    this.addRoute({
      path: location,
      callback: onRequest,
      methods: [ "DELETE" ]
    })

    return this
  }

  /**
   * @see OndeRouter
   */
  public route(
    methods: string | string[],
    location: HttpLocation,
    onRequest: OnRequest
  ): Onde {

    this.addRoute({
      path: location,
      callback: onRequest,
      methods: typeof methods === "string" ?
        [methods.toLocaleUpperCase()]:
        methods.map( method => method.toLocaleUpperCase() )
    })

    return this
  }

  /**
   * @description generic setters of static and view paths
   * @param key "views" | "static"
   * @param value string
   */
  private set( key: "views" | "static", value: string ): string {

    let absolutePath: string = value

    if( !isAbsolute( value ) ) {

      absolutePath = resolve( Deno.cwd(), value )
    }

    return normalize(absolutePath)
  }

  private addRoute(route: Route) {

    const httpRoute: HttpRoute = new HttpRoute( route )

    this._routes.push( httpRoute )
  }

  private findRoutes( request: ServerRequest ): Array<HttpRoute> {

    const pathname: string = this.getPathname( request )

    return this._routes.filter( (route: HttpRoute): boolean => {

      if( route.path instanceof RegExp ) {

        return route.path.test( pathname )

      } else {

        if( !route.params.length ) {

          return route.path === pathname

        } else {

          let isMatch = true

          const uris: string[] = pathname.split('/')

          // while all static uri.s parts are equal.s
          route.uris.forEach( (uri: HttpUri, index: number) => {

            if( !uri.isParam && uri.name !== uris[index] ) {

              // position of an static uri is not equals to same position uri request
              isMatch = false
            }

            // variable uri considerate as any uri name

          } )

          return isMatch
        }
      }

    }  )

  }

  private getPathname(request: ServerRequest): string {

    const pathname = request.url.split('?')[0]

    return pathname

  }

}

export default Onde
