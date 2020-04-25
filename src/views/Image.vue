<template>
  <div class="page-image">
    <div class="page-image__loading" v-if="loading">
      Loading...
    </div>

    <template v-else>
      <img class="page-image__image" :src="image?.urls?.full" :alt="image.alt_description"/>

      <button class="page-image__button" @click="toggleTags()">
        {{ showTags ? 'Hide' : 'Show' }} tags <span class="fa fa-tags"/>
      </button>

      <transition name="tags">
        <aside class="page-image__tags-container" v-if="showTags">
          <ul class="page-image__tags">
            <li class="page-image__tag" v-for="tag in tags" :key="tag.title">
              <a href="#">
                <span class="fa fa-tag"/>
                {{ tag.title }}
              </a>
            </li>
          </ul>
        </aside>
      </transition>
    </template>
  </div>
</template>

<script>
import services from '@/services'
import { useRouter } from 'vue-router'
import { toRefs, reactive, computed, onMounted } from 'vue'

export default {
  setup () {
    const { currentRoute } = useRouter()

    const state = reactive({
      image: {},
      loading: false,
      showTags: false
    })

    const getImageData = async () => {
      state.loading = true
      state.image = (await services.photo({ id: currentRoute.value.params.id })).data
      state.loading = false
    }

    const toggleTags = () => {
      state.showTags = !state.showTags
    }

    const handleDocumentClick = () => {
      document.addEventListener('click', ev => {
        const button = document.querySelector('.page-image__button')

        if (!state.showTags || ev.target === button) return

        const aside = document.querySelector('.page-image__tags-container')

        if (ev.target !== aside && !aside.contains(ev.target)) toggleTags()
      })
    }

    onMounted(() => {
      getImageData()
      handleDocumentClick()
    })

    const tags = computed(() => state.image.tags.filter(tag => tag.type === 'search'))

    return {
      tags,
      toggleTags,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss">
  .page-image {
    display: flex;
    padding: 20px;
    overflow-x: hidden;
    position: relative;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 58px);

    &__loading {
      font-size: 2rem;
      font-weight: bold;
    }

    &__image {
      height: 100%;
    }

    &__button {
      z-index: 1;
      right: 20px;
      bottom: 20px;
      font-size: 15px;
      cursor: pointer;
      transition: .4s;
      padding: 5px 10px;
      position: absolute;
      border-radius: 5px;
      color: var(--white);
      border: 1px solid var(--main);
      background-color: var(--main);

      &:hover {
        background-color: var(--dark);
      }
    }

    &__tags-container {
      top: 0;
      right: 0;
      width: 15%;
      height: 100%;
      transition: .4s;
      overflow-y: auto;
      position: absolute;
      padding: 15px 15px 60px 15px;
      background-color: var(--main);
      box-shadow: -10px 10px 20px rgba(0, 0, 0, .7);
    }

    &__tags {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    &__tag {
      a {
        display: block;
        transition: .4s;
        padding: 10px 0;
        color: var(--white);
        text-decoration: none;

        .fa {
          font-size: 10px;
        }

        &:hover {
          color: var(--dark);
        }
      }
    }

    .tags-enter-active, .tags-leave-to {
      right: -30%;
    }

    .tags-enter-to {
      right: 0;
    }
  }
</style>
