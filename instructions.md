## Register provider

Start by registering the provider inside `start/app.js` file.

```js
const providers = [
  'adonis-auditable/providers/AuditableProvider'
]
```

## Making a model auditable

Add the following to your models `boot` method:

```js
class MyClass extends Model {
  boot () {
    super.boot()
    this.addTrait('@provider:Auditable')
  }
}
```
