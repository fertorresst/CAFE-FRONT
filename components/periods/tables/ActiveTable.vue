<template>
  <v-data-table
    :headers="headersActivePeriods"
    :items="activePeriods"
    class="elevation-0 mt-4"
    :footer-props="footerProps"
  >
    <template #[`item.dateStart`]="{ item }">
      {{ moment(item.dateStart).format('DD MMM YY').toUpperCase() }}
    </template>

    <template #[`item.dateEnd`]="{ item }">
      {{ moment(item.dateEnd).format('DD MMM YY').toUpperCase() }}
    </template>

    <template #[`item.exclusive`]="{ item }">
      <v-icon
        :color="item.exclusive ? 'success' : 'error'"
      >
        {{ item.exclusive ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </template>

    <template #[`item.actions`]="{ item }">
      <v-tooltip
        color="error"
        bottom
      >
        <template #activator="{ on, attrs }">
          <v-icon
            color="error"
            v-bind="attrs"
            v-on="on"
            @click="emit(item, 'deleteTable')"
          >
            mdi-calendar-remove
          </v-icon>
        </template>
        <span>ELIMINAR PERIODO</span>
      </v-tooltip>

      <v-tooltip
        color="info"
        bottom
        class="px-4"
      >
        <template #activator="{ on, attrs }">
          <v-icon
            color="info"
            v-bind="attrs"
            v-on="on"
            @click="emit(item, 'editTable')"
          >
            mdi-calendar-edit
          </v-icon>
        </template>
        <span>EDITAR PERIODO</span>
      </v-tooltip>

      <v-tooltip
        color="success"
        bottom
      >
        <template #activator="{ on, attrs }">
          <v-icon
            color="success"
            v-bind="attrs"
            v-on="on"
            @click="emit(item, 'finishTable')"
          >
            mdi-calendar-check
          </v-icon>
        </template>
        <span>FINALIZAR PERIODO</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    activePeriods: {
      type: Array,
      required: true
    },
    headersActivePeriods: {
      type: Array,
      required: true
    },
    moment: {
      type: Function,
      required: true
    },
    footerProps: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  methods: {
    emit (item, action) {
      this.$emit('action', { item, action })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
