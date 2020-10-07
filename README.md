<p align="center">
  A full HTTP router for <strong>Deno's</strong> based on <a href="https://deno.land/std@0.73.0">standard dependencies</a>
</p>
<p align="center">
  Onde
</p>
---

# Table of Contents

- [Setup](#setup)
- [Routing](#routing)
- [Exceptions](#exceptions)

## Setup

```ts

const Onde from "https://deno.land/x/Onde@v0.1.0/mod.ts"

const {serve} from "https://deno.land/std@0.73.0/http/server.ts"

// relative path to views folder
Onde.views = "./views"

// relative path to static folder
Onde.static = "./public"

// rewriting url for access to static folder
Onde.staticRewrite = "/assets"

const server = serve( "127.0.0.1:3000" )

Onde.listen( server )

```

**Onde** listen HTTP requests on a [Server](https://doc.deno.land/https/deno.land/std/http/mod.ts#Server) instance
and call route.s matchs with request.

See [Routing](#routing) for create routes.

## Routing

see **routing** interface implements by **Onde** at `/src/@types/Onde/Router`

see **request** interface implements by **Onde** at  `/src/@types/incoming/request.ts`

see **response** interface implements by **Onde** at  `/src/@types/incoming/response.ts`

```ts

onde.get('/', ( request, response ) => {

  response.render( 'index.html' )

} )

onde.delete('/foobar/:id?token=:token', ( request, response ) => {

  const {id: string} = request.params

  const {token: string} = request.query

  response.json({

    idReceveid: id,

    tokenReceveid: token

  })

} )

```

Onde implements all CRUD methods aliases ( get, put, patch, post, delete )
and a method `route` for custom method HTTP.

*response.render* considerate root file as `Onde.views` default `./views/`

See [Setup](#setup) for upgrade views folder

## Exceptions

**Onde** can aborted an request and emit static reply response as `500 Internal Error`
while path file is invalid, permission --allow-read missing or native [ServerRequest.respond](https://doc.deno.land/https/deno.land/std/http/mod.ts#ServerRequest) have fail

see class at `/src/throws/Aborted.ts` this class is a easy definition and just emit response `text/html` with static reply document generate from static method `Aborted.getTemplate`
