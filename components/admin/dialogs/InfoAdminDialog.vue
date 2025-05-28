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
          INFORMACIÓN DEL ADMINISTRADOR
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          MOSTRANDO LA INFORMACIÓN DEL ADMINISTRADOR:
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ getFullName() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text
        class="text-justify black--text"
      >
        <strong>ID: </strong>
        <span>{{ adminInfo.id }}</span>

        <br>

        <strong>CORREO: </strong>
        <span>{{ adminInfo.email }}</span>

        <br>

        <strong>TELÉFONO: </strong>
        <span>{{ adminInfo.phone }}</span>

        <br>

        <strong>ROL (PRIVILEGIO): </strong>
        <span class="text-uppercase">{{ adminInfo.role }}</span>

        <br>

        <strong>ESTADO: </strong>
        <span>{{ adminInfo.active ? 'ACTIVO' : 'INACTIVO' }}</span>

        <br>

        <strong>FECHA DE CREACIÓN: </strong>
        <span>{{ moment(adminInfo.createdAt, 'DD/MM/YYYY').format('dddd DD MMMM YYYY').toUpperCase() }}</span>

        <br>

        <strong>FECHA DE ULTIMA ACTUALIZACIÓN: </strong>
        <span>{{ moment(adminInfo.updatedAt, 'DD/MM/YYYY').format('dddd DD MMMM YYYY').toUpperCase() }}</span>
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
    value: {
      type: Boolean,
      default: false
    },
    adminInfo: {
      type: Object,
      require: true,
      default: () => ({})
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: this.value
    }
  },

  computed: {
    getFullName () {
      return () => {
        const { name, lastName, secondLastName } = this.adminInfo
        return `${name} ${lastName} ${secondLastName}`.trim().toUpperCase() || 'NOMBRE NO DISPONIBLE'
      }
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
      this.$emit('action', { action: 'cancel' })
    }
  }
}
</script>

<style scoped>
</style>
