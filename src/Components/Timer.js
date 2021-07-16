import { useEffect, useState } from "react"
import { unstable_batchedUpdates } from "react-dom";

export default function Timer(props){

    const [isTimerOn,setIsTimerOn]=useState(true);
    const [minutes,setMinutes]=useState(1);
    const [seconds,setSeconds]=useState(10);
   
    useEffect(()=>{
        if(localStorage.getItem('minutes')&&localStorage.getItem('seconds')){
            setMinutes(localStorage.getItem('minutes'));
            setSeconds(localStorage.getItem('seconds'));
        }
    },[])

    useEffect(()=>{
        
        let timer = setInterval(()=>{
           
            let newSecond = seconds-1<0? 59: seconds-1;
            let newMinute = newSecond==59? minutes-1:minutes;
            
            if(newMinute!=0 || newSecond!=0){

                unstable_batchedUpdates(()=>{
                    setSeconds(newSecond);
                    setMinutes(newMinute);
                })
                localStorage.setItem('seconds',newSecond);
                localStorage.setItem('minutes',newMinute);

            }else{
                setIsTimerOn(false);
                props.submitTest();
                clearInterval(timer);
            }
        },1000)

        return ()=>{
            clearInterval(timer);
        }
    },[minutes,seconds])
    
    return (
        <div>
        {isTimerOn?(<div>Time Remaining: 
                        {' '}{minutes}:{seconds < 10 ?  `0${seconds}` : seconds}
                        </div>):'Test submitted'}
        </div>
        
    )
}