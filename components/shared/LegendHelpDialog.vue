<template>
  <v-dialog v-model="internal" max-width="900" persistent scrollable>
    <v-card class="rounded-xl">
      <v-card-title class="bg-blue white--text py-4">
        <v-icon left color="white">
          mdi-help-circle-outline
        </v-icon>
        <span class="headline">Ayuda: significado de íconos y colores</span>
        <v-spacer />
        <v-btn icon color="white" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-6">
        <!-- Sección común: Colores de estado -->
        <h3 class="subtitle-1 font-weight-bold mb-3">
          Colores de estado
        </h3>
        <div class="d-flex flex-wrap mb-4">
          <v-chip class="ma-1" color="success" dark>
            Verde: aprobado / Sí
          </v-chip>
          <v-chip class="ma-1" color="warning" dark>
            Amarillo: en contacto
          </v-chip>
          <v-chip class="ma-1" color="grey darken-1" dark>
            Gris: pendiente
          </v-chip>
          <v-chip class="ma-1" color="info" dark>
            Azul: informativo
          </v-chip>
          <v-chip class="ma-1" color="error" dark>
            Rojo: rechazado / No
          </v-chip>
        </div>

        <v-divider class="my-4" />

        <!-- Íconos por contexto -->
        <v-row>
          <v-col v-for="(grp, i) in filteredGroups" :key="i" cols="12" :md="grp.items.length > 4 ? 12 : 6">
            <h3 class="subtitle-1 font-weight-bold mb-2">
              {{ grp.title }}
            </h3>
            <v-list dense two-line>
              <v-list-item v-for="(it, j) in grp.items" :key="j">
                <v-list-item-avatar tile size="36">
                  <v-avatar :color="it.color" size="36">
                    <v-icon color="white">
                      {{ it.icon }}
                    </v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    {{ it.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text--secondary">
                    {{ it.detail }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-alert v-if="pageContext" dense text type="info" class="mt-4">
          {{ getTipMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="d-flex justify-center pb-6">
        <v-btn color="#fed55e" rounded elevation="0" @click="close">
          <strong>CERRAR</strong>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LegendHelpDialog',

  props: {
    value: { type: Boolean, default: false },
    page: { type: String, default: 'general' } // 'periods', 'activities', 'students', 'admins', 'student-dashboard', 'student-home', 'qr-codes', 'general'
  },

  computed: {
    internal: {
      get () { return this.value },
      set (v) { this.$emit('input', v) }
    },
    pageContext () {
      return this.page
    },
    filteredGroups () {
      const allGroups = {
        // GRUPOS COMUNES
        statesIndicators: {
          title: 'Indicadores de estados',
          items: [
            { icon: 'mdi-check-circle', color: 'success', title: 'Aprobado / Sí', detail: 'Actividad aprobada, campo exclusivo = Sí, contacto resuelto.' },
            { icon: 'mdi-close-circle', color: 'error', title: 'Rechazado / No', detail: 'Actividad rechazada, campo exclusivo = No, contacto cancelado.' },
            { icon: 'mdi-progress-clock', color: 'warning', title: 'En contacto', detail: 'Actividad en seguimiento, alumno contactado.' },
            { icon: 'mdi-alert-circle', color: 'grey darken-1', title: 'Pendiente', detail: 'Actividad sin revisar, en espera de validación.' }
          ],
          pages: ['periods', 'activities', 'students', 'student-dashboard', 'general']
        },

        // ACCIONES EN PERIODOS
        periodActions: {
          title: 'Acciones en periodos',
          items: [
            { icon: 'mdi-information', color: 'info', title: 'Ver detalles', detail: 'Muestra información completa del periodo seleccionado.' },
            { icon: 'mdi-download-circle', color: 'primary', title: 'Descargar reportes', detail: 'Descarga reportes del periodo (PDF/Excel).' },
            { icon: 'mdi-calendar-edit', color: 'orange darken-2', title: 'Editar periodo', detail: 'Modifica fechas y configuración del periodo.' },
            { icon: 'mdi-calendar-check', color: 'green darken-2', title: 'Activar periodo', detail: 'Activa un periodo pendiente para recibir solicitudes.' },
            { icon: 'mdi-calendar-remove', color: 'red darken-2', title: 'Finalizar periodo', detail: 'Cierra el periodo, ya no recibirá más solicitudes.' },
            { icon: 'mdi-check-bold', color: 'success', title: 'Aprobar periodo', detail: 'Aprueba un periodo pendiente para activarlo.' }
          ],
          pages: ['periods']
        },

        // INDICADORES DE PERIODO
        periodIndicators: {
          title: 'Indicadores de periodos',
          items: [
            { icon: 'mdi-calendar-check', color: 'success', title: 'Periodo activo', detail: 'El periodo está abierto y recibiendo solicitudes.' },
            { icon: 'mdi-calendar-end', color: 'grey darken-1', title: 'Periodo finalizado', detail: 'El periodo ha terminado y ya no acepta solicitudes.' },
            { icon: 'mdi-calendar-clock', color: 'warning', title: 'Periodo pendiente', detail: 'El periodo está pendiente de aprobación para activarse.' }
          ],
          pages: ['periods', 'student-dashboard']
        },

        // ACCIONES EN ACTIVIDADES (ADMIN)
        activityActionsAdmin: {
          title: 'Acciones en actividades (Admin)',
          items: [
            { icon: 'mdi-information', color: 'info', title: 'Ver detalles', detail: 'Muestra información completa de la actividad.' },
            { icon: 'mdi-pencil-circle', color: 'orange darken-2', title: 'Editar actividad', detail: 'Modifica los datos de la actividad.' },
            { icon: 'mdi-email', color: 'blue darken-2', title: 'Contactar alumno', detail: 'Registra contacto con el alumno sobre su actividad.' },
            { icon: 'mdi-pencil', color: 'orange', title: 'Editar estado', detail: 'Modifica el estado de contacto de la actividad.' },
            { icon: 'mdi-check-bold', color: 'success', title: 'Aprobar actividad', detail: 'Aprueba la actividad enviada por el alumno.' },
            { icon: 'mdi-close-thick', color: 'error', title: 'Rechazar actividad', detail: 'Rechaza la actividad con motivo.' }
          ],
          pages: ['activities', 'students']
        },

        // ACCIONES EN ACTIVIDADES (ESTUDIANTE)
        activityActionsStudent: {
          title: 'Acciones en tus actividades',
          items: [
            { icon: 'mdi-information', color: 'info', title: 'Ver detalles', detail: 'Consulta información y estado de tu actividad.' },
            { icon: 'mdi-pencil-circle', color: 'orange darken-2', title: 'Editar actividad', detail: 'Modifica tu actividad (solo si está pendiente).' },
            { icon: 'mdi-delete-circle', color: 'red darken-2', title: 'Eliminar actividad', detail: 'Elimina tu actividad (solo si está pendiente).' }
          ],
          pages: ['student-dashboard']
        },

        // REPORTES
        reports: {
          title: 'Descargar reportes',
          items: [
            { icon: 'mdi-file-pdf-box', color: 'red', title: 'Descargar PDF', detail: 'Descarga el reporte en formato PDF.' },
            { icon: 'mdi-file-excel-box', color: 'green darken-1', title: 'Descargar Excel', detail: 'Descarga el reporte en formato Excel.' },
            { icon: 'mdi-file-document-multiple', color: 'primary', title: 'Menú de reportes', detail: 'Abre las opciones de descarga disponibles.' }
          ],
          pages: ['periods', 'activities', 'students']
        },

        // ACCIONES EN ADMINS
        adminActions: {
          title: 'Acciones en administradores',
          items: [
            { icon: 'mdi-account-edit', color: 'orange darken-2', title: 'Editar admin', detail: 'Modifica datos del administrador (nombre, rol).' },
            { icon: 'mdi-account-details', color: 'info', title: 'Ver detalles', detail: 'Muestra información del administrador.' },
            { icon: 'mdi-lock-reset', color: 'purple darken-2', title: 'Cambiar contraseña', detail: 'Restablece la contraseña del administrador.' },
            { icon: 'mdi-account-off', color: 'red darken-2', title: 'Desactivar admin', detail: 'Desactiva el acceso del administrador.' },
            { icon: 'mdi-account-badge', color: 'green darken-2', title: 'Activar admin', detail: 'Reactiva el acceso del administrador.' },
            { icon: 'mdi-account-remove', color: 'red darken-2', title: 'Eliminar admin', detail: 'Elimina permanentemente al administrador.' }
          ],
          pages: ['admins']
        },

        // ROLES DE ADMIN
        adminRoles: {
          title: 'Roles de administrador',
          items: [
            { icon: 'mdi-crown', color: 'yellow darken-2', title: 'Superadmin', detail: 'Acceso total: crear periodos, admins, aprobar todo.' },
            { icon: 'mdi-account-tie', color: 'blue darken-2', title: 'Admin', detail: 'Gestiona periodos, actividades y estudiantes.' },
            { icon: 'mdi-check-decagram', color: 'green darken-2', title: 'Validador', detail: 'Valida y aprueba/rechaza actividades de estudiantes.' },
            { icon: 'mdi-eye', color: 'grey darken-2', title: 'Consulta', detail: 'Solo puede visualizar información, sin editar.' }
          ],
          pages: ['admins']
        },

        // NAVEGACIÓN
        navigation: {
          title: 'Navegación',
          items: [
            { icon: 'mdi-arrow-left', color: 'primary', title: 'Regresar', detail: 'Vuelve a la página anterior.' },
            { icon: 'mdi-magnify', color: 'grey darken-1', title: 'Buscar', detail: 'Permite buscar en la tabla o lista.' },
            { icon: 'mdi-magnify-plus', color: 'info', title: 'Ver más', detail: 'Amplía o muestra más información.' }
          ],
          pages: ['activities', 'students']
        },

        // ACCIONES EN CÓDIGOS QR (ADMIN)
        qrActionsAdmin: {
          title: 'Acciones en códigos QR',
          items: [
            { icon: 'mdi-eye', color: 'info', title: 'Ver QR', detail: 'Visualiza el código QR en tamaño completo.' },
            { icon: 'mdi-pencil-circle', color: 'orange darken-2', title: 'Editar QR', detail: 'Modifica descripción o reemplaza la imagen del código QR.' },
            { icon: 'mdi-delete-circle', color: 'red darken-2', title: 'Eliminar QR', detail: 'Elimina permanentemente el código QR.' },
            { icon: 'mdi-download', color: 'success', title: 'Descargar QR', detail: 'Descarga la imagen del código QR a tu dispositivo.' },
            { icon: 'mdi-plus-circle', color: 'primary', title: 'Nuevo QR', detail: 'Sube un nuevo código QR para una carrera y área específica.' }
          ],
          pages: ['qr-codes']
        },

        // FILTROS DE CÓDIGOS QR
        qrFilters: {
          title: 'Filtros y estados',
          items: [
            { icon: 'mdi-filter', color: 'primary', title: 'Filtrar por carrera', detail: 'Filtra los códigos QR por carrera específica.' },
            { icon: 'mdi-filter-variant', color: 'primary', title: 'Filtrar por área', detail: 'Filtra los códigos QR por área de actividad.' },
            { icon: 'mdi-check-circle', color: 'success', title: 'QR activo', detail: 'El código QR está activo y visible para estudiantes.' },
            { icon: 'mdi-close-circle', color: 'grey darken-1', title: 'QR inactivo', detail: 'El código QR está desactivado temporalmente.' }
          ],
          pages: ['qr-codes']
        },

        // REQUISITOS DE UPLOAD QR
        qrUploadInfo: {
          title: 'Requisitos de carga',
          items: [
            { icon: 'mdi-file-image', color: 'info', title: 'Formatos', detail: 'Solo se permiten imágenes PNG, JPG o JPEG.' },
            { icon: 'mdi-weight', color: 'warning', title: 'Tamaño máximo', detail: 'El archivo no debe exceder los 5 MB.' },
            { icon: 'mdi-checkbox-marked-circle', color: 'success', title: 'Carrera y área únicos', detail: 'Solo puede existir un QR por combinación de carrera y área.' },
            { icon: 'mdi-image-search', color: 'grey darken-1', title: 'Vista previa', detail: 'Puedes ver la imagen antes de guardar.' }
          ],
          pages: ['qr-codes']
        },

        // INICIO ESTUDIANTE - ACCESO RÁPIDO
        studentHomeQuickAccess: {
          title: 'Acceso rápido',
          items: [
            { icon: 'mdi-account-circle', color: '#07538a', title: 'Mi perfil', detail: 'Consulta y edita tu información personal.' },
            { icon: 'mdi-clipboard-text-multiple', color: '#a3915f', title: 'Mis actividades', detail: 'Gestiona tus actividades: enviar, editar, consultar estado.' },
            { icon: 'mdi-qrcode', color: '#fed55e', title: 'Códigos QR', detail: 'Desplázate a la sección de códigos QR de tu carrera.' }
          ],
          pages: ['student-home']
        },

        // INICIO ESTUDIANTE - CÓDIGOS QR
        studentHomeQRActions: {
          title: 'Acciones en códigos QR',
          items: [
            { icon: 'mdi-eye', color: 'info', title: 'Ver QR', detail: 'Visualiza el código QR en tamaño completo para escanearlo.' },
            { icon: 'mdi-download', color: 'success', title: 'Descargar QR', detail: 'Descarga la imagen del código QR a tu dispositivo.' },
            { icon: 'mdi-qrcode-scan', color: 'primary', title: 'Escanear', detail: 'Usa tu celular para escanear el código QR mostrado.' }
          ],
          pages: ['student-home']
        },

        // ALERTAS E INFORMACIÓN
        studentHomeAlerts: {
          title: 'Avisos importantes',
          items: [
            { icon: 'mdi-information', color: 'info', title: 'Aviso informativo', detail: 'Información general sobre el sistema o proceso.' },
            { icon: 'mdi-alert', color: 'warning', title: 'Aviso de advertencia', detail: 'Fechas límite o acciones que requieren atención.' },
            { icon: 'mdi-check-circle', color: 'success', title: 'Aviso de éxito', detail: 'Confirmación de acciones completadas correctamente.' }
          ],
          pages: ['student-home']
        },

        // OTROS ICONOS
        others: {
          title: 'Otros íconos',
          items: [
            { icon: 'mdi-delete', color: 'red darken-2', title: 'Eliminar', detail: 'Elimina archivo o elemento.' },
            { icon: 'mdi-image-off', color: 'grey', title: 'Sin imagen', detail: 'No hay imagen disponible.' },
            { icon: 'mdi-account-plus', color: 'success', title: 'Registrarse', detail: 'Crear una nueva cuenta de estudiante.' },
            { icon: 'mdi-logout', color: 'error', title: 'Cerrar sesión', detail: 'Salir de la cuenta actual.' },
            { icon: 'mdi-account-circle', color: 'white', title: 'Perfil', detail: 'Menú de usuario con opciones de cuenta.' }
          ],
          pages: ['general', 'student-dashboard', 'student-home', 'activities']
        }
      }

      // Filtrar grupos según la página
      const filtered = []
      Object.values(allGroups).forEach((group) => {
        if (group.pages.includes(this.pageContext)) {
          filtered.push(group)
        }
      })

      return filtered.length > 0 ? filtered : [allGroups.statesIndicators, allGroups.others]
    },
    getTipMessage () {
      const tips = {
        periods: 'En periodos puedes gestionar los ciclos escolares: crear, activar, finalizar y descargar reportes completos.',
        activities: 'En actividades puedes revisar todas las solicitudes de los alumnos, contactarlos, aprobar o rechazar sus actividades.',
        students: 'Aquí consultas las actividades por alumno. Usa la búsqueda para encontrar rápidamente por nombre o NUA.',
        admins: 'Gestiona los perfiles de administración. Los roles determinan qué acciones puede realizar cada usuario.',
        'student-dashboard': 'Puedes enviar nuevas actividades, editar las pendientes y consultar el estado de todas tus solicitudes.',
        'student-home': '¡Bienvenido! Aquí encontrarás accesos rápidos a tus actividades, perfil y los códigos QR de tu carrera.',
        'qr-codes': 'Gestiona los códigos QR por carrera y área. Los códigos deben ser generados externamente (máx. 5 MB, PNG/JPG).',
        general: 'Usa los íconos de ayuda en cada página para ver información específica del contexto.'
      }
      return tips[this.pageContext] || tips.general
    }
  },

  methods: {
    close () { this.$emit('input', false) }
  }
}
</script>

<style scoped>
.headline { font-weight: 700; }
</style>
