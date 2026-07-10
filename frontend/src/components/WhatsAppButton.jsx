import { useState } from 'react';

const WHATSAPP_NUMBER = '5491100000000';
const DEFAULT_MESSAGE = '¡Hola! Estoy interesado en uno de sus vehículos en Ready 2 Go y me gustaría hacerle una consulta.';

function WhatsAppButton() {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleClick = () => {
        try {
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
            const newWindow = window.open(url, '_blank');

            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                setShowError(true);
                setTimeout(() => setShowError(false), 4000);
            } else {
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 3000);
            }
        } catch (err) {
            setShowError(true);
            setTimeout(() => setShowError(false), 4000);
        }
    };

    return (
        <div className="whatsapp-wrapper">
            {showTooltip && (
                <div className="whatsapp-notification success">
                    <i className="fas fa-check-circle"></i>
                    ¡Redirigiendo a WhatsApp!
                </div>
            )}
            {showError && (
                <div className="whatsapp-notification error">
                    <i className="fas fa-exclamation-circle"></i>
                    No se pudo abrir WhatsApp. Verificá tu conexión o intentá más tarde.
                </div>
            )}
            <button
                className="whatsapp-btn"
                onClick={handleClick}
                title="Consultanos por WhatsApp"
                aria-label="Contactar por WhatsApp"
            >
                <i className="fab fa-whatsapp"></i>
            </button>
        </div>
    );
}

export default WhatsAppButton;