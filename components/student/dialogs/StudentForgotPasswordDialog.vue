<template>
  <v-dialog
    v-model="show"
    max-width="560"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          RECUPERAR CONTRASEÑA
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="px-6 black--text"
          @submit.prevent="step === 1 ? sendCode() : resetPassword()"
        >
          <!-- Paso 1: correo -->
          <div v-if="step === 1">
            <p class="text-justify">
              Escribe el correo institucional con el que te registraste en MiCAFÉ.
              Te enviaremos un código para que puedas crear una contraseña nueva.
            </p>
            <h3>CORREO INSTITUCIONAL (@ugto.mx)</h3>
            <v-text-field
              v-model="email"
              :rules="[requiredRule, emailRule]"
              autocomplete="off"
              type="email"
              outlined
              dense
              required
            />
          </div>

          <!-- Paso 2: código y contraseña nueva -->
          <div v-else>
            <p class="text-justify">
              Si el correo <b>{{ email.trim() }}</b> está registrado, te enviamos un código de 6 dígitos.
              Escríbelo junto con tu contraseña nueva. El código dura 10 minutos.
            </p>

            <h3>CÓDIGO DE VERIFICACIÓN</h3>
            <v-text-field
              v-model="code"
              :rules="[requiredRule, codeRule]"
              autocomplete="off"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="000000"
              outlined
              dense
              required
            />

            <h3>CONTRASEÑA NUEVA</h3>
            <v-text-field
              v-model="password"
              :rules="[requiredRule, passwordRule]"
              autocomplete="new-password"
              type="password"
              outlined
              dense
              required
            />

            <h3>CONFIRMAR CONTRASEÑA</h3>
            <v-text-field
              v-model="passwordConfirm"
              :rules="[requiredRule, passwordConfirmRule]"
              :disabled="!password"
              autocomplete="new-password"
              type="password"
              outlined
              dense
              required
              @keyup.enter="resetPassword()"
            />

            <div class="d-flex justify-space-between flex-wrap">
              <v-btn
                color="black"
                small
                rounded
                text
                @click="changeEmail()"
              >
                <span class="text">CAMBIAR CORREO</span>
              </v-btn>
              <v-btn
                color="black"
                small
                rounded
                text
                :loading="sendingCode"
                :disabled="cooldown > 0"
                @click="sendCode()"
              >
                <span class="text">{{ resendText }}</span>
              </v-btn>
            </div>
          </div>

          <v-alert
            v-if="message"
            :type="messageType"
            dense
            text
            class="mt-4 mb-0"
          >
            {{ message }}
          </v-alert>
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
          v-if="step === 1"
          color="#fed55e"
          rounded
          elevation="0"
          :loading="sendingCode"
          :disabled="!isInstitutionalEmail || sendingCode"
          @click="sendCode()"
        >
          <strong>ENVIAR CÓDIGO</strong>
        </v-btn>
        <v-btn
          v-else
          color="#fed55e"
          rounded
          elevation="0"
          :loading="resetting"
          :disabled="resetting"
          @click="resetPassword()"
        >
          <strong>CAMBIAR CONTRASEÑA</strong>
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
    // Correo que ya escribió el alumno en el login, para no pedírselo otra vez
    initialEmail: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      show: this.value,
      validForm: true,
      step: 1,
      email: this.initialEmail || '',
      code: '',
      password: '',
      passwordConfirm: '',
      sendingCode: false,
      resetting: false,
      cooldown: 0,
      cooldownTimer: null,
      message: '',
      messageType: 'info'
    }
  },

  computed: {
    requiredRule () {
      return v => !!v || 'ESTE CAMPO ES REQUERIDO'
    },
    emailRule () {
      return v => /^[^\s@]+@ugto\.mx$/i.test((v || '').trim()) || 'SOLO SE PERMITE EL DOMINIO @ugto.mx'
    },
    codeRule () {
      return v => /^\d{6}$/.test((v || '').trim()) || 'EL CÓDIGO DEBE TENER 6 DÍGITOS'
    },
    passwordRule () {
      return v =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v) ||
        'LA CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES, UNA MAYÚSCULA, UNA MINÚSCULA, UN NÚMERO Y UN CARÁCTER ESPECIAL'
    },
    passwordConfirmRule () {
      return v => v === this.password || 'LAS CONTRASEÑAS NO COINCIDEN'
    },
    isInstitutionalEmail () {
      return /^[^\s@]+@ugto\.mx$/i.test((this.email || '').trim())
    },
    resendText () {
      return this.cooldown > 0 ? `REENVIAR EN ${this.cooldown}s` : 'REENVIAR CÓDIGO'
    }
  },

  watch: {
    value (val) {
      this.show = val
    },
    show (val) {
      this.$emit('input', val)
    },
    password () {
      this.passwordConfirm = ''
    }
  },

  beforeDestroy () {
    this.stopCooldown()
  },

  methods: {
    setMessage (type, text) {
      this.messageType = type
      this.message = text
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

    // Pide al servidor que envíe el código de recuperación al correo
    async sendCode () {
      if (this.step === 1 && !this.$refs.form.validate()) { return }
      if (!this.isInstitutionalEmail || this.cooldown > 0 || this.sendingCode) { return }
      this.sendingCode = true
      this.message = ''
      try {
        await this.$axios.post('/users/forgot-password', {
          email: this.email.trim()
        })
        this.step = 2
        this.code = ''
        this.startCooldown(60)
        this.setMessage('success', 'LISTO. REVISA TU CORREO INSTITUCIONAL.')
      } catch (e) {
        this.setMessage('error', e.response?.data?.message || 'NO SE PUDO ENVIAR EL CÓDIGO. INTENTA DE NUEVO.')
      } finally {
        this.sendingCode = false
      }
    },

    // Cambia la contraseña con el código recibido
    async resetPassword () {
      if (this.resetting || !this.$refs.form.validate()) { return }
      this.resetting = true
      this.message = ''
      try {
        const res = await this.$axios.post('/users/reset-password', {
          email: this.email.trim(),
          code: this.code.trim(),
          newPassword: this.password
        })
        this.$emit('action', {
          action: 'passwordReset',
          email: this.email.trim(),
          message: res.data.message
        })
      } catch (e) {
        this.setMessage('error', e.response?.data?.message || 'NO SE PUDO CAMBIAR LA CONTRASEÑA. INTENTA DE NUEVO.')
      } finally {
        this.resetting = false
      }
    },

    // Regresa al paso 1 para usar otro correo
    changeEmail () {
      this.stopCooldown()
      this.step = 1
      this.code = ''
      this.password = ''
      this.passwordConfirm = ''
      this.message = ''
    },

    cancel () {
      this.stopCooldown()
      this.$emit('action', { action: 'forgotCancel' })
    }
  }
}
</script>
