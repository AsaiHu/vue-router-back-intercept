class VueRouterRecord {
  constructor(page = 1, whiteList = []) {
    const VRRPage = sessionStorage.getItem("VRRPage");
    this.page = VRRPage ? +VRRPage : page;
    this.whiteList = whiteList;
    this.routeStack = [];
  }

  add() {
    this.page++;
  }
  //校验是否在白名单内，白名单路由无页签，不做回退判断，但限制页码依然往上+1
  isWhite(name) {
    return this.whiteList.some(item => {
      return item === name;
    })
  }

  pushRoute(to) {
    this.routeStack.unshift(to);
  }

  popRoute() {
    this.routeStack.shift();
  }

  getRouteStack() {
    return this.routeStack;
  }

  cleanRouteStack() {
    this.routeStack = [];
  }

}

export default {
  install: (Vue, { router, whiteList, name = "YQ" }) => {
    const bus = new Vue();
    let VRR = new VueRouterRecord(1, whiteList);

    router.beforeEach((to, from, next) => {
      if (VRR.isWhite(to.name)) {
        VRR.add();
        next();
        return;
      }
      const routerPage = to.query[name];
      sessionStorage.setItem("VRRPage", VRR.page);
      //有页签存在就进入回退判断逻辑
      if (routerPage) {
        const isBack = routerPage < VRR.page;
        if (isBack) {
          VRR.page = routerPage;//回退前重置限制页码
          VRR.popRoute();
          bus.$emit('back', to, from, next)
          next();
        } else {
          VRR.pushRoute(to);
          next();
        }
      } else {
        VRR.add();
        to.query[name] = VRR.page;//设置页签
        next(to);
      }
    })

    Vue.prototype.$back = {
      on: (event, callback) => {
        bus.$on(event, callback)
      },
      off: ()=>{
        bus.$off();
      },
      getRouteStack: VRR.getRouteStack,
      cleanRouteStack: VRR.cleanRouteStack,
    }
  }
}
