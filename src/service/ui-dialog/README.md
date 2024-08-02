# dialogService 弹窗服务
 
* 使用

```js
// 可将其挂载到vue原型下，方便全局调用
// main.js
 
 
import { 
  ViewModelStructure, 
  dialogService, 
} from '@idp-ux/core'

const { proxy } = getCurrentInstance()

// 1. asyncComponent
  const result = await dialogService({
    targetVM: proxy,
    modal: true,
    title: 'ViewModel Structure',
    width: '600px',
    asyncComponent: ViewModelStructure, 
    asyncProps: {
      viewModelId: '24g5as26006',
    }, 
    asyncAttrs:{

    }
  })


// 2. renderTag
  const result = await dialogService({
    targetVM: proxy,
    modal: true,
    title: 'Create Project',
    width: '600px',
    // asyncComponent: ViewModelStructure,
    renderTag: 'CreateProject',
    content: '',
    asyncProps: { },
    // renderTag: 'el-button',
  })

  // 3. render by content
 const result = await dialogService({
    targetVM: proxy,
    title: 'Tips',
    content: 'Tips message',
    buttons: [
      {
        label: 'Confirm',
        type: 'primary',
        onClick: ({ vm }) => {
          // 1.
          // vm.success()
          // 2.
          vm.resolve(true)
          vm.hide()
        },
      },
      {
        label: 'Cancel',
        type: 'primary',
        onClick: ({ vm }) => { 
          // 1.
          // vm.close() // Continue to execute further
          // 2.
          // vm.exit() // Terminate and do not proceed
          // 3.
          vm.reject('any message')
          vm.hide()
          // 4.
          // vm.resolve(false)
          // vm.hide()
          
        },
      },
    ],
  })

```



## 渲染优先级
 asyncComponent - > renderTag - >  content

## Props

| 参数 | 类型 | Required | 说明 |
| --- | --- | --- | --- |
| title | string\|fn\|vNode | true | 标题，可返回jsx进行自定义布局 |
| width | string | false | 宽度 |
| height | string | false | 高度，建议用vh做单位达到自适应效果 |
| top | string | 15vh | 距离顶部 |
| class | string | -  | 自定义类名 |
| zIndex | number | 1000  |  |
| targetVM | Vue Instance | vue 当前组件的实例  this/proxy  |  |
| showClose | boolean | true  | 展示关闭按钮 |
| center | boolean | false  | 居中布局 |
| content | string\|fn\|VNode | false | 内容,与下方的 iframeSrc 二选一，内容的padding自行控制，组件本身不提供默认边距 |
| asyncComponent | - | false | 异步import组件 优先级最高 |
| renderTag | - | false | 如果有全局安装组件,只需要传递 组件的 名字即可 |
| asyncAttrs | - | false | 给异步import组件传参 |
| asyncProps | - | false | 给异步import组件传参 |
| iframeSrc | string | false | iframe 地址 |
| fullscreen | boolean | false | 默认最大化打开，与下方的 Enable 二选一 |
| fullScreenEnable | boolean | false | 允许最大化 |
| buttons | array<br>fn<br>Vnode | false | `Array`：[ { label, type, onClick }, () => { return JSX },... ]<br><br> `label`：按钮名<br>`type`：类型 primary / success / warning / danger / info / text<br>`...attrs`: 与 [el-button](https://element.eleme.cn/#/zh-CN/component/button#attributes) 一致<br>`onClick`: function({ vm, ctx, component }) {}；<br><br>vm：弹窗实例，可使用 vm.close() 或者 vm.hide() 关闭弹窗， 执行close会触发beforeClose<br>ctx：按钮上下文<br> component： content 实例<br><br>`Fn`：<br>({ vm, component, getFooterBtns }) => {  返回Array / JSX }<br>如果想通过content组件本身来生成按钮，可以使用`getFooterBtns`参数，会携带组件实例，通过调用实例的自定义方法，该方法返回上述的Array或者Vnode即可<br>`return getFooterBtns(cont => cont['自定义方法']())`|
|beforeClose|fn|false|关闭前执行，此方法会阻止弹窗关闭，(vm, done) => {}|
|afterOpen|fn|false|打开后执行，(vm) => {}|
|afterClose|fn|false|关闭后执行，(vm) => {}|
 
## Method

| name  | 参数 | 说明 |
| success | data  | 返回   Promise.resolve({success:true,data}) |
| close | data  | 返回 Promise.resolve({success:false,data}) |
| exit  | null |  返回 Promise.reject |