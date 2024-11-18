<script setup lang="ts">
  import type { PatchType } from '#diff/types'

  defineProps<{
    file: PatchType
  }>()
</script>

<template>
  <div class="mb-4 overflow-x-auto">
    <table class="table diff table-xs">
      <tbody>
        <tr class="border-0" v-for="line in file.lines">
          <td class="py-0 line-num" :class="line.type" :data-line-num="line.deletedLineNum"></td>
          <td class="py-0 line-num" :class="line.type" :data-line-num="line.insertedLineNum"></td>
          <td class="py-0 border-0 line-code" :class="line.type" v-text="line.content"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
