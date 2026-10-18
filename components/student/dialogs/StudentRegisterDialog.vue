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
          {{ adminMode ? 'REGISTRAR ALUMNO' : 'REGISTRARSE' }}
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

          <v-row align="start">
            <v-col lg="6" md="6" sm="12" xs="12" class="col-full-xs">
              <h3>CORREO INSTITUCIONAL (@ugto.mx)</h3>
              <v-text-field
                v-model="email"
                :rules="[requiredRule, emailRule]"
                :disabled="emailVerified"
                autocomplete="off"
                :append-icon="emailVerified ? 'mdi-check-circle' : ''"
                :success="emailVerified"
                type="email"
                outlined
                dense
                required
              />
              <v-btn
                v-if="!adminMode && !emailVerified"
                color="#fed55e"
                small
                rounded
                elevation="0"
                :loading="sendingCode"
                :disabled="!isInstitutionalEmail || cooldown > 0"
                @click="sendCode()"
              >
                <strong>{{ sendButtonText }}</strong>
              </v-btn>
              <v-btn
                v-else-if="!adminMode"
                color="black"
                small
                rounded
                text
                @click="changeEmail()"
              >
                <span class="text">CAMBIAR CORREO</span>
              </v-btn>
            </v-col>

            <v-col
              v-if="!adminMode && codeSent && !emailVerified"
              lg="6"
              md="6"
              sm="12"
              xs="12"
              class="col-full-xs"
            >
              <h3>CÓDIGO DE VERIFICACIÓN</h3>
              <v-text-field
                v-model="code"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="000000"
                outlined
                dense
                @keyup.enter="verifyCode()"
              />
              <v-btn
                color="#fed55e"
                small
                rounded
                elevation="0"
                :loading="verifyingCode"
                :disabled="code.length !== 6"
                @click="verifyCode()"
              >
                <strong>VERIFICAR CÓDIGO</strong>
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="!adminMode && verifyMessage">
            <v-col cols="12" class="py-0">
              <v-alert
                :type="verifyMessageType"
                dense
                text
                class="mb-0"
              >
                {{ verifyMessage }}
              </v-alert>
            </v-col>
          </v-row>

          <v-row align="end">
            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>TELÉFONO</h3>
              <v-text-field
                v-model="phone"
                :rules="[requiredRule, phoneRule]"
                autocomplete="off"
                type="tel"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>CONTRASEÑA</h3>
              <v-text-field
                v-model="password"
                :rules="[requiredRule, passwordRule]"
                autocomplete="new-password"
                type="password"
                outlined
                dense
                required
              />
            </v-col>

            <v-col lg="4" md="4" sm="12" xs="12" class="col-full-xs">
              <h3>CONFIRMAR CONTRASEÑA</h3>
              <v-text-field
                v-model="passwordConfirm"
                :rules="[requiredRule, passwordRule, passwordConfirmRule]"
                :disabled="!password"
                autocomplete="new-password"
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
    },
    // true cuando lo usa un administrador: el correo no se verifica con código
    adminMode: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      show: this.value,
      validForm: false,
      // Verificación de correo
      emailVerified: false,
      verificationToken: '',
      verifiedAt: 0,
      codeSent: false,
      code: '',
      sendingCode: false,
      verifyingCode: false,
      cooldown: 0,
      cooldownTimer: null,
      verifyMessage: '',
      verifyMessageType: 'info',
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
      return v => /^[^\s@]+@ugto\.mx$/i.test((v || '').trim()) || 'SOLO SE PERMITE EL DOMINIO @ugto.mx'
    },
    isInstitutionalEmail () {
      return /^[^\s@]+@ugto\.mx$/i.test((this.email || '').trim())
    },
    sendButtonText () {
      if (this.cooldown > 0) { return `REENVIAR EN ${this.cooldown}s` }
      return this.codeSent ? 'REENVIAR CÓDIGO' : 'ENVIAR CÓDIGO'
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
    },
    email () {
      if (!this.emailVerified) {
        this.codeSent = false
        this.code = ''
        this.verifyMessage = ''
      }
    }
  },

  beforeDestroy () {
    this.stopCooldown()
  },

  methods: {
    setVerifyMessage (type, message) {
      this.verifyMessageType = type
      this.verifyMessage = message
    },

    startCooldown (seconds) {
      this.stopCooldown()
      this.cooldown = seconds
      this.cooldownTimer = setInterval(() => {
        this.cooldown--
        if (this.cooldown <= 0) { this.stopCooldown() }
      }, 1000)
    },

    stopCooldown () {
      if (this.cooldownTimer) {
        clearInterval(this.cooldownTimer)
        this.cooldownTimer = null
      }
      this.cooldown = 0
    },

    // Pide al servidor que envíe el código al correo institucional
    async sendCode () {
      if (!this.isInstitutionalEmail || this.cooldown > 0) { return }
      this.sendingCode = true
      this.verifyMessage = ''
      try {
        const res = await this.$axios.post('/users/send-verification-code', {
          email: this.email.trim()
        })
        this.codeSent = true
        this.code = ''
        this.setVerifyMessage('success', res.data.message)
        this.startCooldown(60)
      } catch (e) {
        this.setVerifyMessage('error', e.response?.data?.message || 'NO SE PUDO ENVIAR EL CÓDIGO. INTENTA DE NUEVO.')
      } finally {
        this.sendingCode = false
      }
    },

    // Comprueba el código; si es correcto el servidor devuelve un token temporal
    async verifyCode () {
      if (!/^\d{6}$/.test(this.code)) {
        this.setVerifyMessage('error', 'EL CÓDIGO DEBE TENER 6 DÍGITOS')
        return
      }
      this.verifyingCode = true
      try {
        const res = await this.$axios.post('/users/verify-email-code', {
          email: this.email.trim(),
          code: this.code
        })
        this.verificationToken = res.data.verificationToken
        this.verifiedAt = Date.now()
        this.emailVerified = true
        this.codeSent = false
        this.code = ''
        this.stopCooldown()
        this.setVerifyMessage('success', res.data.message)
      } catch (e) {
        this.setVerifyMessage('error', e.response?.data?.message || 'NO SE PUDO VERIFICAR EL CÓDIGO. INTENTA DE NUEVO.')
      } finally {
        this.verifyingCode = false
      }
    },

    // Permite usar otro correo: descarta la verificación actual
    changeEmail () {
      this.resetVerification()
    },

    resetVerification () {
      this.stopCooldown()
      this.emailVerified = false
      this.verificationToken = ''
      this.verifiedAt = 0
      this.codeSent = false
      this.code = ''
      this.verifyMessage = ''
    },

    createUser () {
      // En modo administrador el correo no se verifica con código
      if (!this.adminMode && !this.emailVerified) {
        this.setVerifyMessage('warning', 'DEBES VERIFICAR TU CORREO ELECTRÓNICO ANTES DE REGISTRARTE')
        return
      }
      // El token de verificación dura 15 minutos en el servidor
      if (!this.adminMode && Date.now() - this.verifiedAt > 14 * 60 * 1000) {
        this.resetVerification()
        this.setVerifyMessage('warning', 'LA VERIFICACIÓN EXPIRÓ. VUELVE A VERIFICAR TU CORREO.')
        return
      }
      if (!this.validForm) { return }
      const data = {
        email: this.email.trim(),
        password: this.password,
        name: this.name,
        lastName: this.lastName,
        secondLastName: this.secondLastName,
        phone: this.phone,
        nua: this.nua,
        career: this.career,
        sede: this.sede
      }
      // El registro público lleva el token de verificación; el de administrador no
      if (!this.adminMode) {
        data.verificationToken = this.verificationToken
      }
      this.$emit('action', { data, action: 'createUser' })
    },

    cancel () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.validForm = false
      this.resetVerification()
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
      this.resetVerification()
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
