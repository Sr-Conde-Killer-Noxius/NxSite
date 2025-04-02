import { useAuth } from "@/hooks/auth/useAuth";
import { trpc } from "@/utils/trpc/trpc";
import { redirect } from "next/navigation";
import LoadingScreen from "../LoadingScreen";
import React from "react";

// Componente que exibe uma mensagem de erro quando o usuário não tem permissão
const NoPermissionPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl">Você não tem permissão para acessar esta página.</h1>
    </div>
  );
};

// Função de alta ordem que verifica se o usuário tem as permissões necessárias
function withPermissions(permissionsRequired: string[], Component: React.ComponentType) {
  // any admin stuff the super-admin has permission
  permissionsRequired.push("super-admin")
  return function WithPermissionComponent(props: React.Attributes) {
    const user = useAuth();
    const { data: userPermissions, isLoading: isLoadingPermissions } = trpc.auth.myPermissions.useQuery();
    

    // Exibe tela de carregamento enquanto carrega as permissões
    if (user.loadingUser || isLoadingPermissions) {
      return <LoadingScreen message="Carregando permissões..." />;
    }

    // Se ocorrer erro ou não houver permissões, redireciona para a página inicial
    if (user.error || !userPermissions || Array.isArray(userPermissions) === false) {
      redirect("/");
      return null;
    }

    // Verifica se o usuário tem pelo menos uma das permissões necessárias
    const hasPermission = permissionsRequired.some(permission =>
      userPermissions.some((userPermission: { name: string }) => userPermission.name === permission)
    );

    // Caso o usuário não tenha permissão, exibe a página de erro
    if (!hasPermission) {
      return <NoPermissionPage />;
    }

    // Caso o usuário tenha permissão, renderiza o componente
    return <Component {...props} />;
  };
}

export default withPermissions;
