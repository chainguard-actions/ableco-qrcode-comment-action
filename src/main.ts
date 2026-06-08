import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import qrcode from "qrcode-generator";

function indent(string: string, count: number = 4): string {
  return string.replace(/^(?!\s*$)/gm, " ".repeat(count));
}

function getQRCode(content: string): string {
  const qr = qrcode(0, "L");
  qr.addData(content);
  qr.make();
  return qr.createASCII();
}

async function main(): Promise<void> {
  const token = core.getInput("repo-token");
  const content = core.getInput("content", { required: true });
  const comment = core.getInput("comment", { required: true });
  const octokit = getOctokit(token);
  await octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: context.issue.number,
    body: comment.replace("{qrcode}", "\n" + indent(getQRCode(content))),
  });
}

main().catch(core.setFailed);
