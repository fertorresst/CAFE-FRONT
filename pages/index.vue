<template>
  <v-container fluid>
    <v-row
      class="login-center"
    >
      <v-col cols="12">
        <h1 align="center" justify="center">
          SISTEMA DE GESTIÓN DE ACTIVIDADES FORMATIVAS
        </h1>
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
              Introduce tus credenciales institucionales
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
export default {
  layout: 'empty',

  data () {
    return {
      email: '',
      password: '',
      valid: true
    }
  },

  methods: {
    login () {
      if (this.valid) {
        this.$router.push('/periods')
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
