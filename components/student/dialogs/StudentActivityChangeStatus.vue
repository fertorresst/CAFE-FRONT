<template>
  <v-dialog
    v-if="activityChangeStatus"
    v-model="show"
    max-width="850"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          ACTUALIZAR ESTADO DE LA ACTIVIDAD
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          />
        </h3>
      </v-card-text>

      <v-card-text
        class="text-left black--text mb-0 pb-0"
      >
        <div class="d-flex flex-row align-center justify-center mt-2">
          <v-stepper
            v-model="step"
            vertical
            tile
            elevation="0"
            class="rounded-xl"
          >
            <v-stepper-step :complete="step > 1" step="1" class="bg-blue" complete-icon="mdi-check white--text" color="bg-yellow black--text">
              <span class="white--text">INFORMACIÓN DE LA ACTIVIDAD</span>
              <small class="white--text subtitle">VERIFICA QUE LOS DATOS SEAN CORRECTOS</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card
                elevation="0"
              >
                <ActivityEditContent
                  class="mt-4"
                  :activity="activityChangeStatus"
                  :areas="areas"
                  :required-rule="requiredRule"
                  :date-end-rule="dateEndRule"
                  :source="'ActivityChangeStatusDialog'"
                />

                <strong>EVIDENCIAS: </strong>
                <v-carousel v-if="activityChangeStatus.evidenceLinks && activityChangeStatus.evidenceLinks.length">
                  <v-carousel-item
                    v-for="(item, i) in activityChangeStatus.evidenceLinks"
                    :key="i"
                    :src="getEvidenceUrl(item)"
                    reverse-transition="fade-transition"
                    transition="fade-transition"
                    contain
                  />
                </v-carousel>

                <v-card-actions
                  class="d-flex justify-center py-6"
                >
                  <v-btn
                    color="#fed55e"
                    rounded
                    elevation="0"
                    @click="nextStep()"
                  >
                    <strong>CONTINUAR</strong>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2" class="bg-blue" complete-icon="mdi-check white--text" color="bg-yellow black--text">
              <span class="white--text">ACTUALIZA EL ESTADO DE LA ACTIVIDAD</span>
              <small class="white--text subtitle">¿CUÁL ES EL NUEVO ESTADO DE LA ACTIVIDAD?</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card
                elevation="0"
              >
                <v-form
                  ref="activityForm"
                  v-model="validForm"
                  lazy-validation
                  class="text-center mt-8"
                >
                  <h3>
                    SELECCIONA UN ESTADO PARA LA ACTIVIDAD
                  </h3>
                  <v-select
                    v-model="newStatusActivity"
                    :rules="[requiredRule]"
                    :items="statusOptionsActivity"
                    item-text="text"
                    hide-selected
                    outlined
                    dense
                    required
                  >
                    <template #item="{ item }">
                      <v-list-item-icon>
                        <v-icon :color="item.color">
                          {{ item.icon }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content :class="`${item.color}--text`">
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                      </v-list-item-content>
                    </template>

                    <template #selection="{ item }">
                      <v-icon :color="item.color" class="mr-2">
                        {{ item.icon }}
                      </v-icon>

                      <span :class="`${item.color}--text`">
                        {{ item.text }}
                      </span>
                    </template>
                  </v-select>

                  <h3>
                    NUEVAS OBSERVACIONES
                  </h3>
                  <v-textarea
                    v-model="newObservations"
                    :rules="[requiredRule]"
                    auto-grow
                    rows="4"
                    flat
                    outlined
                    dense
                    type="text"
                    required
                  />
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
                    @click="updateActivity()"
                  >
                    <strong>ACTUALIZAR</strong>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper>
        </div>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center mt-0 pt-0 pb-6"
      >
        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="cancel()"
        >
          <strong class="text">CANCELAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ActivityEditContent from '../../activities/panelContents/ActivityEditContent'
export default {
  components: { ActivityEditContent },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    activityChangeStatus: {
      type: [Object, null],
      default: null,
      required: false
    },
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
    }
  },

  data () {
    return {
      show: this.value,
      step: 1,
      validForm: false,
      newStatusActivity: '',
      newObservations: '',
      statusOptionsContact: [
        { text: 'PENDIENTE', icon: 'mdi-alert-circle', color: 'grey' },
        { text: 'CONTACTADO', icon: 'mdi-progress-clock', color: 'warning' },
        { text: 'RESUELTO', icon: 'mdi-check-circle', color: 'success' },
        { text: 'CANCELADO', icon: 'mdi-close-circle', color: 'error' }
      ],
      statusOptionsActivity: [
        { text: 'ACTIVIDAD APROBADA', icon: 'mdi-check-circle', color: 'success' },
        { text: 'ACTIVIDAD RECHAZADA', icon: 'mdi-close-circle', color: 'error' }
      ]
    }
  },

  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    },
    activityChangeStatus: {
      handler (val) {
        if (val && val.status) {
          this.newStatusActivity = this.getStatusOptionByCode(val.status)
        } else {
          this.newStatusActivity = null
        }
      },
      immediate: true
    }
  },

  methods: {
    getStatusText (status) {
      const statusMap = {
        pending: 'PENDIENTE',
        in_progress: 'CONTACTADO',
        resolved: 'RESUELTO',
        cancelled: 'CANCELADO'
      }

      return statusMap[status] || status
    },

    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.$emit('action', { action: 'cancel' })
    },

    getBackendStatusCodeActivity (statusText) {
      const statusMap = {
        'SEGUIMOS EN CONTACTO': 'contacted',
        'ACTIVIDAD APROBADA': 'approval',
        'ACTIVIDAD RECHAZADA': 'rejected'
      }
      return statusMap[statusText] || 'error'
    },

    getStatusOptionByCode (code) {
      const map = {
        contacted: 'SEGUIMOS EN CONTACTO',
        approval: 'ACTIVIDAD APROBADA',
        rejected: 'ACTIVIDAD RECHAZADA'
      }
      const text = map[code]
      return this.statusOptionsActivity.find(opt => opt.text === text) || null
    },

    updateActivity () {
      const validateForm = this.$refs.activityForm.validate()

      if (validateForm) {
        const statusActivity = typeof this.newStatusActivity === 'object' ? this.newStatusActivity.text : this.newStatusActivity
        const statusForBackendActivity = this.getBackendStatusCodeActivity(statusActivity)

        const data = {
          activity: this.activityChangeStatus,
          activityId: this.activityChangeStatus.id,
          contactId: this.activityChangeStatus.contactId || false,
          observations: this.newObservations,
          status: statusForBackendActivity
        }
        this.$emit('action', { action: 'updateStatus', data })

        this.cancel()
      }
    },

    nextStep () {
      if (this.step < 2) {
        this.step++
      }
    },

    stepBack () {
      if (this.step > 1) {
        this.step--
      }
    },

    getEvidenceUrl (link) {
      return `http://localhost:5010${link}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
