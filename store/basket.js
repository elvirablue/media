export  const state = () => ({
  basket: []
})

export const getters = {
  getBasket(state) {
    return state.basket
  }
}

export const mutations = {
  addBasket(state, basketItem) {
    state.basket.push(basketItem);
  },
  updateBasketItem(state, basketItem) {
    const index = state.basket.findIndex(item => {
      return item.id === basketItem.id && (item.offers ? item.offers[0].id === basketItem.offers[0].id : true)
    })
    state.basket.splice(index, 1, basketItem)
  },
  deleteBasketItem(state, basketItem) {
    const index = state.basket.findIndex(item => {
      return item.id === basketItem.id && (item.offers ? item.offers[0].id === basketItem.offers[0].id : true)
    })
    state.basket.splice(index, 1)
  }
}

export const actions = {}
