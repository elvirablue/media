<template>
  <b-container>
    <b-navbar class="border-bottom border-info">
      <b-navbar-brand to="/">
        <img src="~/static/logo.png" class="d-block align-top" alt="">
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
      <b-nav-item>
        <nuxt-link
          to="basket"
          class="d-flex align-items-start"
        >
          <b-icon-cart font-scale="2" class="text-info"/>
          <b-badge
            v-if="basketCount > 0"
            variant="info"
            class="mt-n2"
          >
            {{basketCount}}
          </b-badge>
        </nuxt-link>
      </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <nuxt/>
  </b-container>
</template>

<script>
import { BIcon, BIconCart } from 'bootstrap-vue'

export default {
  name: 'Layout',
  components: {
    BIcon,
    BIconCart
  },
  computed: {
    basketCount() {
      return this._basket.length > 0 ? this._basket.reduce((acc, elem) => acc + (elem.count || 1), 0) ?? 0 : 0
    }
  }
}

</script>

<style scoped>
.navbar {
  border-bottom: 1px solid red;
}
.navbar-brand {
  width: 100px;
  height: 50px;

  img {
    object-fit: contain;
    object-position: center;
    width: 100%;
    height: 100%;
  }
}
</style>
