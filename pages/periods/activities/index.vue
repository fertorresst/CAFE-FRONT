<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1>
        LISTA DE ACTIVIDADES DEL PERIODO {{ period.per_name }}
      </h1>
    </v-row>

    <v-row align="center" justify="center">
      <v-btn
        elevation="0"
        class="rounded-pill ma-6"
        color="#fed55e"
        @click="loadAlums()"
      >
        <strong>MOSTRAR ACTIVIDADES DE ESTUDIANTES</strong>
      </v-btn>

      <v-btn
        elevation="0"
        class="rounded-pill ma-6"
        color="#fed55e"
        @click="loadCollectives()"
      >
        <strong>MOSTRAR ACTIVIDADES COLECTIVAS</strong>
      </v-btn>
    </v-row>

    <v-row class="my-8">
      <contact-table
        :user-contact="userContact"
        :headers-contact="headersContact"
        :footer-props="footerProps"
        @action="decoder"
      />
    </v-row>

    <v-row align="center" justify="center">
      <v-expansion-panels v-if="alumsFlag" focusable>
        <v-expansion-panel v-for="(alum, index) in alums" :key="index">
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>{{ alum.nua }} &nbsp;|&nbsp; {{ alum.name }}</h4>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card
              flat
              class="elevation-0 my-2"
            >
              <v-card-text class="black--text">
                <p><strong>CARRERA:</strong> {{ alum.career }}</p>
                <p><strong>CORREO:</strong> {{ alum.email }}</p>
                <p><strong>TELÉFONO:</strong> {{ alum.phone }}</p>
              </v-card-text>
            </v-card>

            <v-expansion-panels focusable>
              <v-expansion-panel v-for="(alumActivity, indexA) in alum.activities" :key="indexA">
                <v-expansion-panel-header class="bg-gold white--text">
                  <h4>{{ alumActivity.name }} &nbsp;—&nbsp; {{ alumActivity.speaker }}</h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-col
                    cols="12"
                    align="center"
                    justify="center"
                    class="my-4"
                  >
                    <v-row>
                      <v-spacer />
                      <v-btn
                        color="blue"
                        class="ml-6 white--text elevation-0"
                      >
                        <v-icon>mdi-email</v-icon>
                      </v-btn>

                      <v-btn
                        color="red"
                        class="ml-6 white--text elevation-0"
                      >
                        <v-icon>mdi-close-thick</v-icon>
                      </v-btn>

                      <v-btn
                        color="orange"
                        class="ml-6 white--text elevation-0"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>

                      <v-btn
                        color="green"
                        class="ml-6 white--text elevation-0"
                      >
                        <v-icon>mdi-check-bold</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>

                  <h3>
                    PONENTE O EXPOSITOR
                  </h3>
                  <v-text-field
                    v-model="alumActivity.speaker"
                    flat
                    outlined
                    dense
                    type="text"
                    required
                  />

                  <h3>
                    DESCRIPCIÓN DE LA ACTIVIDAD
                  </h3>
                  <v-textarea
                    v-model="alumActivity.description"
                    auto-grow
                    rows="3"
                    flat
                    outlined
                    dense
                    type="text"
                    required
                  />

                  <v-row align="center" justify="center">
                    <v-col cols="3">
                      <h3>
                        FECHA DE INICIO
                      </h3>
                      <v-text-field
                        v-model="alumActivity.startDate"
                        flat
                        outlined
                        dense
                        type="date"
                        required
                      />
                    </v-col>

                    <v-col cols="3">
                      <h3>
                        FECHA DE TERMINO
                      </h3>
                      <v-text-field
                        v-model="alumActivity.endDate"
                        flat
                        outlined
                        dense
                        type="date"
                        required
                      />
                    </v-col>

                    <v-col cols="3">
                      <h3>
                        NÚMERO DE HORAS
                      </h3>
                      <v-text-field
                        v-model="alumActivity.hours"
                        flat
                        outlined
                        dense
                        type="number"
                        required
                      />
                    </v-col>

                    <v-col cols="3">
                      <h3>
                        SUBAREA
                      </h3>
                      <v-combobox
                        v-model="alumActivity.area"
                        :items="areas"
                        flat
                        outlined
                        dense
                        type="text"
                        required
                      />
                    </v-col>
                  </v-row>

                  <h3>
                    EVIDENCIAS
                  </h3>
                  <v-carousel>
                    <v-carousel-item
                      v-for="(item,i) in alumActivity.evidenceLinks"
                      :key="i"
                      :src="item"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    />
                  </v-carousel>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-expansion-panels v-if="collectivesFlag" focusable>
        <v-expansion-panel v-for="(collective, index) in collectives" :key="index">
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>{{ collective.id }} &nbsp; {{ collective.name }}</h4>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p><strong>Responsable:</strong> {{ collective.responsable }}</p>
            <p><strong>Correo:</strong> {{ collective.email }}</p>
            <p><strong>Teléfono:</strong> {{ collective.phone }}</p>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <contact-info-dialog
      v-if="dialogInfoContact"
      :contact-to-info="contactToInfo"
      :moment="moment"
      @action="decoder"
    />

    <contact-delete-dialog
      v-if="dialogDeleteContact"
      :contact-to-delete="contactToDelete"
      :required-rule="requiredRule"
      :validate-password="validatePassword"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />

    <contact-update-dialog
      v-if="dialogUpdateContact"
      :contact-to-update="contactToUpdate"
      :required-rule="requiredRule"
      :validate-password="validatePassword"
      :mostrar-alerta="mostrarAlerta"
      @action="decoder"
    />
  </v-col>
</template>

<script>
import moment from 'moment'
import ContactUpdateDialog from '../../../components/activities/dialogs/ContactUpdateDialog'
import ContactDeleteDialog from '../../../components/activities/dialogs/ContactDeleteDialog'

import ContactInfoDialog from '../../../components/activities/dialogs/ContactInfoDialog'
import ContactTable from '../../../components/activities/tables/ContactTable'

moment.locale('es')

export default {
  components: { ContactUpdateDialog, ContactDeleteDialog, ContactInfoDialog, ContactTable },

  data () {
    return {
      moment,

      // DATOS DE ENTRADA
      periodId: '',
      tableOrigin: '',
      period: {},

      panel: 0,
      areas: ['DP', 'RS', 'CEE', 'FCI', 'AC'],

      // VARIABLE DE TABLAS
      footerProps: {
        'items-per-page-text': 'FILAS POR PÁGINA',
        'items-per-page-options': [5, 10, 15, 20, 25, 50, 100]
      },

      // TABLA DE CONTACTOS
      headersContact: [
        { text: 'ID', align: 'left', value: 'id', sortable: false },
        { text: 'NUA', align: 'left', value: 'user.nua', sortable: true },
        { text: 'NOMBRE', align: 'left', value: 'user.name', sortable: false },
        { text: 'DESCRIPCIÓN DEL CONTACTO', align: 'left', value: 'description', sortable: false },
        { text: 'ESTADO', align: 'center', value: 'status', sortable: true },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      userContact: [],

      // REGLAS
      requiredRule: value => !!value || 'ESTE CAMPO ES REQUERIDO',

      // DIALOG INFO CONTACTO
      dialogInfoContact: false,
      contactToInfo: [],

      // DIALOG DELETE CONTACT
      dialogDeleteContact: false,
      contactToDelete: [],

      // DIALOG UPDATE CONTACT
      dialogUpdateContact: false,
      contactToUpdate: [],

      // VARIABLE QUE NO SE QUE PEDO
      alumsFlag: false,
      collectivesFlag: false,

      alums: [
        {
          nua: '123456',
          name: 'Juan Pérez',
          career: 'LISC',
          email: 'j@j.com',
          phone: '1234567890',
          activities: [
            {
              name: 'Taller de Programación',
              speaker: 'Dr. John Doe',
              description: 'Un taller intensivo sobre programación en Python.',
              area: 'Tecnología',
              startDate: '2023-01-10',
              endDate: '2023-01-12',
              hours: 20,
              institution: 'Universidad XYZ',
              evidenceLinks: [
                'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
                'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
                'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
                'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
              ]
            },
            {
              name: 'Conferencia de IA',
              speaker: 'Dr. Jane Smith',
              description: 'Una conferencia sobre los avances en inteligencia artificial.',
              area: 'Ciencia',
              startDate: '2023-02-15',
              endDate: '2023-02-15',
              hours: 5,
              institution: 'Instituto ABC',
              evidenceLinks: [
                'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
                'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
                'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
                'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
              ]
            }
          ]
        },
        {
          nua: '654321',
          name: 'María López',
          career: 'LIDIA',
          email: 'm@m.com',
          phone: '0987654321',
          activities: [
            {
              name: 'Seminario de Matemáticas',
              speaker: 'Dr. Alan Turing',
              description: 'Un seminario sobre teoría de números.',
              area: 'Matemáticas',
              startDate: '2023-03-01',
              endDate: '2023-03-03',
              hours: 15,
              institution: 'Universidad DEF',
              evidenceLinks: [
                'https://example.com/evidence5.jpg',
                'https://example.com/evidence6.jpg'
              ]
            }
          ]
        }
      ],

      collectives: [
        { id: '123456', name: 'Grupo 1', responsable: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' },
        { id: '123456', name: 'Grupo 1', responsable: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' }
      ]
    }
  },

  created () {
    this.periodId = this.$route.query.periodId
    this.tableOrigin = this.$route.query.tableOrigin

    if (!this.periodId || !this.tableOrigin) {
      this.$router.push({ name: 'periods' })
    } else {
      this.getPeriodInfo(this.periodId)
      this.getUserContact(this.periodId)
    }
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

    // EMITS DE LOS COMPONENTES
    decoder (data) {
      if (data.action === 'cancel') {
        this.cancel()
      } else if (data.action === 'deleteContactTable') {
        this.deleteContactDialog(data.item)
      } else if (data.action === 'infoContactTable') {
        this.infoContactDialog(data.item)
      } else if (data.action === 'updateContactTable') {
        this.updateContactDialog(data.item)
      } else if (data.action === 'deleteContact') {
        this.deleteContact(data.id)
      } else if (data.action === 'updateContact') {
        this.updateContact(data.data)
      }
    },

    // VALIDAR CONTRASEÑA
    async validatePassword (password) {
      try {
        const url = '/validate-password'
        const data = {
          user: this.$store.state.user,
          password
        }
        const res = await this.$axios.post(url, data)

        if (res.data.success) {
          return res.data.success
        }

        this.mostrarAlerta('red', 'error', res.data.message)
        return false
      } catch (error) {
        this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL VALIDAR LA CONTRASEÑA')
        // eslint-disable-next-line no-console
        console.error('Error:', error)
        return false
      }
    },

    // REINICIAR LAS VARIABLES
    clean () {
      // DIALOGS
      this.dialogInfoContact = false
      this.dialogDeleteContact = false
      this.dialogUpdateContact = false

      // VARIABLES
      this.contactToInfo = []
      this.contactToDelete = []
      this.contactToUpdate = []
    },

    cancel () {
      this.clean()
    },

    // CARGAR INFORMACIÓN DEL PERIODO
    async getPeriodInfo (periodId) {
      const url = `/get-period-info/${periodId}`
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.period = res.data.period
            this.mostrarAlerta('green', 'success', 'INFORMACIÓN DEL PERIODO CARGADA CORRECTAMENTE')
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ getPeriodInfo ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CARGAR LA INFORMACIÓN DEL PERIODO')
        })
    },

    // CARGAR USUARIOS A CONTACTAR
    async getUserContact (periodId) {
      const url = `/get-contacts-by-period/${periodId}`
      await this.$axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.userContact = res.data.contacts
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('🚀 ~ getUserContact ~ error', error)
          this.mostrarAlerta('red', 'error', 'ERROR AL CARGAR LOS USUARIOS A CONTACTAR')
        })
    },

    // DIALOG INFO CONTACTO
    infoContactDialog (item) {
      this.contactToInfo = item
      this.dialogInfoContact = true
    },

    // DIALOG DELETE CONTACT
    deleteContactDialog (item) {
      this.contactToDelete = item
      this.dialogDeleteContact = true
    },

    async deleteContact (params) {
      const url = `/delete-contact-by-id/${params}`
      await this.$axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.getUserContact(this.periodId)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL ELIMINAR EL CONTACTO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ deleteContact ~ e: ', e)
        })
    },

    // DIALOG UPDATE CONTACT
    updateContactDialog (item) {
      this.contactToUpdate = item
      this.dialogUpdateContact = true
    },

    updateContact (data) {
      console.log('🚀 ~ updateContact ~ data:', data)
      const url = '/update-contact'
      this.$axios.patch(url, data)
        .then((res) => {
          if (res.data.success) {
            this.mostrarAlerta('green', 'success', res.data.message)
            this.getUserContact(this.periodId)
          } else {
            this.mostrarAlerta('red', 'error', res.data.message)
          }
        })
        .catch((e) => {
          this.mostrarAlerta('red', 'error', 'OCURRIÓ UN ERROR AL ACTUALIZAR EL CONTACTO')
          // eslint-disable-next-line no-console
          console.log('🚀 ~ updateContact ~ e: ', e)
        })
    },

    loadAlums () {
      this.alumsFlag = true
      this.collectivesFlag = false
    },

    loadCollectives () {
      this.alumsFlag = false
      this.collectivesFlag = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table {
  border-radius: 5px !important;
  overflow: hidden !important;
  font-family: 'Gandhi Sans', sans-serif !important;
}

::v-deep .v-data-table-header {
  background-color: #a3915f !important;
  border-radius: 20px !important;
  font-family: 'Novecento Wide', sans-serif !important;
}

::v-deep .v-data-table-header th {
  color: white !important;
  font-family: 'Novecento Wide', sans-serif !important;
  font-size: 14px !important;
}

::v-deep .v-data-table-header th.sortable {
  color: white !important;
}

::v-deep .v-expansion-panel-header__icon .v-icon {
  color: white !important;
}

::v-deep .v-data-table tbody td {
  font-family: 'Gandhi Sans', sans-serif !important;
}
</style>
