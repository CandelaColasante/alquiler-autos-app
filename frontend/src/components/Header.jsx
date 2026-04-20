import { useNavigate } from "react-router-dom";
import logo from '../assets/readytogo-logo.png';

function Header() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    }

    return (
        <header className="header">
            <div className="header-left" onClick={goHome}>
                <img src={logo} alt="Ready To Go" className="header-logo" />
                <span className="header-slogan">Viaja cómodo y seguro</span>
            </div>
            <div className="header-right">
                <button className="btn">Crear cuenta</button>
                 <button className="btn">Iniciar sesión</button>
                 <button 
                   className="btn btn-admin"
                   onClick={() => navigate("/administracion")}
                 >
                    Panel Admin
                 </button>
            </div>
        </header>
    );
}


export default Header;