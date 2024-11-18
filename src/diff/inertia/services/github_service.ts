import { Octokit } from 'octokit'
import Patch from '#diff/models/patch'
import type { PatchType } from '#diff/types'

export default class GithubService {
  octokit: Octokit
  repository: string
  owner: string
  repo: string

  constructor() {
    this.octokit = new Octokit()
    this.repository = 'batosai/adonis-attachment'
    const [owner, repo] = this.repository.split('/', 2)
    this.owner = owner
    this.repo = repo
  }

  async allTags() {
    let tagNames: Array<string> = []

    for await (const response of this.octokit.paginate.iterator(this.octokit.rest.repos.listTags, {
      owner: this.owner,
      per_page: 100,
      repo: this.repo,
    })) {
      tagNames = tagNames.concat(response.data.map((data) => data.name))
    }

    return tagNames
  }

  async allPatches() {
    const sourceVersion = '2.4.0'
    const targetVersion = '2.4.2'
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

        files = files.concat(data.files.map((file) => new Patch(file as PatchType)))
      }
    }

    return files
  }
}
