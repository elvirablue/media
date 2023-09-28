<template>
  <b-row>
    <b-col cols="12" md="4" lg="2">
      <div class="pt-4">
        <element-filters
          v-model="selectedFilters"
          :filters="filters"
        />
      </div>
    </b-col>

    <b-col>
      <div class="pt-4">
        <b-row v-if="filteredProducts.length > 0">
          <b-col
            v-for="(product, key) in filteredProducts"
            :key="`product-${key}`"
            cols="12"
            sm="6" md="4" lg="3"
          >
            <element-product
              :product="product"
              :filters="filters"
            />
          </b-col>
        </b-row>

        <div v-else>
          <div class="pb-4">Нет товаров для выбранных характеристик</div>
          <b-button @click="reload">Сбросить фильтры</b-button>
        </div>
      </div>
    </b-col>
  </b-row>

</template>

<script>
import FILTERS from '~/utils/filter.json'
import PRODUCTS from '~/utils/products.json'

export default {
  name: "IndexPage",
  data: () => ({
    selectedFilters: [],
    dataFilters: FILTERS,
    dataProducts: PRODUCTS
  }),
  mounted() {
   this.initFilters()
  },
  computed: {
    filters() {
      return this.dataFilters
        .map(item => {
          const key = Object.keys(item)[0]
          const filter = item[key]
          if (filter.value[0].hasOwnProperty('sort')) {
            filter.value.sort((p1, p2) => (p1.sort < p2.sort) ? -1 : (p1.sort > p2.sort) ? 1 : 0)
          }
          return {
            filter: key,
            ...filter
          }
        })
        .sort((p1, p2) => (p1.sort < p2.sort) ? -1 : (p1.sort > p2.sort) ? 1 : 0)
    },
    filteredProducts() {
      let result = this.dataProducts.slice()
      this.selectedFilters.forEach(item => {
        if (item.ids.length > 0) {
          switch (item.filter) {
            case 'brands':
              result = result.filter(i => item.ids.includes(i.brand))
              break
            case 'color':
              result = result.filter(i => i.offers).filter(i => i.offers.some(el => item.ids.includes(el.color)))
              break
            case 'size':
              result = result.filter(i => i.offers).filter(i => i.offers.some(el => item.ids.includes(el.sizes)))
              break
          }
        }
      })
      return result
    }
  },
  methods: {
    reload() {
      location.reload()
    },
    initFilters() {
      this.selectedFilters = this.dataFilters
        .map(item => {
          const key = Object.keys(item)[0]
          return {
            filter: key,
            ids: []
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
