## Register provider

Start by registering the provider inside `start/app.js` file.

```js
const providers = [
  'adonis-auditable/providers/AuditableProvider'
]
```

## Making a model auditable

Add the following to your model's `boot` method:

```js
class MyModel extends Model {
  boot () {
    super.boot()
    this.addTrait('@provider:Auditable')
  }
}
```

This you can start using as follows:

```js
// create
await MyModel.audit().create(/** model data **/)

// update
await MyModel.audit().update(/** model data **/)

// delete
await MyModel.audit().delete()
```
