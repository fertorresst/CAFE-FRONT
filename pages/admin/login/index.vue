<template>
  <v-container fluid>
    <v-row
      class="login-center"
    >
      <v-col cols="12" align="center" justify="center">
        <v-img
          src="/MiCAFÉ.svg"
          alt="MiCAFE"
          max-width="300"
          contain
          class="mx-auto"
        />
      </v-col>

      <v-col cols="12" align="center" justify="center">
        <v-card
          align="center"
          justify="center"
          class="login-card"
          flat
          max-width="400"
        >
          <v-card-text style="padding-bottom: 0;">
            <h1 style="color: white;">
              Iniciar Sesión
            </h1>
          </v-card-text>
          <v-card-text>
            <h4 style="color: white;">
              Introduce tus credenciales de administrador
            </h4>
          </v-card-text>
          <v-card-text class="mt-16">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <h3 style="color: white;">
                Correo
              </h3>
              <v-text-field
                v-model="email"
                flat
                solo
                outlined
                dense
                type="email"
                required
              />

              <h3 style="color: white;">
                Contraseña
              </h3>
              <v-text-field
                v-model="password"
                flat
                solo
                outlined
                dense
                type="password"
                required
              />
              <v-btn
                color="#fed55e"
                rounded
                elevation="0"
                @click="login()"
              >
                <strong>Iniciar Sesión</strong>
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'empty',

  data () {
    return {
      email: '',
      password: '',
      valid: true
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert
    })
  },

  watch: {
    showAlert () {}
  },

  methods: {
    // ALERTAS
    mostrarAlerta (color, type, message) {
      this.$store.commit('modifyAlert', true)
      this.$store.commit('modifyColor', `${color} lighten-2`)
      this.$store.commit('modifyIcon', color === 'green' ? 'mdi-check-circle' : 'mdi-close-circle')
      this.$store.commit('modifyType', type)
      this.$store.commit('modifyText', message)
      setTimeout(() => {
        this.$store.commit('modifyAlert', false)
      }, 3000)
    },

    async login () {
      try {
        const res = await this.$axios.post('/admin/login', {
          email: this.email,
          password: this.password
        }, { withCredentials: true })
        if (res.data.success) {
          this.$router.push('/admin/periods')
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL INICIAR SESIÓN. VERIFICA TUS CREDENCIALES.')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-card {
  background-color: #a3915f;
  padding: 20px;
  border-radius: 20px;
}
</style>
