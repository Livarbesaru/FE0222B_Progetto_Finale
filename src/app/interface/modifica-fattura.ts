export interface ModificaFattura {
    id: number,
    data: Date,
    numero: number,
    anno: number,
    importo: number,
    stato: {
        id: number,
        nome: string
    },
    cliente: {
        id: number
    }
}
