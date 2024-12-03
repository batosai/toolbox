import type { PatchType } from '#diff/types'

import { reactive } from 'vue'

interface Ratelimit {
  remaining: number
  set: (value: string) => void
}

interface ListTags {
  tags: string[]
  set: (tags: string[]) => void
}

interface Patches {
  files: PatchType[]
  set: (files: PatchType[]) => void
}


export const ratelimit = reactive<Ratelimit>({
  remaining: -1,
  set(value: string) {
    this.remaining = this.remaining !== 0 ? parseInt(value) : 0
  }
})

export const listTags = reactive<ListTags>({
  tags: [],
  set(tags: string[]) {
    this.tags = tags
  }
})

export const patches = reactive<Patches>({
  files: [],
  set(files: PatchType[]) {
    this.files = files
  }
})
