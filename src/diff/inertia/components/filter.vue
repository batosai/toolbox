<script setup lang="ts">
  import { router, usePage } from '@inertiajs/vue3'
  import { ref, watch } from 'vue'

  const page = usePage()

  const props = defineProps<{
    tags: Array<string>
    sourceVersion: string
    targetVersion: string
  }>()

  const source = ref(props.sourceVersion)
  const target = ref(props.targetVersion)

  const redirectToPage = () => {
    router.visit(`/${page.props.owner}/${page.props.repo}/${source.value}/${target.value}`)
  }

  watch(
    () => props.tags,
    () => {
      if (props.sourceVersion) {
        source.value = props.sourceVersion
      }

      if (props.targetVersion) {
        target.value = props.targetVersion
      }
    }
  )
</script>

<template>
  <div class="mb-4 shadow-xl card card-side bg-base-200">
    <div class="card-body">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <select
            v-model="source"
            class="w-full select select-bordered"
            aria-label="Source"
            required
          >
            <option selected disabled value="">Source</option>
            <option v-for="tag in tags">{{ tag }}</option>
          </select>
        </div>
        <div>
          <select
            v-model="target"
            class="w-full select select-bordered"
            aria-label="Target"
            required
          >
            <option selected disabled value="">Target</option>
            <option v-for="tag in tags">{{ tag }}</option>
          </select>
        </div>
        <div>
          <button type="submit" @click="redirectToPage" class="w-full btn btn-primary">
            View Diff
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
