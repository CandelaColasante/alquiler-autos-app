import { useState } from 'react';

const policies = [
    {
        id: 1,
        title: 'Cancelación y reembolsos',
        description: 'Las cancelaciones realizadas con más de 48 horas de anticipación recibirán un reembolso completo. Cancelaciones tardías pueden estar sujetas a cargos parciales.'
    },
    {
        id: 2,
        title: 'Uso del vehículo',
        description: 'El vehículo debe utilizarse únicamente para los fines acordados. Está prohibido el uso fuera de ruta, transporte de mercancías o actividades ilegales.'
    },
    {
        id: 3,
        title: 'Documentación requerida',
        description: 'El conductor debe presentar licencia de conducir vigente, DNI y tarjeta de crédito a nombre del titular de la reserva al momento de retirar el vehículo.'
    },
    {
        id: 4,
        title: 'Combustible',
        description: 'El vehículo se entrega con el tanque lleno y debe devolverse en las mismas condiciones. De lo contrario, se aplicará un cargo adicional por reposición.'
    },
    {
        id: 5,
        title: 'Daños y seguros',
        description: 'El cliente es responsable de los daños ocasionados durante el período de alquiler. Se recomienda contratar el seguro adicional disponible al momento de la reserva.'
    },
    {
        id: 6,
        title: 'Conducción',
        description: 'Solo el conductor registrado en la reserva está autorizado a manejar el vehículo. Conducir bajo los efectos del alcohol o sustancias está estrictamente prohibido.'
    }
];

function ProductPolicies() {
    const [showPolicies, setShowPolicies] = useState(false);

    return (
        <div className="availability-container">
            <div className="availability-header" onClick={() => setShowPolicies(!showPolicies)}>
                <h3>Políticas del producto</h3>
                <span className="availability-toggle">{showPolicies ? '▲' : '▼'}</span>
            </div>

            {showPolicies && (
                <div className="availability-calendar">
                    <div className="policies-grid">
                        {policies.map(policy => (
                            <div key={policy.id} className="policy-item">
                                <h4 className="policy-item-title">
                                    <i className="fas fa-check-circle"></i>
                                    {policy.title}
                                </h4>
                                <p className="policy-item-description">{policy.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductPolicies;