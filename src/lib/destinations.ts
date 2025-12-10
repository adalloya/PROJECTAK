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
        heroImage: "/images/disney-world.png",
        overview: "Walt Disney World Resort en Florida es el destino de vacaciones más grande y visitado del mundo. Con cuatro parques temáticos (Magic Kingdom, EPCOT, Disney's Hollywood Studios y Disney's Animal Kingdom), dos parques acuáticos, más de 25 hoteles temáticos y el centro de compras y entretenimiento Disney Springs, ofrece una experiencia inmersiva inigualable para todas las edades.",
        highlights: [
            {
                title: "Magic Kingdom",
                description: "El parque icónico con el Castillo de Cenicienta. Disfruta de clásicos como 'Pirates of the Caribbean' y emociones nuevas como 'TRON Lightcycle / Run'.",
                icon: "castle"
            },
            {
                title: "EPCOT",
                description: "Un viaje a través de la cultura y la innovación. Prueba comida de todo el mundo y viaja por el tiempo en 'Spaceship Earth'.",
                icon: "globe"
            },
            {
                title: "Disney's Hollywood Studios",
                description: "Sumérgete en Star Wars: Galaxy's Edge y Toy Story Land. El hogar de 'Rise of the Resistance' y 'Tower of Terror'.",
                icon: "film"
            },
            {
                title: "Disney's Animal Kingdom",
                description: "Explora la magia de la naturaleza y Pandora – The World of Avatar. No te pierdas 'Flight of Passage'.",
                icon: "tree"
            }
        ],
        mustDos: [
            "Ver el espectáculo de fuegos artificiales 'Happily Ever After' en Magic Kingdom",
            "Pilotar el Halcón Milenario en 'Smugglers Run'",
            "Comer un Mickey Premium Bar o un Dole Whip",
            "Subir a 'Guardians of the Galaxy: Cosmic Rewind' en EPCOT",
            "Ver el show 'Festival of the Lion King'"
        ],
        tips: [
            "Reserva tus Genie+ a las 7:00 AM en punto para las atracciones más populares.",
            "Aprovecha el 'Early Theme Park Entry' si te hospedas en un hotel Disney (30 min antes).",
            "Lleva baterías portátiles, la app My Disney Experience consume mucha energía.",
            "Haz reservaciones de restaurantes 60 días antes de tu viaje."
        ]
    },
    "universal-studios": {
        slug: "universal-studios",
        title: "Universal Orlando Resort",
        subtitle: "Donde las películas cobran vida",
        heroImage: "/images/universal.png",
        overview: "Universal tiene dos grandes destinos: Hollywood y Florida. En Universal Orlando Resort (Florida), encontrarás tres parques temáticos increíbles (Universal Studios Florida, Universal's Islands of Adventure y Universal's Volcano Bay), hoteles espectaculares y la zona de entretenimiento City Walk. Es el hogar del fenómeno mundial: The Wizarding World of Harry Potter.",
        highlights: [
            {
                title: "The Wizarding World of Harry Potter",
                description: "Visita Hogwarts y Hogsmeade en Islands of Adventure, y Diagon Alley en Universal Studios. Viaja entre ellos en el Hogwarts Express.",
                icon: "wand"
            },
            {
                title: "Jurassic World VelociCoaster",
                description: "La montaña rusa de lanzamiento más alta y rápida de Florida. Una experiencia intensa para los más valientes.",
                icon: "mountain"
            },
            {
                title: "Minion Land",
                description: "Diviértete con los traviesos Minions en atracciones para toda la familia como 'Despicable Me Minion Mayhem'.",
                icon: "star"
            }
        ],
        mustDos: [
            "Beber una Butterbeer (fría, caliente o frozen)",
            "Lanzar hechizos con una varita interactiva",
            "Enfrentar a 'Hagrid's Magical Creatures Motorbike Adventure'",
            "Escapar de la Momia en Universal Studios",
            "Comer en 'The Three Broomsticks'"
        ],
        tips: [
            "Si te hospedas en un hotel Premier de Universal, obtienes Express Pass Ilimitado gratis.",
            "El Hogwarts Express requiere un boleto 'Park-to-Park'.",
            "Usa la fila 'Single Rider' para ahorrar tiempo en atracciones populares como Gringotts."
        ]
    },
    "disneyland": {
        slug: "disneyland",
        title: "Disneyland Resort California",
        subtitle: "El lugar donde comenzó la magia",
        heroImage: "/images/disneyland.png",
        overview: "Disneyland Resort en California es el original, donde Walt Disney caminó. Cuenta con dos parques temáticos legendarios: Disneyland Park y Disney California Adventure Park. Además, ofrece inmersión total con sus Hoteles Disney y la conveniencia de los Hoteles Good Neighbor certificados.",
        highlights: [
            {
                title: "Disneyland Park",
                description: "El parque original. Camina por Main Street U.S.A. y descubre Star Wars: Galaxy's Edge.",
                icon: "castle"
            },
            {
                title: "Disney California Adventure",
                description: "El hogar de Avengers Campus y Cars Land. Diversión y adrenalina al estilo californiano.",
                icon: "star"
            },
            {
                title: "Avengers Campus",
                description: "Entrena con los héroes más poderosos de la Tierra y lanza telarañas con Spider-Man.",
                icon: "shield"
            }
        ],
        mustDos: [
            "Visitar Cars Land y correr en Radiator Springs Racers",
            "Probar un churro clásico de Disneyland",
            "Ver el espectáculo 'World of Color'",
            "Conocer a los Avengers",
            "Caminar por donde Walt Disney caminó"
        ],
        tips: [
            "Usa Park Hopper, los parques están uno frente al otro.",
            "Llega temprano para aprovechar las mañanas con menos gente.",
            "Descarga la app de Disneyland para ver tiempos de espera."
        ]
    },
    "disney-cruise": {
        slug: "disney-cruise",
        title: "Disney Cruise Line",
        subtitle: "Magia en alta mar",
        heroImage: "/images/disney-cruise.jpg",
        overview: "Disney Cruise Line ofrece unas vacaciones en crucero donde la magia impregna cada detalle. Desde barcos clásicos hasta los más nuevos como el Disney Wish, Disney Treasure y Disney Destiny, disfrutarás de servicio legendario, entretenimiento tipo Broadway y destinos paradisíacos.",
        highlights: [
            {
                title: "Castaway Cay y Lookout Cay",
                description: "Las islas privadas de Disney en las Bahamas, exclusivas para huéspedes, con playas prístinas y barbacoa incluida.",
                icon: "island"
            },
            {
                title: "Cenas Rotativas",
                description: "Un concepto único donde cenas en tres restaurantes temáticos diferentes, pero tus meseros viajan contigo.",
                icon: "utensils"
            },
            {
                title: "Clubes para Niños",
                description: "Espacios increíbles (Oceaneer Club) donde los niños juegan supervisados mientras los adultos se relajan.",
                icon: "ticket"
            }
        ],
        mustDos: [
            "Ver los fuegos artificiales en el mar (única naviera que lo hace)",
            "Ver un estreno de película Disney",
            "Disfrutar de un brunch en Palo (solo adultos)",
            "Deslizarse por el tobogán acuático del barco"
        ],
        tips: [
            "Descarga la app 'Disney Cruise Line Navigator' antes de embarcar.",
            "El servicio a la habitación es gratuito las 24 horas (la mayoría del menú).",
            "Reserva actividades a bordo tan pronto se abra tu ventana de reserva (depende de tu nivel Castaway Club)."
        ]
    }
};
