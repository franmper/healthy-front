import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

import Layout from "components/_shared/Layout";
import Alert from "components/_shared/Alert";
import ListCards from "components/_shared/ListCards";
import Loader from "components/_shared/Loader";
import HeaderProfile from "components/Profile/Header";

// Redux
import { requestCardsByUserCreator, requestGetCards } from "state/cards/actions";
import {
	getUserRequest,
	deleteUserData,
	hiddenMsgUser,
	deleteUserRequest,
} from "state/user/actions";
import { userLogout } from "state/auth/actions";
// Selectores
import { FilterByUserCreator, GetCardsSelector } from "state/cards/selectors";
import {
	UserSelector,
	MessageUserSelector,
	DeleteUserSelector,
	UpdateUserSelector,
} from "state/user/selectors";

import useAuth from "hooks/useAuth";
import { ContextModal } from "hooks/useModal";

const Profile = ({ history }) => {
	const { showComponent, showModal } = useContext(ContextModal);
	const { token, closeSession, isAuth } = useAuth();

	const dispatch = useDispatch();
	const { data: dataCards } = useSelector((state) => GetCardsSelector(state));
	const { data: dataUser, error: errorUser } = useSelector((state) =>
		UserSelector(state),
	);
	const { error: errorDeleteUser } = useSelector((state) => DeleteUserSelector(state));
	const { error: errorUpdateUser } = useSelector((state) => UpdateUserSelector(state));
	const { data: messageAlert } = useSelector((state) => MessageUserSelector(state));

	const { data: dataFilterCards, loading } = useSelector((state) =>
		FilterByUserCreator(state),
	);

	function deleteDataUser() {
		dispatch(userLogout());
		dispatch(deleteUserData());
		closeSession();
	}

	function hiddenAlert() {
		dispatch(hiddenMsgUser());
	}

	useEffect(() => {
		if (!isAuth) history.replace("/login");
	}, [isAuth]); //eslint-disable-line

	const [cardLikesByMe, setCardsLikesByMe] = useState([]);

	function cardsLikedMe() {
		const likesCards = dataCards.filter((card) =>
			card.likesBy.find((like) => like.id === dataUser.user.id),
		);
		setCardsLikesByMe(likesCards);
	}

	useEffect(() => {
		if (dataCards && dataUser) {
			console.log(dataCards, dataUser);
			cardsLikedMe();
		}
	}, [dataCards, dataUser]);

	useEffect(() => {
		if (!dataCards) dispatch(requestGetCards());
		if (!dataUser) dispatch(getUserRequest({ token }));
	}, [dispatch]); //eslint-disable-line

	useEffect(() => {
		if (dataUser?.user && !dataFilterCards && !dataFilterCards?.length) {
			dispatch(requestCardsByUserCreator({ creatorId: dataUser?.user.id }));
		}
	}, [dataUser, dataFilterCards, dispatch]);

	function editProfile() {
		showModal();
		showComponent("edit-profile");
	}

	function deleteUser() {
		// NOTE: Confirmar el origen del token
		dispatch(deleteUserRequest({ token }));
	}

	let optionsModal = [
		{ title: "Editar perfil", fn: editProfile },
		{ title: "Eliminar Cuenta", fn: deleteUser },
		{ title: "Cerrar Sesion", fn: deleteDataUser },
	];
	return (
		<Layout title="Perfil">
			{messageAlert && (
				<Alert
					click={hiddenAlert}
					error={errorUser || errorDeleteUser || errorUpdateUser}
					showButtonClose
					success={!errorUser && !errorDeleteUser && !errorUpdateUser}
				>
					{messageAlert}
				</Alert>
			)}
			<div className="profile">
				<section>
					<HeaderProfile
						dataUser={dataUser}
						dataFilterCards={dataFilterCards}
						optionsModal={optionsModal}
					/>
					<section className="profile__cards">
						<h2 className="profile__cards--title">
							{!cardLikesByMe?.length
								? "No tienes tarjetas guardadas"
								: "Tarjetas Guardadas"}
						</h2>
						{cardLikesByMe.length > 0 && <ListCards cards={cardLikesByMe} />}
					</section>
				</section>
				<div className="content">
					<section className="profile__cards">
						<h2 className="profile__cards--title">
							{!dataFilterCards?.length
								? "No tienes tarjetas creadas"
								: "Tarjetas Creadas"}
						</h2>
						{dataFilterCards && <ListCards cards={dataFilterCards} />}
					</section>
				</div>
				{loading && <Loader center />}
			</div>
		</Layout>
	);
};

export default Profile;
