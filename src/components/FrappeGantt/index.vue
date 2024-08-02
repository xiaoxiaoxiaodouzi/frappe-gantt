<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="frappe-container">
    <el-row>
      <el-col :span="12" :offset="0">
        <slot name="table-header-slot">
          <span> </span>
        </slot>
      </el-col>
      <el-col :span="12" class="float-right text-right">
        <div>
          <i :class="screenFullIcon" @click="fullScreen" />
        </div>
      </el-col>
    </el-row>
    <!-- <el-radio-group v-model="viewMode" size="mini" style="margin-bottom: 12px">
      <el-radio-button v-for="item in viewModes" :key="item" :label="item" />
    </el-radio-group> -->
    <!-- <div class="d-flex justify-content-center">
      <span class="d-flex">
        <div style="width:50px;height:20px;background-color:#C0C4CC;border-radius:43px" class="mr-1" /> Vendor - Accept
      </span>
      <span class="d-flex ml-3">
        <div style="width:50px;height:20px;background-color:#79BC23;border-radius:43px" class="mr-1" /> Vendor - Pending accept
      </span>
      <span class="d-flex ml-3">
        <div style="width:50px;height:20px;background-color:#EF7D31;border-radius:43px" class="mr-1" /> Vendor - Declined
      </span>
    </div> -->

    <div class="box" ref="box" v-loading="tableLoading">
      <!-- <template v-if="tableData.length !== 0"> -->
      <div class="float-left frappe-left">
        <el-table
          ref="frappeTableRef"
          class="frappe-table"
          max-height="575px"
          :default-expand-all="defaultExpandAll"
          :data="tableData"
          row-key="workorderId"
          tooltip-effect="light"
          :row-class-name="rowClassName"
          :row-style="{height:'39px'}"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @expand-change="expandChange"
          style="margin-top:9px;    "
        >
          <!-- box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1); -->
          <el-table-column
            show-overflow-tooltip
            min-width="200px"
          >
            <template #header>
              <div class="d-flex justify-content-between px-1 mb-1">
                <span>
                  <span class="text-dark">
                    WO:
                  </span>
                  <span>
                    {{gantt.tasks.length - 3>0? gantt.tasks.length - 3 : 0}}
                  </span>
                </span>
                <span>
                  <i class="inner-icon el-icon-refresh cursor ml-2" aria-hidden="true" @click="getWOList" />
                </span>

              </div>
              <el-input
                cleable
                suffix-icon="el-icon-search"
                v-model="search"
                size="mini"
                clearable
                @clear="filterData"
                @keyup.native.enter="filterData"
                placeholder="search workorder"
              />

            </template>

            <template #default="{row}">
              <span class="flex flex-1 justify-between">
                <span>
                  <i v-if="!row.isParent && row.invalid" class="hiconfont hicon-warning-fill text-warning font-size-6" aria-hidden="true" title="Start Date or End Date is invalid!" />
                  {{row.id}}
                  <i class="hiconfont text-warning bg-warning-lighter ml-init font-normal" v-bind="{...iconObj(row)}" style="font-size:14px" />
                  <el-tooltip :content="`${row.subStatusValue}(${row.subStatus})`" effect="dark">
                    <!-- <ProjectStatus class="ml-1" v-if="!row.isParent" :row="row" field="workorderStatus" padding="0px 15px" /> -->
                  </el-tooltip>
                  <!-- <span v-if="!row.isParent">({{row.subStatusValue}})</span> -->
                </span>
                <span>
                  <span v-if="row.startDate && row.endDate">
                    {{formatDate(row.startDate,'MM/DD/YYYY')}} - {{formatDate(row.endDate,'MM/DD/YYYY')}}
                    <strong>
                      ({{row.duration}} Days)
                    </strong>
                  </span>
                  <span v-else>--</span>
                  <!-- <AddWoDate :key="AddWoDateKey" :is-fullscreen="isFullscreen" v-if="row.status === 'success'" :workorder="row" @saveTimeline="saveTimeline" :save-time-loading="saveTimeLoading" /> -->
                </span>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column
              label="Timeline"
              prop="startDate"
              min-width="200px"
            >
              <template slot-scope="{row}">
                <span v-if="row.startDate && row.endDate">
                  {{formatDate(row.startDate,'MM/DD/YYYY')}} - {{formatDate(row.endDate,'MM/DD/YYYY')}}
                  ({{row.duration}} Days)
                  <AddWoDate v-if="row.status === 'success'" :workorder="row" @saveTimeline="saveTimeline" :save-time-loading="saveTimeLoading" />
                </span>
                <span v-else>--</span>
              </template></el-table-column> -->
          <!-- <el-table-column
              label="Duration(Days)"
              prop="duration"
              width="130px"
            >
              <template slot-scope="{row}">
                {{row.duration}}
                <AddWoDate v-if="row.status === 'success'" :workorder="row" @saveTimeline="saveTimeline" :save-time-loading="saveTimeLoading" />
              </template>
            </el-table-column> -->

        </el-table>
      </div>
      <div class="frappe-resize" title="resize">
      </div>
      <div class="frappe-mid gantt-target d-flex flex-column" />
      <!-- </template>
      <el-empty v-else></el-empty> -->
    </div>
    <el-dialog
      v-if="taskConfictDialogVisible"
      :visible="taskConfictDialogVisible"
      width="50%"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="false"
    >
      <template #title>
        <div>
          <i class="hiconfont hicon-warning-brand-fill text-pink " />
          {{confictTitle}}
        </div>
      </template>
      <ConfictDateForm :decline-loading="declineLoading" :task="currentTask" @closeDialog="taskConfictDialogVisible = false" @declineWo="declineWo" @saveTimeline="saveTimeline" :save-time-loading="saveTimeLoading" />
    </el-dialog>

    <el-dialog
      v-if="taskDependencyVisible"
      :visible="taskDependencyVisible"
      width="30%"
      title=""
      class="dependency-dialog"
      :close-on-click-modal="false"
      :append-to-body="false"
    >
      <div class="text-break-word">
        <i class="hiconfont hicon-warning-brand-fill text-pink " />
        {{dependencyTitle}}
      </div>
      <template #footer>
        <el-button type="primary" :loading="tableLoading" @click="setDependency">Confirm</el-button>
        <el-button type="primary" plain @click="taskDependencyVisible=false">Cancel</el-button>
      </template>
    </el-dialog>

    <el-dialog
      :visible="cancelTaskDependencyVisible"
      v-if="cancelTaskDependencyVisible"
      width="30%"
      title=""
      class="dependency-dialog"
      :close-on-click-modal="false"
      :append-to-body="false"
    >
      <div class="text-break-word">
        <i class="hiconfont hicon-warning-brand-fill text-pink " />
        {{cancelDependencyTitle}}
      </div>
      <template #footer>
        <el-button type="primary" :loading="tableLoading" @click="cancelDependency">Confirm</el-button>
        <el-button type="primary" plain @click="cancelTaskDependencyVisible=false">Cancel</el-button>
      </template>
    </el-dialog>

  </div>
</template>
<script setup>
import { findIndex, cloneDeep, includes, forEach, map, find} from 'lodash';
// import ConfictDateForm from '@/components/FrappeGantt/ConfictDateForm'
// import {taskMap} from '@/constant/statusMap'
import { Gantt } from './frappeGantt.js';
// import AddWoDate from '@/components/FrappeGantt/AddWoDate'
// import WorkorderBffService from '@/service/WorkorderBffService'
// import useFormat from '@/composition/useFormat.js';
import dayjs from 'dayjs';
import screenfull from 'screenfull'
import { useEventListener } from '@vueuse/core'
import ganttData from './dependences.js'
// import ProjectBFFService from '@/service/ProjectBFFService.js';
// import ProjectStatus from '@/views/AllProject/components/ProjectStatus.vue';
  // props: {
  //   queryParameters: {
  //     type: Object,
  //     default: () => {}
  //   },
  //   componentData: {
  //     type: Array,
  //     default: () => []
  //   },
  //   templeAction: {
  //     type: Boolean,
  //     default: false
  //   },
  //   previewMode: {
  //     type: Boolean,
  //     default: false
  //   },
  //   canEdit: {
  //     type: Function,
  //     default: (item) => {
  //       return !item.isParent
  //     }
  //   }
  // },
    const defaultExpandAll = ref(true)
    const cancelTaskDependencyVisible = ref(false)
    const taskDependencyVisible = ref(false)
    const dependencyTaskIds = ref([])
    const cancelDependencyTaskIds = ref([])
    const tasks = ref([])
    const gantt = ref(null)
    const frappeTableRef = ref(null)
    const viewMode = ref('Day')
    const viewModes = ref([])
    const tableData = ref([])
    const isFullscreen = ref(false)
    const tableLoading = ref(false)
    const saveTimeLoading = ref(false)
    const taskConfictDialogVisible = ref(false)
    const declineLoading = ref(false)
    const search = ref('')
    const currentTask = ref({})
    const screenFullIcon = ref('hiconfont hicon-zoom-in')
    const AddWoDateKey = ref(crypto.randomUUID());
    const penddingSubmitlist = ref([])
    const {proxy} = getCurrentInstance()

    const getWOList = async () => {
      tableLoading.value = true
      let res = {}
      // if (props.componentData.length > 0) {
      //   res = {
      //     data: props.componentData
      //   }
      // } else {
      //   res = await ProjectBFFService.getProjectWorkorderDependency(
      //     proxy.$route.params.mId,
      //     {...props.queryParameters})
      // }
      tasks.value = ganttData.data
      ganttData.data.forEach(item => {
        item.expanded = item.children && item.children.length > 0 ? defaultExpandAll.value : false
      })
      document.querySelector('.frappe-left').style.width = '44%'
      translateData(ganttData.data)
      validatAllWO()
      tableLoading.value = false
    }

    const iconObj = (row) => {
      switch (row.requestType) {
        case 6:
          return {
            class: 'hicon-Rekey',
            title: 'Rekey'
          }
        // case 9:
        //   return 'hicon-maintenance'
        case 11:
          return {
            class: 'hicon-a-ScopeWork1',
            title: 'Scope Walk'
          }
        case 13:
          return {
            class: 'hicon-decisions',
            title: 'Quality Walk'
          }
      }
    }

    const translateData = (data, refreshGantt = false) => {
      tableData.value = cloneDeep(data).map(item => {
        return formatData(item)
      })
      let ary = [];
      // debugger;
      if (defaultExpandAll.value) {
        tableData.value.forEach((t) => {
          ary.push(t);
          if (t.children) {
            ary.push(...t.children);
          }
        });
      } else {
        ary = cloneDeep(tableData.value)
      }
      !refreshGantt && refreshTask(ary);
      updateResize()
    }

    const updateResize = () => {
      nextTick(() => {
        const resize = document.getElementsByClassName('frappe-resize')
        resize[0].style.height = document.querySelector('.ep-table').clientHeight + 'px'
      })
    }
    const formatData = (item) => {
      if (item.children && item.children.length) {
        item.children = item.children.map(it => {
          return formatData(it)
        })
      }
      let invalid = false
      if (item.isParent && item.expanded) {
        invalid = true
      } else {
        invalid = isInvalidDate(item.startDate, item.endDate)
      }
      let canEdit = true
      // if (!props.previewMode) {
      //   if (typeof props.canEdit === 'function') {
      //     canEdit = props.canEdit(item)
      //   }
      // }
      return {
        ...item,
        start: item.startDate,
        end: item.endDate,
        id: item.workorderId,
        ecd: item.estimateCompletionDate,
        workorderId: item.workorderId,
        name: item.isParent ? item.workorderId : item.serviceCombos,
        workorderStatusId: item.status,
        invalid,
        status: canEdit ? 'success' : (item.isParent ? 'parent' : 'info'),
        custom_class: canEdit ? '' : 'disabled-drag',
        workorderStatusName: item.statusName,
        dependencies: map(item.dependOnWorkorders, (item) => item.workorderId),
        actualCompletionDate: item.actualCompletionDate
      }
    }

    const validatAllWO = () => {
      const obj = {
        valid: true,
        isNeedWarning: false
      }
      forEach(tasks.value, (item) => {
        if (item.children && item.children.length) {
          forEach(item.children, (child) => {
            if (!isInvalidDate(child.startDate, child.endDate)) {
              obj.valid = false
            }
            if (child.isNeedWarning) {
              obj.isNeedWarning = true
            }
          })
        }
      })
      // emit('validatAllWO', obj)
    }

    const rowClassName = ({row}) => {
      if (row.isParent) {
        return 'parent-row'
      }
    }

    const isInvalidDate = (startDate, endDate) => {
      if (startDate && endDate) {
        const start = formatDate(startDate, 'YYYY-MM-DD HH:mm:ss')
        const end = formatDate(endDate, 'YYYY-MM-DD HH:mm:ss')
        return dayjs(start).isAfter(end)
      }
      return true
    }
    const initGantt = (tasks) => {
      if (tasks.length > 0) {
        gantt.value = new Gantt('.gantt-target', tasks, {
          on_click: (task) => {
            console.log('click', task);
          },
          on_date_change: (task, start, end) => {
            saveTimeline(task.id, {startDate: start, endDate: end}, {refreshGantt: true})
          },
          on_progress_change: (task, progress) => {
            // console.log(task, progress);
          },
          on_view_change: (mode) => {
            // console.log(mode);
          },
          on_arrow_line_click: (fromId, toId) => {
            cancelTaskDependencyVisible.value = true
            cancelDependencyTaskIds.value = [fromId, toId]
          },
          on_svg_click: (task) => {
            openConfict(task)
          },
          on_dependency_confirm_click: (taskIds) => {
            taskDependencyVisible.value = true
            dependencyTaskIds.value = taskIds
          },
          on_dependency_click: (task) => {
            getWoDependency(task.id)
          },
          column_width: 24,
          // previewMode: props.previewMode,
          view_mode: viewMode.value,
          language: 'en',
          popup_trigger: 'mouseover'
        });
        viewModes.value = gantt.value.options.view_modes;
        nextTick(() => {
          setListeners()
        })
      }
    }

    const cancelDependency = () => {
      const [fromId, toId] = cancelDependencyTaskIds.value
      if (fromId && toId) {
        const ary = [
          {
            sourceWorkorderId: fromId,
            referenceWorkorderId: toId,
            relationType: 88
          }
        ]
        tableLoading.value = true
        ProjectBFFService.removeDependcy(proxy.$route.params.mId, ary).then(() => {
          getWOList()
        }).finally(() => {
          cancelTaskDependencyVisible.value = false
        })
      }
    }

    const setDependency = () => {
      const [from, to] = dependencyTaskIds.value
      tableLoading.value = true
      WorkorderBffService.setWorkorderRelation(to, from).then(res => {
        getWOList()
      }).finally(() => {
        taskDependencyVisible.value = false
      })
    }

    const getWoDependency = (woId) => {
      WorkorderBffService.getWorkorderDependence(woId, proxy.$route.params.mId).then(res => {
        gantt.value.hiddenDependency([...(res.data || [])], woId)
      })
    }

    const openConfict = async (task) => {
      currentTask.value = task
      taskConfictDialogVisible.value = true
    }

    const setListeners = () => {
      // set gantt scroll listeners
      const dom = document.querySelector('.gantt-container')
      useEventListener(dom, 'scroll', (e) => {
        const scrollTop = dom.scrollTop;
        const scrollLeft = dom.scrollLeft
        const tableDom = document.querySelector('.frappe-container .ep-table__body-wrapper')
        // const tableDom = document.querySelector('.frappe-container .el-scrollbar__wrap')
        tableDom.scrollTo({
          top: scrollTop
        // , behavior: 'smooth'
        })

        const dateDom = document.querySelector('.gantt-date-container')
        dateDom.scrollTo({
          left: scrollLeft
        // , behavior: 'smooth'
        })
      })

      // set table scroll listeners
      const tableDom = document.querySelector('.frappe-container .ep-table__body-wrapper')
      useEventListener(tableDom, 'scroll', () => {
        const scrollTop = tableDom.scrollTop;
        const dom = document.querySelector('.gantt-container')
        dom.scrollTo({
          top: scrollTop
        })
      })
    }

    const refreshTask = (tasks) => {
      if (gantt.value) {
        gantt.value.refresh(tasks);
      } else {
        initGantt(tasks);
      }
    }

    const formatDate = (val,format='MM/DD/YYYY') =>{
      return dayjs(val).format(format)
    }

    const expandChange = (row, expanded) => {
      const ary = gantt.value.tasks;
      const index = findIndex(ary, (item) => item.workorderId === row.workorderId);
      ary[index].expanded = expanded;
      ary[index].invalid = expanded
      const childrens = row.children;
      if (expanded) {
        ary.splice(index + 1, 0, ...childrens);
      } else {
        ary.splice(index + 1, childrens.length);
      }
      gantt.value.refresh(ary);
      nextTick(() => {
        updateResize()
      })
    }

    const filterData = () => {
      let ary = [];
      let tempItem = {};
      if (search.value) {
        forEach(tasks.value, (item) => {
          if (includes(item.workorderId, search.value)) {
            ary.push(item);
          } else {
            if (item.children && item.children.length) {
              tempItem = cloneDeep(item);
              const tempChildren = [];
              forEach(item.children, (it) => {
                if (includes(it.workorderId, search.value)) {
                  tempChildren.push(it);
                }
              });
              tempItem.children = tempChildren;
              tempChildren.length && ary.push(tempItem);
            }
          }
        });
      } else {
        ary = cloneDeep(tasks.value)
      }
      translateData(ary)
    }

    const saveTimeline = (workorderId, data, option = {refreshTable: false, refreshGantt: false}) => {
      // const startDate = new Date(dayjs(data.startDate).startOf('day'))
      // const endDate = new Date(dayjs(data.endDate).endOf('day'))
      const params = {
        ...data,
        startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
        vendorScheduledVisitStartDate: dayjs(data.vendorScheduledVisitStartDate).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
      }
      if (data.estimateCompletionDate) {
        params.estimateCompletionDate = dayjs(data.estimateCompletionDate).format('YYYY-MM-DD')
      }
      // if (!props.templeAction) {
      //   saveTimeLoading.value = true
      //   WorkorderBffService.updateDependencyDate(workorderId, params).then((res) => {
      //     const set = new Set([...penddingSubmitlist.value, ...res])
      //     penddingSubmitlist.value = [...set]
      //     if (option.refreshTable) {
      //       getWOList()
      //       return
      //     }
      //     updateTableData(res, option.refreshGantt)
      //   }).finally(() => {
      //     saveTimeLoading.value = false
      //     taskConfictDialogVisible.value = false
      //   })
      // }
    }

    const updateTableData = (data, refreshGantt) => {
      const ary = map(tableData.value, (item, index) => {
        let start = ''
        let end = ''
        forEach(item.children, (chi) => {
          const obj = find(data, (item2) => item2.workorderId === chi.workorderId)
          if (obj) {
            chi.startDate = obj.startDate
            chi.endDate = obj.endDate
            chi.duration = dayjs(chi.endDate).diff(dayjs(chi.startDate), 'days') + 1
          }
          if (chi.startDate) {
            if (start) {
              start = dayjs(start).isBefore(dayjs(chi.startDate)) ? start : chi.startDate
            } else {
              start = chi.startDate
            }
          }
          if (chi.endDate) {
            if (end) {
              end = dayjs(end).isAfter(dayjs(chi.endDate)) ? end : chi.endDate
            } else {
              end = chi.endDate
            }
          }
        })
        item.startDate = start
        item.endDate = end
        item.duration = dayjs(item.endDate).diff(dayjs(item.startDate), 'days') + 1
        return item
      })
      translateData(ary, refreshGantt)
      nextTick(() => {
        validatAllWO()
      })
    }

    const getTaskData = () => {
      return unref(tasks)
    }

    const dragControllerDiv = () => {
      const resize = document.getElementsByClassName('frappe-resize');
      const left = document.getElementsByClassName('frappe-left');
      console.log('🚀 ~ dragControllerDiv ~ left:', left)

      const mid = document.getElementsByClassName('frappe-mid');
      const box = document.getElementsByClassName('box');
      for (let i = 0; i < resize.length; i++) {
        // click
        resize[i].onmousedown = function (e) {
          // color change
          resize[i].style.background = '#818181';
          const startX = e.clientX;
          resize[i].left = resize[i].offsetLeft;
          // drage
          document.onmousemove = function (e) {
            const endX = e.clientX;
            let moveLen = resize[i].left + (endX - startX); // （endx-startx）=move length。resize[i].left+move length=left width
            const maxT = box[i].clientWidth - resize[i].offsetWidth; // container width - left width = right width

            if (moveLen < 530) moveLen = 530; // let min width
            if (moveLen > maxT - 530) moveLen = maxT - 530; // right min width150px

            resize[i].style.left = moveLen; // set left width

            for (let j = 0; j < left.length; j++) {
              left[j].style.width = moveLen + 'px';
              mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
            }
          };
          document.onmouseup = function (evt) {
            resize[i].style.background = '#d6d6d6';
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture();
          };
          resize[i].setCapture && resize[i].setCapture();
          return false;
        };
      }
    }

    const confictTitle = computed(() => {
      // const visitDate = dayjs(unref(currentTask).vendorScheduledVisitStartDate).format('MMM DD')
      // const estimateDate = dayjs(unref(currentTask).estimateCompletionDate).format('MMM DD')
      return `Vendor submitted timeline is conflicted with our expected timeline.`
    })

    const dependencyTitle = computed(() => {
      const [from, to] = unref(dependencyTaskIds)
      return `Set dependency between workorder (${from}) and workorder (${to})`
    })

    const cancelDependencyTitle = computed(() => {
      const [from, to] = unref(cancelDependencyTaskIds)
      return `Are you sure to cancel the dependency between workorder (${from}) and workorder (${to})?`
    })

    const fullScreen = () => {
      if (!screenfull.isEnabled) {
        proxy.$message.warning('Your brower does not support fullscreen mode.')
        return
      }
      screenfull.toggle(document.querySelector('.frappe-container'))
    }
    const fullInit = () => {
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          AddWoDateKey.value = ref(crypto.randomUUID());
          if (screenfull.isFullscreen) {
            document.querySelector('.frappe-table ').style.maxHeight = 'calc(100vh - 100px)'
            document.querySelector('.frappe-table .ep-table__body-wrapper').style.maxHeight = 'calc(100vh - 175px)'
            document.querySelector('.gantt-container').style.maxHeight = 'calc(100vh - 164px)'
            document.querySelector('.frappe-left').style.width = '30%'
            screenFullIcon.value = 'hiconfont hicon-zoom-out'
          } else {
            document.querySelector('.frappe-table ').style.maxHeight = '575px'
            document.querySelector('.frappe-table .ep-table__body-wrapper').style.maxHeight = '500px'
            document.querySelector('.gantt-container').style.maxHeight = '511px'
            document.querySelector('.frappe-left').style.width = '44%'
            screenFullIcon.value = 'hiconfont hicon-zoom-in'
          }
          isFullscreen.value = screenfull.isFullscreen
          updateResize()
        })
      }
    }

    const declineWo = (wo) => {
      declineLoading.value = true
      WorkorderBffService.declineWorkorder(wo.workorderId, {vendorId: wo.vendorId}).then(() => {
        getWOList()
      }).finally(() => {
        declineLoading.value = false
        taskConfictDialogVisible.value = false
      })
    }

    const getPenddingSubmitlist = () => {
      return penddingSubmitlist.value
    }
    watch(() => viewMode.value, (nv) => {
      gantt.change_view_mode(nv)
    })

    // watch(() => props.previewMode, (nv) => {
    //   gantt.change_preview_mode(nv)
    // })

    // watch(() => props.queryParameters, (nv) => {
    //   getWOList()
    // }, {deep: true})

    // watch(() => props.componentData, getWOList, {deep: true})

    onMounted(() => {
      fullInit()
      dragControllerDiv()
      getWOList()
    })
    onUnmounted(() => {
      gantt.value.destroy()
    })

</script>

<style lang="scss" src="@/components/FrappeGantt/frappeGantt.scss">
</style>
