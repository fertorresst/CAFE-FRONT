<template>
  <div>
    <v-data-table
      :headers="headersAllActivities"
      :items="allActivities"
      class="elevation-0 mt-4 cursor-pointer"
      :footer-props="footerProps"
    >
      <template #[`item.periodName`]="{ item }">
        <strong>{{ item.periodName.toUpperCase() }}</strong>
      </template>

      <template #[`item.name`]="{ item }">
        {{ item.name.toUpperCase() }}
      </template>

      <template #[`item.updatedAt`]="{ item }">
        <strong v-if="item.status !== 'pending'">
          {{ moment(item.updatedAt).format('DD MMM YY').toUpperCase() }}
        </strong>
        <strong v-else>
          -- --- ----
        </strong>
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
                @click="emit(item, 'activityChangeStatusDialog')"
              >
                mdi-pencil-circle
              </v-icon>
            </template>
            <span>CAMBIAR ESTADO</span>
          </v-tooltip>
        </div>
      </template>

      <template #no-data>
        <strong>
          AUN NO HAY ACTIVIDADES REGISTRADAS PARA ESTE ALUMNO.
        </strong>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    allActivities: {
      type: Array,
      required: true
    },
    footerProps: {
      type: Object,
      default: () => ({}),
      required: true
    },
    moment: {
      type: Function,
      default: () => require('moment'),
      required: true
    }
  },

  data () {
    return {
      headersAllActivities: [
        { text: 'ID', value: 'id', align: 'center', sortable: true },
        { text: 'PERIODO', value: 'periodName', align: 'center', sortable: true },
        { text: 'ACTIVIDAD', value: 'name', align: 'center', sortable: false },
        { text: 'HORAS', value: 'hours', align: 'center', sortable: false },
        { text: 'ÁREA', value: 'area', align: 'center', sortable: true },
        { text: 'ESTADO', value: 'status', align: 'center', sortable: true },
        { text: 'REVISIÓN', value: 'updatedAt', align: 'center', sortable: true },
        { text: 'ACCIONES', value: 'actions', align: 'center', sortable: false }
      ]
    }
  },

  methods: {
    getStatusText (status) {
      const statusTexts = {
        approval: 'APROBADA',
        rejected: 'RECHAZADA',
        contacted: 'EN CONTACTO',
        pending: 'PENDIENTE'
      }
      return statusTexts[status] || 'DESCONOCIDO'
    },

    emit (item, event) {
      this.$emit(event, item)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
