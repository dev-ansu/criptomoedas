import styles from "./header.module.css";
import img from "../../assets/logo.svg";
import {Link} from "react-router-dom"
const Header = ()=>{
    return (
        <header className={styles.container}>
            <Link to="/">
                <img src={img} alt="Logo da criptomoedas" />
            </Link>
        </header>
    )
}

export default Header;