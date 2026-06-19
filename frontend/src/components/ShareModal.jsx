import { useState } from 'react';

function ShareModal({ product, onClose }) {
    const [customMessage, setCustomMessage] = useState('');
    const [copiedInstagram, setCopiedInstagram] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const productUrl = `${window.location.origin}/product/${product.id}`;
    const productImage = product.images?.[0] || '';
    const defaultMessage = `¡Mirá este vehículo en Ready 2 Go: ${product.name}!`;
    const messageToShare = customMessage.trim() || defaultMessage;

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(messageToShare)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messageToShare)}&url=${encodeURIComponent(productUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(messageToShare + ' ' + productUrl)}`
    };

    const handleShare = (network) => {
        window.open(shareLinks[network], '_blank', 'width=600,height=400');
    };

    const handleInstagram = () => {
        navigator.clipboard.writeText(productUrl);
        setCopiedInstagram(true);
        setTimeout(() => setCopiedInstagram(false), 3000);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(productUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
    };

    return (
        <div className="share-overlay" onClick={onClose}>
            <div className="share-modal" onClick={e => e.stopPropagation()}>

                <div className="share-modal-header">
                    <h3><i className="fas fa-share-alt"></i> Compartir vehículo</h3>
                    <button className="share-close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="share-product-preview">
                    <img
                        src={productImage || 'https://placehold.co/80x80?text=Sin+imagen'}
                        alt={product.name}
                        className="share-product-image"
                        onError={(e) => {
                            if (e.target.dataset.errored) return;
                            e.target.dataset.errored = 'true';
                            e.target.src = 'https://placehold.co/80x80?text=Sin+imagen';
                        }}
                    />
                    <div className="share-product-info">
                        <h4>{product.name}</h4>
                        {product.category && (
                            <span className="category-badge">{product.category.name}</span>
                        )}
                        <p>{product.description?.substring(0, 80)}...</p>
                        <a href={productUrl} target="_blank" rel="noreferrer" className="share-product-link">
                            <i className="fas fa-link"></i> {productUrl}
                        </a>
                    </div>
                </div>

                <div className="share-message-group">
                    <label>Mensaje personalizado (opcional)</label>
                    <textarea
                        className="share-message-input"
                        placeholder={defaultMessage}
                        value={customMessage}
                        onChange={e => setCustomMessage(e.target.value)}
                        rows={3}
                        maxLength={280}
                    />
                    <span className="share-char-count">{customMessage.length}/280</span>
                </div>

                <div className="share-networks">
                    <button className="share-network-btn facebook" onClick={() => handleShare('facebook')}>
                        <i className="fab fa-facebook-f"></i>
                        <span>Facebook</span>
                    </button>

                    <button className="share-network-btn twitter" onClick={() => handleShare('twitter')}>
                        <i className="fab fa-x-twitter"></i>
                        <span>Twitter / X</span>
                    </button>

                    <button className="share-network-btn whatsapp" onClick={() => handleShare('whatsapp')}>
                        <i className="fab fa-whatsapp"></i>
                        <span>WhatsApp</span>
                    </button>

                    <button className="share-network-btn instagram" onClick={handleInstagram}>
                        <i className="fab fa-instagram"></i>
                        <span>{copiedInstagram ? '¡Enlace copiado!' : 'Instagram'}</span>
                    </button>
                </div>

                <button className="share-copy-link-btn" onClick={handleCopyLink}>
                    <i className={`fas ${copiedLink ? 'fa-check' : 'fa-copy'}`}></i>
                    {copiedLink ? '¡Enlace copiado!' : 'Copiar enlace'}
                </button>

            </div>
        </div>
    );
}

export default ShareModal;