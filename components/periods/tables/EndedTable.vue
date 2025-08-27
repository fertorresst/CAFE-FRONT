<template>
  <v-data-table
    :headers="headersEndedPeriods"
    :items="endedPeriods"
    class="elevation-0 mt-4 cursor-pointer"
    :footer-props="footerProps"
    @click:row="navigateToActivities"
  >
    <!-- Template para fechas -->
    <template #[`item.per_date_start`]="{ item }">
      {{ moment(item.per_date_start).format('DD MMM YY').toUpperCase() }}
    </template>

    <template #[`item.per_date_end`]="{ item }">
      {{ moment(item.per_date_end).format('DD MMM YY').toUpperCase() }}
    </template>

    <!-- Template para exclusivo -->
    <template #[`item.per_exclusive`]="{ item }">
      <v-icon
        :color="item.per_exclusive ? 'success' : 'error'"
      >
        {{ item.per_exclusive ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex flex-nowrap align-stretch justify-center" @click.stop>
        <v-tooltip color="info" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              color="info"
              v-bind="attrs"
              class="mr-1"
              v-on="on"
              @click="emit(item, 'detailsTable')"
            >
              mdi-information
            </v-icon>
          </template>
          <span>VER DETALLES</span>
        </v-tooltip>

        <!-- Nuevo botón para abrir el modal de reportes -->
        <v-tooltip color="green" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              color="green"
              v-bind="attrs"
              v-on="on"
              @click="emit(item, 'downloadReports')"
            >
              mdi-download-circle
            </v-icon>
          </template>
          <span>DESCARGAR REPORTES</span>
        </v-tooltip>
      </div>
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

  data () {
    return {
      reportDialog: false,
      selectedPeriod: null
    }
  },

  methods: {
    emit (item, action) {
      this.$emit('action', { item, action })
    },

    navigateToActivities (item) {
      this.$emit('navigate', {
        periodId: item.per_id,
        tableOrigin: 'ended'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
