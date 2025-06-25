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
            <strong class="black--text">NUA</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">SEDE</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">CARRERA</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">CORREO</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">TELÉFONO</strong>
          </th>
          <th class="text-center">
            <strong class="black--text">SOLICITUDES</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="black--text text-center">
            {{ alum.nua }}
          </td>
          <td class="black--text text-center">
            {{ alum.sede }}
          </td>
          <td class="black--text text-center">
            {{ getCareerAcronym(alum.career) }}
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

  data () {
    return {
      careerAcronyms: {
        IS75LI0103: 'LIM',
        IS75LI0203: 'LIE',
        IS75LI0303: 'LICE',
        IS75LI03Y3: 'LICE-Y',
        IS75LI0403: 'LIME',
        IS75LI0502: 'LISC',
        IS75LI05Y2: 'LISC-Y',
        IS75LI0602: 'LGE',
        IS75LI06Y2: 'LGE-Y',
        IS75LI0702: 'LAD',
        IS75LI0801: 'LIDIA',
        IS75LI08Y2: 'LEI-Y'
      }
    }
  },

  methods: {
    formatPhone (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    },

    getCareerAcronym (key) {
      return this.careerAcronyms[key] || key
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
