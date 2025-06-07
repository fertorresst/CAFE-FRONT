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
            NOMBRE DEL PERIODO
          </th>
          <th class="text-center">
            INICIO
          </th>
          <th class="text-center">
            TÉRMINO
          </th>
          <th class="text-center">
            ESTADO
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="black--text text-center">
            {{ period.name.toUpperCase() }}
          </td>
          <td class="black--text text-center">
            {{ moment(period.dateStart).format('DD MMM YY').toUpperCase() }}
          </td>
          <td class="black--text text-center">
            {{ moment(period.dateEnd).format('DD MMM YY').toUpperCase() }}
          </td>
          <td class="black--text text-center">
            <v-icon
              v-if="period.status === 'active'"
              color="success"
              small
            >
              mdi-calendar-check
            </v-icon>

            <v-icon
              v-else-if="period.status === 'ended'"
              color="blue-grey"
              small
            >
              mdi-calendar-end
            </v-icon>

            <v-icon
              v-else-if="period.status === 'pending'"
              color="warning"
              small
            >
              mdi-calendar-clock
            </v-icon>
            <br>
            <strong
              :class="{
                'success--text': period.status === 'active',
                'blue-grey--text': period.status === 'ended',
                'warning--text': period.status === 'pending'
              }"
            >
              {{ getStatusText(period.status) }}
            </strong>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    period: {
      type: Object,
      required: true
    },
    moment: {
      type: Function,
      required: true
    }
  },

  methods: {
    getStatusText (status) {
      const statusMap = {
        active: 'ACTIVO',
        ended: 'FINALIZADO',
        pending: 'EN REVISIÓN'
      }

      return statusMap[status] || status
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
