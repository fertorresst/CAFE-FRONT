<template>
  <div>
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
              NO.
            </th>
            <th class="text-center">
              NOMBRE DEL ALUMNO
            </th>
            <th class="text-center">
              NUA
            </th>
            <th class="text-center">
              CARRERA
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(alumno, index) in participants" :key="alumno.id || index">
            <td class="black--text text-center">
              {{ index + 1 }}
            </td>
            <td class="black--text text-center">
              {{ alumno.fullName.toUpperCase() || alumno.name.toUpperCase() }}
            </td>
            <td class="black--text text-center">
              {{ alumno.nua }}
            </td>
            <td class="black--text text-center">
              {{ alumno.career.toUpperCase() }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: {
    participants: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
