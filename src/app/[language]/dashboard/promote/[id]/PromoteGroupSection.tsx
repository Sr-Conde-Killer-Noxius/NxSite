"use client"
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { useState } from "react";
import { SubscriptionPlan } from "@prisma/client";
import { trpc } from "@/utils/trpc/trpc";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useLanguage } from "@/hooks/language/useLanguage";


const PromoteGroupSection = ({ plans, groupId }: { plans: SubscriptionPlan[], groupId: string }) => {
    const paymentMutation = trpc.plans.getPlanPayment.useMutation();
    const [qrcode, setQrcode] = useState<string | null>(null);
    const [ticketUrl, setTicketUrl] = useState<string | null>(null);
    plans = plans
        .sort((a, b) => a.price - b.price)
        .filter((plan) => plan.price > 0)
    
    

    const onClickPromote = async (planId: string, duration: number) => {
        const response = await paymentMutation.mutateAsync({
            planId:     planId,
            groupId:    groupId,
            duration:   duration,
        });

        setQrcode(response.qrcode);
        setTicketUrl(response.ticket_url);
    };

    return (
        <div className="max-w-7xl mx-auto px-5 py-20 bg-gray-900 text-white">            
            <div className="flex flex-wrap justify-center gap-8">
                {!qrcode ? (
                    <div className="flex flex-wrap justify-center gap-8 w-full">
                        <h2 className="text-4xl font-bold text-center mb-10 text-gray-200">
                            Escolha o Plano Perfeito para Promover Seu Grupo no Telegram
                        </h2>
                        {plans.map((plan: SubscriptionPlan) => (
                            <motion.div
                                key={plan.id}
                                className="bg-gray-800 text-white rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 border-2 border-transparent hover:border-gray-500 w-full sm:w-1/2 md:w-1/3 min-w-[250px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                                <p className="text-lg mb-6">Plano ideal para {plan.duration} dias de promoção contínua.</p>
                                <p className="text-3xl font-bold text-gray-300 mb-4">
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: "currency",
                                        currency: "BRL"
                                    }).format(plan.price)}
                                    <span className="text-sm">/ dia</span>
                                </p>
                                <ul className="text-sm text-gray-400 mb-6">
                                    <li className="mb-2">📈 Mais Visibilidade</li>
                                    <li className="mb-2">📅 Preço por {plan.duration} {plan.duration > 1 ? "dias" : "dia"}</li>
                                    <li className="mb-2">👥 Atração de Membros</li>
                                </ul>
                                <button
                                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg text-lg transition duration-300 ease-in-out w-full"
                                    onClick={() => onClickPromote(plan.id, plan.duration)}
                                >
                                    Escolher {plan.name}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full h-screen bg-gray-800 text-white p-10 rounded-lg shadow-lg">

                        <motion.div
                            className="flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="animate-pulse mb-6">
                                <motion.svg
                                    className="w-16 h-16 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    animate={{
                                        rotate: 360, // Definindo a rotação de 360 graus
                                    }}
                                    transition={{
                                        repeat: Infinity, // Para repetir a animação infinitamente
                                        repeatType: "loop", // Garante que a animação repita indefinidamente
                                        duration: 2, // Tempo da rotação, você pode ajustar esse valor conforme necessário
                                        ease: "linear", // Definindo a transição linear para uma rotação suave
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m4-4H8" />
                                </motion.svg>
                            </div>

                            <p className="text-2xl font-semibold mb-4">Aguardando Pagamento...</p>
                            <p className="text-lg mb-6">Por favor, aguarde enquanto processamos sua transação.</p>

                            {/* Renderiza o QR Code quando disponível */}
                            {qrcode && (
                                <div className="mb-6 flex justify-center">
                                    <QRCodeCanvas value={qrcode} size={256} fgColor="black" bgColor="white"/>
                                </div>
                            )}

                            {/* Renderiza o Ticket URL quando disponível */}
                            {ticketUrl && (
                                <div className="mt-6 text-center">
                                    <p className="text-lg font-semibold text-gray-300 mb-4">Pague pelo Mercado Pago:</p>
                                    <a
                                        href={ticketUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-400 hover:text-teal-300"
                                    >
                                        {ticketUrl}
                                    </a>
                                </div>
                            )}

                            <div className="mt-6">
                                <div className="text-lg font-semibold text-white">Verifique a transação e se necessário, atualize a página.</div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const RenderPromoteGroupSection = ({ id }: { id: string }) => {
    const router = useRouter();
    const meQuery = trpc.auth.me.useQuery();    
    const plansQuery = trpc.plans.getPlans.useQuery()    

    if (meQuery.isLoading) 
        return <LoadingScreen message="Carregando página ..." />;

    if (meQuery.error) {
        router.back();
        return null;
    }
    
    if (plansQuery.isLoading || !plansQuery.data) 
        return <LoadingScreen message={`Olá ${meQuery.data.user?.name}, estamos carregando planos para o seu grupo...`} />;
    
    return <PromoteGroupSection plans={plansQuery.data} groupId={id}/>
}



export function PromoteGroup({ id }: {id: string}) {    
    const meQuery = trpc.auth.me.useQuery()
    const groupWithPlansQuery = trpc.plans.getGroupWithPlansByGroupId.useQuery(id as string)

    const validateGroups = () => (
        groupWithPlansQuery.data 
        && groupWithPlansQuery.data.subscriptionPlan    
        && groupWithPlansQuery.data.subscriptionPlan.price > 0
    )


    if(groupWithPlansQuery.isLoading || meQuery.isLoading)
        return <LoadingScreen message="Carregando suas informações..." />


    

    return (
        <>
            {validateGroups()
                ? <AlreadyPaidPage /> 
                : <RenderPromoteGroupSection id={id as string} />
            }
        </>
    )
}

const AlreadyPaidPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const groupWithPlansQuery = trpc.plans.getGroupWithPlansByGroupId.useQuery(id as string);
    const language = useLanguage()

    if (groupWithPlansQuery.isLoading) {
        return <LoadingScreen message="Carregando informações..." />;
    }

    if (groupWithPlansQuery.error) {
        router.push("/");
        return null;
    }
    
    if (groupWithPlansQuery.data?.subscriptionPlan) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-gray-900 text-white p-8">
                <motion.div
                    className="max-w-lg text-center bg-gray-800 p-12 rounded-lg shadow-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold mb-6">Você já pagou!</h1>
                    <p className="text-lg mb-4">Seu grupo <strong>{groupWithPlansQuery.data.name}</strong> já está promovido com o plano <strong>{groupWithPlansQuery.data.subscriptionPlan.name}</strong>.</p>
                    <p className="text-sm text-gray-400 mb-6">Aguarde enquanto preparamos tudo para você.</p>
                    <motion.button
                        className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => router.push(`/${language}/group/${id}`)}
                    >
                        Ir para o grupo
                    </motion.button>
                    <h2 className="text-sm font-bold mb-6 pt-6">agradecemos pelo suporte</h2>
                </motion.div>
            </div>
        );
    }

    return null;
};