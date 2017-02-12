# vue-datepicker

This is yet another vue datepicker component.

## Install

Use npm to download code:

```
npm install hsy-vue-datepicker -S
```

then import into your project, add below code into your `main.js`:

```js
import Datepicker from 'hsy-vue-datepicker'

Vue.use(Datepicker)
```

## Usage

It supports single date mode, you just need to bind your date with `v-model`:

```html
<template>
<div class="demo">
  <datepicker v-model="value"></datepicker>
</div>
</template>

<script>
export default {
  data() {
    return {
      value: ['2017-02-01']
    }
  }
}
</script>
```

also, there is a date-range mode, you just need to specify the mode with prop `mode`:

```html
<template>
<div class="demo">
  <datepicker v-model="value" mode="daterange"></datepicker>
</div>
</template>

<script>
export default {
  data() {
    return {
      value: ['2017-02-01', '2017-02-05']
    }
  }
}
</script>
```

now for more options info you can clone this project and run it's examples:

```
cd your-clone-dir
npm install
npm run dev
```

more stars to summon docs😝

## screenshot

![](http://og9g58alt.bkt.clouddn.com/datepicker.png)
