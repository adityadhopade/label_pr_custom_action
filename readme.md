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

- install the `@actions/github` => official package from githu to interact with the GitHub API

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
    description: 'Github Authentication token'
    required: true
  label:
    description: 'Label to be applied to the Pull Request'
    required: true
```

### make changes accrodingly in the `test.yaml files`

```

```
