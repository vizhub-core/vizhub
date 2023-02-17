## Interactors

This package defines the "interactors" or "use cases" of VizHub.

Loosely corresponds to the "use cases" concept from [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

The interactors can operate on an instance of `gateways`, whether that is `MemoryGateways` (used for testing), or `DatabaseGateways` (used for the production app).

### Development

Unit tests: 

```
npm test
```

Type checking:

```
npm run tsc
```

Or, in watch mode:

```
npm run tsc-watch
```
