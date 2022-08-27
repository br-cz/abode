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

--save-dev @types/jest @types/supertest jest ts-jest supertest (for testing + --save-dev allows us to not install these development dependencies every time we install the image)

mongodb-memory-server (for testing multiple dbs at the same time)

#Important Commands
build docker image: docker build -t gengar123/auth . (don't forget to login)

#scripts":
"start": "ts-node-dev --poll ./src/index.ts",
"test": "jest --watchAll --no-cache" (--no-cache addresses issues with jest not recognizing file changes with TS files)

#Jest
"jest":{
"preset": "ts-jest", (helps jest understand TS)
"testEnvironment": "node",
(tells jest to run a setup file inside our project after it starts everything up and run the helpers below to make facilitating writing our tests easier)
"setupFilesAfterEnv": [
"./src/test/setup.ts"
]
},
##When we use jest, we follow the convention that if we are trying to test a given file, we make a folder called underscoreunderscore test underscoreunderscoreinside the same directory
Further, we make a file inside the underscoreunderscore test underscoreunderscore folder with the filename.test.ts

##When we fix a test failing in jest but it does not reflect in the test, thanks to TS and Jest's incompatibility, we just need to restart and rerun the command npm run test
