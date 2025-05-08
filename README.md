# 🚀 GitHub Actions Dashboard

A full-stack application that integrates with GitHub OAuth to allow users to:

* Authenticate via GitHub
* Browse repositories
* View and trigger GitHub Actions workflows
* Monitor real-time workflow logs

---

## 🔧 Features

* ✅ GitHub OAuth authentication
* 📂 Repository and organization filters
* 🔄 View GitHub Actions workflows
* ▶ Manually trigger workflows
* 🟢 Real-time logs for workflow runs
* 🔐 Supports both public and private repositories

---

## 🛠 Tech Stack

### Frontend

* **React.js** – UI development
* **Axios** – HTTP requests
* **React Router DOM** – Routing
* **React Toastify** – Notifications
* **Bootstrap** – Styling

### Backend

* **Django** – Backend framework
* **Django REST Framework** – REST APIs
* **Requests** – GitHub API interaction
* **dotenv** – Environment variable management

---

## 💡 Design Decisions

* GitHub OAuth uses the authorization code grant flow.
* In development, tokens are passed as query parameters (should use cookies or JWT in production).
* The app assumes GitHub Actions are already configured in repositories.
* Workflow logs are polled to simulate real-time.
* Default branch for workflow triggers is `main`.

---

## ⚙️ Assumptions & Workarounds

### 1. Polling Instead of WebSockets for Real-Time Logs

* **Assumption**: GitHub OAuth and APIs do not support WebSocket-based real-time log streaming.
* **Solution**: Logs are polled at regular intervals to simulate real-time behavior.

### 2. GitHub OAuth Over Auth0

* **Assumption**: Using Auth0 with GitHub limits access to repositories, workflows, and tokens.
* **Solution**: Switched to direct GitHub OAuth integration for full control and deeper API integration.

| Feature              | Auth0 + GitHub   | Direct GitHub OAuth (Used) |
| -------------------- | ---------------- | -------------------------- |
| Token Ownership      | Managed by Auth0 | Fully backend-controlled   |
| Repo/Workflow Access | Limited          | Full                       |
| OAuth Flexibility    | Low              | High                       |

### 3. Default Branch Assumed as `main`

* **Assumption**: Default ref is `main` when triggering workflows.
* **Solution**: Hardcoded for now, but can be dynamically retrieved using GitHub API.

### 4. Token in URL (Dev Only)

* **Assumption**: OAuth token sent in URL query string in development.
* **Security Risk**: Exposure in logs, browser history.
* **Solution**: Use HTTP-only cookies or JWT tokens in production.

### 5. GitHub API Header Compatibility

* **Assumption**: Used newer header `application/vnd.github+json`.
* **Issue**: Some endpoints failed.
* **Solution**: Replaced with `application/vnd.github.v3+json`.

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/github-actions-dashboard.git
cd github-actions-dashboard
```

### 2. GitHub OAuth App Setup

* Go to [GitHub Developer Settings](https://github.com/settings/developers)
* Create a new OAuth App:

  * **Homepage URL:** `http://localhost:3000`
  * **Callback URL:** `http://localhost:8000/api/callback/`
* Save the **Client ID** and **Client Secret**

### 3. Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate  # For Windows: env\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

Start the backend:

```bash
python manage.py runserver
```

### 4. Frontend Setup

```bash
npx create-react-app frontend
cd frontend
npm install axios react-toastify react-router-dom bootstrap
npm start
```

---

## 🔐 API Endpoints

| Purpose            | Method | Endpoint                                           | Description             |
| ------------------ | ------ | -------------------------------------------------- | ----------------------- |
| GitHub Login       | GET    | `/auth/github/login/`                              | Start OAuth flow        |
| OAuth Callback     | GET    | `/auth/github/callback/`                           | Handles GitHub redirect |
| Exchange Code      | POST   | `/auth/token/`                                     | Get GitHub access token |
| List Repos         | GET    | `/api/user-repos/`                                 | Lists user repositories |
| List Orgs          | GET    | `api/user-orgs/`                                   | user organizations      |
| List Org Repos     | GET    | `api/org-repos/:org_name/`                         | repositories for an org |
| Repo Workflows     | GET    | `/api/repo-workflow/:user/:repo/`                  | Lists workflows in repo |
| Trigger Workflow   | POST   | `/api/workflows/:user/:repo/:workflow_id/trigger/` | Triggers workflow       |
| List Workflow Runs | GET    | `/api/workflows/:user/:repo/runs/`                 | Shows workflow history  |
| Run Logs           | GET    | `/api/workflows/:user/:repo/:run_id/logs/`         | Shows logs for a run    |







---

## 🔗 GitHub API References

* [OAuth Token Exchange](https://github.com/login/oauth/access_token)
* [Get User Info](https://api.github.com/user)
* [List Repos](https://api.github.com/user/repos)
* [List Workflows](https://api.github.com/repos/{owner}/{repo}/actions/workflows)
* [Trigger Workflow](https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches)
* [Workflow Runs](https://api.github.com/repos/{owner}/{repo}/actions/runs)
* [Logs](https://api.github.com/repos/{owner}/{repo}/actions/runs/{run_id}/logs)

---

## 🖥 Frontend Structure (React - `repoinsights/`)

```
repoinsights/
├── public/
├── src/
│   ├── components/
│   │   ├── Buttons/Login.jsx
│   │   ├── Dropdownbutton/dropdownbuttons.jsx
│   │   ├── logviewer/logsviwer.jsx
│   │   ├── Table/table.jsx
│   ├── pages/
│   │   ├── Callback/TokenExchange.jsx
│   │   ├── Dashboard/dashboard.jsx
│   │   ├── Dashboard/dashboard.css
│   │   ├── Landingpage/landingpage.jsx
│   ├── routes/routes.jsx
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   ├── index.js
├── .env
├── package.json
└── README.md
```

---

## 🛠 Backend Structure (Django - `repoinsights/`)

```
repoinsights/
├── api/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   ├── migrations/
├── repoinsights/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   ├── asgi.py
├── env/
├── db.sqlite3
├── .env
└── manage.py
```

---

## screenshots 
## Landing Page

<img width="1470" alt="Screenshot 2025-05-07 at 11 11 29 PM" src="https://github.com/user-attachments/assets/e7bda406-1428-4dcf-9fc6-fe0a3350d32a" />



## Dashboard

<img width="1470" alt="Screenshot 2025-05-07 at 11 11 44 PM" src="https://github.com/user-attachments/assets/43a03de5-165f-494a-83a5-3c22c2e24fcf" />

## User Repositories

<img width="1470" alt="Screenshot 2025-05-07 at 11 13 00 PM" src="https://github.com/user-attachments/assets/d2cb041a-c31a-4527-9575-cd6bf6f32645" />

## Workflows

<img width="1470" alt="Screenshot 2025-05-07 at 11 13 06 PM" src="https://github.com/user-attachments/assets/d2131bd0-0992-4b89-9245-afecd0e3c7ab" />


## Logs

<img width="1470" alt="Screenshot 2025-05-07 at 11 13 23 PM" src="https://github.com/user-attachments/assets/6b66db8d-c551-4465-8c64-b2503a3788e9" />






## 📚 Additional Resources

* [GitHub OAuth App Docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
* [Authorizing GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
* [GitHub Actions API Docs](https://docs.github.com/en/rest/actions/workflows)
