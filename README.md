# Quiz App

This is app, that allows user to create account, quizzes and play them

## Technologies

### Client

- React
- Typescript
- Redux toolkit
- Styled Components
- Zod

---

### Server

- NodeJS
- Typescript
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Zod

## Usage

### Client

Run `cd client`, then `npm run i`, next:\_\_
Create an .env file in `/client`, with the following properties

| Property        | Value          |
| --------------- | -------------- |
| VITE_CLIENT_URL | Client app url |
| VITE_SERVER_URL | Server app url |

Run

- `npm run dev` for development
- `npm run build` for production, build forder will be located in `/server/dist/client`
- `npm run test` for testing

---

### Server

Run `cd client`, then `npm run i`, next:\_\_

Create an .env file in `/server/config/env`**
Name the file .env.prod, env.dev or env.test for specific environment**
Env variables are validated in `/server/config/envVariables.ts` file and should be imported from there \_\_
Use the following properties:

| Property       | Value                                     |
| -------------- | ----------------------------------------- |
| PORT           | Server app port                           |
| MONGO_URI      | Mongo db uri                              |
| TOKEN_SECRET   | Jwt secret key                            |
| CLIENT_APP_URL | Client app url (for development)          |
| NODE_ENV       | Node environment type (prod, dev or test) |
| SALT_ROUNDS    | Time to calculate bcrypt hash             |

Run

- `npm run dev` for development
- `npm run build` for production, build forder will be located in `/server/dist`
- `npm run test` for testing

---

**App can also be used with docker, run:**

- `docker-compose -f docker-compose.dev.yaml up` for development
- `docker-compose -f docker-compose.prod.yaml up` for production`
- `docker-compose -f docker-compose.test.yaml up` for testing`

## imports/exports

imports are organized as follows:

### Client:

1. External libraries
2. Types
3. Files from app folder
4. Custom hooks
5. Pages
6. Components

---

### Server:

1. External libraries
2. Types
3. Config files / Contants
4. Models / Schemas
5. Routes / Controllers / Middlewares
6. Utils

**Mainly exports are used instead of default exports**
