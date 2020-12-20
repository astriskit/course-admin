import { Login } from "./components";
import { LoggedIn } from "./App.atom";
import { PermitIf, Home, AuthHome } from "./components";
import { Switch, Redirect } from "react-router-dom";
import { useAtom } from "jotai";

const Courses = () => <div>Hello Courses!</div>;
const Students = () => <div>Hello Students</div>;

export const AppSwitch = () => {
  const [loggedIn] = useAtom(LoggedIn);

  const renderIfLoggedIn = () => loggedIn;
  const renderIfNotLoggedIn = () => !loggedIn;

  return (
    <Switch>
      <PermitIf
        exact
        path="/student/list"
        isValid={renderIfLoggedIn}
        renderIfValid={Students}
      />
      <PermitIf
        exact
        path="/student/add"
        isValid={renderIfLoggedIn}
        renderIfValid={Students}
      />
      <PermitIf
        exact
        path="/student/edit"
        isValid={renderIfLoggedIn}
        renderIfValid={Students}
      />
      <PermitIf
        exact
        path="/course/list"
        isValid={renderIfLoggedIn}
        renderIfValid={Courses}
      />
      <PermitIf
        exact
        path="/course/add"
        isValid={renderIfLoggedIn}
        renderIfValid={Courses}
      />
      <PermitIf
        exact
        path="/course/edit"
        isValid={renderIfLoggedIn}
        renderIfValid={Courses}
      />
      <PermitIf
        exact
        path="/login"
        isValid={renderIfNotLoggedIn}
        renderIfValid={Login}
      />
      <PermitIf
        exact
        path="/"
        isValid={renderIfLoggedIn}
        renderIfValid={AuthHome}
        renderIfNotValid={Home}
      />
      <Redirect to="/login" />
    </Switch>
  );
};
