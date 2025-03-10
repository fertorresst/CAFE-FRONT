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
          ELIMINAR PERIODO PERIODO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-left subtitle black--text"
        >
          ¿Estás seguro de que deseas eliminar este periodo?
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ periodToDelete.id }}
          </strong>
        </h3>

        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="pt-6 black--text"
        >
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
        <h3
          class="text-left subtitle black--text"
        >
          Esta acción no se puede deshacer.
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
          @click="deletePeriod()"
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
    periodToDelete: {
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
      password: ''
    }
  },

  methods: {
    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.password = ''
      this.$emit('action', { action: 'cancel' })
    },

    async deletePeriod () {
      if (!this.password) {
        this.mostrarAlerta('red', 'error', 'DEBES INTRODUCIR TU CONTRASEÑA')
        return
      }

      const validateForm = this.$refs.form.validate()
      const validatePassword = await this.validatePassword(this.password)

      if (validateForm && validatePassword) {
        const id = this.periodToDelete.id

        this.$emit('action', { action: 'deletePeriod', id })
        this.cancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
