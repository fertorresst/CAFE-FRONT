<template>
  <v-dialog
    v-model="show"
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
          {{ change }} ADMINISTRADOR
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          ¿Estás seguro de que deseas <strong :class="change === 'ACTIVAR' ? 'green--text' : 'red--text'">{{ change }}</strong> este administrador?
          <br>
          <strong
            class="text-center subtitle mt-4"
            style="color: #07538a"
          >
            {{ getAdminName() }}
          </strong>
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
          @click="changeActive()"
        >
          <strong>{{ change }}</strong>
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
    change: {
      type: String,
      default: '',
      required: true
    },
    adminData: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      show: this.value
    }
  },

  computed: {
    getAdminName () {
      return () => {
        const { name, lastName, secondLastName } = this.adminData
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
    cancel () {
      this.$emit('action', { action: 'cancel' })
    },

    changeActive () {
      const data = {
        id: this.adminData.id,
        active: this.change === 'ACTIVAR' ? 1 : 0
      }

      this.$emit('action', { action: 'changeActive', data })
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
