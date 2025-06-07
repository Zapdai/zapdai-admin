export type functionList = {
  funcoes: funcoes[]

}
export type funcoes = {
  id: string,
  name: string,
  router: string,
  icone: string,
  ativo: boolean,
  children: children[],
}
  
export type children = {
      id: string,
      name: string,
      icone: string,
      router: string,
    }
