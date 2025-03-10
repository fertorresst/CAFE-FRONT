<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1>
        PERIODOS
      </h1>
    </v-row>

    <v-row align="center" justify="center">
      <v-btn
        elevation="0"
        class="rounded-pill my-6"
        color="#fed55e"
        @click="openNewPeriod()"
      >
        <strong>ABRIR NUEVO PERIODO</strong>
      </v-btn>
    </v-row>

    <v-row align="center" justify="center">
      <v-expansion-panels v-model="panel" focusable>
        <v-expansion-panel>
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>PERIODOS ACTIVOS</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5
              v-if="!activePeriods.length"
              class="subtitle mt-4"
            >
              NO HAY PERIODOS ACTIVOS.
            </h5>

            <active-table
              v-else
              :active-periods="activePeriods"
              :headers-active-periods="headersActivePeriods"
              :moment="moment"
              :footer-props="footerProps"
              @action="decoder"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>PERIODOS PENDIENTES DE REVISAR</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5
              v-if="!pendingPeriods.length"
              class="subtitle mt-4"
            >
              NO HAY PERIODOS PENDIENTES DE REVISAR.
            </h5>

            <pending-table
              v-else
              :pending-periods="pendingPeriods"
              :headers-pending-periods="headersPendingPeriods"
              :moment="moment"
              :footer-props="footerProps"
              @action="decoder"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>PERIODOS ANTERIORES</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5
              v-if="!endedPeriods.length"
              class="subtitle mt-4"
            >
              NO HAY PERIODOS ANTERIORES.
            </h5>

            <ended-periods
              v-else
              :ended-periods="endedPeriods"
              :headers-ended-periods="headersEndedPeriods"
              :moment="moment"
              :footer-props="footerProps"
              @action="decoder"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <new-period
      v-if="dialogNewPeriod"
      :date-start-rule="dateStartRule"
      :date-end-rule="dateEndRule"
      :required-rule="requiredRule"
      :date-range="dateRange"
      :min-date-start="minDateStart"
      :all-periods="allPeriods"
      :moment="moment"
      @action="decoder"
    />

    <delete-period
      v-if="dialogDeletePeriod"
      :period-to-delete="periodToDelete"
      :required-rule="requiredRule"
      :validate-password="validatePassword"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />

    <edit-period
      v-if="dialogEditPeriod"
      :all-periods="allPeriods"
      :period-to-edit="periodToEdit"
      :required-rule="requiredRule"
      :date-start-rule="dateStartRule"
      :date-end-rule="dateEndRule"
      :date-range="dateRange"
      :min-date-start="minDateStart"
      :validate-password="validatePassword"
      :mostrar-alerta="mostrarAlerta"
      :moment="moment"
      @action="decoder"
    />

    <change-pending-period
      v-if="dialogChangePendingPeriod"
      :period-to-end="periodToChangePending"
      :moment="moment"
      :required-rule="requiredRule"
      :validate-password="validatePassword"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />
  </v-col>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import ChangePendingPeriod from '../../components/periods/dialogs/ChangePendingPeriod'
import EditPeriod from '../../components/periods/dialogs/EditPeriod'
import DeletePeriod from '../../components/periods/dialogs/DeletePeriod'
import NewPeriod from '../../components/periods/dialogs/NewPeriod'
import EndedPeriods from '../../components/periods/tables/EndedPeriods'
import PendingTable from '../../components/periods/tables/PendingTable'
import ActiveTable from '../../components/periods/tables/ActiveTable'
moment.locale('es')

export default {
  components: { ChangePendingPeriod, EditPeriod, DeletePeriod, NewPeriod, EndedPeriods, PendingTable, ActiveTable },
  data () {
    return {
      moment,
      panel: 0,
      footerProps: {
        'items-per-page-text': 'Filas por página',
        'items-per-page-options': [5, 10, 15, 20, 25, 50, 100]
      },

      // DIALOG AGREGAR NUEVO PERIODO
      dialogNewPeriod: false,
      dateStartRule: (value) => {
        const today = moment().format('YYYY-MM-DD')
        return value >= today || 'LA FECHA DE INICIO DEBE SER IGUAL O MAYOR A LA FECHA DE HOY'
      },
      dateEndRule: (value, dateStart) => {
        return value > dateStart || 'LA FECHA DE FIN DEBE SER MAYOR A LA FECHA DE INICIO'
      },
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',
      dateRange: (v, dateStart, dateEnd) => {
        if (!dateStart || !dateEnd) {
          return true
        }

        const startDate = moment(dateStart)
        const endDate = moment(dateEnd)

        // Verificar si el rango de fechas se sobrepone con algún periodo existente
        const hasOverlap = this.allPeriods.some((period) => {
          const periodStart = moment(period.dateStart)
          const periodEnd = moment(period.dateEnd)

          return (
            (startDate.isBetween(periodStart, periodEnd, 'day', '[]') ||
            endDate.isBetween(periodStart, periodEnd, 'day', '[]')) &&
            period.status === 'active'
          )
        })

        if (hasOverlap && this.dialogNewPeriod) {
          return 'EL RANGO DE FECHAS SE SOBREPONE CON UN PERIODO EXISTENTE'
        }

        // Periodo Enero-Julio (meses 0-6)
        const isFirstPeriod = startDate.isBetween(
          moment(`${startDate.year()}-01-01`),
          moment(`${startDate.year()}-07-31`),
          'day',
          '[]'
        ) && endDate.isBetween(
          moment(`${endDate.year()}-01-01`),
          moment(`${endDate.year()}-07-31`),
          'day',
          '[]'
        )

        // Periodo Agosto-Diciembre (meses 7-11)
        const isSecondPeriod = startDate.isBetween(
          moment(`${startDate.year()}-08-01`),
          moment(`${startDate.year()}-12-31`),
          'day',
          '[]'
        ) && endDate.isBetween(
          moment(`${endDate.year()}-08-01`),
          moment(`${endDate.year()}-12-31`),
          'day',
          '[]'
        )

        return isFirstPeriod || isSecondPeriod || 'LAS FECHAS DEBEN ESTAR EN EL INTERVALO ENERO-JULIO O AGOSTO-DICIEMBRE'
      },
      minDateStart: new Date().toISOString().split('T')[0],

      // DIALOG ELIMINAR PERIODO
      dialogDeletePeriod: false,
      periodToDelete: null,

      // DIALOG EDITAR PERIODO
      dialogEditPeriod: false,
      periodToEdit: null,

      // DIALOG FINALIZAR PERIODO
      dialogChangePendingPeriod: false,
      periodToChangePending: null,

      // TODOS LOS PERIODOS
      allPeriods: [],

      // PERIODOS ACTIVOS
      headersActivePeriods: [
        { text: 'NOMBRE', align: 'center', value: 'id', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'dateStart', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'dateEnd', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'exclusive', sortable: false },
        { text: 'NO. SOLICITUDES', align: 'center', value: 'request', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      activePeriods: [],

      // PERIODOS PENDIENTES DE REVISAR
      headersPendingPeriods: [
        { text: 'NOMBRE', align: 'center', value: 'id', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'dateStart', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'dateEnd', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'exclusive', sortable: false },
        { text: 'SOLICITUDES', align: 'center', value: 'request', sortable: false },
        { text: 'APROBADAS', align: 'center', value: 'approval', sortable: false },
        { text: 'RECHAZADAS', align: 'center', value: 'rejected', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      pendingPeriods: [],

      // PERIODOS ANTERIORES
      headersEndedPeriods: [
        { text: 'NOMBRE', align: 'center', value: 'id', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'dateStart', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'dateEnd', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'exclusive', sortable: false },
        { text: 'NO. SOLICITUDES', align: 'center', value: 'request', sortable: false },
        { text: 'APROBADAS', align: 'center', value: 'approval', sortable: false },
        { text: 'RECHAZADAS', align: 'center', value: 'rejected', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      endedPeriods: []
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert
      // token: state => state.token
    })
  },

  watch: {
    showAlert () {}
  },

  mounted () {
    this.getAllPeriods()
  },

  methods: {
    mostrarAlerta (color, type, message) {
      this.$store.commit('modifyAlert', true)
      this.$store.commit('modifyColor', `${color} lighten-2`)
      this.$store.commit('modifyIcon', color === 'green' ? 'mdi-check-circle' : 'mdi-close-circle')
      this.$store.commit('modifyType', type)
      this.$store.commit('modifyText', message)
      setTimeout(() => {
        this.$store.commit('modifyAlert', false)
      }, 3000)
    },

    decoder (data) {
      if (data.action === 'cancel') {
        this.cancel()
      } else if (data.action === 'deleteTable') {
        this.deletePeriodDialog(data.item)
      } else if (data.action === 'editTable') {
        this.editPeriodDialog(data.item)
      } else if (data.action === 'finishTable') {
        this.closePeriodDialog(data.item)
      } else if (data.action === 'detailsTable') {
        this.infoPeriodDialog(data.item)
      } else if (data.action === 'closeTable') {
        this.closePeriodDialog(data.item)
      } else if (data.action === 'downloadTable') {
        this.downloadReport()
      } else if (data.action === 'createPeriod') {
        this.createPeriod(data.period)
      } else if (data.action === 'deletePeriod') {
        this.deletePeriod(data.id)
      } else if (data.action === 'updatePeriod') {
        this.editPeriod()
      } else if (data.action === 'changeStatus') {
        this.changeStatus(data)
      }
    },

    // VALIDAR CONTRASEÑA
    async validatePassword (password) {
      try {
        const url = '/validate-password'
        const data = {
          user: this.$store.state.user,
          password
        }
        const res = await this.$axios.post(url, data)

        if (res.data.success) {
          return res.data.success
        }

        this.mostrarAlerta('red', 'error', res.data.message)
        return false
      } catch (error) {
        this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL VALIDAR LA CONTRASEÑA')
        // eslint-disable-next-line no-console
        console.error('Error:', error)
        return false
      }
    },

    // LIMPIAR VARIABLES Y FORMULARIOS
    clean () {
      // FORMS
      if (this.$refs.form) {
        this.$refs.form.reset()
      }

      // DIALOGS
      this.dialogNewPeriod = false // Cerrar dialog de nuevo periodo
      this.dialogDeletePeriod = false // Cerrar dialog de eliminar periodo
      this.dialogEditPeriod = false // Cerrar dialog de editar periodo
      this.dialogChangePendingPeriod = false // Cerrar dialog de finalizar periodo

      // VARIABLES
      this.periodToDelete = null // Resetear periodo a eliminar
      this.periodToEdit = null // Resetear periodo a editar
      this.periodToChangePending = '' // Resetear periodo a finalizar
    },

    cancel () {
      this.clean()
    },

    async getAllPeriods () {
      const url = '/get-all-periods'
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.allPeriods = res.data.periods
            this.activePeriods = this.allPeriods.filter(period => period.status === 'active')
            this.pendingPeriods = this.allPeriods.filter(period => period.status === 'pending')
            this.endedPeriods = this.allPeriods.filter(period => period.status === 'ended')
            this.clean()
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL OBTENER LOS PERIODOS')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ getAllPeriods ~ e: ', e)
        })
    },

    // CREAR UN NUEVO PERIODO
    openNewPeriod () {
      this.dialogNewPeriod = true
    },

    async createPeriod (data) {
      const url = '/create-period'

      await this.$axios.post(url, data)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            setTimeout(() => {
              this.getAllPeriods()
            }, 1000)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL CREAR EL PERIODO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ createPeriod ~ error: ', e)
        })
    },

    // ELIMINAR PERIODO
    deletePeriodDialog (period) {
      this.periodToDelete = period
      this.dialogDeletePeriod = true
    },

    async deletePeriod (params) {
      const url = `/delete-period/${params}`
      await this.$axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            setTimeout(() => {
              this.getAllPeriods()
            }, 1000)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL ELIMINAR EL PERIODO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ deletePeriod ~ e: ', e)
        })
    },

    // EDITAR PERIODO
    editPeriodDialog (period) {
      this.periodToEdit = period
      this.dialogEditPeriod = true
    },

    async editPeriod (data) {
      const url = '/update-dates'

      await this.$axios.put(url, data)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            setTimeout(() => {
              this.getAllPeriods()
            }, 1000)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL EDITAR EL PERIODO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ editPeriod ~ e: ', e)
        })
    },

    // FINALIZAR PERIODO
    closePeriodDialog (period) {
      this.periodToChangePending = period
      this.dialogChangePendingPeriod = true
    },

    async changeStatus (data) {
      const url = '/update-status'
      await this.$axios.put(url, data)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            setTimeout(() => {
              this.getAllPeriods()
            }, 1000)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL FINALIZAR EL PERIODO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ changeStatus ~ e: ', e)
        })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
