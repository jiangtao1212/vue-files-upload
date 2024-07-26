<template>
  <div ref="chartPage" class="echarts-container">
    <div ref="refChart" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup lang='ts'>
import { useElementSize } from "@vueuse/core";
import * as echarts from "echarts";
import { onMounted, nextTick, ref, onBeforeUnmount, watch } from "vue";

const refChart = ref();
let myChart: echarts.EChartsType;

const colors = ['#5470C6', '#91CC75', '#EE6666'];
// 指定图表的配置项和数据
const option = {
  color: colors,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  grid: {
    right: '10%',
    left: 125,
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  legend: {
    data: ['Evaporation', 'Precipitation', 'Temperature']
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
  yAxis: [
    {
      show: true,
      type: 'value',
      name: 'Evaporation[ml]',
      position: 'left',
      offset: 0,
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[0]
        }
      },
    },
    {
      show: true,
      type: 'value',
      name: 'Precipitation[ml]',
      position: 'left',
      offset: 40,
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[1]
        }
      },
    },
    {
      show: true,
      type: 'value',
      name: '温度[°C]',
      position: 'left',
      offset: 80,
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[2]
        }
      },
    },
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'line',
      yAxisIndex: 0,
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ]
    },
    {
      name: 'Precipitation',
      type: 'line',
      yAxisIndex: 1,
      data: [
        26, 59, 90, 264, 287, 707, 175.6, 182.2, 487, 188, 60, 23
      ]
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 2,
      data: [2000, 2200, 3300, 4500, 6300, 1020, 2030, 2340, 2300, 1650, 1200, 620]
    }
  ]
};

const initChart = () => {
  if (refChart.value) {
    //初始化echarts实例
    myChart = echarts.init(refChart.value);
    // 使用刚指定的配置项和数据显示图表。
    option && myChart.setOption(option);
    test();
  }
};

// 模拟拖动事件
const test = () => {
  setTimeout(function () {
    handleDragEvent([1], [2], 1);
    setTimeout(function () {
      handleDragEvent([0], [2, 1], 0);
      setTimeout(function () {
        handleDragEvent([2, 1, 0], [], 2);
        setTimeout(function () {
          handleDragEvent([1, 0], [], 0);
        }, 5000);
      }, 5000);
    }, 5000);
  }, 5000);
}

// 模拟拖动事件后的处理逻辑
const handleDragEvent = (arr1: Array<number>, arr2: Array<number>, dragEvent: number) => {
  myChart.clear();
  // myChart.dispose();
  // var chartDom1 = document.getElementById('main');
  // var myChart1 = echarts.init(chartDom1);
  // console.log(myChart1);
  judgeYAxis(arr1, arr2, dragEvent);
  // console.log(option);
  // 更新图表
  myChart.setOption(option);
}

/**
 * 判断拖动逻辑，
 * 1 当源块数组长度为1 ------ 判断目标块长度
 *     1.1 目标块数组长度为0时 ------ 不操作；
 *     1.2 目标块数组长度大于1时 ------ Y 轴数量减1，将源块中第一个数据Y轴索引修改为目标块的第一个数据所在的Y轴索引；
 * 2 当源块数组长度大于1 ------ 判断目标块长度
 *     2.1 目标块数组长度为0时 ------ 判断移动的数据是否为源块中第一个数据
 *         2.1.1 若是第一个数据 ------ Y 轴数量加1，将源块中除第一个元素之外的元素移动到空白处，也就是将这些数据Y轴索引修改为源块第二个数据所在的Y轴索引；
 *         2.1.2 若不是第一个数据 ------ Y 轴数量加1，将移动的数据所在的Y轴显示修改为true；
 *     2.2 目标块数组长度大于0时 ------ 判断移动的数据是否为源块中第一个数据
 *         2.2.1 若是第一个数据 ------ 先将源块中除第一个元素之外的元素移动到空白处，再将第一个元素移动到目标块；
 *         2.2.2 若不是第一个数据 ------ 将移动的数据所在的Y轴索引修改为目标块的第一个数据所在的Y轴索引。
 * @param {Array} originBlockArray 原始块数组 数组长度必须大于或者等于1
 * @param {Array} targetBlockArray 目标块数组 数组长度可以为0，也可以大于0
 * @param {number} originYAxisIndex 原始块中拖动的数据索引
 */
const judgeYAxis = (originBlockArray: Array<number>, targetBlockArray: Array<number>, originYAxisIndex: number) => {
  if (originBlockArray.length === 1) {
    if (targetBlockArray.length === 0) {
      return;
    } else {
      showYCount--;
      const originBlock = originBlockArray[0];
      const targetBlock = targetBlockArray[0];
      handleOption1(originBlock, targetBlock, showYCount);
    }
  } else if (originBlockArray.length > 1) { //源块中有元素(大于1)
    if (targetBlockArray.length === 0) {  //目标块中没有元素
      if (originYAxisIndex === originBlockArray[0]) { //源块中移动的是第一个元素
        // 移动源块中除第一个元素之外的元素到空白处
        showYCount++;
        for (let i = 1; i < originBlockArray.length; i++) {
          const originBlock = originBlockArray[i];
          const targetBlock = originBlockArray[1];
          handleOption1(originBlock, targetBlock, showYCount);
        }
      } else { //源块中移动的是非第一个元素
        showYCount++;
        const originBlock = originYAxisIndex;
        const targetBlock = originYAxisIndex;
        handleOption1(originBlock, targetBlock, showYCount);
      }
    } else { //目标块中有元素(大于0)
      if (originYAxisIndex === originBlockArray[0]) { //源块中移动的是第一个元素
        // 先移动源块中除第一个元素之外的元素到空白处
        showYCount++;
        for (let i = 1; i < originBlockArray.length; i++) {
          const originBlock = originBlockArray[i];
          const targetBlock = originBlockArray[1];
          handleOption1(originBlock, targetBlock, showYCount);
        }
        // 再移动第一个元素到目标块
        showYCount--;
        const originBlock = originBlockArray[0];
        const targetBlock = targetBlockArray[0];
        handleOption1(originBlock, targetBlock, showYCount);
      } else { //源块中移动的是非第一个元素
        const originBlock = originYAxisIndex;
        const targetBlock = targetBlockArray[0];
        handleOption1(originBlock, targetBlock, showYCount);
      }
    }
  }
}

let showYCount = 3; // 显示的 Y 轴数量
const offsetNum = 40; // 单个 Y 轴的偏移量，第一个Y轴不偏移
const gridLeftInit = 45; // 初始 gridLeft 值，只有一个Y轴时，gridLeft的初始值
/**
 * 处理移动逻辑
 * @param {number} originYAxisIndex 原始Y轴索引
 * @param {number} targetYAxisIndex 目标Y轴索引
 * @param {number} showYCount 显示的Y轴数量
 */
const handleOption1 = (originYAxisIndex: number, targetYAxisIndex: number, showYCount: number) => {
  // 1. 修改series中对应Y轴的索引
  option.series[originYAxisIndex].yAxisIndex = targetYAxisIndex;
  // 2. 隐藏不需要的Y轴
  option.yAxis[originYAxisIndex].show = false;
  // 3. 显示目标Y轴，无论此时的目标Y轴是否在显示状态
  option.yAxis[targetYAxisIndex].show = true;
  // 4. 对显示的Y轴进行偏移, 注意：在初始化option时，yAxis要写show的配置，默认都写成true，否则这里会出现筛选不到Y轴的情况
  option.yAxis.filter(item => item.show === true).forEach((item, index) => {
    item.offset = offsetNum * index; // 设置 Y 轴的偏移量, 这里的index是从0开始的
  });
  // 5. 修改gridLeft值
  option.grid.left = gridLeftInit + offsetNum * (showYCount - 1);
}



//重新渲染图表
const resizeChart = () => {
  // 折叠板延迟时间
  setTimeout(() => {
    myChart?.resize();
  }, 400);
};

// 监听页面大小变化
const chartPage = ref();
const { width: pageWidth } = useElementSize(chartPage);
// watch(pageWidth, () => {
//   resizeChart();
// });

// 初始化渲染
onMounted(() => {
  nextTick(() => {
    initChart();
    // window.addEventListener("resize", resizeChart);
  });
});

//销毁
onBeforeUnmount(() => {
  // window.removeEventListener("resize", resizeChart);
});
</script>

<style lang="less" scoped></style>