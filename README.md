# NestJS Authentication API

## Setup
1. Clone the repository
2. Set up environment variables (`.env`):
3. Run `docker-compose up -d`
4. Run `npm install`
5. Run migrations: `npx prisma migrate dev`
6. Run tests: `npm run test`
7. Start the server: `npm run start:dev`

## API Endpoints
- **Register**: `mutation { register(email: "test@example.com", password: "securepass") }`
```
Postman JSON example:

POST: http://localhost:3000/graphql
Content-Type: application/json
body:
{
  "query": "mutation Register($email: String!, $password: String!) { register(email: $email, password: $password) { message } }",
  "variables": {
    "email": "test@example.com"",
    "password": "securepass"
  }
}
```
- **Login**: `mutation { login(email: "test@example.com", password: "securepass") }`
```
Postman JSON example:

POST: http://localhost:3000/graphql
Content-Type: application/json
body:
{
  "query": "mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { message token } }",
  "variables": {
    "email": "test@example.com",
    "password": "securepass"
  }
}
```
- **Biometric Login**: `mutation { createUpdateBiometricKey(biometricKey: "some-key") }`
```
Postman JSON example:

POST: http://localhost:3000/graphql
Content-Type: application/json
Authorization: Bearer <token>
body:
{
  "query": "mutation CreateUpdateBiometricKey($biometricKey: String!) { createUpdateBiometricKey(biometricKey: $biometricKey) { message } }",
  "variables": {
    "biometricKey": "some-key"
  }
}
```
- **Biometric Login**: `mutation { biometricLogin(biometricKey: "some-key") }`
```
Postman JSON example:

POST: http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "mutation BiometricLogin($biometricKey: String!) { biometricLogin(biometricKey: $biometricKey) { message token } }",
  "variables": {
    "biometricKey": "some-key"
  }
}
```