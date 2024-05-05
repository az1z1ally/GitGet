# Generating angular env variables using genearation schematic (Angular 15+)
`$ ng g environments`

## Manually generation
Create environments directory

Create your custom environments

1. environment.ts
2. environment.prod.ts
3. environment.staging.ts etc.
4. Update your angular.json or project.json to do fileReplacements where the paths are from project root to the environment file for replace and with:

  `"configurations": {
       "production": {
          ...
          "fileReplacements": [
            {
              "replace": "apps/some-app/src/environments/environment.ts",
              "with": "apps/some-app/src/environments/environment.prod.ts"
            }
          ],
        },
        "development": {
          ...
        }
      },
      "defaultConfiguration": "production"
    }`


## Development mode:
Depending on your package.json scripts configurations by default, the `environment/environment.ts` file is picked, when we serve or build the Angular application by executing the below commands:

#### Running the application
`ng serve `

#### Builing the application
`ng build`

## Production mode:
When we create the production version of our application by using the –prod flat, then the `environment.prod.ts `file is picked.

#### Creating production build
`ng build --prod`

In either of the use-cases, the switching of environment.ts and environment.prod.ts file is decided based automatically. If we add the –prod then prod version picked by default.

## How to Add New Environments into the Angular application?
In large scale enterprise applications, we may need another type of environment as well for example the test, uat, sprint etc. In that case, we can create more environment files and pick corresponding environment files based on the –configuration flag.

## 1. – Create new environment files
First, head towards the environment folder and create two new files in it named enviroment.test.ts and enviroment.uat.ts as shown below:

### ~src/environments/environment.test.ts

`export const environment = {
  production: true,
  config:{
    apiUrl:'https//example.com/api-test/'
  }
};`

### ~src/environments/environment.uat.ts
`export const environment = {
  production: true,
  config:{
    apiUrl:'https//example.com/api-uat/'
  }
};
`
## 2. – Configure angular.json file
Next, in the angular.json file, look for the "projects.your-app-name.architect.build.configurations" property. Here, the "production" and "development" properties are available by default.

Under the "production", you will notice the "fileReplacements" as shown below:
`"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
`
This does the replace of our environment files if running normal or prod build.

Let’s add two more properties "test" and "uat" as shown below:
`"configurations": {
    "production": {
      ...
    },
    "development": {
      ...
    },
    "test":{
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.test.ts"
        }
      ]
    },
    "uat":{
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.uat.ts"
        }
      ]
    }
},
`

## 3. – Update Scripts in package.json file
You can now run builds for the test or uat environment we just created above by adding the –configuration flag as shown below:

#### Test build command
`ng build --configuration test`


#### UAT build command
`ng build --configuration uat`

You can also update the scripts inside the `package.json` file. This is optional but preferred to add scripts which makes it easy to configure and use in the Jenkins pipeline.

`"scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build-test": "ng build --configuration test",
    "build-uat": "ng build --configuration uat",
     ...
 },
`

Open the package.json file at the root folder and add following under “scripts” array:


https://www.freakyjolly.com/how-to-add-create-new-environments-in-angular-12-application/