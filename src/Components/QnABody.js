import { useEffect, useState } from "react";
import Options from "./Options";

export default function QnABody(props){
    
    let currentQuestion = props.currentQuestion;

    
    console.log(currentQuestion?.correct_answers);

    const {selectedOptions,handleOptions}=useSetSelectedOption();
    if(currentQuestion){
    return (
        <>
        <div className="question">{currentQuestion.question}</div>
        <br/><br/>
        {<Options options={currentQuestion.answers} qNumber={props.qNumber} questionid={currentQuestion.id} selectedOptions={selectedOptions} handleOptions={handleOptions} setNumberMarked={props.setNumberMarked}/> }
        </>
    )
    }else{
        return <div>Loading...</div>
    }
}


const useSetSelectedOption=()=>{
    const [selectedOptions,setSelectedOptions]=useState({});

    useEffect(()=>{
        if(localStorage.getItem('selectedOptions')){
            setSelectedOptions(JSON.parse(localStorage.getItem('selectedOptions')));
        }
    },[])
    function handleOptions(question_id,optionIndex){
        let selectedArray = selectedOptions[question_id];
        if(!selectedArray){
            selectedArray=[];
        }
        if(selectedArray.includes(optionIndex)){
            const index = selectedArray.indexOf(optionIndex);
            if (index > -1) {
                selectedArray.splice(index, 1);
            }
        }
        else{
            selectedArray.push(optionIndex);
        }
        localStorage.setItem('selectedOptions',JSON.stringify({
            ...selectedOptions,
            [question_id]: selectedArray
        }))
        setSelectedOptions({
            ...selectedOptions,
            [question_id]: selectedArray
        })
        
    }

    return {
        selectedOptions,
        handleOptions
    }
}