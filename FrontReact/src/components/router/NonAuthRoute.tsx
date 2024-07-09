import { useSelector } from "react-redux";
import { Redirect, Route, RouteProps} from "react-router";
import { connectedUserSelector } from "../../store/selectors";
import { IUser } from "../../store/types";


/**
 * Route component making a component only accessible when disconnected
 * @param props react-router RouteProps
 */
export const NonAuthRoute = (
  {
    path,
    component : Component
  } : RouteProps
  ) => {
    
    
  /**
  * Get connectedUser from Selector
  */
  const connectedUser : IUser | undefined = useSelector(connectedUserSelector);
  
  /**
  * Return true if a user is connected, otherwise false
  * @returns boolean
  */
  function isConnected() {
    if (connectedUser) return true;
    else return false;
  }
  
  if(isConnected()){
    return <Redirect to='/' />
  }
  return (
    <Route exact path={path} component={Component}/>
  );
}