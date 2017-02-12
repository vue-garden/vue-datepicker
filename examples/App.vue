<template>
<div class="demo">
  <datepicker cssClass="test1" placeholder="hehe" v-model="value" mode="daterange" min="2017-02-12"></datepicker>
  <datepicker cssClass="test2" placeholder="hehe" v-model="value" mode="daterange" min="2017-02-12"></datepicker>
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

.test2 .selected {
  text-align: right;
}
</style>
