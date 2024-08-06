/* eslint-disable @typescript-eslint/no-explicit-any */
// dialogService.ts
import { createApp, defineComponent, h ,render} from 'vue';
import Dialog from './src/dialog.vue';
// import Drawer from './src/drawer.vue';
import { IDialogOptions, DialogType } from './type';



async function dialogService(options: IDialogOptions) {
  const { asyncComponent, targetVM } = options;

  return new Promise((resolve, reject) => {
    // const vnode = h(Dialog, {
    //   resolve,
    //   reject,
    //   ...options
    // }, {
    //   default: () => h(asyncComponent)
    // });
    // let containerEl = document.createElement('div')
    // render(vnode, containerEl)
    // document.body.appendChild(containerEl)
    // const App = defineComponent({
    //   render() {
    //     return h(Dialog, {
    //       resolve,
    //       reject,
    //       ...options
    //     }, {
    //       default: () => h(asyncComponent)
    //     });
    //   }
    // });

    const app = createApp(Dialog, {
      resolve,
      reject,
      ...options});
    // if (targetVM) {
    //   app.provide('targetVM', targetVM);
    // }
    let dom = document.createElement('div');
    const vm = app.mount(dom);
    document.body.appendChild(dom);
    (unref(vm) as any).show()
  });
}



// async function drawerService(options: IDialogOptions) {
//   const { asyncComponent, targetVM } = options;

//   return new Promise((resolve, reject) => {
//     const App = defineComponent({
//       render() {
//         return h(Drawer, {
//           resolve,
//           reject,
//           ...options
//         }, {
//           default: () => h(asyncComponent)
//         });
//       }
//     });

//     const app = createApp(App);
//     if (targetVM) {
//       app.provide('targetVM', targetVM);
//     }

//     const vm = app.mount(document.createElement('div'));
//     document.body.appendChild(vm.$el);
//     (vm as any).visible = true;
//   });
// }

async function executeDialog(options: IDialogOptions) {
  // if (options.dialogType === DialogType.Drawer) {
  //   return drawerService(options)
  // }
  return dialogService(options)
}

export {
  dialogService,
  // drawerService,
  executeDialog
}
