<template>
  <v-col cols="12">
    <v-row align="center" justify="center">
      <h1 class="my-5 d-flex align-center">
        PERFILES DE ADMINISTRACIÓN
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
      <v-btn
        elevation="0"
        class="rounded-pill mb-4"
        color="#fed55e"
        @click="newAdminDialog()"
      >
        <strong>REGISTRAR NUEVO ADMIN</strong>
      </v-btn>
    </v-row>

    <v-row align="center" justify="center">
      <v-expansion-panels v-model="panel" focusable>
        <v-expansion-panel>
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>PERFILES DE ADMINISTRADOR ACTIVOS</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5
              v-if="adminsActive.length === 0"
              class="subtitle mt-4"
            >
              NO HAY PERFILES DE ADMINISTRADOR ACTIVOS.
            </h5>

            <AdminsActiveTable
              v-else
              :admins-active="filteredAdminsActive"
              :footer-props="footerProps"
              @action="decoder"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="bg-blue white--text">
            <h4>PERFILES DE ADMINISTRADOR INACTIVOS</h4>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h5
              v-if="adminsInactive.length === 0"
              class="subtitle mt-4"
            >
              NO HAY PERFILES DE ADMINISTRADOR INACTIVOS.
            </h5>

            <AdminsInactiveTable
              v-else
              :admins-inactive="adminsInactive"
              :footer-props="footerProps"
              @action="decoder"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <NewAdminDialog
      :key="adminDialogKey.new"
      v-model="dialogNewAdmin"
      @action="decoder"
    />
    <EditAdminDialog
      :key="adminDialogKey.edit"
      v-model="dialogEditAdmin"
      :admin-edit="adminEdit"
      @action="decoder"
    />
    <ChangePasswordAdminDialog
      :key="adminDialogKey.changePassword"
      v-model="dialogChangePassword"
      :admin-data="adminChangePassword"
      @action="decoder"
    />
    <ChangeActiveAdminDialog
      :key="adminDialogKey.changeActive"
      v-model="dialogChangeActive"
      :change="change"
      :admin-data="adminChangeActive"
      @action="decoder"
    />
    <InfoAdminDialog
      :key="adminDialogKey.info"
      v-model="dialogInfoAdmin"
      :admin-info="adminInfo"
      :moment="moment"
      @action="decoder"
    />
    <DeleteAdminDialog
      :key="adminDialogKey.delete"
      v-model="dialogDeleteAdmin"
      :admin-data="adminDelete"
      @action="decoder"
    />

    <!-- Modal de ayuda -->
    <LegendHelpDialog v-model="dialogLegend" page="admins" />
  </v-col>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import DeleteAdminDialog from '../../../components/admin/dialogs/DeleteAdminDialog.vue'
import InfoAdminDialog from '../../../components/admin/dialogs/InfoAdminDialog.vue'
import ChangeActiveAdminDialog from '../../../components/admin/dialogs/ChangeActiveAdminDialog.vue'
import ChangePasswordAdminDialog from '../../../components/admin/dialogs/ChangePasswordAdminDialog.vue'
import EditAdminDialog from '../../../components/admin/dialogs/EditAdminDialog.vue'
import NewAdminDialog from '../../../components/admin/dialogs/NewAdminDialog'
import AdminsInactiveTable from '../../../components/admin/tables/AdminsInactiveTable.vue'
import AdminsActiveTable from '../../../components/admin/tables/AdminsActiveTable'
import LegendHelpDialog from '~/components/shared/LegendHelpDialog.vue'
moment.locale('es')

export default {
  components: {
    DeleteAdminDialog,
    InfoAdminDialog,
    ChangeActiveAdminDialog,
    ChangePasswordAdminDialog,
    EditAdminDialog,
    NewAdminDialog,
    AdminsInactiveTable,
    AdminsActiveTable,
    LegendHelpDialog
  },

  layout: 'admin',

  middleware: 'auth-admin',

  data () {
    return {
      moment,
      footerProps: {
        'items-per-page-options': [5, 10, 15, 20],
        'items-per-page-text': 'FILAS POR PÁGINA',
        'show-current-page': true,
        'show-first-last-page': true,
        'show-page-size-options': true,
        'show-rows-per-page': true,
        'show-select': true
      },
      panel: 0,
      allAdmins: [],
      adminsActive: [],
      adminsInactive: [],

      dialogKeyCounter: 1,
      adminDialogKey: {
        new: 1,
        edit: 2,
        changePassword: 3,
        changeActive: 4,
        info: 5,
        delete: 6
      },

      // DIALOG NEW ADMIN
      dialogNewAdmin: false,

      // DIALOG EDIT ADMIN
      dialogEditAdmin: false,
      adminEdit: {},

      // DIALOG CHANGE PASSWORD
      dialogChangePassword: false,
      adminChangePassword: {},

      // DIALOG CHANGE ACTIVE
      dialogChangeActive: false,
      adminChangeActive: {},
      change: '',

      // DIALOG INFO ADMIN
      dialogInfoAdmin: false,
      adminInfo: {},

      // DIALOG DELETE ADMIN
      dialogDeleteAdmin: false,
      adminDelete: {},

      // DIALOG LEYENDA DE AYUDA
      dialogLegend: false
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert,
      admin: state => state.admin // Asegúrate de tener el admin logueado en el store
    }),
    filteredAdminsActive () {
      return this.adminsActive.filter(
        admin => admin.id !== 1 && admin.id !== this.admin?.id
      )
    },
    isSuperadmin () {
      return this.admin.role === 'superadmin'
    },
    isAdmin () {
      return this.admin.role === 'admin'
    },
    isValidador () {
      return this.admin.role === 'validador'
    },
    isConsulta () {
      return this.admin.role === 'consulta'
    }
  },

  watch: {
    showAlert () {}
  },

  created () {
    if (!this.isSuperadmin) {
      this.$router.push('/admin/periods')
    }
  },

  mounted () {
    if (this.isSuperadmin) {
      this.loadAdmins()
    }
  },

  methods: {
    // ALERTAS
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

    // DECODIFICADOR DE ACCIONES
    decoder (data) {
      console.log('🚀 ~ decoder ~ data:', data)
      switch (data.action) {
        case 'cancel':
          this.clean()
          break
        case 'createAdmin':
          this.createAdmin(data.data)
          break
        case 'editAdminDialog':
          this.dialogEditAdmin = true
          this.adminEdit = data.item
          break
        case 'editAdmin':
          this.editAdmin(data.data)
          break
        case 'changePasswordDialog':
          this.dialogChangePassword = true
          this.adminChangePassword = data.item
          break
        case 'changePassword':
          this.changePassword(data.data)
          break
        case 'infoAdminDialog':
          this.dialogInfoAdmin = true
          this.adminInfo = data.item
          break
        case 'deleteAdminDialog':
          this.dialogDeleteAdmin = true
          this.adminDelete = data.item
          break
        case 'deleteAdmin':
          this.deleteAdmin(data.data)
          break
        case 'activateAdminDialog':
          this.dialogChangeActive = true
          this.adminChangeActive = data.item
          this.change = 'ACTIVAR'
          break
        case 'deactivateAdminDialog':
          this.dialogChangeActive = true
          this.adminChangeActive = data.item
          this.change = 'DESACTIVAR'
          break
        case 'changeActive':
          this.setAdminActive(data.data)
          break
        default:
          this.mostrarAlerta('red', 'error', 'OPCIÓN NO VALIDA EN DECODER.')
      }
    },

    // LIMPIAR FORMULARIOS
    clean () {
      this.dialogKeyCounter = Date.now() + Math.random()
      if (this.dialogNewAdmin) {
        this.dialogNewAdmin = false
        this.adminDialogKey.new = this.dialogKeyCounter++
      }
      if (this.dialogEditAdmin) {
        this.dialogEditAdmin = false
        this.adminEdit = {}
        this.adminDialogKey.edit = this.dialogKeyCounter++
      }
      if (this.dialogChangePassword) {
        this.dialogChangePassword = false
        this.adminChangePassword = {}
        this.adminDialogKey.changePassword = this.dialogKeyCounter++
      }
      if (this.dialogInfoAdmin) {
        this.dialogInfoAdmin = false
        this.adminInfo = {}
        this.adminDialogKey.info = this.dialogKeyCounter++
      }
      if (this.dialogDeleteAdmin) {
        this.dialogDeleteAdmin = false
        this.adminDelete = {}
        this.adminDialogKey.delete = this.dialogKeyCounter++
      }
      if (this.dialogChangeActive) {
        this.dialogChangeActive = false
        this.adminChangeActive = {}
        this.change = ''
        this.adminDialogKey.changeActive = this.dialogKeyCounter++
      }
    },

    // CARGAR ADMINISTRADORES
    async loadAdmins () {
      try {
        const url = '/admin/get-all-admins'
        await this.$axios.get(url)
          .then((response) => {
            if (response.data.success) {
              this.allAdmins = response.data.admins
              this.adminsActive = this.allAdmins.filter(admin => admin.active)
              this.adminsInactive = this.allAdmins.filter(admin => !admin.active)
              if (!this.allAdmins) {
                this.mostrarAlerta('green', 'success', response.data.message)
              }
            } else {
              this.mostrarAlerta('red', 'error', response.data.message || 'ERROR AL CARGAR LOS ADMINISTRADORES.')
            }
          })
          .catch((error) => {
            this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR DE CONEXIÓN.')
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ERROR AL CARGAR LOS ADMINISTRADORES:', error)
        this.mostrarAlerta('red', 'error', 'ERROR AL CARGAR LOS ADMINISTRADORES.')
      }
    },

    // CREAR ADMINISTRADOR
    newAdminDialog () {
      this.dialogNewAdmin = true
    },

    async createAdmin (data) {
      try {
        const url = '/admin/create-admin'
        await this.$axios.post(url, data)
          .then((response) => {
            if (response.data.success) {
              this.mostrarAlerta('green', 'success', 'ADMINISTRADOR CREADO EXITOSAMENTE.')
              this.loadAdmins()
              this.clean()
            } else {
              this.mostrarAlerta('red', 'error', response.data.message || 'ERROR AL CREAR EL ADMINISTRADOR.')
            }
          })
          .catch((error) => {
            this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR DE CONEXIÓN.')
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ERROR AL CREAR EL ADMINISTRADOR:', error)
        this.mostrarAlerta('red', 'error', 'ERROR AL CREAR EL ADMINISTRADOR.')
      }
    },

    // EDITAR ADMINISTRADOR
    async editAdmin (data) {
      try {
        const url = `/admin/update-admin/${data.id}`
        await this.$axios.put(url, data)
          .then((response) => {
            if (response.data.success) {
              this.mostrarAlerta('green', 'success', 'ADMINISTRADOR EDITADO EXITOSAMENTE.')
              this.loadAdmins()
              this.clean()
            } else {
              this.mostrarAlerta('red', 'error', response.data.message || 'ERROR AL EDITAR EL ADMINISTRADOR.')
            }
          })
          .catch((error) => {
            this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR DE CONEXIÓN.')
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ERROR AL EDITAR EL ADMINISTRADOR:', error)
        this.mostrarAlerta('red', 'error', 'ERROR AL EDITAR EL ADMINISTRADOR.')
      }
    },

    // CAMBIAR CONTRASEÑA DEL ADMINISTRADOR
    async changePassword (data) {
      try {
        const url = `/admin/update-admin-password/${data.id}`
        await this.$axios.patch(url, data)
          .then((response) => {
            if (response.data.success) {
              this.mostrarAlerta('green', 'success', 'CONTRASEÑA CAMBIADA EXITOSAMENTE.')
              this.loadAdmins()
              this.clean()
            } else {
              this.mostrarAlerta('red', 'error', response.data.message || 'ERROR AL CAMBIAR LA CONTRASEÑA.')
            }
          })
          .catch((error) => {
            this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR DE CONEXIÓN.')
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ERROR AL CAMBIAR LA CONTRASEÑA:', error)
        this.mostrarAlerta('red', 'error', 'ERROR AL CAMBIAR LA CONTRASEÑA.')
      }
    },

    // ELIMINAR ADMINISTRADOR
    async deleteAdmin (data) {
      // Validación en frontend
      if (data.id === 1) {
        this.mostrarAlerta('red', 'error', 'NO PUEDES ELIMINAR AL SUPERADMIN PRINCIPAL.')
        return
      }
      if (data.id === this.admin?.id) {
        this.mostrarAlerta('red', 'error', 'NO PUEDES ELIMINAR TU PROPIO PERFIL.')
        return
      }
      try {
        const url = `/admin/delete-admin/${data.id}`
        const currentAdminId = { currentAdminId: this.admin?.id }
        // Envía el id del admin actual al backend para validación extra
        await this.$axios.delete(url, currentAdminId)
          .then((response) => {
            if (response.data.success) {
              this.mostrarAlerta('green', 'success', 'ADMINISTRADOR ELIMINADO EXITOSAMENTE.')
              this.loadAdmins()
              this.clean()
            } else {
              this.mostrarAlerta('red', 'error', response.data.message || 'ERROR AL ELIMINAR EL ADMINISTRADOR.')
            }
          })
          .catch((error) => {
            this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR DE CONEXIÓN.')
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ERROR AL ELIMINAR EL ADMINISTRADOR:', error)
        this.mostrarAlerta('red', 'error', 'ERROR AL ELIMINAR EL ADMINISTRADOR.')
      }
    },

    // ACTIVAR/DESACTIVAR ADMINISTRADOR
    async setAdminActive (data) {
      try {
        const url = `/admin/set-admin-active/${data.id}`
        await this.$axios.patch(url, { active: data.active })
          .then((response) => {
            if (response.data.success) {
              this.mostrarAlerta('green', 'success', `PERFIL DE ADMINISTRADOR ${this.change} EXITOSAMENTE.`)
              this.loadAdmins()
              this.clean()
            } else {
              this.mostrarAlerta('red', 'error', response.data.message || `ERROR AL ${this.change} EL ADMINISTRADOR.`)
            }
          })
          .catch((error) => {
            this.mostrarAlerta('red', 'error', error.response?.data?.message || 'ERROR DE CONEXIÓN.')
          })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`ERROR AL ${this.change} EL ADMINISTRADOR:`, error)
        this.mostrarAlerta('red', 'error', `ERROR AL ${this.change} EL ADMINISTRADOR.`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
