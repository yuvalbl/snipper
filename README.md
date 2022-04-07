
# Snipper
## A general purpose codegen runner

Meet Snipper, a general purpose code gen runner based on node.
Snipper aim to provide an easy way to develop codegen/codemod ecosystem, making sharing  generator templates easy, and using generators easier
For more about the problems snipper can solve for you, see [About](https://github.com/snipper/blob/ABOUT.md)

## Quick Overview <a name="available-scripts"></a>
Snipper allow you to generate and modified code by a single command, no installation required.

For example, running the following command will create a new react component

TBD
```

```


### Development
Run package locally:
1. go to package directory
1. `node .` (will automatically run index.js)
1. make sure to add additional required parameters

### Development rules
* Package entry point ("main") should be index.js (or ts if you're using typescript)
* Package options can be overridden with `.env.local`, for making development easier


### Development scripts
```
lerna create <name> // create a package
```
lint-staged
### Lerna
* [Repo](https://github.com/lerna/lerna) 
* [Official doc](https://lerna.js.org/)
