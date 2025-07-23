export const useVibration=()=>{
    const vibrate = (pattern)=>{
        if(navigator.vibrate){
            navigator.vibrate(pattern)
        }else{
            console.warn("Vibration not supported!")
            
        }
    }
    return vibrate
}