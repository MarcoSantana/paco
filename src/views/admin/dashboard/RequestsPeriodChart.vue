<template>
  <div v-if="event">
    <apexchart
      type="line"
      height="250"
      :options="chartOptions"
      :series="mySeries"
    ></apexchart>
  </div>
</template>
<script>
import { isNil } from 'lodash'
import VueApexCharts from 'vue-apexcharts'
import { DateTime, Interval } from 'luxon'

export default {
  name: 'RequestPeriodChart',
  // DONE convert this into a subcomponent
  // DONE prop for the events to be displayed
  // DONE the event data will be obtained from db and NOT stored in vuex
  // DONE get event data
  // TODO get event logs
  // DONE get event/users collection
  // TODO compute the series from the even.users data
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    event: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      // series: [
      //   {
      //     name: `${this.$t('charts.certifications')}`,
      //   },
      //   /* {
      //    *   name: `${this.$t('charts.revalidations')}`,
      //    *   data: Array.from(
      //    *     { length: 30 },
      //    *     () => Math.floor(Math.random() * 30) + 1
      //    *   ),
      //    * }, */
      // ], // series
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
          text: '',
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
          categories: this.myCategories,
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
    myStartDate() {
      if (isNil(this.event)) return null
      return this.formatDate(this.event.activateOn)
    },
    myEndDate() {
      if (isNil(this.event)) return null
      return this.formatDate(this.event.deactivateOn)
    },
    myCategories() {
      if (isNil(this.event)) return null
      const start = DateTime.fromFormat(this.myStartDate, 'yyyy-MM-dd')
      const end = DateTime.fromFormat(this.myEndDate, 'yyyy-MM-dd')
      const duration = Interval.fromDateTimes(start, end).count('days')
      const categories = []

      for (let i = 0; i < duration; i += 1) {
        const day = start.plus({ days: i })
        categories.push(day.toFormat('yyyy-MM-dd'))
      }
      console.log('categories', categories)
      return categories
    }, // end of myCategories
    mySeries() {
      console.log('mySeries')
      if (isNil(this.event)) return null
      const registrationDates = this.event.users.map(item =>
        DateTime.fromJSDate(item.createTimestamp).toFormat('yyyy-MM-dd')
      )
      const data = this.myCategories.map(cat => {
        return registrationDates.filter(date => date === cat).length
      })
      return [
        {
          name: `${this.$t('charts.inscriptions')}`,
          data,
        },
      ]
      /* console.table('registrationDates', registrationDates)
       * return this.event.users.length */
    }, // end of mySeries
  },

  watch: {
    myStartDate() {
      this.chartOptions.subtitle.text = `${this.$t('period')} ${
        this.myStartDate
      } - ${this.myEndDate}`
    },
    myEndDate() {
      this.chartOptions.subtitle.text = `${this.$t('period')} ${
        this.myStartDate
      } - ${this.myEndDate}`
    },
    event() {
      this.chartOptions.xaxis.categories = this.myCategories
    },
  },
  mounted() {},
  methods: {
    formatDate(date) {
      if (isNil(date)) return null
      return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('yyyy-MM-dd')
    },

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
      const start = this.myStartDate
      const end = this.myEndDate
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
