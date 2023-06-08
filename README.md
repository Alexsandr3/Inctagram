# The  Inct🍊gr🍊m  - copy of Instagram
[![GitHub contributors](https://img.shields.io/github/contributors/Alexsandr3/Inctagram.svg)](https://github.com/Alexsandr3/Inctagram/graphs/contributors)
[![yarn version](https://badge.fury.io/js/yarn.svg)](https://badge.fury.io/js/yarn)
![GitHub release](https://img.shields.io/github/release/Alexsandr3/Inctagram.svg)
![GitHub issues](https://img.shields.io/github/issues/Alexsandr3/Inctagram.svg)
![GitHub forks](https://img.shields.io/github/forks/Alexsandr3/Inctagram.svg)
![GitHub stars](https://img.shields.io/github/stars/Alexsandr3/Inctagram.svg)
![GitHub license](https://img.shields.io/github/license/Alexsandr3/Inctagram.svg)

## Description

**The Inct🍊gr🍊m** is a social network application built on the **NestJS** framework with a microservices architecture. 
It aims to replicate the functionality of Instagram, offering users a platform to create posts, stories, highlights, comments, likes, follow other users, engage in chats and messages, and purchase subscriptions.

The project is developed using TypeScript, adhering to **Domain-Driven Design** (DDD) and **Object-Oriented Programming** (OOP) principles to ensure maintainability and scalability.


## Features

- [User Registration and Authorization:](#user-registration-and-authorization)
Register and authorize users using traditional credentials with **JWT** and **Refresh Tokens**. 
Additionally, users can sign up and log in using **OAuth2.0** with **Google** and **Github**, as well as Recaptcha Enterprise for enhanced security.
- [Post Creation:](#post-creation)
Users can create posts by uploading photos along with descriptions to share their content with others.
- [Comments and Likes:](#comments-and-likes)
Users can engage with posts by commenting and liking them.
- [Subscriptions:](#subscriptions)
Users can purchase subscriptions to access premium features and exclusive content.
- [User Interactions:](#user-interactions)
Stay connected with other users by following their profiles and staying up to date with their activities.
- [Messaging:](#messaging)
Initiate private conversations by creating chats and exchanging messages with other users.
- [Stories and Highlights:](#stories-and-highlights)
Create temporary stories consisting of photos and descriptions. Users can also highlight their favorite stories for long-term display.
- [Story Interactions:](#story-interactions)
Like and comment on stories, as well as like and reply to comments.

## Technology Stack

- [**Framework:**](#framework)
  **NestJS** with a microservices architecture.
- [**Communication:**](#communication)
  **GraphQL** is used for efficient communication between the superAdmin and the server.
- [**Database:**](#database)
  **TypeORM** and **Prisma** handle database interactions following **DDD** and **OOP** design principles.
- [**Messaging:**](#messaging)
  **RabbitMQ** facilitates communication between microservices.
- [**Image Storage:**](#image-storage)
  **Amazon S3** is used to securely store user-uploaded photos.
- [**Documentation:**](#documentation)
  **Swagger** is integrated for comprehensive API documentation.
- [**Security:**](#security)
  **Recaptcha Enterprise** is used to ensure secure user registration and authorization.
- [**Testing:**](#testing)
  **Jest** is employed for testing the project, including **E2E tests**.
- [**Containerization:**](#containerization)
  **Docker** ensures easy deployment and scalability of the application.
- [**CI/CD:**](#cicd)
  **Github Actions** automates the continuous integration and continuous deployment processes.
- [**Storage:**](#storage)
  **Github Packages** serves as the repository for storing **Docker** images.

## Documentation
For detailed API documentation, please refer to the Swagger Documentation.

## App Screenshots

![Project screenshot](assets/images/screens/1.png)
![Project screenshot](assets/images/screens/2.png)
![Project screenshot](assets/images/screens/3.png)
![Project screenshot](assets/images/screens/4.png)
![Project screenshot](assets/images/screens/5.png)
![Project screenshot](assets/images/screens/6.png)
![Project screenshot](assets/images/screens/7.png)
![Project screenshot](assets/images/screens/8.png)
<img src="assets/images/screens/9.png" alt="Project screenshot" width="400" style="display: block; margin: 0 auto;">


### Start the project

To start the project, get a local copy up and running follow these simple example steps.
- Clone the repository into your local machine
- Use `yarn` to install dependencies.
- Use `yarn start` to start project.
- Use `yarn test:e2e` to run e2e tests.

### Technologies Used

- **NestJS** <a href="https://nestjs.com" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/nestjs-plain.svg" alt="nestjs" width="12" height="12"/> </a>
- **TypeORM**  <a href="https://typeorm.io" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/typeOrm.svg" alt="TypeORM" width="12" height="12"/> </a> with **PostgreSQL** <a href="https://www.postgresql.org" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/postgresql-original.svg" alt="postgresql" width="12" height="12"/> </a>
- **Prisma** <a href="https://prisma.io" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/Prisma-DarkSymbol.svg" alt="prisma" width="12" height="12"/> </a> with **PostgreSQL** <a href="https://www.postgresql.org" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/postgresql-original.svg" alt="postgresql" width="12" height="12"/> </a>
- **RabbitMQ** <a href="https://www.rabbitmq.com" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/rabbitmq.svg" alt="rabbitmq" width="12" height="12"/> </a>
- **GraphQL** <a href="https://graphql.org" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/graphql.svg" alt="graphql" width="12" height="12"/> </a>
- **Swagger** <a href="https://swagger.io" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/swagger.svg" alt="swagger" width="12" height="12"/> </a>
- **Amazon S3**  <a href="https://aws.amazon.com/?nc2=h_lg" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/aws.svg" alt="aws" width="15" height="15"/> </a>
- **Typescript**  <a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/typescript-original.svg" alt="typescript" width="12" height="12"/> </a> 


#### External implementation of the following mentioned technologies is used in this project.

- **Recaptcha Enterprise** <a href="https://www.google.com/recaptcha/about/" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/recaptcha.svg" alt="recaptcha" width="15" height="15"/> </a>
- **Google OAuth2.0** <a href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/google.svg" alt="google" width="12" height="12"/> </a>
- **Github OAuth** <a href="https://docs.github.com/en/developers/apps/authorizing-oauth-apps" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/github.svg" alt="github" width="12" height="12"/> </a>
- **Stripe** <a href="https://stripe.com" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/stripe.svg" alt="stripe" width="20" height="12"/> </a>
- **Paypal** <a href="https://www.paypal.com" target="_blank" rel="noreferrer">
  <img src="assets/images/iconc/paypal.svg" alt="paypal" width="20" height="15"/> </a>
