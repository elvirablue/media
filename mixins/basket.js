export default {
  computed: {
    _basket() {
      return this.$store.getters['basket/getBasket']
    }
  }
}
