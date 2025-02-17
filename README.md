🎡 Roleta da Felicidade - Sistema de Roleta de Prêmios
Um sistema interativo de roleta de prêmios desenvolvido com Next.js e Firebase, oferecendo uma experiência envolvente para usuários e recursos de administração para gerenciamento de prêmios.

✨ Funcionalidades
🎲 Roleta interativa com animação suave
👤 Sistema de autenticação de usuários
🎁 Gerenciamento de prêmios
📊 Painel administrativo
📱 Design responsivo
🔒 Segurança com Firebase Authentication
💾 Armazenamento de dados com Firestore
🚀 Tecnologias Utilizadas
Next.js 14 - Framework React com App Router
React - Biblioteca JavaScript para interfaces
Firebase - Plataforma de desenvolvimento
Tailwind CSS - Framework CSS
Framer Motion - Biblioteca de animações
TypeScript - Superset JavaScript tipado
📦 Estrutura do Projeto
roletafelicidade/
├── src/
│   ├── app/              # Rotas e layouts do Next.js
│   ├── components/       # Componentes React reutilizáveis
│   ├── firebase.ts       # Configuração do Firebase
│   └── utils/           # Funções utilitárias
├── public/              # Arquivos estáticos
└── styles/             # Estilos globais
🛠️ Instalação
Clone o repositório:
git clone https://github.com/rootfirefly/roletafelicidade.git
cd roletafelicidade
Instale as dependências:
npm install
# ou
yarn install
Configure as variáveis de ambiente: Crie um arquivo .env.local na raiz do projeto e adicione:
NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
Inicie o servidor de desenvolvimento:
npm run dev
# ou
yarn dev
Acesse http://localhost:3000
🚀 Deploy
O projeto está configurado para deploy na Vercel. Para fazer o deploy:

Crie uma conta na Vercel
Conecte seu repositório GitHub
Configure as variáveis de ambiente no painel da Vercel
Deploy!
👨‍💻 Desenvolvimento
Para contribuir com o projeto:

Crie um branch para sua feature:
git checkout -b feature/MinhaFeature
Faça commit das mudanças:
git commit -m 'Adiciona nova feature'
Push para o branch:
git push origin feature/MinhaFeature
Abra um Pull Request
⚙️ Configuração do Firebase
Crie um projeto no Firebase Console
Ative o Authentication e o Firestore
Configure as regras de segurança do Firestore
Copie as credenciais do projeto para as variáveis de ambiente
🔑 Painel Administrativo
Para acessar o painel administrativo:

Crie um usuário administrador usando o script de utilidade
Acesse /admin após fazer login
Gerencie prêmios e visualize relatórios
📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

🤝 Suporte
Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.

🙏 Agradecimentos
Next.js Team
Firebase Team
Todos os contribuidores
Feito com ❤️ por Edson Ferreira
