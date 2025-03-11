import type React from "react"
import Link from "next/link"

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
          <div className="prose prose-yellow">
            <p>
              De acordo com a Lei nº 13.709 (Lei Geral de Proteção de Dados - LGPD), nós nos comprometemos a proteger a
              privacidade e os dados pessoais dos nossos usuários. Esta política de privacidade descreve como coletamos,
              usamos e protegemos suas informações pessoais.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">1. Coleta de Dados</h2>
            <p>
              Coletamos as seguintes informações quando você se cadastra em nossa plataforma:
              <ul className="list-disc pl-5">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de WhatsApp</li>
              </ul>
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">2. Uso dos Dados</h2>
            <p>Utilizamos seus dados pessoais para:</p>
            <ul className="list-disc pl-5">
              <li>Criar e gerenciar sua conta</li>
              <li>Fornecer os serviços solicitados</li>
              <li>Enviar informações sobre nossos produtos e serviços</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4 mb-2">3. Proteção de Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra
              acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">4. Seus Direitos</h2>
            <p>Você tem o direito de:</p>
            <ul className="list-disc pl-5">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Retirar seu consentimento a qualquer momento</li>
            </ul>

            <h2 className="text-xl font-semibold mt-4 mb-2">5. Contato</h2>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre nossa política de privacidade, entre em contato
              conosco através do e-mail: privacidade@rockfeller.com.br
            </p>

            <p className="mt-6">
              Ao marcar a caixa de seleção "Eu li e aceito a política de privacidade" durante o cadastro, você concorda
              com os termos desta política e autoriza o uso de seus dados conforme descrito acima.
            </p>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 bg-gray-50">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

