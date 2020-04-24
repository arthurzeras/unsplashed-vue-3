<template>
  <div class="home">
    <h1 class="home__title">Beautiful Free Images and Pictures</h1>

    <div class="images-gallery">
      <a
        href="#"
        :key="image.id"
        class="image-item"
        v-for="image in images"
        :style="{ height: `${imageHeight}px`}"
      >
        <img :src="image.url" :alt="image.alt">
      </a>
    </div>
  </div>
</template>

<script>
import services from '@/services'
import { categories } from '@/utils'
import { onMounted, reactive, toRefs } from 'vue'

async function _getExampleImages () {
  try {
    const query = categories[Math.floor(Math.random() * categories.length)]
    const response = await services.search({ query })

    return response.data.photos.results.map(photo => ({
      id: photo.id,
      url: photo.urls.small,
      alt: photo.alt_description
    }))
  } catch (error) {
    console.error(error)
  }
}

export default {
  name: 'Home',

  setup () {
    const state = reactive({
      images: [],
      imageHeight: 0
    })

    _getExampleImages().then(data => (state.images = data))

    onMounted(() => {
      state.imageHeight = window.innerWidth / 5
    })

    return toRefs(state)
  }
}
</script>

<style lang="scss">
  .home {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 58px);
    background-color: var(--black);

    &__title {
      margin: 0;
      z-index: 1;
      position: absolute;
      color: var(--light);
      pointer-events: none;
    }

    .images-gallery {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      height: calc(100vh - 58px);

      .image-item {
        width: 20%;
        height: 200px;
        overflow: hidden;
        display: inline-block;

        img {
          width: 100%;
          height: 100%;
          display: block;
          transition: 1s;
          object-fit: cover;
          filter: brightness(0.2);

          &:hover {
            transform: scale(1.3);
          }
        }
      }
    }
  }
</style>
