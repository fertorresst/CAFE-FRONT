<template>
  <v-dialog
    v-model="show"
    max-width="750"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          ACTUALIZAR ESTADO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          INFORMACIÓN DE LA PETICIÓN DE CONTACTO
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ contactToUpdate.id }} | {{ contactToUpdate.user.name.toUpperCase() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text
        class="text-left black--text mb-0 pb-0"
      >
        <div class="text-left black--text">
          <v-row>
            <v-col cols="5">
              <strong>NUA:</strong>
              <span>{{ contactToUpdate.user.nua }}</span>

              <br>

              <strong>NOMBRE:</strong>
              <span>{{ contactToUpdate.user.name.toUpperCase() }}</span>

              <br>

              <strong>CORREO:</strong>
              <span>{{ contactToUpdate.user.email }}</span>

              <br>

              <strong>TELÉFONO:</strong>
              <span>{{ formatPhone(contactToUpdate.user.phone) }}</span>
            </v-col>

            <v-col cols="7">
              <strong>NOMBRE DE LA ACTIVIDAD:</strong>
              <span>{{ contactToUpdate.relatedItem.name.toUpperCase() }}</span>

              <br>

              <strong>MOTIVO DEL CONTACTO:</strong>
              <span>{{ contactToUpdate.description.toUpperCase() }}</span>

              <br>

              <strong>ÚLTIMAS OBSERVACIONES:</strong>
              <span v-if="contactToUpdate.observations">({{ contactToUpdate.admin.id }}) {{ contactToUpdate.observations.toUpperCase() }}</span>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-row align-center justify-center mt-4">
          <v-stepper
            v-model="step"
            vertical
            tile
            elevation="0"
            class="rounded-xl mt-4"
            max-width="450"
          >
            <v-stepper-step :complete="step > 1" step="1" class="bg-blue" complete-icon="mdi-check white--text" color="bg-yellow black--text">
              <span class="white--text">ACTUALIZA EL CONTACTO</span>
              <small class="white--text subtitle">¿QUE SUCEDIÓ CON EL CONTACTO?</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card
                elevation="0"
              >
                <v-form
                  ref="form"
                  v-model="validForm"
                  lazy-validation
                  class="pt-6 black--text text-center"
                >
                  <h3>OBSERVACIONES</h3>
                  <v-textarea
                    v-model="newObservations"
                    :rules="[requiredRule]"
                    auto-grow
                    rows="2"
                    flat
                    outlined
                    dense
                    type="text"
                    required
                  />

                  <h3>SELECCIONA UN ESTADO PARA ESTE CONTACTO</h3>
                  <v-select
                    v-model="newStatusContact"
                    :rules="[requiredRule]"
                    :items="statusOptionsContact"
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
                </v-form>

                <v-card-actions
                  class="d-flex justify-center py-6"
                >
                  <v-btn
                    :disabled="!newObservations || !newStatusContact"
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
              <span class="white--text">ACTUALIZA LA ACTIVIDAD</span>
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
                    SELECCIONA UN ESTADO PARA LA ACTIVIDAD DEL CONTACTO
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
                    @click="updateContact()"
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
          color="black"
          rounded
          text
          @click="cancel()"
        >
          <span class="text">CANCELAR</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    contactToUpdate: {
      type: Object,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true,
      step: 1,
      validForm: false,
      newStatusContact: '',
      newStatusActivity: '',
      newObservations: '',
      statusOptionsContact: [
        { text: 'PENDIENTE', icon: 'mdi-alert-circle', color: 'grey' },
        { text: 'CONTACTADO', icon: 'mdi-progress-clock', color: 'warning' },
        { text: 'RESUELTO', icon: 'mdi-check-circle', color: 'success' },
        { text: 'CANCELADO', icon: 'mdi-close-circle', color: 'error' }
      ],
      statusOptionsActivity: [
        { text: 'SEGUIMOS EN CONTACTO', icon: 'mdi-progress-clock', color: 'warning' },
        { text: 'ACTIVIDAD APROBADA', icon: 'mdi-check-circle', color: 'success' },
        { text: 'ACTIVIDAD RECHAZADA', icon: 'mdi-close-circle', color: 'error' }
      ]
    }
  },

  methods: {
    formatPhone (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    },

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
      this.password = ''
      this.newStatusContact = ''
      this.$emit('action', { action: 'cancel' })
    },

    getBackendStatusCodeContact (statusText) {
      const statusMap = {
        PENDIENTE: 'pending',
        CONTACTADO: 'in_progress',
        RESUELTO: 'resolved',
        CANCELADO: 'cancelled'
      }
      return statusMap[statusText] || 'pending'
    },

    getBackendStatusCodeActivity (statusText) {
      const statusMap = {
        'SEGUIMOS EN CONTACTO': 'contacted',
        'ACTIVIDAD APROBADA': 'approval',
        'ACTIVIDAD RECHAZADA': 'rejected'
      }
      return statusMap[statusText] || 'error'
    },

    updateContact () {
      const validateForm = this.$refs.form.validate()

      if (validateForm) {
        const idContact = this.contactToUpdate.id
        const idActivity = this.contactToUpdate.relatedItem.id
        const statusContact = typeof this.newStatusContact === 'object' ? this.newStatusContact.text : this.newStatusContact
        const statusForBackendContact = this.getBackendStatusCodeContact(statusContact)

        const statusActivity = typeof this.newStatusActivity === 'object' ? this.newStatusActivity.text : this.newStatusActivity
        const statusForBackendActivity = this.getBackendStatusCodeActivity(statusActivity)

        const data = {
          idContact,
          idActivity,
          observations: this.newObservations,
          statusContact: statusForBackendContact,
          statusActivity: statusForBackendActivity
        }
        this.$emit('action', { action: 'updateContact', data })

        this.cancel()
      }
    },

    stepBack () {
      if (this.step > 1) {
        this.step--
        this.newStatusActivity = ''
        if (this.$refs.activityForm) {
          this.validForm = false
          this.$refs.activityForm.reset()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
