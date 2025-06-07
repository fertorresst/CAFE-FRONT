<template>
  <v-dialog
    v-model="show"
    max-width="950"
    persistent
    style="overflow-y: hidden;"
  >
    <v-card
      elevation="0"
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          EDITAR ACTIVIDAD
        </h2>
      </v-card-text>

      <v-card-text class="my-3">
        <v-form
          ref="activityForm"
          v-model="validForm"
          lazy-validation
          class="px-6 py-6 black--text"
        >
          <v-row class="d-flex flex-wrap flex-row justify-center align-end">
            <v-col lg="6" md="6" sm="12">
              <h3>
                NOMBRE DE LA ACTIVIDAD
              </h3>
              <v-text-field
                v-model="currentActivityData.name"
                flat
                outlined
                dense
                type="text"
                :rules="[requiredRule]"
                required
              />
            </v-col>

            <v-col lg="6" md="6" sm="12">
              <h3>
                INSTITUCIÓN ORGANIZADORA
              </h3>
              <v-text-field
                v-model="currentActivityData.institution"
                flat
                outlined
                dense
                type="text"
                :rules="[requiredRule]"
                required
              />
            </v-col>
          </v-row>

          <v-row class="d-flex flex-wrap flex-row justify-center align-end">
            <v-col lg="3" md="6" sm="12">
              <h3>
                FECHA DE INICIO
              </h3>
              <v-text-field
                v-model="currentActivityData.dateStart"
                flat
                outlined
                dense
                type="date"
                :rules="[requiredRule]"
                :max="maxDate"
                required
              />
            </v-col>

            <v-col lg="3" md="6" sm="12">
              <h3>
                FECHA DE TÉRMINO
              </h3>
              <v-text-field
                v-model="currentActivityData.dateEnd"
                flat
                outlined
                dense
                type="date"
                :rules="[
                  requiredRule,
                  v => dateEndRule(v, currentActivityData.dateStart)
                ]"
                :min="currentActivityData.dateStart"
                :max="maxDate"
                required
              />
            </v-col>

            <v-col lg="3" md="6" sm="12">
              <h3>
                HORAS
              </h3>
              <v-text-field
                v-model="currentActivityData.hours"
                flat
                outlined
                dense
                type="number"
                :rules="[requiredRule]"
                :min="0"
                required
              />
            </v-col>

            <v-col lg="3" md="6" sm="12">
              <h3>
                ÁREA
              </h3>
              <v-select
                v-model="currentActivityData.area"
                :items="areas"
                flat
                outlined
                dense
                type="text"
                :rules="[requiredRule]"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col lg="6" md="6" sm="12">
              <v-card
                outlined
                flat
              >
                <v-card-text
                  class="text-center black--text"
                >
                  <h4>
                    EVIDENCIA 1
                  </h4>

                  <v-img
                    v-if="sizeEvidence === 1 || sizeEvidence === 2 || newEvidenceOne"
                    :src="newEvidenceOne ? getFileUrl(newEvidenceOne) : getEvidenceUrl(keepEvidence[0])"
                    contain
                    height="185"
                    class="mb-4"
                  />

                  <h4
                    v-else
                    class="my-5"
                    style="border-color: black; border-style: dashed; border-width: 1px; padding: 10px;"
                  >
                    <v-icon
                      class="mb-2"
                      size="50"
                      color="grey darken-1"
                    >
                      mdi-image-off
                    </v-icon>
                    <br>
                    SIN EVIDENCIA
                  </h4>

                  <strong>REEMPLAZAR EVIDENCIA 1</strong>
                  <v-file-input
                    v-model="newEvidenceOne"
                    flat
                    outlined
                    dense
                    small-chips
                    type="file"
                    :rules="[filesLimitRule, filesSizeRule]"
                    accept=".jpg, .jpeg, .png, .webp"
                    show-size
                    :max-size="3 * 1024 * 1024"
                    :counter="1"
                  />

                  <v-btn
                    color="red"
                    rounded
                    elevation="0"
                    :disabled="!newEvidenceOne && !(keepEvidence && keepEvidence[0])"
                    @click="deleteEvidence(1)"
                  >
                    <v-icon
                      class="mr-2"
                      size="20"
                      color="white"
                    >
                      mdi-delete
                    </v-icon>
                    <strong class="white--text">ELIMINAR EVIDENCIA 1</strong>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col lg="6" md="6" sm="12">
              <v-card
                outlined
                flat
              >
                <v-card-text
                  class="text-center black--text"
                >
                  <h4>
                    EVIDENCIA 2
                  </h4>

                  <v-img
                    v-if="sizeEvidence === 2 || newEvidenceTwo"
                    :src="newEvidenceTwo ? getFileUrl(newEvidenceTwo) : getEvidenceUrl(keepEvidence[1])"
                    contain
                    height="185"
                    class="mb-4"
                  />

                  <h4
                    v-else
                    class="my-5"
                    style="border-color: black; border-style: dashed; border-width: 1px; padding: 10px;"
                  >
                    <v-icon
                      class="mb-2"
                      size="50"
                      color="grey darken-1"
                    >
                      mdi-image-off
                    </v-icon>
                    <br>
                    SIN EVIDENCIA
                  </h4>

                  <strong>REEMPLAZAR EVIDENCIA 2</strong>
                  <v-file-input
                    v-model="newEvidenceTwo"
                    flat
                    outlined
                    dense
                    small-chips
                    type="file"
                    :rules="[filesLimitRule, filesSizeRule]"
                    accept=".jpg, .jpeg, .png, .webp"
                    show-size
                    :max-size="3 * 1024 * 1024"
                    :counter="1"
                  />

                  <v-btn
                    color="red"
                    rounded
                    elevation="0"
                    :disabled="!newEvidenceTwo && !(keepEvidence && keepEvidence[1])"
                    @click="deleteEvidence(2)"
                  >
                    <v-icon
                      class="mr-2"
                      size="20"
                      color="white"
                    >
                      mdi-delete
                    </v-icon>
                    <strong class="white--text">ELIMINAR EVIDENCIA 2</strong>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <br>

          <h5
            class="text-left subtitle my-0 py-0"
          >
            *Subir evidencias en formato .jpg, .jpeg, .png o .webp. Máximo 2 evidencias de 5 MB cada uno.
          </h5>
        </v-form>
      </v-card-text>

      <v-card-actions
        class="d-flex justify-center pb-6"
      >
        <v-btn
          color="black"
          rounded
          text
          @click="close()"
        >
          <strong>CANCELAR</strong>
        </v-btn>

        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="updateActivity()"
        >
          <strong>ACTUALIZAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    activityEdit: {
      type: Object,
      required: true,
      default: () => {}
    },
    areas: {
      type: Array,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    },
    dateEndRule: {
      type: Function,
      required: true
    },
    getSendActivities: {
      type: Function,
      required: true
    },
    mostrarAlerta: {
      type: Function,
      required: true
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      show: true,
      maxDate: this.moment().format('YYYY-MM-DD'),
      sizeEvidence: 0,

      // VARIABLES PARA EL FORMULARIO
      currentActivityData: {
        name: '',
        dateStart: '',
        dateEnd: '',
        hours: null,
        institution: '',
        area: ''
      },
      keepEvidence: null,
      newEvidenceOne: null,
      newEvidenceTwo: null,
      validForm: false,

      filesLimitRule: files =>
        !files ||
        (Array.isArray(files) ? files.length <= 1 : true) ||
        'SOLO SE PERMITE 1 ARCHIVO POR CAMPO',
      filesSizeRule: files =>
        !files ||
        (Array.isArray(files)
          ? files.every(file => file.size <= 3 * 1024 * 1024)
          : files.size <= 3 * 1024 * 1024) ||
        'TAMAÑO MÁXIMO DE 3 MB POR ARCHIVO'
    }
  },

  mounted () {
    // Hacemos una copia para no modificar el array original
    this.keepEvidence = this.activityEdit.evidenceLinks ? this.activityEdit.evidenceLinks.slice() : []
    this.sizeEvidence = this.keepEvidence.length
    this.currentActivityData = {
      name: this.activityEdit.name,
      dateStart: this.activityEdit.startDate,
      dateEnd: this.activityEdit.endDate,
      hours: this.activityEdit.hours,
      institution: this.activityEdit.institution,
      area: this.activityEdit.area
    }
  },

  methods: {
    close () {
      this.currentActivityData = {
        name: '',
        dateStart: '',
        dateEnd: '',
        hours: null,
        institution: '',
        area: ''
      }
      this.validForm = false
      this.keepEvidence = null
      this.newEvidenceOne = null
      this.newEvidenceTwo = null
      this.$refs.activityForm.reset()
      this.$emit('action', { action: 'cancel' })
    },

    async updateActivity () {
      try {
        // Validar el formulario
        if (!this.$refs.activityForm.validate()) {
          this.mostrarAlerta('red', 'error', 'ERROR AL VALIDAR EL FORMULARIO')
          return
        }

        // Validar que exista al menos una evidencia (nueva o conservada)
        const hayEvidencia =
          !!this.newEvidenceOne ||
          !!this.newEvidenceTwo ||
          (this.keepEvidence && this.keepEvidence.length > 0)

        if (!hayEvidencia) {
          window.alert('DEBES CARGAR AL MENOS UNA EVIDENCIA')
          return
        }

        // Preparar los datos para enviar
        const formData = new FormData()

        formData.append('name', this.currentActivityData.name)
        formData.append('institution', this.currentActivityData.institution)
        formData.append('dateStart', this.currentActivityData.dateStart)
        formData.append('dateEnd', this.currentActivityData.dateEnd)
        formData.append('hours', this.currentActivityData.hours)
        formData.append('area', this.currentActivityData.area)

        // Array para evidencias a conservar
        const keepEvidenceArr = []

        // Evidencia 1
        if (this.newEvidenceOne) {
          formData.append('files', this.newEvidenceOne)
        } else if (this.keepEvidence && this.keepEvidence[0]) {
          keepEvidenceArr.push(this.keepEvidence[0])
        }

        // Evidencia 2
        if (this.newEvidenceTwo) {
          formData.append('files', this.newEvidenceTwo)
        } else if (this.keepEvidence && this.keepEvidence[1]) {
          keepEvidenceArr.push(this.keepEvidence[1])
        }

        // Agregar el array como stringificado
        formData.append('keepEvidence', JSON.stringify(keepEvidenceArr))

        // Mostrar el contenido del FormData en consola
        for (const pair of formData.entries()) {
          console.log(pair[0] + ':', pair[1])
        }

        // Realizar la petición para enviar las actividades
        const url = `/evidence/update-activity-evidence/${this.activityEdit.id}`
        const res = await this.$axios.put(url, formData)

        if (res.data.success) {
          this.mostrarAlerta('green', 'success', res.data.message)
          this.close()
          this.getSendActivities()
        } else {
          throw new Error(res.data.message || 'ERROR AL ENVIAR ACTIVIDAD')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ERROR AL ENVIAR ACTIVIDAD:', error)
        this.mostrarAlerta('red', 'error', error)
      }
    },

    getEvidenceUrl (link) {
      return `http://localhost:5010${link}`
    },

    getFileUrl (file) {
      if (!file) { return '' }
      // Si es un array (por si acaso), toma el primer archivo
      if (Array.isArray(file)) { file = file[0] }
      return typeof file === 'string' ? file : URL.createObjectURL(file)
    },

    deleteEvidence (evidenceNumber) {
      if (evidenceNumber === 1) {
        // Si hay nueva evidencia cargada, la quitamos
        if (this.newEvidenceOne) {
          this.newEvidenceOne = null
          return
        }
        // Si hay evidencia original, la quitamos del arreglo
        if (this.keepEvidence && this.keepEvidence[0]) {
          this.keepEvidence.splice(0, 1)
          this.sizeEvidence = this.keepEvidence.length
        }
        return
      }

      if (evidenceNumber === 2) {
        if (this.newEvidenceTwo) {
          this.newEvidenceTwo = null
          return
        }
        if (this.keepEvidence && this.keepEvidence[1]) {
          this.keepEvidence.splice(1, 1)
          this.sizeEvidence = this.keepEvidence.length
        }
      }
    }
  }
}
</script>

<style scoped>
.subtitle {
  color: #666;
  font-size: 0.8rem;
}
</style>
