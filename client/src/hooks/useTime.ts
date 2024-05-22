import { useRef } from "react";
import { create } from "zustand";

interface timeState {
  startTime: number|undefined
  pausedTime: number|undefined
  setStartTime: (arg0: number|undefined) => void
  setPausedTime: (arg0: number|undefined) => void
}
const useTimeState = create<timeState>((set) => ({
  startTime: undefined,
  pausedTime: undefined,
  setStartTime: (newTime: number|undefined) => set({
    startTime: newTime
  }),
  setPausedTime: (newTime: number|undefined) => set({
    pausedTime: newTime
  })
}))
//convert time in seconds to time in hours, minutes and seconds
function secondsToHms(d: number) {
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 60);

  return [h, m, s]; 
}
function useTime(progress: number){
    const {startTime, pausedTime, setStartTime, setPausedTime} = useTimeState((set) => ({startTime: set.startTime, pausedTime: set.pausedTime,setStartTime: set.setStartTime ,setPausedTime: set.setPausedTime}))
    // Handle time data
    const handleTime = () => {
      if(progress > 0){
        const currentTime = performance.now()
        if(startTime===undefined){
          setStartTime(currentTime)
        }
        else{
          const totalTime = currentTime - startTime //calculate how much time has passed since starting crypting
          const remainingTime = (1/progress-1)*totalTime 
          return(secondsToHms(remainingTime/1000 + 1))
        }
    }
    return [NaN, NaN, NaN]
    }

    //adjust startTime based on how long program was paused for
    const adjustStartTime = () => {
      if(startTime){
        if(pausedTime){
          setStartTime(startTime + performance.now() - pausedTime)
          setPausedTime(undefined)
        }
        else{
          setPausedTime(performance.now())
        }
      }
    }

    //function for reseting time when crypting is stopped
    const resetTime = () => {
      setStartTime(undefined)
      setPausedTime(undefined)
    }
    return{handleTime, adjustStartTime, resetTime}
}
export default useTime