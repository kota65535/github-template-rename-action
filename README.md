# github-template-rename-action

GitHub Action for replacing & renaming files and directories of a repository created from a template repository.

[Template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
is a convenient way to create a new repository with the same directory structure and files as an existing repository.
Since current template repositories do not have the ability to customize new repositories on creation,
we often have to manually replace the identifiers derived from the project name in files and file names.
This action does it for you.

## Features

Creates PR that includes the following changes.

- Replaces project name identifiers in all files with various naming conventions. For example:
  - Flat case (ex. `foobarbaz`)
  - Kebab case (ex. `foo-bar-baz`)
  - Snake case (ex. `foo_bar_baz`)
  - Camel case (ex. `fooBarBaz`)
  - Pascal case (ex. `FooBarBaz`)
- Renames all files and directories in the same manner.

## Inputs

| Name             | Description                                                                                    | Required | Default                                                 |
|------------------|------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------|
| `from-name`      | Project name to be replaced. Should be kebab, snake, camel or pascal case.                     | No       | Name of the template repository                         |
| `to-name`        | New project name to replace with. Should be kebab, snake, camel or pascal case.                | No       | Name of your repository                                 |
| `paths-ignore`   | Paths to ignore. Accepts [micromatch](https://github.com/micromatch/micromatch) glob patterns. | No       | N/A                                                     |
| `commit-message` | Commit message                                                                                 | No       | `rename`                                                | 
| `github-token`   | GitHub token                                                                                   | No       | `${{ env.GITHUB_TOKEN }}` or<br/> `${{ github.token }}` | 
| `pr-branch`      | PR branch name                                                                                 | No       | `template-rename`                                       |
| `pr-base-branch` | PR base branch name                                                                            | No       | Default branch of your repository                       |
| `pr-title`       | PR title                                                                                       | No       | `Template rename`                                       |
| `pr-labels`      | PR labels to add                                                                               | No       | N/A                                                     |
| `dry-run`        | Dry-run or not. If true, it does not perform commit & push.                                    | No       | `false`                                                 |

## Usage

```yaml

  # Replacement & Renaming occurs as follows:
  #
  #   the-sample -> my-project
  #   thesample  -> myproject
  #   the_sample -> my_project
  #   theSample  -> myProject
  #   TheSample  -> MyProject
  #   the sample -> my project
  #
  - uses: kota65535/github-template-rename-action@v1
    with:
      from-name: the-sample
      to-name: my-project

  # You need to use GitHub personal access token with workflow scope if you are to update 
  # workflow files.
  - uses: kota65535/github-template-rename-action@v1
    with:
      from-name: the-sample
      to-name: my-project
      github-token: ${{ secrets.PAT }}

  # Files that match any of the patterns of paths-ignore are not replaced & renamed.
  - uses: kota65535/github-template-rename-action@v1
    with:
      from-name: the-sample
      to-name: my-project
      github-token: ${{ secrets.PAT }}
      paths-ignore: |
        **/*.jar
        docs/**

  # from-name and to-name may be omitted if each matches the template repository name and the 
  # current repository name, respectively.
  - uses: kota65535/github-template-rename-action@v1

```
