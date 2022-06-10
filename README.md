# GoogleDocs-clone

Google Docs clone for CSE 356, from Milestone 1 to Milestone 2. Check ```GoogleDocs_m3``` repository for codes after Milestone 3. 

### How to RUN

#### In Local:

- `yarn start`

#### In Cloud:

- `yarn workspace server start`  //client is linked with server
- if frontend was edited, compile with `yarn workspace client build`
- To add a package: `yarn workspace (client || server) add {package_name}`

### Possible Errors

1. Module not installed
   1. move to client or server folder
   2. run `npm install {module}@{version}`<br>
     // `yarn install {module}@{version}` doesn't work somehow...

2. MongoDB is not properly installed in progress
   1.  `sudo apt-get purge mongodb-org*`
   2.  `sudo apt-get install mongodb`
   3.  `sudo apt-get update`
   4.  `mongo --version` <br>
   // worked in Ubuntu 20.4 Focal
   
   Last Updated: 4/4/2022
