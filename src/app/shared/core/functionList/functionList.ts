export type functionList = {
  funcoes: funcoes[]

}
export type funcoes = {
  id: number,
  name: any,
  router: string,
  icone: string,
  ativo: boolean,
  children: children[],
}
  
export type children = {
      id: number,
      name: any,
      icone: string,
      router: string,
    }
