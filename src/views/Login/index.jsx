import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { requestLogin } from "state/login/actions";
import { LoginSelector } from "state/login/selectors";
// Components
import Login from "components/Login";
// Styles
import "./index.scss";

const LoginView = () => {
	const [payload, setPayload] = useState(null);
	const history = useHistory();
	const d = useDispatch();
/* 	const { data, loading, error } = useSelector((state) => LoginSelector(state));

	useEffect(() => {
		if (payload === null) {
			return;
		}
		d(requestLogin(payload));
	}, [d, payload]);

	useEffect(() => {
		if (data) {
			const cardId = data.id;
			history.push(`/details/${cardId}`);
		}
	}, [data, loading, error, history]);
 */
	return (
		<div className="login-container">
			<h1>Healthy Dev</h1>
			<Login setPayload={setPayload} />
		</div>
	);
};

export default LoginView;
