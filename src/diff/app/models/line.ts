import type { LineType } from '../types.js'

export default class Line {
  content: string
  insertedLineNum?: number
  deletedLineNum?: number
  type: 'comment' | 'deleted' | 'inserted' | 'unchanged'

  constructor(data: LineType) {
    this.content = data.content
    this.insertedLineNum = data.insertedLineNum
    this.deletedLineNum = data.deletedLineNum
    this.type = data.type
  }
}
