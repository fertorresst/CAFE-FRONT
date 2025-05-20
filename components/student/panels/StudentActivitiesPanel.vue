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

    <StudentActivityDeleteDialog
      v-if="activityDeleteDialog"
      :activity-delete="activityDelete"
      @action="decoder"
    />
  </v-col>
</template>

<script>
import StudentActivityDeleteDialog from '../dialogs/StudentActivityDeleteDialog'
import StudentPeriodInfoTable from '../tables/StudentPeriodInfoTable'
import StudentActivityInfoDialog from '../dialogs/StudentActivityInfoDialog'
import StudentSendActivities from '../tables/StudentSendActivities'

export default {
  components: { StudentActivityDeleteDialog, StudentPeriodInfoTable, StudentActivityInfoDialog, StudentSendActivities },

  props: {
    sendActivities: {
      type: Array,
      required: true,
      default: () => {}
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

      activityDeleteDialog: false,
      activityDelete: {}
    }
  },

  methods: {
    decoder (data) {
      if (data.action === 'cancel') {
        this.clean()
      }

      if (data.action === 'activityInfoDialog') {
        this.activityInfo = data.item
        this.activityInfoDialog = true
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

      this.activityDelete = {}
      this.activityDeleteDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
