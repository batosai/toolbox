<template>
  <Head title="Diff" />

  <Header :owner="owner" :repo="repo" />

  <section class="mx-8">

    <div role="alert" class="alert alert-warning">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-current shrink-0"
        fill="none"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>Warning: Request quota exhausted</span>
    </div>

    <Filter :tags="tags" :sourceVersion="sourceVersion!" :targetVersion="targetVersion!" />

    <template v-if="!files.length">
      <div x-show="files.length > 0" class="w-full h-8 mb-4 skeleton"></div>
      <div x-show="files.length > 0" class="w-full skeleton h-72"></div>
    </template>
    <template v-else>
      <template v-for="file in files">
        <Title :file="file" :sourceVersion="sourceVersion!" :targetVersion="targetVersion!" />
        <Code :file="file" />
      </template>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { Head } from '@inertiajs/vue3'
  import { onMounted, ref } from 'vue'
  import GithubService from '#diff/services/github_service'
  import Filter from '../components/filter.vue'
  import Header from '../components/header.vue'
  import Code from '../components/section/code.vue'
  import Title from '../components/section/title.vue'

  const props = defineProps<{
    owner: string
    repo: string
    sourceVersion?: string
    targetVersion?: string
  }>()

  let tags = ref([])
  const files = ref([])
  const sourceVersion = ref(props.sourceVersion)
  const targetVersion = ref(props.targetVersion)

  onMounted(async () => {
    const github: GithubService = new GithubService(`${props.owner}/${props.repo}`)
    tags.value = (await github.allTags()) as never[]

    if (!targetVersion.value) {
      targetVersion.value = tags.value[0]
    }

    if (!sourceVersion.value) {
      sourceVersion.value = tags.value[1]
    }

    if (sourceVersion.value && targetVersion.value) {
      files.value = (await github.allPatches(sourceVersion.value, targetVersion.value)) as never[]
    }
  })
</script>
