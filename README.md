# conventional-commits-release-action

Creates releases based on [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## Usage

```yaml
name: Release
on:
  push:
    branches:
      - main
jobs:
  release:
    name: Release code
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Release
        uses: jef/conventional-commits-release-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

- `default-branch`: Default branch for GitHub repository. Default is `main`.
- `token` [**Required**]: Access token to the repository. Usually `${{ secrets.GITHUB_TOKEN }}`.

## Outputs

- `tag`: The tag that was created.

## Contributing

There are few npm tasks that will help you in building and packaging. All commands are prefaced by `npm run`.

- `build`: builds the action.
- `compile`: transpiles TypeScript.
- `clean`: removes `build` directory.
- `fix`: fixes lint and format issues.
- `lint`: runs linter and checks format issues.
- `start`: runs the action.
- `test`: tests the action.
