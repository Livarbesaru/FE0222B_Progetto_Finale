import { Client } from "./client"

export interface Fattura {
  anno: number,
  cliente: Client
  data: Date
  id: number
  importo: number
  numero: number
  stato: {
    id: number,
    nome: string
  }
}
