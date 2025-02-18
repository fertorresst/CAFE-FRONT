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
              v-if="activePeriods.length === 0"
              class="subtitle mt-4"
            >
              NO HAY PERIODOS ACTIVOS.
            </h5>

            <v-data-table
              v-else
              :headers="headersActivePeriods"
              :items="activePeriods"
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
                  color="error"
                  bottom
                >
                  <template #activator="{ on, attrs }">
                    <v-icon
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="deletePeriodDialog(item)"
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
                      @click="editPeriodDialog(item)"
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
                      @click="closePeriodDialog(item)"
                    >
                      mdi-calendar-check
                    </v-icon>
                  </template>
                  <span>FINALIZAR PERIODO</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>PERIODOS PENDIENTES DE REVISAR</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5
              v-if="pendingPeriods"
              class="subtitle mt-4"
            >
              NO HAY PERIODOS PENDIENTES DE REVISAR.
            </h5>

            <v-data-table
              v-else
              :headers="headersPendingPeriods"
              :items="pendingPeriods"
              class="elevation-0"
              :footer-props="footerProps"
            >
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
                      @click="infoPeriodDialog(item)"
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
                      @click="closePeriodDialog(item)"
                    >
                      mdi-check-bold
                    </v-icon>
                  </template>
                  <span>FINALIZAR REVISIÓN</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>PERIODOS ANTERIORES</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5
              v-if="endedPeriods"
              class="subtitle mt-4"
            >
              NO HAY PERIODOS ANTERIORES.
            </h5>

            <v-data-table
              v-else
              :headers="headersEndedPeriods"
              :items="endedPeriods"
              class="elevation-0"
              :footer-props="footerProps"
            >
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
                      @click="infoPeriodDialog(item)"
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
                      @click="downloadReportDialog(item)"
                    >
                      mdi-download
                    </v-icon>
                  </template>
                  <span>DESCARGAR INFORME</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <v-dialog
      v-model="dialogNewPeriod"
      max-width="400"
      persistent
    >
      <v-card
        align="center"
        justify="center"
        class="rounded-xl"
      >
        <v-card-text class="bg-blue white--text py-4">
          <h2>
            AGREGAR NUEVO PERIODO
          </h2>
        </v-card-text>

        <v-card-text class="py-3">
          <v-form
            ref="form"
            v-model="validForm"
            lazy-validation
            class="px-6 black--text"
          >
            <h3>FECHA DE INICIO</h3>
            <v-text-field
              v-model="dateStart"
              :rules="[requiredRule, dateStartRule, dateRange]"
              :min="minDateStart"
              type="date"
              outlined
              dense
              required
            />

            <h3>FECHA DE FIN</h3>
            <v-text-field
              v-model="dateEnd"
              :rules="[requiredRule, dateEndRule, dateRange]"
              :min="dateStart"
              type="date"
              outlined
              dense
              required
            />

            <v-checkbox
              v-model="exclusive"
              color="#07538a"
              label="EXCLUSIVO PARA EGRESADOS"
              dense
            />
            <h5
              class="text-left subtitle"
            >
              *Si el periodo es exclusivo, solo los egresados podrán realizar solicitudes.
            </h5>

            <h3
              class="text-left subtitle mt-4"
              style="color: #07538a"
            >
              ID DEL PERIODO: <strong>{{ periodId }}</strong>
            </h3>
          </v-form>
        </v-card-text>

        <v-card-actions
          class="d-flex justify-center pb-6"
        >
          <v-btn
            color="black"
            rounded
            text
            @click="cancel()"
          >
            <span class="text">CANCELAR</span>
          </v-btn>
          <v-btn
            color="#fed55e"
            rounded
            elevation="0"
            @click="createPeriod()"
          >
            <strong>CREAR PERIODO</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogDeletePeriod"
      max-width="400"
      persistent
    >
      <v-card
        align="center"
        justify="center"
        class="rounded-xl"
      >
        <v-card-text class="bg-blue white--text py-4">
          <h2>
            ELIMINAR PERIODO PERIODO
          </h2>
        </v-card-text>

        <v-card-text class="py-3">
          <h3
            class="text-left subtitle black--text"
          >
            ¿Estás seguro de que deseas eliminar este periodo?
            <strong
              class="text-left subtitle mt-4"
              style="color: #07538a"
            >
              {{ periodToDelete.id }}
            </strong>
          </h3>

          <v-form
            ref="form"
            v-model="validForm"
            lazy-validation
            class="pt-6 black--text"
          >
            <h3>INTRODUCE TU CONTRASEÑA</h3>
            <v-text-field
              v-model="password"
              :rules="[requiredRule]"
              type="password"
              outlined
              dense
              required
            />
          </v-form>
          <h3
            class="text-left subtitle black--text"
          >
            Esta acción no se puede deshacer.
          </h3>
        </v-card-text>

        <v-card-actions
          class="d-flex justify-center pb-6"
        >
          <v-btn
            color="black"
            rounded
            text
            @click="cancel()"
          >
            <span class="text">CANCELAR</span>
          </v-btn>
          <v-btn
            color="#fed55e"
            rounded
            elevation="0"
            @click="deletePeriod()"
          >
            <strong>ELIMINAR</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogEditPeriod"
      max-width="400"
      persistent
    >
      <v-card
        align="center"
        justify="center"
        class="rounded-xl"
      >
        <v-card-text class="bg-blue white--text py-4">
          <h2>
            EDITAR PERIODO
          </h2>
        </v-card-text>

        <v-card-text class="py-3">
          <h3
            class="text-justify subtitle black--text"
          >
            El siguiente periodo será editado:
            <strong
              class="text-left subtitle mt-4"
              style="color: #07538a"
            >
              {{ periodToEdit.id }}
            </strong>
          </h3>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-form
            ref="form"
            v-model="validForm"
            lazy-validation
            class="px-6 black--text"
          >
            <h3>FECHA DE INICIO</h3>
            <v-text-field
              v-model="periodToEditDateStart"
              :rules="[requiredRule, dateStartRule, dateRange]"
              :min="minDateStart"
              type="date"
              outlined
              dense
              required
            />

            <h3>FECHA DE FIN</h3>
            <v-text-field
              v-model="periodToEditDateEnd"
              :rules="[requiredRule, dateEndRule, dateRange]"
              :min="periodToEditDateStart"
              type="date"
              outlined
              dense
              required
            />
            <h3>INTRODUCE TU CONTRASEÑA</h3>
            <v-text-field
              v-model="password"
              :rules="[requiredRule]"
              type="password"
              outlined
              dense
              required
            />
          </v-form>
        </v-card-text>

        <v-card-text>
          <h3
            class="text-justify subtitle black--text"
          >
            Si desea hacer exclusivo el periodo tendrá que crear uno nuevo.
          </h3>
        </v-card-text>

        <v-card-actions
          class="d-flex justify-center pb-6"
        >
          <v-btn
            color="black"
            rounded
            text
            @click="cancel()"
          >
            <span class="text">CANCELAR</span>
          </v-btn>
          <v-btn
            color="#fed55e"
            rounded
            elevation="0"
            @click="editPeriod()"
          >
            <strong>ACTUALIZAR</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
moment.locale('es')

export default {
  data () {
    return {
      moment, // Agregamos moment al data para usarlo en el template
      panel: 0,
      footerProps: {
        'items-per-page-text': 'Filas por página',
        'items-per-page-options': [5, 10, 15, 20, 25, 50, 100]
      },

      // DIALOG AGREGAR NUEVO PERIODO
      dialogNewPeriod: false,
      validForm: false,
      periodId: '',
      exclusive: false,
      dateStart: '',
      dateEnd: '',
      minDateStart: new Date().toISOString().split('T')[0],
      dateRange: (v) => {
        if (!this.dateStart || !this.dateEnd) {
          return true
        }

        const startDate = moment(this.dateStart)
        const endDate = moment(this.dateEnd)

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
      dateStartRule: (value) => {
        const today = new Date().toISOString().split('T')[0]
        return value >= today || 'LA FECHA DE INICIO DEBE SER IGUAL O MAYOR A LA FECHA DE HOY'
      },
      dateEndRule: (value) => {
        return value > this.dateStart || 'LA FECHA DE FIN DEBE SER MAYOR A LA FECHA DE INICIO'
      },
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',

      // DIALOG ELIMINAR PERIODO
      dialogDeletePeriod: false,
      periodToDelete: {},
      password: '',

      // DIALOG EDITAR PERIODO
      dialogEditPeriod: false,
      periodToEdit: {},
      periodToEditId: '',
      periodToEditDateStart: '',
      periodToEditDateEnd: '',

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
        { text: 'NOMBRE', align: 'center', value: 'name', sortable: false },
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
        { text: 'NOMBRE', align: 'center', value: 'name', sortable: false },
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
    dateStart: {
      handler (newValue) {
        if (newValue) {
          this.updatePeriodId()
        }
      }
    },
    exclusive: {
      handler () {
        this.updatePeriodId()
      }
    },
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

      // VARIABLES
      this.validForm = false // Resetear validación de formulario
      this.periodId = '' // Resetear ID del periodo
      this.exclusive = false // Resetear exclusividad
      this.dateStart = '' // Resetear fecha de inicio
      this.dateEnd = '' // Resetear fecha de fin

      this.password = '' // Resetear contraseña
      this.periodToDelete = {} // Resetear periodo a eliminar

      this.periodToEdit = {} // Resetear periodo a editar
      this.periodToEditId = '' // Resetear ID del periodo a editar
      this.periodToEditDateStart = '' // Resetear fecha de inicio del periodo a editar
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

    async createPeriod () {
      this.validForm = this.$refs.form.validate()
      if (this.validForm) {
        const data = {
          id: this.periodId,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
          exclusive: this.exclusive,
          request: 0,
          approval: 0,
          rejected: 0,
          status: 'active'
        }
        const url = '/create-period'

        await this.$axios.post(url, data)
          .then((res) => {
            if (res.data.success) {
              this.mostrarAlerta('green', 'success', res.data.message)
              setTimeout(() => {
                this.getAllPeriods()
              }, 1500)
            } else {
              this.mostrarAlerta('red', 'error', res.data.message)
            }
          })
          .catch((e) => {
            this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL CREAR EL PERIODO')
            // eslint-disable-next-line no-console
            console.log('🚀 ~ createPeriod ~ error: ', e)
          })
      }
    },

    getLastConsecutive () {
      if (!this.allPeriods || this.allPeriods.length === 0) {
        return 1
      }

      const consecutive = this.allPeriods.map((period) => {
        const match = period.id.match(/-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })

      return Math.max(...consecutive) + 1
    },

    updatePeriodId () {
      if (!this.dateStart) { return }

      const date = moment(this.dateStart)
      const month = date.month()
      const year = date.format('YY')
      const consecutive = this.getLastConsecutive()

      // Determinar el prefijo según el periodo
      let prefix = ''
      if (month >= 0 && month <= 6) {
        prefix = 'EJ'
      } else if (month >= 7 && month <= 11) {
        prefix = 'AD'
      }

      // Construir el ID base
      let newId = `${prefix}${year}-${consecutive}`

      // Agregar o quitar la E según exclusividad
      if (this.exclusive) {
        newId += 'E'
      }

      this.periodId = newId
    },

    // ELIMINAR PERIODO
    deletePeriodDialog (period) {
      this.periodToDelete = period
      this.dialogDeletePeriod = true
    },

    async deletePeriod () {
      if (!this.password) {
        this.mostrarAlerta('red', 'error', 'DEBES INTRODUCIR TU CONTRASEÑA')
        return
      }

      const validForm = this.$refs.form.validate()

      // const validPassword = await this.$axios.post('/validate-password', { password: this.password })
      //   .then((res) => {
      //     return res.data.success
      //   })
      //   .catch((e) => {
      //     this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL VALIDAR LA CONTRASEÑA')
      //     // eslint-disable-next-line no-console
      //     console.log('🚀 ~ deletePeriod ~ e: ', e)
      //   })

      const validPassword = true

      if (validForm && validPassword) {
        const params = this.periodToDelete.id
        const url = `/delete-period/${params}`
        await this.$axios.delete(url)
          .then((res) => {
            if (res.data.success) {
              this.mostrarAlerta('green', 'success', res.data.message)
              setTimeout(() => {
                this.getAllPeriods()
              }, 1500)
            } else {
              this.mostrarAlerta('red', 'error', res.data.message)
            }
          })
          .catch((e) => {
            this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL ELIMINAR EL PERIODO')
            // eslint-disable-next-line no-console
            console.log('🚀 ~ deletePeriod ~ e: ', e)
          })
      }
    },

    // EDITAR PERIODO
    editPeriodDialog (period) {
      this.periodToEdit = period
      this.dialogEditPeriod = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table {
  border-radius: 5px !important;
  overflow: hidden !important;
  font-family: 'Gandhi Sans', sans-serif !important;
}

::v-deep .v-data-table-header {
  background-color: #a3915f !important;
  border-radius: 20px !important;
  font-family: 'Novecento Wide', sans-serif !important;
}

::v-deep .v-data-table-header th {
  color: white !important;
  font-family: 'Novecento Wide', sans-serif !important;
  font-size: 14px !important;
}

::v-deep .v-data-table-header th.sortable {
  color: white !important;
}

::v-deep .v-expansion-panel-header__icon .v-icon {
  color: white !important;
}

::v-deep .v-data-table tbody td {
  font-family: 'Gandhi Sans', sans-serif !important;
}
</style>
