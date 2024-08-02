<script lang="jsx">
import { Button, Drawer } from 'element-plus'

import { isFunction, isPlainObject } from 'lodash'
import { PROVIDE_DIALOG_VM } from '@/constants'

import drag from './drawer-drag'

export default {
  name: 'DrawerService',
  directives: { drag },
  components: {
    ElDrawer: Drawer,
    ElButton: Button,
  },
  provide() {
    return {
      [PROVIDE_DIALOG_VM]: this,
    }
  },
  props: {
    resolve: {
      default: null,
    },
    reject: {
      default: null,
    },
  },
  data() {
    return {
      visible: false,
      title: null,
      width: '30%',
      height: '',
      top: '0',
      class: '',
      modal: true,
      closeReject: true,
      buttons: [],
      showClose: true,
      canModalClose: false,
      fullscreen: false,
      fullScreenEnable: false,
      center: false,
      iframeLoading: false,

      asyncProps: {},
      asyncAttrs: {},

      content: '',
      renderContent: null,
      iframeSrc: '',

      afterOpen: null,
      afterClose: null,
      beforeClose: null,

      isVNode: (data) => !Array.isArray(data) && !isPlainObject(data) && typeof data === 'object',
    }
  },

  computed: {
    _buttons() {
      const { isVNode } = this

      if (isVNode(this.buttons)) {
        return this.buttons
      }
      if (isFunction(this.buttons)) {
        return (
          this.buttons.bind(this, {
            vm: this,
            component: this.renderContent.componentInstance || this.renderContent,
            getFooterBtns: this.setBtns,
          })(this.$createElement) || []
        )
      }

      const buttons = []
      this.buttons.forEach((item) => {
        if (typeof item === 'string') {
          console.warn('Please pass in the correct buttons parameter')
        } else if (isPlainObject(item) || isFunction(item) || isVNode(item)) {
          buttons.push(item)
        }
      })
      return buttons
    },
  },

  watch: {
    fullscreen(val) {
      if (val) {
        this.height = '100%'
      } else {
        this.height = this._height
      }
    },
  },

  created() {
    this._height = this.height

    if (this.iframeSrc && (this.content || this.asyncComponent)) {
      console.error(
        'dialog:The parameters iframeSrc, (content or asyncComponent) both exist, please remove any of them'
      )
    } else if (this.iframeSrc) {
      this.iframeLoading = true
    }
  },

  methods: {
    success(data) {
      this.resolve?.({ success: true, data })
      this.hide()
    },
    cancel(data) {
      this.resolve?.({ success: false, data, type: 'cancel' })
      this.hide()
    },
    exit(data) {
      if (!this.closeReject) {
        this.cancel(data)
        return
      }
      this.reject?.({ message: 'ux-reject', data })
      this.hide()
    },
    _renderButton(btn) {
      const { isVNode } = this
      if (isVNode(btn)) {
        return btn
      }

      if (isFunction(btn)) {
        return btn.bind(this, {
          vm: this,
          ctx: this._buttons,
          component: this.renderContent.componentInstance || this.renderContent,
        })(this.$createElement)
      }

      const buttonListeners = { click: () => this.handleBtnClick(btn) }

      const { label, type, ...props } = btn
      return (
        <el-button props={props} type={type} size="small" {...{ on: buttonListeners }}>
          {label}
        </el-button>
      )
    },
    handleBtnClick(btn) {
      if (typeof btn.onClick === 'function') {
        btn.onClick({
          vm: this,
          ctx: btn,
          component: this.generateComponent(this.renderContent),
        })
      }
    },
    setBtns(cb) {
      setTimeout(() => {
        cb && (this.buttons = cb(this.renderContent.componentInstance))
      })
    },

    generateComponent(vm) {
      if (typeof vm === 'string') {
        return this.$refs.content
      } else if (typeof vm === 'object') {
        return this.renderContent.componentInstance || this.renderContent
      }
    },

    handleFullScreen() {
      this.fullscreen = !this.fullscreen
      this.$refs['idp-dy-dialog'].$el.querySelector('.el-dialog').style.transform = 'translate(0px, 0px)'
    },

    close() {
      if (isFunction(this.beforeClose)) {
        this.beforeClose(this, this.hide)
      } else {
        this.hide()
      }
      this.exit(null)
    },
    hide() {
      this.visible = false
    },

    destroy() {
      document.body.removeChild(this.$el)
      this.$destroy()
    },

    handleOpen() {
      isFunction(this.afterOpen) && this.afterOpen(this)
    },

    handleCancel() {
      this.exit(null)
      isFunction(this.afterClose) && this.afterClose(this)
      this.destroy()
    },

    handleBeforeClose(done) {
      this.exit(null)
      if (isFunction(this.beforeClose)) {
        this.beforeClose(this, done)
      } else {
        done()
      }
    },
  },

  render(h) {
    const contentType = typeof this.content
    const titleType = typeof this.title

    const { isVNode } = this

    let renderContent = null
    let renderTitle = null

    const renderContentGetter = {
      string: (content) => {
        if (/<.*?script.*?>.*?<\/.*?script.*?>/gi.test(content)) {
          console.error('content contains sensitive characters')
          return undefined
        } else {
          return content
        }
      },
      number: (content) => {
        return String(content)
      },
      object: (content) => {
        if (isVNode(content)) return content
        return undefined
      },
      function: (content) => {
        return content.bind(this, this)(h)
      },
      undefined: () => {
        console.error('content is not return undefined')
        return undefined
      },
    }

    if (this.asyncComponent) {
      renderContent = <async-component {...{ attrs: this.asyncAttrs }} {...{ props: this.asyncProps }} />
    } else if (this.renderTag) {
      renderContent = (
        <component {...{ is: this.renderTag }} {...{ attrs: this.asyncAttrs }} {...{ props: this.asyncProps }} />
      )
    } else {
      renderContent = renderContentGetter[contentType](this.content)
    }
    renderTitle = renderContentGetter[titleType](this.title)

    if (!renderContent && this.iframeSrc) {
      renderContent = (
        <iframe
          src={this.iframeSrc}
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="auto"
          on-load={() => {
            this.iframeLoading = false
          }}
        />
      )
    }

    this.renderContent = renderContent

    const dialogListeners = {
      closed: this.handleCancel,
      opened: this.handleOpen,
      'update:visible': (val) => (this.visible = val),
    }

    return (
      <el-drawer
        v-drag
        ref="idp-dy-drawer"
        class={[this.class]}
        visible={this.visible}
        size={this.width}
        modal={this.modal}
        top={this.top}
        withHeader={!!this.title}
        center={this.center}
        destroyOnClose={true}
        showClose={this.showClose}
        wrapperClosable={this.canModalClose}
        closeOnPressEscape={this.canModalClose}
        before-close={this.handleBeforeClose}
        append-to-body={true}
        {...{ on: dialogListeners }}
      >
        <template slot="title">
          {isVNode(renderTitle) ? <div>{renderTitle}</div> : <span domPropsInnerHTML={this.title} />}
        </template>
        {isVNode(renderContent) ? (
          <div v-loading={this.iframeLoading} style={{ height: this.height }}>
            {renderContent}
          </div>
        ) : (
          <div ref="content" domPropsInnerHTML={renderContent} style={{ height: this.height }} />
        )}

        {isVNode(this._buttons) && <div class="text-right">{this._buttons}</div>}

        {!isVNode(this._buttons) && this._buttons.length !== 0 && (
          <div class="text-right">
            {this._buttons.map((item) => {
              return this._renderButton(item)
            })}
          </div>
        )}
      </el-drawer>
    )
  },
}
</script>
