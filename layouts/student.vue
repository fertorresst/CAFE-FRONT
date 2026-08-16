<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      color="#a3915f"
      fixed
      app
      :temporary="true"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="white">
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{ studentData.name.toUpperCase() || '' }}
              {{ studentData.lastName.toUpperCase() || '' }}
              {{ studentData.secondLastName.toUpperCase() || '' }}
            </v-list-item-title>
            <v-list-item-subtitle class="white--text text--disabled">
              {{ studentData.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <hr>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          class="white--text"
          router
          exact
        >
          <v-list-item-action>
            <v-icon color="white">
              {{ item.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      color="#07538a"
      class="white--text"
      fixed
      dense
      app
    >
      <v-row class="d-flex align-center justify-center flex-row" no-gutters>
        <v-col cols="4" class="d-flex justify-start">
          <v-app-bar-nav-icon
            color="#cd7005"
            @click.stop="drawer = !drawer"
          />
        </v-col>

        <v-col cols="4" class="d-flex justify-center">
          <v-toolbar-title>
            <v-img
              src="/MiCAFÉ.svg"
              alt="MiCAFE"
              max-width="100"
              contain
              class="mx-auto"
            />
          </v-toolbar-title>
        </v-col>

        <v-col cols="4" class="d-flex justify-end">
          <v-menu
            v-model="notificationsMenu"
            offset-y
            left
            :close-on-content-click="false"
            max-width="420"
            min-width="360"
          >
            <template #activator="{ on, attrs }">
              <v-badge
                :content="unreadNotifications"
                :value="unreadNotifications > 0"
                color="red"
                overlap
                offset-x="12"
                offset-y="12"
              >
                <v-btn
                  icon
                  color="#fed55e"
                  v-bind="attrs"
                  v-on="on"
                  @click="fetchNotifications"
                >
                  <v-icon>
                    {{
                      unreadNotifications > 0
                        ? 'mdi-bell-ring'
                        : 'mdi-bell-outline'
                    }}
                  </v-icon>
                </v-btn>
              </v-badge>
            </template>

            <v-card>
              <v-card-title
                class="d-flex align-center justify-space-between"
              >
                <span>Notificaciones</span>

                <v-btn
                  v-if="unreadNotifications > 0"
                  text
                  small
                  color="#07538a"
                  @click="markAllAsRead"
                >
                  Marcar todas como leídas
                </v-btn>
              </v-card-title>

              <v-divider />

              <v-list
                v-if="notifications.length"
                max-height="420"
                class="overflow-y-auto"
              >
                <template
                  v-for="notification in notifications"
                >
                  <v-list-item
                    :key="notification.id"
                    :class="{
                      'unread-notification':
                        !notification.isRead
                    }"
                    @click="openNotification(notification)"
                  >
                    <v-list-item-avatar>
                      <v-icon
                        :color="
                          notificationColor(
                            notification.status
                          )
                        "
                      >
                        {{
                          notificationIcon(
                            notification.status
                          )
                        }}
                      </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-bold"
                      >
                        {{ notification.title }}
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        {{ notification.activityName }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle
                        class="notification-message"
                      >
                        {{ notification.message }}
                      </v-list-item-subtitle>

                      <small class="grey--text">
                        {{
                          formatNotificationDate(
                            notification.createdAt
                          )
                        }}
                      </small>
                    </v-list-item-content>

                    <v-list-item-icon
                      v-if="!notification.isRead"
                    >
                      <v-icon
                        small
                        color="red"
                      >
                        mdi-circle
                      </v-icon>
                    </v-list-item-icon>
                  </v-list-item>

                  <v-divider
                    :key="`divider-${notification.id}`"
                  />
                </template>
              </v-list>

              <v-card-text
                v-else
                class="text-center grey--text py-8"
              >
                <v-icon
                  size="48"
                  color="grey lighten-1"
                >
                  mdi-bell-off-outline
                </v-icon>

                <p class="mt-3 mb-0">
                  No tienes notificaciones.
                </p>
              </v-card-text>
            </v-card>
          </v-menu>
          <v-btn
            v-if="isLoggedIn()"
            color="#cd7005"
            class="rounded-pill"
            text
            @click="logout"
          >
            <v-icon>mdi-logout</v-icon>
            <strong class="pl-2 d-none d-md-inline">CERRAR SESIÓN</strong>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main class="bg-default">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <ui-alert v-if="showAlert" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import uiAlert from '@/components/ui-alert.vue'

export default {
  name: 'AdminLayout',

  components: {
    uiAlert
  },

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      notificationsMenu: false,
      notifications: [],
      notificationInterval: null,
      items: [
        {
          icon: 'mdi-home',
          title: 'INICIO',
          to: '/student'
        },
        {
          icon: 'mdi-account',
          title: 'MI PERFIL',
          to: '/student/profile'
        },
        {
          icon: 'mdi-book-open-page-variant',
          title: 'MIS ACTIVIDADES',
          to: '/student/dashboard'
        }
      ],
      studentData: {
        name: '',
        lastName: '',
        secondLastName: '',
        email: ''
      }
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert,
      student: state => state.user
    }),
    unreadNotifications () {
      return this.notifications.filter(
        notification => !notification.isRead
      ).length
    }
  },

  created () {
    const studentId = this.$store.state.user?.id
    if (studentId) {
      this.fetchStudentData(studentId)
    }
  },
  mounted () {
    this.fetchNotifications()

    this.notificationInterval =
      setInterval(() => {
        this.fetchNotifications()
      }, 30000)
  },
  beforeDestroy () {
    if (this.notificationInterval) {
      clearInterval(
        this.notificationInterval
      )
    }
  },
  methods: {
    async fetchNotifications () {
      try {
        const res = await this.$axios.get(
          '/notifications',
          {
            withCredentials: true
          }
        )

        if (res.data.success) {
          this.notifications =
            res.data.notifications
        }
      } catch (error) {
        // Evitamos mostrar una alerta cada vez
        // que falle el polling.
        // eslint-disable-next-line no-console
        console.error(
          'Error al obtener notificaciones:',
          error
        )
      }
    },
    async markNotificationAsRead (
      notification
    ) {
      if (notification.isRead) {
        return
      }

      try {
        const url =
          `/notifications/${notification.id}/read`

        const res = await this.$axios.patch(
          url,
          {},
          {
            withCredentials: true
          }
        )

        if (res.data.success) {
          notification.isRead = 1
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Error al marcar notificación:',
          error
        )
      }
    },
    async markAllAsRead () {
      try {
        const res = await this.$axios.patch(
          '/notifications/read-all',
          {},
          {
            withCredentials: true
          }
        )

        if (res.data.success) {
          this.notifications =
            this.notifications.map(
              notification => ({
                ...notification,
                isRead: 1
              })
            )
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Error al marcar notificaciones:',
          error
        )
      }
    },
    async openNotification (notification) {
      await this.markNotificationAsRead(
        notification
      )

      this.notificationsMenu = false

      if (
        this.$route.path !==
        '/student/dashboard'
      ) {
        this.$router.push(
          '/student/dashboard'
        )
      }
    },
    notificationIcon (status) {
      const icons = {
        approval: 'mdi-check-circle',
        rejected: 'mdi-close-circle',
        contacted: 'mdi-message-alert',
        pending: 'mdi-clock-outline'
      }

      return (
        icons[status] ||
        'mdi-bell-outline'
      )
    },

    notificationColor (status) {
      const colors = {
        approval: 'success',
        rejected: 'error',
        contacted: 'warning',
        pending: 'grey'
      }

      return (
        colors[status] ||
        '#07538a'
      )
    },
    formatNotificationDate (date) {
      if (!date) {
        return ''
      }

      return new Date(
        date
      ).toLocaleString(
        'es-MX',
        {
          dateStyle: 'short',
          timeStyle: 'short'
        }
      )
    },
    async logout () {
      try {
        const res = await this.$axios.post('/users/logout', {}, { withCredentials: true })
        if (res.data.success) {
          this.$router.push('/')
          this.mostrarAlerta('green', 'success', 'SESIÓN CERRADA CORRECTAMENTE.')
        } else {
          this.mostrarAlerta('red', 'error', res.data.message)
        }
      } catch (e) {
        this.mostrarAlerta('red', 'error', 'ERROR AL CERRAR SESIÓN. VUELVE A INTENTARLO.')
      }
    },

    async isLoggedIn () {
      try {
        await this.$axios.get('/users/me', { withCredentials: true })
        return true
      } catch (e) {
        return false
      }
    },

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

    async fetchStudentData (studentId) {
      try {
        const res = await this.$axios.get(`/users/get-user/${studentId}`, { withCredentials: true })
        if (res.data && res.data.success) {
          this.$store.commit('setUser', res.data.user)
          this.studentData = res.data.user
        } else {
          this.$store.commit('setUser', {})
        }
      } catch (e) {
        this.$store.commit('setUser', {})
      }
    }
  }
}
</script>

<style scoped>
.unread-notification {
  background-color: #f3f8fc;
}

.notification-message {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
