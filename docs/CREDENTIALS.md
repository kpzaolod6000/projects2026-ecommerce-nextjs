# Test Credentials

Usuarios de prueba creados en la base de datos local.

## Usuarios

| Role | Email | Password |
|------|-------|----------|
| `ADMIN` | admin@techstore.com | `admin1234` |
| `MANAGER` | manager@techstore.com | `manager1234` |
| `CUSTOMER` | customer@techstore.com | `customer1234` |

## Permisos

- **ADMIN** — acceso completo al panel `/admin` (productos, pedidos, usuarios)
- **MANAGER** — acceso al panel `/admin` (productos, pedidos, usuarios)
- **CUSTOMER** — acceso solo a la tienda pública

## Notas

- Las contraseñas están hasheadas con bcrypt en la DB
- Login en: `/account`
- Solo para entornos de desarrollo local — no usar en producción
