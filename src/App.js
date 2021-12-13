import React from 'react';
import './App.css';
import  CustomSlider  from './components/CustomSlider';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect, useRef } from "react";



const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    red: {
      main: '#F46534',
      darker: '#053e85',
    },
  },
});

//configure slider

const sliders = [{
  name: "TNC",
  color: "primary",
  defaultValue: 40,
},{
  name: "Artist",
  color: "secondary",
  defaultValue: 30,
},{
  name: "Reddev",
  color: "primary",
  defaultValue: 20,
},{
  name: "Seller",
  color: "secondary",
  defaultValue: 10,
},
]

function App() {

  //state to manage all sliders
  const [value, setValue] = useState(0);
  //state to track which slider is moved
  const [sno, setSno] = useState(0);
  //state to share slider value across all slider
  const [slider, setSlider] = useState([40,30,20,10]);
  //state for the previous slider value
  const [oldSlider, setPrev] = useState(slider)
  const [flag, setFlag] = useState(1)
  //Manage only on updates to avoid intial load update
  const isInitialMount = useRef(true);

  
  const handleChange = (sno, e) => {
    console.log(e.target.value);
    setValue(e.target.value);
    setSno(sno);
  }

  const handleChangeCommited = () => {
    setPrev(slider)
  }

  useEffect(()=>{
    if(isInitialMount.current){
      isInitialMount.current = false;
    }else {

      console.log("oldSlider: "+oldSlider)
      let oldValue = oldSlider[sno]
      // console.log("oldv: "+oldValue)
      let newSlider = []
      let f= flag
      
      let difference = Math.abs(oldValue - value)
      let d = Math.abs(slider[sno] - value)
      let total = oldSlider.slice(Number(sno+1), (oldSlider.length)).reduce((a,b)=>a+b,0)
      let curTotal = slider.slice(Number(sno+1), (oldSlider.length)).reduce((a,b)=>a+b,0)
      console.log("curTotal: "+curTotal)
      let befTotal = slider.slice(0, sno+1).reduce((a,b)=>a+b,0)
      if(curTotal != 0) {
      if(sno > 0) {
        for (let i=0; i<(sno - 0); i++) {
          newSlider[i] = oldSlider[i]
        }
      }
    }
      newSlider[sno] = value

      //Decrease
      if(value < oldValue) {
        console.log("if")
        
        for(let i=sno+1; i<oldSlider.length; i++) {
          newSlider[i] = oldSlider[i] + (Math.floor((oldSlider[i]/total) * difference));
          if(newSlider[i]>100) {
            newSlider[i] = 100
          }
          
        }
      }
      else {
        console.log("else")
        if(curTotal != 0) {
          for(let i=sno+1; i<oldSlider.length; i++) {
            newSlider[i] = oldSlider[i] - (Math.floor((oldSlider[i]/total) * difference));
            if(newSlider[i]<=0) {
              newSlider[i] = 0
            }
          }
        }
        else {
            console.log("f: "+f)
            //while((sno-f)>=0){
              for (let i=0; i<(sno - f); i++) {
                newSlider[i] = oldSlider[i]
              }
              if((sno-f) >= 0) {
                newSlider[sno-f] = slider[sno-f] - d
              }
              if(newSlider[sno-f] < 0) {
                newSlider[sno-f] = 0
              }
              if(newSlider[sno-f] == 0){
                f = f+1
                console.log("f1:" + f)
              }
              console.log("sno-f: "+(sno-f))
            //} 
        }
      }
      setSlider(newSlider);
      setFlag(f)
      console.log("new: "+newSlider)
    }
  }, [value])

  
  
  
  
  return ( 
      <div className = "App">
        <div className="cont">
          <div className="sliders">
            <ThemeProvider theme={theme}>
              {
                (() => {
                  return sliders.map((eachSlider, index) => {
                    return (
                      <CustomSlider key={index} color={eachSlider.color} value={slider[index] === undefined ? 0 : slider[index]} defaultValue={eachSlider.defaultValue} handleChange={handleChange.bind(this,index)} handleChangeCommited={handleChangeCommited.bind()} />
                      // <CustomSlider key={index} color={eachSlider.color} value={slider[index]} defaultValue={eachSlider.defaultValue} handleChange={handleChange.bind(this,index)} />    
                    )
                  })
                })()
                
              }
            </ThemeProvider>
          </div>
        </div>
      </div> 
    );
}

export default App;
