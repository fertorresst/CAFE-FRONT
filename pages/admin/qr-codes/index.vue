<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1 class="my-5 d-flex align-center">
        GESTIÓN DE CÓDIGOS QR
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

    <!-- Filtros -->
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="filterCareer"
          :items="careerItems"
          label="FILTRAR POR CARRERA"
          outlined
          dense
          clearable
          prepend-inner-icon="mdi-school"
          @change="loadQRCodes"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="filterArea"
          :items="areaItems"
          label="FILTRAR POR ÁREA"
          outlined
          dense
          clearable
          prepend-inner-icon="mdi-tag"
          @change="loadQRCodes"
        />
      </v-col>
    </v-row>

    <!-- Botón agregar -->
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-btn
          color="#fed55e"
          elevation="0"
          rounded
          class="px-8"
          @click="openCreateDialog"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          <strong>AGREGAR QR CODE</strong>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de QR Codes -->
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-xl" elevation="3">
          <v-card-title class="bg-blue white--text">
            <v-icon left color="white">
              mdi-qrcode
            </v-icon>
            CÓDIGOS QR REGISTRADOS
          </v-card-title>

          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="qrCodes"
              :loading="loading"
              :items-per-page="10"
              class="elevation-0"
            >
              <!-- Columna de carrera -->
              <template #[`item.qr_career`]="{ item }">
                <v-chip small color="#07538a" dark>
                  {{ getCareerName(item.qr_career) }}
                </v-chip>
              </template>

              <!-- Columna de área -->
              <template #[`item.qr_area`]="{ item }">
                <v-chip small color="#a3915f" dark>
                  {{ item.qr_area }}
                </v-chip>
              </template>

              <!-- Columna de imagen QR -->
              <template #[`item.qr_image_path`]="{ item }">
                <v-img
                  :src="getImageUrl(item.qr_image_path)"
                  max-width="50"
                  max-height="50"
                  class="my-2 rounded"
                  @click="viewImage(item)"
                />
              </template>

              <!-- Columna de estado -->
              <template #[`item.qr_active`]="{ item }">
                <v-chip :color="item.qr_active ? 'success' : 'error'" small dark>
                  {{ item.qr_active ? 'ACTIVO' : 'INACTIVO' }}
                </v-chip>
              </template>

              <!-- Columna de acciones -->
              <template #[`item.actions`]="{ item }">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      @click="viewQRCode(item)"
                    >
                      <v-icon small>
                        mdi-eye
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ver</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="warning"
                      v-bind="attrs"
                      v-on="on"
                      @click="openEditDialog(item)"
                    >
                      <v-icon small>
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="openDeleteDialog(item)"
                    >
                      <v-icon small>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="downloadQR(item)"
                    >
                      <v-icon small>
                        mdi-download
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar</span>
                </v-tooltip>
              </template>

              <!-- Sin datos -->
              <template #no-data>
                <div class="text-center pa-4">
                  <v-icon size="64" color="grey lighten-1">
                    mdi-qrcode-scan
                  </v-icon>
                  <p class="text-h6 grey--text">
                    NO HAY CÓDIGOS QR REGISTRADOS
                  </p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Crear/Editar QR Code -->
    <v-dialog v-model="dialogForm" max-width="600" persistent>
      <v-card align="center" justify="center" class="rounded-xl">
        <v-card-text class="bg-blue white--text py-4">
          <h2>
            {{ isEditing ? 'EDITAR' : 'CREAR' }} CÓDIGO QR
          </h2>
        </v-card-text>

        <v-card-text class="py-3">
          <h3 class="text-justify subtitle black--text">
            {{ isEditing ? 'Actualiza' : 'Sube' }} el código QR para una carrera y área específica.
          </h3>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            class="px-6 black--text"
          >
            <h3>CARRERA *</h3>
            <v-select
              v-model="formData.career"
              :items="careerItems"
              :rules="[requiredRule]"
              :disabled="isEditing"
              outlined
              dense
              required
            />

            <h3>ÁREA *</h3>
            <v-select
              v-model="formData.area"
              :items="areaItems"
              :rules="[requiredRule]"
              :disabled="isEditing"
              outlined
              dense
              required
            />

            <h3>DESCRIPCIÓN</h3>
            <v-textarea
              v-model="formData.description"
              outlined
              dense
              rows="3"
              placeholder="Descripción opcional del código QR"
            />

            <h3>IMAGEN QR {{ isEditing ? '(opcional)' : '*' }}</h3>
            <v-file-input
              v-model="formData.qrImage"
              :rules="isEditing ? [] : [requiredRule, imageRule]"
              accept="image/png, image/jpeg, image/jpg"
              outlined
              dense
              prepend-icon=""
              prepend-inner-icon="mdi-image"
              show-size
              placeholder="Selecciona una imagen PNG o JPG"
              @change="previewImage"
            />

            <!-- Vista previa de la imagen -->
            <div v-if="imagePreview" class="text-center mb-4">
              <h3 class="mb-2">
                VISTA PREVIA:
              </h3>
              <v-img
                :src="imagePreview"
                max-width="100"
                max-height="100"
                class="mx-auto rounded elevation-2"
              />
            </div>

            <v-switch
              v-if="isEditing"
              v-model="formData.active"
              label="CÓDIGO QR ACTIVO"
              color="success"
              class="mt-0"
            />
          </v-form>
        </v-card-text>

        <v-card-text>
          <h3 class="text-justify subtitle black--text">
            Los campos marcados con (*) son obligatorios.
          </h3>
        </v-card-text>

        <v-card-actions class="d-flex justify-center pb-6">
          <v-btn
            color="black"
            rounded
            text
            @click="closeFormDialog"
          >
            <span class="text">CANCELAR</span>
          </v-btn>
          <v-btn
            color="#fed55e"
            rounded
            elevation="0"
            :disabled="!valid || loading"
            :loading="loading"
            @click="saveQRCode"
          >
            <strong>{{ isEditing ? 'ACTUALIZAR' : 'GUARDAR' }}</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Ver QR Code -->
    <v-dialog v-model="dialogView" max-width="500">
      <v-card class="rounded-xl">
        <v-card-title class="bg-blue white--text">
          <v-icon left color="white">
            mdi-qrcode
          </v-icon>
          CÓDIGO QR
        </v-card-title>

        <v-card-text class="pa-6 text-center">
          <v-img
            v-if="selectedQR"
            :src="getImageUrl(selectedQR.qr_image_path)"
            max-width="200"
            class="mx-auto rounded elevation-3"
          />

          <div v-if="selectedQR" class="mt-4">
            <h3 class="text-h6 mb-2">
              {{ getCareerName(selectedQR.qr_career) }}
            </h3>
            <v-chip color="#a3915f" dark class="mb-2">
              {{ selectedQR.qr_area }}
            </v-chip>
            <p v-if="selectedQR.qr_description" class="grey--text">
              {{ selectedQR.qr_description }}
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="justify-center pb-4">
          <v-btn
            color="grey"
            text
            @click="dialogView = false"
          >
            CERRAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Eliminar -->
    <v-dialog v-model="dialogDelete" max-width="400" persistent>
      <v-card align="center" justify="center" class="rounded-xl">
        <v-card-text class="bg-blue white--text py-4">
          <h2>
            ELIMINAR CÓDIGO QR
          </h2>
        </v-card-text>

        <v-card-text class="py-3">
          <h3 class="text-justify subtitle black--text">
            ¿Estás seguro de eliminar este código QR?
          </h3>
          <div v-if="selectedQR" class="text-center mt-3">
            <p><strong>Carrera:</strong> {{ getCareerName(selectedQR.qr_career) }}</p>
            <p><strong>Área:</strong> {{ selectedQR.qr_area }}</p>
          </div>
        </v-card-text>

        <v-card-text>
          <h3 class="text-justify subtitle black--text text-center">
            Esta acción no se puede deshacer.
          </h3>
        </v-card-text>

        <v-card-actions class="d-flex justify-center pb-6">
          <v-btn
            color="black"
            rounded
            text
            @click="dialogDelete = false"
          >
            <span class="text">CANCELAR</span>
          </v-btn>
          <v-btn
            color="error"
            rounded
            elevation="0"
            :loading="loading"
            @click="deleteQRCode"
          >
            <strong>ELIMINAR</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de ayuda -->
    <LegendHelpDialog v-model="dialogLegend" page="qr-codes" />
  </v-col>
</template>

<script>
import LegendHelpDialog from '~/components/shared/LegendHelpDialog.vue'

export default {
  components: {
    LegendHelpDialog
  },

  layout: 'admin',

  middleware: 'auth-admin',

  data () {
    return {
      loading: false,
      dialogForm: false,
      dialogView: false,
      dialogDelete: false,
      dialogLegend: false,
      valid: false,
      isEditing: false,
      qrCodes: [],
      selectedQR: null,
      imagePreview: null,
      filterCareer: null,
      filterArea: null,

      formData: {
        career: '',
        area: '',
        description: '',
        qrImage: null,
        active: true
      },

      headers: [
        { text: 'CARRERA', value: 'qr_career', sortable: true },
        { text: 'ÁREA', value: 'qr_area', sortable: true },
        { text: 'QR CODE', value: 'qr_image_path', sortable: false },
        { text: 'DESCRIPCIÓN', value: 'qr_description', sortable: false },
        { text: 'ESTADO', value: 'qr_active', sortable: true },
        { text: 'ACCIONES', value: 'actions', sortable: false, align: 'center' }
      ],

      // Reglas de validación
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',
      imageRule: (value) => {
        if (!value) { return true }
        const size = value.size / 1024 / 1024 // MB
        if (size > 5) {
          return 'LA IMAGEN DEBE PESAR MENOS DE 5MB'
        }
        return true
      },

      // Catálogo de carreras
      careers: {
        IS75LI0103: 'ING. MECÁNICA',
        IS75LI0203: 'ING. ELÉCTRICA',
        IS75LI0303: 'ING. EN COMUNICACIONES Y ELECTRÓNICA',
        IS75LI03Y3: 'ING. EN COMUNICACIONES Y ELECTRÓNICA (Yuriria)',
        IS75LI0403: 'ING. EN MECATRÓNICA',
        IS75LI0502: 'ING. EN SISTEMAS COMPUTACIONALES',
        IS75LI05Y2: 'ING. EN SISTEMAS COMPUTACIONALES (Yuriria)',
        IS75LI0602: 'GESTIÓN EMPRESARIAL',
        IS75LI06Y2: 'GESTIÓN EMPRESARIAL (Yuriria)',
        IS75LI0702: 'ARTES DIGITALES',
        IS75LI0801: 'ING. DE DATOS E INTELIGENCIA ARTIFICIAL',
        IS75LI08Y2: 'ENSEÑANZA DEL INGLÉS'
      },

      careerItems: [
        { text: 'ING. MECÁNICA', value: 'IS75LI0103' },
        { text: 'ING. ELÉCTRICA', value: 'IS75LI0203' },
        { text: 'ING. EN COMUNICACIONES Y ELECTRÓNICA', value: 'IS75LI0303' },
        { text: 'ING. EN COMUNICACIONES Y ELECTRÓNICA (Yuriria)', value: 'IS75LI03Y3' },
        { text: 'ING. EN MECATRÓNICA', value: 'IS75LI0403' },
        { text: 'ING. EN SISTEMAS COMPUTACIONALES', value: 'IS75LI0502' },
        { text: 'ING. EN SISTEMAS COMPUTACIONALES (Yuriria)', value: 'IS75LI05Y2' },
        { text: 'GESTIÓN EMPRESARIAL', value: 'IS75LI0602' },
        { text: 'GESTIÓN EMPRESARIAL (Yuriria)', value: 'IS75LI06Y2' },
        { text: 'ARTES DIGITALES', value: 'IS75LI0702' },
        { text: 'ING. DE DATOS E INTELIGENCIA ARTIFICIAL', value: 'IS75LI0801' },
        { text: 'ENSEÑANZA DEL INGLÉS', value: 'IS75LI08Y2' }
      ],

      areaItems: [
        { text: 'DP/VSS - DESARROLLO PERSONAL Y VINCULACIÓN SOCIAL SOLIDARIA', value: 'DP/VSS' },
        { text: 'RS/VCI - RESPONSABILIDAD SOCIAL Y VINCULACIÓN CON LA INDUSTRIA', value: 'RS/VCI' },
        { text: 'CEE/EIE - CULTURA EMPRENDEDORA Y EMPRESARIAL / ESPÍRITU INNOVADOR Y EMPRENDEDOR', value: 'CEE/EIE' },
        { text: 'FCI/ICP - FORMACIÓN CULTURAL E INTEGRAL / IDENTIDAD CULTURAL Y PATRIMONIO', value: 'FCI/ICP' },
        { text: 'AC - ACTIVIDADES CULTURALES', value: 'AC' }
      ]
    }
  },

  mounted () {
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
        const params = {}
        if (this.filterCareer) { params.career = this.filterCareer }
        if (this.filterArea) { params.area = this.filterArea }

        const res = await this.$axios.get('/qr-codes/get-all-qr-codes', { params })
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
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL CARGAR LOS CÓDIGOS QR')
      } finally {
        this.loading = false
      }
    },

    openCreateDialog () {
      this.isEditing = false
      this.formData = {
        career: '',
        area: '',
        description: '',
        qrImage: null,
        active: true
      }
      this.imagePreview = null
      this.dialogForm = true
    },

    openEditDialog (qr) {
      this.isEditing = true
      this.selectedQR = qr
      this.formData = {
        career: qr.qr_career,
        area: qr.qr_area,
        description: qr.qr_description || '',
        qrImage: null,
        active: qr.qr_active
      }
      this.imagePreview = this.getImageUrl(qr.qr_image_path)
      this.dialogForm = true
    },

    closeFormDialog () {
      this.dialogForm = false
      this.imagePreview = null
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
    },

    previewImage (file) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      } else if (this.isEditing && this.selectedQR) {
        this.imagePreview = this.getImageUrl(this.selectedQR.qr_image_path)
      } else {
        this.imagePreview = null
      }
    },

    async saveQRCode () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true
      try {
        const formData = new FormData()
        formData.append('career', this.formData.career)
        formData.append('area', this.formData.area)
        formData.append('description', this.formData.description || '')
        formData.append('active', this.formData.active ? 'true' : 'false')

        if (this.formData.qrImage) {
          formData.append('qrImage', this.formData.qrImage)
        }

        if (this.isEditing) {
          const res = await this.$axios.put(`/qr-codes/update-qr-code/${this.selectedQR.qr_id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', 'CÓDIGO QR ACTUALIZADO CORRECTAMENTE')
            await this.loadQRCodes()
            this.closeFormDialog()
          }
        } else {
          const res = await this.$axios.post('/qr-codes/create-qr-code', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', 'CÓDIGO QR CREADO CORRECTAMENTE')
            await this.loadQRCodes()
            this.closeFormDialog()
          }
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL GUARDAR EL CÓDIGO QR')
      } finally {
        this.loading = false
      }
    },

    viewQRCode (qr) {
      this.selectedQR = qr
      this.dialogView = true
    },

    viewImage (qr) {
      this.viewQRCode(qr)
    },

    openDeleteDialog (qr) {
      this.selectedQR = qr
      this.dialogDelete = true
    },

    async deleteQRCode () {
      this.loading = true
      try {
        const res = await this.$axios.delete(`/qr-codes/delete-qr-code/${this.selectedQR.qr_id}`)
        if (res.data.success) {
          this.mostrarAlerta('green', 'success', 'CÓDIGO QR ELIMINADO CORRECTAMENTE')
          await this.loadQRCodes()
          this.dialogDelete = false
        }
      } catch (error) {
        this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR AL ELIMINAR EL CÓDIGO QR')
      } finally {
        this.loading = false
      }
    },

    downloadQR (qr) {
      const link = document.createElement('a')
      link.href = this.getImageUrl(qr.qr_image_path)
      link.download = `QR_${qr.qr_career}_${qr.qr_area}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    getCareerName (careerCode) {
      return this.careers[careerCode] || careerCode
    },

    getImageUrl (imagePath) {
      if (!imagePath) { return '' }
      // Asegurarse de que la ruta use barras normales
      const normalizedPath = imagePath.replace(/\\/g, '/')
      // Construir la URL completa
      return `${this.$axios.defaults.baseURL.replace('/api', '')}${normalizedPath}`
    }
  }
}
</script>

<style scoped>
.bg-blue {
  background-color: #07538a;
}

.bg-default {
  background-color: #f5f5f5;
}
</style>
