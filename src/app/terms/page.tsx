export default function TermsPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
                <h1 className="text-4xl font-bold tracking-tight mb-8">Términos de Servicio</h1>
                <p className="lead text-xl text-muted-foreground mb-8">
                    Bienvenido a Here We Go Advisor. Al utilizar nuestros servicios de planificación de viajes, aceptas los siguientes términos y condiciones.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Servicios de Planificación</h2>
                    <p className="text-muted-foreground mb-4">
                        Here We Go Advisor actúa como un intermediario entre el cliente y los proveedores de viajes (Disney, Universal, aerolíneas, hoteles, etc.).
                        Nuestros servicios de planificación son gratuitos para el cliente cuando se reserva el paquete de viaje a través de nosotros.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Pagos y Cancelaciones</h2>
                    <p className="text-muted-foreground mb-4">
                        Todos los pagos se procesan directamente a través de los proveedores oficiales (ej. Disney). Here We Go Advisor nunca retiene dinero del cliente para paquetes vacacionales.
                        Las políticas de cancelación y reembolso están sujetas a los términos específicos de cada proveedor, los cuales serán comunicados claramente antes de la reserva.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Responsabilidad</h2>
                    <p className="text-muted-foreground mb-4">
                        No nos hacemos responsables por cambios en itinerarios, cierres de atracciones, clima, o cancelaciones por parte de los proveedores.
                        Recomendamos encarecidamente la compra de un seguro de viaje para proteger tu inversión.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Exactitud de la Información</h2>
                    <p className="text-muted-foreground mb-4">
                        El cliente es responsable de verificar que toda la información en las confirmaciones de reserva (nombres, fechas, edades) sea correcta y coincida con sus documentos de identificación.
                    </p>
                </section>

                <p className="text-sm text-muted-foreground mt-12">
                    Última actualización: {new Date().toLocaleDateString()}
                </p>
            </div>
        </main>
    );
}
