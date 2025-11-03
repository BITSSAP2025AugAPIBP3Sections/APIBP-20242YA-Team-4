# OpenEvent Project

**OpenEvent** is an event management platform built using **React + Vite** for the frontend and **microservices architecture** for the backend. The system uses an **API Gateway** to route requests to individual services, each with its own database.  

---

## 🔹 Prerequisites

- Node.js (v16+ recommended)  
- npm (comes with Node.js)  
- Docker & Docker Compose (for backend microservices)  
- Java 17+ (if using Spring Boot for backend)  

---

## 🔹 Frontend Setup (React + Vite)

### 1. Create a new Vite React project
```bash
npm create vite@latest .
# Select the "react" template when prompted
```

### 2. Install core dependencies
```bash
npm install react react-dom
```

### 3. Install TypeScript types (for TypeScript support)
```bash
npm install -D @types/react @types/react-dom
```

### 4. Install additional UI libraries
```bash
npm install @radix-ui/react-collapsible
```

### 5. Start the development server
```bash
npm run dev
```

<!-- # Your frontend will now be available at http://localhost:5173.
# Make sure the backend microservices and API Gateway are running before testing. -->