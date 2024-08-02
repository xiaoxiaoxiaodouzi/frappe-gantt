<template>
  <Teleport to="body">
    <el-dialog v-model="visible" append-to-body v-bind="$attrs">
      <span v-if="content">{{content}}</span>
      <component :is="asyncComponent" v-else/>
      <template #footer v-if="showFooter">
        <div class="dialog-footer">
          <el-button @click="cancel">Cancel</el-button>
          <el-button type="primary" @click="confirm">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </Teleport>
</template>

<script setup lang="tsx">
import { ElButton ,ElDialog} from 'element-plus';
import { isFunction, isPlainObject } from 'lodash';
import { PROVIDE_DIALOG_VM } from '~/constant/index';
import drag from './drag';

const props = defineProps({
  resolve: {
    type: Function,
    default: null,
  },
  reject: {
    type: Function,
    default: null,
  },
  asyncComponent: {
    type: Function,
    default: null,
  },
  content:{
    type:String,
    default:''
  },
  showFooter:{
    type:Boolean,
    default:false
  }
});

const dialogRef = ref<HTMLElement | null>(null);
const visible = ref<boolean>(false);
const title = ref<null | any>(null);
const width = ref<string>('30%');
const height = ref<string>('');
const top = ref<string>('10vh');
const className = ref<string>('');
const closeReject = ref<boolean>(true);
const modal = ref<boolean>(true);
const buttons = ref<any[]>([]);
const showClose = ref<boolean>(true);
const canModalClose = ref<boolean>(false);
const fullscreen = ref<boolean>(false);
const fullScreenEnable = ref<boolean>(false);
const center = ref<boolean>(false);
const renderContent = ref<string>('');
const iframeLoading = ref<boolean>(false);
const asyncProps = ref<Record<string, any>>({});
const asyncAttrs = ref<Record<string, any>>({});
const iframeSrc = ref<string>('');
const afterOpen = ref<null | any>(null);
const afterClose = ref<null | any>(null);
const beforeClose = ref<(() => void) | undefined>(undefined);

const _height = ref<string>('');
const instance = getCurrentInstance()
const proxy = instance?.proxy

const isVNode = (data: any) => !Array.isArray(data) && !isPlainObject(data) && typeof data === 'object';

const _buttons = computed(() => {
  if (isVNode(buttons.value)) {
    return buttons.value;
  }
  const _buttonsAry: any[] = [];
  buttons.value.forEach((item: any) => {
    if (typeof item === 'string') {
      console.warn('Please pass in the correct buttons parameter');
    } else if (isPlainObject(item) || isFunction(item) || isVNode(item)) {
      _buttonsAry.push(item);
    }
  });
  return _buttonsAry;
});

watch(fullscreen, (val) => {
  if (val) {
    height.value = '100%';
  } else {
    height.value = _height.value;
  }
});

onMounted(() => {
  _height.value = height.value;
  let asyncComponent = props.asyncComponent;
  if (iframeSrc.value && (props.content || asyncComponent)) {
    console.error('dialog:The parameters iframeSrc, (content or asyncComponent) both exist, please remove any of them');
  } else if (iframeSrc.value) {
    iframeLoading.value = true;
  }
});

const confirm = (data: any) => {
  props.resolve?.({ ...data, success: true });
  hide();
};

const success = (data: any) => {
  props.resolve?.({ success: true, data });
  hide();
};

const cancel = (data: any) => {
  props.resolve?.({ success: false, data, type: 'cancel' });
  hide();
};

const exit = (data: any) => {
  if (!closeReject.value) {
    cancel(data);
    return;
  }
  props.reject?.({ message: 'ux-reject', data });
  hide();
};

const _renderButton = (btn: any) => {
  if (isVNode(btn)) {
    return btn;
  }
  const buttonListeners = { click: () => handleBtnClick(btn) };
  const { label, type, ...props } = btn;
  return (
    <ElButton props={props} type={type} size="small" {...{ on: buttonListeners }}>
      {label}
    </ElButton>
  );
};

const handleBtnClick = (btn: any) => {
  if (typeof btn.onClick === 'function') {
    btn.onClick({
      vm: this,
      ctx: btn,
      component: generateComponent(renderContent.value),
    });
  }
};

const setBtns = (cb: any) => {
  // setTimeout(() => {
  //   cb && (buttons.value = cb(renderContent.value?.componentInstance));
  // });
};

const generateComponent = (vm: any) => {
  // if (typeof vm === 'string') {
  //   return proxy?.refs.content;
  // } else if (typeof vm === 'object') {
  //   // return renderContent.value?.componentInstance || renderContent.value;
  // }
};

const handleFullScreen = () => {
  fullscreen.value = !fullscreen.value;
  // proxy.refs?['idp-dy-dialog'].$el.querySelector('.el-dialog').style.transform = 'translate(0px, 0px)';
};

const show = () =>{
  visible.value = true;
}

const close = () => {
  if (isFunction(beforeClose.value)) {
    beforeClose.value(this, hide);
  } else {
    hide();
  }
  exit(null);
};

const hide = () => {
  visible.value = false;
  destroy();
};

const destroy = () => {
  document.body.removeChild(instance?.appContext.app._container);
  instance?.appContext.app.unmount(); 
};

const handleOpen = () => {
  isFunction(afterOpen.value) && afterOpen.value(this);
};

const handleCancel = () => {
  exit(null);
  isFunction(afterClose.value) && afterClose.value(this);
  destroy();
};

const handleBeforeClose = (done: any) => {
  exit(null);
  if (isFunction(beforeClose.value)) {
    beforeClose.value(this, done);
  } else {
    done();
  }
};
defineExpose({
  show,
  confirm,
  success,
  cancel,
  exit,
  close,
  hide,
  destroy,
})
// 提供 DIALOG_VM
provide(PROVIDE_DIALOG_VM, instance?.exposed);
</script>

<style lang="scss">
.idp-dy-dialog {
  .el-dialog {
    max-width: 90%;
    &--center .el-dialog__title {
      left: 50% !important;
      transform: translateX(-50%);
    }
  }
  .el-dialog__touch {
    padding: 10px 15px;
    height: 24px;
    box-sizing: content-box;
  }
  .el-dialog__header {
    border-bottom: 1px solid #ebeef5;
    .hiconfont {
      font-size: 12px;
    }
    padding: 0;
    .el-dialog__title {
      font-size: 16px;
      position: absolute;
      top: 11px;
      left: 10px;
    }
    .el-dialog__icon {
      position: absolute;
      right: 36px;
      top: 14px;
      line-height: 1;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
      & > img {
        width: 1em;
        height: 1em;
      }
    }
    .el-dialog__headerbtn {
      top: 15px;
      right: 13px;
      & > i {
        color: #333;
      }
    }
  }
  .el-dialog__body {
    padding: 10px;
    color: #333;
    overflow: auto;
    max-height: calc(100vh - 85px);
  }
  .el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #ebeef5;
  }

  .el-dialog {
    &.is-fullscreen {
      max-width: initial;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex-grow: 1;
        overflow: auto;
      }
    }
  }

  &.is-iframe {
    .idp-dy-dialog__content {
      padding: 0;
      line-height: 0;
    }
  }
  &__content {
    line-height: 1.4;
    box-sizing: border-box;
  }
  &__footer {
    & > * {
      display: inline-block;
    }
  }
}
</style>
