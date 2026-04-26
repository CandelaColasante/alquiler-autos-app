import { useNavigate } from "react-router-dom";
import logo from '../assets/readytogo-logo.png';

function Header({ user, setUser }) {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    }

    const getInitials = () => {
        if (!user) return "";
        const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : "";
        const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : "";
        return firstInitial + lastInitial;
    }

    return (
        <header className="header">
            <div className="header-left" onClick={goHome}>
                <img src={logo} alt="Ready To Go" className="header-logo" />
                <span className="header-slogan">Viaja cómodo y seguro</span>
            </div>
            
            <div className="header-right">
                {user ? (
                    <>
                        <div className="header-nav-buttons">
                            {user.role === "ADMIN" && (
                                <button 
                                    className="btn btn-admin"
                                    onClick={() => navigate("/administracion")}
                                >
                                    Panel Admin
                                </button>
                            )}
                            <button 
                                className="btn btn-profile"
                                onClick={() => navigate("/perfil")}
                            >
                                Mi Perfil
                            </button>
                        </div>

                        <div className="header-user-area">
                            <div className="user-info">
                                <div className="user-avatar" title={`${user.firstName} ${user.lastName}`}>
                                    {getInitials()}
                                </div>
                                <span className="user-name">Hola, {user.firstName}</span>
                            </div>
                            <button 
                                className="btn-logout"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <button 
                            className="btn" 
                            onClick={() => navigate("/registro")}
                        >
                            Crear cuenta
                        </button>
                        <button 
                            className="btn" 
                            onClick={() => navigate("/login")}
                        >
                            Iniciar sesión
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;