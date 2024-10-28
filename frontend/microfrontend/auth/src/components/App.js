import React from "react";
import {Route, Routes, useNavigate} from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";

import * as auth from "../utils/auth";

// import Header from "./Header";
const Header = React.lazy(() => import('frontend/Header'));
// import Footer from "./Footer";
const Footer = React.lazy(() => import('frontend/Footer'));

function App() {
    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
    const [tooltipStatus, setTooltipStatus] = React.useState("");
    const [isLoggedIn, setIsLoggedIn] = React.useState(true);
    const [email, setEmail] = React.useState("");

    const navigate = useNavigate();

    // при монтировании App описан эффект, проверяющий наличие токена и его валидности
    React.useEffect(() => {
        console.log('auth microfrontend useEffect');
        const token = localStorage.getItem("jwt");
        if (token) {
            auth.checkToken(token)
                .then((res) => {
                    console.log(res.data)
                    setEmail(res.data.email);
                    setIsLoggedIn(true);
                    // eventBus.publish("userLoggedIn", {userData: "cocker"})
                    // navigate("/");
                })
                .catch((err) => {
                    localStorage.removeItem("jwt");
                    console.error(err);
                });
        }
    }, [navigate]);

    function onRegister({email, password}) {
        auth.register(email, password)
            .then(() => {
                setTooltipStatus("success");
                setIsInfoToolTipOpen(true);
                navigate("/signin");
            })
            .catch(() => {
                setTooltipStatus("fail");
                setIsInfoToolTipOpen(true);
            });
    }

    function onLogin({email, password}) {
        auth.login(email, password)
            .then((userData) => {
                setIsLoggedIn(true);
                setEmail(email);
                // navigate("/");
            })
            .catch(() => {
                setTooltipStatus("fail");
                setIsInfoToolTipOpen(true);
            });
    }

    function onSignOut() {
        // при вызове обработчика onSignOut происходит удаление jwt
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        navigate("/signin");
    }

    return (
        <div className="page__content">
            <Header email={email} onSignOut={onSignOut}/>

            <Routes>
                <Route path="/signup" element={<Register onRegister={onRegister}/>}/>
                <Route path="/signin" element={<Login onLogin={onLogin}/>}/>
            </Routes>

            <Footer/>

            <InfoTooltip
                isOpen={isInfoToolTipOpen}
                onClose={() => setIsInfoToolTipOpen(false)}
                status={tooltipStatus}
            />
        </div>
    );
}

export default App;