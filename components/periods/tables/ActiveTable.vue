<template>
  <v-data-table
    :headers="headersActivePeriods"
    :items="activePeriods"
    class="elevation-0 mt-4 cursor-pointer"
    :footer-props="footerProps"
    @click:row="navigateToActivities"
  >
    <template #[`item.per_date_start`]="{ item }">
      {{ moment(item.per_date_start).format('DD MMM YY').toUpperCase() }}
    </template>

    <template #[`item.per_date_end`]="{ item }">
      {{ moment(item.per_date_end).format('DD MMM YY').toUpperCase() }}
    </template>

    <template #[`item.per_exclusive`]="{ item }">
      <v-icon
        :color="item.per_exclusive ? 'success' : 'error'"
      >
        {{ item.per_exclusive ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex flex-nowrap align-stretch justify-center" @click.stop>
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
      </div>
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
    },

    navigateToActivities (item) {
      this.$emit('navigate', {
        periodId: item.per_id,
        tableOrigin: 'active'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
