<template>
  <div>
    <div
      v-for="(filter, key1) in filters"
      :key="`filter-${key1}`"
      class="pb-4 filter d-flex flex-wrap"
    >
      <div
        class="h4 d-flex w-100"
        v-text="filter.title"
      />

      <div
        v-for="(value, key2) in filter.value"
        :key="`value-${key2}`"
        :class="`filter__item filter__item--${filter.filter}`"
      >
        <label class="filter__button">
          <input
            type="checkbox"
            hidden
            @change="changeFilter(filter.filter, filter.filter === 'size' ? value.title : value.id)"
          >
          <span
            v-if="filter.filter === 'color'"
            :style="`background-color: ${value.value}`"
            :title="value.title"
          />
          <span
            v-else
            v-text="value.title"
          />
        </label>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "filters",
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    filters: {
      type: Array,
      required: true,
    },
  },
  computed: {
    activeFilters: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('change', value)
      },
    },

  },
  methods: {
    changeFilter(filter, id) {
      const indexFilter = this.activeFilters.findIndex(item => item.filter === filter)
      const indexId = this.activeFilters[indexFilter]?.ids.findIndex(item => item === id) ?? null
      if (indexId >= 0) {
        this.activeFilters[indexFilter].ids.splice(indexId, 1)
      } else {
        this.activeFilters[indexFilter].ids.push(id)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  gap: 8px;

  &__button {
    display: flex;
    margin: 0;
    gap: 4px;
    color: var(--secondary);
    cursor: pointer;

    &:hover {
      color: var(--gray-dark);
    }

    input:checked + span {
      color: var(--gray-dark);
      font-weight: 600;
    }
  }

  &__item {
    &.filter__item--size, &.filter__item--color {
      .filter__button {
        span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.5em;
          height: 1.5em;
          border: 1px solid currentColor;
          border-radius: 4px;
        }

        input:checked + span {
          border: 3px solid var(--info);
        }
      }
    }
  }
}
</style>
