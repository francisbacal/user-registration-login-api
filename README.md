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

        - description: register user
        - method: POST
        - content: application/json
            - name: string, required (sample: Super Admin)
            - email: string, required (sample: admin@email.com)
            - password: string, required (sample: test1234)
            - confirmPassword: string, required (sample: test1234)

    `/users/login`

        - description: login user
        - method: POST
        - content: application/json
            - email: string, required (sample: admin@email.com)
            - password: string, required (sample: test1234)

    `/users/getAll`

        - description: get all user (for Admin only)
        - method: GET
        - authenticate: true
        - isAdmin: true

    `/users/:id` (sample: /users/5efeedd9e0408f38bc765f36)

        - description: get one user
        - method: GET
        - authenticate: true

    `/users/:id` (sample: /users/5efeedd9e0408f38bc765f36)

        - description: update user (for user only)
        - method: PUT
        - authenticate: true
        - content: application/json
            - name: string, required (sample: Super Admin)

    `/users/:id` (sample: /users/5efeedd9e0408f38bc765f36)

        - description: delete user (for Admin only)
        - method: DELETE
        - authenticate: true
        - isAdmin: true
    
    `/users/verify-email`

        - description: verify email of user
        - method: POST
        - content: application/json
            - token: string, (sample: de1f456a82496d6f7342186e0d1efeefb37371fc23fa9d0c440f29702380983ae47141f13898a92c)