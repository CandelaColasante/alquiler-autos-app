import logo from '../assets/readytogo-logo.png';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <p className="footer-copyright">
                       © {currentYear} Ready 2 Go. 
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;