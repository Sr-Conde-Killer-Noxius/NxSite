"use client"
import Head from "next/head";

export default function CookiesPolicy() {
  return (
    <>
      <Head>
        <title>Política de Cookies | Telegram Promote</title>
        <meta name="description" content="Saiba como usamos cookies para melhorar sua experiência no Telegram Promote." />
      </Head>
      <main className="max-w-4xl mx-auto p-6 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
        <p className="mb-4">Esta política de cookies foi atualizada pela última vez em março de 2025.</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">1. O que são cookies?</h2>
          <p className="mt-2">Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você acessa um site. Eles são usados para melhorar sua experiência, armazenar preferências e coletar informações estatísticas.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">2. Como usamos os cookies?</h2>
          <p className="mt-2">Utilizamos cookies para personalizar conteúdo, analisar o tráfego do site e oferecer uma experiência mais eficiente. Algumas funcionalidades do site podem não funcionar corretamente sem esses cookies.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">3. Tipos de cookies que utilizamos</h2>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Essenciais:</strong> Necessários para o funcionamento do site.</li>
            <li><strong>Analíticos:</strong> Coletam dados estatísticos sobre o uso do site.</li>
            <li><strong>Funcionais:</strong> Armazenam preferências do usuário.</li>
            <li><strong>Marketing:</strong> Usados para personalizar anúncios.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">4. Gerenciamento de cookies</h2>
          <p className="mt-2">Você pode gerenciar e desativar cookies nas configurações do seu navegador. No entanto, isso pode afetar sua experiência de navegação.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">5. Alterações nesta política</h2>
          <p className="mt-2">Podemos atualizar esta política periodicamente. Recomendamos que você a revise regularmente para estar ciente de qualquer alteração.</p>
        </section>
      </main>
    </>
  );
}
