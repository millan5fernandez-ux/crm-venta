# Bitácora (crm-venta)

Panel personal todo en uno: gastos, gym, comida, peso y calendario, con una escena 3D isométrica. Versión preparada para vender, derivada de `crm`.

## Qué cambia respecto a `crm`
- **Sin datos personales**: sin avatar, plato de ejemplo, aforo de un gimnasio concreto ni claves de Supabase.
- **Bienvenida**: al abrir por primera vez pide nombre, módulos a usar y objetivo de calorías, y después muestra una guía de 4–6 pasos (se puede saltar y repetir desde Ajustes).
- **Módulos activables**: Gastos, Gym, Comida, Personal y Calendario se pueden quitar desde la bienvenida o en Ajustes (se ocultan del menú y del dashboard; en la escena 3D siguen dibujados).
- **Aforo opcional**: cada usuario pega el enlace https del aforo de su gimnasio en Ajustes → Mi perfil. Vacío = no aparece.
- **Importador de entrenamientos universal**: reconoce los CSV de Hevy, Strong, Fitbod y FitNotes por sus cabeceras. Si no los reconoce, deja asignar columnas (fecha, ejercicio, peso, repeticiones) y elegir kg o lb.
- **Importador de movimientos**: CSV del banco u otra app, con columnas asignables, formato de fecha día/mes o mes/día, signo de los gastos, categorías sugeridas y salto de duplicados.
- **Todo editable**: objetivos de calorías, macros, agua (en litros) y sueño; moneda (€, $, £, MXN, ARS, COP); categorías de gasto (hasta 8) y perfil, tanto en la bienvenida como en Ajustes.
- **Textos legales** en `legal/` (aviso legal, privacidad, términos y compra, cookies y almacenamiento), enlazados desde la bienvenida y Ajustes. Son plantillas con campos `[ASÍ]` por rellenar; ver `legal/LEEME.md`.
- **Solo local por defecto**: sin cuentas hasta que se configure `SB` en `index.html`.

## Activar cuentas y sincronización
En `index.html`, busca `var SB={url:'',key:'',ls:'bitacora-sb'}` y rellena la URL y la clave pública (anon/publishable) de tu proyecto Supabase. Hace falta una tabla de datos por usuario con reglas de acceso por fila (RLS). Mientras estén vacías, la sección de cuenta no se muestra.

## Pendiente antes de vender
1. Idioma (es/en), moneda y unidades (kg/lb en toda la app).
2. Licencias y pago (Lemon Squeezy o Paddle en modo de prueba primero).
3. Política de privacidad, términos y aviso de que no es consejo médico ni financiero.
4. Landing con lista de espera y beta con 10–20 personas.
5. Más importadores (Apple Health, MyFitnessPal, Renpho).

## Probar en local
Abre `index.html` desde un servidor estático (por ejemplo `python3 -m http.server`).
