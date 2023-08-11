export function getGitBuildInfo(): GitBuildInfo {
  let gitInfo = DEFAULT_GIT_INFO;
  try {
    gitInfo = require("../../utils/Git/generatedGitInfo.json");
  } catch (e) {}
  return gitInfo;
}

export const DEFAULT_GIT_INFO: GitBuildInfo = {
  tag: "unknown",
  commit:
    "commit 0000000000000000000000000000000000000000\nAuthor: Unknown Author <author@example.com>\nDate:   Thu Jan 01 00:00:00 1970 +0000\n\n   Commit message",
  branch: "unknown",
  hash: "0000000000000000000000000000000000000000",
};

export type GitBuildInfo = {
  tag: string;
  commit: string;
  branch: string;
  hash: string;
};
