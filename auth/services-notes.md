#Dependencies:
typescript
ts-node-dev
express
@types/express
@types/mongoose
skaffold
express-validator
express-async-errors (for augmenting async functions to automatically throw errors with sync like functionality)
mongoose
cookie-session / @types (for modifying cookie contents)
jsonwebtoken / @types

#Important Commands
build docker image: docker build -t gengar123/auth . (don't forget to login)
