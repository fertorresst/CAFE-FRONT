<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1 class="my-5 d-flex align-center">
        MI PERFIL
        <!-- Botón de ayuda -->
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              small
              class="ml-2"
              color="info"
              v-bind="attrs"
              v-on="on"
              @click="dialogLegend = true"
            >
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
          </template>
          <span>Ver ayuda</span>
        </v-tooltip>
      </h1>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="rounded-xl" elevation="3">
          <!-- Header del perfil -->
          <v-card-title class="bg-blue white--text py-4">
            <v-icon left color="white" large>
              mdi-account-circle
            </v-icon>
            <span class="headline">INFORMACIÓN DEL PERFIL</span>
          </v-card-title>

          <!-- Contenido del perfil -->
          <v-card-text class="pa-6">
            <v-row>
              <!-- Avatar -->
              <v-col cols="12" class="d-flex justify-center mb-4">
                <v-avatar size="150" color="#a3915f">
                  <v-img
                    v-if="profile.profilePicture"
                    :src="profile.profilePicture"
                    alt="Foto de perfil"
                  />
                  <v-icon v-else size="100" color="white">
                    mdi-account
                  </v-icon>
                </v-avatar>
              </v-col>

              <!-- Información personal -->
              <v-col cols="12">
                <v-divider class="mb-4" />
                <h3 class="subtitle-1 font-weight-bold mb-3 text-uppercase" style="color: #07538a">
                  Datos Personales
                </h3>
              </v-col>

              <v-col cols="12" sm="3">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-badge-account</v-icon>
                    NUA:
                  </span>
                  <span class="field-value">{{ profile.nua }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="3">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-account</v-icon>
                    NOMBRE(S):
                  </span>
                  <span class="field-value">{{ capitalizeText(profile.name) }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="3">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-account</v-icon>
                    APELLIDO PATERNO:
                  </span>
                  <span class="field-value">{{ capitalizeText(profile.lastName) }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="3">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-account</v-icon>
                    APELLIDO MATERNO:
                  </span>
                  <span class="field-value">{{ capitalizeText(profile.secondLastName) || 'N/A' }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-phone</v-icon>
                    TELÉFONO:
                  </span>
                  <span class="field-value">{{ formatPhone(profile.phone) }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-email</v-icon>
                    CORREO:
                  </span>
                  <span class="field-value">{{ profile.email }}</span>
                </div>
              </v-col>

              <!-- Información académica -->
              <v-col cols="12">
                <v-divider class="my-4" />
                <h3 class="subtitle-1 font-weight-bold mb-3 text-uppercase" style="color: #07538a">
                  Información Académica
                </h3>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-school</v-icon>
                    CARRERA:
                  </span>
                  <span class="field-value">{{ getCareerName(profile.career) }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-map-marker</v-icon>
                    SEDE:
                  </span>
                  <span class="field-value">{{ profile.sede }}</span>
                </div>
              </v-col>

              <!-- Información del sistema -->
              <v-col cols="12">
                <v-divider class="my-4" />
                <h3 class="subtitle-1 font-weight-bold mb-3 text-uppercase" style="color: #07538a">
                  Información del Sistema
                </h3>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-calendar</v-icon>
                    FECHA DE REGISTRO:
                  </span>
                  <span class="field-value">{{ formatDate(profile.createdAt) }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">
                    <v-icon small color="#a3915f" class="mr-1">mdi-update</v-icon>
                    ÚLTIMA ACTUALIZACIÓN:
                  </span>
                  <span class="field-value">{{ formatDate(profile.updatedAt) }}</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <v-btn
              color="#fed55e"
              elevation="0"
              rounded
              class="px-8"
              @click="openEditDialog"
            >
              <v-icon left>mdi-pencil</v-icon>
              <strong>EDITAR PERFIL</strong>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para editar perfil -->
    <v-dialog v-model="dialogEdit" max-width="600" persistent>
      <v-card
        align="center"
        justify="center"
        class="rounded-xl"
      >
        <v-card-text class="bg-blue white--text py-4">
          <h2>
            EDITAR PERFIL
          </h2>
        </v-card-text>

        <v-card-text class="py-3">
          <h3
            class="text-justify subtitle black--text"
          >
            Actualiza la información de tu perfil.
          </h3>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            class="px-6 black--text"
          >
            <h3>NUA *</h3>
            <v-text-field
              v-model="editData.nua"
              :rules="[requiredRule]"
              outlined
              dense
              required
            />

            <h3>NOMBRE(S) *</h3>
            <v-text-field
              v-model="editData.name"
              :rules="[requiredRule]"
              outlined
              dense
              required
            />

            <v-row>
              <v-col cols="12" sm="6">
                <h3>APELLIDO PATERNO *</h3>
                <v-text-field
                  v-model="editData.lastName"
                  :rules="[requiredRule]"
                  outlined
                  dense
                  required
                />
              </v-col>

              <v-col cols="12" sm="6">
                <h3>APELLIDO MATERNO</h3>
                <v-text-field
                  v-model="editData.secondLastName"
                  outlined
                  dense
                />
              </v-col>
            </v-row>

            <h3>TELÉFONO *</h3>
            <v-text-field
              v-model="editData.phone"
              v-mask="'### ### ####'"
              :rules="[requiredRule, phoneRule]"
              outlined
              dense
              placeholder="000 000 0000"
              required
            />

            <h3>CORREO ELECTRÓNICO *</h3>
            <v-text-field
              v-model="editData.email"
              :rules="[requiredRule, emailRule]"
              outlined
              dense
              type="email"
              required
            />

            <h3>CARRERA *</h3>
            <v-select
              v-model="editData.career"
              :items="careerItems"
              :rules="[requiredRule]"
              outlined
              dense
              required
            />

            <h3>SEDE *</h3>
            <v-select
              v-model="editData.sede"
              :items="sedeItems"
              :rules="[requiredRule]"
              outlined
              dense
              required
            />
          </v-form>
        </v-card-text>

        <v-card-text>
          <h3
            class="text-justify subtitle black--text"
          >
            Los campos marcados con (*) son obligatorios.
          </h3>
        </v-card-text>

        <v-card-actions
          class="d-flex justify-center pb-6"
        >
          <v-btn
            color="black"
            rounded
            text
            @click="closeEditDialog"
          >
            <span class="text">CANCELAR</span>
          </v-btn>
          <v-btn
            color="#fed55e"
            rounded
            elevation="0"
            :disabled="!valid || loading"
            :loading="loading"
            @click="saveProfile"
          >
            <strong>GUARDAR CAMBIOS</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de ayuda -->
    <LegendHelpDialog v-model="dialogLegend" page="general" />
  </v-col>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import LegendHelpDialog from '~/components/shared/LegendHelpDialog.vue'

moment.locale('es')

export default {
  components: {
    LegendHelpDialog
  },

  layout: 'student',

  middleware: 'auth-student',

  data () {
    return {
      moment,
      profile: {
        id: null,
        nua: '',
        name: '',
        lastName: '',
        secondLastName: '',
        email: '',
        phone: '',
        career: '',
        sede: '',
        profilePicture: null,
        createdAt: null,
        updatedAt: null
      },
      dialogEdit: false,
      dialogLegend: false,
      valid: false,
      loading: false,
      editData: {
        nua: '',
        name: '',
        lastName: '',
        secondLastName: '',
        email: '',
        phone: '',
        career: '',
        sede: ''
      },

      // Reglas de validación
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',
      emailRule: value => /.+@.+\..+/.test(value) || 'CORREO ELECTRÓNICO INVÁLIDO',
      phoneRule: (value) => {
        const phone = value ? value.replace(/\s/g, '') : ''
        return phone.length === 10 || 'EL TELÉFONO DEBE TENER 10 DÍGITOS'
      },

      // Catálogo de carreras
      careers: {
        IS75LI0103: 'LICENCIATURA EN INGENIERÍA MECÁNICA',
        IS75LI0203: 'LICENCIATURA EN INGENIERÍA ELÉCTRICA',
        IS75LI0303: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA',
        IS75LI03Y3: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA (Yuriria)',
        IS75LI0403: 'LICENCIATURA EN INGENIERÍA EN MECATRÓNICA',
        IS75LI0502: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES',
        IS75LI05Y2: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES (Yuriria)',
        IS75LI0602: 'LICENCIATURA EN GESTIÓN EMPRESARIAL',
        IS75LI06Y2: 'LICENCIATURA EN GESTIÓN EMPRESARIAL (Yuriria)',
        IS75LI0702: 'LICENCIATURA EN ARTES DIGITALES',
        IS75LI0801: 'LICENCIATURA EN INGENIERÍA DE DATOS E INTELIGENCIA ARTIFICIAL',
        IS75LI08Y2: 'LICENCIATURA EN ENSEÑANZA DEL INGLÉS'
      },

      // Items para el select de carreras
      careerItems: [
        { text: 'LICENCIATURA EN INGENIERÍA MECÁNICA', value: 'IS75LI0103' },
        { text: 'LICENCIATURA EN INGENIERÍA ELÉCTRICA', value: 'IS75LI0203' },
        { text: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA', value: 'IS75LI0303' },
        { text: 'LICENCIATURA EN INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA (Yuriria)', value: 'IS75LI03Y3' },
        { text: 'LICENCIATURA EN INGENIERÍA EN MECATRÓNICA', value: 'IS75LI0403' },
        { text: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES', value: 'IS75LI0502' },
        { text: 'LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES (Yuriria)', value: 'IS75LI05Y2' },
        { text: 'LICENCIATURA EN GESTIÓN EMPRESARIAL', value: 'IS75LI0602' },
        { text: 'LICENCIATURA EN GESTIÓN EMPRESARIAL (Yuriria)', value: 'IS75LI06Y2' },
        { text: 'LICENCIATURA EN ARTES DIGITALES', value: 'IS75LI0702' },
        { text: 'LICENCIATURA EN INGENIERÍA DE DATOS E INTELIGENCIA ARTIFICIAL', value: 'IS75LI0801' },
        { text: 'LICENCIATURA EN ENSEÑANZA DEL INGLÉS', value: 'IS75LI08Y2' }
      ],

      // Items para el select de sede
      sedeItems: [
        { text: 'SALAMANCA', value: 'SALAMANCA' },
        { text: 'YURIRIA', value: 'YURIRIA' }
      ]
    }
  },

  computed: {
    ...mapState({
      student: state => state.user
    })
  },

  mounted () {
    this.loadProfile()
  },

  methods: {
    capitalizeText (text) {
      if (!text) {
        return ''
      }
      return text.toUpperCase()
    },

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

    async loadProfile () {
      try {
        const res = await this.$axios.get('/users/profile')
        if (res.data.success) {
          this.profile = {
            id: res.data.user.id,
            nua: res.data.user.nua,
            name: res.data.user.name,
            lastName: res.data.user.lastName,
            secondLastName: res.data.user.secondLastName,
            email: res.data.user.email,
            phone: res.data.user.phone,
            career: res.data.user.career,
            sede: res.data.user.sede,
            profilePicture: res.data.user.use_profilePicture,
            createdAt: res.data.user.createdAt,
            updatedAt: res.data.user.updatedAt
          }
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL CARGAR EL PERFIL')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CARGAR EL PERFIL')
      }
    },

    openEditDialog () {
      this.editData = {
        nua: this.profile.nua,
        name: this.profile.name,
        lastName: this.profile.lastName,
        secondLastName: this.profile.secondLastName,
        email: this.profile.email,
        phone: this.profile.phone,
        career: this.profile.career,
        sede: this.profile.sede
      }
      this.dialogEdit = true
    },

    closeEditDialog () {
      this.dialogEdit = false
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
    },

    async saveProfile () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true
      try {
        const phone = this.editData.phone.replace(/\s/g, '')
        const data = {
          nua: this.editData.nua,
          name: this.editData.name,
          lastName: this.editData.lastName,
          secondLastName: this.editData.secondLastName,
          email: this.editData.email,
          phone,
          career: this.editData.career,
          sede: this.editData.sede
        }

        const res = await this.$axios.put('/users/update-profile', data)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', 'PERFIL ACTUALIZADO CORRECTAMENTE')
          await this.loadProfile()
          this.closeEditDialog()
        } else {
          this.mostrarAlerta('red', 'error', res.data.message || 'ERROR AL ACTUALIZAR EL PERFIL')
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL ACTUALIZAR EL PERFIL')
      } finally {
        this.loading = false
      }
    },

    formatPhone (phone) {
      if (!phone) { return 'N/A' }
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    },

    formatDate (date) {
      if (!date) { return 'N/A' }
      // Si la fecha ya viene en formato DD/MM/AAAA, devolverla tal cual
      if (typeof date === 'string' && date.includes('/')) {
        return date
      }
      // Si viene en otro formato, intentar parsearlo
      return moment(date).format('DD/MM/YYYY')
    },

    getCareerName (careerCode) {
      return this.careers[careerCode] || careerCode
    }
  }
}
</script>

<style scoped>
.info-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.field-value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.headline {
  font-weight: 700;
}
</style>
