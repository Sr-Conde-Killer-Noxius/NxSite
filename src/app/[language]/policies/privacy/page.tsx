"use client"
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Política de Privacidade | Telegram Promote</title>
        <meta name="description" content="Saiba como protegemos suas informações na nossa Política de Privacidade." />
      </Head>
      <main className="max-w-4xl mx-auto p-6 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        <p className="mb-4">Última atualização: Março de 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">1. Informações Coletadas</h2>
          <p className="mt-2">Coletamos dados fornecidos voluntariamente pelo usuário, como nome e e-mail, além de informações de navegação, como endereço IP e cookies.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">2. Uso das Informações</h2>
          <p className="mt-2">Utilizamos os dados coletados para melhorar nossos serviços, personalizar a experiência do usuário e cumprir obrigações legais.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">3. Compartilhamento de Dados</h2>
          <p className="mt-2">Não vendemos nem compartilhamos dados pessoais com terceiros, exceto quando necessário para cumprimento de obrigações legais ou operacionais.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">4. Segurança</h2>
          <p className="mt-2">Adotamos medidas de segurança para proteger as informações dos usuários contra acessos não autorizados.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">5. Direitos do Usuário</h2>
          <p className="mt-2">Os usuários podem solicitar acesso, correção ou exclusão de seus dados pessoais a qualquer momento.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">6. Alterações na Política</h2>
          <p className="mt-2">Esta política pode ser atualizada periodicamente. Recomendamos que os usuários revisem este documento regularmente.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold">7. Contato</h2>
          <p className="mt-2">Para dúvidas ou solicitações sobre esta política, entre em contato pelo e-mail <a href="mailto:pedrohgdepauloc@gmail.com" className="text-blue-600">pedrohgdepauloc@gmail.com</a>.</p>
        </section>
      </main>
    </>
  );
}
