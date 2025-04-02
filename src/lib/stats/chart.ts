import { ChartData, ChartDataset } from "chart.js";
import { calculateMean, calculateStandardDeviation, calculateZScore, monteCarloSimulation } from "./stats";

export const createChartLine = (
    label: string,
    data: number[] | undefined,
    color: string,
    hidden: boolean = true
): ChartDataset<'line'> => { // Aqui definimos o tipo ChartDataset para o retorno
    return {
        label,
        hidden,
        data:               data ?? [],
        backgroundColor:    color,
        borderColor:        color,
        borderWidth:        1,        
        tension:            1/4,
    };
};

export interface ChartPreset {
    label: string;
    calc: (data: number[], mean: number, stdDev: number) => ChartDataset<'line'>
}


const chartPresets: ChartPreset[] = [
    {
        label: "Simulação Monte Carlo",
        calc(data, mean, stdDev){
            return createChartLine("Simulação Monte Carlo", monteCarloSimulation(mean, stdDev, 12, 1000), "green", true)
        }
    },
    {
        label: "z-score",
        calc(data) {
            return createChartLine("z-score", calculateZScore(data), "pink");
        },        
    }
]
export const createRichChartDatasets = (
    label:  string,
    data:   number[]
): ChartDataset<'line'>[] => {
    const mean      = calculateMean(data)
    const stdDev    = calculateStandardDeviation(data, mean)

    const datasets: ChartDataset<'line'>[] = [
        createChartLine(label, data, "blue", false),
        ...chartPresets.map((preset: ChartPreset) => preset.calc(data, mean, stdDev))        
    ]    
    return datasets
}

export const createRichChartData = (label: string, data: number[]): ChartData<'line'> => {
    const chart: ChartData<'line'> = { // Tipagem correta para ChartData
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: createRichChartDatasets(label, data)
    };

    return chart

}