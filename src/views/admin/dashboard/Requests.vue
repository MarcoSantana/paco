<template>
  <v-sheet>
    <v-card class="d-flex flex-column" max-width="100%" height="400">
      <v-card-title>
        <v-icon large left>mdi-frequently-asked-questions</v-icon>
        <span class="text-h6 font-weight-light text-capitalize">
          {{ $t('requests.plural') }}
        </span>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-card-text class="font-weight-bold" style="height: 200;">
        <v-row>
          <v-col cols="8">
            <div>
              <apexchart
                v-if="chartOptions"
                width="300"
                :type="chartOptions.chart.pie"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </div>
          </v-col>
          <v-col cols="4">
            <v-list-item v-if="dashboardCounters">
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">
                  {{ $t('requests.pendingRequests') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ pendingRequests.count }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">
                  {{ $t('requests.acceptedRequests') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ acceptedRequests.count }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">
                  {{ $t('requests.rejectedRequests') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ rejectedRequests.count }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
      <v-spacer></v-spacer>
    </v-card>
  </v-sheet>
</template>

<script>
import CountersDB from '@/firebase/counters-db'
import { mapState } from 'vuex'
import intlDate from '@/filters/intlDate'
import VueApexCharts from 'vue-apexcharts'

const db = new CountersDB()

export default {
  name: 'DashboardRequests',
  filters: { intlDate },
  components: { apexchart: VueApexCharts },
  data() {
    return {
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
      // Chart
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: [
          this.$t('requests.pendingRequests'),
          this.$t('requests.acceptedRequests'),
          this.$t('requests.rejectedRequests'),
        ],
        colors: ['#ffc107', '#28a745', '#dc3545'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    }
  },
  asyncComputed: {
    async pendingRequests() {
      return db.fetchRequestsByType('pending')
    },
    async acceptedRequests() {
      return db.fetchRequestsByType('accepted')
    },
    async rejectedRequests() {
      return db.fetchRequestsByType('rejected')
    },
  },
  computed: {
    ...mapState('admin', ['dashboardCounters']),
    series() {
      const { pendingRequests, acceptedRequests, rejectedRequests } = this
      return [
        pendingRequests ? pendingRequests.count : 0,
        acceptedRequests ? acceptedRequests.count : 0,
        rejectedRequests ? rejectedRequests.count : 0,
      ]
    },
  },
  mounted() {},
  methods: {},
}
</script>
