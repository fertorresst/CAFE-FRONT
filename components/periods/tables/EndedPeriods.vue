<template>
  <v-data-table
    :headers="headersEndedPeriods"
    :items="endedPeriods"
    class="elevation-0 mt-4"
    :footer-props="footerProps"
  >
    <!-- Template para fechas -->
    <template #[`item.dateStart`]="{ item }">
      {{ moment(item.dateStart).format('DD MMM YY').toUpperCase() }}
    </template>

    <template #[`item.dateEnd`]="{ item }">
      {{ moment(item.dateEnd).format('DD MMM YY').toUpperCase() }}
    </template>

    <!-- Template para exclusivo -->
    <template #[`item.exclusive`]="{ item }">
      <v-icon
        :color="item.exclusive ? 'success' : 'error'"
      >
        {{ item.exclusive ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </template>

    <template #[`item.actions`]="{ item }">
      <v-tooltip
        color="info"
        bottom
      >
        <template #activator="{ on, attrs }">
          <v-icon
            color="info"
            v-bind="attrs"
            v-on="on"
            @click="emit(item, 'detailsTable')"
          >
            mdi-information
          </v-icon>
        </template>
        <span>VER DETALLES</span>
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
            @click="emit(item, 'downloadTable')"
          >
            mdi-download
          </v-icon>
        </template>
        <span>DESCARGAR REPORTE</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    endedPeriods: {
      type: Array,
      required: true
    },
    headersEndedPeriods: {
      type: Array,
      required: true
    },
    moment: {
      type: Function,
      required: true
    },
    footerProps: {
      type: Object,
      required: true
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
