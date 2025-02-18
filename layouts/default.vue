<template>
  <v-app>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      color="#a3915f"
      fixed
      app
    >
      <v-list>
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
    </v-navigation-drawer> -->

    <v-app-bar
      color="#07538a"
      class="white--text"
      fixed
      app
    >
      <v-app-bar-nav-icon
        color="white"
        @click.stop="drawer = !drawer"
      />
      <v-spacer />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        color="white"
        icon
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="bg-default">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->

    <ui-alert v-if="showAlert" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import uiAlert from '@/components/ui-alert.vue'

export default {
  name: 'DefaultLayout',

  components: {
    uiAlert
  },

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      title: 'CAFE'
    }
  },

  computed: {
    ...mapState({
      showAlert: state => state.showAlert
      // token: state => state.token
    })
  },

  watch: {
    showAlert () {}
  },

  methods: {
    mostrarAlerta (color, type, message) {
      this.$store.commit('modifyAlert', true)
      this.$store.commit('modifyColor', `${color} darken-4`)
      this.$store.commit('modifyIcon', color === 'green' ? 'mdi-check-circle' : 'mdi-close-circle')
      this.$store.commit('modifyType', type)
      this.$store.commit('modifyText', message)
      setTimeout(() => {
        this.$store.commit('modifyAlert', false)
      }, 3000)
    }
  }
}
</script>

<style scoped>

</style>
