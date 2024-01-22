export interface FinancialEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    tipoMoneda: string;
    tasaInteres: number;
    tipoTasaInteres: string;
    frecuenciaTasaInteres: string;
    periodoCapitalizacion: string;
    costesNotariales: number;
    costesRegistrales: number;
    GPS: number;
    portes: number;
    gastosAdministracion: number;
}