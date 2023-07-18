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
- Role Management(Admin, Seller, User)
- Login
- Registration
- Shop Registration
- Product Category
- Product Subcategory
- Brand
- Cart
- Order

## Architecture
MVC (Model - View - Controller)

## Built With 🛠
- [Ktor](https://ktor.io/docs/welcome.html) - Ktor is a framework to easily build connected applications – web applications, HTTP services, mobile and browser applications. Modern connected applications need to be asynchronous to provide the best experience to users, and Kotlin coroutines provide awesome facilities to do it in an easy and straightforward way.
- [Exposed](https://github.com/JetBrains/Exposed) - Exposed is a lightweight SQL library on top of JDBC driver for Kotlin language. Exposed has two flavors of database access: typesafe SQL wrapping DSL and lightweight Data Access Objects (DAO).
- [MySQL](https://www.postgresql.org/) - MySQl is a powerful, open source object-relational database system .
- [Kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) - A multiplatform Kotlin library for working with date and time.
- [Bcrypt](https://github.com/patrickfav/bcrypt) - A Java standalone implementation of the bcrypt password hash function. Based on the Blowfish cipher it is the default password hash algorithm for OpenBSD and other systems including some Linux distributions.
- [Apache Commons Email](https://github.com/apache/commons-email) - Apache Commons Email aims to provide an API for sending email. It is built on top of the JavaMail API, which it aims to simplify.
- [Ktor OpenAPI/Swagger](https://github.com/LukasForst/ktor-openapi-generator) - The Ktor OpenAPI Generator is a library to automatically generate the descriptor as you route your ktor application.
- [Valiktor](https://github.com/valiktor/valiktor) - Valiktor is a type-safe, powerful and extensible fluent DSL to validate objects in Kotlin

## Requirements

- [JAVA 11](https://jdk.java.net/11/) (or latest)
- [MySQL](https://www.mysql.com/) (latest)

## How to run

- `git clone git@github.com:piashcse/ktor-E-Commerce.git`
-  `Create a db in postgreSQL`
-  Replace you db name in `dataSource.databaseName=ktor-1.0.0` instread of ktor-1.0.0 in hikari.properties from resource folder
- `run fun main()` from application class

## Maintain and deploy by
- [**Eslam faisal**](https://github.com/eslamfaisal)
[![Linkedin](https://img.shields.io/badge/-linkedin-grey?logo=linkedin)](https://www.linkedin.com/in/eslam-faisal-46aa83114/)

## Thanks to
- [**Mehedi Hassan Piash**](https://github.com/piashcse)
- [**Original Repo**](https://github.com/piashcse/ktor-E-Commerce)

# License
```
Copyright 2023 piashcse (Mehedi Hassan Piash)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
