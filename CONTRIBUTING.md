# Contributing Guidelines

## Branching Strategy
- `main` contains production-ready code
- `develop` contains tested integration code
- `feature/*` branches are used for new enhancements
- `hotfix/*` branches are used for urgent fixes

## Feature Development
1. Create a feature branch from `develop`
2. Commit changes with clear messages
3. Push the branch and raise a Pull Request to `develop`
4. Ensure code passes tests before merging

## Commit Messages
Use clear and meaningful commit messages:
- feat: add wallet feature
- fix: resolve loan calculation bug
- refactor: improve service layer

## Code Review
- At least one approval is required
- No direct commits to `main`
