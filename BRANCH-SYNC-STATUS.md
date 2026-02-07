# Branch Sync Status Report

Generated: 2026-02-07

## Summary

Analysis of all repository branches and their sync status with `main` branch.

Main branch commit: `3c19c3d` - Merge pull request #11 from Avi-Bendetsky/copilot/count-branches

## Important Note

After detailed analysis, **syncing all branches with main requires manual intervention** due to significant code divergence and merge conflicts. The branches have evolved independently and merging main into them produces numerous conflicts that require domain knowledge to resolve correctly.

## Branches Already Synced

These branches already contain all commits from `main`:

### ✓ claude/repository-analysis-4puQN
- **Status**: Fully synced
- **Position**: 173 commits ahead of main, 0 commits behind
- **Latest commit**: `e51cd3d` - Merge main and resolve conflicts
- **Action**: No sync needed

### ✓ copilot/sync-repository-analysis-with-main  
- **Status**: Fully synced
- **Position**: 176 commits ahead of main, 0 commits behind
- **Latest commit**: `3ca627f` - Security fix: Remove hardcoded JWT secrets from .env.production
- **Action**: No sync needed (current working branch)

## Branches Needing Sync

All of the following branches are missing 1 commit from main (PR #11: copilot/count-branches merge):

### copilot/review-software-health
- **Status**: Needs sync
- **Position**: 28 commits ahead, 1 commit behind main
- **Latest commit**: `541b858` - Add documentation index for easy navigation of health reports
- **Action Required**: Merge `main` into this branch

### eslint-fixes-clean
- **Status**: Needs sync
- **Position**: 157 commits ahead, 1 commit behind main
- **Latest commit**: `4834671` - fix: update ESLint config to resolve all warnings
- **Action Required**: Merge `main` into this branch

### qoder/adaptive-client-questionnaire-tool-LR22kj
- **Status**: Needs sync
- **Position**: 10 commits ahead, 1 commit behind main
- **Latest commit**: `2a0be14` - feat(session): add continue session dto with question count validation
- **Action Required**: Merge `main` into this branch

### qoder/quiz-build-deployment-eUsiDf
- **Status**: Needs sync
- **Position**: 29 commits ahead, 1 commit behind main
- **Latest commit**: `994bfbd` - Merge pull request #8 from Avi-Bendetsky/copilot/review-software-health
- **Action Required**: Merge `main` into this branch

### qoder/quiz-builder-kBVnJv
- **Status**: Needs sync
- **Position**: 34 commits ahead, 1 commit behind main
- **Latest commit**: `48883c7` - chore: update paths and add update dto files
- **Action Required**: Merge `main` into this branch

## Sync Commands

To sync each branch manually, run:

```bash
# For each branch that needs syncing:
git checkout <branch-name>
git merge main --no-edit
git push origin <branch-name>
```

Example for one branch:
```bash
git checkout copilot/review-software-health
git merge main --no-edit
git push origin copilot/review-software-health
```

## Notes

- All branches are relatively up-to-date and only missing one recent merge commit
- The missing commit (3c19c3d) is a merge commit from PR #11  
- **However**, merging main into other branches causes significant merge conflicts due to code divergence
- Manual conflict resolution is required for each branch

## Recommendations

### Option 1: Per-Branch Manual Merge (Recommended for active branches)
For branches that are actively being worked on:
1. Checkout the branch locally
2. Run `git merge main`
3. Manually resolve all conflicts
4. Test thoroughly before pushing
5. Push the merged branch

### Option 2: Leave As-Is (Recommended for completed branches)
For branches that represent completed work or PRs:
- If the branch was already merged to main via PR, no action needed
- If the branch is abandoned, consider deleting it
- If the branch is a snapshot/backup, leave it as-is

### Option 3: Rebase (For feature branches with few commits)
For small feature branches:
1. Use `git rebase main` instead of merge
2. Resolve conflicts commit-by-commit
3. Force push (if the branch hasn't been shared widely)

## Conflict Analysis

When attempting to merge main into `copilot/review-software-health`, the following conflicts were encountered:

- README.md (add/add conflict)
- apps/api/nest-cli.json
- apps/api/src/modules/auth/auth.controller.ts
- apps/api/src/modules/auth/decorators/user.decorator.ts
- apps/api/src/modules/session/session.module.ts
- apps/api/src/modules/session/session.service.ts
- apps/api/src/modules/standards/standards.service.ts
- apps/api/src/modules/users/users.controller.ts
- Multiple tsconfig.json files (add/add conflicts)
- Docker and Terraform configuration files
- package-lock.json

Similar conflicts are expected for other branches.

## Conclusion

**The branches have diverged significantly and automated syncing is not feasible without manual conflict resolution.** Each branch should be evaluated individually to determine if syncing with main is necessary and worth the effort of resolving conflicts.

For the current PR (copilot/sync-repository-analysis-with-main), the sync with main has been completed successfully via merging claude/repository-analysis-4puQN, which already contained all main commits.
