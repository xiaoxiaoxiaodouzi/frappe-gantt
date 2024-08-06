<template>
  <div>
    <el-pagination
      class="pt-3 text-right"
      layout="sizes, prev, pager, next, jumper, total"
      :page-count="totalPages"
      :current-page="currentPage"
      :page-sizes="[5,10, 20, 30, 40, 50]"
      :total="totalCount"
      :page-size="currentPageSize"
      @current-change="changePage"
      @size-change="changePageSize"
    />
  </div>
</template>
<script>
import { useOffsetPagination } from '@vueuse/core'
// import {get} from 'lodash'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          data: [],
          limit: 10,
          offset: 0,
          total: 0
        }
      }
    },
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    needMounted: {
      type: Boolean,
      default: true
    }
  },
  setup(props, {emit}) {
    const totalCount = computed(() => props.data.total || 0)

    const fetchData = ({ currentPage, currentPageSize }) => {
      emit('fetch-data', { limit: currentPageSize, offset: (unref(currentPage) - 1) * unref(currentPageSize) })
    }

    const {
      currentPage,
      currentPageSize,
      pageCount: totalPages
    } = useOffsetPagination({
      total: totalCount,
      page: props.page,
      pageSize: props.pageSize,
      onPageChange: fetchData,
      onPageSizeChange: fetchData,
    })

    const changePage = (page) => {
      currentPage.value = page
    }

    const changePageSize = (size) => {
      currentPageSize.value = size
    }

    onMounted(() => {
      if (props.needMounted) {
        fetchData({ currentPage: props.page, currentPageSize: props.pageSize })
      }
    })

    return {
      totalPages,
      currentPage,
      totalCount,
      currentPageSize,
      changePage,
      changePageSize
    }
  }
}
</script>
