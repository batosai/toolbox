<template>
  <Head title="Diff" />

  <Header :owner="owner" :repo="repo" />

  <section class="mx-8">
    <div v-if="errors" role="alert" class="alert alert-error">{{ errors }}</div>
    <div v-if="ratelimit.remaining == 0 && !user" role="alert" class="alert alert-warning">
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
      <div>
        <p>You have reached the API request limit for unauthenticated users (60 requests per hour).</p>
        <p>Log in with GitHub to increase your limit to 5,000 requests per hour and continue using the service.</p>
      </div>
      <a href="/github/redirect" class="btn btn-sm" data-inertia="false">Log in with GitHub</a>
    </div>

    <Filter :tags="listTags.tags" :sourceVersion="sourceVersion!" :targetVersion="targetVersion!" />

    <template v-if="!patches.files.length">
      <div x-show="patches.files.length > 0" class="w-full h-8 mb-4 skeleton"></div>
      <div x-show="patches.files.length > 0" class="w-full skeleton h-72"></div>
    </template>
    <template v-else>
      <template v-for="file in patches.files">
        <Title :file="file" :sourceVersion="sourceVersion!" :targetVersion="targetVersion!" />
        <Code :file="file" />
      </template>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { Head } from '@inertiajs/vue3'
  import { onMounted, watch,  ref } from 'vue'
  import GithubService from '~/services/github_service'
  import Filter from '~/components/filter.vue'
  import Header from '~/components/header.vue'
  import Code from '~/components/section/code.vue'
  import Title from '~/components/section/title.vue'
  import { ratelimit, listTags, patches } from '~/store'

  const props = defineProps<{
    owner: string
    repo: string
    sourceVersion?: string
    targetVersion?: string
    user?: {
      token: {
        token: string
      }
    }
    errors: string
  }>()

  const github: GithubService = new GithubService(`${props.owner}/${props.repo}`, props.user?.token.token)
  const sourceVersion = ref(props.sourceVersion)
  const targetVersion = ref(props.targetVersion)

  watch(
    () => listTags.tags,
    (newValue, _oldValue) => {
      if (!targetVersion.value) {
        targetVersion.value = newValue[0]
      }

      if (!sourceVersion.value) {
        sourceVersion.value = newValue[1]
      }

      if (sourceVersion.value && targetVersion.value) {
        github.allPatches(sourceVersion.value, targetVersion.value)
      }
    }
  )

  onMounted(async () => {
    github.allTags()
  })
</script>
