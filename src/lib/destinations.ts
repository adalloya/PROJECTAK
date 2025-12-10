export interface Destination {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: string;
    overview: string;
    highlights: {
        title: string;
        description: string;
        icon: string; // We'll use simple string identifiers for icons
    }[];
    mustDos: string[];
    tips: string[];
}

export const destinationsData: Record<string, Destination> = {
    "disney-world": {
        slug: "disney-world",
        title: "Walt Disney World Resort",
        subtitle: "El lugar más mágico de la Tierra",
        heroImage: "/images/disney-world.png", // Reusing existing image
        overview: "Walt Disney World Resort en Florida es mucho más que un parque temático; es un mundo de sueños hecho realidad. Con cuatro parques temáticos únicos, dos parques acuáticos, y una infinidad de opciones de compras y restaurantes en Disney Springs, cada día es una nueva aventura.",
        highlights: [
            {
                title: "Magic Kingdom",
                description: "El corazón de la magia, donde los cuentos de hadas cobran vida frente al Castillo de Cenicienta.",
                icon: "castle"
            },
            {
                title: "Epcot",
                description: "Celebra la innovación humana y la cultura internacional en un solo lugar.",
                icon: "globe"
            },
            {
                title: "Disney's Hollywood Studios",
                description: "Adéntrate en la acción de tus películas favoritas, desde Star Wars hasta Toy Story.",
                icon: "film"
            },
            {
                title: "Disney's Animal Kingdom",
                description: "Una aventura salvaje que celebra la belleza de la naturaleza y el mundo animal.",
                icon: "tree"
            }
        ],
        mustDos: [
            "Ver los fuegos artificiales 'Happily Ever After' en Magic Kingdom",
            "Viajar a Batuu en Star Wars: Galaxy's Edge",
            "Disfrutar de un Dole Whip en Adventureland",
            "Expedición al Everest en Animal Kingdom"
        ],
        tips: [
            "Reserva tus Genie+ temprano en la mañana para asegurar las mejores atracciones.",
            "Utiliza el transporte gratuito de Disney (autobuses, monorriel, Skyliner).",
            "Hospúdate en un hotel Disney para obtener entrada temprana a los parques."
        ]
    },
    "universal-studios": {
        slug: "universal-studios",
        title: "Universal Orlando Resort",
        subtitle: "Vive películas épicas en la vida real",
        heroImage: "/images/universal.png",
        overview: "Universal Orlando Resort te sumerge directamente en la acción de tus películas y programas de televisión favoritos. Con tres parques increíbles, incluyendo el parque temático acuático Volcano Bay, la emoción nunca termina.",
        highlights: [
            {
                title: "Universal Studios Florida",
                description: "Conviértete en el protagonista de la acción con atracciones basadas en Harry Potter, Transformers y los Minions.",
                icon: "film"
            },
            {
                title: "Islands of Adventure",
                description: "Explora mundos legendarios de superhéroes, bestias mágicas y dinosaurios.",
                icon: "mountain"
            },
            {
                title: "The Wizarding World of Harry Potter",
                description: "Viaja entre Diagon Alley y Hogsmeade a bordo del Hogwarts Express.",
                icon: "wand"
            }
        ],
        mustDos: [
            "Lanzar hechizos con una varita interactiva en Diagon Alley",
            "Subir a la montaña rusa VelociCoaster (si te atreves)",
            "Beber una Butterbeer fría",
            "Escapar de Gringotts"
        ],
        tips: [
            "Considera el Express Pass para saltar las filas regulares.",
            "Toma el Hogwarts Express para moverte entre los dos parques (requiere boleto Park-to-Park).",
            "Llega temprano a Hagrid's Magical Creatures Motorbike Adventure."
        ]
    },
    "epcot": {
        slug: "epcot",
        title: "EPCOT",
        subtitle: "Explora el futuro y el mundo hoy",
        heroImage: "/images/epcot.png",
        overview: "EPCOT inspira la curiosidad, la imaginación y el asombro. Dedicado a la innovación tecnológica y a la cultura internacional, es un parque en constante transformación que celebra el espíritu humano.",
        highlights: [
            {
                title: "World Showcase",
                description: "Viaja alrededor del mundo visitando 11 pabellones de diferentes países, con comida y arquitectura auténtica.",
                icon: "globe"
            },
            {
                title: "Guardians of the Galaxy: Cosmic Rewind",
                description: "Una de las montañas rusas más grandes y emocionantes bajo techo en el mundo.",
                icon: "star"
            },
            {
                title: "Festivales Estacionales",
                description: "Disfruta de eventos únicos como el Food & Wine Festival o el Flower & Garden Festival.",
                icon: "utensils"
            }
        ],
        mustDos: [
            "Salvar la galaxia en Cosmic Rewind",
            "Comer alrededor del mundo en el World Showcase",
            "Ver el espectáculo nocturno Luminous The Symphony of Us",
            "Volar sobre el mundo en Soarin'"
        ],
        tips: [
            "Entra al parque por el International Gateway si te hospedas en los hoteles del área de Epcot.",
            "Las filas virtuales son comunes para las atracciones más nuevas, prepárate con la app.",
            "No te pierdas Spaceship Earth, el ícono del parque."
        ]
    },
    "disney-cruise": {
        slug: "disney-cruise",
        title: "Disney Cruise Line",
        subtitle: "Magia en alta mar",
        heroImage: "/images/disney-cruise.jpg",
        overview: "Zarpa hacia la aventura con Disney Cruise Line, donde la magia de Disney se encuentra con la relajación de un crucero de lujo. Entretenimiento de clase mundial, cenas temáticas y destinos exóticos te esperan.",
        highlights: [
            {
                title: "Castaway Cay",
                description: "La isla privada de Disney en las Bahamas, un paraíso exclusivo para los pasajeros.",
                icon: "island"
            },
            {
                title: "Cenas Rotativas",
                description: "Disfruta de un restaurante diferente cada noche con tus mismos meseros acompañándote.",
                icon: "utensils"
            },
            {
                title: "Entretenimiento a Bordo",
                description: "Espectáculos estilo Broadway, fuegos artificiales en el mar y encuentros con personajes.",
                icon: "ticket"
            }
        ],
        mustDos: [
            "Deslizarse por el AquaDuck o AquaMouse",
            "Ver una película de estreno en el cine del barco",
            "Disfrutar de un helado ilimitado en la cubierta",
            "Conocer a Mickey Capitán"
        ],
        tips: [
            "Descarga la app de Disney Cruise Line para ver las actividades diarias.",
            "Reserva actividades especiales y cenas para adultos (Palo/Remy) con anticipación.",
            "Decora la puerta de tu camarote con imanes (una tradición divertida)."
        ]
    }
};
