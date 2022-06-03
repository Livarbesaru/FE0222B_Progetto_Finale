import { Comune } from "./comune"

export interface Client {
  cognomeContatto: string,
  dataInserimento: Date,
  dataUltimoContatto: Date,
  email: string,
  emailContatto: string,
  fatturatoAnnuale: number,
  id: number,
  indirizzoSedeLegale: {
    id: number,
    via: string,
    civico: number,
    cap: string,
    localita: string,
    comune:Comune
  }
  indirizzoSedeOperativa:  {
    id: number,
    via: string,
    civico: number,
    cap: string,
    localita: string,
    comune:Comune
  }
  nomeContatto: string,
  partitaIva: string,
  pec: string,
  ragioneSociale: string,
  telefono: string,
  telefonoContatto: string,
  tipoCliente: string,
}
