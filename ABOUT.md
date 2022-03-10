# Snipper
### A general purpose codegen runner

## TL;DR
Code generators and modifiers are great, but existing tools still have significant limitations.
Snipper doesn't aim to create a new code generator / modification tool, but rather leverage exist tools into codegen/codemod ecosystem, making sharing generator templates easy, and using generators easier

## Overview
The process of writing code can be seen as accumulating changes to files over time. Over the years we found ways to reduce code-writing - mainly by managing packages and using code generators (yeoman, angular schematics, nx generators create-react-app etc.)

While full-project code generators (like angular-cli or create-react-app) are common, local refactoring tools (angular schematics, nx generators) are usually project specific.
In addition, common tasks like integration with a new package or writing a common service still require manual work. This is mostly done by copy & paste (from the package “getting-started” manual or other resources) and making adjustments for a specific use-case.
Automating these tasks can be beneficial for many developers - by saving work, avoiding mistakes and encouraging best-practices adoption.

## Scenarios and Problems
### Scenario 1 - integrating a package
Assume you create a newly fresh react project, using [create-react-app](https://create-react-app.dev/):
Next, you would like to add [react-router](https://reactrouter.com/), and some basic routes. The recommended way would be to [copy and past some code snippets](https://reactrouter.com/docs/en/v6/getting-started/installation#create-react-app), according to the react-router installation guide. This issue repeats multiple times in a project lifetime, for any package require integration

We could create a script anybody can use, for automating this task. Usage may be something like:
```
npx snip connect-react-router
```

### Scenario 2 - create scaffolding
Next, you would like to add some components.
That means creating a component file, and possibly testing, styles and story files as well, depend on your project conventions. There are some nice tools for that, like [generate-react-cli](https://github.com/arminbro/generate-react-cli), [Nx generators](https://nx.dev/generators/using-schematics) (if you use Nx) or [Plop](https://github.com/plopjs/plop), but some problems still remain:

* **Templating sharing is inefficient** - Have a react project which uses styled-components, emotion or MUI? - even if you use these popular libraries you’ll have to write your own templates for them.

* **Choosing a codgen engine is difficult** - each package has its own strengths and weaknesses. Some packages are better used as generators, some as code modifiers. You can use more than one codgen / codemod package, but that requires extra maintenance and learning time.

* **Require learning new API** - Following the previous point, learning new API requires time. Creating a code generator might require considerable learning time, but using it should be easy as writing a cli command (this is also related to the first point - template sharing)

* **Can require significant local changes** - [Nx generators](https://nx.dev/generators/using-schematics) can be used for react projects (and beyond), but only if you use the nx framework. [Plop](https://github.com/plopjs/plop) requires local installation, and maintaining a plop file. [generate-react-cli](https://github.com/arminbro/generate-react-cli) can be used by npx, but any template modification requires writing code locally.


##  Purpose
Automate repeated code writing, by sharing generators for common code (see examples above) and code which follow recommended (AKA "best") practices.
This can be achieved by make creating generators easy, And using generators is easier.

Snipper (derived from the term “Snippets”) is a general-purpose tool for modifying files and their content. 
It aim to leverage existing codegen/codemod engines, providing a unified api and easy way to share templates and configurations.

### These principles can be used in order to create effective generators ecosystem:

1. Easy of use
* No install requirements (can be run using npx or yarn)
* API prefer clarity over extra functionality (if generators is complex - maybe it should be divided into multiple generators)
* Single purpose - generator should do one thing and do it well. This will also help keeping the API to be minimal and self explanatory as possible

2. Generic
* Can used for both generate or modification
* Can be used in any (node based) project
* Input can be provided in multiple ways like a json file, command line arguments etc.

3. Extensible and Compatible
* Encourage sharing (once a script exist, it should be easy to share it with the world) 
* Encourage compatibility - allow different generators work together
* Allowing a “pipeline” (2 or more tasks which can invoked in a specific order, if previous tasks completed successfully) 


#### Following these principles, suggested strategy is as following
* Each generator is task specific node package. Packages can be maintained as a monorepo under an organization scope
* Each generator package can use different codegen engine under the hood, as long as it compatible with the Snipper rules
* Snipper should provide and enforce rules to assure compatibility with other generators and testing requirements.
* generators (called "pipeline") can be created to call several generators, instead of running each one individually. pipeline may also be used to pass information to multiple generators (e.g. component name)


#### To encourage developers to create generators:
* Snipper should contain generators for creating generators
* Snipper team should allow accepting PR from contributors, as long as they follow code, security and testing standards.
* In the long term, creating a system which help create  and test generators may be helpful as well.


