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
      <v-col cols="12" md="8" lg="6">
        <v-card class="rounded-xl" elevation="3">
          <!-- Header del perfil -->
          <v-card-title class="bg-blue white--text py-4 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon left color="white" large>
                mdi-account-circle
              </v-icon>
              <span class="headline">INFORMACIÓN DEL PERFIL</span>
            </div>
            <v-chip
              :color="getRoleColor(profile.role)"
              dark
              class="font-weight-bold"
            >
              <v-icon left small>
                {{ getRoleIcon(profile.role) }}
              </v-icon>
              {{ getRoleLabel(profile.role) }}
            </v-chip>
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

              <v-col cols="12" sm="4">
                <div class="info-field">
                  <span class="field-label">NOMBRE(S):</span>
                  <span class="field-value">{{ profile.name }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="info-field">
                  <span class="field-label">APELLIDO PATERNO:</span>
                  <span class="field-value">{{ profile.lastName }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="info-field">
                  <span class="field-label">APELLIDO MATERNO:</span>
                  <span class="field-value">{{ profile.secondLastName || 'N/A' }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">TELÉFONO:</span>
                  <span class="field-value">{{ formatPhone(profile.phone) }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">CORREO ELECTRÓNICO:</span>
                  <span class="field-value">{{ profile.email }}</span>
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
                  <span class="field-label">FECHA DE REGISTRO:</span>
                  <span class="field-value">{{ formatDate(profile.createdAt) }}</span>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-field">
                  <span class="field-label">ÚLTIMA ACTUALIZACIÓN:</span>
                  <span class="field-value">{{ formatDate(profile.updatedAt) }}</span>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="info-field">
                  <span class="field-label">ESTADO DE LA CUENTA:</span>
                  <v-chip
                    :color="profile.active ? 'success' : 'error'"
                    small
                    dark
                    class="ml-2"
                  >
                    {{ profile.active ? 'ACTIVA' : 'INACTIVA' }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions v-if="canEditProfile" class="pa-6 pt-0">
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

  layout: 'admin',

  middleware: 'auth-admin',

  data () {
    return {
      moment,
      profile: {
        id: null,
        name: '',
        lastName: '',
        secondLastName: '',
        email: '',
        phone: '',
        role: '',
        active: true,
        profilePicture: null,
        createdAt: null,
        updatedAt: null
      },
      dialogEdit: false,
      dialogLegend: false,
      valid: false,
      loading: false,
      editData: {
        name: '',
        lastName: '',
        secondLastName: '',
        email: '',
        phone: ''
      },

      // Reglas de validación
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',
      emailRule: value => /.+@.+\..+/.test(value) || 'CORREO ELECTRÓNICO INVÁLIDO',
      phoneRule: (value) => {
        const phone = value ? value.replace(/\s/g, '') : ''
        return phone.length === 10 || 'EL TELÉFONO DEBE TENER 10 DÍGITOS'
      }
    }
  },

  computed: {
    ...mapState({
      admin: state => state.admin
    }),
    canEditProfile () {
      // Superadmin y Admin pueden editar su propio perfil
      return ['superadmin', 'admin'].includes(this.profile.role)
    }
  },

  mounted () {
    this.loadProfile()
  },

  methods: {
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
        const res = await this.$axios.get('/admin/profile')
        if (res.data.success) {
          this.profile = {
            id: res.data.admin.id,
            name: res.data.admin.name,
            lastName: res.data.admin.lastName,
            secondLastName: res.data.admin.secondLastName,
            email: res.data.admin.email,
            phone: res.data.admin.phone,
            role: res.data.admin.role,
            active: res.data.admin.active,
            profilePicture: res.data.admin.adm_profilePicture,
            createdAt: res.data.admin.createdAt,
            updatedAt: res.data.admin.updatedAt
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
        name: this.profile.name,
        lastName: this.profile.lastName,
        secondLastName: this.profile.secondLastName,
        email: this.profile.email,
        phone: this.profile.phone
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
          name: this.editData.name,
          lastName: this.editData.lastName,
          secondLastName: this.editData.secondLastName,
          email: this.editData.email,
          phone
        }

        const res = await this.$axios.put('/admin/update-profile', data)
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

    getRoleLabel (role) {
      const roles = {
        superadmin: 'SUPERADMIN',
        admin: 'ADMIN',
        validador: 'VALIDADOR',
        consulta: 'CONSULTA'
      }
      return roles[role] || role
    },

    getRoleIcon (role) {
      const icons = {
        superadmin: 'mdi-crown',
        admin: 'mdi-account-tie',
        validador: 'mdi-check-decagram',
        consulta: 'mdi-eye'
      }
      return icons[role] || 'mdi-account'
    },

    getRoleColor (role) {
      const colors = {
        superadmin: 'yellow darken-2',
        admin: 'blue darken-2',
        validador: 'green darken-2',
        consulta: 'grey darken-2'
      }
      return colors[role] || 'grey'
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
