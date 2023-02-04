import "./index.scss"
import { useRef, useEffect } from "react";

export const WindShield = () => {
    let c = useRef();
    let ctx = useRef();
    let timer = useRef(0);
    let isUpKeyPressed = useRef(false);
    let isDownKeyPressed = useRef(false);

    let startPoints = useRef();

    const clearCanvas = (color) => {
        let theCanvas = c.current;
        ctx.current = theCanvas.getContext("2d");
        let theContext = ctx.current;
        theContext.fillStyle = "black";
        theContext.fillRect(0,0,theCanvas.width,theCanvas.height);


    }

    const getCenterPoint = () => {
        let theCanvas = c.current;

        let xCenter = theCanvas.width/2
        let yCenter = theCanvas.height/2
      
        return {xCenter,yCenter}
    }
    const getRandomPoint = () => {
        let theCanvas = c.current;
        let maxWidth = theCanvas.width;
        let maxHeight = theCanvas.height;

        let x = Math.floor(Math.random()*maxWidth);
        let y = Math.floor(Math.random()*maxHeight);

        return {x,y}
    }

    const generateRandomPoints = (numberOfPoints) => {
        let ptsArray = []
        for(let i = 0; i < numberOfPoints; i++){
            ptsArray.push(getRandomPoint());
        }
        return ptsArray;
    }

    const calcDestinationPt = (pt,dist) => {
        let {x,y} = pt;

        let {xCenter,yCenter} = getCenterPoint();

        let xDist = x  - xCenter;
        let yDist = y - yCenter;
        let theta = Math.atan(yDist/xDist);



        let deltaX = dist*Math.cos(theta);
        let deltaY = dist*Math.sin(theta);

        if(x > xCenter){
            if(y > yCenter){
                //first quadrant
                deltaX = Math.abs(deltaX)
                deltaY = Math.abs(deltaY)
            } else {
                //fourth quadrant
                deltaX = Math.abs(deltaX)
                deltaY = -Math.abs(deltaY)
            }
        } else {
            if(y > yCenter){
                //second quadrant
                deltaX = -Math.abs(deltaX)
                deltaY = Math.abs(deltaY)
            } else {
                //third quadrant
                deltaX = -Math.abs(deltaX)
                deltaY = -Math.abs(deltaY)
            }
        }
         
        let newX = x + deltaX;
        let newY = y + deltaY;

        return {newX,newY}

    }

    const keyUpHandler = (e) => {
     
        console.log("Let go of key...");

        if(e.key === "ArrowUp"){
            isUpKeyPressed.current = false;
        }

        if(e.key === "ArrowDown"){
            isDownKeyPressed.current = false;
        }
    }

    const keyDownHandler = (e) => {
        console.log(e);
        console.log("Pressing down key...");

        if(e.key === "ArrowUp"){
            isUpKeyPressed.current = true;
        }

        if(e.key === "ArrowDown"){
            isDownKeyPressed.current = true;
        }
    }

    const drawRay = (pt,distance) => {
        
        let theContext = ctx.current;

        let {newX,newY} = calcDestinationPt(pt,distance);
        
        theContext.strokeStyle = "yellow";
        theContext.beginPath();
        theContext.moveTo(pt.x,pt.y);

        theContext.lineTo(newX,newY);
        theContext.stroke();
    }

    const drawRays = (distance) => {
        startPoints.current.forEach((pt) => {
            drawRay(pt,distance);
        })
    }

   

    useEffect(() => {
        
        
    
       
        startPoints.current = [];

        clearCanvas();

        let ptsArray = generateRandomPoints(70);
        startPoints.current = [...ptsArray];

        isDownKeyPressed.current = false 
        isUpKeyPressed.current = false
        animate();

    }, [])

    const animate = () => {
      
        clearCanvas();
   
       
        if(isUpKeyPressed.current){
            timer.current += 1;
            console.log("LightSpeed!")
            console.log(timer.current);
            drawRays(1 + timer.current);
            
        } else {

            console.log("Stop!")
            timer.current -= 1;
            if(timer.current <= 1){
                timer.current = 1;
            }
            console.log(timer.current);
            drawRays(1 + timer.current);
        }

       

        requestAnimationFrame(animate);
    }

    

    return (<div className="windshield-container">
        <canvas tabIndex={0} onKeyUp={keyUpHandler} onKeyDown={keyDownHandler} id="the-canvas" ref={c}></canvas>
    </div>);
}