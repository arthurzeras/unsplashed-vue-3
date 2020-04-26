<template>
  <section class="search-page" :class="{ 'search-page__centralize': showInformations }">
    <div class="search-page__centralize-info" v-if="showInformations">
      <span class="far fa-frown" v-show="!fetching"/>
      <div>
        {{ !fetching ? 'No results for your search' : 'Loading...' }}
      </div>
    </div>

    <div class="search-page__grid" v-else>
      <router-link
        :key="photo.id"
        v-for="photo in photos"
        class="search-page__photo"
        :to="{ name: 'Image', params: { id: photo.id } }"
      >
        <img :src="photo.urls.small" :alt="photo.alt_description">
      </router-link>
    </div>
  </section>
</template>

<script>
import services from '@/services'
import { useRoute } from 'vue-router'
import { onMounted, reactive, toRefs, watch, computed } from 'vue'

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
      state.photos = []
      fetchResults({ reset: true })
    })

    const showInformations = computed(() => (
      !state.photos.length || (state.fetching && !state.photos.length)
    ))

    const fetchResults = async () => {
      state.fetching = true

      try {
        const res = await services.search({
          perPage: 30,
          query: state.params.query,
          page: state.pagination.page
        })

        state.photos = [...state.photos, ...res.data.results]

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

    return {
      ...toRefs(state),
      showInformations
    }
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
    overflow: hidden;
    break-inside: avoid;
    display: inline-block;

    &:hover {
      img {
        transform: scale(1.3);
      }
    }

    img {
      display: block;
      width: 100%;
      height: auto;
      transition: .4s;
    }
  }

  &__centralize {
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
