<script setup lang="ts">
  import { router, usePage } from '@inertiajs/vue3'
  import { ref, watch } from 'vue'
  import VersionsService from '#diff/services/versions_service'

  const page = usePage()

  const props = defineProps<{
    tags: Array<string>
    sourceVersion: string
    targetVersion: string
  }>()

  const source = ref(props.sourceVersion)
  const target = ref(props.targetVersion)
  const sources = ref([])
  const targets = ref([])

  const redirectToPage = () => {
    router.visit(`/${page.props.owner}/${page.props.repo}/${source.value}/${target.value}`)
  }

  const refreshSelect = async () => {
    const versionService = new VersionsService(props.tags)
    versionService.setSource(source.value)
    targets.value = (await versionService.targets) as never[]
    sources.value = (await versionService.sources) as never[]
  }

  watch(
    () => props.tags,
    async () => {
      if (props.sourceVersion) {
        source.value = props.sourceVersion
      }

      if (props.targetVersion) {
        target.value = props.targetVersion
      }

      await refreshSelect()
    }
  )
</script>

<template>
  <div class="mb-4 shadow-xl card card-side bg-base-200">
    <div class="card-body">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <div v-if="!sources.length" class="w-full h-8 mb-4 skeleton"></div>
          <select
            v-else
            v-model="source"
            @change="refreshSelect"
            class="w-full select select-bordered"
            aria-label="Source"
            required
          >
            <option selected disabled value="">Source</option>
            <option v-for="tag in sources">{{ tag }}</option>
          </select>
        </div>
        <div>
          <div v-if="!targets.length" class="w-full h-8 mb-4 skeleton"></div>
          <select
            v-else
            v-model="target"
            class="w-full select select-bordered"
            aria-label="Target"
            required
          >
            <option selected disabled value="">Target</option>
            <option v-for="tag in targets">{{ tag }}</option>
          </select>
        </div>
        <div>
          <button type="submit" @click="redirectToPage" :disabled="!sources.length && !targets.length" class="w-full btn btn-primary">
            View Diff
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
