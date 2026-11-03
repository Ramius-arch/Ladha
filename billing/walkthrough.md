# Walkthrough — Deployment & Logger Fixes

## Changes Made

1. **GitHub Actions Workflow Update (`.github/workflows/deploy.yml`)**
   - Modified the CI/CD pipeline steps to navigate (`cd backend`, `cd frontend`) and install/test/build packages within their respective project subdirectories.
   - Removed the `--workspace` flag since npm workspaces are not configured for this repository.

2. **Redis Logger Level Fix (`backend/config/redis.js`)**
   - Changed the connection log call from `logger.warn` to `logger.warning` to align with the custom levels configuration in `backend/utlis/logger.js`.

## Verification & Testing

- **Backend Unit Tests:** Ran `npm test` inside the `backend` directory locally, and the suite passed successfully after fixing the logger method call.
- **Git Push:** Successfully committed and pushed the changes to the remote repository (`main` branch) to trigger the corrected GitHub Actions runner.
