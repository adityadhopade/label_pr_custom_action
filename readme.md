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
