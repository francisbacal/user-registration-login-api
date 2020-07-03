# USER - API

### Clone:

    `git@github.com:francisbacal/user-registration-login-api.git`

then in the project directory, you can run:

    `npm install`
    `npm start` or `nodemon`



### Database:

- MongoDB

You may run your MongoDB local server (mongod) to connect to database


###Postman:

server:
  - [http://localhost:5000](http://localhost:5000)

path:
    `/users/register`

        - method: POST
        - content: application/json
            - name: string, required (sample: Super Admin)
            - email: string, required (sample: admin@email.com)
            - password: string, required (sample: test1234)
            - confirmPassword: string, required (sample: test1234)

    `/users/login`

        - method: POST
        - content: application/json
            - email: string, required (sample: admin@email.com)
            - password: string, required (sample: test1234)
    
    `/users/verify-email`

        - method: POST
        - content: application/json
            - token: string, (sample: de1f456a82496d6f7342186e0d1efeefb37371fc23fa9d0c440f29702380983ae47141f13898a92c)