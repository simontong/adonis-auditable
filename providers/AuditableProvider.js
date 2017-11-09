const {ServiceProvider} = require('@adonisjs/fold')

class AuditableProvider extends ServiceProvider {
  register () {
    const Auditable = require('../src/Traits/Auditable')
    this.app.bind('Adonis/Traits/Auditable', () => new Auditable)
    this.app.alias('Adonis/Traits/Auditable', 'Auditable')
  }

  boot () {
    const Context = this.app.use('Adonis/Src/HttpContext')
    const Auditable = this.app.use('Auditable')

    // add ctx to auditable
    Context.onReady(ctx => {
      Auditable.ctx = ctx
    })
  }
}

module.exports = AuditableProvider
