<template>
  <v-col cols="12">
    <!-- Título -->
    <v-row align="center" justify="center">
      <h1 class="my-5 d-flex align-center">
        INICIO
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

    <!-- Sección de Bienvenida -->
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-xl" elevation="3">
          <v-card-text class="bg-blue white--text py-6">
            <v-row align="center">
              <v-col cols="12" md="2" class="text-center">
                <v-avatar size="100" color="#a3915f">
                  <v-icon size="60" color="white">
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="12" md="10">
                <h1 class="text-h4 font-weight-bold mb-2">
                  ¡BIENVENIDO(A), {{ studentName }}!
                </h1>
                <p class="text-h6 mb-1">
                  <v-icon color="white" class="mr-2">
                    mdi-school
                  </v-icon>
                  {{ careerName }}
                </p>
                <p class="text-subtitle-1">
                  <v-icon color="white" class="mr-2">
                    mdi-map-marker
                  </v-icon>
                  Sede {{ studentSede }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de Códigos QR (MOVIDA ARRIBA) -->
    <v-row ref="qrSection" class="mt-4">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4" style="color: #07538a">
          <v-icon color="#07538a" class="mr-2">
            mdi-qrcode
          </v-icon>
          CÓDIGOS QR DE TU CARRERA
        </h2>
      </v-col>

      <v-col v-if="loading" cols="12" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="#07538a"
          size="64"
        />
        <p class="text-h6 grey--text mt-4">
          CARGANDO CÓDIGOS QR...
        </p>
      </v-col>

      <v-col v-else-if="qrCodes.length === 0" cols="12" class="text-center py-8">
        <v-icon size="100" color="grey lighten-1">
          mdi-qrcode-remove
        </v-icon>
        <p class="text-h6 grey--text mt-4">
          NO HAY CÓDIGOS QR DISPONIBLES PARA TU CARRERA
        </p>
        <p class="text-subtitle-1 grey--text">
          Por favor, contacta a la coordinación para más información.
        </p>
      </v-col>

      <v-col
        v-for="qr in qrCodes"
        v-else
        :key="qr.qr_id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="rounded-xl" elevation="3">
          <v-card-title class="bg-area white--text py-3 justify-center">
            <v-icon left color="white">
              mdi-tag
            </v-icon>
            <span class="text-center">{{ qr.qr_area }}</span>
          </v-card-title>

          <v-card-text class="pa-4 text-center">
            <v-img
              :src="getImageUrl(qr.qr_image_path)"
              max-width="250"
              class="mx-auto rounded elevation-2 qr-image"
              @click="openQRDialog(qr)"
            />

            <p v-if="qr.qr_description" class="text-subtitle-2 grey--text mt-3 mb-0">
              {{ qr.qr_description }}
            </p>

            <p class="text-caption grey--text mt-2 mb-0">
              {{ getAreaFullName(qr.qr_area) }}
            </p>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn
              color="#07538a"
              text
              @click="openQRDialog(qr)"
            >
              <v-icon left>
                mdi-eye
              </v-icon>
              VER QR
            </v-btn>

            <v-btn
              color="#a3915f"
              text
              @click="downloadQR(qr)"
            >
              <v-icon left>
                mdi-download
              </v-icon>
              DESCARGAR
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de Accesos Rápidos (MOVIDA ABAJO) -->
    <v-row class="mt-4">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4" style="color: #07538a">
          <v-icon color="#07538a" class="mr-2">
            mdi-lightning-bolt
          </v-icon>
          ACCESOS RÁPIDOS
        </h2>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card
          class="rounded-xl text-center py-6 cursor-pointer hover-card"
          elevation="2"
          @click="$router.push('/student/profile')"
        >
          <v-icon size="64" color="#07538a">
            mdi-account
          </v-icon>
          <h3 class="mt-4 text-h6 font-weight-bold">
            MI PERFIL
          </h3>
          <p class="text-subtitle-2 grey--text mt-2">
            Ver y editar información personal
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card
          class="rounded-xl text-center py-6 cursor-pointer hover-card"
          elevation="2"
          @click="$router.push('/student/dashboard')"
        >
          <v-icon size="64" color="#a3915f">
            mdi-book-open-page-variant
          </v-icon>
          <h3 class="mt-4 text-h6 font-weight-bold">
            MIS ACTIVIDADES
          </h3>
          <p class="text-subtitle-2 grey--text mt-2">
            Registrar y consultar actividades
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card
          class="rounded-xl text-center py-6 cursor-pointer hover-card"
          elevation="2"
          @click="scrollToQR"
        >
          <v-icon size="64" color="#fed55e">
            mdi-qrcode-scan
          </v-icon>
          <h3 class="mt-4 text-h6 font-weight-bold">
            CÓDIGOS QR
          </h3>
          <p class="text-subtitle-2 grey--text mt-2">
            Códigos QR de tu carrera
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de Avisos -->
    <v-row class="mt-4">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4" style="color: #07538a">
          <v-icon color="#07538a" class="mr-2">
            mdi-bell-ring
          </v-icon>
          AVISOS IMPORTANTES
        </h2>
      </v-col>

      <v-col cols="12">
        <v-alert
          type="info"
          colored-border
          border="left"
          elevation="2"
          class="rounded-lg"
        >
          <div class="d-flex align-center">
            <v-icon color="info" size="32" class="mr-4">
              mdi-information
            </v-icon>
            <div>
              <h3 class="text-h6 font-weight-bold mb-2">
                Registro de Actividades CAFÉ
              </h3>
              <p class="mb-0">
                Recuerda registrar todas tus actividades complementarias en el sistema.
                Escanea los códigos QR correspondientes al área de cada actividad para facilitar tu registro.
              </p>
            </div>
          </div>
        </v-alert>
      </v-col>

      <v-col cols="12">
        <v-alert
          type="warning"
          colored-border
          border="left"
          elevation="2"
          class="rounded-lg"
        >
          <div class="d-flex align-center">
            <v-icon color="warning" size="32" class="mr-4">
              mdi-clock-alert
            </v-icon>
            <div>
              <h3 class="text-h6 font-weight-bold mb-2">
                Fechas de Registro
              </h3>
              <p class="mb-0">
                Verifica los periodos activos para el registro de actividades.
                Solo podrás registrar actividades durante los periodos habilitados por la coordinación.
              </p>
            </div>
          </div>
        </v-alert>
      </v-col>

      <v-col cols="12">
        <v-alert
          type="success"
          colored-border
          border="left"
          elevation="2"
          class="rounded-lg"
        >
          <div class="d-flex align-center">
            <v-icon color="success" size="32" class="mr-4">
              mdi-check-circle
            </v-icon>
            <div>
              <h3 class="text-h6 font-weight-bold mb-2">
                Validación de Evidencias
              </h3>
              <p class="mb-0">
                Asegúrate de subir evidencias claras y legibles de tus actividades.
                Las evidencias serán revisadas por la coordinación para su validación.
              </p>
            </div>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Dialog Ver QR Grande -->
    <v-dialog v-model="dialogQR" max-width="600">
      <v-card class="rounded-xl">
        <v-card-title class="bg-blue white--text">
          <v-icon left color="white">
            mdi-qrcode
          </v-icon>
          CÓDIGO QR - {{ selectedQR ? selectedQR.qr_area : '' }}
        </v-card-title>

        <v-card-text class="pa-6 text-center">
          <v-img
            v-if="selectedQR"
            :src="getImageUrl(selectedQR.qr_image_path)"
            max-width="450"
            class="mx-auto rounded elevation-3"
          />

          <div v-if="selectedQR" class="mt-4">
            <h3 class="text-h6 mb-2">
              {{ getAreaFullName(selectedQR.qr_area) }}
            </h3>
            <p v-if="selectedQR.qr_description" class="grey--text">
              {{ selectedQR.qr_description }}
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="justify-center pb-4">
          <v-btn
            color="grey"
            text
            @click="dialogQR = false"
          >
            CERRAR
          </v-btn>
          <v-btn
            color="#a3915f"
            dark
            rounded
            @click="downloadQR(selectedQR)"
          >
            <v-icon left>
              mdi-download
            </v-icon>
            DESCARGAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de ayuda -->
    <LegendHelpDialog v-model="dialogLegend" page="student-home" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex'
import LegendHelpDialog from '~/components/shared/LegendHelpDialog.vue'

export default {
  components: {
    LegendHelpDialog
  },

  layout: 'student',

  middleware: 'auth-student',

  data () {
    return {
      loading: false,
      dialogQR: false,
      dialogLegend: false,
      qrCodes: [],
      selectedQR: null,

      areas: {
        'DP/VSS': 'DESARROLLO PERSONAL / VIDA SALUDABLE Y SUSTENTABLE',
        'RS/VCI': 'RESPONSABILIDAD SOCIAL / VOCACION CIENTIFICA Y TECNOLOGICA',
        'CEE/EIE': 'CULTURA EMPRENDEDORA / EMPRESARIAL / ESPÍRITU INNOVADOR Y EMPRENDEDOR',
        'FCI/ICP': 'FORMACIÓN CULTURAL E INTEGRAL / INTERCULTURALIDAD Y CONVIVENCIA PARA LA PAZ',
        AC: 'AREA COMPLEMENTARIA'
      },

      careers: {
        IS75LI0103: 'INGENIERÍA MECÁNICA',
        IS75LI0203: 'INGENIERÍA ELÉCTRICA',
        IS75LI0303: 'INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA',
        IS75LI03Y3: 'INGENIERÍA EN COMUNICACIONES Y ELECTRÓNICA (Yuriria)',
        IS75LI0403: 'INGENIERÍA EN MECATRÓNICA',
        IS75LI0502: 'INGENIERÍA EN SISTEMAS COMPUTACIONALES',
        IS75LI05Y2: 'INGENIERÍA EN SISTEMAS COMPUTACIONALES (Yuriria)',
        IS75LI0602: 'GESTIÓN EMPRESARIAL',
        IS75LI06Y2: 'GESTIÓN EMPRESARIAL (Yuriria)',
        IS75LI0702: 'ARTES DIGITALES',
        IS75LI0801: 'INGENIERÍA DE DATOS E INTELIGENCIA ARTIFICIAL',
        IS75LI08Y2: 'ENSEÑANZA DEL INGLÉS'
      }
    }
  },

  computed: {
    ...mapState({
      student: state => state.user
    }),

    studentName () {
      if (!this.student || typeof this.student !== 'object') {
        return 'ESTUDIANTE'
      }
      const name = this.student.name || this.student.use_name || ''
      const lastName = this.student.lastName || this.student.use_last_name || ''
      return name || lastName ? `${name} ${lastName}`.toUpperCase() : 'ESTUDIANTE'
    },

    careerName () {
      if (!this.student || typeof this.student !== 'object') {
        return 'Cargando...'
      }
      const career = this.student.career || this.student.use_career || ''
      return this.careers[career] || career || 'Carrera no definida'
    },

    studentSede () {
      if (!this.student || typeof this.student !== 'object') {
        return 'N/A'
      }
      return this.student.sede || this.student.use_sede || 'No definida'
    }
  },

  mounted () {
    // Debug: Verificar qué datos tiene el estudiante
    // eslint-disable-next-line no-console
    console.log('📊 Datos del estudiante en store:', this.student)
    // eslint-disable-next-line no-console
    console.log('👤 Nombre calculado:', this.studentName)
    // eslint-disable-next-line no-console
    console.log('🎓 Carrera calculada:', this.careerName)
    // eslint-disable-next-line no-console
    console.log('📍 Sede calculada:', this.studentSede)

    this.loadQRCodes()
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

    async loadQRCodes () {
      this.loading = true
      try {
        // eslint-disable-next-line no-console
        console.log('🔍 Intentando cargar QR codes...')
        const res = await this.$axios.get('/qr-codes/get-my-qr-codes')
        // eslint-disable-next-line no-console
        console.log('📦 Respuesta del backend:', res.data)

        if (res.data.success) {
          // Mapear los datos del backend al formato esperado por el frontend
          this.qrCodes = res.data.qrCodes.map(qr => ({
            qr_id: qr.id,
            qr_career: qr.career,
            qr_area: qr.area,
            // Normalizar la ruta: reemplazar barras invertidas por barras normales
            qr_image_path: qr.imagePath ? qr.imagePath.replace(/\\/g, '/') : '',
            qr_description: qr.description,
            qr_active: qr.active,
            qr_created_at: qr.createdAt,
            qr_updated_at: qr.updatedAt,
            qr_created_by: qr.createdBy
          }))
          // eslint-disable-next-line no-console
          console.log('✅ QR codes cargados:', this.qrCodes.length)
        } else {
          // eslint-disable-next-line no-console
          console.warn('⚠️ Backend respondió con success=false:', res.data.message)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Error al cargar QR codes:', error.response?.data || error.message)
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CARGAR LOS CÓDIGOS QR')
      } finally {
        this.loading = false
      }
    },

    openQRDialog (qr) {
      this.selectedQR = qr
      this.dialogQR = true
    },

    downloadQR (qr) {
      if (!qr) { return }
      const link = document.createElement('a')
      link.href = this.getImageUrl(qr.qr_image_path)
      link.download = `QR_${qr.qr_area}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    getAreaFullName (areaCode) {
      return this.areas[areaCode] || areaCode
    },

    getImageUrl (imagePath) {
      if (!imagePath) { return '' }
      // Asegurarse de que la ruta use barras normales
      const normalizedPath = imagePath.replace(/\\/g, '/')
      // Construir la URL completa
      return `${this.$axios.defaults.baseURL.replace('/api', '')}${normalizedPath}`
    },

    scrollToQR () {
      this.$refs.qrSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
</script>

<style scoped>
.bg-blue {
  background-color: #07538a;
}

.bg-area {
  background-color: #a3915f;
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.qr-image {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.qr-image:hover {
  transform: scale(1.05);
}
</style>
