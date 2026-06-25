# Implementing JSONWEBTOKEN for authorization and authentication

### First steps: Installation
npm install jsonwebtoken

### Second step: Setup environment
- Create a workdir: Containing a nodejs app
- Packages install: bcryptjs, cookie-parser, cors, express, nodemon, dotenv
- Environment variables: ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, PORT
- Create server.js file with authorization codebase
- Software install: Postman (allows you to test your endpoints without a frontend.)

### Third step: Implement jsonwebtoken sign, verify
- Signup: Access token
- Login: Refresh token
- Return tokens to frontend: Send accesstoken as response; Send refresh token as cookie