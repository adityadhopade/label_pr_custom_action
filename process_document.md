- Firstly startoff with the `action.yaml` file

```
name: "PR Slack Integration"
description: "Add PR Comment to Slack Integration"
author: "Aditya Dhopade"

runs:
  using: "node16"
  main: "dist/index.js"

```

- Then start with initailising the Node Project

```
npm init

With a custom script

build: "tsc"

# Install Typescript
npm install -D typescript

## To add tsconfig.json
npx tsc --init
```

- Add the tsconfig.josn in the following as

```
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "outDir": "dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

- Add `src` folder in that add `index.ts`

```
console.log("Hello there");
```

- Run the `index.ts` file we will get it as follows like

```
npm run build
```

- Add a .gitignore file

```
Ctrl + Shift + p ==> git ignore ==> NodeJS ==> Remove `Dist` from it
As Dist Contains the index.js file
```

- Write the script in the Typescript for the github actions to work properly.

- Do not include dist in the gitignore file (not in our usecase)

- Further then add the workflows which wuill act like as below

Initial Workflows Setup will be like as follows

```
name: "Hello there"

on:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ./

```

- To interact with the action we need to install the package `@actions/core` => it will give us the inbuilt functions like getinput() in `index.ts`

```
npm install @actions/core
```

index.ts will look like as follows

```
import { getInput } from "@actions/core";

// taking input from the main folder
const name = getInput("name");

// checking the name
console.log(`Hello ${name}!`)
```

- Thi will work fine when run the github actions; properly

### Integrate with the GitHub inorder to add label to PR

- install the `@actions/github` => official package from github to interact with the GitHub API

```
npm install @actions/github
```

- Modify the index.ts script as follows like

```
import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

export async function run() {
  const token = getInput("gh-token");
  const label = getInput("label");

  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  try {
    if (!pullRequest) {
      throw new Error("This action can only be run on Pull Requests");
    }

    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: [label],
    });
  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();
```

### What is Octokit ?

```
Octokit is a set of client libraries for the GitHub API, provided by GitHub itself. It's designed to make it easier for developers to interact with GitHub's features and data programmatically from their applications or scripts. With Octokit, developers can perform various operations such as fetching repository information, creating issues, managing pull requests, and much more, all through simple and consistent APIs provided by the library. It's widely used by developers who want to integrate GitHub functionality into their applications or automate tasks related to GitHub repositories.
```

### We need to make the changes in the `action.yaml`

- For adding the inputs like sucha as input label which we needed to set and the github_token whihc we need to set from the user

```
inputs:
  gh-token:
    description: '  '
    required: true
  label:
    description: 'Label to be applied to the Pull Request'
    required: true
```

### make changes accrodingly in the `test.yaml files`

```
name: "Hello there"

on:
  pull_request:
    types: [opened, reopened]

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ./
        with:
          gh-token: ${{secrets.ACCESS_GITHUB_TOKEN}}
          label: "needs-review"

```

### Raise a PR and the workflow will run but fails

```
Error: Cannot find module '@actions/core'
```

- Resolve it by using the as its expecting the `@actions/core` and the `@actions/github`
- We can use the `@vercel/ncc` here ==> It will bundle everyting inside the index.js including our dependencies that we required.

### If we want to run the action locally

- Using the `act` tool; we can run this action locally; without having to commit/push every time

```
npm install -g act
```

- Then you can run the action by executing `act`

```
act
```

### What is @vercel/ncc ?

```
@vercel/ncc is a tool developed by Vercel, a cloud platform for deploying serverless functions and static websites. NCC stands for "Node.js Compiler Collection." It is used to compile Node.js projects into a single file, including all its dependencies. This can be particularly useful for creating distributable packages or optimizing the deployment of Node.js applications, especially in serverless environments where minimizing the size of deployed code can improve performance and reduce latency.
```

- Install it like as follows

```
npm install @vercel/ncc
```

- We need to make a change in the `package.json` for the `build scripts`

```
# Earlier
"build": "tsc"

# Now making change its about
"build" : "tsc && ncc build lib/index.js"
```

- Also need to make the change into the `tsconfig.json` file here
- Setting `outDir` back to the `lib`

```
Earlier from the
"outDir": "dist",

back to the
"outDir": "lib"
```

- We are doing this beacuse the `ncc` will populate the `dist` folder.

- Then Run the build Command like as follows

```
npm run build
```

- Now the dist/index.js will contain all the dependecies that will be needed throughout the project. WE do not need to push that so we ignore it in the .gitignore file

- Our workflow will also need permissions to read or write the Workflows so it will acts ==. make a change in the settings => Actions => general [Read and Write Permissions]

- So now our workflow will run properly adding the label `needs-review` even though the label `needs-review` by default is not present; GitHub Actually creates a new label and add it to the set of default labels

### We need to nmake sure that we are testing before pushing the code

- We can make use of `JEST` as Testing framework here

- Install JEST

```
npm install -D jest ts-jest @types/jest
```

- Add a file `jest.config.json`

```
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "collectCoverage": true,
  "coverageReporters": ["lcov", "text-summary"],
  "collectCoverageFrom": ["src/**/*.ts"],
  "coveragePathIgnorePatterns": ["/node_modules/", "/__tests__/"],
  "testPathIgnorePatterns": ["/node_modules"]
}
```

- USing Copilot Chat we acan generate the Unit Test cases for the application.

### Writing Unit Test cases

- Add `src/__tests__/index.test.ts` folder
- Add the test command in the `package.json`

```
"test": "jest"
```

- Run the tests

```
npm run test
```

### Debugging the Action

- Rather than using the `console.log` it can be better Debugged using some other methods for that

- Install the package `ts-node` ==> Allows us to run our action directly from the source code.; without having to build it

```
npm install -D ts-node
```

- Configure the `.vscode/launch.json` ==> Configre the launch configuration

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ts-node",
      "type": "node",
      "request": "launch",
      "args": ["./src/index.ts"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "cwd": "${workspaceRoot}",
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
```

- But for debugging it will still require the inputs which we have passed in the `test.yaml` which are `gh-token` and `label`

- You can store them directly in the Launch Configuration as `environment variables`

- It can get picked using the inbuilt function using @actions/core by `getInput`

- Some Rules for it are as follows

```
- Prefix the name with the `INPUT_`
- Name the Input in the Upper Case.
```

So Our Launch configuration would look like this (launch.json)

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ts-node",
      "type": "node",
      "request": "launch",
      "args": ["./src/index.ts"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "cwd": "${workspaceRoot}",
      "internalConsoleOptions": "openOnSessionStart",
      "env": {
        "INPUT_GH-TOKEN": "secret-token-123456",
        "INPUT_LABEL": "needs-review"
      }
    }
  ]
}
```

- What if we do `npm run build` then it will include the test in our build we do not want that.

- Make some chanegs in the `ts-config.json`

```
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "outDir": "lib",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "exclude": ["node_modules","**/*.test.ts"]
}
```

- Now we can observe that the `run()` executes twice ; when the action is actually imported in the`index.ts`

- we can modify it add a wrapper so when the actions is NOT run by JEST then only Run

- Using the `JEST_WORKER_ID` we can get if the action is actully runned by the `JEST`

```
if (!process.env.JEST_WORKER_ID) {
  run();
}
```

## Setting up a precommit

- When adding up a change; in order to actually obey the action we need to run the command

```
npm run build
```

- For that we can make use of the `Husky` which is a pre-commit action

- So that every time we commit the action is again rebuilt

- Install Husky

```
npx husky-init && npm install
```

- It will create a `pre-commit.sh` file; so taht every time someone commits it will run the test

- We can further enhance it to run the `prettier` and fix linting issues using the `es-lint`

- Install `prettier` and `eslint` and `lintstaged`

```
npm install -D prettier eslint lint-staged(it will make sure our lint rules gets applied to desired linting rule)
```

- some plugins as we are using the TS we need to install its types

```
npm install -D @typescript-eslint/eslint-plugin@latest eslint-plugin-jest@latest
```

- Add the files like `.eslintrc` , `.prettierrc`, `.lintstagedrc` in the root folder of the project

- `.eslintrc` contains the following code

```
{
  "plugins": ["jest", "@typescript-eslint"],
  "parser": "@typescript-eslint/parser",
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "env": {
    "node": true,
    "jest/globals": true
  },
  "ignorePatterns": ["*.test.ts"]
}
```

- `.prettierrc` configurations will look like this

```
{
  "trailingComma": "es5",
  "printWidth": 120,
  "tabWidth": 2
}
```

- `.lintstagedrc` configuration like

```
{
  "./src/**/*.{js,ts}": ["prettier --write", "eslint --max-warnings 2"]
}
```

- Further add in the `precommit.sh` for the lint-staged

```
npx lint-staged
```
