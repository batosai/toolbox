<template>
  <Head title="Homepage" />

  <div class="flex flex-col justify-center min-h-screen px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <svg xmlns="http://www.w3.org/2000/svg" height="200">
        <!-- GitHub reference: simplified GitHub logo -->
        <circle cx="50" cy="100" r="40" fill="#181717" />
        <text x="30" y="105" font-size="16" fill="#fff" font-weight="bold">GitHub</text>

        <!-- Comparison representation -->
        <!-- Left branch -->
        <line x1="120" y1="50" x2="200" y2="50" stroke="#2C974B" stroke-width="4" />
        <circle cx="120" cy="50" r="6" fill="#2C974B" />
        <text x="210" y="55" font-size="16" fill="#777">Version A</text>

        <!-- Right branch -->
        <line x1="120" y1="150" x2="200" y2="150" stroke="#E44D26" stroke-width="4" />
        <circle cx="120" cy="150" r="6" fill="#E44D26" />
        <text x="210" y="155" font-size="16" fill="#777">Version B</text>

        <!-- Comparison arrow -->
        <line x1="200" y1="50" x2="200" y2="150" stroke="#555" stroke-width="2" stroke-dasharray="4" />
        <polygon points="195,70 205,70 200,60" fill="#555" />
        <polygon points="195,130 205,130 200,140" fill="#555" />
        <text x="220" y="105" font-size="14" fill="#555">Compare</text>
      </svg>
    </div>

    <div class="w-full mx-auto md:w-1/4">
      <div class="flex my-4 text-xs md:text-base">
        <span class="text-[#777]">https://github.com/</span>
        <span class="relative font-bold highlighted-part" :class="{ animate: isAnimating }">
          batosai/adonis-attachment
        </span>
      </div>
      <p>
        Retrieve the highlighted part and enter it into the field below:
      </p>
    </div>

    <div class="w-full mx-auto mt-10 md:w-1/4 join">
      <input
        v-model="repo"
        @keydown.enter="handleEnter"
        class="w-full input input-bordered join-item placeholder:text-neutral-content placeholder:italic"
        :class="{ 'input-error': !isValidFormat && repo }"
        placeholder="batosai/adonis-attachment"
        value=""
      />
      <button class="btn btn-primary join-item" @click="redirectToPage" :disabled="repo === '' || !isValidFormat">
        ok
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Head, router } from '@inertiajs/vue3'
  import { ref, computed, onMounted } from 'vue'

  const repo = ref('')

  const isValidFormat = computed(() => /^[a-zA-Z0-9_-]{2,}\/[a-zA-Z0-9_-]{2,}$/.test(repo.value))

  const redirectToPage = () => {
    router.visit(`/${repo.value}`)
  }

  const handleEnter = () => {
    if (isValidFormat.value) {
      redirectToPage()
    }
  }

  const isAnimating = ref(false)

  const triggerAnimation = () => {
  setTimeout(() => {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 2000)
  }, 1000)
}

  onMounted(() => {
    triggerAnimation()
  })
</script>

<style scoped>

.highlighted-part {
  color: #2c974b;
}

.highlighted-part::after {
  @apply absolute left-0 right-0 bottom-0 h-[2px];
  content: '';
  background: #2c974b;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease-in-out;
}

.highlighted-part.animate::after {
  transform: scaleX(1);
}

</style>
