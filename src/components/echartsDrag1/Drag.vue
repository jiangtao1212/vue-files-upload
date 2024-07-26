<template>
  <div class="drag-container">
    <div class="main">
      <VueDraggable id="reset-default" class="reset" v-model="dataAbout.reset" :animation="150" :sort="false"
        ghostClass="ghost" group="people1" :disabled="true" :scroll="false">
        <!-- <span id="reset-default-span">Reset Default</span> -->
      </VueDraggable>
      <VueDraggable v-for="(data, index) in dataAbout.list" :key="data.key" v-show="data.value.length > 0"
        class="flex flex-col gap-2 p-5px  bg-gray-500/5 rounded"
        :style="{ height: data.value.length * 20 + (data.value.length - 1) * 8 + 10 + 'px' }"
        v-model="dataAbout.list[index].value" :animation="150" :sort="false" ghostClass="ghost" group="people"
        @update="onUpdate" @add="onAdd" @start="onStart" @end="onEnd" @remove="remove" @sort="sore" @move="move"
        @change="change">
        <div v-for="item in dataAbout.list[index].value" :key="item.id" @click="onItemClick(item)"
          class="cursor-move h-5 line-height-5 bg-gray-500/5 rounded p-10px text-2.5 flex justify-center items-center">
          {{ item.name }}
        </div>
      </VueDraggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, watch, watchEffect } from 'vue';
import { useDebounceFn } from "@vueuse/core";
import { VueDraggable } from 'vue-draggable-plus';

const emit = defineEmits(['update']);

const props = defineProps({
  data: {
    type: Array<string>,
    default: () => [],
  },
});

type valueType = {
  name: string,
  id: string,
}

// 示例数据：{ key: '1', value: [{ name: 'coao-1', id: '1' }] }
type listDataType = {
  key: string,
  value: Array<valueType>,
}

const dataAbout = reactive({
  reset: [{ name: 'xxx-0', id: '0' }],
  list: [] as Array<listDataType>,
});

// 数据，非响应式
const dataConst = {
  dropEffect: 'move', // 拖动的实时效果
  dataCache: [], // 缓存数据
}

const onItemClick = (item: valueType) => {
  //TODO: 后期可以增加点击切换显示隐藏legend效果，通过改变series系列的show属性实现
  // console.log('onItemClick', item);
}

function change(e: any) {
  // console.log('change', e);
}

function move(e: any) {
  // console.log('move', e);
}

function sore(e: any) {
  // console.log('sort')
  // return false;
}

function onUpdate() {
  console.log('update')
}

function onAdd(e: any) {
  // console.log('add')
}

function remove() {
  // console.log('remove')
}

// 开始拖动时，缓存数据，为了在拖动结束时还原数据做准备
const onStart = (e: any) => {
  // console.log('start');
  dataConst.dataCache = JSON.parse(JSON.stringify(dataAbout.list)); // 深拷贝
}

// 延迟函数
function delay(time = 100) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * @description 拖动结束时，进行数据处理
 * 1.停顿100ms；
 * 2.判断是否拖动到非可放置区域；
 *  2.1 是，则还原数据，并且返回；
 *  2.2 否，往下执行。
 * 3 判断是否拖动到重置框中；
 *  3.1 是，则进行重置列表操作；
 *  3.2 否，则进行排序操作。
 * 4.发送更新数据事件。
 * @param e 事件对象
 */
const onEnd = async (e: any) => {
  console.log('end');
  // console.log('end', e);
  await delay(100); // 停顿100ms，注：这里必须进行停顿，因为此时监听的drag事件中的数据由于使用了防抖函数，可能还未更新到最新数据。（测试下来，这里快了50ms左右，所以这里设置100ms停顿）
  if (dataConst.dropEffect === 'none') { // 若拖动到非可放置区域，则还原数据
    dataAbout.list = JSON.parse(JSON.stringify(dataConst.dataCache));
    return;
  }
  if (dragResetDefaultFlag(e)) { // 拖动到重置框中，进行重置列表操作
    resetDefault(e);
  } else { // 拖动到其他列表中，进行排序操作
    sortEnd(e);
    adjustOrder();
  }
  emit('update', JSON.parse(JSON.stringify(dataAbout.list))); // 发送更新数据事件
}

/**
 * @autor jiangtao
 * @description 在拖动结束时，找到拖动的元素所在的数组，并将该元素拖动到数组的最后
 * 注意：这里不能在onAdd中进行排序，因为onAdd中移动是异步的，此时还未更新到最新数据，导致排序错误。
 * 因此，这里在onEnd中进行排序。
 * @param e 事件对象
 */
const sortEnd = (e: any) => {
  // console.group('sortEnd');
  const listData: Array<any> = JSON.parse(JSON.stringify(dataAbout.list)); // 深拷贝
  // console.log('JSON.stringify(dataAbout.list)', JSON.stringify(dataAbout.list));
  // console.log('sortEnd', listData);
  // console.log('e', e);
  const dragText = e.item.innerText; // 拖动的元素文本，A1
  const from_innerText = e.from.innerText; // 拖动的元素原始所在的列表文本（已去除拖动元素） B1\nC3
  const to_innerText = e.to.innerText; // 拖动的元素目标所在的列表文本（已添加拖动元素）  A1\nD4\nE5
  const tt = to_innerText.split('\n');
  // 处理数据, 找到拖动的元素，拖动到数组最后
  handleData: for (let i = 0; i < listData.length; i++) {
    let itemArray = listData[i].value;
    for (let j = 0; j < itemArray.length; j++) {
      if (dragText === itemArray[j].name && j !== itemArray.length - 1) {
        const data = itemArray[j];
        itemArray.splice(j, 1);
        itemArray.push(data);
        break handleData;
      }
    }
  }
  // console.log('sortEnd', listData);
  // console.groupEnd();
  dataAbout.list = listData;
}

/**
 * 调整顺序，确保列表中的第一个元素和默认列表是对应的。
 * 例如：[{ name: 'xxx-2', id: '2' }, { name: 'xxx-1', id: '1' }]列表，该列表就应该在总list数组中的第二个位置
 */
const adjustOrder = () => {
  // 注意：这里需要拷贝两次，然后整理最终的数据，再赋值给dataAbout.list，
  //（先循环清空响应式数据，再循环赋值会导致顺序出现问题，原因是两个for循环同时执行，响应式数据渲染出现问题）
  // 猜测v-if可能会解决这个问题，没有尝试，因为在这里v-if和v-for在一起使用会有问题，同时频繁的v-if切换会影响性能
  const copyData1: Array<any> = JSON.parse(JSON.stringify(dataAbout.list)); // 深拷贝
  const copyData2: Array<any> = JSON.parse(JSON.stringify(dataAbout.list)); // 深拷贝
  // console.log(dataAbout.list);
  // console.log(copyData1);

  copyData1.forEach(item => item.value.length = 0); // 模拟清空
  copyData2.forEach((itemArray: any, index: number) => {
    if (itemArray.value.length === 0) return;
    copyData1.forEach(item => {
      if (item.key === itemArray.value[0].id) {
        item.value.push(...itemArray.value);
      }
    });
  });
  dataAbout.list = copyData1;
}

// 判断是否拖动到重置框中
const dragResetDefaultFlag = (e: any) => {
  let flag = true; // 标识，默认是true，表示拖动到重置框中
  const id = e.originalEvent.toElement.id;
  const idArray: Array<string> = ['reset-default', 'reset-default-span'];
  if (!id || !idArray.includes(id)) flag = false; // 没有拖动到重置框中
  return flag;
}

/**
 * 重置默认列表：元素拖动到重置框中，源列表中移除拖动的元素，默认列表中显示拖动的元素
 * @param e 事件对象
 */
const resetDefault = (e: any) => {
  console.log('resetDefault');
  const listData: Array<any> = JSON.parse(JSON.stringify(dataAbout.list)); // 深拷贝
  // 拖动的元素数据
  let dragData: any = {};
  const symbolKeys = Object.getOwnPropertySymbols(e.item);
  symbolKeys.forEach(symbol => {
    dragData = e.item[symbol]; // Symbol(cloneElement), 输出 { name: 'xxx-1', id: '1' }
  });
  // 处理数据
  let originIndex = 0; // 源列表索引，从0开始
  let dragItemIndex = 0; // 拖动的元素索引，从0开始
  // let dragItemId: string = '1'; // 拖动的元素id
  let dragItemNextId: string = '1'; // 拖动的元素后一个元素id
  let newArray = []; // 新的数组
  handleData: for (let i = 0; i < listData.length; i++) {
    let itemArray = listData[i].value;
    for (let j = 0; j < itemArray.length; j++) {
      if (JSON.stringify(dragData) === JSON.stringify(itemArray[j]) && itemArray.length > 1) { // 源列表中最少有两个元素
        const itemArrayCache = JSON.parse(JSON.stringify(itemArray));
        if (j === 0) { // 若拖动的是第一个元素，则将源列表中第二个直至最后一个元素都添加到第二个元素所在的默认列表中
          dragItemNextId = itemArrayCache[1].id;
          originIndex = i;
          dragItemIndex = 0;
          newArray = itemArrayCache.splice(1);
          console.log(itemArray);
          console.log(newArray);
        } else {
          originIndex = i;
          dragItemIndex = j;
          // 源列表中移除拖动的元素
          itemArrayCache.splice(j, 1);
          // 对应的默认列表中显示拖动的元素
          // listData.forEach(item => {
          //   if (item.key === dragData.id) {
          //     item.value.push(dragData);
          //   }
          // });
        }
        break handleData;
      }
    }
  }
  if (dragItemIndex === 0) {
    listData[originIndex].value.splice(1);
    listData.forEach(item => {
      if (item.key === dragItemNextId) {
        item.value.push(...newArray);
      }
    });
  } else {
    listData[originIndex].value.splice(dragItemIndex, 1);
    listData.forEach(item => {
      if (item.key === dragData.id) {
        item.value.push(dragData);
      }
    });
  }
  console.log(listData);
  dataAbout.list = listData;
}

/**
 * @description 监听拖动事件，实时更新dropEffect
 * 注：这里必须使用防抖函数，否则dropEffect获取的值一直是none。
 * 原因是e.dataTransfer.dropEffect的值是异步更新的，实际上此时的e值只是{"isTrusted":true}，其他属性还未更新，所以获取的值一直是none。
 * @param e 事件对象
 */
const debouncedFn = useDebounceFn((e: any) => {
  dataConst.dropEffect = e.dataTransfer.dropEffect;
  // console.log('dropEffect', e.dataTransfer.dropEffect);
}, 100);

watch(() => props.data, (newVal, oldVal) => { // TODO: 这里有问题，第二次触发，打印的newVal和oldVal都是同一个数组，原因是父级对数组进行了push操作，并没有改变数组的地址，所以这里虽然会触发watch，但newVal和oldVal都是同一个数组。
  // 解决方法：在父级使用JSON.stringify()对数组进行赋值，这里数组地址就改变了，newVal和oldVal就不会是同一个数组了。
  // console.log('watch', newVal, oldVal);
  if (oldVal.length === 0 && newVal.length > 0) { // 首次添加数据
    dataAbout.list = newVal.map((item, index) => {
      return { key: (index + 1).toString(), value: [{ name: item, id: (index + 1).toString() }] };
    });
  }
  if (dataAbout.list.length > 0 && newVal.length === dataAbout.list.length + 1) { // 新增数据，默认加在最后
    const index = newVal.length;
    dataAbout.list.push({ key: index.toString(), value: [{ name: newVal[index - 1], id: index.toString() }] });
  }
  // console.log('dataAbout.list', dataAbout.list);
}, { deep: true });

onMounted(() => {
  // 监听拖动事件
  const container: HTMLDivElement = document.querySelector(".drag-container") as HTMLDivElement;
  container.addEventListener('drag', debouncedFn);
});

//销毁
onBeforeUnmount(() => {
  // 移除拖动事件监听
  window.removeEventListener('drag', debouncedFn);
});
</script>

<style scoped lang="less">
@import '@/assets/styles/mixin.less';

.main {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;

  .reset {
    // padding: 1rem 0;
    width: 100%;
    height: 1rem;
    border-radius: 0.25rem 0.25rem 0 0;
    overflow: hidden;
    background-color: #e5e5e5;
    span {
      color: #333;
      font-size: 0.8rem;
    }
  }
}
</style>
