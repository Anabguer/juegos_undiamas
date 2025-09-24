# 🧟 Mini Survival -- Diseño del Juego

## 🎯 Objetivo

-   Sobrevivir el máximo de **días y horas** en un mundo apocalíptico.\
-   Cada decisión impacta en tus **barras de hambre, sed y vida**.\
-   Mecánicas simples pero con **toques de humor irónico** para
    enganchar.

------------------------------------------------------------------------

## ⏰ Sistema de Tiempo

-   **Reloj en pantalla**: formato `hh h. mm m. ss s.`\
-   Cada **5 segundos** = 1 hora del juego.\
-   Cada 24 horas = 1 día completo.\
-   **Efecto día/noche**:
    -   Fondo de día ☀️
    -   Fondo de noche 🌙
    -   Durante la noche baja más rápido la salud si no tienes
        **bufanda**.

------------------------------------------------------------------------

## ❤️ Barras de Estado

-   **🍎 Hambre**\
-   **💧 Sed**\
-   **❤️ Salud**\
-   Cuando comida/agua llegan a 0 → empieza a bajar salud.\
-   Efectos visuales:
    -   **Hambre**: pantalla rojiza, personaje con tripa vacía.\
    -   **Sed**: pantalla borrosa o gotas de agua.\
    -   **Contagiado**: pantalla psicodélica/verde.\
    -   **Frío**: personaje tiritando.

------------------------------------------------------------------------

## 🧍 Personaje

-   5 estados visibles:
    1.  Normal\
    2.  Con hambre\
    3.  Con sed\
    4.  Contagiado (zombi le alcanzó)\
    5.  Con frío (si no tiene bufanda de noche)
-   Animaciones:
    -   Boca que se abre/cierra para comer/beber.\
    -   Objetos de comida y bebida **vuelan a su boca** al usarse.

------------------------------------------------------------------------

## 🎴 Cartas por Turno

-   Cada turno aparecen **3 cartas** durante 5 segundos.\
-   Si no eliges, sufres penalización (pierdes salud).\
-   Tipos de cartas:
    -   **Comida**: manzana 🍏, pollo 🍗, patatas 🍟 → +hambre.\
    -   **Bebida**: agua 💧, zumo 🥤, lata refresco 🥫 → +sed.\
    -   **Curación**: antídoto 💉 → cura contagio.\
    -   **Bufanda 🧣**: evita daño por frío nocturno.\
    -   **Bate 🏏**: sirve para golpear zombis.\
    -   **Basura graciosa**: pato de goma, osito de peluche, CD,
        sombrero → no ayudan pero muestran frases irónicas.

------------------------------------------------------------------------

## 🧟 Zombis

-   **4 tipos diferentes** (variación visual).\
-   Aparecen en las casillas laterales (izquierda o derecha).\
-   Mecánica:
    -   Cada turno avanzan 1 casilla hacia el jugador.\
    -   Si llegan al jugador:
        -   Personaje queda **contagiado**.\
        -   La comida y la sed se consumen 3--4 veces más rápido.\
    -   Para eliminarlos:
        -   Usar un **bate** desde inventario.\
        -   Acción: clic en la casilla con zombi.

------------------------------------------------------------------------

## 📦 Inventario

-   Barra inferior con los objetos acumulados.\
-   Items clicables para usarlos en cualquier momento.\
-   Ejemplo:
    -   **Bate ×2**\
    -   **Antídoto ×1**\
    -   **Bufanda ×1**

------------------------------------------------------------------------

## ⚡ Mecánicas Extra

-   Eventos especiales:
    -   **Veneno** (opcional): baja salud hasta que uses antídoto.\
    -   **Pantalla temblor**: efecto cuando recibes daño.\
    -   **Toast gracioso**: frases irónicas al usar objetos inútiles.
        -   Ej: Osito: "Yo no juego con esas cosas..."\
        -   CD: "¿Quién tiene un lector de esto?"\
        -   Pato: "¡Cuac! Muy útil... para nada."

------------------------------------------------------------------------

## 📊 Probabilidades (ejemplo inicial)

-   Comida: 20%\
-   Bebida: 20%\
-   Curación/antídoto: 5%\
-   Bufanda: 5%\
-   Bate: 10%\
-   Basura graciosa: 20%\
-   Zombis: 20%

*(Estos números son orientativos, se pueden ajustar para balancear la
dificultad.)*

------------------------------------------------------------------------

## 🚀 Flujo de Juego

1.  Modal inicial con instrucciones graciosas.\
2.  Empieza el día a las 08:00.\
3.  Cada 5 segundos = 1 hora.\
4.  Cada turno aparecen 3 cartas → elegir o perder salud.\
5.  Mantén tus barras arriba, elimina zombis, aguanta el frío.\
6.  Objetivo: **sobrevivir cuántos días/hours puedas**.
