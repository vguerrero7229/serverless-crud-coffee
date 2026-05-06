# CI/CD screenshots

Add PNG captures here for the challenge README (replace placeholders after your first runs).

Suggested filenames:

| File | What to capture |
|------|-----------------|
| `01-github-actions-ci.png` | **CI** workflow green run (`ci.yml`: test + lint + `serverless print`). |
| `02-deploy-push-master.png` | **Deploy** workflow triggered by a push to **`master`**, **deploy-dev** job deploying `--stage dev`. |
| `03-environments.png` | Repository **Settings → Environments**: `development` and `production` (optional protection rules on `production`). |
| `04-workflow-dispatch-prod.png` | **Actions → Deploy → Run workflow** with stage **prod**, showing **deploy-manual** using environment **production**. |

These paths match the image references in the root `README.md`.
