import { useRef } from "react";
//convert time in seconds to time in hours, minutes and seconds
function secondsToHms(d: number) {
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 60);

  return [h, m, s]; 
}
function useTime(progress: number){
    const startTimeRef = useRef<undefined|number>()
    const pausedTimeRef = useRef<undefined|number>() 
    // Handle time data
    const handleTime = () => {
      const currentTime = performance.now()
      if(startTimeRef.current===undefined){
        startTimeRef.current = currentTime
      }
      const totalTime = currentTime - startTimeRef.current //calculate how much time has passed since starting crypting
      const remainingTime = (1/progress-1)*totalTime 
      return(secondsToHms(remainingTime/1000 + 1))
    }

    //adjust startTime based on how long program was paused for
    const adjustStartTime = () => {
      if(startTimeRef.current){
        if(pausedTimeRef.current){
          startTimeRef.current = startTimeRef.current + performance.now() - pausedTimeRef.current
          pausedTimeRef.current = undefined
        }
        else{
          pausedTimeRef.current = performance.now()
        }
      }
    }

    //function for reseting time when crypting is stopped
    const resetTime = () => {
      startTimeRef.current = undefined
      pausedTimeRef.current = undefined
    }
    return{handleTime, adjustStartTime, resetTime}
}
export default useTime