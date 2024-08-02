<template>
  <div>
    <el-table
      ref="tableRef"
      :data="data.data"
      v-loading="loading"
      v-bind="$attrs"
    >
      <el-table-column
        v-if="typeOption"
        :selectable="selectable"
        v-bind="{...typeOption}"
      >
        <template v-if="typeOption.slot" v-slot:default="slotProps">
          <slot v-bind="{...slotProps, item:typeOption}"></slot>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in baseOption"
        :key="`${item.prop}_${index}`"
        v-bind="{...item}"
        class-name="el-table__cell"
      >
        <!-- :align="item.align"
        :show-overflow-tooltip="item.showOverflowTooltip"
        :type="item.type"
        :fixed="item.fixed"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :sortable="item.sortable" -->
        <template v-for="slotName in Object.keys($slots)" v-slot:[slotName]="slotScope">
          <TableColum v-if="slotName === 'default'" v-bind="{...slotScope, item}" :key="slotName">
            <slot :name="slotName" v-bind="{...slotScope, item}"></slot>
          </TableColum>
          <slot v-else :name="slotName" v-bind="{...slotScope, item}"></slot>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-if="!hiddenPagination" :data="data" v-on="$attrs" />
  </div>
</template>
<script setup>
import { computed } from 'vue'
  const props = defineProps({
    option: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    hiddenPagination: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Function,
      default: () => {
        return true
      }
    }
  })
    const typeOption = computed(() => {
      return props.option.find(item => item.type)
    })
    const baseOption = computed(() => {
      return props.option.filter(item => !item.type)
    })
</script>
<style >

</style>
