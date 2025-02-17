# 🎡 Roleta da Felicidade - Sistema de Roleta de Prêmios

Um sistema interativo de roleta de prêmios desenvolvido com Next.js e Firebase, oferecendo uma experiência envolvente para usuários e recursos de administração para gerenciamento de prêmios.

## ✨ Funcionalidades

- 🎲 Roleta interativa com animação suave
- 👤 Sistema de autenticação de usuários
- 🎁 Gerenciamento de prêmios
- 📊 Painel administrativo
- 📱 Design responsivo
- 🔒 Segurança com Firebase Authentication
- 💾 Armazenamento de dados com Firestore

## 🚀 Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/) - Framework React com App Router
- [React](https://reactjs.org/) - Biblioteca JavaScript para interfaces
- [Firebase](https://firebase.google.com/) - Plataforma de desenvolvimento
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animações
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript tipado

## 📦 Estrutura do Projeto

```
roletafelicidade/
├── src/
│   ├── app/              # Rotas e layouts do Next.js
│   ├── components/       # Componentes React reutilizáveis
│   ├── firebase.ts       # Configuração do Firebase
│   └── utils/           # Funções utilitárias
├── public/              # Arquivos estáticos
└── styles/             # Estilos globais
```

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/rootfirefly/roletafelicidade.git
cd roletafelicidade
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto e adicione:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

5. Acesse `http://localhost:3000`

## 🚀 Deploy

O projeto está configurado para deploy na Vercel. Para fazer o deploy:

1. Crie uma conta na [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente no painel da Vercel
4. Deploy!

## 👨‍💻 Desenvolvimento

Para contribuir com o projeto:

1. Crie um branch para sua feature:

```bash
git checkout -b feature/MinhaFeature
```

2. Faça commit das mudanças:

```bash
git commit -m 'Adiciona nova feature'
```

3. Push para o branch:

```bash
git push origin feature/MinhaFeature
```

4. Abra um Pull Request

## ⚙️ Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o Authentication e o Firestore
3. Configure as regras de segurança do Firestore
4. Copie as credenciais do projeto para as variáveis de ambiente

## 🔑 Painel Administrativo

Para acessar o painel administrativo:

1. Crie um usuário administrador usando o script de utilidade
2. Acesse `/admin` após fazer login
3. Gerencie prêmios e visualize relatórios

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Suporte

Para suporte, envie um email para [seu-email@exemplo.com](mailto:seu-email@exemplo.com) ou abra uma issue no GitHub.

## 🙏 Agradecimentos

- Next.js Team
- Firebase Team
- Todos os contribuidores

---

Feito com ❤️ por Edson Ferreira

