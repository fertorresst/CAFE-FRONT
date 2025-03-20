<template>
  <v-dialog
    v-model="show"
    max-width="550"
    persistent
    style="overflow-y: hidden;"
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          DETALLES DEL PERIODO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          MOSTRANDO LOS DETALLES DEL PERIODO
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ periodToDetails.per_name }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text
        class="text-justify black--text"
      >
        <strong>ID DEL PERIODO: </strong>
        <span>{{ periodToDetails.per_id }}</span>

        <br>

        <strong>FECHA DE INICIO: </strong>
        <span>{{ moment(periodToDetails.per_date_start).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

        <br>

        <strong>FECHA DE FIN: </strong>
        <span>{{ moment(periodToDetails.per_date_end).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

        <br>

        <strong>EXCLUSIVO PARA EGRESADOS: </strong>
        <span>{{ periodToDetails.per_exclusive ? 'SÍ' : 'NO' }}</span>

        <br>

        <strong>ESTADO: </strong>
        <span>{{ status() }}</span>

        <br>
        <br>

        <strong>ID DEL ADMIN: </strong>
        <span>{{ periodToDetails.per_create_admin_id }}</span>

        <br>

        <strong>CREACIÓN: </strong>
        <span>{{ moment(periodToDetails.per_created_at).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

        <br>

        <strong>ÚLTIMA ACTUALIZACIÓN: </strong>
        <span>{{ moment(periodToDetails.per_updated_at).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

        <br>
        <br>

        <strong>NÚMERO DE SOLICITUDES: </strong>
        <span>{{ periodToDetails.total_records }}</span>

        <br>

        <strong>SOLICITUDES PENDIENTES DE REVISAR: </strong>
        <span>{{ periodToDetails.total_pending }}</span>

        <br>

        <strong>SOLICITUDES APROBADAS: </strong>
        <span>{{ periodToDetails.total_approved }}</span>

        <br>

        <strong>SOLICITUDES RECHAZADAS: </strong>
        <span>{{ periodToDetails.total_rejected }}</span>

        <br>

        <v-simple-table
          v-if="isDataLoaded"
          class="text-center mt-4 subtitle"
          dense
        >
          <template #default>
            <thead
              class="black--text"
            >
              <tr>
                <th class="text-center" />
                <th class="text-center">
                  DP
                </th>
                <th class="text-center">
                  RS
                </th>
                <th class="text-center">
                  CEE
                </th>
                <th class="text-center">
                  FCI
                </th>
                <th class="text-center">
                  AC
                </th>
                <th class="text-center">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="black--text text-left font-weight-bold">
                  INDIVIDUALES
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.dp.activities }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.rs.activities }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.cee.activities }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.fci.activities }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.ac.activities }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.total.activities }}
                </td>
              </tr>
              <tr>
                <td class="black--text text-left font-weight-bold">
                  COLECTIVAS
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.dp.collectives }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.rs.collectives }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.cee.collectives }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.fci.collectives }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.ac.collectives }}
                </td>
                <td class="black--text text-center">
                  {{ areaCounts.total.collectives }}
                </td>
              </tr>
              <tr class="blue lighten-5">
                <td class="black--text text-left font-weight-bold">
                  TOTAL
                </td>
                <td class="black--text text-center font-weight-bold">
                  {{ areaCounts.dp.total }}
                </td>
                <td class="black--text text-center font-weight-bold">
                  {{ areaCounts.rs.total }}
                </td>
                <td class="black--text text-center font-weight-bold">
                  {{ areaCounts.cee.total }}
                </td>
                <td class="black--text text-center font-weight-bold">
                  {{ areaCounts.fci.total }}
                </td>
                <td class="black--text text-center font-weight-bold">
                  {{ areaCounts.ac.total }}
                </td>
                <td class="black--text text-center font-weight-bold">
                  {{ areaCounts.total.total }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-skeleton-loader
          v-else
          type="table"
          class="mt-4"
        />
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pb-6"
      >
        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="close()"
        >
          <strong>CERRAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    periodToDetails: {
      type: Object,
      require: true,
      default: () => ({})
    },
    getAreaCounts: {
      type: Function,
      required: true
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true,
      areaCounts: {
        dp: { activities: 0, collectives: 0, total: 0 },
        rs: { activities: 0, collectives: 0, total: 0 },
        cee: { activities: 0, collectives: 0, total: 0 },
        fci: { activities: 0, collectives: 0, total: 0 },
        ac: { activities: 0, collectives: 0, total: 0 },
        total: { activities: 0, collectives: 0, total: 0 }
      }
    }
  },

  computed: {
    isDataLoaded () {
      if (this.areaCounts) {
        return true
      }
      return false
    }
  },

  async mounted () {
    try {
      const response = await this.getAreaCounts(this.periodToDetails.per_id)
      if (response && response.areaCounts) {
        this.areaCounts = response.areaCounts
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading area counts:', error)
    }
  },

  methods: {
    close () {
      this.$emit('action', { action: 'cancel' })
    },

    status () {
      if (this.periodToDetails.per_status === 'pending') {
        return 'PENDIENTE DE REVISIÓN'
      } else if (this.periodToDetails.per_status === 'active') {
        return 'ACTIVO'
      } else if (this.periodToDetails.per_status === 'ended') {
        return 'FINALIZADO'
      }
    }
  }
}
</script>

<style scoped>
/* Your component styles go here */
</style>
