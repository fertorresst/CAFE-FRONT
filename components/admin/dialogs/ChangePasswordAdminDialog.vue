<template>
  <v-dialog
    v-model="show"
    max-width="500"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          ACTUALIZAR CONTRASEÑA DE ADMINISTRADOR
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-center subtitle black--text"
        >
          Cambiar contraseña del administrador:
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ getAdminName() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text class="py-3">
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="px-6 black--text"
        >
          <v-row align="end">
            <v-col lg="12" md="12" sm="12" xs="12" class="col-full-xs">
              <h3>NUEVA CONTRASEÑA</h3>
              <v-text-field
                v-model="password"
                :rules="[requiredRule, passwordRule]"
                type="password"
                outlined
                dense
                required
              />

              <h3>CONFIRMAR NUEVA CONTRASEÑA</h3>
              <v-text-field
                v-model="passwordConfirm"
                :rules="[requiredRule, passwordRule, passwordConfirmRule]"
                :disabled="!password"
                type="password"
                outlined
                dense
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-center pb-6">
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
          @click="changePassword()"
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
    value: {
      type: Boolean,
      default: false
    },
    adminData: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      show: this.value,
      validForm: false,
      password: '',
      passwordConfirm: ''
    }
  },

  computed: {
    requiredRule () {
      return v => !!v || 'ESTE CAMPO ES REQUERIDO'
    },
    passwordRule () {
      return v =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v) ||
        'LA CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES, UNA MAYÚSCULA, UNA MINÚSCULA, UN NÚMERO Y UN CARÁCTER ESPECIAL'
    },
    passwordConfirmRule () {
      return v => v === this.password || 'LAS CONTRASEÑAS NO COINCIDEN'
    },
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
      if (!val) {
        this.resetForm()
      }
    },
    password () {
      this.passwordConfirm = ''
    }
  },

  methods: {
    changePassword () {
      if (!this.validForm) { return }
      const data = {
        id: this.adminData.id,
        password: this.password
      }
      this.$emit('action', { data, action: 'changePassword' })
    },

    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.password = ''
      this.passwordConfirm = ''
      this.$emit('action', { action: 'cancel' })
    },

    resetForm () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.password = ''
      this.passwordConfirm = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 600px) {
  .col-full-xs {
    flex-basis: 100% !important;
    max-width: 100% !important;
  }
}
</style>
