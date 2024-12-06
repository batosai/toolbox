<template>
  <div class="grid items-center content-center grid-cols-2">
    <h2 :id="file.anchor" class="px-2 font-semibold leading-7">
      <a :href="'#' + file.anchor" aria-hidden="true" tabindex="-1" class="text-primary">#</a>
      {{ file.filename }} <span class="text-xs text-neutral-content">({{ file.status }})</span>
    </h2>
    <div class="p-2 text-xs text-right">
      <span v-if="file.status == 'added'">{{ sourceVersion }}</span>
      <a
        v-else
        :href="`https://github.com/${owner}/${repo}/blob/${sourceVersion}/${file.filename}`"
        class="text-success"
        target="_blank"
        >{{ sourceVersion }}</a
      >
      ...
      <span v-if="file.status == 'removed'">{{ targetVersion }}</span>
      <a
        v-else
        :href="`https://github.com/${owner}/${repo}/blob/${targetVersion}/${file.filename}`"
        class="text-error"
        target="_blank"
        >{{ targetVersion }}</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePage } from '@inertiajs/vue3'
  import type { PatchType } from '~/types'

  const page = usePage()

  const owner = page.props.owner
  const repo = page.props.repo

  defineProps<{
    file: PatchType
    sourceVersion: string
    targetVersion: string
  }>()
</script>
