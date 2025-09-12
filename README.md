<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  <b>Freelancer Marketplace</b> - A microservice-based platform for hiring and renting freelancers, built with <a href="http://nestjs.com/" target="_blank">NestJS</a>.
</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

---

## 📖 Description

**Freelancer Marketplace** is a platform that connects freelancers and clients, allowing clients to post jobs and freelancers to offer services.  
The project is built with **NestJS** using a **microservice architecture**, managed under a **monorepo** structure for scalability and maintainability.

---

## 🏗️ Architecture

- **Monorepo** powered by NestJS
- **Microservices**:
  - `api-gateway` – entry point for client requests
  - `user-service` – manage users, authentication, and profiles
  - `post-service` – handle job postings and freelancer listings
  - `order-service` – process orders, contracts, and payments
- **Database**: PostgreSQL (shared mono database)
- **Cache / Queue**: Redis
- **Containerization**: Docker (docker-compose support for local development)

---

## 📂 Project Structure

```
freelancer-marketplace/
│── apps/
│   ├── api-gateway/
│   ├── user-service/
│   ├── post-service/
│   ├── order-service/
│
│── libs/                # shared libraries
│── docker-compose.yml   # docker services
│── package.json
│── README.md
```

---

## 🚀 Installation

```bash
$ yarn install
```

---

## ▶️ Running the app

### Run with Yarn

```bash
# development (all services)
$ yarn start:dev

# run specific service
$ yarn start:dev api-gateway
$ yarn start:dev user-service
$ yarn start:dev post-service
$ yarn start:dev order-service

# production mode
$ yarn start:prod
```

### Run with Docker

```bash
# start all services (postgres, redis, and microservices)
$ docker-compose up --build
```

---

## 🐳 docker-compose.yml (sample)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: nestuser
      POSTGRES_PASSWORD: nestpass
      POSTGRES_DB: freelancer_marketplace
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    restart: always
    ports:
      - '6379:6379'

  api-gateway:
    build: ./apps/api-gateway
    command: yarn start:dev api-gateway
    depends_on:
      - postgres
      - redis
    ports:
      - '3000:3000'

  user-service:
    build: ./apps/user-service
    command: yarn start:dev user-service
    depends_on:
      - postgres
      - redis

  post-service:
    build: ./apps/post-service
    command: yarn start:dev post-service
    depends_on:
      - postgres
      - redis

  order-service:
    build: ./apps/order-service
    command: yarn start:dev order-service
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## 🧪 Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

---

## 🛠️ Tools & Dependencies

- [NestJS](https://nestjs.com/) - Node.js framework
- [PostgreSQL](https://www.postgresql.org/) - relational database
- [Redis](https://redis.io/) - cache and message broker
- [Docker](https://www.docker.com/) - containerization
- [Yarn](https://yarnpkg.com/) - package manager

---

## 🤝 Contribution

Contributions are welcome!  
Please fork the repo and submit a pull request.

---

## 👥 Team & Contact

- Maintainer - [Your Name](https://github.com/your-profile)
- Project - **Freelancer Marketplace**
- Website - Coming soon

---

## 📜 License

Freelancer Marketplace is [MIT licensed](LICENSE).
