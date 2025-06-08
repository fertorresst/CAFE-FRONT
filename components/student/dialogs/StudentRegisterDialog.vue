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
          REGISTRARSE
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
                v-model="name"
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
                v-model="lastName"
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
                v-model="secondLastName"
                type="text"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <v-row align="end">
            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>NUA</h3>
              <v-text-field
                v-model="nua"
                :rules="[requiredRule]"
                type="text"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>SEDE</h3>
              <v-select
                v-model="sede"
                :items="sedesItems"
                :rules="[requiredRule]"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>CARRERA</h3>
              <v-select
                v-model="career"
                :items="sede === 'SALAMANCA' ? careerItems.salamanca : careerItems.yuriria"
                item-text="text"
                item-value="value"
                :rules="[requiredRule]"
                outlined
                dense
                :disabled="!sede"
                required
              />
            </v-col>
          </v-row>

          <v-row align="end">
            <v-col lg="3" md="3" sm="12" xs="12" class="col-full-xs">
              <h3>CORREO ELECTRÓNICO</h3>
              <v-text-field
                v-model="email"
                :rules="[requiredRule, emailRule]"
                type="email"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="3" md="3" sm="12" xs="12" class="col-full-xs">
              <h3>TELÉFONO</h3>
              <v-text-field
                v-model="phone"
                :rules="[requiredRule, phoneRule]"
                type="tel"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="3" md="3" sm="12" xs="12" class="col-full-xs">
              <h3>CONTRASEÑA</h3>
              <v-text-field
                v-model="password"
                :rules="[requiredRule, passwordRule]"
                type="password"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="3" md="3" sm="12" xs="12" class="col-full-xs">
              <h3>CONFIRMAR CONTRASEÑA</h3>
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
          @click="createUser()"
        >
          <strong>REGISTRAR</strong>
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
    }
  },

  data () {
    return {
      show: this.value,
      validForm: false,
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      lastName: '',
      secondLastName: '',
      nua: '',
      career: '',
      sede: '',
      phone: '',
      sedesItems: ['SALAMANCA', 'YURIRIA'],
      careerItems: {
        salamanca: [
          { value: 'IS75LI0103', text: 'LICENCIATURA EN INGENIERÍA MECÁNICA' },
          { value: 'IS75LI0203', text: 'LICENCIATURA EN INGENIERÍA ELÉCTRICA' },
          { value: 'IS75LI0303', text: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA' },
          { value: 'IS75LI0403', text: 'LICENCIATURA EN INGENIERÍA EN MECATRÓNICA' },
          { value: 'IS75LI0502', text: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES' },
          { value: 'IS75LI0602', text: 'LICENCIATURA EN GESTIÓN EMPRESARIAL' },
          { value: 'IS75LI0702', text: 'LICENCIATURA EN ARTES DIGITALES' },
          { value: 'IS75LI0801', text: 'LICENCIATURA EN INGENIERÍA DE DATOS E INTELIGENCIA ARTIFICIAL' }
        ],
        yuriria: [
          { value: 'IS75LI03Y3', text: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA' },
          { value: 'IS75LI05Y2', text: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES' },
          { value: 'IS75LI06Y2', text: 'LICENCIATURA EN GESTIÓN EMPRESARIAL' },
          { value: 'IS75LI08Y2', text: 'LICENCIATURA EN ENSEÑANZA DEL INGLÉS' }
        ]
      }
    }
  },
  computed: {
    requiredRule () {
      return v => !!v || 'ESTE CAMPO ES REQUERIDO'
    },
    emailRule () {
      return v => /.+@ugto\.mx$/.test(v) || 'SOLO SE PERMITE EL DOMINIO @ugto.mx'
    },
    passwordRule () {
      return v =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v) ||
        'LA CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES, UNA MAYÚSCULA, UNA MINÚSCULA, UN NÚMERO Y UN CARÁCTER ESPECIAL'
    },
    phoneRule () {
      return v => /^\d{10,15}$/.test(v) || 'TELÉFONO INVÁLIDO, DEBE TENER 10 DÍGITOS'
    },
    passwordConfirmRule () {
      return v => v === this.password || 'LAS CONTRASEÑAS NO COINCIDEN'
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
    createUser () {
      if (!this.validForm) { return }
      const data = {
        email: this.email,
        password: this.password,
        name: this.name,
        lastName: this.lastName,
        secondLastName: this.secondLastName,
        phone: this.phone,
        nua: this.nua,
        career: this.career,
        sede: this.sede
      }
      this.$emit('action', { data, action: 'createUser' })
    },

    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.email = ''
      this.password = ''
      this.passwordConfirm = ''
      this.name = ''
      this.lastName = ''
      this.secondLastName = ''
      this.phone = ''
      this.nua = ''
      this.sede = ''
      this.career = ''
      this.$emit('action', { action: 'cancel' })
    },

    resetForm () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.email = ''
      this.password = ''
      this.passwordConfirm = ''
      this.name = ''
      this.lastName = ''
      this.secondLastName = ''
      this.phone = ''
      this.nua = ''
      this.sede = ''
      this.career = ''
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
