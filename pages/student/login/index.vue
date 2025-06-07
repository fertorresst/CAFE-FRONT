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
            <br>
          </v-card-text>
          <v-card-text>
            <h4 style="color: white;">
              Introduce tus credenciales de MiCAFÉ
              <br>
              Estas credenciales son diferentes a las de tu cuenta de institucional.
            </h4>
          </v-card-text>
          <v-card-text>
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

          <v-card-text>
            <h4 style="color: white;">
              ¿Aún no tienes cuenta en MiCAFÉ?
            </h4>
            <v-btn
              color="#fed55e"
              rounded
              elevation="0"
              text
              @click="registerDialog()"
            >
              <v-icon left>
                mdi-account-plus
              </v-icon>
              <strong>REGÍSTRATE</strong>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <StudentRegisterDialog
      :key="dialogsKey.register"
      v-model="dialogRegister"
      @action="decoder"
    />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import StudentRegisterDialog from '../../../components/student/dialogs/StudentRegisterDialog'

export default {
  components: { StudentRegisterDialog },

  layout: 'empty',

  data () {
    return {
      email: '',
      password: '',
      valid: true,

      dialogsKey: {
        register: 0
      },

      // DIALOG DE REGISTRO
      dialogRegister: false
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

  async created () {
    try {
      // Intenta obtener los datos del usuario logueado
      const res = await this.$axios.get('/users/me', { withCredentials: true })
      if (res.data && res.data.success) {
        // Si ya está logueado, redirige al dashboard
        this.$router.push('/student/dashboard')
      }
    } catch (e) {
      // Si no está logueado, no hace nada y permite mostrar el login
    }
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

    decoder (data) {
      console.log('🚀 ~ decoder ~ data:', data)
      switch (data.action) {
        case 'cancel':
          this.dialogRegister = false
          break
        case 'createUser':
          this.createUser(data.data)
          this.clean()
          break
        default:
          break
      }
    },

    clean () {
      this.email = ''
      this.password = ''
      this.dialogRegister = false
      this.dialogsKey.register++
    },

    async login () {
      try {
        const res = await this.$axios.post('/users/login', {
          email: this.email,
          password: this.password
        }, { withCredentials: true })
        if (res.data.success) {
          this.$router.push('/student/dashboard')
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL INICIAR SESIÓN. VERIFICA TUS CREDENCIALES.')
      }
    },

    registerDialog () {
      this.dialogRegister = true
    },

    async createUser (data) {
      try {
        const res = await this.$axios.post('/users/create-user', data)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.clean()
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL CREAR USUARIO. ERROR INTERNO DEL SERVIDOR.')
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
  background-color: #07538a;
  padding: 20px;
  border-radius: 20px;
}
</style>
