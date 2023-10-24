export const setPJ = (PointsChar:number)=>{

  if(PointsChar <=0){
    return {pointsJutsu:0, nivel:0}
  }else if(PointsChar == 1){
    return {pointsJutsu:6, nivel:1}
  }else{
    let nivel =1
    let pointsJutsu = 6
    while (PointsChar > nivel) {
      nivel +=1
      pointsJutsu += 3
    }
    return {pointsJutsu, nivel}
  }

}