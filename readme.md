### Details about `label_pr_custom_action` Action
---
#### Language : **TypeScript**
---
#### Purpose: **This is the custom_action for labeling the PR when opened adding a label "needs-review"** 
---
#### Best Practices Followed: **Adding Unit Test Cases (Security Practice), Adding Pre-commits (To make code consistent)** 

#### Example test file (reference) :
```
name: name of your workflow
on:
    workflow_dispatch:

    pull_request:
        types: [opened, reopened] 

jobs: 
    job-name:
        name: Label new pr 
        runs-on: ubuntu-latest

        steps:
            - name: label new pull request
              uses: adityadhopade/label_pr_custom_action@v1.0.0
              with: 
                  gh-token: ${{ secrets.ACCESS_GITHUB_TOKEN }}
                  label: 'new-pr'

            - name: Label bug fixes
              if: contains(github.event.pull_request.title, 'fix')
              uses: adityadhopade/label_pr_custom_action@v1.0.0
              with:
                  gh-token: ${{ secrets.ACCESS_GITHUB_TOKEN }}
                  label: 'bug'
```
#### Key things to Note : **Be very specific while passing tokens. Make sure your specifying tokens with gh-tokens**