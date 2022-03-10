
import React, {useEffect, useState} from 'react';
import { apiLoggedIn, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Profile.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
 const FormField = props => {
    return (
        <div className="profile field">
            <label className="profile label">
                {props.label}
            </label>
            <input
                className="profile input"
                placeholder={props.placeholder}
                value={props.value}
                type={props.type}
                onChange={e => props.onChange(e.target.value)}
                disabled={props.disabled}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};

const Profile = props => {


     const history = useHistory();
    const [status, setStatus] = useState(null);
    const [username, setUsername] = useState(null);
    const [creationDate, setCreationDate] = useState(null);
     const [birthday, setBirthday] = useState(null);
     const [user, setUser] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                //const response = await api.get('/users/userId',requestBody);
                //const response = await api.get('/users/${userId}', (id));
                const response = await apiLoggedIn().get(`/users/${props.match.params.id}`);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state. (hooks used)
                setUser(response.data);
                setUsername(response.data.username);
                setStatus(response.data.loggedIn);
                setCreationDate(response.data.date);
                setBirthday(response.data.birthday);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
            fetchData();

    },[props.match.params.id]);

    const doEdit = async () => {

        //console.log("This is the Users Birthday: "+ typeof birthday);
        try {
            const requestBody = JSON.stringify({username, birthday}); //myToken for authentication, userId, username, birthDate
            await apiLoggedIn().put(`users/${props.match.params.id}`,requestBody);
                // Get the returned user and update a new object.

            // Editing worked navigate to the profile page
            history.push('/profile/' + user.id);
            //history.go(0);
        } catch (error) {
            alert(`Something went wrong (May need to visit the console): \n${handleError(error)}`);
        }
    };

    const goDashboard = async () => {
        history.push('/game/dashboard');
    }
    const myIdDisable = () => {
      if(props.match.params.id === localStorage.getItem('id')){
          return false;
      }else {
          return true;
      }
    };
    const myStatus = () => {
        if(status === true){
            return "ONLINE";
        }
        if(status === false){
            return "OFFLINE";
        }
        return "status...";
    };
    return (
        <BaseContainer>
            <div className="profile container">
                <div className="profile form">
                    <FormField
                        label="Username"
                        type="text"
                        placeholder="username..."
                        value={username}
                        onChange={un => setUsername(un)}
                        disabled={myIdDisable()}
                    />
                    <FormField
                        label="User Status"
                        placeholder="status..."
                        value={myStatus()}
                        disabled="true"
                    />
                    <FormField
                        label="creation date"
                        placeholder="date..."
                        value={creationDate}
                        type="date"
                        disabled="true"
                    />
                    <FormField
                        label="birth date (optional)"
                        placeholder="birthday..."
                        value={birthday}
                        type="date"
                        onChange={b => setBirthday(b)}
                        disabled={myIdDisable()}
                    />
                    <div className="Profile button-container">
                        {!myIdDisable() && <Button
                            disabled={!username || myIdDisable()}
                            width="100%"
                            onClick={() => doEdit()}
                        >
                            Edit
                        </Button>}
                    </div>
                    <div className="Dashboard button-container">
                        <Button
                            width="100%"
                            onClick={() => goDashboard()}
                        >
                            Dashboard
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
export default Profile;
