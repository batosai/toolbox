const EMPTY_PATTERN = /^\s*$/

function dropWhile<T>(arr: T[], func: (item: T) => boolean) {
  while (arr.length > 0 && !func(arr[0])) {
    arr = arr.slice(1)
  }
  return arr
}

export default class Version {
  #version: string

  get canonicalSegments() {
    return this.#splitSegments()
      .map((segments) => {
        segments = segments.reverse()
        dropWhile(segments, (segment) => segment === 0)
        return segments.reverse()
      })
      .reduce((result, segments) => result.concat(segments), [])
  }

  get #segments() {
    return Array.from(this.#version.matchAll(/[0-9]+|[a-z]+/gi), (segment) => {
      const s = segment[0]
      if (/^\d+$/.test(s)) {
        return parseInt(s, 10)
      } else {
        return s
      }
    })
  }

  constructor(version: string) {
    version = version.replace(/\n/g, ' ')

    if (EMPTY_PATTERN.test(version)) {
      version = '0'
    }

    this.#version = version.trim().replace(/-/g, '.pre.')
  }

  toString() {
    return this.#version
  }

  #splitSegments() {
    const stringStart = this.#segments.findIndex(
      (segment) => typeof segment === 'string'
    )
    const numericSegments = this.#segments.slice(
      0,
      stringStart || this.#segments.length
    )
    const stringSegments = this.#segments.slice(
      numericSegments.length,
      this.#segments.length
    )
    return [numericSegments, stringSegments]
  }
}
