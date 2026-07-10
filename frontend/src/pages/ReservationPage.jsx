import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { getProductById, createReservation } from '../services/api';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function ReservationPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fechasOcupadas, setFechasOcupadas] = useState([]);
    const [dateRange, setDateRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }]);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productData, availabilityData] = await Promise.all([
                getProductById(id),
                fetch(`http://localhost:8080/api/products/${id}/availability`)
                    .then(r => r.json())
            ]);
            setProduct(productData);
            setFechasOcupadas(availabilityData);
        } catch (err) {
            setError('No se pudo cargar la información del producto.');
        } finally {
            setLoading(false);
        }
    };

    const disabledDatesArray = fechasOcupadas.map(d => {
        const [year, month, day] = d.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const start = dateRange[0].startDate;
        const end = dateRange[0].endDate;

        if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
            setError('Debés seleccionar un rango de fechas válido.');
            return;
        }

        setSubmitting(true);
        try {
            await createReservation(id, {
                userId: user.id,
                startDate: format(start, 'yyyy-MM-dd'),
                endDate: format(end, 'yyyy-MM-dd'),
                notes: notes.trim() || null
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="main-with-padding"><p>Cargando...</p></div>;

    if (success) {
        return (
            <div className="main-with-padding">
                <div className="reservation-success">
                    <i className="fas fa-check-circle"></i>
                    <h2>¡Reserva confirmada!</h2>
                    <p>
                        Reservaste <strong>{product?.name}</strong> del{' '}
                        <strong>{format(dateRange[0].startDate, 'dd/MM/yyyy')}</strong> al{' '}
                        <strong>{format(dateRange[0].endDate, 'dd/MM/yyyy')}</strong>.
                    </p>
                    {notes && (
                        <p><strong>Comentarios:</strong> {notes}</p>
                    )}
                    <div className="reservation-success-buttons">
                        <button className="btn" onClick={() => navigate('/')}>
                            Volver al inicio
                        </button>
                        <button className="btn-cancel" onClick={() => navigate(`/product/${id}`)}>
                            Ver producto
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="reservation-page">

                <div className="reservation-header">
                    <button className="back-btn" onClick={() => navigate(`/product/${id}`)}>
                        ← Volver al producto
                    </button>
                    <h1>Reservar vehículo</h1>
                </div>

                <div className="reservation-content">

                    <div className="reservation-product-card">
                        <img
                            src={product?.images?.[0] || 'https://placehold.co/200x130?text=Sin+imagen'}
                            alt={product?.name}
                            className="reservation-product-image"
                            onError={(e) => {
                                if (e.target.dataset.errored) return;
                                e.target.dataset.errored = 'true';
                                e.target.src = 'https://placehold.co/200x130?text=Sin+imagen';
                            }}
                        />
                        <div className="reservation-product-info">
                            <h2>{product?.name}</h2>
                            {product?.category && (
                                <span className="category-badge">{product.category.name}</span>
                            )}
                            <p>{product?.description?.substring(0, 100)}...</p>
                            {product?.features && product.features.length > 0 && (
                                <div className="reservation-features">
                                    {product.features.map(feature => (
                                        <div key={feature.id} className="feature-tag">
                                            <i className={`fas ${feature.icon}`}></i>
                                            {feature.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <form className="reservation-form" onSubmit={handleSubmit}>
                        <h3>Seleccioná las fechas</h3>

                        <div className="reservation-dates-display">
                            <div className="reservation-date-item">
                                <label>Fecha de inicio</label>
                                <span>{format(dateRange[0].startDate, 'dd/MM/yyyy')}</span>
                            </div>
                            <i className="fas fa-arrow-right"></i>
                            <div className="reservation-date-item">
                                <label>Fecha de fin</label>
                                <span>{format(dateRange[0].endDate, 'dd/MM/yyyy')}</span>
                            </div>
                        </div>

                        <div className="reservation-calendar">
                            <DateRange
                                ranges={dateRange}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                locale={es}
                                months={2}
                                direction="horizontal"
                                rangeColors={['#eb5200']}
                                disabledDates={disabledDatesArray}
                                minDate={new Date()}
                            />
                        </div>

                        <div className="availability-legend">
                            <div className="legend-item">
                                <div className="legend-color available"></div>
                                <span>Fecha disponible</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color occupied"></div>
                                <span>Fecha ocupada</span>
                            </div>
                        </div>

                        <div className="reservation-user-info">
                            <i className="fas fa-user"></i>
                            <div className="reservation-user-details">
                                <span><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</span>
                                <span><strong>Email:</strong> {user?.email}</span>
                            </div>
                        </div>

                        <div className="reservation-notes">
                            <label>
                                Comentarios adicionales{' '}
                                <span className="optional-label">(opcional)</span>
                            </label>
                            <textarea
                                className="review-comment-input"
                                placeholder="¿Alguna solicitud especial? (ej: necesito el auto con silla para bebé, entrega en aeropuerto, etc.)"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={3}
                                maxLength={500}
                            />
                            <span className="share-char-count">{notes.length}/500</span>
                        </div>

                        {error && (
                            <div className="availability-error">
                                <p>⚠️ {error}</p>
                            </div>
                        )}

                        <button type="submit" className="btn reservation-submit-btn" disabled={submitting}>
                            {submitting ? 'Procesando...' : 'Confirmar reserva'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReservationPage;