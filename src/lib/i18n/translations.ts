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
        hero_title_1: "Viajes Mágicos.",
        hero_title_2: "Diseñados para Ti.",
        hero_subtitle: "Vive Disney como nunca antes. Itinerarios a medida, planificación sin esfuerzo y recuerdos para toda la vida.",
        hero_cta_primary: "Comienza tu Viaje",
        hero_cta_secondary: "Explorar Destinos",

        // Destinations Section
        dest_badge: "Destinos Exclusivos",
        dest_title: "Descubre la Magia",
        dest_subtitle: "Elige tu próxima aventura de nuestra colección premium.",
        dest_view_details: "Explorar",

        // Testimonials
        test_badge: "Experiencias Reales",
        test_title: "Lo Que Dicen Nuestros Viajeros",
        test_subtitle: "Historias de magia, acompañamiento y momentos inolvidables diseñados por Here We Go Advisor.",

        // Gallery
        gal_badge: "Galería de Momentos",
        gal_title: "Momentos Mágicos",
        gal_subtitle: "Capturando sonrisas y recuerdos que durarán toda la vida. Cada viaje es una historia única.",

        // Blog Section
        blog_badge: "Noticias & Tips",
        blog_title: "Últimas del Blog",
        blog_subtitle: "Consejos, recomendaciones y guías de viaje para aprovechar al máximo tu experiencia.",
        blog_read_time: "min de lectura",
        blog_read_more: "Leer Artículo",

        // Footer
        footer_desc: "El apoyo experto que necesitas. Nosotros nos encargamos de los detalles mientras tú creas los recuerdos.",
        footer_links: "Enlaces Rápidos",
        footer_contact: "Contacto",
        footer_rights: "Todos los derechos reservados.",

        // About Page
        about_title: "¿Quién Soy?",
        about_greeting: "¡Hola! Soy Anna Karen.",
        about_role: "Creadora de Here We Go Advisor y Agente Certificada Disney.",
        about_p1: "Mi amor por Disney comenzó desde pequeña, tuve la oportunidad de trabajar en Walt Disney World a través del programa Disney College Program. Ahí descubrí que lo que más disfruto es organizar, planear y ayudar a que cada familia viva su propia versión de la magia.",
        about_p2: "Hoy me dedico a diseñar experiencias personalizadas para que tú solamente te preocupes por sonreír y crear recuerdos. Conozco los secretos que hacen la diferencia: desde el mejor lugar para ver los fuegos artificiales hasta esos detalles que elevan cualquier itinerario.",
        about_p3: "No solo reservo viajes: transformo tus sueños Disney en momentos inolvidables.",
        about_quote: '"Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión."',
        about_why_title: "¿Por Qué Elegirnos?",
        about_why_1_title: "Concierge Personalizado",
        about_why_1_desc: "Planificación uno a uno con un experto dedicado que aprende las preferencias de tu familia.",
        about_why_2_title: "Arquitectura de Itinerario",
        about_why_2_desc: "Diseñamos tus días para maximizar la magia y minimizar las esperas, a tu propio ritmo.",
        about_why_3_title: "Reservas y Extras",
        about_why_3_desc: "Nos encargamos de las reservas difíciles y experiencias exclusivas, para que tú no tengas que madrugar.",
        about_why_4_title: "Soporte antes y durante tu viaje",
        about_why_4_desc: "Mientras viajas, permanecemos atentos para resolver cualquier contratiempo al instante.",

        // Services Page
        serv_hero_title_1: "Tu Viaje Soñado,",
        serv_hero_title_2: "A Tu Manera",
        serv_hero_sub: "Diseñamos experiencias mágicas personalizadas. Ya sea que necesites el paquete completo o solo nuestra guía experta, estamos aquí para hacer realidad tus sueños.",
        serv_opt1_badge: "Más Popular",
        serv_opt1_title: "Experiencia Completa",
        serv_opt1_desc: "Nos encargamos de ABSOLUTAMENTE todo. Tú solo preocúpate por empacar y disfrutar.",
        serv_opt1_btn: "Cotizar Paquete Completo",
        serv_opt2_title: "Consultoría a la Carta",
        serv_opt2_desc: "¿Ya tienes tus boletos? No te preocupes. Te ayudamos a organizar tu magia para aprovechar al máximo tu visita.",
        serv_opt2_btn: "Solicitar Consultoría",
        serv_feat1_title: "Soporte Continuo",
        serv_feat1_desc: "No estás solo. Te acompañamos antes y durante tu viaje.",
        serv_feat2_title: "Ahorra Tiempo",
        serv_feat2_desc: "Optimizamos tu día para que disfrutes más atracciones.",
        serv_feat3_title: "Expertos Disney",
        serv_feat3_desc: "Conocemos los secretos para hacer tu visita inolvidable.",

        // FAQ Page
        faq_hero_title: "Preguntas Frecuentes",
        faq_hero_sub: "Todo lo que necesitas saber antes de planificar tu aventura mágica.",

        // Contact Page
        contact_title: "Solicita tu Cotización",
        contact_subtitle: "Completa el formulario y me pondré en contacto contigo a la brevedad para organizar tu viaje perfecto.",

        // Resource Center
        res_title: "Centro de Recursos",
        res_sub: "Ingresa tu código PIN de 4 dígitos para acceder a tus guías de viaje",
        res_clear: "Limpiar",
        res_back: "Volver al sitio principal",
        res_validating: "Validando acceso...",
        res_err_disabled: "El acceso al centro de recursos está desactivado por el administrador.",
        res_err_invalid: "Código PIN incorrecto o acceso no habilitado.",
        res_welcome: "¡Hola,",
        res_welcome_sub: "¡Bienvenido a tu centro de recursos mágico! Aquí encontrarás guías personalizadas y esenciales para tu aventura.",
        res_logout: "Cerrar Sesión",
        res_dest: "Destino",
        res_dates: "Fechas de Viaje",
        res_passengers: "Pasajeros",
        res_booking: "Clave de Reserva",
        res_no_access: "Secciones no activadas",
        res_no_access_sub: "El administrador aún no ha habilitado ninguna sección de recursos para tu cuenta.",
        res_contact_agent: "Contactar Asesor",
        res_pdf_view: "Guía en PDF • Haz clic para abrir",
        res_coming_soon: "Próximamente disponible",
    },
    en: {
        // Navbar
        nav_destinations: "Destinations",
        nav_about: "About Me",
        nav_services: "My Services",
        nav_blog: "Blog",
        nav_faq: "FAQ",
        nav_resources: "Resources",
        nav_quote: "Get a Quote",

        // Hero Section
        hero_badge: "Certified Disney & Universal Travel Specialist",
        hero_title_1: "Magical Vacations.",
        hero_title_2: "Tailored for You.",
        hero_subtitle: "Experience Disney like never before. Custom itineraries, effortless planning, and memories to last a lifetime.",
        hero_cta_primary: "Start Your Journey",
        hero_cta_secondary: "Explore Destinations",

        // Destinations Section
        dest_badge: "Exclusive Destinations",
        dest_title: "Discover the Magic",
        dest_subtitle: "Choose your next adventure from our premium collection.",
        dest_view_details: "Explore",

        // Testimonials
        test_badge: "Real Experiences",
        test_title: "What Our Travelers Say",
        test_subtitle: "Real stories of magic, guidance, and unforgettable moments crafted by Here We Go Advisor.",

        // Gallery
        gal_badge: "Moments Gallery",
        gal_title: "Magical Moments",
        gal_subtitle: "Capturing smiles and memories that will last a lifetime. Every trip is a unique story.",

        // Blog Section
        blog_badge: "News & Tips",
        blog_title: "Latest From Our Blog",
        blog_subtitle: "Expert advice, recommendations, and travel guides to maximize your experience.",
        blog_read_time: "min read",
        blog_read_more: "Read Article",

        // Footer
        footer_desc: "The expert support you need. We handle all the details while you create memories.",
        footer_links: "Quick Links",
        footer_contact: "Contact",
        footer_rights: "All rights reserved.",

        // About Page
        about_title: "Who I Am",
        about_greeting: "Hello! I'm Anna Karen.",
        about_role: "Creator of Here We Go Advisor & Certified Disney Specialist.",
        about_p1: "My love for Disney began when I was young, and I had the opportunity to work at Walt Disney World through the Disney College Program. There I discovered that what I enjoy most is organizing, planning, and helping every family experience their own magic.",
        about_p2: "Today I dedicate myself to designing customized travel experiences so you only have to smile and make memories. I know the secrets that make all the difference: from the best fireworks spot to subtle touches that elevate any itinerary.",
        about_p3: "I don't just book trips: I transform your Disney dreams into unforgettable moments.",
        about_quote: '"Here We Go Advisor was born with a simple idea: magic is best enjoyed when planning doesn\'t take away your time, energy, or excitement."',
        about_why_title: "Why Choose Us?",
        about_why_1_title: "Personalized Concierge",
        about_why_1_desc: "1-on-1 planning with a dedicated expert who understands your family's preferences.",
        about_why_2_title: "Itinerary Architecture",
        about_why_2_desc: "We structure your days to maximize magic and minimize waits, at your own pace.",
        about_why_3_title: "Dining & Experiences",
        about_why_3_desc: "We secure hard-to-get reservations and exclusive experiences so you don't have to wake up at dawn.",
        about_why_4_title: "Pre & On-Trip Support",
        about_why_4_desc: "While you travel, we stay on call to instantly resolve any hiccups.",

        // Services Page
        serv_hero_title_1: "Your Dream Vacation,",
        serv_hero_title_2: "Your Way",
        serv_hero_sub: "We design personalized magical experiences. Whether you need a full package or expert guidance, we're here to bring your dreams to life.",
        serv_opt1_badge: "Most Popular",
        serv_opt1_title: "Full Package Experience",
        serv_opt1_desc: "We handle ABSOLUTELY everything. You just focus on packing and having fun.",
        serv_opt1_btn: "Get Full Package Quote",
        serv_opt2_title: "A La Carte Consulting",
        serv_opt2_desc: "Already got your tickets? No worries! We help structure your days to get the most out of your visit.",
        serv_opt2_btn: "Request Consulting",
        serv_feat1_title: "Continuous Support",
        serv_feat1_desc: "You are not alone. We accompany you before and during your trip.",
        serv_feat2_title: "Save Precious Time",
        serv_feat2_desc: "We optimize your days so you enjoy more rides with less waiting.",
        serv_feat3_title: "Disney Insiders",
        serv_feat3_desc: "We know the insider secrets that turn good trips into unforgettable ones.",

        // FAQ Page
        faq_hero_title: "Frequently Asked Questions",
        faq_hero_sub: "Everything you need to know before planning your magical adventure.",

        // Contact Page
        contact_title: "Get Your Quote",
        contact_subtitle: "Fill out the form below and I will get back to you shortly to plan your perfect vacation.",

        // Resource Center
        res_title: "Resource Center",
        res_sub: "Enter your 4-digit PIN code to access your travel guides",
        res_clear: "Clear",
        res_back: "Back to main site",
        res_validating: "Validating access...",
        res_err_disabled: "Resource center access is disabled by the administrator.",
        res_err_invalid: "Incorrect PIN code or access not enabled.",
        res_welcome: "Hello,",
        res_welcome_sub: "Welcome to your magical resource center! Here you will find essential personalized guides for your adventure.",
        res_logout: "Log Out",
        res_dest: "Destination",
        res_dates: "Travel Dates",
        res_passengers: "Guests",
        res_booking: "Booking Ref",
        res_no_access: "Sections not enabled",
        res_no_access_sub: "The administrator has not yet enabled any resource sections for your account.",
        res_contact_agent: "Contact Advisor",
        res_pdf_view: "PDF Guide • Click to open",
        res_coming_soon: "Coming soon",
    },
    pt: {
        // Navbar
        nav_destinations: "Destinos",
        nav_about: "Sobre mim",
        nav_services: "Meus Serviços",
        nav_blog: "Blog",
        nav_faq: "FAQ",
        nav_resources: "Recursos",
        nav_quote: "Solicitar Orçamento",

        // Hero Section
        hero_badge: "Especialista Certificada Disney & Universal",
        hero_title_1: "Viagens Mágicas.",
        hero_title_2: "Criadas Para Você.",
        hero_subtitle: "Viva a Disney como nunca antes. Roteiros personalizados, planejamento sem esforço e memórias inesquecíveis.",
        hero_cta_primary: "Comece Sua Viagem",
        hero_cta_secondary: "Explorar Destinos",

        // Destinations Section
        dest_badge: "Destinos Exclusivos",
        dest_title: "Descubra a Magia",
        dest_subtitle: "Escolha sua próxima aventura em nossa coleção premium.",
        dest_view_details: "Explorar",

        // Testimonials
        test_badge: "Experiências Reais",
        test_title: "O Que Dizem Nossos Viajantes",
        test_subtitle: "Histórias de magia, acompanhamento e momentos inesquecíveis criados por Here We Go Advisor.",

        // Gallery
        gal_badge: "Galeria de Momentos",
        gal_title: "Momentos Mágicos",
        gal_subtitle: "Registrando sorrisos e memórias para a vida toda. Cada viagem é uma história única.",

        // Blog Section
        blog_badge: "Notícias & Dicas",
        blog_title: "Últimas do Blog",
        blog_subtitle: "Dicas de especialistas, recomendações e guias para aproveitar sua viagem ao máximo.",
        blog_read_time: "min de leitura",
        blog_read_more: "Ler Artigo",

        // Footer
        footer_desc: "O suporte especializado que você precisa. Cuidamos dos detalhes enquanto você cria memórias.",
        footer_links: "Links Rápidos",
        footer_contact: "Contato",
        footer_rights: "Todos os direitos reservados.",

        // About Page
        about_title: "Quem Sou Eu",
        about_greeting: "Olá! Sou Anna Karen.",
        about_role: "Criadora da Here We Go Advisor e Especialista Certificada Disney.",
        about_p1: "Meu amor pela Disney começou desde criança e tive a oportunidade de trabalhar no Walt Disney World através do Disney College Program. Lá descobri que minha grande paixão é organizar e ajudar famílias a viverem sua própria magia.",
        about_p2: "Hoje me dedico a criar experiências personalizadas para que você só precise sorrir e guardar lembranças inesquecíveis.",
        about_p3: "Não apenas reservo viagens: transformo seus sonhos Disney em momentos mágicos.",
        about_quote: '"Here We Go Advisor nasceu com uma ideia simples: a magia é melhor aproveitada quando o planejamento não tira seu tempo, energia ou entusiasmo."',
        about_why_title: "Por Que Nos Escolher?",
        about_why_1_title: "Concierge Personalizado",
        about_why_1_desc: "Planejamento 1 a 1 com um especialista dedicado que aprende as preferências da sua família.",
        about_why_2_title: "Arquitetura de Roteiro",
        about_why_2_desc: "Desenhamos seus dias para maximizar a magia e minimizar filas, no seu ritmo.",
        about_why_3_title: "Reservas e Experiências",
        about_why_3_desc: "Cuidamos de reservas concorridas e experiências exclusivas para você não precisar madrugar.",
        about_why_4_title: "Suporte Antes e Durante",
        about_why_4_desc: "Durante sua viagem, ficamos a postos para resolver qualquer imprevisto instantaneamente.",

        // Services Page
        serv_hero_title_1: "Sua Viagem dos Sonhos,",
        serv_hero_title_2: "Do Seu Jeito",
        serv_hero_sub: "Desenhamos experiências mágicas personalizadas. Se você precisa do pacote completo ou apenas de nossa consultoria especializada, estamos aqui.",
        serv_opt1_badge: "Mais Popular",
        serv_opt1_title: "Experiência Completa",
        serv_opt1_desc: "Cuidamos de ABSOLUTAMENTE tudo. Você só precisa arrumar as malas e aproveitar.",
        serv_opt1_btn: "Orçamento Pacote Completo",
        serv_opt2_title: "Consultoria Personalizada",
        serv_opt2_desc: "Já comprou seus ingressos? Sem problemas! Ajudamos a organizar seus dias para aproveitar ao máximo.",
        serv_opt2_btn: "Solicitar Consultoria",
        serv_feat1_title: "Suporte Contínuo",
        serv_feat1_desc: "Você não está sozinho. Acompanhamos você antes e durante sua viagem.",
        serv_feat2_title: "Economize Tempo",
        serv_feat2_desc: "Otimizamos seu dia para curtir mais atrações sem filas.",
        serv_feat3_title: "Especialistas Disney",
        serv_feat3_desc: "Conhecemos os segredos para tornar sua visita inesquecível.",

        // FAQ Page
        faq_hero_title: "Perguntas Frecuentes",
        faq_hero_sub: "Tudo o que você precisa saber antes de planejar sua aventura mágica.",

        // Contact Page
        contact_title: "Solicite seu Orçamento",
        contact_subtitle: "Preencha o formulário abaixo e entrarei em contato em breve para planejar sua viagem perfeita.",

        // Resource Center
        res_title: "Centro de Recursos",
        res_sub: "Insira seu código PIN de 4 dígitos para acessar seus guias de viagem",
        res_clear: "Limpar",
        res_back: "Voltar ao site principal",
        res_validating: "Validando acesso...",
        res_err_disabled: "O acesso ao centro de recursos está desativado pelo administrador.",
        res_err_invalid: "Código PIN incorreto ou acesso não habilitado.",
        res_welcome: "Olá,",
        res_welcome_sub: "Bem-vindo ao seu centro de recursos mágico! Aqui você encontrará guias personalizados e essenciais para sua aventura.",
        res_logout: "Sair",
        res_dest: "Destino",
        res_dates: "Datas de Viagem",
        res_passengers: "Passageiros",
        res_booking: "Código de Reserva",
        res_no_access: "Seções não ativadas",
        res_no_access_sub: "O administrador ainda não ativou nenhuma seção de recursos para sua conta.",
        res_contact_agent: "Contatar Consultor",
        res_pdf_view: "Guia em PDF • Clique para abrir",
        res_coming_soon: "Em breve",
    }
};

export type TranslationKey = keyof typeof translations.es;
