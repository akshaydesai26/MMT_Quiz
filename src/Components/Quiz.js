import { useEffect,useState,useRef } from "react";
import Timer from "./Timer";
import QnABody from "./QnABody";
import ScoreTable from "./ScoreTable";

function storeQuizAndMarked(quiz,marked,qNumber){
    localStorage.setItem('quiz',JSON.stringify(quiz));
    localStorage.setItem('question',qNumber);
    localStorage.setItem('selectedOptions',JSON.stringify(marked));
}

function getQuizandMarked(){
    let fullquiz = JSON.parse(localStorage.getItem('quiz'));
    let question = localStorage.getItem('question');
    let marked = JSON.parse(localStorage.getItem('selectedOptions'));

    return {fullquiz,question,marked}
}


export default function Quiz(props){
    const [quiz, setQuiz] = useState({});
    const [qNumber,setqNumber]=useState(1);
    const [isSubmit,setIsSubmit]=useState(false);
    const [score,setScore]=useState(0);
    const [scoreTable,setScoreTable]=useState({});
    const [markedNumber,setMarkedNumber]=useState(0);

    const prevButton=useRef();
    const nextButton=useRef();

    useEffect(()=>{
        let {fullquiz,question,marked} = getQuizandMarked();
        if(fullquiz==null || question==null || marked==null){
            fetch("https://quizapi.io/api/v1/questions?apiKey=YfaQxZmkdcY2AoBtkjoQtegeqUlzzWeZKXBMIW2e&limit=10")
                .then(result => {
                    console.log(result);
                    return result.json();
                })
                .then(data => {
                    console.log(data);
                    //console.log('need new data' + needNewData);
                    setQuiz(data);
                    localStorage.setItem('quiz',JSON.stringify(data));
                    localStorage.setItem('question',1);
                    localStorage.setItem('selectedOptions',{});
                    localStorage.setItem('answersMarked',0);
                    setqNumber(1);
                    return data;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => console.log('finally'));
            }
            else{
                setQuiz(fullquiz);
                setqNumber(question);
                setMarkedNumber(localStorage.getItem('answersMarked'));
            }
    },[])

    useEffect(()=>{
        if(!isSubmit){
          if(qNumber<2){
              prevButton.current.disabled=true;
          }
          else{
            prevButton.current.disabled=false;
          }
    
          if(qNumber===10){
            nextButton.current.disabled=true;
          }
          else{
            nextButton.current.disabled=false;
          }
        }
      })

    function calculateScore(){
        let markedOptions = JSON.parse(localStorage.getItem('selectedOptions'));
        let score=0;
        let questionIndex=1;
        let temp_scoreTable={};
        for(let question of quiz){
            let id = question.id;
            let index=0;
            let wrongFlag=0;
            for(let answerTruth in question.correct_answers){
                if((question.correct_answers[answerTruth]=='true' && (!markedOptions[id] || !markedOptions[id].includes(index))) || 
                            (question.correct_answers[answerTruth]=='false' && markedOptions[id] && markedOptions[id].includes(index))){
                    wrongFlag=1;
                    break;
                }
                index++;
            }
            if(wrongFlag==0){
                score++;
                temp_scoreTable[questionIndex]=1;
            }else{
                temp_scoreTable[questionIndex]=0;
            }
            questionIndex++;
        }
        setScore(score);
        setScoreTable(temp_scoreTable);
    }

    function prevFunction(){
        localStorage.setItem('question',+qNumber-1);
        setqNumber(+qNumber-1);
      }
      function nextFunction(){
        localStorage.setItem('question',+qNumber+1);
        setqNumber(+qNumber+1);
      }
      function submitTest(){
        calculateScore();
        setIsSubmit(1);
      }
      function restartFunction(){
        localStorage.clear();
        window.location.reload();
      }
      //fired from options component
      const setNumberMarked=(val)=>{
        setMarkedNumber(val);
        localStorage.setItem('answersMarked',val);
    }

    return (
        <div className="App">
      
      {!isSubmit && 
          (<div>
              <div style={{display:'flex'}}>
              <Timer submitTest={submitTest}/>
              <div style={{flexGrow:1}}></div>
              <div>Answers Marked: {markedNumber}/10</div>
              </div>
              <h1>Q: {qNumber}</h1>
              <QnABody currentQuestion={quiz[qNumber-1]}  qNumber={qNumber} setNumberMarked={setNumberMarked}/>
              <span className="navBtn">
                <button className="buttonClass" ref={prevButton} onClick={prevFunction}>Previous</button>
                <button className="buttonClass" ref={nextButton} onClick={nextFunction}>Next</button>
              </span>
          </div>)
       }
       {isSubmit && (<div>
                        <button className="buttonClass resetBtn" onClick={restartFunction}>Restart</button>
                        <h1 className="finalScore">Score: {score}</h1>
                        <ScoreTable scoreTable={scoreTable}/>
                    </div>) 
        }
       
       {qNumber==10 ? <button className="buttonClass submitBtn" onClick={submitTest}>Submit</button>: ''}
       
    </div>
    )
}