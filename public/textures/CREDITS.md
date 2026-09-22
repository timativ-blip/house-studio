# Текстуры

Все текстуры в этой папке — лицензия
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (общественное
достояние, указание авторства не требуется). Разрешение 1K, формат JPEG.

| Папка | Источник |
|---|---|
| `wall-plaster-white` | [Poly Haven — painted_plaster_wall](https://polyhaven.com/a/painted_plaster_wall) |
| `wall-plaster-beige` | [Poly Haven — beige_wall_001](https://polyhaven.com/a/beige_wall_001) |
| `wall-brick-red` | [Poly Haven — red_brick](https://polyhaven.com/a/red_brick) |
| `floor-wood-oak` | [Poly Haven — wood_floor](https://polyhaven.com/a/wood_floor) |
| `floor-tile-grey` | [Poly Haven — floor_tiles_02](https://polyhaven.com/a/floor_tiles_02) |
| `floor-concrete` | [Poly Haven — concrete_floor](https://polyhaven.com/a/concrete_floor) |
| `ground-grass` | [ambientCG — Grass001](https://ambientcg.com/view?id=Grass001) |

Каждая папка содержит `diffuse.jpg` (базовый цвет), `normal.jpg`
(OpenGL-нормали) и `arm.jpg` (для Poly Haven — AO/Roughness/Metalness в
каналах R/G/B; для ambientCG-набора — отдельная карта шероховатости, но
используется тем же полем в `useSurfaceTextures`).

Первая версия `ground-grass` была с Poly Haven (`grass_ground`), но
выглядела как вытоптанный/сухой газон, а не ухоженный — заменена на
Grass001 с ambientCG.
