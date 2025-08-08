# README.md

# Day-Tasks — Envio Diário de Tarefas por E‑mail

Seja bem‑vindo ao **Day‑Tasks**, um micro‑app em **Node.js** + **TypeScript** que conecta a um PostgreSQL (ex.: Neon), busca as tarefas agendadas para o dia e envia um e‑mail diariamente às **05:00** (fuso `America/Sao_Paulo`) com a lista do dia. O projeto já vem com configuração para build TypeScript e containers (Docker + Docker Compose) com Loki + Grafana para logs.

---

## 📌 Visão Geral

- Agenda um _cron job_ que roda todo dia às **05:00** (horário de São Paulo).
- Valida variáveis de ambiente essenciais ao iniciar — se alguma estiver faltando, a aplicação encerra com erro.
- Conecta ao PostgreSQL, busca tarefas do dia (armazenadas como strings do tipo `weekday`) e envia um e‑mail formatado via **Handlebars**.
- Logs integrados com **pino** / **pino-loki** (stack Loki + Grafana incluída no `docker-compose`).

---

## 🛠️ Tecnologias Utilizadas

- **Node.js 20**
- **TypeScript**
- **node-cron** — agendamento
- **pg** — cliente PostgreSQL
- **Nodemailer** + **nodemailer-express-handlebars** — envio + templates
- **express-handlebars** — engine do template
- **dotenv** — variáveis de ambiente
- **pino** + **pino-loki** — logging
- **Docker / Docker Compose** — para rodar app + Loki + Grafana

---

## 🚀 Funcionalidades

- Busca de tarefas por dia da semana (no banco a coluna `day_of_week` usa strings como `segunda-feira`, `terça-feira`, ...).
- E‑mail com título e descrição das tarefas (e `created_at` quando disponível).
- Template responsivo em Handlebars: `src/email/views/email.hbs`.
- Dockerfile multi‑stage pronto para produção.
- `docker-compose.yaml` com Loki e Grafana para visualização de logs.

---

## 📂 Estrutura de Pastas (atual)

```
day-tasks/
├─ src/
│  ├─ database/
│  │  └─ database.ts       # Conexão e query ao PostgreSQL
│  ├─ email/
│  │  ├─ email.ts          # Configuração do transporter e envio
│  │  └─ views/
│  │     └─ email.hbs      # Template Handlebars
│  ├─ logger/
│  │  └─ logger.ts         # Logger pino + pino-loki
│  ├─ tasks/
│  │  └─ tasks.ts          # getTasks(dayOfWeekNum)
│  ├─ types/
│  │  ├─ database.ts
│  │  ├─ task.ts
│  │  └─ weekday.ts
│  └─ index.ts             # Scheduler + validação de envs + main()
├─ dist/                   # compilação TS (build)
├─ Dockerfile
├─ docker-compose.yaml
├─ .env.example
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

Crie um arquivo `.env` (ou use o `.env.example` abaixo) com as variáveis mínimas. O `src/index.ts` valida a presença das variáveis: `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `EMAIL_TO`. Se alguma faltar, a aplicação fará `process.exit(1)`.

> **Observação sobre Gmail:** para envio via Gmail, prefira **App Passwords** (quando a conta tem 2FA). Ajuste `EMAIL_SECURE` conforme o provedor SMTP.

### 3. Criar tabela no banco

Script SQL de exemplo (use no painel do Neon ou cliente SQL):

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

### 4. Rodar em desenvolvimento

- Rodar com recarga (dev):

```bash
npm run dev
# usa ts-node-dev e executa src/index.ts
```

- Compilar e rodar produção local:

```bash
npm run build
npm start
# executa dist/index.js (o agendador é iniciado; cron marcado para 05:00)
```

> Dica de teste: para executar a função `main()` com mais frequência durante testes, modifique temporariamente a expressão cron em `src/index.ts`:
>
> ```ts
> cron.schedule("* * * * *", () => main()); // a cada minuto para testes
> ```

### 5. Rodar com Docker Compose (opcional)

```bash
npm run docker:up
# ou
docker compose up -d --build
```

Ver logs do app com `npm run docker:logs` (script disponível no `package.json`).

No `docker-compose.yaml` o mapeamento de portas é (exemplo):

- App: `3001 -> 3000` (no container o app expõe 3000)
- Grafana: `3000 -> 3000`
- Loki: `3100 -> 3100`

---

## 🐛 Troubleshooting & Observações rápidas

- **Validação de envs:** `src/index.ts` encerra o processo se variáveis essenciais estiverem faltando — confira logs no terminal ou no Loki/Grafana.
- **Timezone:** o cron foi agendado com `timezone: "America/Sao_Paulo"`.
- **Banco (SSL):** `src/database/database.ts` define `ssl: true` (útil para Neon). Se sua infra não usa SSL, ajuste `ssl` conforme necessário.
- **Logger:** confirme que `src/logger/logger.ts` exporta uma instância configurada do `pino` (com `pino-loki` quando for o caso).
- **Templates:** `src/email/email.ts` usa `express-handlebars` + `nodemailer-express-handlebars`. O template principal está em `src/email/views/email.hbs`.

---

## 🤝 Contribuições

Contribuições são bem‑vindas! Fluxo sugerido:

1. Faça um _fork_.
2. Crie uma branch: `git checkout -b feature/nome-da-feature`.
3. Commit suas mudanças: `git commit -m "feat: ..."`.
4. Abra um Pull Request.

Se alterar a lógica do `logger` ou do `database`, inclua instruções de validação no README sobre como verificar logs no Grafana.

---

## 📞 Contato

Dúvidas ou sugestões? Me encontre no [LinkedIn](https://www.linkedin.com/in/cmiguelwm/) ou abra uma _issue_ no repositório.

---

**License**: MIT

---

# .env.example

```env
# PostgreSQL (Neon / outro provider)
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGHOST=your_db_host
PGPORT=5432
PGDATABASE=your_db_name

# E-mail SMTP (Gmail: usar App Passwords quando disponível)
EMAIL_USER=your_smtp_user@example.com
EMAIL_PASS=your_smtp_password_or_app_password
EMAIL_FROM="Day-Tasks <noreply@seudominio.com>"
EMAIL_TO=destinatario@exemplo.com
EMAIL_SUBJECT=Tarefas do Dia          # opcional
EMAIL_SECURE=false                     # "true" ou "false" — usado pelo transporter

# Logging / Observability (opcional)
LOKI_HOST=http://loki:3100

# Ambiente
NODE_ENV=production

# Nota: o arquivo .env não deve ser versionado com credenciais reais.
```
