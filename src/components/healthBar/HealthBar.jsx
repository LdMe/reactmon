import {useRef,useEffect,useState} from 'react';
import './HealthBar.css';
const HealthBar = ({maxHp,hp})=>{
    const currentWidthRef = useRef((hp/maxHp)*100);
    const prevWidthRef = useRef((hp/maxHp)*100);
    const [isAnimated,setIsAnimated] = useState(true);
    const [prevWidth,setPrevWidth] = useState(prevWidthRef.current);
    const [currentWidth,setCurrentWidth] = useState(currentWidthRef.current);
    useEffect(()=>{
        prevWidthRef.current = currentWidthRef.current;
        currentWidthRef.current = (hp/maxHp)*100;
        setIsAnimated(false);
        const timeout = setTimeout(()=>{
            setIsAnimated(true);
        },100);
        return ()=>{
            clearTimeout(timeout);
        }
    },[hp])
    useEffect(()=>{
        setPrevWidth(prevWidthRef.current);
    },[prevWidthRef.current]);
    useEffect(()=>{
        setCurrentWidth(currentWidthRef.current);
    },[currentWidthRef.current]);
    const width = prevWidth;
    const green ="green";
    const yellow ="yellow";
    const red ="red";
    const color = width > 50 ? green : width > 20 ? yellow : red;
    const toColor = currentWidth > 50 ? green : currentWidth > 20 ? yellow : red
    const style = {width: prevWidth+"%", "--to-width":currentWidth+"%", "--from-width":prevWidth+"%", "--from-color":color,"--to-color":toColor}
    const speed = prevWidth - currentWidth;
    const duration = Math.min(Math.abs(speed/10),1);
    style["--duration"] = duration+"s";
    const isAnimatedClass = isAnimated ? " animated" : "";
    
    return (
        <div className="health-bar">
            <div className={"health-bar-fill "+color + isAnimatedClass } style={style}/>
        </div>
    )
}

export default HealthBar;