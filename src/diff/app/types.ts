export type LineType = {
  content: string
  insertedLineNum?: number
  deletedLineNum?: number
  type: 'comment' | 'deleted' | 'inserted' | 'unchanged'
}

export type PatchType = {
  sha: string
  filename: string
  status: string
  raw_url: string
  content_url: string
  patch: string
  lines?: LineType[]
  anchor: string
}
