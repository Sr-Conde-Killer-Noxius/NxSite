"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Loader2, Box, Zap, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TelegramGroupSchema } from "@/models/telegramgroup";
import { trpc } from "@/utils/trpc/trpc";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingScreen from '@/components/custom/LoadingScreen';
import { Category } from '@prisma/client';
import { RenderPromoteGroupSection } from '../dashboard/promote/[id]/PromoteGroupSection';


// Define the submission steps
const stepsCategories: string[] = ["Identificação", "Promova seu grupo", "Finalização"];
type SubmissionStepCategory = "Identificação" | "Promova seu grupo" | "Finalização"


// Form data type based on the TelegramGroup schema
type FormData = {
  link: string;
  ownerId: string;  
  description: string;
  categoryId?: string;
  subscriptionPlanId?: string;
};

// Props for step components
interface StepProps {
  form: FormData;
  updateForm: (updates: Partial<FormData>) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

// Reusable form field component
const FormField = ({ 
  label, 
  children, 
  error 
}: { 
  label: string; 
  children: React.ReactNode; 
  error?: string 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-blue-400">{label}</label>
    {children}
    {error && (
      <p className="text-red-400 text-sm mt-1">{error}</p>
    )}
  </div>
);

// Animation container for steps
const StepContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    {children}
  </motion.div>
);

// Step 1: Identification
const StepIdentification = ({ form, updateForm, errors }: StepProps) => {
  const {
    data: categories,
    isLoading
  } = trpc.groups.getAllCategories.useQuery();

  if (isLoading) return <LoadingScreen />;
  
  return (
    <StepContainer>
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Identificação do Grupo
        </h2>
        <p className="text-gray-400">Configure as informações principais do seu grupo Telegram</p>
      </div>

      <div className="space-y-6">        
        <FormField label="Link do Telegram" error={errors.link}>
          <div className="relative">
            <Input
              type="text"
              value={form.link || ''}
              onChange={(e) => updateForm({ link: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-blue-500 transition-all duration-200"
              placeholder="t.me/seugrupo"
            />
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </FormField>

        <FormField label="Descrição" error={errors.description}>
          <Textarea
            value={form.description || ''}
            onChange={(e) => updateForm({ description: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 min-h-[120px] text-white focus:border-blue-500 transition-all duration-200"
            placeholder="Descreva seu grupo de forma atraente..."
          />
        </FormField>

        <FormField label="Categoria" error={errors.categoryId}>
          <div className="relative">
            <select
              value={form.categoryId || ""}
              onChange={(e) => updateForm({ categoryId: e.target.value || undefined })}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-blue-500 transition-all duration-200 appearance-none"
            >
              <option value="">Selecione uma categoria</option>                
                {categories?.map((category: Category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
            <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </FormField>
      </div>
    </StepContainer>
  );
};

// Step 2: Promotion
const StepPromotion = ({ form, updateForm, errors }: StepProps) => {
  const {
    data: plans,
    isLoading: isLoadingPlans
  } = trpc.plans.getPlans.useQuery();

  if (isLoadingPlans) return <LoadingScreen />;

  const sortedPlans = plans ? [...plans].sort((a, b) => a.price - b.price) : [];
  
  return (
    <StepContainer>
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Plano de Assinatura
        </h2>
        <p className="text-gray-400">Escolha como você quer monetizar seu grupo</p>
      </div>

      {errors.subscriptionPlanId && (
        <p className="text-red-400 text-sm mb-4">{errors.subscriptionPlanId}</p>
      )}

      <div className="grid gap-4">
        {sortedPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
              form.subscriptionPlanId === plan.id
                ? "bg-blue-500/20 border-blue-500"
                : "bg-black/50 border-white/10 hover:border-white/30"
            }`}
            onClick={() => updateForm({ subscriptionPlanId: plan.id })}
          >
            <div className="flex items-center gap-4">              
              <div>
                <h3 className="font-medium text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(plan.price)} / Dia
                </p>
              </div>
              {form.subscriptionPlanId === plan.id && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Check className="w-5 h-5 text-blue-400" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </StepContainer>
  );
};

// Step 3: Finalization
const StepFinalization = ({ form, errors }: StepProps) => {
  const { data: categories } = trpc.groups.getAllCategories.useQuery();
  const { data: plans } = trpc.plans.getPlans.useQuery();
  
  const selectedCategory = categories?.find(c => c.id === form.categoryId);
  const selectedPlan = plans?.find(p => p.id === form.subscriptionPlanId);

  return (
    <StepContainer>
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Revisão Final
        </h2>
        <p className="text-gray-400">Verifique todas as informações antes de publicar</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg mb-6">
          <h3 className="text-red-400 font-medium mb-2">Por favor, corrija os seguintes erros:</h3>
          <ul className="list-disc pl-5 text-red-300">            
            {Object.entries(errors).map(([key, value]) => {
              console.log(errors)
              return <li key={key}>{value}</li>
            })}
          </ul>
        </div>
      )}

      <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-white/10">
        <div className="grid gap-6">          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Link do Grupo</h3>
            <div className="flex items-center gap-2 text-white">
              <LinkIcon className="w-4 h-4" />
              {form.link || "Não definido"}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Categoria</h3>
            <div className="flex items-center gap-2 text-white">
              <Box className="w-4 h-4" />
              {selectedCategory?.name || "Não definida"}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Descrição</h3>
            <p className="text-white">{form.description || "Não definida"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Plano Selecionado</h3>
            <div className="flex items-center gap-2 text-white">
              <Zap className="w-4 h-4" />
              {selectedPlan ? 
                `${selectedPlan.name} - ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(selectedPlan.price)} / Dia` : 
                "Não definido"
              }
            </div>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};

const EndSubmissionPromote = ({ id }: { id: string }) => {
  return (
    <Card className="p-6 text-center bg-gray-900 text-white border border-gray-700 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-2">🎉 Grupo criado com sucesso!</h2>
        <p className="text-gray-400">Agora vamos promover ele?</p>

        <div className='w-auto h-auto'>
          <RenderPromoteGroupSection id={id} />
        </div>        
      </CardContent>
    </Card>
  );
}
// Main component
export default function SubmitPage() {
  const user                     = useAuth();
  const [currentStepCategory, setCurrentStepCategory] = useState<SubmissionStepCategory>("Identificação");  
  const [isSubmitting, setIsSubmitting]               = useState<boolean>(false);
  const [errors, setErrors]                           = useState<Partial<Record<keyof FormData, string>>>({});  
  const createGroupMutation                           = trpc.groups.createGroup.useMutation();
  const [success, setSuccess]                         = useState<boolean>(false)
  const [createdGroupId, setCreatedGroupId]           = useState<string>("")    
  const [form, setForm]                               = useState<FormData>({
    link:               "",
    ownerId:            "",
    description:        "",
    subscriptionPlanId: undefined,
    categoryId:         undefined,
  });
  
  // Update form handler
  const updateForm = useCallback((updates: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
    
    // Clear errors for updated fields
    if (Object.keys(updates).some(key => errors[key as keyof FormData])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(updates).forEach(key => {
          delete newErrors[key as keyof FormData];
        });
        return newErrors;
      });
    }
  }, [errors]);
  
 
  
  // Validate current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (currentStepCategory === "Identificação") {            
      if (!form.link) {
        newErrors.link = "O link do grupo é obrigatório";
      }
      
      if (!form.description) {
        newErrors.description = "A descrição do grupo é obrigatória";
      } else if (form.description.length < 10) {
        newErrors.description = "A descrição deve ter pelo menos 10 caracteres";
      }
      
      if (!form.categoryId) {
        newErrors.categoryId = "Selecione uma categoria";
      }
    }
    
    if (currentStepCategory === "Promova seu grupo") {
      if (!form.subscriptionPlanId) {
        newErrors.subscriptionPlanId = "Selecione um plano de assinatura";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare the submission data
      const submissionData = {
        link: form.link,        
        ownerId: form.ownerId,        
        description: form.description,
        categoryId: form.categoryId,
        subscriptionPlanId: form.subscriptionPlanId
      };
      
      // Validate all fields before submission
      const result = TelegramGroupSchema.safeParse(submissionData);
      
      if (result.success) {
        const createdGroup = await createGroupMutation.mutateAsync(result.data);
        setCreatedGroupId(createdGroup.id)        
        setSuccess(true)        

      } else {
        // Format Zod errors
        const formattedErrors: Partial<Record<keyof FormData, string>> = {};
        result.error.errors.forEach(error => {
          formattedErrors[error.path[0] as keyof FormData] = error.message;
        });
        
        setErrors(formattedErrors);
        
        // Go to the first step with errors
        if (formattedErrors.link || formattedErrors.description || formattedErrors.categoryId) {
          setCurrentStepCategory("Identificação");
        } else if (formattedErrors.subscriptionPlanId) {
          setCurrentStepCategory("Promova seu grupo");
        }                
      }
    } catch (error) {
      console.error("Erro ao criar grupo:", error);    
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navigate to next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      const currentStepIndex = stepsCategories.indexOf(currentStepCategory);
      if (currentStepIndex < stepsCategories.length - 1) {
        setCurrentStepCategory(stepsCategories[currentStepIndex + 1] as SubmissionStepCategory);
      } else {
        handleSubmit();
      }
    }
  };
  
  // Navigate to previous step
  const handlePrev = () => {
    const currentStepIndex = stepsCategories.indexOf(currentStepCategory);
    if (currentStepIndex > 0) {
      setCurrentStepCategory(stepsCategories[currentStepIndex - 1] as SubmissionStepCategory);
    }
  };
  
  // Calculate progress percentage
  const currentStepIndex = stepsCategories.indexOf(currentStepCategory);
  const progressPercentage = ((currentStepIndex + 1) / stepsCategories.length) * 100;

   // Update owner ID when user data is loaded
   useEffect(() => {
    if (user.userData?.id !== undefined) {
      setForm(prev => {        
        return { 
          ...prev, 
          ownerId: user.userData?.id  ?? ""
        }
      });
    }
  }, [user.userData, success]);
  
  // Loading state
  if (user.loadingUser || !user.userData) return <LoadingScreen />;  
  if( success )                 return <EndSubmissionPromote id={createdGroupId}/>    

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <Card className="max-w-4xl mx-auto border-white/5 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-xl">
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepsCategories.map((step, index) => (
                <div
                  key={step}
                  className={`text-sm ${
                    index <= currentStepIndex ? 'text-blue-400' : 'text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-800 rounded-full">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStepCategory === "Identificação" && (
              <StepIdentification form={form} updateForm={updateForm} errors={errors} />
            )}
            {currentStepCategory === "Promova seu grupo" && (
              <StepPromotion form={form} updateForm={updateForm} errors={errors} />
            )}
            {currentStepCategory === "Finalização" && (
              <StepFinalization form={form} updateForm={updateForm} errors={errors} />
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="bg-black/50 border border-white/10 hover:bg-white/5 text-white"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando
                </>
              ) : currentStepIndex === stepsCategories.length - 1 ? (
                <>
                  Finalizar
                  <Check className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}