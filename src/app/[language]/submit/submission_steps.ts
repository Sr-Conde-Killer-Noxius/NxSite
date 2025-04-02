export type SubmissionStepCategory = 
        "Identificação" 
    |   "Promova seu grupo"
    |   "Finalização"
    ;

export const stepsCategories: SubmissionStepCategory[] = ["Identificação", "Promova seu grupo", "Finalização"]


export interface TelegramSubmitStep{
    category:       SubmissionStepCategory,
    title:          string,
    description:    string 
}

const identificationSteps: TelegramSubmitStep[] = [
    { category: "Identificação", title: "Escolha um nome",                              description: "Dê um nome claro e atrativo ao seu grupo." },
    { category: "Identificação", title: "Adicione uma imagem",                          description: "Envie uma imagem representativa para seu grupo." },
    { category: "Identificação", title: "Descreva seu grupo",                           description: "Escreva uma descrição detalhada sobre o que seu grupo oferece." },
    { category: "Identificação", title: "Escolha uma categoria",                        description: "Selecione a categoria que melhor representa seu grupo." },
    { category: "Identificação", title: "Adicione um link de convite",                  description: "Cole o link do seu grupo no Telegram para novos membros entrarem." },
]

const paymentsSteps: TelegramSubmitStep[] = [
    { category: "Promova seu grupo", title: "Defina um plano de assinatura (opcional)", description: "Caso seu grupo tenha planos pagos, escolha um plano de assinatura." },
]

const finalSteps: TelegramSubmitStep[] = [
    { category: "Finalização", title: "Revise e publique",                              description: "Verifique todas as informações e publique seu grupo na plataforma." }
]


export const submissionSteps: TelegramSubmitStep[] = [
    ...identificationSteps,
    ...paymentsSteps,
    ...finalSteps        
];