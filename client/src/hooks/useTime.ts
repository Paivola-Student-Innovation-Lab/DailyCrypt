import { useRef } from "react";

function useTime(progress: number){
    const startTimeRef = useRef<undefined|number>()
    
    function secondsToHms(d: number) {
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 60);
  
        return [h, m, s]; 
      }
      // Handle time data
      const handleTime = () => {
        const currentTime = performance.now()
        if(startTimeRef.current===undefined){
          startTimeRef.current=currentTime
        }
        const totalTime = currentTime - startTimeRef.current //calculate how much time has passed since starting the program
        const remainingTime = (1/progress-1)*totalTime 
        return(secondsToHms(remainingTime/1000 + 1))
      }
    return{handleTime, startTimeRef}
}
export default useTime