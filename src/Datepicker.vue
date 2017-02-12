<template>
<div class="vue-datepicker" :class="cls">
  <div class="selected">
    <input type="text" :placeholder="placeholder" readonly="readonly" :value="selectedValue" @click="showCalendar">
  </div>
  <div class="calendar" v-show="isCalendarShow">
    <div class="tables">
      <div class="table" v-for="(page, idx) in pages">
        <div class="input">
          <input type="text" v-if="idx === 0" v-model="input0" @blur="recoverInput0">
          <input type="text" v-if="idx === 1" v-model="input1" @blur="recoverInput1">
        </div>
        <table>
          <thead>
            <tr>
              <th class="prev" @click="backPage"></th>
              <th colspan="5" class="month"> {{ page.date.format && page.date.format('YYYY年 M月') }} </th>
              <th class="next" @click="forwardPage"></th>
            </tr>
            <tr>
              <th>日</th>
              <th>一</th>
              <th>二</th>
              <th>三</th>
              <th>四</th>
              <th>五</th>
              <th>六</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in page.dates">
              <td v-for="date in row" :class="date.cssClass" @click="selectDate(date)" @mouseover="previewDates(date)">
                {{ date.date() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="confirm">
      <button class="yes left" @click="saveChanges" :disabled="!savable">确定</button>
      <button class="no right" @click="hideCalendar">取消</button>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'

const NIL = {}
const EMPTY_FN = () => {}

const MODE_DATE = 'date'
const MODE_DATERANGE = 'daterange'

const DATE_FORMATTER = 'YYYY年MM月DD日'

export default {
  name: 'Datepicker',
  data() {
    return {
      date: [moment(), moment()],
      selecting: [moment(), moment()],
      input0: '',
      input1: '',
      minDate: NIL,
      maxDate: NIL,
      pagesDate: moment(),
      pages: [{
        date: NIL,
        dates: []
      }],
      isCalendarShow: false,
      savable: true,
      isSelecting: false,
      previewEndDate: NIL
    }
  },
  props: {
    // date|daterange
    mode: {
      type: String,
      default: 'date'
    },
    min: {
      validator(val) {
        return moment(val).isValid()
      }
    },
    max: {
      validator(val) {
        return moment(val).isValid()
      }
    },
    value: {},
    cssClass: String,
    placeholder: String,
    cbDate0Error: {
      type: Function,
      default: EMPTY_FN
    },
    cbDate1Error: {
      type: Function,
      default: EMPTY_FN
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.prepareDate()
        this.isSelecting = false
      }
    },
    min: {
      immediate: true,
      handler(val) {
        this.prepareMinMax()
      }
    },
    max: {
      immediate: true,
      handler(val) {
        this.prepareMinMax()
      }
    }
  },
  computed: {
    date0: {
      set(newVal) {
        let date = moment(newVal)
        if (!date.isValid()) {
          if (this.cbDate0Error !== EMPTY_FN) {
            this.cbDate0Error(newVal)
            return
          } else {
            throw new Error('deformed value of date0')
          }
        }
        this.$set(this.date, 0, date)
        this.$set(this.pages, 0, {
          date: date.clone(),
          dates: []
        })
        this.selecting0 = date.clone()
      },
      get() {
        return this.date[0].format(DATE_FORMATTER)
      }
    },
    date1: {
      set(newVal) {
        let date = moment(newVal)
        if (!date.isValid()) {
          if (this.cbDate1Error !== EMPTY_FN) {
            this.cbDate1Error(newVal)
            return
          } else {
            throw new Error('deformed value of date0')
          }
        }
        this.$set(this.date, 1, date)
        this.$set(this.pages, 1, {
          date: date.clone(),
          dates: []
        })
        this.selecting1 = date.clone()
      },
      get() {
        return this.date[1].format(DATE_FORMATTER)
      }
    },
    selecting0: {
      set(newVal) {
        this.input0 = newVal.format(DATE_FORMATTER)
        this.$set(this.selecting, 0, newVal)
        this.preparePages()
      },
      get(newVal) {
        return this.selecting[0].format(DATE_FORMATTER)
      }
    },
    selecting1: {
      set(newVal) {
        this.input1 = newVal.format(DATE_FORMATTER)
        this.$set(this.selecting, 1, newVal)
        this.preparePages()
      },
      get(newVal) {
        return this.selecting[1].format(DATE_FORMATTER)
      }
    },
    cls() {
      let daterange = this.mode === MODE_DATERANGE
      let cls = {
        'vue-datepicker': true,
        daterange
      }
      if (this.cssClass) {
        cls[this.cssClass] = true
      }
      return cls
    },
    selectedValue() {
      if (this.mode === MODE_DATE) {
        return this.date0
      }
      return this.date0 + ' - ' + this.date1
    }
  },
  methods: {
    prepareDate() {
      if (this.value === undefined) return

      let value = this.value
      if (this.mode === MODE_DATE) {
        if (Array.isArray(value) && value.length) {
          this.date0 = value[0]
        } else {
          this.date0 = value
        }
      } else if (this.mode === MODE_DATERANGE && Array.isArray(value) && value.length === 2) {
        this.date0 = value[0]
        this.date1 = value[1]
      }

      this.pagesDate = this.date[0].clone()
    },
    prepareMinMax() {
      if (this.min) {
        this.minDate = moment(this.min)
      }
      if (this.max) {
        this.maxDate = moment(this.max)
      }
      if (this.minDate && this.maxDate && this.minDate.isAfter(this.maxDate)) {
        throw new Error("'min' should same or before of 'max'")
      }
    },
    isSameYearMonthDay(date, date1) {
      return date.isSame(date1, 'year') && date.isSame(date1, 'month'), date.isSame(date1, 'day')
    },
    isSelectingStart(date) {
      return this.isSameYearMonthDay(date, this.selecting[0])
    },
    isSelectingBetween(date) {
      if (this.MODE_DATE) {
        return true
      }
      if (this.isSelecting) {
        return this.previewEndDate !== NIL && date.isAfter(this.selecting[0]) && date.isBefore(this.previewEndDate)
      }
      return date.isAfter(this.selecting[0]) && date.isBefore(this.selecting[1])
    },
    isSelectingEnd(date) {
      if (this.MODE_DATE) {
        return true
      }
      return !this.isSelecting && this.isSameYearMonthDay(date, this.selecting[1])
    },
    prepareDates(date) {
      date = date.clone()
      date.date(1)
      let dayOfWeek = date.day()
      let dates = []
      let d
      for (let i = dayOfWeek; i > 0; i--) {
        d = date.clone().subtract(i, 'days')
        d.cssClass = {
          off: true
        }
        dates.push(d)
      }

      let cssDate = (date) => {
        let start = this.isSelectingStart(d)
        if (this.mode === MODE_DATERANGE) {
          let between = this.isSelectingBetween(d)
          let end = this.isSelectingEnd(d)
          d.cssClass = {
            start,
            between,
            end
          }
        } else {
          d.cssClass = {
            active: start
          }
        }
        return d
      }

      d = date.clone()
      dates.push(cssDate(d))
      for (let i = 1, len = date.daysInMonth(); i < len; i++) {
        d = date.clone().add(i, 'days')
        dates.push(cssDate(d))
      }
      date = dates[dates.length - 1]
      let tail = 42 - dates.length
      for (let i = 1; i <= tail; i++) {
        d = date.clone().add(i, 'days')
        d.cssClass = {
          off: true
        }
        dates.push(d)
      }
      let row = []
      let rows = [row]
      dates.forEach((date) => {
        if (row.length !== 7) {
          row.push(date)
        } else {
          row = [date]
          rows.push(row)
        }
      })
      return rows
    },
    preparePages() {
      let date = this.pagesDate
      let dates = this.prepareDates(date)
      this.$set(this.pages, 0, {
        date,
        dates
      })
      if (this.mode === MODE_DATERANGE) {
        date = this.pagesDate.clone()
        date.add(1, 'month')
        let dates = this.prepareDates(date)
        this.$set(this.pages, 1, {
          date,
          dates
        })
      }
    },
    selectDate(date) {
      if (date.cssClass.off) return
      if (this.mode === MODE_DATE) {
        this.selecting0 = date
        return
      }
      if (!this.isSelecting || this.isSelecting && date.isBefore(this.selecting[0])) {
        this.savable = false
        this.isSelecting = true
        this.selecting0 = date
      } else {
        this.savable = true
        this.isSelecting = false
        this.previewEndDate = NIL
        this.selecting1 = date
      }
    },
    backPage() {
      this.pagesDate.subtract(1, 'month')
      this.preparePages()
    },
    forwardPage() {
      this.pagesDate.add(1, 'month')
      this.preparePages()
    },
    dateFromStr(str) {
      let date = moment(str, DATE_FORMATTER)
      if (date.isValid()) return date
      date = moment(str)
      if (date.isValid()) return date
      return moment.invalid()
    },
    recoverInput0() {
      let date = this.dateFromStr(this.input0)
      if (date.isValid()) {
        this.selecting0 = date
      } else {
        this.input0 = this.selecting0
      }
    },
    recoverInput1() {
      let date = this.dateFromStr(this.input1)
      if (date.isValid()) {
        this.selecting1 = date
      } else {
        this.input1 = this.selecting1
      }
    },
    saveChanges() {
      this.date0 = this.selecting[0]
      if (this.mode === MODE_DATE) {
        this.$emit('input', this.date[0].clone())
      } else {
        this.date1 = this.selecting[1]
        this.$emit('input', this.date.map(d => d.clone()))
      }
      this.isCalendarShow = false
    },
    showCalendar() {
      this.selecting0 = this.date[0]
      this.selecting1 = this.date[1]

      this.isCalendarShow = !this.isCalendarShow
      if (!this.isCalendarShow) return

      this.$nextTick(() => {
        let inputEl = this.$el.querySelector('.selected > input')
        let calendarEl = this.$el.querySelector('.calendar')
        if (inputEl && calendarEl) {
          let boundRect = inputEl.getBoundingClientRect()
          calendarEl.style.top = (boundRect.bottom + 5) + 'px'
          let calendarRect = calendarEl.getBoundingClientRect()
          if (boundRect.left + calendarRect.width > document.body.clientWidth - 35) {
            calendarEl.style.left = (boundRect.right - calendarRect.width) + 'px'
          } else {
            calendarEl.style.left = boundRect.left + 'px'
          }
        }
      })
    },
    hideCalendar() {
      this.isCalendarShow = false
    },
    previewDates(date) {
      if (this.isSelecting) {
        this.previewEndDate = date
        this.preparePages()
      }
    },
    autoHide(evt) {
      if (!this.$el.contains(evt.target)) {
        this.hideCalendar()
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed() {
    document.removeEventListener('click', this.autoHide, false)
  }
}
</script>

<style>
.vue-datepicker {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-weight: 400;
  font-size: 14px;
}

.vue-datepicker .calendar {
  display: inline-block;
  background: #fff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  padding: 13px 20px;
  position: absolute;
}

.vue-datepicker .calendar .input input {
  display: block;
  padding: 0;
  border: 1px solid #979797;
  margin-bottom: 13px;
  border-radius: 4px;
  width: 100%;
  font-size: 13px;
  color: #6A7288;
  height: 30px;
  line-height: 30px;
  text-align: center;
  outline: none;
}

.vue-datepicker .calendar .input input:focus {
  border: 1px solid #0097FF;
}

.vue-datepicker .calendar .tables {
  white-space: nowrap;
}

.vue-datepicker .calendar .table table {
  border-collapse: collapse;
  border-spacing: 0;
}

.vue-datepicker .calendar .table thead th.prev,
.vue-datepicker .calendar .table thead th.next {
  height: 20px;
  width: 20px;
  padding: 5px;
  border-radius: 4px;
  display: block;
  cursor: pointer;
}

.vue-datepicker .calendar .table thead tr:last-child th {
  padding: 10px 0;
}

.vue-datepicker .calendar .table thead th.prev:hover,
.vue-datepicker .calendar .table thead th.next:hover {
  background-color: #888;
}

.vue-datepicker .calendar .table thead th.prev {
  background: #9B9B9B url('assets/images/arrow-left-white.svg') no-repeat center center;
}

.vue-datepicker .calendar .table thead th.next {
  background: #9B9B9B url('assets/images/arrow-right-white.svg') no-repeat center center;
}

.vue-datepicker .calendar .table thead th {
  color: #333;
  font-weight: normal;
}

.vue-datepicker .calendar .table {
  color: #6a7288;
}

.vue-datepicker .calendar .table td {
  width: 20px;
  height: 20px;
  padding: 5px;
  text-align: center;
}

.vue-datepicker .calendar .table td:hover {
  width: 20px;
  height: 20px;
  padding: 5px;
  border-radius: 4px;
  white-space: nowrap;
  cursor: pointer;
  background-color: #eee;
  color: #333;
}

.vue-datepicker .calendar .table td.off {
  color: #ccc;
}

.vue-datepicker .calendar .table td.off:hover {
  background-color: #fff;
  cursor: default;
}

.vue-datepicker .calendar .table td.start {
  background-color: #00A0FF;
  color: #fff;
  border-radius: 4px 0 0 4px;
}

.vue-datepicker .calendar .table td.active {
  background-color: #00A0FF;
  color: #fff;
  border-radius: 4px;
}

.vue-datepicker .calendar .table td.between {
  background-color: #B9E6FF;
  color: #6A7289;
}

.vue-datepicker .calendar .table td.between+td:not(.end):hover {
  border-radius: 0;
}

.vue-datepicker .calendar .table td.between:hover {
  border-radius: 0;
  background-color: #eee;
}

.vue-datepicker .calendar .table td.end {
  background-color: #00A0FF;
  color: #fff;
  border-radius: 0 4px 4px 0;
}

.vue-datepicker .calendar .table td.start.end {
  border-radius: 4px;
}

.vue-datepicker .calendar .confirm {
  text-align: right;
  padding: 10px 0;
  padding-bottom: 0;
}

.vue-datepicker .calendar .confirm button {
  border: 0;
  border-radius: 3px;
  color: #fff;
  width: 80px;
  height: 33px;
  outline: none;
  cursor: pointer;
  font-size: 12px;
}

.vue-datepicker .calendar .confirm button.yes {
  background-color: #00A0FF;
}

.vue-datepicker .calendar .confirm button.yes:disabled {
  background-color: #58B7FF;
  cursor: not-allowed;
}

.vue-datepicker .calendar .confirm button.no {
  background-color: #9B9B9B;
  margin-left: 7px;
}

.vue-datepicker .left {
  float: left;
}

.vue-datepicker .right {
  float: right;
}

.vue-datepicker .calendar .confirm::after {
  content: "";
  clear: both;
}

.vue-datepicker.daterange .table {
  display: inline-block;
}

.vue-datepicker.daterange .table:first-child th.next {
  visibility: hidden;
}

.vue-datepicker.daterange .table:last-child {
  margin-left: 10px;
}

.vue-datepicker.daterange .table:last-child th.prev {
  visibility: hidden;
}

.vue-datepicker.daterange .confirm button {
  float: none
}

.vue-datepicker .selected input {
  border: 1px solid #fff;
  border-radius: 5px;
  width: 250px;
  height: 28px;
  padding: 0;
  background-color: #0097FF;
  color: #fff;
  font-size: 12px;
  outline: none;
  text-indent: 12px;
  background: url('assets/images/light-arrow-down.svg') no-repeat right center;
}
</style>
