const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const MetaProvider = require('@bot-whatsapp/provider/meta');
const MockAdapter = require('@bot-whatsapp/database/mock');
const express = require("express");

/**
 * Flujos con respuestas automatizadas para los 5 botones
 */

// Flujo para "Ver la Carta"
const flowCarta = addKeyword(['🍽️ Ver la Carta', 'carta', 'menú'])
    .addAnswer('Claro, aquí puedes ver nuestra carta completa en PDF:', null, async (_, { flowDynamic }) => {
        await flowDynamic('https://goo.su/5yd41');
    });

// Flujo para "Hacer una Reserva"
const flowReservar = addKeyword(['🗓️ Hacer una Reserva', 'reserva', 'reservar'])
    .addAnswer('¡Con gusto! Para hacer una reserva, por favor, contáctanos directamente para asegurar un espacio. Nuestro número es: *977 631 749*');

// Flujo para "Horarios y Ubicación"
const flowHorariosUbicacion = addKeyword(['⏰ Horarios y Ubicación', 'ubicacion', 'horarios', 'donde están'])
    .addAnswer('Estamos ubicados en: Jr San Martín 212, Bagua Grande, Perú. Puedes encontrarnos en este enlace: https://maps.app.goo.gl/tU1K2vBwD2E1jH6V9');

// Flujo para "Promociones y Ofertas del Día"
const flowPromociones = addKeyword(['✨ Promociones y Ofertas del Día', 'promociones', 'ofertas'])
    .addAnswer('¡Tenemos promociones especiales todos los días! Pregunta a nuestro equipo al llegar o revisa nuestras redes sociales para más detalles.');

// Flujo para "Hablar con un Agente"
const flowHablarAgente = addKeyword(['💬 Hablar con un Agente', 'contacto', 'hablar con alguien'])
    .addAnswer('Entendido. En breve un miembro de nuestro equipo te atenderá para resolver tus dudas. Por favor, sé paciente. 😉');

/**
 * Flujo por defecto (respuestas inválidas)
 */
const flowInvalido = addKeyword([''])
    .addAnswer(
        'Perdona, pero no puedo comprender tu respuesta. Por favor, selecciona una de las opciones del menú para continuar.',
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

/**
 * Flujo de bienvenida
 */
const flowBienvenida = addKeyword(EVENTS.WELCOME)
    .addAnswer(
        '¡Hola! 👋 Soy Selena, la asistente virtual de La Gela. ¿En qué puedo ayudarte hoy? 🤔',
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

/**
 * Función principal
 */
const main = async () => {
    const PORT =  3000;

    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([
        flowBienvenida,
        flowCarta,
        flowReservar,
        flowHorariosUbicacion,
        flowPromociones,
        flowHablarAgente,
        flowInvalido
    ]);

const adapterProvider = createProvider(MetaProvider, {
    jwtToken: 'EAAXpk12nUvMBPdsn4AHwC8SwtlYDu6cIyaYxmIrPkaapaOpZCY9tRKZBBc5QTJI4WzKAIKTwgNfKEYVFkpeTro17NP24vD3Xuh8WjDIioZAsF9ZAlqlvcUP47lJyatoMj6MTO22qPw3O7JjVEFKJ3yEZCoJCIaEiAr2GGLC86fsAUcC77bMsahyW83nZAc7PaEZCdnFuBKwONhJQ6VJ36oVpbXFlh65Waza2L1jOIhUBHUkTQZDZD',
    numberId: '791792920678436',
    verifyToken: 'verifyTokenPrueba',
    version: 'v16.0',
    baseUrl: `https://base-meta-memory-r1d6.onrender.com` // 👈 tu dominio en Render
});

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    // Servidor HTTP para Render
    const app = express();
    app.get("/", (req, res) => {
        res.send("Bot WhatsApp corriendo 🚀");
    });

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
};

main();
