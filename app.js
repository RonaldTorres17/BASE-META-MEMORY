const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const MetaProvider = require('@bot-whatsapp/provider/meta');
const MockAdapter = require('@bot-whatsapp/database/mock');

const PORT = process.env.PORT || 3000;

/**
 * Flujos de ejemplo
 */
const flowBienvenida = addKeyword(EVENTS.WELCOME).addAnswer(
  '👋 ¡Hola! Soy el bot de La Gela. ¿Qué opción prefieres?',
  {
    buttons: [
      { body: '🍽️ Ver la Carta' },
      { body: '🗓️ Hacer una Reserva' },
      { body: '⏰ Horarios y Ubicación' },
      { body: '✨ Promociones y Ofertas del Día' },
      { body: '💬 Hablar con un Agente' }
    ]
  }
);

const flowCarta = addKeyword(['🍽️ Ver la Carta']).addAnswer(
  'Aquí tienes nuestra carta completa en PDF: https://goo.su/5yd41'
);

const flowReservar = addKeyword(['🗓️ Hacer una Reserva']).addAnswer(
  '¡Con gusto! Escríbenos al *977 631 749* para confirmar tu reserva 🗓️'
);

const flowHorarios = addKeyword(['⏰ Horarios y Ubicación']).addAnswer(
  '📍 Jr San Martín 212, Bagua Grande, Perú\nGoogle Maps: https://maps.app.goo.gl/tU1K2vBwD2E1jH6V9'
);

const flowPromos = addKeyword(['✨ Promociones y Ofertas del Día']).addAnswer(
  'Tenemos promos nuevas todos los días 🎉 Revisa nuestras redes o pregunta al llegar.'
);

const flowAgente = addKeyword(['💬 Hablar con un Agente']).addAnswer(
  'Enseguida un miembro del equipo se pondrá en contacto contigo 😉'
);

/**
 * Main
 */
const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowBienvenida,
    flowCarta,
    flowReservar,
    flowHorarios,
    flowPromos,
    flowAgente
  ]);

  const adapterProvider = createProvider(MetaProvider, {
    jwtToken: 'EAAXpk12nUvMBPdsn4AHwC8SwtlYDu6cIyaYxmIrPkaapaOpZCY9tRKZBBc5QTJI4WzKAIKTwgNfKEYVFkpeTro17NP24vD3Xuh8WjDIioZAsF9ZAlqlvcUP47lJyatoMj6MTO22qPw3O7JjVEFKJ3yEZCoJCIaEiAr2GGLC86fsAUcC77bMsahyW83nZAc7PaEZCdnFuBKwONhJQ6VJ36oVpbXFlh65Waza2L1jOIhUBHUkTQZDZD',
    numberId: 'T791792920678436',
    verifyToken: 'verifyTokenPrueba',
    version: 'v16.0',
    baseUrl: `https://base-meta-memory-r1d6.onrender.com` // 👈 tu URL pública en Render
  });

  await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  });

  console.log(`✅ Bot desplegado correctamente en Render. Puerto: ${PORT}`);
};

main();
