<template>
  <div :class="{
    'product': true,
    'product--none': product.stock === 0
  }">
    <div class="product__image">
      <img :src="product.image" alt="">
    </div>

    <div class="h4" v-text="product.title"/>

    <div>
      <span class="text-info">Бренд</span>
      <span v-text="getBrandName(product.brand)"/>
    </div>

    <div>
      <span class="text-info">Стоимость</span>
      <span v-text="product.price.value.toLocaleString()"/>
      <span>₽</span>
    </div>

    <div v-if="product.stock > 0">
      <span class="text-info">Доступно к покупке</span>
      <span v-text="product.stock"/>
      <span>шт</span>
    </div>

    <div class="product__offers">
      <div
        v-if="offersColors.length"
        class="offer"
      >
        <label
          v-for="(color, key) in offersColors"
          :key="`offer-color-${key}-${product.id}`"
        >
          <input
            type="radio"
            :name="`offer-color-${key}`"
            hidden
            :checked="!!selectedOffers.color && selectedOffers.color === color.value"
            :disabled="!color.enable"
            @change="selectColor(color)"
          >
          <span
            :class="{
              'offer__item': true,
              'offer__item--none': !color.enable
            }"
            :style="`background-color: ${getColorValue(color.value)}`"
          />
          <span v-if="!color.enable" class="line"/>
        </label>
      </div>
      <div
        v-if="offersSizes.length"
        class="offer"
      >
        <label
          v-for="(size, key) in offersSizes"
          :key="`offer-size-${key}`"
        >
          <input
            type="radio"
            :name="`offer-size-${key}-${product.id}`"
            hidden
            :checked="!!selectedOffers.size && selectedOffers.size === size.value"
            :disabled="!size.enable"
            @change="selectSize(size)"
          >
          <span
            :class="{
              'offer__item': true,
              'offer__item--none': !size.enable
            }"
            v-text="size.value"
          />
          <span v-if="!size.enable" class="line"/>
        </label>
      </div>

    </div>

    <div class="product__action pt-4">
      <div
        v-if="basketCount > 0"
        class="font-weight-bold"
      >
        <span >В корзине</span>
        <span v-text="`${basketCount} шт`"/>
      </div>
      <b-button
        v-if="product.stock > 0 && product.stock > basketCount"
        class="justify-content-center"
        @click="sendToBasket"
      >
        <span>В корзину</span>
      </b-button>

      <b-button
        v-if="product.stock > 0 && product.stock === basketCount"
        class="justify-content-center"
        to="/basket"
      >
        <span>Перейти в корзину</span>
      </b-button>

      <b-button
        v-if="product.stock === 0"
        disabled
        class="justify-content-center"
      >
        <span>Нет в наличии</span>
      </b-button>
    </div>

  </div>

</template>

<script>
export default {
  name: "product",
  props: {
    product: {
      type: Object,
      required: true
    },
    filters: {
      filters: {
        type: Array,
        required: true,
      },
    }
  },
  data: () => ({
    selectedOffers: {
      color: null,
      size: null,
      id: null
    },
  }),
  computed: {
    currentOffers() {
      let result = null
      result = this.product.offers?.map(item => {
        return {
          ...item,
          currentAvailable: item.available
        }
      }) ?? null
      let basket
      if (this.basketCount > 0) {
        basket = this._basket.filter(item => item.id === this.product.id) ?? null
        basket?.map(item => {
          if (item.offers) {
            const offerId = item.offers[0]?.id ?? null
            const index = result?.findIndex(i => i.id === offerId) ?? null
            if (index >= 0) {
              result[index].currentAvailable = result[index].available - item.count
            }
          }
        })
      }
      return result
    },
    basketCount() {
      const currentBasket = this._basket.filter(item => item.id === this.product.id) ?? null
      return currentBasket ? currentBasket.reduce((acc, elem) => acc + (elem.count || 1), 0) ?? 0 : 0
    },
    enableBuy() {
      let result = true
      if (this.offersColors.length > 0 && !this.selectedOffers.color) {
        result = false
      }
      if (this.offersSizes.length > 0 && !this.selectedOffers.size) {
        result = false
      }
      return result
    },
    offersColors() {
      let result = []
      let colors = []
      this.currentOffers?.forEach(item => {
         item.color && colors.push(item.color)
      })
      colors = [...new Set(colors)]
      if (colors.length > 0) {
        colors.map(item => {
          const hasAvailable = this.currentOffers.some(i => (i.color === item && i.currentAvailable > 0))
          let enable = true
          if (this.selectedOffers.size) {
            enable = this.currentOffers.some(i => (i.sizes === this.selectedOffers.size && i.color === item))
          }
          result.push({
            value: item,
            enable: hasAvailable && enable
          })
        })
      }
      return result
    },
    offersSizes() {
      let result = []
      let sizes = []
      this.currentOffers?.forEach(item => {
        item.sizes && sizes.push(item.sizes)
      })
      sizes = [...new Set(sizes)]
      if (sizes.length > 0) {
        sizes.map(item => {
          const hasAvailable = this.currentOffers.some(i => (i.sizes === item && i.currentAvailable > 0))
          let enable = true
          if (this.selectedOffers.color) {
            enable = this.currentOffers.some(i => (i.color === this.selectedOffers.color && i.sizes === item))
          }

          result.push({
            value: item,
            enable: hasAvailable && enable
          })
        })
      }
      return result
    }
  },
  methods: {
    getBrandName(id) {
      return this.filters.find(item => item.filter === 'brands').value.find(brand => brand.id === id).title
    },
    getColorValue(color) {
      return this.filters.find(item => item.filter === 'color').value.find(value => value.id === color).value
    },
    selectColor(color) {
      this.selectedOffers.color = color.value
      this.findOfferId()
    },
    selectSize(size) {
      this.selectedOffers.size = size.value
      this.findOfferId()
    },
    findOfferId() {
      if (this.selectedOffers.color && this.selectedOffers.size) {
        this.selectedOffers.id = this.currentOffers.find(i => (i.color === this.selectedOffers.color && i.sizes === this.selectedOffers.size)).id
      }
    },
    sendToBasket() {
      if (!this.enableBuy) {
        alert('Не все параметры товара выбраны')
        return true
      }

      if (this.currentOffers && !this.selectedOffers.id) {
        alert('Что-то пошло не так...')
        return true
      }

      const offer = this.currentOffers?.find(i => i.id === this.selectedOffers.id) ?? null
      let hasProductInBasket = false
      let count = 0
      if (!offer) {
        count = this.basketCount + 1
        hasProductInBasket = this.basketCount > 0
      } else {
        const currentOfferBasket = this._basket.find(item => (item.id === this.product.id && item.offers[0].id === offer.id)) ?? null
        count = (currentOfferBasket?.count || 0) + 1
        hasProductInBasket = !!currentOfferBasket
      }

      const basketProduct = {
       ...this.product,
        offers: offer ? [offer] : null,
        count: count
      }

      if (hasProductInBasket) {
        this.$store.commit('basket/updateBasketItem', basketProduct)
      } else {
        this.$store.commit('basket/addBasket', basketProduct)
      }
//
      this.selectedOffers = {
        color: null,
        size: null,
        id: null
      }
    }
  }
}
</script>

<style scoped lang="scss">
.product {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4px;
  width: 100%;
  height: 100%;
  padding: 20px 0;

  &.product--none {
    opacity: 0.5;
    pointer-events: none;
  }

  > * {
    display: block;
    margin: 0;
    gap: 4px;
  }

  &__image {
    display: flex;
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
    background-color: var(--light);

    img {
      object-position: center;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  &__offers {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__action {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: auto;
  }
}

.offer {
  display: flex;
  gap: 4px;

  label {
    position: relative;
    display: flex;
    margin: 0;
  }

  .line {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: rotate(45deg);
    content: '';
    display: block;
    width: 1px;
    height: 30px;
    background-color: var(--gray-dark);
    opacity: 1;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    height: 1.5em;
    color: var(--secondary);
    border: 1px solid currentColor;
    border-radius: 4px;
    cursor: pointer;

    &.offer__item--none {
      cursor: auto;
      opacity: 0.5;
    }
  }

  input:checked + .offer__item {
    border: 3px solid var(--info);
  }
}
</style>
