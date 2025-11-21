# OpenEvent - Event Management & Ticketing Platform
_**API-Based Product + Scalable Microservices System**_

## Overview
**OpenEvent** is a microservices-based event management and ticketing platform built for:
- API-Based Products Project (API Assignment)
- Scalable Services (SESAPZG583) Assignment
The platform enables end-to-end event handling through a fully API-driven backend using:
- **REST APIs**
- **GraphQL APIs**
- **Event-driven communication (Kafka)**
- **Microservices architecture**
- **Docker & Kubernetes (Minikube)**

## Goals
To create a scalable and user-friendly digital ecosystem for:
- Simplified event discovery and booking.  
- Secure and automated ticketing.  
- Data-driven insights for organizers.  
- Transparent feedback and engagement tracking.
  
## Actors & Their Roles

### 1. **Event Organizers**
- Register and create organizer profiles.
- Publish and manage events (venue, schedule, ticket pricing, capacity).
- Track ticket sales and registrations.
- Collect attendee feedback post-event.

### 2. **Users / Attendees**
- Create profiles and browse events.
- Search and filter by category, location, or date.
- Book seats and generate tickets.
- Provide ratings and feedback.

### 3. **System**
- Handles authentication & authorization.
- Integrates payment gateway for ticket purchases.
- Generates digital tickets (QR code).
- Sends real-time notifications (email/SMS).

## 1. Project Objectives
### A) API-Based Products Project
#### ✔️ Product/Service Selection
A complete **Event Management & Ticketing Platform** (similar to BookMyShow), supporting:
- Event publishing
- Ticket booking
- Payments
- Notifications
- Feedback

#### ✔️ API Design & Implementation
**REST API**
- CRUD operations for Attendees, Events, Tickets, Payments, Feedback
- Follows RESTful principles
- Clear & consistent resource modeling
**GraphQL API**
- Implemented in:
  - Event Service
  - API Gateway
- Features:
  - Single endpoint
  - Schema with Queries, Mutations, Input Types
  - Nested queries (fetch event + organizer + tickets, etc.)
  - Introspection support

#### ✔️ API Documentation
- **Swagger (OpenAPI)** documentation for all REST endpoints
- Added @Operation(summary, description) for each API
- **GraphQL schema** is fully self-documented
- **Bruno collections** included for all services

#### ✔️ Demo & Validation
- Backend tested end-to-end
- Frontend integrated with backend
- Bruno collections for API testing
- **JMeter performance testing** with multiple user loads
- Live demo prepared for final presentation

## B) Scalable Services (SESAPZG583) Assignment
#### ✔️ Microservices Built (≥5 Required → We built 6)
| Microservice             | Protocols Used                  | Responsibilities                     |
| ------------------------ | ------------------------------- | ------------------------------------ |
| **Attendee Service**     | REST                            | Login, Registration, Authentication  |
| **Event Service**        | REST + GraphQL + Kafka Producer | Manage events                        |
| **Ticket Service**       | REST + Kafka Producer           | Booking, Cancellation, QR generation |
| **Payment Service**      | REST + Kafka Producer           | Process payments                     |
| **Notification Service** | Kafka Consumer                  | Send email/SMS notifications         |
| **API Gateway**          | REST + GraphQL                  | Unified entry point                  |

#### ✔️ Communication Mechanisms Implemented
- REST APIs
- GraphQL queries & mutations
- Apache Kafka (event-driven messaging)
  - Event → Notification
  - Payment → Notification
  - Ticket → Notification
**Kafka Topic Used:** notification-topic

#### ✔️ Design Patterns Implemented
- **API Gateway Pattern**
- **CQRS (Command Query Responsibility Segregation) –** Event & Ticket services
- **Saga Pattern –** Payment + Ticket booking workflow
These patterns improve scalability, decoupling, reliability, and distributed transaction handling.

#### ✔️ Deployment
- All services **containerized** using Docker
- **6 Docker images** created
- At least one image pushed to **DockerHub/AWS ECR**
- Deployed on **Minikube Kubernetes cluster**
- Kubernetes manifests:
  - Deployments
  - Services
  - ConfigMaps
  - Secrets

#### ✔️ Documentation & Viva
- Full project documentation prepared
- Screenshots of UI, Swagger UI, Bruno, JMeter reports
- Individual contribution table included
- Viva-ready explanation notes prepared

## 2. System Architecture

Three diagrams are included in the submission:
**📌 1. System Context Diagram**
**📌 2. Container Diagram**
**📌 3. Deployment Diagram (Kubernetes)**

## 3. Features
### For Attendees
- Sign up & login
- Browse events
- Book tickets
- Pay securely
- Receive notifications
- View/download QR tickets
- Submit feedback
### For Organizers
- Create events
- Manage event schedules
- View ticket sales
- Collect feedback
### For System
- Kafka-based notification flow
- Kafka producer/consumer events
- Error handling with standardized responses
- JWT authentication

## 4. Tech Stack
**Frontend:** React + TypeScript + Vite  
**Backend:** Java 17 + Spring Boot + Spring Data JPA + Spring Web + Apache Kafka + REST API + GraphQL  
**Database:** PostgreSQL/MySQL
**Authentication:** JWT  
**DevOps (Optional):** Docker + DockerHub / AWS ECR + Kubernetes (Minikube) + Kafka with Zookeeper + Bruno + Apache JMeter (Load Testing)

## 5. Performance Testing (JMeter)
We used **Apache JMeter** to simulate traffic:
- 100 → 500 → 1000 concurrent users
- Infinite loop request simulation
- REST + GraphQL load testing
- Kafka publish/consume delays
- Database connection stress testing
**Result:**
Backend performs smoothly under load and passes all stress tests.

## 6. Error Handling
Every microservice has:
- Global @ControllerAdvice
- Custom exception classes
- Consistent JSON error responses
- HTTP codes (400/404/409/500)
- Logging for debugging

## 7. Architecture-Based Breakdown of Services
### Event Service
- CRUD
- GraphQL support
- Kafka producer
- CQRS pattern
### Ticket Service
- Booking & cancellation
- QR code generation
- Kafka producer
- Manages ticket inventory
### Payment Service
- REST payment APIs
- Kafka notification triggers
### Notification Service
- Kafka consumer
- Sends emails/alerts
- Event-driven
### Attendee Service
- Registration & login
- JWT auth
- Profile management
### API Gateway
- Single entrypoint
- GraphQL aggregator
- Security layer

## 8. Team Members and Contributions
- Samarth Agarwal - 93034 - @SAMARTHAGARWAL77  
- Syed Suhana - 93084 - @SuhanaSyed04  
- Omi Sneha - 93011 - @OmiSneha  
- Nekha S Thomas - 93022 - @nekha-s-thomas  
- Keerthana Sen - 93035 - @Keerthana-Sen

| Name                | BITS ID | Contribution                                                                          |
| ------------------- | ------- | ------------------------------------------------------------------------------------- |
| **Samarth Agarwal** | 93034   | Event service, Design Patterns (API Gateway, Saga, CQRS), Microservices logic, Architectural Diagram and Swagger Documentation, Circuit Breaker Pattern |
| **Syed Suhana**     | 93084   | Feedback service, notification services, Integration of frontend and backend using axios, kafka implementation  |
| **Omi Sneha**       | 93011   | Ticket service, Documentation, Bruno Collections, Frontend            |
| **Nekha S Thomas**  | 93022   | Notification service, Architecture diagrams,Dockerization, Kubernetes deployments, Frontend    |
| **Keerthana Sen**   | 93035   | Attendee service ,Dockerization, Kubernetes                    |

## 9. Running the Project
**Prerequisites**
- Java 17
- Node.js
- Docker
- Kafka & Zookeeper
- Minikube

### Backend Setup
```bash
# Clone repositories
git clone <service-repo>

# Build services
mvn clean install

# Run locally
mvn spring-boot:run
```

### Docker Setup
```bash
docker build -t attendee-service .
docker run -p 8081:8081 attendee-service
```

### Kubernetes Deployment
```bash
minikube start
kubectl apply -f k8s/
kubectl get pods
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 10. API Documentation
### Swagger
```bash
http://localhost:<port>/swagger-ui/index.html
```

### GraphQL Playground
```bash
http://localhost:<port>/graphql
```

### Bruno Collection
Included as:
OpenEvent_API_Collection.bru

## 11. Final Submission Contents
- Architecture diagrams
- API Swagger JSONs
- GraphQL schema
- Microservices code
- Docker images
- Kubernetes YAML files
- Performance test reports
- Bruno collections
- Final documentation (PDF)
- Team contribution section
- Screenshots (UI, Swagger, Kafka, JMeter)

## 🎉 Conclusion
**OpenEvent demonstrates:**
- Modern API engineering (REST + GraphQL)
- Microservices architecture
- Kafka-based event-driven design
- Scalability via Kubernetes
- Strong documentation & testing
This project fulfills all requirements for both the **API-Based Product** and the **Scalable Services Assignment.**
