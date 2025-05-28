<template>
  <v-col cols="12">
    <v-expansion-panels focusable class="w-100">
      <v-expansion-panel v-for="(period, index) in sendActivities" :key="index">
        <v-expansion-panel-header class="bg-blue white--text">
          <h4>{{ period.name.toUpperCase() }}</h4>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            flat
            class="elevation-0 my-2"
          >
            <v-card-text class="black--text">
              <StudentPeriodInfoTable
                :period="period"
                :moment="moment"
              />
              <StudentSendActivities
                :send-activities="period.activities"
                :period-status="period.status"
                :footer-props="footerProps"
                :moment="moment"
                @action="decoder"
              />
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <StudentActivityInfoDialog
      v-if="activityInfoDialog"
      :activity-info="activityInfo"
      :moment="moment"
      @action="decoder"
    />

    <StudentActivitiesEditDialog
      v-if="activityEditDialog"
      :activity-edit="activityEdit"
      :areas="areas"
      :required-rule="requiredRule"
      :date-end-rule="dateEndRule"
      :get-send-activities="getSendActivities"
      :mostrar-alerta="mostrarAlerta"
      :moment="moment"
      @action="decoder"
    />

    <StudentActivityDeleteDialog
      v-if="activityDeleteDialog"
      :activity-delete="activityDelete"
      @action="decoder"
    />
  </v-col>
</template>

<script>
import StudentActivitiesEditDialog from '../dialogs/StudentActivitiesEditDialog'
import StudentActivityDeleteDialog from '../dialogs/StudentActivityDeleteDialog'
import StudentPeriodInfoTable from '../tables/StudentPeriodInfoTable'
import StudentActivityInfoDialog from '../dialogs/StudentActivityInfoDialog'
import StudentSendActivities from '../tables/StudentSendActivities'

export default {
  components: { StudentActivitiesEditDialog, StudentActivityDeleteDialog, StudentPeriodInfoTable, StudentActivityInfoDialog, StudentSendActivities },

  props: {
    sendActivities: {
      type: Array,
      required: true,
      default: () => {}
    },
    areas: {
      type: Array,
      required: true
    },
    requiredRule: {
      type: Function,
      required: true
    },
    dateEndRule: {
      type: Function,
      required: true
    },
    filesLimitRule: {
      type: Function,
      required: true
    },
    mostrarAlerta: {
      type: Function,
      required: true
    },
    getSendActivities: {
      type: Function,
      required: true
    },
    footerProps: {
      type: Object,
      required: true,
      default: () => {}
    },
    moment: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      activityInfoDialog: false,
      activityInfo: {},

      activityEditDialog: false,
      activityEdit: {},

      activityDeleteDialog: false,
      activityDelete: {}
    }
  },

  methods: {
    decoder (data) {
      if (data.action === 'cancel') {
        console.log(this.sendActivities)
        this.clean()
      }

      if (data.action === 'activityInfoDialog') {
        this.activityInfo = data.item
        this.activityInfoDialog = true
      }

      if (data.action === 'activityEditDialog') {
        this.activityEdit = data.item
        this.activityEditDialog = true
      }

      if (data.action === 'activityDeleteDialog') {
        this.activityDelete = data.item
        this.activityDeleteDialog = true
      }

      if (data.action === 'deleteActivity') {
        this.$emit('action', { action: 'deleteActivity', item: data.item })
        this.clean()
      }
    },

    clean () {
      this.activityInfo = {}
      this.activityInfoDialog = false

      this.activityEdit = {}
      this.activityEditDialog = false

      this.activityDelete = {}
      this.activityDeleteDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
