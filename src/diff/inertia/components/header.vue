<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/" class="text-xl btn btn-ghost">{{ owner }}/{{ repo }}</a>
    </div>
    <div class="flex-none">
      <ul class="px-1 menu menu-horizontal">
        <li><a href="https://github.com/batosai/toolbox" data-inertia="false" target="_blank">Github</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    owner: string
    repo: string
  }>()
</script>
