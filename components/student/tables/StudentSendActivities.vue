<template>
  <div>
    <v-data-table
      :headers="headersSendActivities"
      :items="sendActivities"
      class="elevation-0 mt-4 cursor-pointer"
      :footer-props="footerProps"
    >
      <template #[`item.name`]="{ item }">
        <strong>{{ item.name.toUpperCase() }}</strong>
      </template>
      <template #[`item.dateStart`]="{ item }">
        {{ moment(item.dateStart).format('DD MMM YY').toUpperCase() }}
      </template>

      <template #[`item.dateEnd`]="{ item }">
        {{ moment(item.dateEnd).format('DD MMM YY').toUpperCase() }}
      </template>

      <template #[`item.status`]="{ item }">
        <div class="text-center">
          <v-icon
            v-if="item.status === 'approval'"
            color="success"
            small
          >
            mdi-check-circle
          </v-icon>

          <v-icon
            v-else-if="item.status === 'rejected'"
            color="error"
            small
          >
            mdi-close-circle
          </v-icon>

          <v-icon
            v-else-if="item.status === 'contacted'"
            color="warning"
            small
          >
            mdi-progress-clock
          </v-icon>

          <v-icon
            v-else-if="item.status === 'pending'"
            color="grey"
            small
          >
            mdi-alert-circle
          </v-icon>
          <br>
          <strong
            :class="{
              'success--text': item.status === 'approval',
              'error--text': item.status === 'rejected',
              'warning--text': item.status === 'contacted',
              'grey--text': item.status === 'pending'
            }"
          >
            {{ getStatusText(item.status) }}
          </strong>
        </div>
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
                size="30"
                v-bind="attrs"
                v-on="on"
                @click="emit(item, 'activityInfoDialog')"
              >
                mdi-information
              </v-icon>
            </template>
            <span>VER DETALLES</span>
          </v-tooltip>

          <v-tooltip
            v-if="periodStatus === 'active'"
            color="warning"
            bottom
            class="px-4"
          >
            <template #activator="{ on, attrs }">
              <v-icon
                color="warning"
                size="30"
                v-bind="attrs"
                v-on="on"
                @click="emit(item, 'editTable')"
              >
                mdi-pencil-circle
              </v-icon>
            </template>
            <span>EDITAR ACTIVIDAD</span>
          </v-tooltip>

          <v-tooltip
            v-if="periodStatus === 'active'"
            color="error"
            bottom
          >
            <template #activator="{ on, attrs }">
              <v-icon
                color="error"
                size="30"
                v-bind="attrs"
                v-on="on"
                @click="emit(item, 'activityDeleteDialog')"
              >
                mdi-delete-circle
              </v-icon>
            </template>
            <span>ELIMINAR ACTIVIDAD</span>
          </v-tooltip>
        </div>
      </template>

      <template #no-data>
        <strong>
          NO HAY ACTIVIDADES ENVIADAS
        </strong>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    sendActivities: {
      type: Object,
      required: true,
      default: () => {}
    },
    periodStatus: {
      type: String,
      required: true
    },
    footerProps: {
      type: Object,
      required: true,
      default: () => {}
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      headersSendActivities: [
        { text: 'NOMBRE', value: 'name', align: 'start' },
        { text: 'FECHA INICIO', value: 'dateStart', align: 'start' },
        { text: 'FECHA FIN', value: 'dateEnd', align: 'start' },
        { text: 'AREA', value: 'area', align: 'center' },
        { text: 'HORAS', value: 'hours', align: 'center' },
        { text: 'ESTADO', value: 'status', align: 'center' },
        { text: 'ACCIONES', value: 'actions', align: 'center', sortable: false }
      ]
    }
  },

  methods: {
    getStatusText (status) {
      const statusMap = {
        pending: 'PENDIENTE',
        contacted: 'CONTACTADO',
        approval: 'APROBADA',
        rejected: 'RECHAZADA'
      }

      return statusMap[status] || status
    },

    emit (item, action) {
      this.$emit('action', { action, item })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
