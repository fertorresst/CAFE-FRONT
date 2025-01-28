<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1>
        LISTA DE ACTIVIDADES DEL PERIODO {{ period }}
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
      <v-col cols="12" align="center" justify="center">
        <v-card class="elevation-0">
          <v-card-text class="black--text">
            <h2>ALUMNOS PENDIENTES DE CONTACTAR</h2>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headersContact"
              :items="alumsContact"
              class="elevation-0"
              :footer-props="footerProps"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-expansion-panels v-if="alumsFlag" focusable>
        <v-expansion-panel v-for="(alum, index) in alums" :key="index">
          <v-expansion-panel-header class="bg-gold white--text">
            <h4>{{ alum.nua }} &nbsp; {{ alum.name }}</h4>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p><strong>Correo:</strong> {{ alum.email }}</p>
            <p><strong>Teléfono:</strong> {{ alum.phone }}</p>

            <v-expansion-panels focusable>
              <v-expansion-panel v-for="(alumActivity, indexA) in alumsActivities" :key="indexA">
                <v-expansion-panel-header class="bg-gold white--text">
                  <h4>{{ alumActivity.key }} &nbsp; {{ alumActivity.name }}</h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content />
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
  </v-col>
</template>

<script>
export default {
  data () {
    return {
      period: '2021-2022',
      footerProps: {
        'items-per-page-text': 'Filas por página',
        'items-per-page-options': [5, 10, 15, 20, 25, 50, 100]
      },
      headersContact: [
        { text: 'NUA', align: 'center', value: 'nua', sortable: false },
        { text: 'NOMBRE', align: 'center', value: 'name', sortable: false },
        { text: 'CORREO', align: 'center', value: 'email', sortable: false },
        { text: 'TELÉFONO', align: 'center', value: 'phone', sortable: false },
        { text: 'ACCIONES', align: 'center', value: 'actions', sortable: false }
      ],
      alumsContact: [
        { nua: '123456', name: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' },
        { nua: '123456', name: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' }
      ],

      alumsFlag: false,
      collectivesFlag: false,

      alums: [
        { nua: '123456', name: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' },
        { nua: '123456', name: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' }
      ],
      alumActivities: [
        { key: '123456', name: 'Actividad 1' },
        { key: '123456', name: 'Actividad 2' }
      ],
      collectives: [
        { id: '123456', name: 'Grupo 1', responsable: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' },
        { id: '123456', name: 'Grupo 1', responsable: 'Juan Pérez', email: 'j@j.com', phone: '1234567890' }
      ]
    }
  },

  methods: {
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

</style>
