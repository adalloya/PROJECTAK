export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string; // The "problem" it solves
    content: string;
    date: string;
    readTime: string;
    image: string;
    category: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "guia-lightning-lane-multi-pass",
        title: "Guía Definitiva de Lightning Lane: Multi Pass y Single Pass",
        excerpt: "Genie+ ha evolucionado. Aprende a dominar el nuevo sistema Lightning Lane Multi Pass para reservar tus atracciones favoritas desde antes de llegar a los parques.",
        date: "10 Dic, 2025",
        readTime: "6 min de lectura",
        image: "/blog/lightning-lane.png",
        category: "Tips Expertos",
        content: `
            <p>Adiós Genie+, ¡hola Lightning Lane Multi Pass! Disney ha renovado su sistema de filas rápidas y trae grandes ventajas para quienes aman planificar.</p>
            
            <h3>¿Qué es Lightning Lane Multi Pass?</h3>
            <p>Es el nuevo servicio que reemplaza a Genie+. La gran diferencia: <strong>ahora puedes reservar 3 atracciones ANTES de tu viaje</strong>. Ya no tienes que despertarte a las 7:00 AM cada día de tus vacaciones estresado por conseguir un lugar.</p>

            <h3>Reglas de Reserva Anticipada</h3>
            <ul>
                <li><strong>Huéspedes de Hoteles Disney:</strong> Pueden reservar sus pases con plantillas de <strong>7 días de anticipación</strong> a su check-in.</li>
                <li><strong>Visitantes Generales:</strong> Pueden reservar con <strong>3 días de anticipación</strong> a su visita al parque.</li>
            </ul>

            <h3>Single Pass vs. Multi Pass</h3>
            <p>Al igual que antes, las atracciones más populares (como <em>Star Wars: Rise of the Resistance</em> o <em>TRON Lightcycle / Run</em>) no suelen estar incluidas en el Multi Pass y se venden por separado como <strong>Lightning Lane Single Pass</strong>. Puedes comprar hasta 2 de estos por día.</p>

            <h3>Estrategia de Tiers (Niveles)</h3>
            <p>En Magic Kingdom, Epcot y Hollywood Studios, las atracciones están divididas en grupos. Al hacer tus pre-reservas, generalmente puedes elegir 1 atracción del Grupo A (las más populares) y 2 del Grupo B (las demás).</p>

            <h3>¿Vale la pena?</h3>
            <p>Definitivamente. Poder llegar al parque sabiendo que ya tienes asegurada la entrada rápida a <em>Slinky Dog Dash</em> o <em>Remy’s Ratatouille Adventure</em> te da una tranquilidad invaluable. ¡Nosotros te ayudamos a configurar todo!</p>
        `
    },
    {
        id: "2",
        slug: "hotel-disney-vs-externo",
        title: "¿Hotel Disney o Externo? La Verdad Sobre tu Presupuesto",
        excerpt: "¿Vale la pena pagar más por un hotel dentro de Disney? Analizamos los costos ocultos y beneficios reales para que decidas la mejor opción para tu familia.",
        date: "08 Dic, 2025",
        readTime: "7 min de lectura",
        image: "/blog/hotel-disney.png",
        category: "Planificación",
        content: `
            <p>Esta es la pregunta del millón. A simple vista, un hotel fuera de Disney parece mucho más barato. Pero cuando sumas los costos "invisibles", la balanza puede inclinarse.</p>

            <h3>Beneficios Exclusivos de Hoteles Disney</h3>
            <ul>
                <li><strong>Transporte Gratuito:</strong> Buses, monorriel, barcos y el Skyliner te llevan a los parques gratis. Ahorras en Uber o alquiler de auto + estacionamiento ($30/día).</li>
                <li><strong>Early Entry:</strong> Entras a CUALQUIER parque 30 minutos antes que el público general. Esos 30 min valen oro para hacer 1 o 2 atracciones principales sin fila.</li>
                <li><strong>Reservas de Lightning Lane:</strong> Acceso prioritario para reservar tus pases rápidos 7 días antes, frente a solo 3 días para los demás.</li>
            </ul>

            <h3>Cuándo elegir un Hotel Externo</h3>
            <p>Si tienes una familia muy grande (6+ personas) y necesitas cocina completa, o si planeas visitar otros parques como Universal o SeaWorld la mitad del tiempo, una casa vacacional o un hotel en Disney Springs puede ser mejor opción.</p>

            <h3>Veredicto</h3>
            <p>Para un primer viaje centrado 100% en Disney, la "burbuja" de inmersión y la conveniencia del transporte suelen justificar el precio extra. ¡Déjanos cotizarte ambas opciones para que compares!</p>
        `
    },
    {
        id: "3",
        slug: "10-errores-comunes-disney",
        title: "10 Errores Comunes al Planear tu Primer Viaje",
        excerpt: "Evita caer en las trampas de novato que arruinan vacaciones. Desde zapatos incómodos hasta itinerarios imposibles, aquí te decimos qué NO hacer.",
        date: "05 Dic, 2025",
        readTime: "6 min de lectura",
        image: "/blog/errors.png",
        category: "Guías Básicas",
        content: `
            <p>Hemos visto muchas familias regresar agotadas y frustradas por no planear correctamente. Aquí los errores más graves:</p>

            <ol>
                <li><strong>No comprar Lightning Lane con anticipación:</strong> Ahora que se puede pre-reservar, llegar sin nada planeado es un error.</li>
                <li><strong>Querer hacerlo todo:</strong> Disney es ENORME. Intentar ver todo en un solo viaje es receta para el agotamiento. Prioriza tus "must-dos".</li>
                <li><strong>Ignorar el clima de Florida:</strong> Lloverá. Hará calor húmedo. Lleva ponchos (cómpralos en Amazon antes, no en el parque a $15) y zapatos extra cómodos ya caminados.</li>
                <li><strong>No descargar la App My Disney Experience antes:</strong> Familiarízate con los mapas y tiempos de espera desde casa.</li>
                <li><strong>Olvidar los descansos:</strong> Un día de parque es como una maratón. Regresar al hotel a la piscina al mediodía puede salvar la tarde.</li>
            </ol>
            
            <p>No dejes que estos errores te pasen. ¡Con nuestra asesoría, tu itinerario estará blindado contra frustraciones!</p>
        `
    },
    {
        id: "4",
        slug: "universal-vs-disney",
        title: "Universal vs. Disney: ¿Cuál es Mejor para tu Familia?",
        excerpt: "¿Harry Potter o Star Wars? ¿Montañas rusas extremas o magia clásica? Te ayudamos a decidir qué destino se adapta mejor a la edad y gustos de tu grupo.",
        date: "01 Dic, 2025",
        readTime: "4 min de lectura",
        image: "/blog/universal-vs-disney.png",
        category: "Comparativas",
        content: `
            <p>Ambos son increíbles, pero ofrecen experiencias muy diferentes. Elegir el incorrecto para la edad de tus hijos puede ser un error costoso.</p>

            <h3>Disney World es para ti si...</h3>
            <ul>
                <li>Viajas con niños pequeños (menores de 8 años) o abuelos.</li>
                <li>Amas la magia clásica, los desfiles y los fuegos artificiales.</li>
                <li>Te gusta la inmersión total y el "storytelling" más que la adrenalina pura.</li>
                <li>Buscas una experiencia gastronómica temática superior.</li>
            </ul>

            <h3>Universal Orlando es para ti si...</h3>
            <ul>
                <li>Tu familia ama Harry Potter (The Wizarding World es inigualable).</li>
                <li>Tienes adolescentes o adultos que buscan montañas rusas intensas (VelociCoaster, Hulk).</li>
                <li>Prefieres un ritmo más relajado; Universal es más fácil de navegar y requiere menos planificación anticipada que Disney.</li>
                <li>Te hospedas en sus hoteles Premier: ¡incluyen pases Express ilimitados gratis!</li>
            </ul>

            <p>¿Por qué elegir? Muchos de nuestros clientes hacen un "paquete combinado" para disfrutar lo mejor de ambos mundos.</p>
        `
    },
    {
        id: "5",
        slug: "presupuesto-realista-2025",
        title: "Presupuesto Realista: Cuánto Cuesta un Viaje Mágico en 2025",
        excerpt: "Desglosamos los costos reales de boletos, hospedaje y comida para que no te lleves sorpresas. Aprende dónde ahorrar y dónde invertir.",
        date: "28 Nov, 2025",
        readTime: "8 min de lectura",
        image: "/blog/budget.png",
        category: "Finanzas",
        content: `
            <p>Hablemos de números claros. Un viaje a Orlando es una inversión importante y la transparencia es clave.</p>

            <h3>1. Boletos de Parque</h3>
            <p>Calcula aproximadamente $109-$169 USD por día, por persona. Mientras más días vas, menos cuesta el día individual. El ticket de 4 días es el "sweet spot" para muchos.</p>

            <h3>2. Hospedaje</h3>
            <ul>
                <li><strong>Económico (Value):</strong> $150 - $250 USD por noche.</li>
                <li><strong>Moderado:</strong> $280 - $450 USD por noche.</li>
                <li><strong>Lujo (Deluxe):</strong> $550+ USD por noche.</li>
            </ul>

            <h3>3. Comida</h3>
            <p>Presupuesta unos $60-$100 USD por persona al día si haces una comida rápida y una comida de mesa (Table Service). Puedes ahorrar llevando snacks y desayunando en la habitación.</p>

            <h3>4. Extras Ocultos</h3>
            <p>No olvides: Lightning Lane ($25-$40/día), Propinas (18-20% en USA), Souvenirs y Vuelos. </p>

            <p><strong>Nuestra promesa:</strong> Te ayudaremos a construir un paquete que maximice cada dólar de tu presupuesto, aprovechando ofertas que a veces no son públicas.</p>
        `
    },
    {
        id: "6",
        slug: "por-que-agente-gratis",
        title: "Por qué Nuestra Asesoría es GRATIS (y Mejor que Hacerlo Solo)",
        excerpt: "Muchos creen que contratar un agente es más caro. Descubre por qué es exactamente lo contrario y cómo ganamos dinero sin cobrarte un centavo extra.",
        date: "25 Nov, 2025",
        readTime: "3 min de lectura",
        image: "/blog/agent.png",
        category: "Servicios",
        content: `
            <p>Suena demasiado bueno para ser verdad, ¿cierto? ¿Alguien que planea todo mi viaje, hace mis reservas de madrugada y resuelve mis problemas... gratis?</p>

            <h3>¿Cómo funciona?</h3>
            <p>Es sencillo: <strong>Disney nos paga a nosotros, no tú.</strong> Los precios de Disney ya tienen incluida una comisión para agentes de viajes. Si reservas directo por la web de Disney, te cuesta LO MISMO, pero Disney se queda con esa comisión y tú te quedas sin ayuda.</p>

            <h3>¿Qué gano al reservar con Here We Go Advisor?</h3>
            <ul>
                <li><strong>Alguien de tu lado:</strong> Si hay un huracán, un vuelo cancelado o un problema en el hotel, no pasas horas en espera al teléfono. Nosotros lo hacemos por ti.</li>
                <li><strong>Conocimiento Experto:</strong> Visitamos los parques constantemente. Sabemos qué atracciones están cerradas, qué snacks son nuevos y qué hoteles están en remodelación.</li>
                <li><strong>Monitoreo de Ofertas:</strong> Si sale una promoción después de que reservaste, ajustamos tu reserva para que pagues menos.</li>
            </ul>

            <p>Básicamente, al no usarnos, estás pagando por un servicio que no estás recibiendo. ¡Déjanos hacer la magia por ti!</p>
        `
    }
];
