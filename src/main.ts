import { createApp } from "vue";
import App from "./App.vue";
import LinkDirective from '~/directive/link.directive'
import router from '@/router/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";
import "uno.css";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss";

const app = createApp(App);
app.directive('link', LinkDirective);
app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// app.use(ElementPlus);
app.mount("#app");
