# Day-Tasks - Envio Diário de Tarefas por E‑mail

&#x20; &#x20;

Seja bem‑vindo ao **Day‑Tasks**, um mini‑app em **Node.js** + **TypeScript** que consulta um banco PostgreSQL (Neon) e envia diariamente, às 5 AM, por e‑mail, a lista de tarefas agendadas para o dia.

---

## 📌 Visão Geral

- Agenda um _cron job_ que roda todo dia às **05:00** (horário de São Paulo).
- Conecta a um PostgreSQL e busca as tarefas do dia.
- Gera e envia um e‑mail formatado com **Handlebars**.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **node-cron** para agendamento de tarefas
- **pg** (PostgreSQL client)
- **Nodemailer** + **nodemailer-express-handlebars**
- **dotenv** para configuração via variáveis de ambiente

---

## 🚀 Funcionalidades

- Consulta de tarefas por dia da semana (usando _enum_ `weekday`).
- E-mail com: título, descrição e data de criação.
- Template responsivo em Handlebars (`views/email.hbs`).
- Flags de ambiente para todas as configurações sensíveis.

---

## 📂 Estrutura de Pastas

```
day-tasks/
├─ database/
│  └─ database.ts          # Conexão e query ao PostgreSQL
│
├─ tasks/
│  └─ tasks.ts             # Função getTasks(dayOfWeek)
│
├─ email/
│  ├─ email.ts             # Configuração do transporter e envio
│  └─ views/
│     └─ email.hbs         # Template Handlebars
│
├─ types/
│  ├─ database.ts          # Tipagem de config/query
│  ├─ task.ts              # Tipo Task
│  └─ weekday.ts           # Map de dias da semana
│
├─ .env                    # Variáveis de ambiente (não versionar)
├─ index.ts                # Scheduler + lógica principal
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## ⚙️ Configuração & Uso

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/ckzwebber/day-tasks.git
cd day-tasks
npm install
```

### 2. Variáveis de Ambiente

Copie o `.env.example` para `.env` e ajuste:

```
# PostgreSQL (Neon)
PGUSER=...
PGPASSWORD=...
PGHOST=...
PGPORT=5432
PGDATABASE=...

# E‑mail SMTP
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM="Day-Tasks <noreply@seudominio.com>"
EMAIL_TO=destinatario@exemplo.com
```

### 3. Criar Tabela no Neon

Use o seguinte script SQL no painel do Neon:

```sql
CREATE TYPE weekday AS ENUM (
  'domingo','segunda-feira','terça-feira',
  'quarta-feira','quinta-feira','sexta-feira','sábado'
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  day_of_week weekday NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4. Rodar localmente

```bash
npm start       # Inicia o scheduler (às 5AM, ou force execução)
```

Para testar sem aguardar o cron, ajuste temporariamente em `index.ts`:

```ts
cron.schedule("* * * * *", () => main()); // a cada minuto
```

---

## 🤝 Contribuições

Contribuições são bem‑vindas! Siga o fluxo:

1. Faça um _fork_.
2. Crie uma branch: `git checkout -b feature/nome-da-feature`.
3. Commit suas mudanças: `git commit -m "feat: ..."`.
4. Abra um Pull Request.

---

## 📞 Contato

Se tiver dúvidas ou sugestões, me encontre no [LinkedIn](https://www.linkedin.com/in/cmiguelwm/) ou abra uma _issue_ aqui no repositório.

---

**License**: MIT
