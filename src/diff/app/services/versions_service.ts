import Version from '#diff/models/version'
import { compareVersions } from '#diff/utils'

export default class VersionsService {
  #allVersions: Version[] = []

  get all(): string[] {
    return this.#allVersions.map((version) => version.toString())
  }

  source?: string = this.sources[0]?.toString()

  target?: string = this.targets[0]?.toString()

  get sources() {
    return this.all.slice(1).map((version) => version.toString())
  }

  get targets() {
    if (!this.source || this.all.length < 2) {
      return []
    }

    const index = this.all.findIndex(
      (version) => version.toString() === this.source
    )

    return this.all.slice(0, index)
  }

  constructor(tags: string[]) {
    this.setVersions(
      tags
        .map((name) => {
          return new Version(name)
        })
        .sort(compareVersions)
        .reverse()
    )
  }

  setSource(source: string) {
    if (!this.sources.includes(source)) {
      throw new Error('Given source version is unrecognized')
    }

    this.source = source

    if (this.target && !this.targets.includes(this.target)) {
      const newTarget = this.targets[this.targets.length - 1]
      this.setTarget(newTarget)
    }
  }

  setTarget(target: string) {
    if (!this.targets.includes(target)) {
      throw new Error('Given target version is unrecognized')
    }
    this.target = target
  }

  setVersions(versions: Version[]) {
    this.#allVersions = versions
  }
}
