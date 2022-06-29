<template>
  <div>
    <apexchart
      type="line"
      height="250"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import { DateTime, Interval } from 'luxon'

export default {
  name: 'RequestPeriodChart',
  // TODO convert this into a subcomponent
  // TODO prop for the events to be displayed
  // TODO the event data will be obtained from db and NOT stored in vuex
  // TODO get event data
  // TODO get event logs
  // TODO get event/users collection
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      series: [
        {
          name: `${this.$t('charts.certifications')}`,
          data: Array.from(
            { length: 30 },
            () => Math.floor(Math.random() * 50) + 1
          ),
        },
        {
          name: `${this.$t('charts.revalidations')}`,
          data: Array.from(
            { length: 30 },
            () => Math.floor(Math.random() * 30) + 1
          ),
        },
      ], // series
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth',
        },
        title: {
          text: `${this.$t('charts.requests')} `,
          align: 'left',
        },
        subtitle: {
          text: `${this.$t('charts.period')} ${this.startDate} - ${
            this.endDate
          }`,
          align: 'left',
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: this.computeCategories(),
          title: {
            text: `${this.$t('charts.date')}`,
          },
        },
        yaxis: {
          title: {
            text: `${this.$t('charts.inscriptions')}`,
          },
          min: 0,
          max: this.max,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      }, // chartOptions
    }
  }, // end of data
  computed: {
    max() {
      const result = this.series.map(item =>
        item.data.reduce((a, b) => Math.max(a, b))
      )
      return Math.max(...result)
    },
  },

  watch: {},
  mounted() {},
  methods: {
    start() {
      return DateTime.fromFormat(this.startDate, 'yyyy-MM-dd')
    },
    end() {
      return DateTime.fromFormat(this.endDate, 'yyyy-MM-dd')
    },
    duration() {
      return Interval.fromDateTimes(this.startDate, this.endDate).count('days')
    },
    computeCategories() {
      const start = this.start()
      const end = this.end()
      console.log('start', start)
      console.log('end', end)
      const duration = Interval.fromDateTimes(start, end).count('days')
      const categories = []

      for (let i = 0; i < duration; i += 1) {
        const day = start.plus({ days: i })
        categories.push(day.toFormat('yyyy-MM-dd'))
      }

      return categories
    }, // end of computeCategories
  },
}
</script>
