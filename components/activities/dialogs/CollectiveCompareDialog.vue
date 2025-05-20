<template>
  <v-dialog
    v-model="show"
    persistent
    style="overflow-y: hidden;"
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          COMPARAR ASISTENCIA VS PARTICIPANTES REGISTRADOS
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3 class="text-center subtitle black--text">
          COMPARACIÓN DE REGISTROS DEL EVENTO:
          <br>
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ activityName.toUpperCase() }}
          </strong>
        </h3>
      </v-card-text>

      <v-card-text class="text-center black--text">
        <v-row>
          <!-- Panel izquierdo: Lista de participantes -->
          <v-col cols="12" md="5">
            <v-card outlined class="mb-4">
              <v-card-title>
                <strong class="subtitle">
                  PARTICIPANTES REGISTRADOS
                </strong>
              </v-card-title>

              <!-- Barra de acciones para participantes -->
              <v-card-text class="py-0">
                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="d-flex flex-wrap justify-center align-center">
                      <!-- Modo normal -->
                      <div v-if="!deleteMode" class="d-flex">
                        <v-btn
                          elevation="0"
                          class="white--text rounded-pill"
                          color="red"
                          @click="activateDeleteMode"
                        >
                          <v-icon left size="18">
                            mdi-delete-outline
                          </v-icon>
                          ELIMINAR REGISTROS
                        </v-btn>
                      </div>

                      <!-- Modo eliminación -->
                      <div v-else class="d-flex flex-wrap w-100 justify-center">
                        <div>
                          <v-btn
                            elevation="0"
                            class="white--text rounded-pill"
                            color="red"
                            :disabled="selectedParticipants.length === 0"
                            @click="confirmDeleteParticipants"
                          >
                            <v-icon left size="18">
                              mdi-delete-outline
                            </v-icon>
                            ELIMINAR SELECCIÓN
                          </v-btn>

                          <v-btn
                            text
                            @click="cancelDeleteMode"
                          >
                            CANCELAR
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- Tabla de participantes -->
              <v-data-table
                v-model="selectedParticipants"
                :headers="currentParticipantsHeaders"
                :items="participants"
                :show-select="deleteMode"
                item-key="id"
                :footer-props="footerProps"
                :items-per-page="5"
                :search="searchParticipants"
                dense
                class="elevation-0 pa-4"
              >
                <!-- Búsqueda -->
                <template #top>
                  <v-text-field
                    v-model="searchParticipants"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="BUSCAR PARTICIPANTE POR NOMBRE O NUA"
                    single-line
                    hide-details
                    clearable
                    outlined
                    dense
                    class="py-4"
                  />
                </template>

                <!-- Nombre formateado -->
                <template #[`item.fullName`]="{ item }">
                  <span class="text-uppercase">{{ item.fullName || item.name }}</span>
                </template>

                <!-- Carrera formateada -->
                <template #[`item.career`]="{ item }">
                  <span class="text-uppercase">{{ item.career }}</span>
                </template>

                <!-- Sin datos -->
                <template #no-data>
                  <p class="text-center pa-4">
                    NO HAY PARTICIPANTES REGISTRADOS
                  </p>
                </template>
              </v-data-table>
            </v-card>

            <!-- Panel para añadir participantes -->
            <v-card outlined>
              <v-card-title>
                <strong class="subtitle">
                  AÑADIR PARTICIPANTES
                </strong>
                <v-spacer />
                <v-badge
                  v-if="selectedStudents.length > 0"
                  :content="selectedStudents.length"
                  color="success"
                  overlap
                >
                  <v-icon color="success">
                    mdi-account-multiple-plus
                  </v-icon>
                </v-badge>
              </v-card-title>

              <v-card-text>
                <!-- Búsqueda de alumnos -->
                <v-autocomplete
                  v-model="selectedStudent"
                  :items="availableStudents"
                  :filter="customFilter"
                  item-text="fullName"
                  item-value="id"
                  placeholder="INGRESA NOMBRE O NUA DEL ALUMNO"
                  prepend-inner-icon="mdi-account-search"
                  return-object
                  outlined
                  dense
                  clearable
                  :disabled="addMode"
                  @change="handleStudentSelected"
                >
                  <template #selection="{ item }">
                    <span class="text-uppercase">{{ item.fullName }} - {{ item.nua }}</span>
                  </template>

                  <template #item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title class="text-uppercase">
                        {{ item.fullName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        NUA: {{ item.nua }} | Carrera: {{ item.career }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>

                <!-- Estudiantes seleccionados para agregar -->
                <div v-if="selectedStudents.length > 0">
                  <div class="d-flex justify-space-between align-center my-2">
                    <div class="subtitle-2 font-weight-medium">
                      ALUMNOS SELECCIONADOS PARA AGREGAR:
                    </div>
                    <div>
                      <v-btn
                        color="success"
                        class="mr-2"
                        @click="confirmAddStudents"
                      >
                        <v-icon left>
                          mdi-plus-circle
                        </v-icon>
                        AGREGAR SELECCIÓN
                      </v-btn>

                      <v-btn
                        text
                        @click="cancelAddMode"
                      >
                        Cancelar
                      </v-btn>
                    </div>
                  </div>

                  <v-chip-group column>
                    <v-chip
                      v-for="student in selectedStudents"
                      :key="student.id"
                      close
                      color="success"
                      text-color="white"
                      @click:close="removeStudentSelection(student)"
                    >
                      {{ student.fullName.toUpperCase() }} - {{ student.nua }}
                    </v-chip>
                  </v-chip-group>
                </div>

                <div v-else-if="addMode" class="text-center py-4">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  />
                  <div class="mt-2">
                    PROCESANDO...
                  </div>
                </div>

                <div v-else class="text-center grey--text text--darken-1 py-4">
                  BUSCA Y SELECCIONA ALUMNOS PARA AGREGAR A LA ACTIVIDAD
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Panel derecho: Visualizador de PDF -->
          <v-col cols="12" md="7">
            <v-card outlined height="100%">
              <v-card-title>
                <strong class="subtitle">
                  FORMATO DE ASISTENCIA
                </strong>
              </v-card-title>

              <v-card-text class="pdf-container">
                <object
                  :data="assistance"
                  type="application/pdf"
                  width="100%"
                  height="650px"
                  class="pdf-viewer"
                >
                  <div class="pdf-fallback">
                    <strong class="subtitle">TU NAVEGADOR NO PUEDE MOSTRAR EL PDF</strong>
                    <br>
                    <v-btn
                      color="#fed55e"
                      class="mt-4"
                      rounded
                      elevation="0"
                      :href="assistance"
                      target="_blank"
                    >
                      <v-icon left>mdi-open-in-new</v-icon>
                      <strong>Ver PDF en nueva pestaña</strong>
                    </v-btn>
                  </div>
                </object>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Confirmación de diálogo -->
      <v-dialog v-model="confirmDialog" max-width="450">
        <v-card>
          <v-card-title class="headline">
            {{ confirmTitle }}
          </v-card-title>
          <v-card-text>
            {{ confirmMessage }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey darken-1" text @click="confirmDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="red darken-1" text @click="confirmAction">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Botones de acción -->
      <v-card-actions class="d-flex justify-center pt-0 mt-0 pb-6">
        <v-btn
          color="#fed55e"
          rounded
          elevation="0"
          @click="close"
        >
          <strong>CERRAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    activityName: {
      type: String,
      required: true
    },
    participants: {
      type: Array,
      required: true,
      default: () => []
    },
    allStudents: {
      type: Array,
      required: true,
      default: () => []
    },
    assistance: {
      type: String,
      required: true
    },
    activityId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      show: true,
      deleteMode: false,
      addMode: false,
      selectedParticipants: [],
      selectedStudents: [],
      selectedStudent: null,
      searchParticipants: '',
      confirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmType: '',

      participantsHeaders: [
        { text: 'NOMBRE DEL ALUMNO', align: 'center', value: 'fullName', sortable: true },
        { text: 'NUA', align: 'center', value: 'nua', sortable: true },
        { text: 'CARRERA', align: 'center', value: 'career', sortable: true }
      ],

      deleteHeaders: [
        { text: 'NOMBRE DEL ALUMNO', align: 'center', value: 'fullName', sortable: true },
        { text: 'NUA', align: 'center', value: 'nua', sortable: true },
        { text: 'CARRERA', align: 'center', value: 'career', sortable: true }
      ],

      footerProps: {
        'items-per-page-options': [5, 10, 15, 20],
        'items-per-page-text': 'REGISTROS POR PÁGINA',
        'items-per-page': 5
      }
    }
  },

  computed: {
    // Headers dependiendo del modo de eliminación
    currentParticipantsHeaders () {
      return this.deleteMode ? this.deleteHeaders : this.participantsHeaders
    },

    // Estudiantes disponibles para agregar (filtrados)
    availableStudents () {
      // Excluir estudiantes que ya están en participantes
      const participantIds = this.participants.map(p => p.id)
      return this.allStudents.filter(student =>
        !participantIds.includes(student.id) &&
        !this.selectedStudents.some(s => s.id === student.id)
      )
    },

    // Verificar si todos los participantes están seleccionados
    allSelected () {
      return this.participants.length > 0 &&
             this.selectedParticipants.length === this.participants.length
    }
  },

  methods: {
    // Activar modo de eliminación
    activateDeleteMode () {
      this.deleteMode = true
      this.selectedParticipants = []
    },

    // Cancelar modo de eliminación
    cancelDeleteMode () {
      this.deleteMode = false
      this.selectedParticipants = []
    },

    // Cancelar modo de adición
    cancelAddMode () {
      this.addMode = false
      this.selectedStudents = []
      this.selectedStudent = null
    },

    // Seleccionar/deseleccionar todos los participantes
    toggleSelectAll () {
      if (this.allSelected) {
        this.selectedParticipants = []
      } else {
        this.selectedParticipants = [...this.participants]
      }
    },

    // Manejar selección de estudiante del autocomplete
    handleStudentSelected () {
      if (this.selectedStudent) {
        // Verificar si ya existe en los seleccionados
        if (!this.selectedStudents.some(s => s.id === this.selectedStudent.id)) {
          this.selectedStudents.push(this.selectedStudent)
        }
        this.selectedStudent = null
      }
    },

    // Eliminar estudiante de la lista de seleccionados
    removeStudentSelection (student) {
      this.selectedStudents = this.selectedStudents.filter(s => s.id !== student.id)
    },

    // Filtro personalizado para autocompletado
    customFilter (item, queryText) {
      const text = queryText.toLowerCase()
      return (
        item.nua.toLowerCase().includes(text) ||
        item.fullName.toLowerCase().includes(text)
      )
    },

    // Confirmar eliminación de participantes
    confirmDeleteParticipants () {
      if (this.selectedParticipants.length === 0) { return }

      this.confirmTitle = '¿Eliminar participantes seleccionados?'
      this.confirmMessage = `¿Estás seguro de eliminar ${this.selectedParticipants.length} participante(s) de la actividad?`
      this.confirmType = 'delete'
      this.confirmDialog = true
    },

    // Confirmar adición de estudiantes
    confirmAddStudents () {
      if (this.selectedStudents.length === 0) { return }

      this.confirmTitle = '¿Agregar participantes seleccionados?'
      this.confirmMessage = `¿Estás seguro de agregar ${this.selectedStudents.length} alumno(s) a la actividad?`
      this.confirmType = 'add'
      this.confirmDialog = true
    },

    // Eliminar un solo participante
    removeParticipant (participant) {
      this.selectedParticipants = [participant]
      this.confirmDeleteParticipants()
    },

    // Ejecutar acción confirmada
    confirmAction () {
      this.confirmDialog = false

      if (this.confirmType === 'delete') {
        this.processDeleteParticipants()
      } else if (this.confirmType === 'add') {
        this.processAddStudents()
      }
    },

    // Procesar eliminación de participantes
    processDeleteParticipants () {
      this.addMode = true // Mostrar indicador de carga

      // Obtener IDs de participantes a eliminar
      const participantIds = this.selectedParticipants.map(p => p.id)

      // Emitir evento para que el componente padre maneje la eliminación
      this.$emit('action', {
        action: 'deleteParticipants',
        activityId: this.activityId,
        participantIds
      })

      // Simular tiempo de procesamiento (reemplazar con el manejo real)
      setTimeout(() => {
        this.addMode = false
        this.deleteMode = false
        this.selectedParticipants = []
      }, 1000)
    },

    // Procesar adición de estudiantes
    processAddStudents () {
      this.addMode = true // Mostrar indicador de carga

      // Obtener información de estudiantes a agregar
      const studentsToAdd = this.selectedStudents.map(student => ({
        id: student.id,
        nua: student.nua,
        fullName: student.fullName,
        career: student.career
      }))

      // Emitir evento para que el componente padre maneje la adición
      this.$emit('action', {
        action: 'addParticipants',
        activityId: this.activityId,
        students: studentsToAdd
      })

      // Simular tiempo de procesamiento (reemplazar con el manejo real)
      setTimeout(() => {
        this.addMode = false
        this.selectedStudents = []
      }, 1000)
    },

    // Cerrar diálogo
    close () {
      // Si hay operaciones en curso, preguntar antes de cerrar
      if (this.deleteMode || this.addMode || this.selectedStudents.length > 0) {
        this.confirmTitle = '¿Cerrar sin guardar cambios?'
        this.confirmMessage = 'Tienes cambios pendientes. ¿Estás seguro de cerrar sin guardarlos?'
        this.confirmType = 'close'
        this.confirmDialog = true
      } else {
        this.$emit('action', { action: 'close' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-container {
  height: 650px;
  overflow: hidden;
}

.pdf-viewer {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.pdf-fallback {
  padding: 30px;
  text-align: center;
}

.w-100 {
  width: 100%;
}

::v-deep .v-data-table td {
  font-size: 13px;
}

::v-deep .v-chip--close .v-icon {
  color: white !important;
  font-size: 16px;
}
</style>
