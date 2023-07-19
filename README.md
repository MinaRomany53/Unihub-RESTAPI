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


## Users Endpoints
This router file in our application handles user authentication, user actions, and admin
actions. The router has several endpoints that are organized into two groups: endpoints that do not require authentication and endpoints that require authentication.

Endpoints that do not require authentication:
- POST /signup: Allows users to sign up for the application.
- POST /login: Allows users to log in to the application using their credentials.
- POST /forgetPassword: Allows users to request a password reset email.
- PATCH /resetPassword/:token: Allows users to reset their password using a token provided in a password reset email.

Endpoints that require authentication:
- PATCH /updatePassword: Allows users to update their password.
- GET /me: Allows authenticated users to retrieve their own user profile.
- PATCH /updateMe: Allows authenticated users to update their own user profile, including uploading a new profile photo.
- DELETE /deleteMe: Allows authenticated users to delete their own account.
- GET /: Allows authenticated admin users to retrieve a list of all users.
- GET /:userId: Allows authenticated admin to retrieve information about a specific user by ID.
- PATCH /:userId: Allows authenticated admin users to update information about a specific user by ID.
- DELETE /:userId: Allows authenticated admin users to delete a specific user


## Items Endpoints
This router file in our application handles item-related functionality. The router has several endpoints that are organized into different groups based on their functionality.

Admin-only endpoints:
- GET /Category-Stats: Allows authenticated admin to retrieve statistics related to item categories.
- GET /Not-Approved-Items: Allows authenticated admin to retrieve a list of items that have not yet been approved.
- PATCH /Not-Approved-Items/:itemId: Allows authenticated admin to approve an item that has not yet been approved by updating its status.

Search functionality:
- GET /search/:searchTitle: Allows users to use search feature.

Favorite items functionality:
- GET /Fav-Items: Allows users to retrieve a list of their favorite items.
- PATCH /Fav-Items/:itemId: Allows users to mark an item as a favorite or remove it.

Endpoints for managing items:
- GET /: Allows users to retrieve a list of all items in the application.
- GET /:itemId: Allows users to retrieve information about a any item by ID.
- POST /: Allows authenticated users to add a new item to the application by providing information about the item and uploading images.
- PATCH /:itemId: Allows authenticated users to update information about a specific item by ID, including updating images.
- DELETE /:itemId: Allows authenticated users to delete a specific item by ID. 


## Chatrooms Endpoints
This router file in our application handles chat room-related functionality. The router has several endpoints that are organized into different groups based on their functionality.

Endpoints for managing chat rooms:
- GET /: Allows users to retrieve a list of all chat rooms they are a member of.
- POST /: Allows authenticated users to create a new chat room.
- GET /:chatRoomId: Allows users to retrieve information about a specific chat.
- DELETE /:chatRoomId: Allows users to delete a specific chat room by ID. 

Endpoints for managing messages:
- POST /:chatRoomId/messages: Allows users to push a new message to chat.


## Architecture
MVC (Model - View - Controller)

![MVC](https://github.com/MinaRomany53/Unihub-RESTAPI/assets/84532337/559130e2-1cec-4a30-98bf-3351288e2270)


## Class & ER Diagram

![Class Diagram](https://github.com/MinaRomany53/Unihub-RESTAPI/assets/84532337/b8e7af58-0d77-4feb-801a-c6095045b95e)


## Built With 🛠
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - JavaScript (JS) is a lightweight interpreted programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative styles.
- [Nodejs](https://nodejs.dev/en/) - Application backend and all the logic implemented using Node.js, a popular JavaScript runtime environment that allows for efficient and scalable server-side development.
- [Express](https://expressjs.com/) - Express is a fast and minimalistic web framework for Node.js.
- [MongoDB](https://www.mongodb.com/docs/manual/) - UniHub uses MongoDB, a NoSQL document-oriented database, to store and manage its data.
- [Mongoose](https://mongoosejs.com/docs/guide.html) - Is an Object Data Modeling (ODM) library for MongoDB that provides a schema-based solution for application data management.
- [Postman](https://www.postman.com/explore) - Postman is a powerful HTTP client for API testing and debugging.
- [MongoDB Atlas](https://account.mongodb.com/account/login?n=%2Fv2%2F6273085c71b8ec3fd5f4f800&nextHash=%23metrics%2FreplicaSet%2F62730b486a9ed04896c41e6c%2Fexplorer%2Fnatours%2Ftours%2Ffind) - MongoDB Atlas is a fully managed cloud database service that provides the ability to deploy, operate, and scale MongoDB databases with ease.
- [Azure](https://portal.azure.com/) - Microsoft Azure Is used for deployment and hosting of our API infrastructure. Azure provides a scalable and reliable cloud computing platform that ensures high availability and performance.


## Maintain and deploy by
- [**Mina Romany**](https://github.com/MinaRomany53)
[![Linkedin](https://img.shields.io/badge/-linkedin-grey?logo=linkedin)](https://www.linkedin.com/in/mina-romany-6828a4218/)
