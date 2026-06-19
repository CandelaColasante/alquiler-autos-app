import { useState, useEffect } from 'react';
import { getProductReviews, getReviewStats, canUserReview, createReview } from '../services/api';

function StarRating({ rating, size = 16, interactive = false, onChange = null }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <i
                    key={star}
                    className={`fas fa-star ${(hover || rating) >= star ? 'star-filled' : 'star-empty'}`}
                    style={{ fontSize: size, cursor: interactive ? 'pointer' : 'default' }}
                    onClick={() => interactive && onChange(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                ></i>
            ))}
        </div>
    );
}

function ProductReviews({ productId, user }) {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ average: 0, count: 0 });
    const [canReview, setCanReview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [reviewsData, statsData] = await Promise.all([
                getProductReviews(productId),
                getReviewStats(productId)
            ]);
            setReviews(reviewsData);
            setStats(statsData);

            if (user) {
                const allowed = await canUserReview(productId, user.id);
                setCanReview(allowed);
            }
        } catch (err) {
            setError('No se pudieron cargar las valoraciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [productId, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newRating === 0) {
            setSubmitError('Seleccioná una puntuación.');
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        try {
            await createReview(productId, {
                userId: user.id,
                rating: newRating,
                comment: newComment.trim() || null
            });
            setNewRating(0);
            setNewComment('');
            setCanReview(false);
            await loadData();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="reviews-container">
            <div className="reviews-header">
                <h3>Valoraciones y reseñas</h3>
                <div className="reviews-summary">
                    <span className="reviews-average">{stats.average?.toFixed(1) || '0.0'}</span>
                    <StarRating rating={Math.round(stats.average)} size={18} />
                    <span className="reviews-count">({stats.count} valoración{stats.count !== 1 ? 'es' : ''})</span>
                </div>
            </div>

            {loading && <p className="reviews-loading">Cargando valoraciones...</p>}

            {error && !loading && (
                <div className="availability-error">
                    <p>⚠️ {error}</p>
                    <button onClick={loadData} className="retry-btn">Reintentar</button>
                </div>
            )}

            {!loading && !error && (
                <>
                    {user && canReview && (
                        <form className="review-form" onSubmit={handleSubmit}>
                            <h4>Dejá tu valoración</h4>
                            <StarRating rating={newRating} size={28} interactive={true} onChange={setNewRating} />
                            <textarea
                                className="review-comment-input"
                                placeholder="Contanos tu experiencia (opcional)"
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                rows={3}
                                maxLength={500}
                            />
                            {submitError && <p className="review-submit-error">{submitError}</p>}
                            <button type="submit" className="btn" disabled={submitting}>
                                {submitting ? 'Enviando...' : 'Publicar reseña'}
                            </button>
                        </form>
                    )}

                    {user && !canReview && (
                        <p className="review-info-message">
                            <i className="fas fa-info-circle"></i> Solo los usuarios que alquilaron y finalizaron una reserva de este vehículo pueden dejar una reseña.
                        </p>
                    )}

                    {!user && (
                        <p className="review-info-message">
                            <i className="fas fa-info-circle"></i> Iniciá sesión para dejar tu valoración.
                        </p>
                    )}

                    <div className="reviews-list">
                        {reviews.length === 0 && (
                            <p className="no-reviews">Este producto todavía no tiene valoraciones.</p>
                        )}

                        {reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-item-header">
                                    <div className="review-user-info">
                                        <span className="review-user-name">{review.userName}</span>
                                        <span className="review-date">{formatDate(review.createdAt)}</span>
                                    </div>
                                    <StarRating rating={review.rating} size={16} />
                                </div>
                                {review.comment && (
                                    <p className="review-comment">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductReviews;