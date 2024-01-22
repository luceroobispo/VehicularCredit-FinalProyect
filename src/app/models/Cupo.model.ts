export interface Cupo{
    id: number;
    PeriodoGracia: string; // T , S , P
    SaldoInicial: number;
    Interes: number;
    Cuota: number;
    Amortizacion: number;
    SeguroDesg: number;
    SeguroRies: number;
    
    GPS: number;
    Portes: number;
    GastosAdm: number;
    
    SaldoFinal: number;
    Flujo: number;
    
    SaldoInicialCuotaFinal: number;
    InteresCuotaFinal: number;
    AmortizacionCuotaFinal: number;
    SeguroDesgCuotaFinal: number;
    SaldoFinalCuotaFinal: number;
}