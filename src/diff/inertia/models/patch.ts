import type { PatchType } from '~/types.js'
import Line from './line.js'

const commentRegexp = /^\\/
const deleted = /^-/
const inserted = /^\+/

export default class Patch {
  sha: string
  filename: string
  status: string
  raw_url: string
  content_url: string
  patch: string
  lines: Line[] = []

  constructor({ sha, filename, status, raw_url, content_url, patch }: PatchType) {
    this.sha = sha
    this.filename = filename
    this.status = status
    this.raw_url = raw_url
    this.content_url = content_url
    this.patch = patch

    if (this.patch) {
      this.rawLines(this.patch?.split('\n'))
    }
  }

  rawLines(lines: string[]) {
    let deletedLineNum = 1
    let insertedLineNum = 1

    lines.forEach((line) => {
      if (commentRegexp.test(line)) {
        this.lines.push(new Line({ content: line, type: 'comment' }))
      } else if (deleted.test(line)) {
        this.lines.push(
          new Line({
            content: line,
            deletedLineNum: deletedLineNum++,
            type: 'deleted',
          })
        )
      } else if (inserted.test(line)) {
        this.lines.push(
          new Line({
            content: line,
            insertedLineNum: insertedLineNum++,
            type: 'inserted',
          })
        )
      } else {
        this.lines.push(
          new Line({
            content: line,
            deletedLineNum: deletedLineNum++,
            insertedLineNum: insertedLineNum++,
            type: 'unchanged',
          })
        )
      }
    })
  }

  get anchor() {
    return `diff-${this.sha}`
  }
}
