# Blogfolio Core

This is the core repository of Blogfolio (backend), where I put into practice not only what I've learned about Typescript, backend development and APIs, but also good practices when implementing clean architectures, and design principles, all in order to return the project as maintainable and extensible as possible.

The first approach to the maintainable implementation was using hexagonal architecture, and little by little I was structuring it until I reached what I consider an intermediate implementation, where projects of medium complexity can add and implement new design patterns and architecture.

Structure:

```shell
.
└─ src
    ├─ config
    ├─ infrastructure
    │   └─ apis
    │       └─ express
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
    │   ├─ shared
    │   ...
    ├─ services
    │   ├─ RepositoryService
    │   ├─ TaskMessageService
    │   ...
    ├─ shared
    ...
```

## Sequelize Migrations:

- Generar un nuevo archivo de migracion con el comando `p:m:generate <nombre de la migracion>` la cual sera genera en esta ruta `/dist/services/DatabaseServices/SequelizeAdapter/infrastructure/migrations/`.
- Una vez ubicado el archivo se mueve a esta direccion `/src/services/DatabaseServices/SequelizeAdapter/infrastructure/migrations/` como se observa, cambia la raiz pasando de `dist` a `src`.
- Ubicado en esta carpeta se procede a migrar el archivo generado de `js` a `ts` y tipar de forma consecuente el contenido del mismo.
- Importar `tableName` y `tableSchema` loas cuales contienen, como sugieren sus nombres los nombre y esquemas de los diferentes modelos que ahi contiene.
- Configurar los metodos `up` y `down` segun como sugiere la documentacion de `sequelize`.
- Finalmente se debe compilar todo el proyecto, con esto se generara el respectivo archivo compilado en la carpeta `dist` y ejecutar `p:m:run`.