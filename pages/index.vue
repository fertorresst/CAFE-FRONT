<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="login-title">
        <h1 align="center" justify="center">
          SISTEMA DE GESTIÓN DE ACTIVIDADES FORMATIVAS
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card
          align="center"
          justify="center"
          dark
          flat
          class="login-card"
        >
          <v-card-text style="padding-bottom: 0;">
            <h1>
              Iniciar Sesión
            </h1>
          </v-card-text>
          <v-card-text>
            <h4>
              Introduce tus credenciales institucionales
            </h4>
          </v-card-text>
          <v-card-text class="mt-16">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <h3>Correo</h3>
              <v-text-field
                v-model="email"
                outlined
                dense
                type="email"
                required
              />

              <h3>Contraseña</h3>
              <v-text-field
                v-model="password"
                outlined
                dense
                type="password"
                required
              />
              <v-btn
                color="#fed55e"
                rounded
                text
                elevation="0"
              >
                <span class="text">Iniciar Sesión</span>
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
  layout: 'empty'
}
</script>

<style lang="scss" scoped>
.login-title {
  position: absolute;
    top: 15%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.login-card {
  padding: 20px;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
