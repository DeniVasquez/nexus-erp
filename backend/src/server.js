import express from "express";
import morgan from "morgan";
import cors from "cors";

import { port } from "#shared/lib/env.js";
import { mongoConnect } from "#shared/lib/db.js";

// rutas con metadata (para auto-discovery de permisos)
import authRoutes from "#modules/auth/infrastructure/http/auth.routes.js";
import userRoutes, { userRoutes as userRoutesMetadata } from "#modules/users/infrastructure/http/user.routes.js";
import rolesRoutes, { roleRoutes as roleRoutesMetadata } from "#modules/roles/infrastructure/http/role.routes.js";
import logsRoutes, { logRoutes as logRoutesMetadata } from "#modules/logs/infrastructure/http/log.routes.js";
import companiesRoutes, { companyRoutes as companyRoutesMetadata } from "#modules/companies/infrastructure/http/company.routes.js";

// bootstrap: sincronizar el catálogo de permisos y los roles del sistema
import { MongoPermissionRepository } from "#modules/permissions/infrastructure/persistence/MongoPermissionRepository.js";
import { SyncDiscoveredPermissionsUseCase } from "#modules/permissions/application/use-cases/syncDiscoveredPermissions.js";
import { seedRoles } from "#modules/roles/infrastructure/seed/seedRoles.js";

// Configurar servidor
const server = express();

// Configuración server con json
server.use(express.json());

// Configuración de cors
server.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Configuramos morgan (ver las peticiones http en la terminal)
server.use(morgan("dev"));

// Levantar servidor
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Configuración base de datos
mongoConnect().then(async () => {
  console.log("MongoDB conectado");

  const routeModules = [userRoutesMetadata, roleRoutesMetadata, logRoutesMetadata, companyRoutesMetadata];

  // Auto-descubrir y sincronizar permisos desde la metadata de las rutas
  const syncDiscoveredPermissions = new SyncDiscoveredPermissionsUseCase(new MongoPermissionRepository());
  const discoveredPermissionCodes = await syncDiscoveredPermissions.execute(routeModules);

  // Sincronizar roles del sistema (admin siempre recibe todos los permisos descubiertos)
  await seedRoles(discoveredPermissionCodes);
});

// Inicializar rutas
// Rutas de autenticación (públicas)
server.use("/api", authRoutes);

// Rutas de recursos (protegidas)
server.use("/api", userRoutes);
server.use("/api/roles", rolesRoutes);
server.use("/api", logsRoutes);
server.use("/api/companies", companiesRoutes);
