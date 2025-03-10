<template>
  <v-dialog
    v-model="show"
    max-width="400"
    persistent
  >
    <v-card
      align="center"
      justify="center"
      class="rounded-xl"
    >
      <v-card-text class="bg-blue white--text py-4">
        <h2>
          EDITAR PERIODO
        </h2>
      </v-card-text>

      <v-card-text class="py-3">
        <h3
          class="text-justify subtitle black--text"
        >
          El siguiente periodo será editado:
          <strong
            class="text-left subtitle mt-4"
            style="color: #07538a"
          >
            {{ periodToEdit.id }}
          </strong>
        </h3>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'InfoPeriod',
  data () {
    return {
      // Your component data goes here
    }
  },
  computed: {
    // Your computed properties go here
  },
  mounted () {
    // Code to run when the component is mounted
  },
  methods: {
    // Your component methods go here
  }
}
</script>

<style scoped>
/* Your component styles go here */
</style>
