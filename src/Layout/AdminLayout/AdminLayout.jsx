import React, { useState } from 'react'
//import Logo from "../../../assets/images/Logo.jpeg"
import MenuIcon from "../../../assets/Icons/MenuIcon.svg"

import "./AdminLayout.css"
import { useAppContext } from '../../Context/AppContext'
import { useNavigate } from 'react-router-dom'
function AdminLayout({ renderContent }) {
    const { width } = useAppContext();
    const [openMobileMenu, setOpenMobileMenu] = useState(false)
    const [closing, setClosing] = useState(false);

    const toggleMenu = () => {
        if (openMobileMenu) {
            setClosing(true);
            setTimeout(() => {
                setOpenMobileMenu(false);
                setClosing(false);
            }, 400); 
        } else {
            setOpenMobileMenu(true);
        }
    };

    const navigate = useNavigate()
    return (
        <React.Fragment>
            <section className='admin-layout-container'>
                <header className='admin-layout-header'>
                    <nav className='admin-layout-nav'>
                        <picture className='admin-layout-logo'>
                            <img src={"https://placehold.co/600x400"} alt="" />
                        </picture>

                        <ul className='admin-layout-menu'
                            style={{
                                display: width < 768 ? "none" : "flex"
                            }}
                        >
                            <li
                                onClick={()=> navigate("/")}
                            >Dashboard</li>
                            <li 
                                onClick={()=> navigate("/products-management")}
                            >Stock</li>
                            <li>Promociones</li>
                            <li>Banners</li>
                            <li>Ajustes</li>
                        </ul>

                        {width < 768 && openMobileMenu && (
                             <div className={`mobile-menu ${openMobileMenu ? "active" : ""} ${closing ? "closing" : ""}`}>
                             <ul className="mobile-menu-items">
                                 <li>Dashboard</li>
                                 <li>Stock</li>
                                 <li>Promociones</li>
                                 <li>Banners</li>
                                 <li>Ajustes</li>
                             </ul>
                         </div>

                        )}

                        {width < 768 && (
                            <picture className='admin-layout-menu-icon'
                                onClick={toggleMenu}
                            >
                                <img src={MenuIcon} alt="" />
                            </picture>
                        )}
                    </nav>
                </header>
                <main className='admin-layout-main'>
                    {renderContent}
                </main>
            </section>
        </React.Fragment>
    )
}

export default AdminLayout