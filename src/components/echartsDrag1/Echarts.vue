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
  gridTopInit: {
    type: Number,
    default: 47
  },
  max: {  // 各个列表中的数量最大值
    type: Number,
    default: 1
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

const offsetNum = props.offsetNum; // 单个 Y 轴的偏移量，第一个Y轴不偏移
const gridLeftInit = props.gridLeftInit; // 初始 gridLeft 值，只有一个Y轴时，gridLeft的初始值

const colors = ['#5470C6', '#91CC75', '#EE6666'];

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
  option.grid.top = props.gridTopInit + props.max * 20 + (props.max - 1) * 8;
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
    option.grid.top = props.gridTopInit + props.max * 20 + (props.max - 1) * 8;
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
  option.grid.top = props.gridTopInit + props.max * 20 + (props.max - 1) * 8;
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
  // console.log('props.option.series');
  // console.log('newVal', newVal);
  // console.log('oldVal', oldVal);
  if (oldVal.length === 0 && newVal.length > 0) { // 首次添加数据
    option.yAxis = []; // 先清空原有y轴
    initHandlerOption();
  }
  if (option.series.length > 0 && newVal.length === option.series.length + 1) { // 新增数据，默认加在最后
    option.series.push(JSON.parse(JSON.stringify(newVal[newVal.length - 1])));
    addyAxis();
  }
  // console.log('option', option);
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
:deep(.echarts-chart canvas) {
  z-index: 10;
}
</style>