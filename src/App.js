import { useEffect, useReducer } from 'react';
import './App.css';
import OperationButton from './OperationButton';
import DigitButton from './DigitButton';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
}

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const current = parseFloat(currentOperand)
  const previous = parseFloat(previousOperand)

  if (operation === "+") return previous + current
  if (operation === "-") return previous - current
  if (operation === "*") return previous * current
  if (operation === "÷") return previous / current
}

const reducer = (state, {type, payload}) => {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand && state.currentOperand.includes(".")) return state
      return {
        ...state,
        currentOperand: state.currentOperand === "." ? `0.${payload.digit}` : `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state;
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      if (state.currentOperand === null && state.previousOperand !==null && ["+", "-", "*", "÷"].includes(state.operation)) {
        return {
          ...state,
          operation: payload.operation
        } 
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.EVALUATE:
      if (state.currentOperand === null) return state;
      if (state.currentOperand !==null && state.previousOperand === null) return state;
      return {
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state).toString(),
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.currentOperand === null) return state;
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    case ACTIONS.CLEAR:
      return {}
  }
}

const App = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      // Check if the pressed key is a digit or an operator
      if (/[0-9]/.test(key)) {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: key }});
      } else if (['+', '-', '*', '÷'].includes(key)) {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: key }});
      } else if (key === '.') {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: key }});
      } else if (key === 'Enter') {
        dispatch({ type: ACTIONS.EVALUATE });
      } else if (key === 'Backspace') {
        dispatch({ type: ACTIONS.DELETE_DIGIT });
      } else if (key.toLowerCase() === 'c') {
        dispatch({ type: ACTIONS.CLEAR });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div className="App">
      <div className='output-container'>
        <div className='previous-operand'>{previousOperand} {operation}</div>
        <div className='current-operand'>{currentOperand}</div>
      </div>
      <div className='calculator-grid'>
        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
      <div className='bottom-container'>CALCULATOR</div>
    </div>
  );
}

export default App;
