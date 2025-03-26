const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = "Teamelite12";
const repo = "your-repo-name";
const projectNumber = 135;
const columnName = "Severity";

async function updateSeverityColumn(issue) {
  const labels = issue.labels.map(label => label.name);
  let severity = null;

  if (labels.includes("Severity-1")) {
    severity = "Severity-1";
  } else if (labels.includes("Severity-2")) {
    severity = "Severity-2";
  } else if (labels.includes("Severity-3")) {
    severity = "Severity-3";
  } else if (labels.includes("Severity-4")) {
    severity = "Severity-4";
  }

  if (severity) {
    const project = await octokit.projects.listForRepo({
      owner,
      repo,
    });

    const columns = await octokit.projects.listColumns({
      project_id: project.data.find(p => p.number === projectNumber).id,
    });

    const column = columns.data.find(c => c.name === columnName);

    if (column) {
      await octokit.projects.moveProjectCard({
        column_id: column.id,
        card_id: issue.id,
        position: "top",
      });
    }
  }
}

async function run() {
  const context = require("@actions/github").context;
  const issue = context.payload.issue;

  await updateSeverityColumn(issue);
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
