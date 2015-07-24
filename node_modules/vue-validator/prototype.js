// util
var _ = {
  warn: function (err, msg) {
    if (window.console) {
      console.warn('[vue-validator] ' + msg)
      if (err) {
        console.warn(err.stack)
      }
    }
  }
}

// mixin
var mixin = {
  created: function () {
    this._validations = {}
  },
  beforeDestroy: function () {
    // TODO: teardown _validations
    //
  }
}

function installer (Vue) {
  // orverride
  var addChild = Vue.prototype.$addChild
  Vue.prototype.$addChild = function (opts, Ctor) {
    var child = addChild.call(this, opts, Ctor)
    return child
  }

  var util = Vue.util

  
  Vue.elementDirective('validator', {
    bind: function () {
      console.log('call bind', this)
      var vm = this.vm
      var el = this.el

      this.validation = vm.$addChild({
        inherit: true,
        data: { validation: {} }
      })

      var node = el.children[0]
      this.unlink = this.validation.$compile(node)
      Vue.util.replace(el, node)
      
      console.log(JSON.stringify(vm.$data), JSON.stringify(this.validation.$data))
    },
    unbind: function () {
      console.log('call unbind', this)
      if (this.validation) {
        this.validation.$destroy()
        this.validation = null
      }
      if (this.unlink) {
        this.unlink()
        this.unlink = null
      }
    }
  })
}




Vue.use(installer)

var vm = new Vue({
  data: {
    msg: 'hello',
    foo: 1,
  }
})
vm.$mount('#app')

setTimeout(function () {
  vm.$destroy()
}, 2000)
