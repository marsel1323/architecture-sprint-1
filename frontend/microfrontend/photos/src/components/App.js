import React from "react";
import {Route, Routes} from "react-router-dom";

import Main from "./Main";
import ImagePopup from "./ImagePopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";

// import api from "../utils/api";

// import Header from "./Header";
const Header = React.lazy(() => import('frontend/Header'));
// import Footer from "./Footer";
const Footer = React.lazy(() => import('frontend/Footer'));

const api = React.lazy(() => import('frontend/ApiUtils'));


function App() {
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState({});

    // Запрос к API за информацией о пользователе и массиве карточек выполняется при монтировании.
    React.useEffect(() => {
        api
            .getAppInfo()
            .then(([cardData, userData]) => {
                // console.log({cardData});
                // console.log({userData});
                setCurrentUser(userData);
                setCards(cardData);
            })
            .catch((err) => console.error(err));
    }, []);

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api
            .changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.error(err));
    }

    function handleCardDelete(card) {
        api
            .removeCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.error(err));
    }

    function handleAddPlaceSubmit(newCard) {
        api
            .addCard(newCard)
            .then((newCardFull) => {
                setCards([newCardFull, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.error(err));
    }

    return (
        <div className="page__content">
            <Header/>

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute
                            element={Main}
                            cards={cards}
                            onAddPlace={handleAddPlaceClick}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />}
                />
            </Routes>

            <Footer/>

            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleAddPlaceSubmit}
                onClose={closeAllPopups}
            />

            <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
        </div>
    );
}

export default App;