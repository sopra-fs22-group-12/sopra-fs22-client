import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory,Link} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import Profile from "components/views/Profile"

/**
const Player = ({user}) => {
    const GoProfile = (user) => {
        const history = useHistory();
        console.log("clicked");
        //history.push('/game/profile');
        //<Profile id={user.id}/>
    }
    return(
        <div className="player container" >
            <Button onClick={GoProfile({user})}>Profile</Button>
            <div><Link className="player username" onClick={GoProfile({user})}>{user.username}</Link></div>
            <div className="player name">{user.name}</div>
            <div className="player id">id: {user.id}</div>
        </div>);
} //this is one of my approaches*/

const Player = ({user, history}) => (
        <div className="player container" >
            <Button onClick={() => history.push('/profile/' + user.id)}>Profile</Button>
            <div className="player username" >{user.username}</div>
            <div className="player name">{user.name}</div>
            <div className="player id">id: {user.id}</div>
        </div>
);
Player.propTypes = {
  user: PropTypes.object
};

const Game = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);

  const logout = async () => {
      /**const status = "OFFLINE";*/

      const id = localStorage.getItem('id');
      console.log(id); //-> null
      /**const token = '45b04b6f-ab52-4ece-9506-3807e7a601d4]';*/
      if(id !== null){
          const response = await api.put(`/logout/${id}`);
      }

      localStorage.removeItem('id');
      localStorage.removeItem('token');
      history.push('/login');
  }

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/users');

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

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
    /**return () => {
        localStorage.removeItem("token");
    }//approach to unmount*/
  }, []);

    /**const GoProfile = (user) => {
        const history = useHistory();
        console.log("clicked");
        //history.push('/game/profile');
        //<Profile id={user.id}/>
    }*/

  let content = <Spinner/>;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list" >
          {users.map(user => (
              <Player user={user} history={history} key={user.id}/>
          ))}
        </ul>
        <Button
          width="100%"
          onClick={() => logout()}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">
        Get all users from secure endpoint:
      </p>
      {content}
    </BaseContainer>
  );
}

export default Game;
