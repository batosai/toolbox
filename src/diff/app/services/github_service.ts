import { Octokit } from 'octokit'
import Patch from '#diff/models/patch'
import type { PatchType } from '#diff/types'

export default class GithubService {
  octokit: Octokit
  repository: string
  owner: string
  repo: string

  constructor(repository: string) {
    this.octokit = new Octokit()
    this.repository = repository
    const [owner, repo] = this.repository.split('/', 2)
    this.owner = owner
    this.repo = repo
  }

  async allTags() {
    let tagNames: Array<string> = []
    const forbiddenWords = ['pre', 'pr', 'rc', 'alpha', 'beta']
    const regex = new RegExp(forbiddenWords.join('|'), 'i')

    for await (const response of this.octokit.paginate.iterator(this.octokit.rest.repos.listTags, {
      owner: this.owner,
      per_page: 100,
      repo: this.repo,
    })) {
      tagNames = tagNames.concat(response.data.map((data) => data.name))
      tagNames = tagNames.filter((tag) => !regex.test(tag))
    }

    return tagNames
  }

  async allPatches(sourceVersion: string, targetVersion: string) {
    let files: Array<PatchType> = []

    for await (const response of this.octokit.paginate.iterator(
      this.octokit.rest.repos.compareCommitsWithBasehead,
      {
        basehead: `${sourceVersion}...${targetVersion}`,
        owner: this.owner,
        per_page: 100,
        repo: this.repo,
      }
    )) {
      if (response.data) {
        const data = response.data as { files: Array<object> }

        if (data.files) {
          files = files.concat(data.files.map((file) => new Patch(file as PatchType)))
        }
      }
    }

    return files
  }
}
