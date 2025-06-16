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
            <strong class="black--text">AREA</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">DP/VSS</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">RS/VCI</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">CEE/EIE</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">FCI/ICP</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">AC</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="text-center">
            <strong>HORAS</strong>
          </th>
          <td class="black--text text-center">
            {{ getAreaHours('DP/VSS') }}
          </td>
          <td class="black--text text-center">
            {{ getAreaHours('RS/VCI') }}
          </td>
          <td class="black--text text-center">
            {{ getAreaHours('CEE/EIE') }}
          </td>
          <td class="black--text text-center">
            {{ getAreaHours('FCI/ICP') }}
          </td>
          <td class="black--text text-center">
            {{ getAreaHours('AC') }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    activities: {
      type: Array,
      required: true
    }
  },
  methods: {
    getAreaHours (area) {
      // Suma solo las horas de actividades aprobadas en el área indicada
      return this.activities
        .filter(act => act.area === area && act.status === 'approval')
        .reduce((sum, act) => sum + (Number(act.hours) || 0), 0)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
