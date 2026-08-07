export type Language = 'es' | 'en' | 'pt';

export interface LanguageOption {
    code: Language;
    name: string;
    flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
    { code: 'es', name: 'Español', flag: '🇲🇽' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export const translations = {
    es: {
        // Navbar
        nav_destinations: "Destinos",
        nav_about: "Sobre mí",
        nav_services: "Mis Servicios",
        nav_blog: "Blog",
        nav_faq: "FAQ",
        nav_resources: "Recursos",
        nav_quote: "Solicitar cotización",

        // Hero Section
        hero_badge: "Agente Certificada Disney & Universal",
        hero_title_1: "Vive la Magia sin",
        hero_title_2: "Preocupaciones",
        hero_subtitle: "Diseño itinerarios y viajes personalizados a Walt Disney World, Disneyland y Disney Cruise Line para que tú solo te dediques a disfrutar.",
        hero_cta_primary: "Solicitar Cotización Gratis",
        hero_cta_secondary: "Ver Destinos Magic",
        hero_stat_clients: "Familias Felices",
        hero_stat_cert: "Agente Oficial",
        hero_stat_support: "Asesoría 1 a 1",

        // Destinations Section
        dest_badge: "Destinos Mágicos",
        dest_title: "Descubre la Magia de Disney",
        dest_subtitle: "Elige tu próxima gran aventura en los parques y cruceros más increíbles del mundo.",
        dest_view_details: "Ver Detalles",
        dest_wdw_title: "Walt Disney World",
        dest_wdw_sub: "Orlando, Florida",
        dest_wdw_desc: "4 parques temáticos, 2 parques acuáticos y más de 30 hoteles de ensueño.",
        dest_dl_title: "Disneyland Resort",
        dest_dl_sub: "Anaheim, California",
        dest_dl_desc: "Donde comenzó la magia original de Walt Disney.",
        dest_dcl_title: "Disney Cruise Line",
        dest_dcl_sub: "Alta Mar",
        dest_dcl_desc: "La combinación perfecta entre magia Disney y destinos caribeños paradisíacos.",

        // Testimonials
        test_badge: "Experiencias Reales",
        test_title: "Lo Que Dicen Nuestros Viajeros",
        test_subtitle: "Historias de magia, acompañamiento y momentos inolvidables diseñados por Here We Go Advisor.",

        // Gallery
        gal_badge: "Galería de Momentos",
        gal_title: "Momentos Mágicos",
        gal_subtitle: "Fotografías reales de nuestras familias y clientes disfrutando de la magia Disney.",

        // Blog Section
        blog_badge: "Noticias & Tips",
        blog_title: "Últimas del Blog",
        blog_subtitle: "Consejos, recomendaciones y guías de viaje para aprovechar al máximo tu experiencia.",
        blog_read_time: "min de lectura",
        blog_read_more: "Leer Artículo",

        // Footer
        footer_desc: "Tu asesora experta y certificada en viajes a Walt Disney World, Disneyland y Disney Cruise Line.",
        footer_links: "Enlaces Rápidos",
        footer_contact: "Contacto",
        footer_rights: "Todos los derechos reservados.",
        footer_disclaimer: "Here We Go Advisor es una agencia independiente autorizada. Marcas y elementos © Disney.",

        // About Me Page
        about_title: "¿Quién Soy?",
        about_greeting: "¡Hola! Soy Anna Karen.",
        about_role: "Creadora de Here We Go Advisor y Agente Certificada Disney.",
        about_p1: "Mi amor por Disney comenzó desde pequeña y tuve la oportunidad de trabajar en Walt Disney World a través del programa Disney College Program. Ahí descubrí que lo que más disfruto es organizar, planear y ayudar a que cada familia viva su propia versión de la magia.",
        about_p2: "Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión.",
        about_p3: "Hoy me dedico a diseñar experiencias personalizadas para que tú solamente te preocupes por sonreír y crear recuerdos. Conozco los secretos que hacen la diferencia.",
        about_quote: '"Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión."',

        // Contact Page
        contact_title: "Solicita tu Cotización",
        contact_subtitle: "Completa el formulario y me pondré en contacto contigo a la brevedad para organizar tu viaje perfecto.",
        contact_name: "Nombre Completo",
        contact_email: "Correo Electrónico",
        contact_phone: "Teléfono / WhatsApp",
        contact_dest: "Destino de Interés",
        contact_dates: "Fechas Estimadas",
        contact_travelers: "Número de Viajeros",
        contact_notes: "Detalles o Dudas Especiales",
        contact_submit: "Enviar Solicitud",
        contact_success: "¡Gracias! Tu solicitud ha sido enviada con éxito.",
    },
    en: {
        // Navbar
        nav_destinations: "Destinations",
        nav_about: "About Me",
        nav_services: "My Services",
        nav_blog: "Blog",
        nav_faq: "FAQ",
        nav_resources: "Travel Resources",
        nav_quote: "Get a Quote",

        // Hero Section
        hero_badge: "Certified Disney & Universal Travel Agent",
        hero_title_1: "Experience the Magic",
        hero_title_2: "Stress-Free",
        hero_subtitle: "I design customized itineraries and trips to Walt Disney World, Disneyland, and Disney Cruise Line so you can focus on making memories.",
        hero_cta_primary: "Request a Free Quote",
        hero_cta_secondary: "Explore Magical Destinations",
        hero_stat_clients: "Happy Families",
        hero_stat_cert: "Official Agent",
        hero_stat_support: "1-on-1 Guidance",

        // Destinations Section
        dest_badge: "Magical Destinations",
        dest_title: "Discover Disney Magic",
        dest_subtitle: "Choose your next great adventure across the world's most amazing parks and cruises.",
        dest_view_details: "View Details",
        dest_wdw_title: "Walt Disney World",
        dest_wdw_sub: "Orlando, Florida",
        dest_wdw_desc: "4 theme parks, 2 water parks, and over 30 dream resort hotels.",
        dest_dl_title: "Disneyland Resort",
        dest_dl_sub: "Anaheim, California",
        dest_dl_desc: "Where Walt Disney's original magic began.",
        dest_dcl_title: "Disney Cruise Line",
        dest_dcl_sub: "High Seas",
        dest_dcl_desc: "The perfect blend of Disney magic and paradise Caribbean destinations.",

        // Testimonials
        test_badge: "Real Experiences",
        test_title: "What Our Travelers Say",
        test_subtitle: "Real stories of magic, guidance, and unforgettable moments crafted by Here We Go Advisor.",

        // Gallery
        gal_badge: "Moments Gallery",
        gal_title: "Magical Moments",
        gal_subtitle: "Real photos of our families and guests enjoying Disney magic.",

        // Blog Section
        blog_badge: "News & Tips",
        blog_title: "Latest From Our Blog",
        blog_subtitle: "Expert tips, recommendations, and travel guides to get the most out of your vacation.",
        blog_read_time: "min read",
        blog_read_more: "Read Article",

        // Footer
        footer_desc: "Your certified expert advisor for trips to Walt Disney World, Disneyland, and Disney Cruise Line.",
        footer_links: "Quick Links",
        footer_contact: "Contact",
        footer_rights: "All rights reserved.",
        footer_disclaimer: "Here We Go Advisor is an independent authorized travel planner. Trademarks & elements © Disney.",

        // About Me Page
        about_title: "Who I Am",
        about_greeting: "Hello! I'm Anna Karen.",
        about_role: "Creator of Here We Go Advisor & Certified Disney Specialist.",
        about_p1: "My love for Disney began when I was young, and I had the incredible opportunity to work at Walt Disney World through the Disney College Program. There, I discovered that my passion is organizing, planning, and helping families experience their own magical vacation.",
        about_p2: "Here We Go Advisor was created with a simple mission: magic is best enjoyed when planning doesn't take away your time, energy, or excitement.",
        about_p3: "Today, I dedicate myself to designing customized travel experiences so you only have to smile and create unforgettable memories.",
        about_quote: '"Here We Go Advisor was born with a simple idea: magic is best enjoyed when planning doesn\'t take away your time, energy, or excitement."',

        // Contact Page
        contact_title: "Request Your Quote",
        contact_subtitle: "Fill out the form below and I will get back to you shortly to plan your dream trip.",
        contact_name: "Full Name",
        contact_email: "Email Address",
        contact_phone: "Phone / WhatsApp",
        contact_dest: "Destination of Interest",
        contact_dates: "Estimated Travel Dates",
        contact_travelers: "Number of Guests",
        contact_notes: "Special Requests / Notes",
        contact_submit: "Submit Request",
        contact_success: "Thank you! Your request has been sent successfully.",
    },
    pt: {
        // Navbar
        nav_destinations: "Destinos",
        nav_about: "Sobre mim",
        nav_services: "Meus Serviços",
        nav_blog: "Blog",
        nav_faq: "FAQ",
        nav_resources: "Recursos de Viagem",
        nav_quote: "Solicitar Orçamento",

        // Hero Section
        hero_badge: "Agente Certificada Disney & Universal",
        hero_title_1: "Viva a Magia Sem",
        hero_title_2: "Preocupações",
        hero_subtitle: "Crio itinerários e viagens personalizadas para Walt Disney World, Disneyland e Disney Cruise Line para que você só se preocupe em aproveitar.",
        hero_cta_primary: "Solicitar Orçamento Grátis",
        hero_cta_secondary: "Ver Destinos Mágicos",
        hero_stat_clients: "Famílias Felizes",
        hero_stat_cert: "Agente Oficial",
        hero_stat_support: "Atendimento 1 a 1",

        // Destinations Section
        dest_badge: "Destinos Mágicos",
        dest_title: "Descubra a Magia da Disney",
        dest_subtitle: "Escolha sua próxima grande aventura nos parques e cruzeiros mais incríveis do mundo.",
        dest_view_details: "Ver Detalhes",
        dest_wdw_title: "Walt Disney World",
        dest_wdw_sub: "Orlando, Flórida",
        dest_wdw_desc: "4 parques temáticos, 2 parques aquáticos e mais de 30 hotéis de sonho.",
        dest_dl_title: "Disneyland Resort",
        dest_dl_sub: "Anaheim, Califórnia",
        dest_dl_desc: "Onde a magia original de Walt Disney começou.",
        dest_dcl_title: "Disney Cruise Line",
        dest_dcl_sub: "Alto Mar",
        dest_dcl_desc: "A combinação perfeita entre a magia Disney e destinos caribenhos paradisíacos.",

        // Testimonials
        test_badge: "Experiências Reais",
        test_title: "O Que Dizem Nossos Viajantes",
        test_subtitle: "Histórias de magia, acompanhamento e momentos inesquecíveis criados por Here We Go Advisor.",

        // Gallery
        gal_badge: "Galeria de Momentos",
        gal_title: "Momentos Mágicos",
        gal_subtitle: "Fotos reais de nossas famílias e clientes aproveitando a magia Disney.",

        // Blog Section
        blog_badge: "Notícias & Dicas",
        blog_title: "Últimas do Blog",
        blog_subtitle: "Dicas de especialistas, recomendações e guias para aproveitar sua viagem ao máximo.",
        blog_read_time: "min de leitura",
        blog_read_more: "Ler Artigo",

        // Footer
        footer_desc: "Sua consultora especialista e certificada em viagens para Walt Disney World, Disneyland e Disney Cruise Line.",
        footer_links: "Links Rápidos",
        footer_contact: "Contato",
        footer_rights: "Todos os direitos reservados.",
        footer_disclaimer: "Here We Go Advisor é uma agência independente autorizada. Marcas e elementos © Disney.",

        // About Me Page
        about_title: "Quem Sou Eu",
        about_greeting: "Olá! Sou Anna Karen.",
        about_role: "Criadora da Here We Go Advisor e Especialista Certificada Disney.",
        about_p1: "Meu amor pela Disney começou desde criança e tive a oportunidade incrível de trabalhar no Walt Disney World através do Disney College Program. Lá descobri que minha paixão é organizar, planejar e ajudar famílias a viverem sua própria magia.",
        about_p2: "Here We Go Advisor nasceu com uma missão simples: a magia é melhor aproveitada quando o planejamento não tira seu tempo, energia ou entusiasmo.",
        about_p3: "Hoje me dedico a criar experiências personalizadas para que você só precise sorrir e guardar lembranças inesquecíveis.",
        about_quote: '"Here We Go Advisor nasceu com uma ideia simples: a magia é melhor aproveitada quando o planejamento não tira seu tempo, energia ou entusiasmo."',

        // Contact Page
        contact_title: "Solicite seu Orçamento",
        contact_subtitle: "Preencha o formulário abaixo e entrarei em contato em breve para planejar sua viagem perfeita.",
        contact_name: "Nome Completo",
        contact_email: "E-mail",
        contact_phone: "Telefone / WhatsApp",
        contact_dest: "Destino de Interesse",
        contact_dates: "Datas Estimadas",
        contact_travelers: "Número de Viajantes",
        contact_notes: "Pedidos Especiais / Dúvidas",
        contact_submit: "Enviar Solicitação",
        contact_success: "Obrigado! Sua solicitação foi enviada com sucesso.",
    }
};

export type TranslationKey = keyof typeof translations.es;
