import { Probot } from "probot";

export = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Obrigado por abrir a issue. \n Verifique os nossos guidelines, Código de conduta: https://github.com/Alecell/octopost/blob/master/CODE_OF_CONDUCT.md; \n Contribuição:https://github.com/Alecell/octopost/blob/master/CONTRIBUTING.md; \n Guia de Estilo: https://github.com/Alecell/octopost/blob/master/STYLEGUIDE.md; ",
    });
    await context.octokit.issues.createComment(issueComment);
  });
  app.on("issue_comment.created", async (context) => {
    const { comment, issue } = context.payload;
    const keywordRegex = /^eu quero!!!$/i;

    if (keywordRegex.test(comment.body)) {
      const username = comment.user.login;

      await context.octokit.issues.addAssignees({
        owner: context.repo().owner,
        repo: context.repo().repo,
        issue_number: issue.number,
        assignees: [username],
      });
    }
  });
  app.on("issues.opened", async (context) => {
    const milestoneTitle = "primeira pagina";

    const milestones = await context.octokit.issues.listMilestones({
      owner: context.repo().owner,
      repo: context.repo().repo,
    });

    const milestone = milestones.data.find((m) => m.title === milestoneTitle);

    if (milestone) {
      await context.octokit.issues.update({
        owner: context.repo().owner,
        repo: context.repo().repo,
        issue_number: context.payload.issue.number,
        milestone: milestone.number,
      });
    }
  });
  app.on("issues.opened", async (context) => {
    const projectName = "Mecanica";

    const projects = await context.octokit.projects.listForRepo({
      owner: context.repo().owner,
      repo: context.repo().repo,
    });

    const project = projects.data.find((p) => p.name === projectName);
    console.log(projects);
    if (project) {
      const columns = await context.octokit.projects.listColumns({
        project_id: project.id,
      });

      if (columns.data.length > 0) {
        await context.octokit.projects.createCard({
          column_id: columns.data[0].id,
          content_id: context.payload.issue.id,
          content_type: "Issue",
        });
      }
    }
  });
};
