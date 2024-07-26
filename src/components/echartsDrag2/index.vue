<template>
  <div class='echarts-drag-containter'>
    <input type="button" class="add-btn" @click="addBtnClick" value="add legend" />
    <div class="content">
      <div class="drag">
        <Drag :data="dataAbout.legendData" @update="update" />
      </div>

      <Echarts :option="dataAbout.option" :legendShowData="dataAbout.legendShowData" :gridTopInit="top"
        :seriesyAxisIndexData="dataAbout.seriesyAxisIndexData" :max="dataAbout.max" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeMount } from 'vue';
import Drag from "./Drag.vue";
import { type EChartsOption, type EChartsType } from "echarts";

import Echarts from "./Echarts.vue";

const top = 5 + 16 + 5 + 3 + 10.5; // 图表顶部距离(不包含集合内的子项高度 + 子项间距) 10.5是自定义的另加的

const dataAbout = reactive({
  legendData: [] as Array<string>,
  legendShowData: [] as Array<boolean>,
  seriesyAxisIndexData: [] as Array<number>,
  option: {
    // color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      // top: top + 1 * 20 + (1 - 1) * 4,
      top: 0,
      right: '10%',
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [
      {
        name: 'Month',
        type: 'category',
        position: 'bottom',
        axisTick: {
          alignWithLabel: true
        },
        // prettier-ignore
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    ],
    yAxis: [],
    series: []
  } as EChartsOption,
  max: 2, // 各个列表中的数量最大值,设置固定高度
});
const legendData = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8'];
const seriesData = [
  [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
  [26, 59, 90, 264, 287, 707, 175.6, 182.2, 487, 188, 60, 23],
  [2000, 2200, 3300, 4500, 6300, 1020, 2030, 2340, 2300, 1650, 1200, 620],
  [200, 200, 300, 500, 600, 102, 230, 340, 230, 650, 120, 620],
  [20, 49, 70, 232, 256, 777, 135.6, 162.2, 326, 200, 64, 33],
  [126, 159, 190, 264, 1287, 707, 1175.6, 1182.2, 1487, 1188, 160, 123],
  [1200, 1220, 1330, 1550, 1630, 1120, 1230, 1340, 1230, 1650, 1200, 1620],
  [226, 259, 290, 264, 287, 2707, 2175.6, 2182.2, 2487, 2188, 260, 223],
];

// 拖拽更新数据
const update = (data: Array<any>) => {
  console.log('update', data);
  dataAbout.max = Math.max(...data.map(item => item.value.length));
  const legendShowData = data.map(item => item.value.length > 0); // 只有当有数据时才显示图例
  const seriesyAxisIndexData = new Array(data.length).fill(0);
  data.forEach((item, index) => {
    item.value.forEach((subItem: any, subIndex: number) => {
      seriesyAxisIndexData[+subItem.id - 1] = index;
    });
  });
  dataAbout.legendShowData = legendShowData;
  dataAbout.seriesyAxisIndexData = seriesyAxisIndexData;
  console.log('legendShowData', dataAbout.legendShowData);
  console.log('seriesyAxisIndexData', dataAbout.seriesyAxisIndexData);
}

// 点击按钮新增数据
const addBtnClick = () => {
  addLegendData();
  addSeriesData();
}

// 增加图例数据
const addLegendData = () => {
  dataAbout.legendData.push(legendData[(dataAbout.option.series as Array<any>).length]);

  // 这里是为了解决数组地址不变化导致子组件watch监听的新值和旧值一直不变的问题
  // 但是这样做会导致数据更新时，子组件重新渲染，导致页面卡顿，所以这里暂时不采用这种方式
  // dataAbout.legendData = JSON.parse(JSON.stringify(dataAbout.legendData));
  // dataAbout.legendData.push(`new-${dataAbout.legendData.length + 1}`);
}

// 增加系列数据
const addSeriesData = () => {
  (dataAbout.option.series as Array<any>).push({
    name: legendData[(dataAbout.option.series as Array<any>).length],
    type: 'line',
    yAxisIndex: (dataAbout.option.series as Array<any>).length,
    data: seriesData[(dataAbout.option.series as Array<any>).length]
  });
};

// 初始化模拟数据
const initData = () => {
  setTimeout(() => {
    dataAbout.legendData = ['A1'];
  }, 200);
}
onBeforeMount(() => {
  addSeriesData();
});

onMounted(() => {
  initData();
});

</script>
<style scoped lang='less'>
@import '@/assets/styles/mixin.less';

.echarts-drag-containter {
  .add-btn {
    display: block;
    margin: 0 auto 10px;
  }

  .content {
    .flex-column();
    gap: 2vh;
    position: relative;

    .drag {
      position: absolute;
      top: 5px;
      right: 15%;
      padding: 2px;
      .border-radius(5px, #6b72800d);
      box-shadow: 3px 3px 5px #e8e8e8, -3px 3px 5px #e8e8e8;
      z-index: 20;
    }

    .echarts-container {
      height: 400px;
      width: 100%;
      .border-radius();
    }

  }


}
</style>