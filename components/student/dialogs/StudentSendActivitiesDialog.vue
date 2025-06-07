<template>
  <v-dialog
    v-model="show"
    max-width="550"
    persistent
    style="overflow-y: hidden;"
  >
    <v-card
      elevation="0"
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          ENVIAR ACTIVIDADES
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <v-stepper
          v-model="step"
          vertical
          tile
          elevation="0"
          class="rounded-xl"
        >
          <v-stepper-step :complete="step > 1" step="1" class="bg-blue" complete-icon="mdi-check white--text" color="bg-yellow black--text">
            <span class="white--text">SELECCIONA UN PERIODO</span>
            <small class="white--text subtitle">ELIGE UN PERIODO ACTIVO</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card
              elevation="0"
            >
              <h3>SELECCIONA UN PERIODO</h3>
              <v-select
                v-model="period"
                class="mb-0 pb-0"
                :items="exclusive ? exclusiveActivePeriodsItems : activePeriodsItems"
                outlined
                dense
                required
              >
                <template #selection="{ item }">
                  <span>
                    {{ item.text.toUpperCase() }}
                  </span>
                </template>
                <template #item="{ item }">
                  <v-list-item-content class="text-center">
                    <v-list-item-title class="text-center">
                      {{ item.text.toUpperCase() }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <template #no-data>
                  <v-list-item>
                    <v-list-item-content ripple>
                      <v-list-item-title class="text-center">
                        NO HAY PERIODOS ACTIVOS
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-select>

              <v-checkbox
                v-model="exclusive"
                color="#07538a"
                label="PERIODOS SOLO PARA EGRESADOS"
                class="my-0 py-0"
                dense
              />
              <h5
                v-if="exclusive"
                class="text-left subtitle my-0 py-0"
              >
                *Solo los egresados podrán realizar solicitudes.
              </h5>

              <v-card-actions
                class="d-flex justify-center py-6"
              >
                <v-btn
                  :disabled="!period"
                  color="#fed55e"
                  rounded
                  elevation="0"
                  @click="step = 2"
                >
                  <strong>CONTINUAR</strong>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2" class="bg-blue" complete-icon="mdi-check white--text" color="bg-yellow black--text">
            <span class="white--text">REGISTRAR ACTIVIDAD</span>
            <small class="white--text subtitle">INGRESE LOS DATOS DE LA ACTIVIDAD</small>
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-card
              elevation="0"
            >
              <v-form
                ref="activityForm"
                v-model="validForm"
                lazy-validation
                class="mb-0 pb-0"
              >
                <h3>
                  NOMBRE DE LA ACTIVIDAD
                </h3>
                <v-text-field
                  v-model="currentActivityData.name"
                  flat
                  outlined
                  dense
                  type="text"
                  :rules="[requiredRule]"
                  required
                />

                <h3>
                  INSTITUCIÓN ORGANIZADORA
                </h3>
                <v-text-field
                  v-model="currentActivityData.institution"
                  flat
                  outlined
                  dense
                  type="text"
                  :rules="[requiredRule]"
                  required
                />

                <v-row class="my-0 py-0">
                  <v-col lg="6">
                    <h3>
                      FECHA DE INICIO
                    </h3>
                    <v-text-field
                      v-model="currentActivityData.dateStart"
                      flat
                      outlined
                      dense
                      type="date"
                      :rules="[requiredRule]"
                      :max="maxDate"
                      required
                    />
                  </v-col>
                  <v-col lg="6">
                    <h3>
                      FECHA DE TÉRMINO
                    </h3>
                    <v-text-field
                      v-model="currentActivityData.dateEnd"
                      flat
                      outlined
                      dense
                      type="date"
                      :rules="[
                        requiredRule,
                        v => dateEndRule(v, currentActivityData.dateStart)
                      ]"
                      :min="currentActivityData.dateStart"
                      :max="maxDate"
                      :disabled="!currentActivityData.dateStart"
                      required
                    />
                  </v-col>
                </v-row>

                <v-row class="my-0 py-0">
                  <v-col lg="6">
                    <h3>
                      HORAS
                    </h3>
                    <v-text-field
                      v-model="currentActivityData.hours"
                      flat
                      outlined
                      dense
                      type="number"
                      :rules="[requiredRule]"
                      :min="0"
                      required
                    />
                  </v-col>

                  <v-col lg="6">
                    <h3>
                      ÁREA
                    </h3>
                    <v-select
                      v-model="currentActivityData.area"
                      :items="areas"
                      flat
                      outlined
                      dense
                      type="text"
                      :rules="[requiredRule]"
                      required
                    />
                  </v-col>
                </v-row>

                <h3>
                  EVIDENCIAS
                </h3>
                <v-file-input
                  v-model="currentActivityData.evidence"
                  flat
                  outlined
                  dense
                  small-chips
                  type="file"
                  :rules="[requiredRule, filesLimitRule, filesSizeRule]"
                  accept=".jpg, .jpeg, .png, .webp"
                  required
                  show-size
                  multiple
                  :max-size="3 * 1024 * 1024"
                  :counter="2"
                />

                <h5
                  class="text-left subtitle my-0 py-0"
                >
                  *Subir evidencias en formato .jpg, .jpeg, .png o .webp. Máximo 2 archivos de 5 MB cada uno.
                </h5>
              </v-form>

              <v-card-actions
                class="d-flex justify-center py-6"
              >
                <v-btn
                  color="black"
                  rounded
                  text
                  @click="stepBack()"
                >
                  <span class="text">REGRESAR</span>
                </v-btn>

                <v-btn
                  color="#fed55e"
                  rounded
                  elevation="0"
                  :disabled="!currentActivityData.evidence"
                  @click="sendActivity()"
                >
                  <strong>ENVIAR</strong>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper>
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
    areas: {
      type: Array,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    },
    dateEndRule: {
      type: Function,
      required: true
    },
    filesLimitRule: {
      type: Function,
      required: true
    },
    mostrarAlerta: {
      type: Function,
      required: true
    },
    getSendActivities: {
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
      step: 1,
      exclusive: false,
      period: '',
      activePeriods: null,
      exclusiveActivePeriods: null,
      maxDate: this.moment().format('YYYY-MM-DD'),
      filesSizeRule: files =>
        !files ||
        files.every(file => file.size <= 3 * 1024 * 1024) ||
        'TAMAÑO MÁXIMO DE 3 MB POR ARCHIVO',

      activePeriodsItems: [],
      exclusiveActivePeriodsItems: [],

      // Datos para las actividades
      currentActivityData: {
        name: '',
        dateStart: '',
        dateEnd: '',
        hours: null,
        institution: '',
        area: '',
        evidence: null
      },
      validForm: false,
      loading: false
    }
  },

  computed: {
    formattedDate () {
      return this.currentActivityData.date ? this.formatDate(this.currentActivityData.date) : ''
    }
  },

  mounted () {
    this.getAllPeriods()
  },

  methods: {
    async getAllPeriods () {
      const url = '/periods/get-all-periods'
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            const today = this.moment().startOf('day')

            this.activePeriods = res.data.periods.filter(period => (
              period.per_status === 'active' &&
              this.moment(today).isBetween(period.per_date_start, period.per_date_end, null, '[]') &&
              period.per_exclusive === 0
            ))
            this.exclusiveActivePeriods = res.data.periods.filter(period => (
              period.per_status === 'active' &&
              this.moment(today).isBetween(period.per_date_start, period.per_date_end, null, '[]') &&
              period.per_exclusive === 1
            ))

            this.activePeriodsItems = this.activePeriods.map((period) => {
              return {
                text: period.per_name,
                value: period.per_id
              }
            })
            this.exclusiveActivePeriodsItems = this.exclusiveActivePeriods.map((period) => {
              return {
                text: period.per_name,
                value: period.per_id
              }
            })
          }
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log('🚀 ~ getAllPeriods ~ e: ', e)
        })
    },

    stepBack () {
      if (this.currentActivityData) {
        if (confirm('¿ESTÁS SEGURO DE QUE QUIERES REGRESAR? SE PERDERÁN LOS CAMBIOS REALIZADOS')) {
          this.step = 1
          this.currentActivityData = {
            name: '',
            dateStart: '',
            dateEnd: '',
            hours: null,
            institution: '',
            area: '',
            evidence: null
          }
          this.validForm = false
          this.$refs.activityForm.reset()
        }
      } else {
        this.step = 1
      }
    },

    close () {
      this.step = 1
      this.currentActivityData = {
        name: '',
        dateStart: '',
        dateEnd: '',
        hours: null,
        institution: '',
        area: '',
        evidence: null
      }
      this.validForm = false
      this.$refs.activityForm.reset()
      this.$emit('action', { action: 'close' })
    },

    formatDate (date) {
      return this.moment(date).format('DD/MM/YYYY')
    },

    async sendActivity () {
      try {
        // Validar el formulario
        if (!this.$refs.activityForm.validate()) {
          this.mostrarAlerta('red', 'error', 'ERROR AL VALIDAR EL FORMULARIO')
          return
        }
        // Preparar los datos para enviar
        const formData = new FormData()

        formData.append('periodId', this.period)
        formData.append('userId', this.$store.state.user.id)
        formData.append('name', this.currentActivityData.name)
        formData.append('institution', this.currentActivityData.institution)
        formData.append('dateStart', this.currentActivityData.dateStart)
        formData.append('dateEnd', this.currentActivityData.dateEnd)
        formData.append('hours', this.currentActivityData.hours)
        formData.append('area', this.currentActivityData.area)
        formData.append('status', 'pending')

        // Agregar cada archivo como files[]
        if (this.currentActivityData.evidence && this.currentActivityData.evidence.length) {
          for (const file of this.currentActivityData.evidence) {
            formData.append('files', file)
          }
        }

        // Realizar la petición para enviar las actividades
        const res = await this.$axios.post('/evidence/create-activity-with-evidence', formData)

        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.close()
          this.getSendActivities()
        } else {
          throw new Error(res.data.message || 'ERROR AL ENVIAR ACTIVIDAD')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ERROR AL ENVIAR ACTIVIDAD:', error)
        this.mostrarAlerta('red', 'error', error)
      }
    }
  }
}
</script>

<style scoped>
.subtitle {
  color: #666;
  font-size: 0.8rem;
}
</style>
