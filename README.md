# Implement Serverless TODO

Implement a simple TODO application using AWS Lambda and Serverless framework.

## Specification

### Functionality
- A user of the web application can use the interface to create, delete and complete a TODO item. ok
- A user of the web interface can click on a "pencil" button, then select and upload a file. A file should appear in the list of TODO items on the home page. ok
- If you log out from a current user and log in as a different user, the application should not show TODO items created by the first account. ok
- A user needs to authenticate in order to use an application. ok

### code Base
- All resources needed by an application are defined in the "serverless.yml". A developer does not need to create them manually using AWS console. ok
- Instead of defining all permissions under provider/iamRoleStatements, permissions are defined per function in the functions section of the "serverless.yml". ok
- Application has at least some of the following:
  + Distributed tracing is enabled
  + It has a sufficient amount of log statements
  + It generates application level metrics 
- Incoming HTTP requests are validated either in Lambda handlers or using request validation in API Gateway. The latter can be done either using the serverless-reqvalidator-plugin or by providing request schemas in function definitions.ok

## Architecture

- 1:M (1 to many) relationship between users and TODO items is modeled using a DynamoDB table that has a composite key with both partition and sort keys. ok

- TODO items are fetched using the "query()" method and not "scan()" method (which is less efficient on large datasets). ok

## Application deployment
### Backend

To build and deploy the application, first edit the `backend/serverless.yml` file to set the appropriate AWS and Auth0 parameters, then run the following commands:

1. cd to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Build and deploy to AWS: `sls deploy -v`

**P.S: name of the toDo must contain at least 5 characters and without space**
'12345 6' : error, with space
'12345' : success

### Frontend

To run the client application, first edit the `client/src/config.ts` file to set the appropriate AWS and Auth0 parameters, then run the following commands:

1. cd to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Run the client application: `npm run start`

