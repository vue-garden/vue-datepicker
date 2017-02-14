# vue-datepicker

This is yet another vue datepicker component.

## Install

Use npm to download code:

```
npm install hsy-vue-datepicker -S
```

then import it into your project, add below code into your `main.js`:

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

it contains a hot-realod example for your preview or dev, run it follow:

```sh
$ cd your-clone-dir
$ npm install
$ npm run dev
```

## Props

| Prop         | Description                                      | Type                               | Accepted Values | Default  |
|:-------------|:-------------------------------------------------|:-----------------------------------|:----------------|:---------|
| value        | dates to be manipulated                          | String/Moment/Date/Array of former | --              | moment() |
| mode         | mode of picker                                   | String                             | date/daterange  | date     |
| cssClass     | css class to be appended to component $el        | String                             | --              | --       |
| placeholder  | placeholder                                      | String                             | --              | --       |
| cbDate0Error | callback for error input from user of begin date | --                                 | --              |          |
| cbDate1Error | callback for error input from user of end date   | --                                 | --              |          |

## Screenshot

<img src="http://og9g58alt.bkt.clouddn.com/datepicker.png" width="500">
