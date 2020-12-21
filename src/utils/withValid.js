import { Component } from "react";

export const withValid = ({
  isValid,
  elseRedirectTo = "/",
  renderIfValid: RenderIfValid = null,
  renderIfNotValid: RenderIfNotValid = null,
}) => {
  return class extends Component {
    componentDidUpdate() {
      if (!isValid(this.props) && elseRedirectTo) {
        this.props.history.push(elseRedirectTo);
      }
    }
    render() {
      if (isValid(this.props) && RenderIfValid) {
        return <RenderIfValid {...this.props} />;
      }
      if (RenderIfNotValid) {
        return <RenderIfNotValid {...this.props} />;
      }
      return null;
    }
  };
};
