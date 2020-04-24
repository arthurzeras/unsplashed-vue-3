<template>
  <div id="app">
    <layout-header/>

    <router-view/>
  </div>
</template>

<script>
import LayoutHeader from '@/components/layout/LayoutHeader'

export default {
  components: { LayoutHeader }
}
</script>

<style lang="scss">
</style>
