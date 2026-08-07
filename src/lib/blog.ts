export interface LocalizedBlogPost {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    date: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    image: string;
    category: string;
    translations?: {
        es?: Partial<LocalizedBlogPost>;
        en?: Partial<LocalizedBlogPost>;
        pt?: Partial<LocalizedBlogPost>;
    };
}

export function getLocalizedBlogPost(post: BlogPost, lang: 'es' | 'en' | 'pt'): BlogPost {
    if (!post.translations || !post.translations[lang]) {
        return post;
    }
    const loc = post.translations[lang]!;
    return {
        ...post,
        title: loc.title || post.title,
        excerpt: loc.excerpt || post.excerpt,
        content: loc.content || post.content,
        category: loc.category || post.category,
        readTime: loc.readTime || post.readTime,
        date: loc.date || post.date,
    };
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
                <li><strong>Huéspedes de Hoteles Disney:</strong> Pueden reservar sus pases con hasta <strong>7 días de anticipación</strong> a su check-in.</li>
                <li><strong>Visitantes Generales:</strong> Pueden reservar con <strong>3 días de anticipación</strong> a su visita al parque.</li>
            </ul>

            <h3>Single Pass vs. Multi Pass</h3>
            <p>Al igual que antes, las atracciones más populares (como <em>Star Wars: Rise of the Resistance</em> o <em>TRON Lightcycle / Run</em>) no suelen estar incluidas en el Multi Pass y se venden por separado como <strong>Lightning Lane Single Pass</strong>.</p>
        `,
        translations: {
            en: {
                title: "Ultimate Lightning Lane Guide: Multi Pass & Single Pass",
                excerpt: "Genie+ has evolved. Learn how to master the new Lightning Lane Multi Pass system to pre-book your favorite rides before arriving at the parks.",
                readTime: "6 min read",
                category: "Expert Tips",
                content: `
                    <p>Goodbye Genie+, hello Lightning Lane Multi Pass! Disney has updated its skip-the-line system with major perks for planners.</p>
                    
                    <h3>What is Lightning Lane Multi Pass?</h3>
                    <p>It's the new service replacing Genie+. The main difference: <strong>now you can pre-book 3 attractions BEFORE your trip</strong>. No more waking up at 7:00 AM every vacation morning stressed to secure a spot.</p>

                    <h3>Advance Booking Rules</h3>
                    <ul>
                        <li><strong>Disney Resort Hotel Guests:</strong> Can book passes up to <strong>7 days in advance</strong> of check-in.</li>
                        <li><strong>General Visitors:</strong> Can book <strong>3 days in advance</strong> of their park visit.</li>
                    </ul>

                    <h3>Single Pass vs. Multi Pass</h3>
                    <p>Top attractions (like <em>Star Wars: Rise of the Resistance</em> or <em>TRON Lightcycle / Run</em>) are sold separately as <strong>Lightning Lane Single Pass</strong>.</p>
                `
            },
            pt: {
                title: "Guia Definitivo do Lightning Lane: Multi Pass e Single Pass",
                excerpt: "Genie+ evoluiu. Aprenda a dominar o novo sistema Lightning Lane Multi Pass para reservar suas atrações favoritas antes de chegar aos parques.",
                readTime: "6 min de leitura",
                category: "Dicas de Especialistas",
                content: `
                    <p>Adeus Genie+, olá Lightning Lane Multi Pass! A Disney renovou seu sistema de filas rápidas com grandes vantagens para quem gosta de planejar.</p>
                    
                    <h3>O que é o Lightning Lane Multi Pass?</h3>
                    <p>É o novo serviço que substitui o Genie+. A grande diferença: <strong>agora você pode reservar 3 atrações ANTES da sua viagem</strong>. Não precisa mais acordar às 7:00 da manhã nas férias estressado para garantir um lugar.</p>

                    <h3>Regras de Reserva Antecipada</h3>
                    <ul>
                        <li><strong>Hóspedes dos Hotéis Disney:</strong> Podem reservar com até <strong>7 dias de antecedência</strong> do check-in.</li>
                        <li><strong>Visitantes Gerais:</strong> Podem reservar com <strong>3 dias de antecedência</strong> da visita ao parque.</li>
                    </ul>
                `
            }
        }
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
                <li><strong>Transporte Gratuito:</strong> Buses, monorriel, barcos y Skyliner te llevan gratis.</li>
                <li><strong>Early Entry:</strong> Entras a cualquier parque 30 minutos antes.</li>
            </ul>
        `,
        translations: {
            en: {
                title: "Disney Hotel vs. Off-Site: The Truth About Your Budget",
                excerpt: "Is staying at a Disney hotel worth the extra cost? We analyze hidden expenses and perks so you make the best decision.",
                readTime: "7 min read",
                category: "Planning",
                content: `
                    <p>This is the ultimate question. At first glance, off-site hotels seem much cheaper, but hidden costs like parking and Ubers add up fast.</p>

                    <h3>Exclusive Disney Hotel Benefits</h3>
                    <ul>
                        <li><strong>Free Transportation:</strong> Buses, monorail, boats, and Skyliner get you everywhere for free.</li>
                        <li><strong>Early Entry:</strong> Enter any park 30 minutes early every day.</li>
                    </ul>
                `
            },
            pt: {
                title: "Hotel Disney ou Externo? A Verdade Sobre Seu Orçamento",
                excerpt: "Vale a pena pagar mais por um hotel dentro da Disney? Analisamos custos ocultos e benefícios reais.",
                readTime: "7 min de leitura",
                category: "Planejamento",
                content: `
                    <p>Essa é a pergunta de ouro. À primeira vista, um hotel fora da Disney parece mais barato. Mas com custos de transporte e estacionamento, a balança muda.</p>

                    <h3>Benefícios Exclusivos dos Hotéis Disney</h3>
                    <ul>
                        <li><strong>Transporte Gratuito:</strong> Ônibus, monotrilho, barcos e Skyliner gratuitos.</li>
                        <li><strong>Entrada Antecipada:</strong> Entre em qualquer parque 30 minutos antes.</li>
                    </ul>
                `
            }
        }
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
                <li><strong>No comprar Lightning Lane con anticipación.</strong></li>
                <li><strong>Querer hacerlo todo sin descansar.</strong></li>
                <li><strong>Ignorar el clima y no llevar calzado cómodo.</strong></li>
            </ol>
        `,
        translations: {
            en: {
                title: "10 Common Mistakes When Planning Your First Disney Trip",
                excerpt: "Avoid beginner traps that ruin vacations. From uncomfortable shoes to packed schedules, here is what NOT to do.",
                readTime: "6 min read",
                category: "Basic Guides",
                content: `
                    <p>We've seen many families return exhausted from improper planning. Here are the biggest mistakes:</p>
                    <ol>
                        <li><strong>Not pre-booking Lightning Lane passes.</strong></li>
                        <li><strong>Trying to do everything without breaks.</strong></li>
                        <li><strong>Ignoring Florida weather and wearing bad shoes.</strong></li>
                    </ol>
                `
            },
            pt: {
                title: "10 Erros Comuns ao Planejar Sua Primeira Viagem à Disney",
                excerpt: "Evite armadilhas de iniciantes que estragam as férias. De sapatos desconfortáveis a horários impossíveis.",
                readTime: "6 min de leitura",
                category: "Guias Básicos",
                content: `
                    <p>Vimos muitas famílias exaustas por falta de planejamento. Aqui estão os piores erros:</p>
                    <ol>
                        <li><strong>Não reservar o Lightning Lane com antecedência.</strong></li>
                        <li><strong>Tentar fazer tudo sem descansar.</strong></li>
                        <li><strong>Ignorar o clima e usar sapatos ruins.</strong></li>
                    </ol>
                `
            }
        }
    },
    {
        id: "4",
        slug: "universal-vs-disney",
        title: "Universal vs. Disney: ¿Cuál es Mejor para tu Familia?",
        excerpt: "¿Harry Potter o Star Wars? ¿Montañas rusas extremas o magia clásica? Te ayudamos a decidir qué destino se adapta mejor a tu grupo.",
        date: "01 Dic, 2025",
        readTime: "4 min de lectura",
        image: "/blog/universal-vs-disney.png",
        category: "Comparativas",
        content: `
            <p>Ambos son increíbles, pero ofrecen experiencias muy diferentes. Elegir el incorrecto para la edad de tus hijos puede ser un error costoso.</p>
        `,
        translations: {
            en: {
                title: "Universal vs. Disney: Which is Best for Your Family?",
                excerpt: "Harry Potter or Star Wars? Thrill rides or classic magic? We help you pick the best destination for your group.",
                readTime: "4 min read",
                category: "Comparisons",
                content: `
                    <p>Both are incredible, but offer unique experiences. Choosing the right one for your kids' ages makes all the difference.</p>
                `
            },
            pt: {
                title: "Universal vs. Disney: Qual é o Melhor para Sua Família?",
                excerpt: "Harry Potter ou Star Wars? Montanhas-russas radicais ou magia clássica? Ajudamos a escolher o melhor destino.",
                readTime: "4 min de leitura",
                category: "Comparações",
                content: `
                    <p>Ambos são incríveis, mas oferecem experiências muito diferentes. Escolher o melhor destino para a idade das suas crianças faz toda a diferença.</p>
                `
            }
        }
    }
];
