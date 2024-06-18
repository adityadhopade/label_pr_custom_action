### Details about `label_pr_custom_action` Action
---
#### Language : **TypeScript**
---
#### Purpose: **This is the custom_action for labeling the PR when opened adding a label "needs-review"** 
---
#### Best Practices Followed: **Adding Unit Test Cases (Security Practice), Adding Pre-commits (To make code consistent)**
---
#### Usage

Example Github actions workflow config:

```
name: my-workflow-name
on:
  workflow_dispatch:
  pull_request:
    types: [opened, reopened]

jobs:
  label-pr:
    name: Sample Labelling for new-pr and bug
    runs-on: ubuntu-latest

    steps:
      - name: label all the PRs as new-pr
        uses: adityadhopade/label_pr_custom_action@v1.0.0
        with:
          gh-token: ${{ secrets.ACCESS_GITHUB_TOKEN }}
          label: "new-pr"


      - name: label only the PRs with title - fix as bugs
        if: contains(github.event.pull_request.title, 'fix')
        uses: adityadhopade/label_pr_custom_action@v1.0.0
        with:
          gh-token: ${{ secrets.ACCESS_GITHUB_TOKEN }}
          label: "bug"
```
In the Github Repository Secrets, set the Github token as `ACCESS_GITHUB_TOKEN=<>`