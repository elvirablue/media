<template>
  <b-row>
    <b-col cols="12">
      <div class="h4 mt-4">Корзина</div>
    </b-col>
    <b-col cols="12" md="8" lg="9">
      <div class="mt-4">
        <template v-if="basket.length > 0">
          <b-card
            v-for="(product, key) in basket"
            :key="`product-${key}`"
            class="mb-2 flex-column flex-sm-row"
            :img-src="product.image"
            img-left
          >
            <div class="d-flex h-100 w-100">
              <b-row class="w-100">
                <b-col cols="12" sm="auto" lg="6" class="pb-2">
                  <div>
                    <span v-text="getBrandName(product.brand)"/>
                    |
                    <span v-text="product.title"/>
                  </div>
                  <div v-if="product.offers">
                    <div>
                      <span>Цвет:</span>
                      <span>{{product.offers[0].color}}</span>
                    </div>

                    <div>
                      <span>Размер:</span>
                      <span>{{product.offers[0].sizes}}</span>
                    </div>

                  </div>

                </b-col>
                <b-col cols="auto" class="ml-lg-auto">
                  <div class="d-flex h-100 align-items-center">
                    <b-form-spinbutton
                      :value="product.count"
                      min="1"
                      :max="getCountMax(product)"
                      @change="updateBasket(product, $event)"
                    />
                  </div>
                </b-col>
                <b-col cols="auto">
                  <div class="d-flex h-100 align-items-center">
                    <span v-text="product.price.value.toLocaleString()"></span>
                    <span>₽</span>
                  </div>
                </b-col>
                <b-col cols="auto" class="ml-auto ml-md-0">
                  <div class="d-flex h-100 align-items-center">
                    <b-button
                      variant="outline"
                      @click="deleteBasketItem(product)"
                    >
                      <b-icon-trash font-scale="1" class="text-info"></b-icon-trash>
                    </b-button>
                  </div>
                </b-col>
              </b-row>

            </div>
          </b-card>
        </template>

        <div v-else>
          <div>В корзине пока нет товаров</div>
          <div>Перейти в <nuxt-link to="/">каталог</nuxt-link></div>
        </div>
      </div>
    </b-col>
    <b-col cols="12" md="4" lg="3">
      <b-card
        v-if="basket.length > 0"
        class="mt-4"
      >
        <div>
          <span class="font-weight-bold">Товаров: </span>
          <span v-text="basketCount"/>
        </div>
        <div>
          <span class="font-weight-bold">Итого: </span>
          <span v-text="totalAmount"/>
          <span>₽</span>
        </div>
        <b-button
          class="mt-4 w-100"
          @click="buyProducts"
        >
          Купить
        </b-button>
      </b-card>
    </b-col>
  </b-row>

</template>

<script>
import {BIcon, BIconTrash} from 'bootstrap-vue'
import FILTERS from '~/utils/filter.json'
import product from "~/components/product.vue";
export default {
  name: "BasketPage",
  components: {
    BIcon,
    BIconTrash
  },
  data: () => ({
    dataFilters: FILTERS,
    basket: []
  }),
  mounted() {
    this.basket = [...this._basket]
  },
  computed: {
    totalAmount() {
      let result = 0
      if (this.basket.length > 0) {
        result = this.basket.reduce((acc, elem) => acc + (elem.price.value * elem.count), 0) ?? 0
      }
      return result.toLocaleString()
    },
    basketCount() {
      return this._basket.length > 0 ? this._basket.reduce((acc, elem) => acc + (elem.count || 1), 0) ?? 0 : 0
    },
    filters() {
      return this.dataFilters.map(item => {
        const key = Object.keys(item)[0]
        const filter = item[key]
        return {
          filter: key,
          ...filter
        }
      })
    }
  },
  methods: {
    getBrandName(id) {
     return this.filters.find(item => item.filter === 'brands').value.find(brand => brand.id === id).title ?? ''
    },
    getColorValue(color) {
      //return this.filters.find(item => item.filter === 'color').value.find(value => value.id === color).value ?? ''
    },
    getCountMax(product) {
      let result = product.stock
      if (product.offers) {
        result = product.offers[0].available
      }
      return result
    },
    updateBasket(product, $event) {
      const basketProduct = {
        ...product
      }
      basketProduct.count = $event
      this.$store.commit('basket/updateBasketItem', basketProduct)
      this.basket = this._basket.slice()
    },
    deleteBasketItem(product) {
      this.$store.commit('basket/deleteBasketItem', product)
      this.basket = this._basket.slice()
    },
    buyProducts() {
      const result = this.basket.map(item => {
        return {
          productId: item.id,
          count: item.count,
          offerId: item.offers ? item.offers[0].id : null
        }
      })
      console.debug('Массив для формирования запроса: ', result)
      alert('Массив для формирования запроса выведен в console.debug')
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  img {
    margin: 10px;
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
}
</style>
