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
          <v-expansion-panel-header class="bg-gold white--text">
            <h4>PERIODOS ACTIVOS</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5 class="mt-4">
              NO HAY PERIODOS ACTIVOS.
            </h5>

            <v-data-table
              :headers="headersActivePeriods"
              :items="activePeriods"
              class="elevation-0"
              :footer-props="footerProps"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="bg-gold white--text">
            <h4>PERIODOS PENDIENTES DE REVISAR</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5 class="mt-4">
              NO HAY PERIODOS PENDIENTES DE REVISAR.
            </h5>

            <v-data-table
              :headers="headersPendingPeriods"
              :items="pendingPeriods"
              class="elevation-0"
              :footer-props="footerProps"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="bg-gold white--text">
            <h4>PERIODOS ANTERIORES</h4>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <h5 class="mt-4">
              NO HAY PERIODOS ANTERIORES.
            </h5>

            <v-data-table
              :headers="headersPreviousPeriods"
              :items="previousPeriods"
              class="elevation-0"
              :footer-props="footerProps"
            >
              <template #[`items.actions`]="{ item }">
                <v-icon
                  small
                  color="red"
                  @click="deleteRouteDialog(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <v-dialog
      v-model="dialogNewPeriod"
      max-width="500"
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
            class="px-6"
          >
            <h3>
              NOMBRE DEL PERIODO
            </h3>
            <v-text-field
              v-model="periodName"
              :rules="[requiredRule, periodNameRule]"
              outlined
              dense
              required
            />

            <h3>FECHA DE INICIO</h3>
            <v-text-field
              v-model="dateStart"
              :rules="[requiredRule, dateStartRule]"
              :min="minDateStart"
              type="date"
              outlined
              dense
              required
            />

            <h3>FECHA DE FIN</h3>
            <v-text-field
              v-model="dateEnd"
              :rules="[requiredRule, dateEndRule]"
              :min="dateStart"
              type="date"
              outlined
              dense
              required
            />

            <v-checkbox
              v-model="exclusive"
              label="PERIODO SOLO PARA EGRESADOS"
            />
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
  </v-col>
</template>

<script>
export default {
  data () {
    return {
      panel: 0,
      footerProps: {
        'items-per-page-text': 'Filas por página',
        'items-per-page-options': [5, 10, 15, 20, 25, 50, 100]
      },

      // DIALOG AGREGAR NUEVO PERIODO
      dialogNewPeriod: false,
      validForm: false,
      periodName: '',
      exclusive: false,
      dateStart: '',
      dateEnd: '',
      minDateStart: new Date().toISOString().split('T')[0],
      dateStartRule: (value) => {
        const today = new Date().toISOString().split('T')[0]
        return value >= today || 'La fecha de inicio debe ser igual o mayor a la fecha de hoy'
      },
      dateEndRule: (value) => {
        return value > this.dateStart || 'La fecha de fin debe ser mayor a la fecha de inicio'
      },
      periodNameRule: value => !!value || 'Es necesario ingresar un nombre',
      requiredRule: value => !!value || 'Este campo es requerido',

      // PERIODOS ACTIVOS
      headersActivePeriods: [
        { text: 'NOMBRE', align: 'center', value: 'name', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'dateStart', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'dateEnd', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'exclusive', sortable: false },
        { text: 'NO. SOLICITUDES', align: 'center', value: 'request', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      activePeriods: [
        {
          name: 'PERIODO 1',
          dateStart: '2021-01-01',
          dateEnd: '2021-06-30',
          exclusive: 'SI',
          request: 10
        },
        {
          name: 'PERIODO 2',
          dateStart: '2021-07-01',
          dateEnd: '2021-12-31',
          exclusive: 'NO',
          request: 5
        }
      ],

      // PERIODOS PENDIENTES DE REVISAR
      headersPendingPeriods: [
        { text: 'NOMBRE', align: 'center', value: 'name', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'dateStart', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'dateEnd', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'exclusive', sortable: false },
        { text: 'NO. SOLICITUDES', align: 'center', value: 'request', sortable: false },
        { text: 'APROBADAS', align: 'center', value: 'approval', sortable: false },
        { text: 'RECHAZADAS', align: 'center', value: 'rejected', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      pendingPeriods: [
        {
          name: 'PERIODO 3',
          dateStart: '2022-01-01',
          dateEnd: '2022-06-30',
          exclusive: 'SI',
          request: 15,
          approval: 10,
          rejected: 5
        },
        {
          name: 'PERIODO 4',
          dateStart: '2022-07-01',
          dateEnd: '2022-12-31',
          exclusive: 'NO',
          request: 20,
          approval: 10,
          rejected: 5
        }
      ],

      // PERIODOS ANTERIORES
      headersPreviousPeriods: [
        { text: 'NOMBRE', align: 'center', value: 'name', sortable: false },
        { text: 'FECHA DE INICIO', align: 'center', value: 'dateStart', sortable: false },
        { text: 'FECHA DE FIN', align: 'center', value: 'dateEnd', sortable: false },
        { text: 'EXCLUSIVO', align: 'center', value: 'exclusive', sortable: false },
        { text: 'NO. SOLICITUDES', align: 'center', value: 'request', sortable: false },
        { text: 'APROBADAS', align: 'center', value: 'approval', sortable: false },
        { text: 'RECHAZADAS', align: 'center', value: 'rejected', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      previousPeriods: [
        {
          name: 'PERIODO 5',
          dateStart: '2020-01-01',
          dateEnd: '2020-06-30',
          exclusive: 'SI',
          request: 15,
          approval: 10,
          rejected: 5,
          actions: ''
        },
        {
          name: 'PERIODO 6',
          dateStart: '2020-07-01',
          dateEnd: '2020-12-31',
          exclusive: 'NO',
          request: 20,
          approval: 10,
          rejected: 5
        }
      ]
    }
  },

  methods: {
    cancel () {
      this.$refs.form.reset()
      this.dialogNewPeriod = false
    },

    openNewPeriod () {
      this.dialogNewPeriod = true
    },

    createPeriod () {
      this.validForm = this.$refs.form.validate()
      if (this.validForm) {
        console.log('CREAR PERIODO')
        this.dialogNewPeriod = false
      }
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
