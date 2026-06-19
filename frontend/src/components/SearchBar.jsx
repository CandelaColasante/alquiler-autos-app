import { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function SearchBar({ onSearch, products }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [dateError, setDateError] = useState('');
    const suggestionsRef = useRef(null);
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (searchTerm.length > 1 && showSuggestions !== false) {
            const matchedSuggestions = products
                .filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(product => product.name)
                .slice(0, 5);
            setSuggestions([...new Set(matchedSuggestions)]);
            setShowSuggestions(true);
        } else if (searchTerm.length <= 1) {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchTerm, products]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const validateDates = () => {
        const start = dateRange[0].startDate;
        const end = dateRange[0].endDate;
        
        if (!start || !end) {
            setDateError('Debes seleccionar un rango de fechas');
            return false;
        }
        if (start > end) {
            setDateError('La fecha de inicio no puede ser mayor que la fecha de fin');
            return false;
        }
        setDateError('');
        return true;
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        
        if (!validateDates()) {
            return;
        }
        
        const start = dateRange[0].startDate;
        const end = dateRange[0].endDate;
        const startFormatted = format(start, 'yyyy-MM-dd');
        const endFormatted = format(end, 'yyyy-MM-dd');
        
        onSearch(searchTerm, startFormatted, endFormatted);
    };

    const handleClear = () => {
        setSearchTerm('');
        setDateRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
        setDateError('');
        setShowSuggestions(false);
        setShowDatePicker(false);
        onSearch('', '', '');
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true);
    };

    const formatDateDisplay = (date) => {
        return format(date, 'dd/MM/yyyy');
    };

    return (
        <div className="search-container">
            <h2 className="search-title">Encontrá tu próximo auto</h2>
            <p className="search-description">
                Buscá por modelo, seleccioná las fechas disponibles y encontrá el vehículo que mejor se adapte a vos
            </p>

            <form onSubmit={handleSubmit} className="search-form" noValidate>
                <div className="search-input-group">
                    <div className="autocomplete-container" ref={suggestionsRef}>
                        <input
                            type="text"
                            placeholder="Ej: Toyota Corolla, Ford Fiesta..."
                            value={searchTerm}
                            onChange={handleInputChange}
                            className="search-input-field"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="autocomplete-suggestions">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="date-range-container" ref={datePickerRef}>
                    <div 
                        className="date-range-input" 
                        onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                        <span className="date-range-label">
                            {formatDateDisplay(dateRange[0].startDate)} - {formatDateDisplay(dateRange[0].endDate)}
                        </span>
                        <span className="date-range-arrow">▼</span>
                    </div>
                    
                    {showDatePicker && (
                        <div className="date-range-picker">
                            <DateRange
                                ranges={dateRange}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                locale={es}
                                months={2}
                                direction="horizontal"
                                showPreview={true}
                                rangeColors={['#eb5200']}
                            />
                        </div>
                    )}
                </div>

                {dateError && (
                    <div className="date-error-message">
                        <span className="error-message">{dateError}</span>
                    </div>
                )}

                <div className="search-buttons">
                    <button type="submit" className="search-btn-submit">
                        Buscar vehículo
                    </button>
                    {(searchTerm || dateRange[0].startDate !== dateRange[0].endDate) && (
                        <button type="button" className="search-btn-clear" onClick={handleClear}>
                            Limpiar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default SearchBar;