export interface LocalizedDestination {
    subtitle: string;
    overview: string;
    highlights: {
        title: string;
        description: string;
        icon: string;
    }[];
    mustDos: string[];
    tips: string[];
}

export interface Destination {
    slug: string;
    title: string;
    subtitle: string;
    heroImage: string;
    overview: string;
    highlights: {
        title: string;
        description: string;
        icon: string;
    }[];
    mustDos: string[];
    tips: string[];
    translations?: {
        es?: Partial<LocalizedDestination>;
        en?: Partial<LocalizedDestination>;
        pt?: Partial<LocalizedDestination>;
    };
}

export function getLocalizedDestination(dest: Destination, lang: 'es' | 'en' | 'pt'): Destination {
    if (!dest.translations || !dest.translations[lang]) {
        return dest;
    }
    const loc = dest.translations[lang]!;
    return {
        ...dest,
        subtitle: loc.subtitle || dest.subtitle,
        overview: loc.overview || dest.overview,
        highlights: loc.highlights || dest.highlights,
        mustDos: loc.mustDos || dest.mustDos,
        tips: loc.tips || dest.tips,
    };
}

export const destinationsData: Record<string, Destination> = {
    "disney-world": {
        slug: "disney-world",
        title: "Walt Disney World Resort",
        subtitle: "El lugar más mágico de la Tierra",
        heroImage: "/images/disney-world-castle.png",
        overview: "Walt Disney World Resort en Florida es el destino de vacaciones más grande del mundo. Con cuatro parques temáticos (Magic Kingdom, EPCOT, Disney's Hollywood Studios y Disney's Animal Kingdom), parques acuáticos y más de 25 hoteles temáticos.",
        highlights: [
            {
                title: "Magic Kingdom",
                description: "El parque icónico con el Castillo de Cenicienta. Disfruta de clásicos como Pirates of the Caribbean y atracciones como TRON Lightcycle / Run.",
                icon: "castle"
            },
            {
                title: "EPCOT",
                description: "Un viaje a través de la cultura y la innovación. Prueba comida de todo el mundo y vuela en Guardians of the Galaxy: Cosmic Rewind.",
                icon: "globe"
            },
            {
                title: "Disney's Hollywood Studios",
                description: "Sumérgete en Star Wars: Galaxy's Edge y Toy Story Land. El hogar de Rise of the Resistance y Tower of Terror.",
                icon: "film"
            },
            {
                title: "Disney's Animal Kingdom",
                description: "Explora la magia de la naturaleza y Pandora – The World of Avatar. No te pierdas Flight of Passage.",
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
            "Reserva tus Lightning Lanes con anticipación para tus atracciones favoritas.",
            "Aprovecha el 'Early Theme Park Entry' si te hospedas en un hotel Disney (30 min antes).",
            "Lleva baterías portátiles para tu teléfono celular."
        ],
        translations: {
            en: {
                subtitle: "The Most Magical Place on Earth",
                overview: "Walt Disney World Resort in Florida is the world's premier vacation destination. Featuring four theme parks (Magic Kingdom, EPCOT, Disney's Hollywood Studios, and Disney's Animal Kingdom), two water parks, and over 25 themed resort hotels.",
                highlights: [
                    {
                        title: "Magic Kingdom",
                        description: "The iconic park featuring Cinderella Castle. Enjoy classics like Pirates of the Caribbean and thrilling rides like TRON Lightcycle / Run.",
                        icon: "castle"
                    },
                    {
                        title: "EPCOT",
                        description: "A celebration of human achievement and international culture. Taste food from around the world and ride Guardians of the Galaxy: Cosmic Rewind.",
                        icon: "globe"
                    },
                    {
                        title: "Disney's Hollywood Studios",
                        description: "Step into Star Wars: Galaxy's Edge and Toy Story Land. Home of Rise of the Resistance and Tower of Terror.",
                        icon: "film"
                    },
                    {
                        title: "Disney's Animal Kingdom",
                        description: "Explore the magic of nature and Pandora – The World of Avatar. Don't miss Flight of Passage.",
                        icon: "tree"
                    }
                ],
                mustDos: [
                    "Watch the 'Happily Ever After' fireworks show at Magic Kingdom",
                    "Pilot the Millennium Falcon on 'Smugglers Run'",
                    "Enjoy an iconic Dole Whip or Mickey Bar",
                    "Ride 'Guardians of the Galaxy: Cosmic Rewind' at EPCOT"
                ],
                tips: [
                    "Book your Lightning Lane passes in advance for top rides.",
                    "Take advantage of 30-minute Early Theme Park Entry for Disney hotel guests.",
                    "Bring portable phone chargers for the park day."
                ]
            },
            pt: {
                subtitle: "O Lugar Mais Mágico da Terra",
                overview: "O Walt Disney World Resort na Flórida é o maior destino de férias do mundo. Com quatro parques temáticos (Magic Kingdom, EPCOT, Disney's Hollywood Studios e Disney's Animal Kingdom), parques aquáticos e mais de 25 hotéis temáticos.",
                highlights: [
                    {
                        title: "Magic Kingdom",
                        description: "O parque icônico com o Castelo da Cinderela. Curta clássicos como Pirates of the Caribbean e TRON Lightcycle / Run.",
                        icon: "castle"
                    },
                    {
                        title: "EPCOT",
                        description: "Uma viagem pela cultura e inovação. Prove pratos do mundo todo e curta Guardians of the Galaxy: Cosmic Rewind.",
                        icon: "globe"
                    },
                    {
                        title: "Disney's Hollywood Studios",
                        description: "Viva a magia de Star Wars: Galaxy's Edge e Toy Story Land. O lar de Rise of the Resistance.",
                        icon: "film"
                    },
                    {
                        title: "Disney's Animal Kingdom",
                        description: "Explore a natureza e Pandora – The World of Avatar. Não perca Flight of Passage.",
                        icon: "tree"
                    }
                ],
                mustDos: [
                    "Assistir ao show de fogos 'Happily Ever After' no Magic Kingdom",
                    "Pilotar a Millennium Falcon em 'Smugglers Run'",
                    "Provar o famoso Dole Whip",
                    "Andar na montanha-russa 'Guardians of the Galaxy: Cosmic Rewind'"
                ],
                tips: [
                    "Reserve seus passes Lightning Lane com antecedência.",
                    "Aproveite a Entrada Antecipada de 30 minutos para hóspedes dos hotéis Disney.",
                    "Leve carregador portátil para o seu celular."
                ]
            }
        }
    },
    "disneyland": {
        slug: "disneyland",
        title: "Disneyland Resort California",
        subtitle: "El lugar donde comenzó la magia",
        heroImage: "/images/disneyland.png",
        overview: "Disneyland Resort cuenta con 2 parques temáticos y hoteles increíbles. Es el parque original donde Walt Disney caminó, ofreciendo una experiencia histórica y mágica inigualable.",
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
            }
        ],
        mustDos: [
            "Visitar Cars Land y correr en Radiator Springs Racers",
            "Probar un churro clásico de Disneyland",
            "Ver el espectáculo 'World of Color'"
        ],
        tips: [
            "Aprovecha las primeras horas de la mañana con menos filas.",
            "Descarga la app de Disneyland para monitorear tiempos de espera."
        ],
        translations: {
            en: {
                subtitle: "Where the Magic Began",
                overview: "Disneyland Resort features 2 theme parks and amazing hotels. It is the original park where Walt Disney walked, offering an unparalleled historic and magical experience.",
                highlights: [
                    {
                        title: "Disneyland Park",
                        description: "The original park. Walk down Main Street U.S.A. and discover Star Wars: Galaxy's Edge.",
                        icon: "castle"
                    },
                    {
                        title: "Disney California Adventure",
                        description: "Home of Avengers Campus and Cars Land. Thrills and California-style fun.",
                        icon: "star"
                    }
                ],
                mustDos: [
                    "Race through Cars Land on Radiator Springs Racers",
                    "Try a classic warm Disneyland churro",
                    "Watch the 'World of Color' nighttime spectacular"
                ],
                tips: [
                    "Arrive early to take advantage of shorter morning wait times.",
                    "Download the Disneyland app to check live wait times."
                ]
            },
            pt: {
                subtitle: "Onde a Magia Começou",
                overview: "O Disneyland Resort conta com 2 parques temáticos e hotéis incríveis. É o parque original onde Walt Disney caminhou, oferecendo uma experiência histórica única.",
                highlights: [
                    {
                        title: "Disneyland Park",
                        description: "O parque original. Caminhe pela Main Street U.S.A. e descubra Star Wars: Galaxy's Edge.",
                        icon: "castle"
                    },
                    {
                        title: "Disney California Adventure",
                        description: "O lar do Avengers Campus e Cars Land. Diversão e adrenalina ao estilo californiano.",
                        icon: "star"
                    }
                ],
                mustDos: [
                    "Correr em Radiator Springs Racers na Cars Land",
                    "Provar um churro clássico da Disneyland",
                    "Assistir ao show noturno 'World of Color'"
                ],
                tips: [
                    "Chegue cedo para aproveitar as primeiras horas da manhã com menos filas.",
                    "Baixe o aplicativo da Disneyland para ver os tempos de espera."
                ]
            }
        }
    },
    "disney-cruise": {
        slug: "disney-cruise",
        title: "Disney Cruise Line",
        subtitle: "Magia en alta mar",
        heroImage: "/images/disney-cruise.jpg",
        overview: "Desde barcos clásicos hasta los más nuevos como el Disney Wish y Disney Treasure. Disney Cruise Line ofrece vacaciones con servicio legendario y entretenimiento tipo Broadway.",
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
            }
        ],
        mustDos: [
            "Ver los fuegos artificiales en el mar",
            "Ver un estreno de película Disney a bordo",
            "Deslizarse por el tobogán acuático del barco"
        ],
        tips: [
            "Descarga la app 'Disney Cruise Line Navigator' antes de embarcar.",
            "El servicio a la habitación está incluido las 24 horas."
        ],
        translations: {
            en: {
                subtitle: "Magic on the High Seas",
                overview: "From classic ships to new vessels like Disney Wish and Disney Treasure, Disney Cruise Line offers world-class service and Broadway-quality entertainment.",
                highlights: [
                    {
                        title: "Castaway Cay & Lookout Cay",
                        description: "Disney's private island paradises in the Bahamas, exclusive to cruise guests with pristine beaches and island BBQ included.",
                        icon: "island"
                    },
                    {
                        title: "Rotational Dining",
                        description: "A unique dining concept where you rotate through three themed restaurants while your dedicated servers travel with you.",
                        icon: "utensils"
                    }
                ],
                mustDos: [
                    "Watch fireworks at sea (unique to Disney Cruise Line)",
                    "Watch Disney movie premieres on board",
                    "Ride the ship's water coaster"
                ],
                tips: [
                    "Download the 'Disney Cruise Line Navigator' app before boarding.",
                    "24-hour room service is included."
                ]
            },
            pt: {
                subtitle: "Magia em Alto Mar",
                overview: "Dos navios clássicos às novas embarcações como Disney Wish e Disney Treasure, a Disney Cruise Line oferece atendimento lendário e shows ao estilo Broadway.",
                highlights: [
                    {
                        title: "Castaway Cay e Lookout Cay",
                        description: "As ilhas privativas da Disney nas Bahamas, exclusivas para hóspedes, com praias paradisíacas e churrasco incluso.",
                        icon: "island"
                    },
                    {
                        title: "Jantar Rotativo",
                        description: "Conceito único em que você janta em três restaurantes temáticos diferentes, enquanto seus garçons acompanham você.",
                        icon: "utensils"
                    }
                ],
                mustDos: [
                    "Assistir aos fogos de artifício no mar",
                    "Assistir a estréias de filmes Disney a bordo",
                    "Deslizar na atração aquática do navio"
                ],
                tips: [
                    "Baixe o app 'Disney Cruise Line Navigator' antes de embarcar.",
                    "Serviço de quarto 24 horas incluído."
                ]
            }
        }
    },
    "universal-studios": {
        slug: "universal-studios",
        title: "Universal Studios",
        subtitle: "Donde las películas cobran vida",
        heroImage: "/images/universal.png",
        overview: "Universal tiene dos grandes destinos: Hollywood y Florida. En Universal Orlando Resort encontrarás tres parques temáticos increíbles (Universal Studios Florida, Islands of Adventure y Universal Epic Universe), parques acuáticos y el fascinante mundo de The Wizarding World of Harry Potter.",
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
            }
        ],
        mustDos: [
            "Beber una Butterbeer (fría, caliente o frozen)",
            "Lanzar hechizos con una varita interactiva",
            "Subir a 'Hagrid's Magical Creatures Motorbike Adventure'"
        ],
        tips: [
            "Si te hospedas en un hotel Premier de Universal, obtienes Express Pass Ilimitado gratis.",
            "Usa la fila 'Single Rider' para ahorrar tiempo en atracciones populares."
        ],
        translations: {
            en: {
                subtitle: "Where Movies Come to Life",
                overview: "Universal features two top destinations: Hollywood and Florida. At Universal Orlando Resort you'll find three theme parks (Universal Studios Florida, Islands of Adventure, and Universal Epic Universe), water parks, and The Wizarding World of Harry Potter.",
                highlights: [
                    {
                        title: "The Wizarding World of Harry Potter",
                        description: "Visit Hogwarts & Hogsmeade at Islands of Adventure and Diagon Alley at Universal Studios. Ride between them on the Hogwarts Express.",
                        icon: "wand"
                    },
                    {
                        title: "Jurassic World VelociCoaster",
                        description: "Florida's fastest and tallest launch coaster. An intense thrill ride for the brave.",
                        icon: "mountain"
                    }
                ],
                mustDos: [
                    "Sip a cold, frozen, or hot Butterbeer",
                    "Cast spells with an interactive wand",
                    "Ride 'Hagrid's Magical Creatures Motorbike Adventure'"
                ],
                tips: [
                    "Stay at a Universal Premier hotel to get FREE Unlimited Express Passes.",
                    "Use Single Rider lines to skip long wait times."
                ]
            },
            pt: {
                subtitle: "Onde os Filmes Ganham Vida",
                overview: "A Universal tem dois grandes destinos: Hollywood e Flórida. No Universal Orlando Resort você encontrará três parques incríveis (Universal Studios Florida, Islands of Adventure e Universal Epic Universe) e The Wizarding World of Harry Potter.",
                highlights: [
                    {
                        title: "The Wizarding World of Harry Potter",
                        description: "Visite Hogwarts e Hogsmeade no Islands of Adventure, e o Beco Diagonal no Universal Studios. Viaje entre eles no Hogwarts Express.",
                        icon: "wand"
                    },
                    {
                        title: "Jurassic World VelociCoaster",
                        description: "A montanha-russa de lançamento mais alta e rápida da Flórida. Adrenalina pura.",
                        icon: "mountain"
                    }
                ],
                mustDos: [
                    "Beber uma Butterbeer (gelada, frozen ou quente)",
                    "Lançar feitiços com uma varinha interativa",
                    "Andar na atração 'Hagrid's Magical Creatures Motorbike Adventure'"
                ],
                tips: [
                    "Fique em um hotel Premier da Universal para ganhar o Express Pass Ilimitado grátis.",
                    "Use a fila 'Single Rider' para economizar tempo nas atrações concorridas."
                ]
            }
        }
    }
};
