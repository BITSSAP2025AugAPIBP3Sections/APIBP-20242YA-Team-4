# Docker & Kubernetes Setup

## Dockerization

### Backend (Spring Boot)
1. Build Docker image:
   ```sh
   cd backend/event-service
   docker build -t backend:latest .
   ```
2. Run locally:
   ```sh
   docker run -p 8080:8080 backend:latest
   ```

### Frontend (Vite/React)
1. Build Docker image:
   ```sh
   cd frontend
   docker build -t frontend:latest .
   ```
2. Run locally:
   ```sh
   docker run -p 80:80 frontend:latest
   ```

## Kubernetes Deployment

1. Make sure Docker images are available to your cluster (push to a registry or use local cluster like minikube).
2. Apply manifests:
   ```sh
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/ingress.yaml
   ```
3. Access the app:
   - Frontend: http://localhost/
   - Backend API: http://localhost/api/


