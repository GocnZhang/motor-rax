import { render, createElement, useContext } from "rax";
import { UPDATE_COLOR } from "./context";


export default function Buttons(props) {
  const { colorContext } = props;
  const { dispatch } = useContext(colorContext);
  return (
    <div>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_COLOR, color: "red" });
        }}
      >
        红色
      </button>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_COLOR, color: "yellow" });
        }}
      >
        黄色
      </button>
    </div>
  );
};
