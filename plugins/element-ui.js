import Vue from 'vue'
import Element from 'element-ui'
import locale from "element-ui/lib/locale/lang/zh-TW";

locale.el.pagination.goto = "跳至";
Vue.use(Element, { locale })
