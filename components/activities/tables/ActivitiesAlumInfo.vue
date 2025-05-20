<template>
  <v-simple-table
    class="text-center subtitle"
    dense
  >
    <template #default>
      <thead
        class="black--text"
      >
        <tr>
          <th class="text-center">
            NUA
          </th>
          <th class="text-center">
            CARRERA
          </th>
          <th class="text-center">
            CORREO
          </th>
          <th class="text-center">
            TELÉFONO
          </th>
          <th class="text-center">
            SOLICITUDES
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="black--text text-center">
            {{ alum.nua }}
          </td>
          <td class="black--text text-center">
            {{ alum.career }}
          </td>
          <td class="black--text text-center">
            {{ alum.email }}
          </td>
          <td class="black--text text-center">
            {{ formatPhone(alum.phone) }}
          </td>
          <td class="black--text text-center">
            {{ getLength(alum) }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    alum: {
      type: Object,
      required: true
    }
  },

  methods: {
    formatPhone (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    },

    getLength (alum) {
      if (alum.activities) {
        return alum.activities.length
      }

      if (alum.collectives) {
        return alum.collectives.length
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
