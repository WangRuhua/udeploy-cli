const yargs = require('yargs');
const axios = require('axios');
const chalk = require('chalk')

module.exports = function(argv) {
  const options = yargs
  .usage("Usage: udeploy-cli snapshot -l -a applicatioin -s snapshot")
  .option("a", { alias: "application", describe: "application name", type: "string", demandOption: true })
  .option("s", { alias: "snapshot", describe: "snapshot name", type: "string", demandOption: true })
  .option("g", { alias: "getstatus", describe: "get status of snapshot", type: "boolen" })
  .option("u", { alias: "update", describe: "add a status", type: "string",
          choices: ['PROD', 'UAT','STG','QA'] })
          //choices: ['Ready for PROD', 'Ready for UAT','Ready for STG','Ready for QA'] })
  .option("c", { alias: "create", describe: "create a snapshot from envrionment", type: "boolen" })
  .option("e", { alias: "envionment", describe: "create a snapshot from envrionment", type: "string" })
  .option("t", { alias: "token", describe: "token to access udeploy, can be pass by environment udeploy_token", type: "string" })
  .option("w", { alias: "baseURL", describe: "base url,like https://myudeploy.com, can be pass by environment variable baseURL", type: "string"})
  .conflicts("g", "u")
  .argv;
  const baseURL = options.baseURL || process.env.baseURL
  if (! baseURL ) {console.log("please assign a url to baseURL");process.exit(1)}
  const udeploy_token = options.token || process.env.udeploy_token
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
      Accept:"application/json",
      Authorization: 'Basic '+''+Buffer.from('PasswordIsAuthToken:'+udeploy_token).toString('base64')},

  });

  // add new status
  if (options.update) {
    q={application:options.application, snapshot:options.snapshot, statusName:"Ready for "+options.update}
    console.log("updating status",q);
    addSnapshotStatus(q).then(function(){
      getSnapshotStatus(q)
    })
  } 
  // show status 
  if (options.getstatus) {
    if (options.snapshot === '') {console.log("please use -h to check uage"); process.exit(11)};
    q={application: options.application, snapshot: options.snapshot }
    //console.log("getting status ",options.snapshot,options.snapshot);
    getSnapshotStatus(q)
  }

  // create a snapshot base on environment
  if (options.create) {
    q={application: options.application, snapshot: options.snapshot, environment: options.environment}
    console.log("creating snapshot of ",q);
    //getSnapshotStatus(q)
  }

  function getSnapshotStatus(q) {
    console.log("here get snapshot")
    instance.get('/cli/snapshot/getStatusList', {
        params:q 
      })
      .then(function (response) {
        //if(response.status === 200 ) {console.log("status got successfully")}
        if(response.data[0] === undefined) {
          console.log("no status found")
        }
        else {
          for( var i=0;i<response.data.length;i++) {
            var obj = response.data[i]
            console.log("component: ",q.snapshot,"application: ",q.application,":",chalk.hex(obj.color)(obj.name))
          }
        }
      })
      .catch(function (error) {
      // console.log("error code:",error.response.status)
        console.log(chalk.red("error:",error))
        if (error.response.data) { console.log(chalk.red('error:',error.response.data))}
      });
    }


  function addSnapshotStatus(q) {
    return instance.put('cli/snapshot/addStatusToSnapshot','',{
      params: q})
      .then(function (response) {
        //console.log(response.data);
        console.log("updated");
      })
      .catch(function (error) {
        console.log("error code:",error.response.status)
        //console.log("error data:",error.response.data)
        //console.log("error data:",error)
      });
    }

  function createSnapshotOfEnvironment(q) {
    instance.put('/cli/snapshot/createSnapshotOfEnvironment','',{
        params: { application: 'DIRECTPL-PID0248-Office-Cloud-Page-Builder',
        name: 'test22',
        environment: 'DEV' } }
        
      )
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log("error code:",error.response.status)
        console.log("error data:",error.response.data)
        //console.log("error data:",error)
      });
    }


}