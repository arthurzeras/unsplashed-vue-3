<template>
  <header class="app-header">
    <router-link :to="{ name: 'Home' }" class="app-header__logo">
      <svg class="_2m4hn" version="1.1" viewBox="0 0 32 32" width="32" height="32">
        <title id="unsplash-home">Unsplash Home</title>
        <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path>
      </svg>

      <h1>Unsplashed</h1>
    </router-link>

    <nav class="app-header__menu">
      <ul class="app-header__menu-container">
        <li class="app-header__menu-item" v-for="(item, i) in menus" :key="i">
          <router-link :to="{ name: 'Search', params: { query: item } }">
            {{ item }}
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="app-header__search">
      <input type="text" v-model="search" @keyup.enter="searchData" placeholder="Search something...">
      <button class="app-header__search-button" @click="searchData">
        <span class="fa fa-search"/>
      </button>
    </div>
  </header>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { categories as menus } from '@/utils'

function _searchData (search) {
  console.log(search)
}

export default {
  name: 'LayoutHeader',

  setup () {
    const state = reactive({
      search: ''
    })

    const searchData = () => _searchData(state.search)

    return {
      menus,
      searchData,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss" scoped>
  @mixin flex-v-center {
    display: flex;
    align-items: center;
  }

  .app-header {
    padding: 10px 15px;
    @include flex-v-center;
    border-bottom: 1px solid var(--light);

    &__logo {
      @include flex-v-center;
      text-decoration: none;

      svg {
        fill: var(--main);
      }

      h1 {
        margin: 0 0 0 5px;
        font-size: 1.2rem;
        color: var(--main);
      }
    }

    &__menu {
      flex: 0 0 75%;
      padding: 0 15px;

      &-container {
        margin: 0;
        padding: 0;
        list-style: none;
        @include flex-v-center;
      }

      &-item {
        a {
          padding: 15px 10px;
          color: var(--main);
          text-decoration: none;
          border-bottom: 0 solid var(--dark);

          &:hover {
            color: var(--dark);
            border-bottom-width: 2px;
          }
        }
      }
    }

    &__search {
      flex: 0 0 15%;
      position: relative;
      @include flex-v-center;

      input {
        width: 100%;
        border-radius: 20px;
        padding: 10px 30px 10px 10px;
        border: 1px solid var(--light);

        &:focus {
          border-color: var(--main);
        }
      }
    }

    &__search-button {
      right: 10px;
      padding: 5px;
      border: none;
      cursor: pointer;
      position: absolute;
      background-color: transparent;

      .fa {
        color: var(--main);
      }
    }
  }
</style>
