# Unihub Backend RESTAPI | Buy and Sell anywhere in Egypt with Unihub Application for online classifieds.
[![Nodejs](https://img.shields.io/badge/Nodejs-18.16.0-green.svg)](https://nodejs.dev/en/api/v20/documentation/)
[![Express](https://img.shields.io/badge/Express-4.18.2-green.svg)](https://github.com/expressjs/express)
[![Mongoose](https://img.shields.io/badge/Mongoose-7.4.0-green.svg)](https://github.com/Automattic/mongoose)
[![JWT](https://img.shields.io/badge/JWT-8.0.0-green.svg)](https://github.com/auth0/node-jsonwebtoken)
[![Pug](https://img.shields.io/badge/Pug-4.0.2-green.svg)](https://github.com/pugjs/pug)

Unihub Application for online classifieds built with [Express](https://expressjs.com/).


## Postman Simple Documentation URL
https://documenter.getpostman.com/view/20683256/2s93JxrLna

## Postman View

![fscreeeen](https://github.com/MinaRomany53/Unihub-RESTAPI/assets/84532337/7b55bd18-8c7d-45b4-90e3-78085a14f0d0)


# Main Features
- Role Management(Admin, User)
- Login
- Registration
- Reset Password
- Search & Filtering
- Chat
- Items
- Categories
- Category Statistics - Admin Panel
- User Profile
- Approved PostItems - Admin Panel


## JSON Web Token (JWT)
UniHub API uses JSON Web Token (JWT) to implement secure authentication and authorization mechanisms. 
JWT is a standard for securely transmitting information between parties as a JSON object.

Implementation of JWT includes the following steps:
1. User Authentication: When a user logs in, the app verifies the user's email address and password. If the user's credentials are valid, the app generates a JWT and returns it to the user.
2. JWT structure: The JWT includes three parts: a header, a payload, and a signature. The header contains information about the algorithm used to sign the token, the payload contains the user's ID and role, and the signature is used to verify the authenticity of the token.
3. Authorization: UniHub uses role-based access control to control access to the app's features and data. When a user makes a request to the app's API, the app verifies the JWT included in the request. If the JWT is valid and contains the appropriate role, the app grants access to the requested feature or data.

![jwt](https://github.com/MinaRomany53/Unihub-RESTAPI/assets/84532337/47d2e97c-a718-4e3e-8980-3fbb99a46108)


## Architecture
MVC (Model - View - Controller)

## Built With 🛠
- [Express](https://expressjs.com/) - Ktor is a framework to easily build connected applications – web applications, HTTP services, mobile and browser applications. Modern connected applications need to be asynchronous to provide the best experience to users, and Kotlin coroutines provide awesome facilities to do it in an easy and straightforward way.
- [Exposed](https://github.com/JetBrains/Exposed) - Exposed is a lightweight SQL library on top of JDBC driver for Kotlin language. Exposed has two flavors of database access: typesafe SQL wrapping DSL and lightweight Data Access Objects (DAO).
- [MySQL](https://www.postgresql.org/) - MySQl is a powerful, open source object-relational database system .
- [Kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) - A multiplatform Kotlin library for working with date and time.
- [Bcrypt](https://github.com/patrickfav/bcrypt) - A Java standalone implementation of the bcrypt password hash function. Based on the Blowfish cipher it is the default password hash algorithm for OpenBSD and other systems including some Linux distributions.
- [Apache Commons Email](https://github.com/apache/commons-email) - Apache Commons Email aims to provide an API for sending email. It is built on top of the JavaMail API, which it aims to simplify.
- [Ktor OpenAPI/Swagger](https://github.com/LukasForst/ktor-openapi-generator) - The Ktor OpenAPI Generator is a library to automatically generate the descriptor as you route your ktor application.
- [Valiktor](https://github.com/valiktor/valiktor) - Valiktor is a type-safe, powerful and extensible fluent DSL to validate objects in Kotlin


## Maintain and deploy by
- [**Mina Romany**](https://github.com/MinaRomany53)
[![Linkedin](https://img.shields.io/badge/-linkedin-grey?logo=linkedin)](https://www.linkedin.com/in/mina-romany-6828a4218/)
