<template>
<div class="demo">
  <div>
    <datepicker cssClass="test1" placeholder="click to select date" v-model="value" mode="daterange" min="2017-02-12"></datepicker>
  </div>
  <div style="text-align: right;">
    <datepicker cssClass="test2" placeholder="click to select date" v-model="value" mode="daterange" min="2017-02-12"></datepicker>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      value: ['2017-02-01'],
      cls: 'test'
    }
  },
  watch: {
    value(val) {
      console.log(val)
    }
  },
  mounted() {
    setTimeout(() => {
      this.cls = 'test1'
    }, 3000)
  }
}
</script>

<style>
.demo {
  background-color: #0097FF;
  padding: 10px;
}
</style>
