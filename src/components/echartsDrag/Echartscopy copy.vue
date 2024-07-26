<template>
  <div class="echarts-container">
    <div ref="refChart" class="echarts-chart"></div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, nextTick, ref, onBeforeUnmount, watch, onBeforeMount } from "vue";
import { useElementSize, useDebounceFn } from "@vueuse/core";
import * as echarts from "echarts";
import { type EChartsOption, type EChartsType } from "echarts";

const props = defineProps({
  legendShowData: {
    type: Array<Boolean>,
    default: () => []
  },
  seriesyAxisIndexData: {
    type: Array<number>,
    default: () => []
  },
  offsetNum: {
    type: Number,
    default: 40
  },
  gridLeftInit: {
    type: Number,
    default: 45
  },
  option: {
    type: Object,
    default: () => { }
  }
});

const option = JSON.parse(JSON.stringify(props.option));

const refChart = ref();
const chartSize = useElementSize(refChart);
let myChart: EChartsType;

const legendData = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8'];
// const seriesData = [
//   [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
//   [26, 59, 90, 264, 287, 707, 175.6, 182.2, 487, 188, 60, 23],
//   [2000, 2200, 3300, 4500, 6300, 1020, 2030, 2340, 2300, 1650, 1200, 620],
//   [200, 200, 300, 500, 600, 102, 230, 340, 230, 650, 120, 620],
//   [20, 49, 70, 232, 256, 777, 135.6, 162.2, 326, 200, 64, 33],
//   [126, 159, 190, 264, 1287, 707, 1175.6, 1182.2, 1487, 1188, 160, 123],
//   [1200, 1220, 1330, 1550, 1630, 1120, 1230, 1340, 1230, 1650, 1200, 1620],
//   [226, 259, 290, 264, 287, 2707, 2175.6, 2182.2, 2487, 2188, 260, 223],
// ];
const offsetNum = props.offsetNum; // 单个 Y 轴的偏移量，第一个Y轴不偏移
const gridLeftInit = props.gridLeftInit; // 初始 gridLeft 值，只有一个Y轴时，gridLeft的初始值

const colors = ['#5470C6', '#91CC75', '#EE6666'];
// 指定图表的配置项和数据
// const option: EChartsOption = {
//   // color: colors,
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross'
//     }
//   },
//   grid: {
//     right: '10%',
//     left: gridLeftInit + offsetNum * (seriesData.length - 1),
//   },
//   toolbox: {
//     feature: {
//       dataView: { show: true, readOnly: false },
//       restore: { show: true },
//       saveAsImage: { show: true }
//     }
//   },
//   legend: {
//     data: legendData
//   },
//   xAxis: [
//     {
//       name: 'Month',
//       type: 'category',
//       position: 'bottom',
//       axisTick: {
//         alignWithLabel: true
//       },
//       // prettier-ignore
//       data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//     }
//   ],
//   yAxis: [],
//   series: []
// };

const initChart = () => {
  if (refChart.value) {
    //初始化echarts实例
    myChart = echarts.init(refChart.value);
    // 使用刚指定的配置项和数据显示图表。
    option && myChart.setOption(option);
    // test();
  }
};

// 初始化处理option
const initHandlerOption = () => {
  option.series.forEach((item: any, index: number) => {
    item.yAxisIndex = index;
    const yAxis = {
      show: true,
      type: 'value',
      name: item.name,
      nameTextStyle: {
        align: 'right',
        padding: [0, 10, 0, 0]
      },
      position: 'left',
      offset: index * offsetNum,
      alignTicks: true,
      // axisLine: {
      //   show: true,
      //   lineStyle: {
      //     color: colors[0]
      //   }
      // },
    };
    // @ts-ignore
    option.yAxis.push(yAxis);
  });
  option.legend = { show: false };
  option.grid.left = gridLeftInit + offsetNum * (option.series.length - 1);
};

// 新增Y轴
const addyAxis = () => {
  const item = option.series[option.series.length - 1];
  const offset = offsetNum * (option.yAxis.filter((item: any) => item.show === true).length);
  const yAxis = {
      show: true,
      type: 'value',
      name: item.name,
      nameTextStyle: {
        align: 'right',
        padding: [0, 10, 0, 0]
      },
      position: 'left',
      offset: offset,
      alignTicks: true,
      // axisLine: {
      //   show: true,
      //   lineStyle: {
      //     color: colors[0]
      //   }
      // },
    };
    option.yAxis.push(yAxis);
    const showYCount = option.yAxis.filter((item: any) => item.show === true).length;
    option.grid.left = gridLeftInit + offsetNum * (showYCount - 1);
}

// 重新对option进行修改
const optionForm = () => {
  // myChart.clear();
  props.legendShowData.forEach((item, index) => {
    // @ts-ignore
    option.yAxis && option.yAxis[index] && (option.yAxis[index].show = item);
  });
  props.seriesyAxisIndexData.forEach((item, index) => {
    // @ts-ignore
    option.series && option.series[index] && (option.series[index].yAxisIndex = item);
  });
  // @ts-ignore
  option.yAxis && option.yAxis.filter(item => item.show === true).forEach((item, index) => {
    item.offset = offsetNum * index; // 设置 Y 轴的偏移量, 这里的index是从0开始的
  });
  // 5. 修改gridLeft值
  const showYCount = option.yAxis.filter((item: any) => item.show === true).length;
  // @ts-ignore
  option.grid.left = gridLeftInit + offsetNum * (showYCount - 1);
  myChart.setOption(option);
}

//重新渲染图表
const debouncedFn = useDebounceFn(() => {
  myChart?.resize({
    // @ts-ignore
    animation: true,
  })
}, 400);

// 监听props变化
watch(() => props.legendShowData, () => {
  optionForm();
}, { deep: true });

// 监听props.option.series变化
watch(() => props.option.series, (newVal, oldVal) => {
  console.log('props.option.series');
  console.log('newVal', newVal);
  console.log('oldVal', oldVal);
  if (oldVal.length === 0 && newVal.length > 0) { // 首次添加数据
    option.yAxis = []; // 先清空原有y轴
    initHandlerOption();
  }
  if (option.series.length > 0 && newVal.length === option.series.length + 1) { // 新增数据，默认加在最后
    option.series.push(JSON.parse(JSON.stringify(newVal[newVal.length - 1])));
    addyAxis();
  }
  console.log('option', option);
  myChart.setOption(option);
}, { deep: true});

// 监听echarts容器宽度变化，重新渲染图表
watch(chartSize.width, () => {
  debouncedFn();
});

onBeforeMount(() => {
  option.yAxis = []; // 先清空原有y轴
  initHandlerOption();
});

// 初始化渲染
onMounted(() => {
  nextTick(() => {
    initChart();
    // window.addEventListener("resize", debouncedFn);
  });
});

//销毁
onBeforeUnmount(() => {
  // window.removeEventListener("resize", debouncedFn);
});
</script>

<style lang="less" scoped>
.echarts-chart {
  width: 100%;
  height: 100%;
  min-height: 200px;
  min-width: 600px;
}
</style>