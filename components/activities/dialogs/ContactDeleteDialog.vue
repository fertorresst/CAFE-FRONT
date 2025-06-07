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
          ELIMINAR CONTACTO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          ¿Estás seguro de que deseas eliminar este contacto?
          <br>
          <strong
            class="subtitle mt-4"
            style="color: #07538a"
          >
            {{ contactToDelete.id }} | {{ contactToDelete.user.name }}
          </strong>
        </h3>

        <div class="text-left black--text mt-4">
          <strong>NUA:</strong>
          <span>{{ contactToDelete.user.nua }}</span>

          <br>
          <strong>CORREO:</strong>
          <span>{{ contactToDelete.user.email }}</span>

          <br>

          <strong>TELÉFONO:</strong>
          <span>{{ formatPhone(contactToDelete.user.phone) }}</span>

          <br>
          <br>

          <strong>TIPO DE ACTIVIDAD:</strong>
          <span>{{ getActivityType(contactToDelete.relatedItem.type) }}</span>

          <br>

          <strong>NOMBRE DE LA ACTIVIDAD:</strong>
          <span>{{ contactToDelete.relatedItem.name.toUpperCase() }}</span>

          <br>

          <strong>MOTIVO DEL CONTACTO:</strong>
          <span>{{ contactToDelete.description.toUpperCase() }}</span>
        </div>

        <br>

        <h3
          class="text-left subtitle black--text"
        >
          *Esta acción no se puede deshacer.
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
          @click="deleteContact()"
        >
          <strong>ELIMINAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    contactToDelete: {
      type: Object,
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

    getActivityType (type) {
      const typeMap = {
        collective: 'ACTIVIDAD COLECTIVA',
        activity: 'ACTIVIDAD INDIVIDUAL'
      }

      return typeMap[type] || type
    },

    cancel () {
      this.$emit('action', { action: 'cancel' })
    },

    deleteContact () {
      if (confirm('¿ESTÁS SEGURO DE QUE DESEAS ELIMINAR ESTE CONTACTO? ESTA ACCIÓN NO SE PUEDE DESHACER.')) {
        const data = {
          contactId: this.contactToDelete.id,
          activityId: this.contactToDelete.relatedItem.id
        }

        this.$emit('action', { action: 'deleteContact', data })
        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
