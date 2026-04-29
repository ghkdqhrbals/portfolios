## Gyumin Hwangbo
as **Java/Kotlin Backend Developer**

**Email**      : ghkdqhrbals@gmail.com   
**Blog**       : [https://ghkdqhrbals.github.io/portfolios](https://ghkdqhrbals.github.io/portfolios)   
**LinkedIn**   : [https://www.linkedin.com/in/gyumin-hwangbo-92382218b/](https://www.linkedin.com/in/gyumin-hwangbo-92382218b/)    
**Instagram**  : [https://www.instagram.com/hb_traveller/](https://www.instagram.com/hb_traveller/)

### EDUCATION
* Master's degree in Computer Science and Engineering, Pusan National University, 2022.
> check paper : [https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502#](https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502#)
* Bachelor's degree in Computer Science and Engineering, Pusan National University, 2020.

### INTEREST
* Automation for everything
* Backend Development

## Blog Q&A backend

This repository now includes a visitor Q&A flow:

- GitHub Pages page: `/ask/`
- HTTP backend: `POST /ask` in `guestbook.py`
- MCP tool: `answer_visitor_question` in `api/mcp_server.py`

### Required environment variables

Use an OpenAI-compatible chat-completions API:

- `OPENAI_API_KEY` or `LLM_API_KEY`
- `OPENAI_MODEL` or `LLM_MODEL`
- `OPENAI_API_BASE` or `LLM_API_BASE_URL`
- `REMOTE_MCP_SERVER_URL` optional, but required if you want OpenAI Responses API to call your MCP server directly
- `ASK_RATE_LIMIT_MAX_REQUESTS` optional, default `5`
- `ASK_RATE_LIMIT_WINDOW_SECONDS` optional, default `600`

Example:

```bash
pip install -r requirements.txt
export OPENAI_API_KEY=...
export OPENAI_MODEL=gpt-4.1-mini
python3 guestbook.py
```

Run the MCP server:

```bash
MCP_HOST=0.0.0.0 MCP_PORT=8080 python3 api/mcp_server.py --transport streamable-http
```

## Docker

You can run the blog, visitor API, and MCP server together with Docker Compose.

### Environment

Create `.env` from `.env.example` and fill in your key:

```bash
cp .env.example .env
```

### Start everything

```bash
docker compose up --build
```

Services:

- Jekyll blog: `http://localhost:4000/portfolios`
- Visitor question API: `http://localhost:8000`
- MCP HTTP server: `http://localhost:8080/mcp`

### Start only the MCP server

```bash
docker compose up --build mcp
```

## Responses API + Remote MCP

If `REMOTE_MCP_SERVER_URL` is set, the visitor Q&A path switches from direct context injection to OpenAI Responses API with your remote MCP server as a tool source.

Important:

- `REMOTE_MCP_SERVER_URL` must be a public HTTPS URL reachable by OpenAI
- `localhost` or Docker-internal addresses will not work for this mode
- The app only exposes read-oriented MCP tools to the model to avoid recursive self-calls

When `REMOTE_MCP_SERVER_URL` is not set, the app falls back to the previous mode:

- read `cv.md` and matching blog posts locally
- inject that text directly into the model prompt
