<template>
  <v-dialog
    v-model="show"
    max-width="1000"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          EDITAR PERFIL DE ADMINISTRADOR
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="px-6 black--text"
        >
          <v-row align="end">
            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>NOMBRE(S)</h3>
              <v-text-field
                v-model="currentEdit.name"
                :rules="[requiredRule]"
                type="text"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>APELLIDO PATERNO</h3>
              <v-text-field
                v-model="currentEdit.lastName"
                :rules="[requiredRule]"
                type="text"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>APELLIDO MATERNO</h3>
              <v-text-field
                v-model="currentEdit.secondLastName"
                type="text"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <v-row align="end">
            <v-col lg="6" md="6" sm="12" xs="12" class="col-full-xs">
              <h3>CORREO ELECTRÓNICO</h3>
              <v-text-field
                v-model="currentEdit.email"
                :rules="[requiredRule, emailRule]"
                type="email"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="6" md="6" sm="12" xs="12" class="col-full-xs">
              <h3>TELÉFONO</h3>
              <v-text-field
                v-model="currentEdit.phone"
                :rules="[requiredRule, phoneRule]"
                type="tel"
                outlined
                dense
                required
              />
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>ROL</h3>
              <v-select
                v-model="currentEdit.role"
                :items="roles"
                :rules="[requiredRule]"
                outlined
                dense
                required
                item-text="label"
                item-value="value"
              />
            </v-col>

            <v-col lg="8" md="8" sm="12" xs="12" class="col-full-xs">
              <v-alert
                border="left"
                color="info"
                class="text-left mb-4"
                dense
                outlined
              >
                <v-icon color="yellow darken-2" small>
                  mdi-crown
                </v-icon> <strong>SUPERADMIN:</strong> Acceso total, gestiona todo el sistema.<br>
                <v-icon color="blue darken-2" small>
                  mdi-account-tie
                </v-icon> <strong>ADMIN:</strong> Gestiona periodos, usuarios y actividades.<br>
                <v-icon color="green darken-2" small>
                  mdi-check-decagram
                </v-icon> <strong>VALIDADOR:</strong> Valida actividades y gestiona contactos.<br>
                <v-icon color="grey darken-2" small>
                  mdi-eye
                </v-icon> <strong>CONSULTA:</strong> Solo consulta actividades y periodos.
              </v-alert>
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
          @click="updateAdmin()"
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
    adminEdit: {
      type: Object,
      default: () => ({
        email: '',
        name: '',
        lastName: '',
        secondLastName: '',
        phone: '',
        role: ''
      })
    }
  },

  data () {
    return {
      show: this.value,
      validForm: false,
      currentEdit: { ...this.adminEdit },
      roles: [
        { label: 'SUPERADMIN', value: 'superadmin', icon: 'mdi-crown', color: 'yellow darken-2' },
        { label: 'ADMIN', value: 'admin', icon: 'mdi-account-tie', color: 'blue darken-2' },
        { label: 'VALIDADOR', value: 'validador', icon: 'mdi-check-decagram', color: 'green darken-2' },
        { label: 'CONSULTA', value: 'consulta', icon: 'mdi-eye', color: 'grey darken-2' }
      ]
    }
  },
  computed: {
    requiredRule () {
      return v => !!v || 'ESTE CAMPO ES REQUERIDO'
    },
    emailRule () {
      return v => /.+@ugto\.mx$/.test(v) || 'SOLO SE PERMITE EL DOMINIO @ugto.mx'
    },
    phoneRule () {
      return v => /^\d{10,15}$/.test(v) || 'TELÉFONO INVÁLIDO, DEBE TENER 10 DÍGITOS'
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
    adminEdit: {
      handler (val) {
        this.currentEdit = { ...val }
      },
      immediate: true,
      deep: false
    },
    'currentEdit.name': {
      handler (val) {
        if (val) { this.currentEdit.name = val.toUpperCase() }
      }
    },
    'currentEdit.lastName': {
      handler (val) {
        if (val) { this.currentEdit.lastName = val.toUpperCase() }
      }
    },
    'currentEdit.secondLastName': {
      handler (val) {
        if (val) { this.currentEdit.secondLastName = val.toUpperCase() }
      }
    },
    'currentEdit.role': {
      handler (val) {
        if (typeof val === 'string') {
          this.currentEdit.role = val.toUpperCase()
        } else if (val && typeof val.value === 'string') {
          this.currentEdit.role = val.value.toUpperCase()
        }
      }
    }
  },

  methods: {
    updateAdmin () {
      if (!this.validForm) { return }
      const data = {
        id: this.currentEdit.id,
        email: this.currentEdit.email,
        name: this.currentEdit.name,
        lastName: this.currentEdit.lastName,
        secondLastName: this.currentEdit.secondLastName,
        phone: this.currentEdit.phone,
        role: this.currentEdit.role
      }
      this.$emit('action', { data, action: 'editAdmin' })
    },

    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.currentEdit = {}
      this.$emit('action', { action: 'cancel' })
    },

    resetForm () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.currentEdit = {}
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
