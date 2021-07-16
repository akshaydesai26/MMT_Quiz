import { useState } from "react";

export default function Options(props){

    const {options,qNumber,questionid,selectedOptions,handleOptions}=props;
    let optionsArray=[];
    for(var option in options){
        if(options[option]){
            optionsArray.push(options[option]);
        }
    }

    const setNumberMarkedChild = ()=>{
        let marked = JSON.parse(localStorage.getItem('selectedOptions'));
        console.log('running');
        let number=0;
        for(let mark in marked){
            if(marked[mark].length>0){
                number++;
            }
        }
        props.setNumberMarked(number);
    }
    let choices = optionsArray.map((option,index) => {
        
        if(option){
            return (
                <div className='inputRow' key={questionid + `_${index}`}>
                <input type="checkbox" onChange={()=>{handleOptions(questionid,index); setNumberMarkedChild()}} value={option} defaultChecked={selectedOptions[questionid]?.includes(index) || false}></input>
                <label className="option">{option}</label>
                </div>
        )}})

    return (
        <>
        {choices}
        </>
    )
}