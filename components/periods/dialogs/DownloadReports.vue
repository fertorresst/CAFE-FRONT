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
          DESCARGAR REPORTES
        </h2>
      </v-card-text>

      <template v-if="periodToDownloadReports && Object.keys(periodToDownloadReports).length">
        <v-card-text class="py-3">
          <h3 class="text-center subtitle black--text">
            REPORTES DEL PERIODO:
            <br>
            <strong
              class="text-left subtitle mt-4"
              style="color: #07538a"
            >
              {{ (periodToDownloadReports.per_name || '').toUpperCase() }}
            </strong>
          </h3>
        </v-card-text>

        <v-card-text class="text-justify black--text">
          <v-row align="center" justify="center" class="text-center mt-4">
            <strong>DESCARGAR REPORTE DE HORAS TOTALES DE LOS ALUMNOS DIVIDIDOS POR AREA</strong>
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-btn
                color="#fed55e"
                rounded
                elevation="0"
                class="mx-2"
                @click="emit('downloadPDFTable', periodToDownloadReports)"
              >
                <v-icon>mdi-file-pdf-box</v-icon>
                <strong>DESCARGAR PDF</strong>
              </v-btn>
              <v-btn
                color="#fed55e"
                rounded
                elevation="0"
                class="mx-2"
                @click="emit('downloadExcelTable', periodToDownloadReports)"
              >
                <v-icon>mdi-file-excel-box</v-icon>
                <strong>DESCARGAR EXCEL</strong>
              </v-btn>
            </v-col>
          </v-row>

          <!-- Separador visual -->
          <v-row align="center" justify="center" class="my-4">
            <v-col cols="12" class="d-flex align-center">
              <v-divider class="flex-grow-1 black" />
              <span class="mx-4 font-weight-bold black--text">ó</span>
              <v-divider class="flex-grow-1 black" />
            </v-col>
          </v-row>

          <v-row align="center" justify="center" class="text-center mb-4">
            <v-col cols="12">
              <strong>DESCARGAR REPORTE DE TODAS LAS ACTIVIDADES ENVIADAS POR LOS ALUMNOS EN EL PERIODO DE UNA CARRERA ESPECÍFICA</strong>
            </v-col>
            <v-col cols="12" md="6">
              <h3>SEDE</h3>
              <v-select
                v-model="sede"
                :items="sedesItems"
                :rules="[requiredRule]"
                outlined
                dense
                :disabled="false"
                required
                class="mb-2"
                style="width: 100%;"
              />
            </v-col>
            <v-col cols="12" md="6">
              <h3>CARRERA</h3>
              <v-select
                v-model="career"
                :items="sede === 'SALAMANCA' ? careerItems.salamanca : careerItems.yuriria"
                item-text="text"
                item-value="value"
                :rules="[requiredRule]"
                outlined
                dense
                :disabled="!sede"
                required
                class="mb-2"
                style="width: 100%;"
              />
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                color="#fed55e"
                rounded
                elevation="0"
                :disabled="!sede || !career"
                @click="emit('downloadCareerTable', { ...periodToDownloadReports, sede, career })"
              >
                <v-icon>mdi-file-pdf-box</v-icon>
                <strong>DESCARGAR PDF</strong>
              </v-btn>
            </v-col>
          </v-row>

          <!-- Separador visual -->
          <v-row align="center" justify="center" class="my-4">
            <v-col cols="12" class="d-flex align-center">
              <v-divider class="flex-grow-1 black" />
              <span class="mx-4 font-weight-bold black--text">ó</span>
              <v-divider class="flex-grow-1 black" />
            </v-col>
          </v-row>

          <v-row align="center" justify="center" class="text-center mb-4">
            <v-col cols="12">
              <strong>DESCARGAR REPORTE DE TODAS LAS ACTIVIDADES ENVIADAS POR LOS ALUMNOS EN EL PERIODO</strong>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                color="#fed55e"
                rounded
                elevation="0"
                @click="emit('downloadAllActivitiesReportPDF', periodToDownloadReports)"
              >
                <v-icon>mdi-file-pdf-box</v-icon>
                <strong>DESCARGAR PDF</strong>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </template>

      <v-card-actions class="d-flex justify-center pb-6">
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
    value: {
      type: Boolean,
      default: false
    },
    periodToDownloadReports: {
      type: Object,
      require: true,
      default: () => ({})
    },
    requiredRule: {
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
      show: this.value,

      sedesItems: ['SALAMANCA', 'YURIRIA'],

      careerItems: {
        salamanca: [
          { value: 'IS75LI0103', text: 'LICENCIATURA EN INGENIERÍA MECÁNICA' },
          { value: 'IS75LI0203', text: 'LICENCIATURA EN INGENIERÍA ELÉCTRICA' },
          { value: 'IS75LI0303', text: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA' },
          { value: 'IS75LI0403', text: 'LICENCIATURA EN INGENIERÍA EN MECATRÓNICA' },
          { value: 'IS75LI0502', text: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES' },
          { value: 'IS75LI0602', text: 'LICENCIATURA EN GESTIÓN EMPRESARIAL' },
          { value: 'IS75LI0702', text: 'LICENCIATURA EN ARTES DIGITALES' },
          { value: 'IS75LI0801', text: 'LICENCIATURA EN INGENIERÍA DE DATOS E INTELIGENCIA ARTIFICIAL' }
        ],
        yuriria: [
          { value: 'IS75LI03Y3', text: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA' },
          { value: 'IS75LI05Y2', text: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES' },
          { value: 'IS75LI06Y2', text: 'LICENCIATURA EN GESTIÓN EMPRESARIAL' },
          { value: 'IS75LI08Y2', text: 'LICENCIATURA EN ENSEÑANZA DEL INGLÉS' }
        ]
      },
      sede: '',
      career: ''
    }
  },

  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    }
  },

  methods: {
    close () {
      this.sede = ''
      this.career = ''
      this.$emit('action', { action: 'cancel' })
    },

    emit (action, item) {
      this.$emit('action', { item, action })
    }
  }
}
</script>

<style scoped>
</style>
