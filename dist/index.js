"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
// adding imports
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
// setting up token and label
async function run() {
    var _a;
    const token = (0, core_1.getInput)("gh-token");
    const label = (0, core_1.getInput)("label");
    // to fetch the token
    const octokit = (0, github_1.getOctokit)(token);
    const pullRequest = github_1.context.payload.pull_request;
    try {
        if (!pullRequest) {
            throw new Error("This action can only be run on Pull Requests");
        }
        await octokit.rest.issues.addLabels({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            issue_number: pullRequest.number,
            labels: [label],
        });
    }
    catch (error) {
        (0, core_1.setFailed)((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unknown error");
    }
}
exports.run = run;
run();
