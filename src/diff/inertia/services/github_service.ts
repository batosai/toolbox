import { Octokit } from 'octokit'

import Patch from '~/models/patch.js'
import type { PatchType } from '~/types.js'
import { ratelimit, listTags, patches } from '../store.js'

export default class GithubService {
  octokit: Octokit
  repository: string
  owner: string
  repo: string

  constructor(repository: string, token: string | undefined) {
    this.octokit = new Octokit({
      auth: token
    })
    this.repository = repository
    const [owner, repo] = this.repository.split('/', 2)
    this.owner = owner
    this.repo = repo
  }

  async ping() {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.repository}`, { method: 'HEAD'})

      if (response.headers.get('x-ratelimit-remaining')) {
        ratelimit.set(response.headers.get('x-ratelimit-remaining') as string)
      }
      return response.status === 200
    }
    catch(error) {
      return false
    }
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
      if (response.headers['x-ratelimit-remaining']) {
        ratelimit.set(response.headers['x-ratelimit-remaining'])
      }
      tagNames = tagNames.concat(response.data.map((data) => data.name))
      tagNames = tagNames.filter((tag) => !regex.test(tag))

      listTags.set(tagNames)
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
      if (response.headers['x-ratelimit-remaining']) {
        ratelimit.set(response.headers['x-ratelimit-remaining'])
      }
      if (response.data) {
        const data = response.data as { files: Array<object> }

        if (data.files) {
          files = files.concat(data.files.map((file) => new Patch(file as PatchType)))
          patches.set(files)
        }
      }
    }

    return files
  }
}
