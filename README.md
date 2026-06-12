# 🏙️ falaUrbana

Portal de participação cidadã onde moradores podem registrar solicitações urbanas (iluminação, buracos, limpeza, segurança etc.), acompanhar o andamento pelo protocolo e confirmar ocorrências relatadas por outros cidadãos. Gestores públicos contam com um painel para visualizar estatísticas, filtrar solicitações e atualizar status com histórico de comentários.

Projeto acadêmico desenvolvido para a disciplina de Projetos da UniCesumar.

---

## 📸 Visão geral

| Perfil | O que pode fazer |
|---|---|
| **Anônimo** | Criar solicitações sem cadastro, consultar protocolo, confirmar ocorrências (após login) |
| **Cidadão** | Tudo do anônimo + painel pessoal, histórico de solicitações, editar perfil e senha |
| **Gestor** | Login separado, dashboard com gráficos, listar/filtrar solicitações, atualizar status com comentários |

---

## 🧱 Arquitetura

```
falaurbana/
├── backend/    → API REST em Spring Boot
└── frontend/   → SPA em React + Vite
```

| Camada | Stack |
|---|---|
| Backend | Java 17 · Spring Boot · Spring Security (HTTP Basic) · Spring Data JPA · H2 · Springdoc OpenAPI |
| Frontend | React · Vite · React Router DOM · Axios · Bootstrap 5 · Recharts · React Hook Form |

---

## 🚀 Executando o projeto

### Pré-requisitos

- **Java 17+** e **Maven** (ou use o `./mvnw` incluso)
- **Node.js 18+** e **npm**

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`)

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

> ⚠️ Inicie sempre o **backend primeiro**. O frontend depende da API em `localhost:8080`.

---

## 🔐 Autenticação

O backend usa **HTTP Basic Auth**. O frontend armazena `email` e `senha` localmente (apenas para fins acadêmicos) e envia o header `Authorization: Basic base64(email:senha)` em cada requisição autenticada via interceptor do Axios.

| Perfil | Como obter acesso |
|---|---|
| Cidadão | Tela de **Registro** → login normal |
| Gestor | Tela de **Registro de Gestor** com código de autorização: `GESTOR2024` |

---

## 🗺️ Principais telas

- **Home** — busca por protocolo, categorias, criação de solicitação anônima
- **Painel do Cidadão** — minhas solicitações, editar perfil, alterar senha
- **Confirmar Solicitações** — lista pública com filtros (bairro, categoria, status)
- **Detalhes da Solicitação** — dados completos, endereço, histórico, botão de confirmação
- **Dashboard do Gestor** — gráfico de pizza por status, últimas solicitações
- **Listar Solicitações (Gestor)** — filtros combinados (protocolo, status, categoria, bairro, local)
- **Atualizar Solicitação (Gestor)** — busca por protocolo, altera status/prioridade, registra comentário com histórico

---

## ✅ Status do projeto

Projeto funcional para fins acadêmicos. Possíveis evoluções futuras:

- Migração de HTTP Basic para JWT
- Upload de imagens nas solicitações
- Notificações por e-mail ao atualizar status
- Testes automatizados (JUnit / Vitest)

---


