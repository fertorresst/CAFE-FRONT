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
          DETALLES DEL CONTACTO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          MOSTRANDO LOS DETALLES DE LA PETICIÓN DE CONTACTO
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ contactToInfo.id }} |
            {{ contactToInfo.description.toUpperCase() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text
        class="text-left black--text"
      >
        <strong>NOMBRE DEL ALUMNO:</strong>
        <span>{{ contactToInfo.user.name.toUpperCase() }}</span>

        <br>

        <strong>NUA:</strong>
        <span>{{ contactToInfo.user.nua }}</span>

        <br>
        <strong>CORREO:</strong>
        <span>{{ contactToInfo.user.email }}</span>

        <br>

        <strong>TELÉFONO:</strong>
        <span>{{ formatPhone(contactToInfo.user.phone) }}</span>

        <br>
        <br>

        <strong>ID DE LA ACTIVIDAD:</strong>
        <span>{{ contactToInfo.relatedItem.id }}</span>

        <br>

        <strong>NOMBRE DE LA ACTIVIDAD:</strong>
        <span>{{ contactToInfo.relatedItem.name.toUpperCase() }}</span>

        <br>

        <strong>MOTIVO DEL CONTACTO:</strong>
        <span>{{ contactToInfo.description.toUpperCase() }}</span>

        <br>
        <br>

        <strong>ESTADO DEL CONTACTO:</strong>
        <v-icon
          v-if="contactToInfo.status === 'resolved'"
          color="success"
          class="mr-1"
          small
        >
          mdi-check-circle
        </v-icon>

        <v-icon
          v-else-if="contactToInfo.status === 'cancelled'"
          color="error"
          class="mr-1"
          small
        >
          mdi-close-circle
        </v-icon>

        <v-icon
          v-else-if="contactToInfo.status === 'in_progress'"
          color="warning"
          dense
        >
          mdi-progress-clock
        </v-icon>

        <v-icon
          v-else-if="contactToInfo.status === 'pending'"
          color="grey"
          class="mr-1"
          small
        >
          mdi-alert-circle
        </v-icon>

        <span
          :class="{
            'success--text': contactToInfo.status === 'resolved',
            'error--text': contactToInfo.status === 'cancelled',
            'warning--text': contactToInfo.status === 'in_progress',
            'grey--text': contactToInfo.status === 'pending'
          }"
        >
          {{ getStatusText(contactToInfo.status) }}
        </span>

        <br>

        <strong>NOMBRE DEL PERIODO:</strong>
        <span>{{ contactToInfo.periodName.toUpperCase() }}</span>

        <br>

        <strong>ADMIN SOLICITADOR:</strong>
        <span>{{ contactToInfo.admin.name.toUpperCase() }}</span>

        <br>

        <strong>CREACIÓN DEL CONTACTO:</strong>
        <span>{{ moment(contactToInfo.createdAt).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

        <br>
        <br>

        <strong>ÚLTIMA ACTUALIZACIÓN POR:</strong>
        <span v-if="contactToInfo.admin.name">{{ contactToInfo.admin.name.toUpperCase() }}</span>

        <br>

        <strong>FECHA DE ÚLTIMA ACTUALIZACIÓN:</strong>
        <span>{{ moment(contactToInfo.updatedAt).format('dddd DD MMMM YYYY').toUpperCase() }}</span>

        <br>

        <strong>ÚLTIMAS OBSERVACIONES:</strong>
        <span v-if="contactToInfo.observations">({{ contactToInfo.admin.id }}) {{ contactToInfo.observations.toUpperCase() }}</span>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pt-0 mt-0 pb-6"
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
    contactToInfo: {
      type: Object,
      required: true
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true
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

    close () {
      this.$emit('action', { action: 'cancel' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
