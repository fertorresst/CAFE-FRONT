<template>
  <v-data-table
    :headers="headersAdminsInactive"
    :items="adminsInactive"
    class="elevation-0 mt-4"
    :footer-props="footerProps"
  >
    <template #[`item.role`]="{ item }">
      {{ item.role.toUpperCase() }}
    </template>

    <template #[`item.name`]="{ item }">
      {{ getFullName(item) }}
    </template>

    <template #[`item.phone`]="{ item }">
      {{ formatPhone(item.phone) }}
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex flex-nowrap align-stretch justify-center" @click.stop>
        <v-tooltip color="info" bottom class="mr-2">
          <template #activator="{ on, attrs }">
            <v-icon
              color="info"
              v-bind="attrs"
              v-on="on"
              @click="emit(item, 'infoAdminDialog')"
            >
              mdi-account-details
            </v-icon>
          </template>
          <span>DETALLES DEL PERFIL</span>
        </v-tooltip>

        <v-tooltip color="error" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="px-1"
              color="error"
              v-bind="attrs"
              v-on="on"
              @click="emit(item, 'deleteAdminDialog')"
            >
              mdi-account-remove
            </v-icon>
          </template>
          <span>ELIMINAR PERFIL</span>
        </v-tooltip>

        <v-tooltip color="success" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              color="success"
              v-bind="attrs"
              v-on="on"
              @click="emit(item, 'activateAdminDialog')"
            >
              mdi-account-badge
            </v-icon>
          </template>
          <span>ACTIVAR PERFIL</span>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script>

export default {

  props: {
    adminsInactive: {
      type: Array,
      required: true
    },
    footerProps: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data () {
    return {
      headersAdminsInactive: [
        { text: 'ID', value: 'id', align: 'start', sortable: false },
        { text: 'NOMBRE', value: 'name', align: 'start', sortable: true },
        { text: 'ROL', value: 'role', align: 'start', sortable: true },
        { text: 'TELÉFONO', value: 'phone', align: 'start', sortable: false },
        { text: 'CORREO', value: 'email', align: 'start', sortable: false },
        { text: 'ACCIONES', value: 'actions', align: 'center', sortable: false }
      ]
    }
  },

  methods: {
    emit (item, action) {
      this.$emit('action', { item, action })
    },

    getFullName (item) {
      return `${item.name} ${item.lastName} ${item.secondLastName || ''}`.trim().toUpperCase()
    },

    formatPhone (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
