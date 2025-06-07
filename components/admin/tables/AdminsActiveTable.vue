<template>
  <v-data-table
    :headers="headersAdminsActive"
    :items="adminsActive"
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
        <v-tooltip color="info" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              color="info"
              v-bind="attrs"
              v-on="on"
              @click="emit(item, 'editAdminDialog')"
            >
              mdi-account-edit
            </v-icon>
          </template>
          <span>EDITAR PERFIL</span>
        </v-tooltip>

        <v-tooltip color="warning" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="px-1"
              color="warning"
              v-bind="attrs"
              v-on="on"
              @click="emit(item, 'changePasswordDialog')"
            >
              mdi-lock-reset
            </v-icon>
          </template>
          <span>CAMBIAR CONTRASEÑA</span>
        </v-tooltip>

        <v-tooltip color="error" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              color="error"
              v-bind="attrs"
              v-on="on"
              @click="emit(item, 'deactivateAdminDialog')"
            >
              mdi-account-off
            </v-icon>
          </template>
          <span>DESACTIVAR PERFIL</span>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script>

export default {

  props: {
    adminsActive: {
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
      headersAdminsActive: [
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
