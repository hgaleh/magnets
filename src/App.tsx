import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import styles from './App.module.css';
import { appReducer } from './app.reducer';

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] =  useReducer(appReducer, []);

  useEffect(() => {
    dispatch({
      type: 'init',
      payload: {
        triangleWidth: 100,
        triangleHeight: 100,
        windowWidth: appRef.current?.clientWidth,
        windowHeight: appRef.current?.clientHeight,
        columns: 5,
        rows: 5
      }
    })
  }, [appRef])

  const mouseMoved = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget as HTMLElement;
    const boundingRect = element.getBoundingClientRect();

    const mouseXRelativeToElement = e.clientX - boundingRect.left;
    const mouseYRelativeToElement = e.clientY - boundingRect.top;

    dispatch({
      type: 'cursore-moved',
      payload: {
        x: mouseXRelativeToElement,
        y: mouseYRelativeToElement
      }
    });

  }, [dispatch]);

  return (
    <div className={styles.app} onMouseMove={mouseMoved} ref={appRef}>
      {state.map(trig => {
        return <div
            key={trig.key} 
            style={{ 
              left: trig.left,
              top: trig.top,
              transform: `rotateZ(${trig.angle}rad)`
            }} 
            className={styles.triangle}>
          </div>
      })}
    </div>
  );
}

export default App;
