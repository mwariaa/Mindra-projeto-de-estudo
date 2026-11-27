## Tecnologias e bibliotecas utilizadas

### Front-end

- **Next.js** – Framework para desenvolvimento da aplicação.
- **React** – Construção de interfaces.
- **TypeScript** – Tipagem estática.
- **Tailwind CSS** – Estilização e responsividade.

### Back-end

- **Next.js API Routes** – Criação das rotas da API.
- **Prisma ORM** – Comunicação e gerenciamento do banco de dados.
- **Better Auth** – Autenticação e gerenciamento de sessões.
- **Zod** – Validação de dados.
- **bcryptjs** – Criptografia de senhas.

### Inteligência Artificial

- **Groq** – Geração de conteúdo e flashcards com IA.
- **Cloudflare AI** – Geração de embeddings.
- **Cloudflare Vectorize** – Armazenamento e busca vetorial.

### Processamento de documentos

- **pdf-parse** – Extração de conteúdo de arquivos PDF.
- **pdfjs-dist** – Processamento de documentos PDF.

### Banco de dados e serviços

- **Neon PostgreSQL** – Banco de dados relacional.
- **Resend** – Envio de e-mails de verificação de conta.


##  Instalação das bibliotecas

### 1. Front-end
```bash
npm install next react react-dom
npm install -D typescript @types/node @types/react @types/react-dom
npm install tailwindcss @tailwindcss/postcss
```

### 2. Back-end
```bash
npm install zod bcryptjs
```

### 3. Autenticação
```bash
npm install better-auth
```

### 4. Prisma e banco de dados
```bash
npm install prisma @prisma/client @prisma/adapter-neon
npm install @neondatabase/serverless
```

### 5. Inteligência Artificial
```bash
npm install groq-sdk
```

### 6. Processamento de documentos
```bash
npm install pdf-parse pdfjs-dist
```

### 7. Envio de e-mails
```bash
npm install resend
```

### 8. Cloudflare AI e Vectorize
Integração realizada por meio das APIs da Cloudflare.

### 9. Instalação das dependências
```bash
npm install
```

### 10. Executar o projeto
```bash
npm run dev
```
