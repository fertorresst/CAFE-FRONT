<template>
  <v-expansion-panels v-model="panel" focusable>
    <v-expansion-panel>
      <v-expansion-panel-header class="bg-blue white--text">
        <h4>ALUMNOS PENDIENTES DE CONTACTAR</h4>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <h5
          v-if="tableOrigin === 'active'"
          class="subtitle mt-4"
        >
          LA TABLA DE CONTACTOS PENDIENTES NO ESTA DISPONIBLE PARA PERIODOS ACTIVOS. ES NECESARIO MARCAR EL PERIODO COMO 'PENDIENTE DE REVISIÓN' PARA PODER ACTIVAR ESTA FUNCIÓN
        </h5>

        <h5
          v-else-if="userContact.length === 0"
          class="subtitle mt-4"
        >
          NO HAY ALUMNOS PENDIENTES DE CONTACTAR
        </h5>

        <v-card-text
          v-else-if="userContact && tableOrigin !== 'active'"
        >
          <v-data-table
            :headers="headersContact"
            :items="userContact"
            class="elevation-0"
            sort-by="id"
            :items-per-page="5"
            :footer-props="footerProps"
          >
            <template #[`item.user.nua`]="{ item }">
              <strong>{{ item.user.nua }}</strong>
            </template>

            <template #[`item.user.name`]="{ item }">
              <span>{{ item.user.name.toUpperCase() }}</span>
            </template>

            <template #[`item.description`]="{ item }">
              <span>{{ item.description.toUpperCase() }}</span>
            </template>

            <template #[`item.status`]="{ item }">
              <div class="text-center">
                <v-icon
                  v-if="item.status === 'resolved'"
                  color="success"
                  small
                >
                  mdi-check-circle
                </v-icon>

                <v-icon
                  v-else-if="item.status === 'cancelled'"
                  color="error"
                  small
                >
                  mdi-close-circle
                </v-icon>

                <v-icon
                  v-else-if="item.status === 'in_progress'"
                  color="warning"
                  small
                >
                  mdi-progress-clock
                </v-icon>

                <v-icon
                  v-else-if="item.status === 'pending'"
                  color="grey"
                  small
                >
                  mdi-alert-circle
                </v-icon>
                <br>
                <strong
                  :class="{
                    'success--text': item.status === 'resolved',
                    'error--text': item.status === 'cancelled',
                    'warning--text': item.status === 'in_progress',
                    'grey--text': item.status === 'pending'
                  }"
                >
                  {{ getStatusText(item.status) }}
                </strong>
              </div>
            </template>

            <template #[`item.actions`]="{ item }">
              <div class="d-flex flex-nowrap align-stretch justify-center" @click.stop>
                <v-tooltip
                  color="info"
                  bottom
                >
                  <template #activator="{ on, attrs }">
                    <v-icon
                      color="info"
                      size="28"
                      v-bind="attrs"
                      v-on="on"
                      @click="emit(item, 'infoContactTable')"
                    >
                      mdi-information
                    </v-icon>
                  </template>
                  <span>VER DETALLES</span>
                </v-tooltip>

                <v-tooltip
                  color="success"
                  bottom
                >
                  <template #activator="{ on, attrs }">
                    <v-icon
                      color="success"
                      size="28"
                      v-bind="attrs"
                      v-on="on"
                      @click="emit(item, 'updateContactTable')"
                    >
                      mdi-pencil-circle
                    </v-icon>
                  </template>
                  <span>ACTUALIZAR ESTADO</span>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    userContact: {
      type: Array,
      required: true
    },
    headersContact: {
      type: Array,
      required: true
    },
    tableOrigin: {
      type: String,
      required: true
    },
    footerProps: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      panel: 0
    }
  },

  methods: {
    getStatusText (status) {
      const statusMap = {
        pending: 'PENDIENTE',
        in_progress: 'CONTACTADO',
        resolved: 'RESUELTO',
        cancelled: 'CANCELADO'
      }

      return statusMap[status] || status
    },

    formatPhone (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    },

    emit (item, action) {
      this.$emit('action', { item, action })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
