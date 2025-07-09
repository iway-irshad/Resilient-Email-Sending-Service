# 📧 Resilient Email Sending Service

This is a backend email service built in **TypeScript** that supports:

- ✅ Retry mechanism with exponential backoff  
- ✅ Provider fallback (using multiple email providers)  
- ✅ Idempotency (no duplicate sends)  
- ✅ Rate limiting  
- ✅ Circuit breaker pattern  
- ✅ Simple in-memory queue  
- ✅ Status tracking per email  
- ✅ Logging and unit testing

---

## 📦 Tech Stack

- **TypeScript**
- **Express.js**
- **Node.js**
- **Jest** for unit testing
- No external email service — uses **mock providers**

---

## 🚀 Features

| Feature              | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| 🔁 Retry             | Retries failed sends with exponential backoff                              |
| 🔀 Fallback          | Automatically tries next provider on failure                               |
| 🧠 Idempotency       | Duplicate email requests (same ID) are safely ignored                      |
| 📉 Rate Limiting     | Basic token-bucket limiter to prevent spamming                             |
| 🚧 Circuit Breaker   | Opens after 3 consecutive failures; auto-resets after timeout              |
| 📦 Queue System      | Emails are enqueued and processed asynchronously                           |
| 📊 Status Tracking   | Real-time status (`queued`, `sent`, `failed`, `duplicate`) by ID           |
| 📄 Logging           | Console-based structured logging with timestamps                           |
| 🧪 Unit Testing      | Clean test coverage for core logic                                         |

---

## 📁 Project Structure

```bash
resilient_email_sending_service/
├── src/
│   ├── index.ts
│   ├── services/
│   ├── providers/
│   ├── queue/
│   └── utils/
├── tests/
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md


## Local setup
```bash
git clone <repo>
cd email-service
npm install
npm run dev
