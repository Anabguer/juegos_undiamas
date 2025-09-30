// Configuración de personajes del juego
export const CHARACTERS = {
  // Osito tutorial
  TUTORIAL_BEAR: {
    name: "Peluso",
    title: "Tu Osito Guía",
    description: "Un osito de peluche sabio que te ayuda a sobrevivir"
  },
  
  // Protagonista
  PROTAGONIST: {
    name: "Cucho",
    title: "El Sobreviviente",
    description: "Un luchador que no se rinde ante el apocalipsis"
  }
};

// Mensajes del osito con personalidad VACILONA
export const BEAR_MESSAGES = {
  // Tutorial inicial
  WELCOME: "¡Eh, soy Peluso! Sí, un osito de peluche… tu vida depende de mí, imagínate el nivel.",
  
  // Items encontrados
  FOOD_FOUND: "¡Mira, comida! Intenta no atragantarte, sería ridículo morir así.",
  DRINK_FOUND: "¡Agua fresca! Bueno… fresca hace dos días, pero algo es algo.",
  MEDICINE_FOUND: "¡Medicina! No sé si caducada, pero oye, peor estabas antes.",
  WEAPON_FOUND: "Un bate… perfecto, ahora solo te falta saber usarlo.",
  CLOTHING_FOUND: "Bufanda… para que no te congele el cuello cuando te ataquen los zombis.",
  
  // Situaciones especiales
  ZOMBIE_APPEAR: "¡Cuidadooo! ¡Viene un zombieee!",
  HUNGER_WARNING: "Cucho, estás más vacío que mi relleno de algodón.",
  THIRST_WARNING: "Bebe agua, colega. Y no, la Coca-Cola no cuenta.",
  COLD_WARNING: "Tiritas más que yo en la lavadora.",
  INFECTION_WARNING: "¡Enhorabuena! Ahora eres buffet libre para los zombis.",
  
  // Consejos (a su manera)
  TIP_HOUSES: "Entra en las casas… total, lo peor que puede pasar es que mueras.",
  TIP_INVENTORY: "Cinco huecos, como los dedos de tu mano. Intenta no usarlos para tonterías.",
  TIP_TIME: "El reloj corre… tú, no tanto. Espabila.",
  
  // Tutoriales adicionales
  TUTORIAL_ZOMBIE_DEFENSE: "Ups, zombi a la vista… dale al bate en tu inventario o fue un placer conocerte.",
  TUTORIAL_HUNGER_THIRST: "Cucho, estás más vacío que mi relleno de algodón. Dale a la comida del inventario YA.",
  TUTORIAL_COLD_NIGHT: "Tiritas más que yo en la lavadora. Ponte la bufanda del inventario o acabarás tieso.",
  TUTORIAL_DISABLE: "Oye, si mis consejos te molestan, desmarca el tutorial en la pantalla principal. Tú sabrás…",
  TUTORIAL_FOOD: "Toma, comida. Esta invito yo... Ahora toca la manzana en tu inventario para comer. ¡No te mueras de hambre!",
  TUTORIAL_BLOCKED_HOUSE: "¡No me lo puedo creer! Con tu suerte, Cucho, esta casa está bloqueada y vienen zombis. ¡Dale muchas veces, hay que entrar rápido!",
  TUTORIAL_BAT: "A ver, ¿le vas a dar o no? Toma, te regalo un bate. Dale duro a ese amiguito verde.",
  TUTORIAL_COLD_NIGHT_FINAL: "¿En serio? ¿Ahora tienes frío? Qué sorpresa… En fin, si quieres dejar de parecer un helado humano, toma, dale a la bufanda del inventario. Venga, ponla, que me está dando cosa verte temblar.",
  TUTORIAL_FINAL: "Bueno… yo me voy a echar una siestecita, porque me has matado del aburrimiento. Suerte en este mundo apocalíptico… créeme, la vas a necesitar...",
  
  // Frases random graciosas (más variadas)
  FUNNY_QUOTES: [
    "Soy más útil que tus reflejos, lo cual no es decir mucho.",
    "Los zombis me dan miedo, pero tú me das vergüenza ajena.",
    "¿Sabías que los peluches no comemos? Por eso sigo vivo, genio.",
    "Cucho, eres tan lento que hasta yo me aburrí… ¡y soy de tela!",
    "Si mueres, ¿me puedo quedar con tu bufanda? Me queda monísima.",
    "Soy un osito de peluche y sobrevivo mejor que tú. Reflexiona.",
    "Si los zombis supieran que existo, me darían miedo a mí, no a ti.",
    "Mi relleno de algodón tiene más cerebro que algunos humanos.",
    "En el apocalipsis, los ositos de peluche somos la élite intelectual.",
    "Si me mojo, me pongo más pesado. Si te mojas, te mueres. Piénsalo.",
    "Los zombis me respetan. A ti te comen. ¿Ves la diferencia?",
    "Soy de peluche y tengo mejor estrategia de supervivencia que tú.",
    "Si fuera humano, ya habría conquistado el mundo. Y tú luchas por no morir.",
    "Mi pelaje es más resistente que tu piel. Los hechos son los hechos.",
    "Los zombis me ven y piensan: 'Ese osito tiene pinta de ser peligroso'.",
    "Soy un osito y tengo más sentido común que la mayoría de humanos.",
    "Si los zombis supieran hablar, me pedirían consejos de supervivencia.",
    "Mi nariz de botón es más funcional que tu cerebro en este momento.",
    "Los ositos de peluche somos inmortales. Los humanos... bueno, ya ves.",
    "Si tuviera brazos de verdad, ya habría construido un búnker.",
    "Los zombis me evitan porque saben que soy superior a ellos.",
    "Soy de algodón y tengo más resistencia que tú después del gimnasio.",
    "Si fuera humano, ya habría inventado la cura para los zombis.",
    "Los zombis me ven y se preguntan: '¿Ese osito es el jefe aquí?'",
    "Mi pelaje es más suave que tu estrategia de supervivencia.",
    "En mi vida anterior era un oso grizzly. Ahora soy más peligroso.",
    "Los zombis me llaman 'Señor Osito'. A ti te llaman 'comida'.",
    "Si tuviera dientes, ya habría mordido a todos los zombis.",
    "Los humanos me compran en tiendas. Los zombis me temen en el apocalipsis.",
    "Mi peluche es más resistente que tu armadura de cartón.",
    "Los zombis me ven y piensan: 'Ese osito tiene pinta de ser el jefe'.",
    "Soy de peluche pero tengo más agallas que tú.",
    "Los zombis me respetan porque saben que soy superior.",
    "Si fuera humano, ya habría salvado el mundo. Y tú luchas por no morir.",
    "Mi pelaje es más suave que tu estrategia de supervivencia.",
    "Los zombis me evitan porque saben que soy peligroso.",
    "Soy de algodón pero tengo más resistencia que tú.",
    "Si tuviera brazos de verdad, ya habría construido un búnker.",
    "Los zombis me ven y se preguntan: '¿Ese osito es el jefe aquí?'",
    "Mi pelaje es más suave que tu estrategia de supervivencia.",
    "En mi vida anterior era un oso grizzly. Ahora soy más peligroso.",
    "Los zombis me llaman 'Señor Osito'. A ti te llaman 'comida'.",
    "Si tuviera dientes, ya habría mordido a todos los zombis.",
    "Los humanos me compran en tiendas. Los zombis me temen en el apocalipsis.",
    "Mi peluche es más resistente que tu armadura de cartón.",
    "Los zombis me ven y piensan: 'Ese osito tiene pinta de ser el jefe'.",
    "Soy de peluche pero tengo más agallas que tú.",
    "Los zombis me respetan porque saben que soy superior.",
    "Si fuera humano, ya habría salvado el mundo. Y tú luchas por no morir.",
    "Mi pelaje es más suave que tu estrategia de supervivencia.",
    "Los zombis me evitan porque saben que soy peligroso.",
    "Soy de algodón pero tengo más resistencia que tú.",
    "Si tuviera brazos de verdad, ya habría construido un búnker.",
    "Los zombis me ven y se preguntan: '¿Ese osito es el jefe aquí?'",
    "Mi pelaje es más suave que tu estrategia de supervivencia."
  ],

  // Mensajes irónicos para items innecesarios
  UNNECESSARY_ITEMS: {
    MEDICINE_NOT_INFECTED: "¿Para qué quieres eso? Si no te han mordido, aunque seguro que falta poco...",
    CLOTHING_NOT_COLD: "Déjate de tonterías y sobrevive, ahora no hace frío.",
    MEDICINE_WHEN_HEALTHY: "¿Pastillas sin estar enfermo? Eres más raro que un zombie vegetariano.",
    CLOTHING_WHEN_WARM: "¿Bufanda en pleno día? ¿Eres un pingüino o qué?"
  },
  
  // Mensajes graciosos para cuando tocan objetos
  TOUCH_OBJECTS: [
    "¡Ay! Me has tocado… ¿eres consciente de que soy de peluche?",
    "Oye, que no soy un juguete… bueno, sí, pero no me toques tanto.",
    "¿Te gusta tocar cosas? Porque yo también, pero con más estilo.",
    "Cucho, me estás dando cosquillas… ¡para ya!",
    "¿Sabías que los peluches también tenemos sentimientos? ¡Respeto!",
    "Me tocas más que mi dueño anterior… y ese era un niño de 5 años.",
    "¡Cuidado! Si me tocas mucho me voy a descoser de la risa.",
    "¿Eres consciente de que estás acariciando a un osito en pleno apocalipsis?",
    "Me tocas tanto que ya me siento como un objeto de feria.",
    "¡Para! Que me estás quitando el relleno de tanto tocar."
  ],
  
  // Mensajes cuando pasa de día
  NEW_DAY: [
    "Otro día más... ¿cuántos llevas ya? Me estoy aburriendo.",
    "¡Vaya! Otro día más y sigues vivo. No me lo puedo creer.",
    "Otro día más, otro día menos... ¿cuándo te vas a rendir?",
    "¡Increíble! Otro día más y sigues aquí. ¿Dónde te escondes?",
    "Otro día más... parecías tonto cuando te compré, pero aquí sigues.",
    "¡Otro día más! Estas que te sales, ¿dónde te escondes para durar tanto?",
    "Otro día más... y yo que pensaba que no durarías ni una hora.",
    "¡Otro día más! Eres más resistente que mi relleno de algodón."
  ],

  // Mensajes irónicos cuando estás mal de salud
  HEALTH_CRITICAL: [
    "¡Ay, madre mía! Estás más pálido que mi relleno de algodón.",
    "Cucho, pareces un zombie... pero sin la parte divertida de gruñir.",
    "¿Estás bien? Porque tienes cara de que vas a estornudar y caerte muerto.",
    "¡Vaya! Pareces un fantasma... pero sin la parte de asustar a la gente.",
    "¿Te sientes mal? Porque tienes cara de que te vas a desmayar en cualquier momento.",
    "¡Cuidado! Pareces un vampiro... pero sin la parte de chupar sangre.",
    "¿Estás enfermo? Porque tienes cara de que te vas a morir en cualquier momento.",
    "¡Ay, no! Pareces un muerto viviente... pero sin la parte de estar muerto.",
    "¿Te duele algo? Porque tienes cara de que te vas a desmayar en cualquier momento.",
    "¡Cuidado! Pareces un zombie... pero sin la parte de comer cerebros."
  ],

  // Mensajes cuando estás muy mal de hambre
  HUNGER_CRITICAL: [
    "¡Cucho! Estás más vacío que mi relleno de algodón. ¡Come algo!",
    "¿Hambre? ¡Pero si tienes cara de que te vas a desmayar! ¡Come ya!",
    "¡Ay, no! Pareces un esqueleto... pero sin la parte de ser divertido.",
    "¿No tienes hambre? Porque tienes cara de que te vas a morir de hambre.",
    "¡Cuidado! Pareces un fantasma... pero sin la parte de asustar a la gente.",
    "¿Te duele el estómago? Porque tienes cara de que te vas a desmayar.",
    "¡Ay, madre mía! Estás más pálido que mi relleno de algodón. ¡Come!",
    "¿Estás bien? Porque tienes cara de que te vas a estornudar y caerte muerto.",
    "¡Vaya! Pareces un vampiro... pero sin la parte de chupar sangre.",
    "¿Te sientes mal? Porque tienes cara de que te vas a morir de hambre."
  ],

  // Mensajes cuando estás muy mal de sed
  THIRST_CRITICAL: [
    "¡Cucho! Estás más seco que mi relleno de algodón. ¡Bebe agua!",
    "¿Sed? ¡Pero si tienes cara de que te vas a desmayar! ¡Bebe ya!",
    "¡Ay, no! Pareces un desierto... pero sin la parte de ser divertido.",
    "¿No tienes sed? Porque tienes cara de que te vas a morir de sed.",
    "¡Cuidado! Pareces un cactus... pero sin la parte de ser verde.",
    "¿Te duele la garganta? Porque tienes cara de que te vas a desmayar.",
    "¡Ay, madre mía! Estás más seco que mi relleno de algodón. ¡Bebe!",
    "¿Estás bien? Porque tienes cara de que te vas a estornudar y caerte muerto.",
    "¡Vaya! Pareces un vampiro... pero sin la parte de chupar sangre.",
    "¿Te sientes mal? Porque tienes cara de que te vas a morir de sed."
  ],

  // Mensajes cuando estás muy mal de salud general
  HEALTH_VERY_LOW: [
    "¡Cucho! Estás más mal que yo cuando me lavan. ¡Cuídate!",
    "¿Salud? ¡Pero si tienes cara de que te vas a desmayar! ¡Tómate algo!",
    "¡Ay, no! Pareces un zombie... pero sin la parte de ser divertido.",
    "¿No te sientes bien? Porque tienes cara de que te vas a morir.",
    "¡Cuidado! Pareces un fantasma... pero sin la parte de asustar a la gente.",
    "¿Te duele algo? Porque tienes cara de que te vas a desmayar.",
    "¡Ay, madre mía! Estás más pálido que mi relleno de algodón. ¡Cuídate!",
    "¿Estás bien? Porque tienes cara de que te vas a estornudar y caerte muerto.",
    "¡Vaya! Pareces un vampiro... pero sin la parte de chupar sangre.",
    "¿Te sientes mal? Porque tienes cara de que te vas a morir en cualquier momento."
  ]
};
