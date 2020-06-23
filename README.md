# vue-router-back-intercept
一个路由回退拦截的插件，因为vue-router没有提供对路由回退的监听，所以我就在路由拦截的基础上手撸了一个。

在main.js里import后

Vue.use(vueRouterBack,{router,whiteList,name});

参数里router是必须的

whiteList和name是可选的

whiteList允许特定路由不加入回退逻辑，里面存放路由的name,如['home']

name允许使用者自定义标识页签的名称

需要用户手动增加拦截

this.$back.on("back", (to, from) => {

​        if (from.name === "home") {}

}）

主动销毁所有拦截

this.$back.off()

获取路由栈的记录

this.$back.getRouteStack()

清除对路由栈的记录

this.$back.cleanRouteStack()