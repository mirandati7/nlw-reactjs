import {  createContext, useContext,useState,useEffect, ReactNode} from 'react';

import { ChallengesContext } from '../contexts/ChallengesContext';

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished:boolean;
  isActive: boolean;
  startCountDown:() => void;
  resetCountDown:() => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData) ;

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({children} : CountdownProviderProps)  {

  const {startNewChallenge } = useContext(ChallengesContext);


  const [time, setTime] = useState(40 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished,setHasFinished ] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const [minuteLeft , minuteRight] = String(minutes).padStart(2, '0').split('');
  const [secondLeft , secondRight] = String(seconds).padStart(2, '0').split('');

  function startCountDown(){
    setIsActive(true);
  }

  function resetCountDown(){
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTime(40 * 60);
  }

  useEffect( () => {
    if (isActive && time >0 ){
      countdownTimeout  = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
       setHasFinished(true);
       setIsActive(false);
       startNewChallenge();
    }
  }, [isActive,time])

  return(
    <CountdownContext.Provider value={{
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountDown,
      resetCountDown
    }}>  
      {children}
    </CountdownContext.Provider>
  )
}