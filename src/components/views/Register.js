import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = props => {
    return (
        <div className="register field">
            <label className="register label">
                {props.label}
            </label>
            <input
                className="register input"
                placeholder={props.placeholder}
                value={props.value}
                type={props.type}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    placeholder : PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func
};

const Register = props => {
    const history = useHistory();
    const [name, setName] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({username, name, password});
            //const requestBody = JSON.stringify({username,password});
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', response.headers.token);
            localStorage.setItem('id', user.id);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    const goToLogin = () => {
      history.push(`/login`);
    }

    return (
        <BaseContainer>
            <div className="register container">
                <div className="register form">
                    <FormField
                        label="Username"
                        type="text"
                        placeholder="Username here ..."
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Name"
                        type="text"
                        placeholder="Name here ..."
                        value={name}
                        onChange={n => setName(n)}
                    />
                    <FormField
                        label="password"
                        type="password"
                        placeholder="Password here ..."
                        value={password}
                        onChange={p => setPassword(p)}
                    />
                    <div className="Register button-container">
                        <Button
                            disabled={!username || !name ||  !password}
                            width="100%"
                            onClick={() => doLogin()}
                        >
                            Register
                        </Button>
                        <Button
                            width="100%"
                            onClick={() => goToLogin()}
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;