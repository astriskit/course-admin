import { createElement as c, Component } from "react";
import { Route, RouteProps, withRouter } from "react-router-dom";

interface PermitIfProps {
  isValid(confg: RouteProps): boolean;
  elseRedirectTo?: string;
  renderIfValid: React.ReactNode;
  renderIfNotValid?: React.ReactNode;
  path: string;
  exact?: boolean;
}

interface withValidProps {
  (opt: Omit<PermitIfProps, "path">): React.ReactNode;
}

const withValid: withValidProps = ({
  isValid,
  elseRedirectTo,
  renderIfValid,
  renderIfNotValid,
}) => {
  const validClass = class extends Component {
    componentDidUpdate() {
      if (!isValid(this.props) && elseRedirectTo) {
        //@ts-ignore
        this.props.history.push(elseRedirectTo);
      }
    }
    render() {
      if (isValid(this.props) && renderIfValid) {
        //@ts-ignore
        return c(renderIfValid, this.props);
      }
      if (renderIfNotValid) {
        //@ts-ignore
        return c(renderIfNotValid, this.props);
      }
      return null;
    }
  };
  //@ts-ignore
  return withRouter(validClass);
};

export const PermitIf: React.FC<PermitIfProps> = ({
  isValid,
  elseRedirectTo = "/",
  path,
  exact,
  renderIfValid,
  renderIfNotValid,
}) => {
  return (
    <Route
      path={path}
      exact={exact}
      //@ts-ignore
      component={withValid({
        isValid,
        elseRedirectTo,
        renderIfNotValid,
        renderIfValid,
      })}
    />
  );
};
