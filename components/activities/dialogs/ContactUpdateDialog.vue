<template>
  <v-dialog
    v-model="show"
    max-width="550"
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
          <strong>NUA:</strong>
          <span>{{ contactToUpdate.user.nua }}</span>

          <br>
          <strong>CORREO:</strong>
          <span>{{ contactToUpdate.user.email }}</span>

          <br>

          <strong>TELÉFONO:</strong>
          <span>{{ formatPhone(contactToUpdate.user.phone) }}</span>

          <br>
          <br>

          <strong>TIPO DE ACTIVIDAD:</strong>
          <span>{{ getActivityType(contactToUpdate.relatedItem.type) }}</span>

          <br>

          <strong>NOMBRE DE LA ACTIVIDAD:</strong>
          <span>{{ contactToUpdate.relatedItem.name.toUpperCase() }}</span>

          <br>

          <strong v-if="contactToUpdate.relatedItem.type === 'activity'">DESCRIPCIÓN DE LA ACTIVIDAD:</strong>
          <span v-if="contactToUpdate.relatedItem.type === 'activity'">{{ contactToDelete.relatedItem.description.toUpperCase() }}</span>

          <br>

          <strong>MOTIVO DEL CONTACTO:</strong>
          <span>{{ contactToUpdate.description.toUpperCase() }}</span>

          <br>

          <strong>ÚLTIMAS OBSERVACIONES:</strong>
          <span v-if="contactToUpdate.observations">{{ contactToUpdate.observations.toUpperCase() }}</span>
        </div>

        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="pt-6 black--text text-center"
        >
          <h3>NUEVAS OBSERVACIONES</h3>
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

          <h3>SELECCIONA UN ESTADO</h3>
          <v-combobox
            v-model="newStatus"
            :rules="[requiredRule]"
            :items="statusOptions"
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
          </v-combobox>

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
    },
    validatePassword: {
      type: Function,
      required: true
    },
    mostrarAlerta: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true,
      validForm: false,
      password: '',
      newStatus: '',
      newObservations: '',
      statusOptions: [
        { text: 'PENDIENTE', icon: 'mdi-alert-circle', color: 'grey' },
        { text: 'CONTACTADO', icon: 'mdi-progress-clock', color: 'warning' },
        { text: 'RESUELTO', icon: 'mdi-check-circle', color: 'success' },
        { text: 'CANCELADO', icon: 'mdi-close-circle', color: 'error' }
      ]
    }
  },

  mounted () {
    const currentStatus = this.getStatusText(this.contactToUpdate.status)
    this.newStatus = this.statusOptions.find(option => option.text === currentStatus) || this.statusOptions[0]
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

    getActivityType (type) {
      const typeMap = {
        collective: 'ACTIVIDAD COLECTIVA',
        activity: 'ACTIVIDAD INDIVIDUAL'
      }

      return typeMap[type] || type
    },

    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.password = ''
      this.newStatus = ''
      this.$emit('action', { action: 'cancel' })
    },

    getBackendStatusCode (statusText) {
      const statusMap = {
        PENDIENTE: 'pending',
        CONTACTADO: 'in_progress',
        RESUELTO: 'resolved',
        CANCELADO: 'cancelled'
      }
      return statusMap[statusText] || 'pending'
    },

    async updateContact () {
      if (!this.password) {
        this.mostrarAlerta('red', 'error', 'DEBES INTRODUCIR TU CONTRASEÑA')
        return
      }

      const validateForm = this.$refs.form.validate()
      const validatePassword = await this.validatePassword(this.password)

      if (validateForm && validatePassword) {
        const id = this.contactToUpdate.id
        const status = typeof this.newStatus === 'object' ? this.newStatus.text : this.newStatus
        const statusForBackend = this.getBackendStatusCode(status)

        const data = {
          id,
          observations: this.newObservations,
          status: statusForBackend
        }
        this.$emit('action', { action: 'updateContact', data })

        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
