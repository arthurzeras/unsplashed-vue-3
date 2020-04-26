<template>
  <section class="search-page" :class="{ 'search-page__empty': !photos.length }">
    <div class="search-page__grid" v-if="photos.length">
      <figure class="search-page__photo" v-for="photo in photos" :key="photo.id">
        <img :src="photo.urls.small" :alt="photo.alt_description">
      </figure>
    </div>

    <div class="search-page__empty-info" v-else>
      <span class="far fa-frown"></span>
      <div>No results for your search</div>
    </div>
  </section>
</template>

<script>
import services from '@/services'
import { useRoute } from 'vue-router'
import { onMounted, reactive, toRefs, watch } from 'vue'

export default {
  name: 'Search',

  props: {
    query: { type: String }
  },

  setup (props) {
    const { params } = useRoute()
    const state = reactive({
      params,
      photos: [],
      fetching: false,
      pagination: {
        page: 1
      }
    })

    watch(() => props.query, query => {
      state.pagination.page = 1
      state.params = { query }
      fetchResults({ reset: true })
    })

    const fetchResults = async (config = {}) => {
      state.fetching = true

      try {
        const res = await services.search({
          perPage: 30,
          query: state.params.query,
          page: state.pagination.page
        })

        state.photos = !config.reset
          ? [...state.photos, ...res.data.results]
          : res.data.results

        state.pagination = {
          ...state.pagination,
          lastPage: res.data.total_pages
        }
      } catch (error) {
        state.pagination.page--

        console.error(error)
      } finally {
        state.fetching = false
      }
    }

    const scrollHandler = () => {
      document.querySelector('.search-page').addEventListener('scroll', ev => {
        const { scrollHeight, scrollTop, clientHeight } = ev.target

        if (
          !state.fetching &&
          (scrollHeight - scrollTop) < (clientHeight + 1200) &&
          state.pagination.page < state.pagination.lastPage
        ) {
          state.pagination.page++
          fetchResults()
        }
      })
    }

    onMounted(() => {
      fetchResults()
      scrollHandler()
    })

    return toRefs(state)
  }
}
</script>

<style lang="scss">
.search-page {
  overflow-y: auto;
  height: calc(100vh - 58px);

  &__grid {
    column-gap: 5px;
    column-width: 350px;
  }

  &__photo {
    margin: 0;
    padding: 0;
    break-inside: avoid;
    display: inline-block;

    img {
      width: 100%;
      height: auto;
    }
  }

  &__empty {
    display: flex;
    font-size: 1.5rem;
    align-items: center;
    justify-content: center;

    &-info {
      text-align: center;

      .far {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
