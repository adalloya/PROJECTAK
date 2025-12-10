export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
                <h1 className="text-4xl font-bold tracking-tight mb-8">Política de Privacidad</h1>
                <p className="lead text-xl text-muted-foreground mb-8">
                    Tu privacidad es fundamental para Here We Go Advisor. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Recopilación de Información</h2>
                    <p className="text-muted-foreground mb-4">
                        Recopilamos información necesaria para planificar y reservar tus viajes, incluyendo:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
                        <li>Nombres completos y fechas de nacimiento de los viajeros.</li>
                        <li>Información de contacto (email, teléfono, dirección).</li>
                        <li>Preferencias de viaje y requisitos dietéticos.</li>
                        <li>Información de pago (procesada de forma segura directamente con los proveedores).</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Uso de la Información</h2>
                    <p className="text-muted-foreground mb-4">
                        Utilizamos tus datos exclusivamente para:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 ml-4">
                        <li>Procesar reservas con Disney, Universal u otros proveedores.</li>
                        <li>Crear itinerarios personalizados.</li>
                        <li>Comunicarnos contigo sobre tu viaje.</li>
                        <li>Enviarte ofertas relevantes (solo si has optado por recibirlas).</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Protección de Datos</h2>
                    <p className="text-muted-foreground mb-4">
                        Implementamos medidas de seguridad para proteger tu información personal. No vendemos ni compartimos tus datos con terceros ajenos a la reserva de tu viaje.
                    </p>
                </section>

                <p className="text-sm text-muted-foreground mt-12">
                    Última actualización: {new Date().toLocaleDateString()}
                </p>
            </div>
        </main>
    );
}
