// Função para gerar um número aleatório conforme a distribuição normal
export const normalRandom = (mean: number, stdDev: number): number => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
};

// Função para simulação de Monte Carlo: calcula a receita para um ano com base na distribuição normal
export const monteCarloSimulation = (mean: number, stdDev: number, months: number, simulations: number): number[] => {
    const simulationResults: number[] = [];
    
    for (let i = 0; i < simulations; i++) {
        let totalRevenue = 0;
        for (let j = 0; j < months; j++) {
            totalRevenue += normalRandom(mean, stdDev);
        }
        simulationResults.push(totalRevenue);
    }
    return simulationResults;
};

// Função para calcular a média de uma lista de números
export const calculateMean = (data: number[]): number => {
    const total = data.reduce((acc, value) => acc + value, 0);
    return total / data.length;
};

// Função para calcular o desvio padrão
export const calculateStandardDeviation = (data: number[], mean: number): number => {
    const variance = data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
};


export const calculateZScore = (chart: number[] | undefined): number[] => {
    if (!chart) return [];
    const mean = chart.reduce((acc, value) => acc + value, 0) / chart.length;
    const variance = chart.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / chart.length;
    const standardDeviation = Math.sqrt(variance);
    return chart.map(value => (value - mean) / standardDeviation);
};