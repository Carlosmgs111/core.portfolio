# Blogfolio Core

This is the core repository of Blogfolio (backend), where I put into practice not only what I've learned about Typescript, backend development and APIs, but also good practices when implementing clean architectures, and design principles, all in order to return the project as maintainable and extensible as possible.

The first approach to the maintainable implementation was using hexagonal architecture, and little by little I was structuring it until I reached what I consider an intermediate implementation, where projects of medium complexity can add and implement new design patterns and architecture.

Structure:

```shell
.
└─ src
    ├─ config
    ├─ infrastructure
    ├─ modules
    │   ├─ certifications
    │   │   ├─ models
    │   │   │   ├─ sequelize 
    │   │   │   └─ mongoose
    │   │   ├─ routes
    │   │   ├─ DTOs
    │   │   ├─ entity
    │   │   └─ use_cases
    │   ├─ ...
    │   ...
    ├─ services
    │   ├─ RepositoryService
    │   ├─ TaskMessageService
    │   ...
    ├─ shared
    ...
```