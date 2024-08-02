/* eslint-disable @typescript-eslint/no-explicit-any */

export enum DialogType {
  Dialog = 1,
  Drawer = 2,
}
export interface IBtns {
  label: string
  onClick: any
  type: string
}
export interface IDialogOptions {
  dialogType?: DialogType
  targetVM?: any
  asyncComponent?: any
  renderTag?: string
  asyncProps?: any
  asyncAttrs?: any
  buttons?: Array<IBtns>
  visible?: boolean
  title?: string
  width?: string
  height?: string
  top?: string | number
  class?: string
  modal?: boolean
  /**
   * default true
   */
  closeReject?: boolean
  showClose?: boolean
  canModalClose?: boolean
  fullscreen?: boolean
  fullScreenEnable?: boolean
  center?: boolean
  iframeLoading?: boolean
  content?: string
  iframeSrc?: string
  afterOpen?: any
  afterClose?: any
  beforeClose?: any
}

export interface CustomComponentInstance extends ComponentInternalInstance {
  resolve: (value: any) => void;
  reject:(err: any) => void;
  hide: () => void;
}


