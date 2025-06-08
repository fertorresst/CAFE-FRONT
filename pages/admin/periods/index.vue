<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1 class="my-5">
        DASHBOARD DE PERIODOS
      </h1>
    </v-row>

    <v-row align="center" justify="center">
      <v-btn
        v-if="isSuperadmin || isAdmin"
        elevation="0"
        class="rounded-pill mb-4"
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
              :headers-active-periods="filteredHeadersActivePeriods"
              :moment="moment"
              :footer-props="footerProps"
              @action="decoder"
              @navigate="navigateToActivities"
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
              :headers-pending-periods="filteredHeadersPendingPeriods"
              :moment="moment"
              :footer-props="footerProps"
              @action="decoder"
              @navigate="navigateToActivities"
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

            <ended-table
              v-else
              :ended-periods="endedPeriods"
              :headers-ended-periods="filteredHeadersEndedPeriods"
              :moment="moment"
              :footer-props="footerProps"
              @action="decoder"
              @navigate="navigateToActivities"
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
      :admin-id="adminId"
      :moment="moment"
      @action="decoder"
    />

    <delete-period
      v-if="dialogDeletePeriod"
      :period-to-delete="periodToDelete"
      :required-rule="requiredRule"
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
      :mostrar-alerta="mostrarAlerta"
      :moment="moment"
      @action="decoder"
    />

    <change-status
      v-if="dialogChangeStatus"
      :period-to-change-status="periodToChangeStatus"
      :new-status="newStatus"
      :text-new-status="textNewStatus"
      :title-new-status="titleNewStatus"
      :moment="moment"
      :required-rule="requiredRule"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />

    <details-period
      v-if="dialogDetailsPeriod"
      :period-to-details="periodToDetails"
      :get-area-counts="getAreaCounts"
      :moment="moment"
      @action="decoder"
    />
  </v-col>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import * as XLSX from 'xlsx-js-style'
import { saveAs } from 'file-saver'

import DetailsPeriod from '../../../components/periods/dialogs/DetailsPeriod'
import ChangeStatus from '../../../components/periods/dialogs/ChangeStatus'
import EditPeriod from '../../../components/periods/dialogs/EditPeriod'
import DeletePeriod from '../../../components/periods/dialogs/DeletePeriod'
import NewPeriod from '../../../components/periods/dialogs/NewPeriod'
import EndedTable from '../../../components/periods/tables/EndedTable'
import PendingTable from '../../../components/periods/tables/PendingTable'
import ActiveTable from '../../../components/periods/tables/ActiveTable'

let JSPDF = null
let autoTable = null

moment.locale('es')

export default {
  components: {
    DetailsPeriod,
    ChangeStatus,
    EditPeriod,
    DeletePeriod,
    NewPeriod,
    EndedTable,
    PendingTable,
    ActiveTable
  },

  layout: 'admin',

  middleware: 'auth-admin',

  data () {
    return {
      moment,
      panel: 0,
      footerProps: {
        'items-per-page-options': [5, 10, 15, 20],
        'items-per-page-text': 'FILAS POR PÁGINA',
        'show-current-page': true,
        'show-first-last-page': true,
        'show-page-size-options': true,
        'show-rows-per-page': true,
        'show-select': true
      },

      // REGLAS
      dateStartRule: (value) => {
        const today = moment().format('YYYY-MM-DD')
        return value >= today || 'LA FECHA DE INICIO DEBE SER IGUAL O MAYOR A LA FECHA DE HOY'
      },
      dateEndRule: (value, dateStart) => {
        return value > dateStart || 'LA FECHA DE FIN DEBE SER MAYOR A LA FECHA DE INICIO'
      },
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',
      dateRange: (v, dateStart, dateEnd, exclusive) => {
        if (!dateStart || !dateEnd) {
          return true
        }

        const startDate = moment(dateStart)
        const endDate = moment(dateEnd)

        // 1. Validar solapamiento solo con periodos del mismo tipo
        const hasOverlap = this.allPeriods.some((period) => {
          // Solo comparar con periodos del mismo tipo (exclusivo u ordinario)
          if (!!period.per_exclusive !== !!exclusive) { return false }

          const periodStart = moment(period.dateStart || period.per_date_start)
          const periodEnd = moment(period.dateEnd || period.per_date_end)

          return (
            (startDate.isBetween(periodStart, periodEnd, 'day', '[]') ||
              endDate.isBetween(periodStart, periodEnd, 'day', '[]')) &&
            period.per_status === 'active'
          )
        })

        if (hasOverlap) {
          return 'EL RANGO DE FECHAS SE SOBREPONE CON UN PERIODO EXISTENTE DEL MISMO TIPO'
        }

        // 2. Validar rango Enero-Julio o Agosto-Diciembre
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
      minDateStart: moment().format('YYYY-MM-DD'),

      // DIALOG AGREGAR NUEVO PERIODO
      dialogNewPeriod: false,
      adminId: 1,

      // DIALOG ELIMINAR PERIODO
      dialogDeletePeriod: false,
      periodToDelete: null,

      // DIALOG EDITAR PERIODO
      dialogEditPeriod: false,
      periodToEdit: null,

      // DIALOG FINALIZAR PERIODO
      dialogChangeStatus: false,
      periodToChangeStatus: null,

      // DIALOG DETALLES DEL PERIODO
      dialogDetailsPeriod: false,
      periodToDetails: null,

      // DIALOG CAMBIAR ESTATUS
      newStatus: '',
      textNewStatus: '',
      titleNewStatus: '',

      // TODOS LOS PERIODOS
      allPeriods: [],

      // PERIODOS ACTIVOS
      headersActivePeriods: [
        { text: 'ID', align: 'center', value: 'per_id', sortable: false },
        { text: 'NOMBRE', align: 'center', value: 'per_name', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'per_date_start', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'per_date_end', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'per_exclusive', sortable: false },
        { text: 'SOLICITUDES', align: 'center', value: 'total_records', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      activePeriods: [],

      // PERIODOS PENDIENTES DE REVISAR
      headersPendingPeriods: [
        { text: 'ID', align: 'center', value: 'per_id', sortable: false },
        { text: 'NOMBRE', align: 'center', value: 'per_name', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'per_date_start', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'per_date_end', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'per_exclusive', sortable: false },
        { text: 'SOLICITUDES', align: 'center', value: 'total_records', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      pendingPeriods: [],

      // PERIODOS ANTERIORES
      headersEndedPeriods: [
        { text: 'ID', align: 'center', value: 'per_id', sortable: false },
        { text: 'NOMBRE', align: 'center', value: 'per_name', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'per_date_start', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'per_date_end', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'per_exclusive', sortable: false },
        { text: 'SOLICITUDES', align: 'center', value: 'total_records', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      endedPeriods: []
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert
    }),
    isSuperadmin () {
      return this.$store.state.admin.role === 'superadmin'
    },
    isAdmin () {
      return this.$store.state.admin.role === 'admin'
    },
    isValidador () {
      return this.$store.state.admin.role === 'validador'
    },
    isConsulta () {
      return this.$store.state.admin.role === 'consulta'
    },
    filteredHeadersActivePeriods () {
      // Solo superadmin y admin ven acciones
      if (this.isSuperadmin || this.isAdmin) {
        return this.headersActivePeriods
      }
      return this.headersActivePeriods.filter(h => h.value !== 'actions')
    },
    filteredHeadersPendingPeriods () {
      if (this.isSuperadmin || this.isAdmin) {
        return this.headersPendingPeriods
      }
      return this.headersPendingPeriods.filter(h => h.value !== 'actions')
    },
    filteredHeadersEndedPeriods () {
      if (this.isSuperadmin || this.isAdmin) {
        return this.headersEndedPeriods
      }
      return this.headersEndedPeriods.filter(h => h.value !== 'actions')
    }
  },

  watch: {
    showAlert () {}
  },

  mounted () {
    this.getAllPeriods()

    // Importa jsPDF y autoTable solo en el cliente
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      const jsPDF = require('jspdf')
      JSPDF = jsPDF.jsPDF
      autoTable = require('jspdf-autotable').default
    }
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

    // EMITS DE LOS COMPONENTES
    decoder (data) {
      console.log('🚀 ~ decoder ~ data:', data)
      switch (data.action) {
        case 'cancel':
          this.cancel()
          break
        case 'deleteTable':
          this.deletePeriodDialog(data.item)
          break
        case 'editTable':
          this.editPeriodDialog(data.item)
          break
        case 'finishTable':
          this.changeStatusDialog(data)
          break
        case 'detailsTable':
          this.infoPeriodDialog(data.item)
          break
        case 'closeTable':
          this.changeStatusDialog(data)
          break
        case 'downloadExcelTable':
          this.downloadExcelReport(data.item)
          break
        case 'downloadPDFTable':
          this.downloadPDFReport(data.item)
          break
        case 'createPeriod':
          this.createPeriod(data.period)
          break
        case 'deletePeriod':
          this.deletePeriod(data.id)
          break
        case 'updatePeriod':
          this.editPeriod(data.data)
          break
        case 'changeStatus':
          this.changeStatus(data.data)
          break
        default:
          break
      }
    },

    navigateToActivities (data) {
      this.$router.push({
        path: '/admin/periods/activities',
        query: {
          periodId: data.periodId,
          tableOrigin: data.tableOrigin
        }
      })
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
      this.dialogChangeStatus = false // Cerrar dialog de finalizar periodo
      this.dialogDetailsPeriod = false // Cerrar dialog de detalles del periodo

      // VARIABLES
      this.periodToDelete = null // Resetear periodo a eliminar
      this.periodToEdit = null // Resetear periodo a editar
      this.periodToChangeStatus = '' // Resetear periodo a finalizar
      this.periodToDetails = null // Resetear periodo a ver detalles
    },

    cancel () {
      this.clean()
    },

    async getAllPeriods () {
      const url = '/periods/get-all-periods'
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.allPeriods = res.data.periods
            this.activePeriods = this.allPeriods.filter(period => period.per_status === 'active')
            this.pendingPeriods = this.allPeriods.filter(period => period.per_status === 'pending')
            this.endedPeriods = this.allPeriods.filter(period => period.per_status === 'ended')
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
      const url = '/periods/create-period'

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
          console.error('🚀 ~ createPeriod ~ error: ', e)
        })
    },

    // ELIMINAR PERIODO
    deletePeriodDialog (period) {
      this.periodToDelete = period
      this.dialogDeletePeriod = true
    },

    async deletePeriod (params) {
      const url = `/periods/delete-period/${params}`
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
      const url = '/periods/update-dates'

      await this.$axios.patch(url, data)
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
    changeStatusDialog (data) {
      if (data.action === 'finishTable') {
        this.newStatus = 'pending'
        this.textNewStatus = 'FINALIZAR'
        this.titleNewStatus = 'FINALIZAR EL PERIODO'
      } else if (data.action === 'closeTable') {
        this.newStatus = 'ended'
        this.textNewStatus = 'FINALIZAR LA REVISIÓN de'
        this.titleNewStatus = 'FINALIZAR LA REVISIÓN DEL PERIODO'
      }
      this.periodToChangeStatus = data.item
      this.dialogChangeStatus = true
    },

    async changeStatus (data) {
      const url = '/periods/update-status'
      await this.$axios.patch(url, data)
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
    },

    // DETALLES DEL PERIODO
    infoPeriodDialog (period) {
      this.periodToDetails = period
      this.dialogDetailsPeriod = true
    },

    async getAreaCounts (params) {
      try {
        const url = `/periods/get-area-counts/${params}`
        const res = await this.$axios.get(url)

        if (res.data.success) {
          return res.data.data
        }

        this.mostrarAlerta('red', 'error', res.data.message)
      } catch (error) {
        this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL OBTENER LOS DETALLES DEL PERIODO')
        // eslint-disable-next-line no-console
        console.error('ERROR:', error)
        return false
      }
    },

    // DESCARGAR REPORTE EN EXCEL
    async downloadExcelReport (period) {
      try {
        const res = await this.$axios.get(`/periods/final-report/${period.per_id}`)
        if (res.data.success) {
          this.generateExcelReport(res.data.report)
        } else {
          this.mostrarAlerta('red', 'error', 'NO SE PUDO OBTENER LA INFORMACIÓN DEL REPORTE.')
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL DESCARGAR EL REPORTE.')
      }
    },

    generateExcelReport (report) {
      const { period, students } = report
      const sheetData = []
      const merges = []
      const goldFill = { fill: { patternType: 'solid', fgColor: { rgb: 'FFC4BD97' } } }

      // Formatea fechas
      const fechaInicio = period.per_date_start ? this.moment(period.per_date_start).format('DD/MM/YYYY') : ''
      const fechaFin = period.per_date_end ? this.moment(period.per_date_end).format('DD/MM/YYYY') : ''
      const exclusivo = period.per_exclusive ? 'SI' : 'NO'

      // Encabezado del periodo (combinado A1:D1, centrado y dorado)
      sheetData.push([
        { v: `PERIODO ${period.per_name}` || '', s: { alignment: { horizontal: 'center' }, ...goldFill } }, '', '', ''
      ])
      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } })

      // Fila de títulos (centrado, sin color)
      sheetData.push([
        { v: 'INICIO', s: { alignment: { horizontal: 'center' }, ...goldFill } },
        '',
        { v: 'TÉRMINO', s: { alignment: { horizontal: 'center' }, ...goldFill } },
        { v: '¿EXCLUSIVO?', s: { alignment: { horizontal: 'center' }, ...goldFill } }
      ])
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 1 } })

      // Fila de datos (centrado y dorado)
      sheetData.push([
        { v: fechaInicio, s: { alignment: { horizontal: 'center' }, ...goldFill } },
        '',
        { v: fechaFin, s: { alignment: { horizontal: 'center' }, ...goldFill } },
        { v: exclusivo, s: { alignment: { horizontal: 'center' }, ...goldFill } }
      ])
      merges.push({ s: { r: 2, c: 0 }, e: { r: 2, c: 1 } })

      sheetData.push([]) // Fila vacía

      let row = sheetData.length

      students.forEach((alum) => {
        // Color amarillo
        const yellowFill = { fill: { patternType: 'solid', fgColor: { rgb: 'FFFED55E' } } }
        const blueFill = { fill: { patternType: 'solid', fgColor: { rgb: 'FF49E8FD' } } }
        // Fila 1: NUA | NOMBRE(S) | APELLIDO PATERNO | APELLIDO MATERNO
        sheetData.push([
          { v: alum.use_nua, s: { alignment: { horizontal: 'left' }, ...yellowFill } },
          { v: alum.use_name.toUpperCase(), s: { alignment: { horizontal: 'left' }, ...yellowFill } },
          { v: alum.use_last_name.toUpperCase(), s: { alignment: { horizontal: 'left' }, ...yellowFill } },
          { v: alum.use_second_last_name.toUpperCase() || '', s: { alignment: { horizontal: 'left' }, ...yellowFill } }
        ])
        row++

        // Fila 2: CORREO (A-C combinadas) | TELÉFONO (D)
        sheetData.push([
          { v: alum.use_email, s: yellowFill },
          '',
          '',
          { v: alum.use_phone, s: yellowFill }
        ])
        merges.push({ s: { r: row, c: 0 }, e: { r: row, c: 2 } })
        row++

        // Fila 3: SEDE (A-B combinadas) | CARRERA NOMBRE COMPLETO (C-D combinadas)
        sheetData.push([
          { v: alum.use_sede, s: yellowFill },
          '',
          { v: alum.career_full_name, s: yellowFill },
          ''
        ])
        merges.push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } })
        merges.push({ s: { r: row, c: 2 }, e: { r: row, c: 3 } })
        row++

        // Horas por área (solo el valor a la izquierda)
        const areaHours = { DP: 0, RS: 0, CEE: 0, FCI: 0, AC: 0 }
        let totalHoras = 0
        alum.activities.forEach((act) => {
          if (areaHours[act.act_area] !== undefined) {
            areaHours[act.act_area] += act.act_hours
            totalHoras += act.act_hours
          }
        })

        sheetData.push(['', 'DP', { v: areaHours.DP, s: { alignment: { horizontal: 'left' }, ...blueFill } }])
        row++
        sheetData.push(['', 'RS', { v: areaHours.RS, s: { alignment: { horizontal: 'left' }, ...blueFill } }])
        row++
        sheetData.push(['', 'CEE', { v: areaHours.CEE, s: { alignment: { horizontal: 'left' }, ...blueFill } }])
        row++
        sheetData.push(['', 'FCI', { v: areaHours.FCI, s: { alignment: { horizontal: 'left' }, ...blueFill } }])
        row++
        sheetData.push(['', 'AC', { v: areaHours.AC, s: { alignment: { horizontal: 'left' }, ...blueFill } }])
        row++
        sheetData.push(['', 'TOTAL', { v: totalHoras, s: { alignment: { horizontal: 'left' }, ...blueFill } }])
        row++
        sheetData.push([]) // Fila vacía entre alumnos
        row++
      })

      // Genera el archivo Excel
      const ws = XLSX.utils.aoa_to_sheet(sheetData)
      ws['!merges'] = merges
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte')

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `Reporte_${period.per_name}.xlsx`)
    },

    // DESCARGAR REPORTE EN PDF
    async downloadPDFReport (period) {
      try {
        const res = await this.$axios.get(`/periods/final-report/${period.per_id}`)
        if (res.data.success) {
          this.exportPDFReport(res.data.report)
        } else {
          this.mostrarAlerta('red', 'error', 'NO SE PUDO OBTENER LA INFORMACIÓN DEL REPORTE.')
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL DESCARGAR EL REPORTE.')
      }
    },

    exportPDFReport (report) {
      // Verifica que estás en el cliente
      if (!process.client) {
        console.error('PDF export can only run on client-side')
        return
      }

      const { period, students } = report
      const doc = new JSPDF()
      const fechaInicio = period.per_date_start ? this.moment(period.per_date_start).format('DD/MM/YYYY') : ''
      const fechaFin = period.per_date_end ? this.moment(period.per_date_end).format('DD/MM/YYYY') : ''
      const exclusivo = period.per_exclusive ? 'SI' : 'NO'

      // Encabezado del periodo
      doc.setFontSize(14)
      doc.text(`PERIODO: ${period.per_name || ''}`, 14, 15)
      doc.setFontSize(10)
      doc.text(`INICIO: ${fechaInicio}    TÉRMINO: ${fechaFin}    ¿EXCLUSIVO?: ${exclusivo}`, 14, 22)

      let startY = 30

      students.forEach((alum, idx) => {
        // Datos del alumno
        doc.setFillColor(73, 232, 253) // Amarillo
        doc.setDrawColor(0)
        doc.rect(14, startY, 182, 8, 'F')
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0)
        doc.text(
          `${alum.use_nua}   ${alum.use_name.toUpperCase()}   ${alum.use_last_name.toUpperCase()}   ${alum.use_second_last_name ? alum.use_second_last_name.toUpperCase() : ''}`,
          16, startY + 6
        )

        startY += 10

        // Correo y teléfono
        doc.setFillColor(73, 232, 253)
        doc.rect(14, startY, 136, 8, 'F')
        doc.rect(150, startY, 46, 8, 'F')
        doc.text(`${alum.use_email}`, 16, startY + 6)
        doc.text(`${alum.use_phone}`, 152, startY + 6)

        startY += 10

        // Sede y carrera
        doc.setFillColor(73, 232, 253)
        doc.rect(14, startY, 60, 8, 'F')
        doc.rect(74, startY, 122, 8, 'F')
        doc.text(`${alum.use_sede}`, 16, startY + 6)
        doc.text(`${alum.career_full_name}`, 76, startY + 6)

        startY += 12

        // Horas por área
        const areaHours = { DP: 0, RS: 0, CEE: 0, FCI: 0, AC: 0 }
        let totalHoras = 0
        alum.activities.forEach((act) => {
          if (areaHours[act.act_area] !== undefined) {
            areaHours[act.act_area] += act.act_hours
            totalHoras += act.act_hours
          }
        })

        // Tabla de horas
        autoTable(doc, {
          startY,
          head: [['ÁREA', 'HORAS']],
          body: [
            ['DP', areaHours.DP],
            ['RS', areaHours.RS],
            ['CEE', areaHours.CEE],
            ['FCI', areaHours.FCI],
            ['AC', areaHours.AC],
            ['TOTAL', totalHoras]
          ],
          theme: 'grid',
          styles: { halign: 'left', fillColor: [254, 213, 94] },
          headStyles: { fillColor: [73, 232, 253], textColor: 0 },
          margin: { left: 14, right: 14 }
        })

        startY = doc.lastAutoTable.finalY + 10

        // Salto de página si es necesario
        if (startY > 250 && idx < students.length - 1) {
          doc.addPage()
          startY = 15
        }
      })

      doc.save(`Reporte_${period.per_name}.pdf`)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
