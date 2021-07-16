export default function ScoreTable(props){

    let scoreTable = props.scoreTable;
    let index = 1;
    let headings=[];
    let scores=[];
    console.log('scoreTable:' + JSON.stringify(scoreTable))
    while(index<=10){
        if(scoreTable[index]){
            headings.push(<th key={index+'h'}>{index}</th>);
            scores.push(<td key={index+'r'}>{scoreTable[index]}</td>);
        }else{
            headings.push(<th key={index+'h'}>{index}</th>);
            scores.push(<td key={index+'r'}>0</td>)
        }
        index++;

      }

    return (
        <>
        <div>ScoreTable</div>
        <table>
            <tbody>
            <tr>{headings}</tr>
            <tr>{scores}</tr>
            </tbody>
        </table>
        </>
    )
}