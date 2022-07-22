// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    uploadServiceURI: 'http://185.208.172.207:8086/',
    coreServiceUrl: 'http://localhost:8081/',
    fieldServiceUrl: 'http://185.110.191.48:8082/',
    userManagementServiceUrl: 'http://185.208.172.207:8080/',
    taskManagerServiceUrl: 'http://185.208.172.207:8083/',
    sourcesServiceUrl: 'http://185.208.172.207:8084/',
    commentServiceUrl: 'http://185.208.172.207:8091/',
    currentAddress: 'http://localhost:4200'
};
