import Onde, {resolve, assertEquals} from './mod.ts'

Deno.test("default config", () => {

  const onde = new Onde

  assertEquals( onde.static, null )

  assertEquals( onde.views, resolve( Deno.cwd(), "./views") )

} )

Deno.test('set config', () => {

  const onde = new Onde

  onde.static = "./public/../public/assets"

  assertEquals( onde.static, resolve( Deno.cwd(), "./public/assets" ) )

  onde.views = "./render"

  assertEquals( onde.views, resolve( Deno.cwd(), "./render" ) )

} )
