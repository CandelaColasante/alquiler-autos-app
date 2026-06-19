import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function AvailabilityCalendar({ productId }) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [fechasOcupadas, setFechasOcupadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFechasOcupadas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/products/${productId}/availability`);
            if (!response.ok) throw new Error('No se pudo obtener la disponibilidad');
            const data = await response.json();
            setFechasOcupadas(data);
        } catch (err) {
            setError('No se puede obtener la información de disponibilidad en este momento.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchFechasOcupadas();
    }, [productId]);

    const handleSelect = (ranges) => {
        setState([ranges.selection]);
    };

    const disabledDatesArray = fechasOcupadas.map(d => {
        const [year, month, day] = d.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    });

    return (
        <div className="availability-container">
            <div className="availability-header" onClick={() => setShowCalendar(!showCalendar)}>
                <h3>Disponibilidad del vehículo</h3>
                <span className="availability-toggle">{showCalendar ? '▲' : '▼'}</span>
            </div>

            {showCalendar && (
                <div className="availability-calendar">

                    {loading && (
                        <p className="availability-loading">Cargando disponibilidad...</p>
                    )}

                    {error && !loading && (
                        <div className="availability-error">
                            <p>⚠️ {error}</p>
                            <button onClick={fetchFechasOcupadas} className="retry-btn">
                                Reintentar
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleSelect}
                                moveRangeOnFirstSelection={false}
                                ranges={state}
                                months={2}
                                direction="horizontal"
                                locale={es}
                                disabledDates={disabledDatesArray}
                                rangeColors={['#eb5200']}
                            />
                            <div className="availability-legend">
                                <div className="legend-item">
                                    <div className="legend-color available"></div>
                                    <span>Fecha disponible</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color occupied"></div>
                                    <span>Fecha ocupada (no disponible)</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default AvailabilityCalendar;