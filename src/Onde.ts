import {
  isAbsolute,
  resolve,
  normalize,
  OndeConfig,
  OndeRouter,
  OnRequest,
  OndeDone,
  HttpRoute,
  Route,
  HttpLocation,
  Server,
  ServerRequest,
  HttpUri,
  Request,
  Response,
  AbortedError, RequestAborted
} from './../mod.ts'

class Onde implements OndeConfig, OndeRouter, OndeDone {

  static get PERMISSION_REQUIRED(): string[] {

    return [
      "--allow-read"
    ]

  }

  private _views: string = "./views"
  private _static: string | null = null
  private _routes: Array<HttpRoute> = []
  private _staticRewrite: string | null = null

  private get staticAccess(): string | null {

    if( typeof this.staticRewrite === "string" ) {

      return this.staticRewrite
    }

    return this.static
  }

  /**
   * @see OndeConfig
   */
  get staticRewrite(): string | null {

    return this._staticRewrite
  }
  set staticRewrite( staticRewrite: string | null ) {

    this._staticRewrite = staticRewrite
  }

  /**
   * @see OndeConfig
   */
  get views(): string {
    return !isAbsolute(this._views) ? resolve( Deno.cwd(), this._views ): this._views
  }
  set views(path: string) {

    this._views = this.set( "views", path )
  }

  /**
   * @see OndeConfig
   */
  get static(): string | null {

    return this._static
  }
  set static(path: string | null) {

    if( typeof path === "string" ) {
      this._static = this.set( "static", path )
    } else {
      this._static = null
    }
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

            const incomingRequest = new Request( {
              route,
              static: this.staticAccess
            } )

            const incomingResponse = new Response( {
              views: this.views,
              phisycalStatic: this._static,
              rewriteStatic: this._staticRewrite,
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
      methods: [ "PUT" ]
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

    return this._routes.filter( (route: HttpRoute): boolean => {

      if( route.path instanceof RegExp ) {

        return route.path.test( request.url )

      } else {

        if( !route.params.length ) {

          return route.path === request.url
        } else {

          let isMatch = true

          const uris: string[] = request.url.split('/')

          // while all static uri.s parts are equal.s
          route.uris.forEach( (uri: HttpUri, index: number) => {

            if( !uri.isParam && uri.name !== uris[index] ) {

              // position an static uri is not equals to same position uri request
              isMatch = false
            }

            // not static uri part is considerate as any uri name

          } )

          return isMatch
        }
      }

    }  )

  }

}

export default Onde
