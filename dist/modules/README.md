# Modules

Implementing a _**modular monolith**_ requires the separation of different **bounded contexts**, **services** *(do not confuse them with the **services** used by the kernel!)* and even individual **entities** or **aggregates**, so they are placed in _**modules**_, which are kernel atomic functionalities, business logic that requires some or many resources to function, as a complete project, from managing access to its own database to connecting with other modules by using APIs, this in the future, can be decoupled, established and deployed as a **microservices**.

In the case of this project, at the moment, each module represents an kernel individual entity, except by module *share*