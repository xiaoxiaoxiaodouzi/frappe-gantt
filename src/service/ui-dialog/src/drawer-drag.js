export default {
  bind(el) {
    const drawerEle = el.querySelector('.el-drawer')

    const dragItem = document.createElement('div')
    dragItem.style.cssText = 'height: 100%;width: 5px;cursor:col-resize;position: absolute;left: 0;'
    drawerEle.append(dragItem)

    dragItem.onmousedown = () => {
      document.body.style.userSelect = 'none'
      document.onmousemove = function (moveEvent) {
        let realWidth = document.body.clientWidth - moveEvent.pageX
        const minWidth = document.body.clientWidth * 0.2
        const maxWidth = document.body.clientWidth * 0.9
        realWidth = realWidth > maxWidth ? maxWidth : realWidth < minWidth ? minWidth : realWidth
        drawerEle.style.width = `${realWidth}px`
      }
      document.onmouseup = function () {
        document.body.style.userSelect = 'initial'
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
}
