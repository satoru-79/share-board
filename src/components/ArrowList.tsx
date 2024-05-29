import Arrow from "./Arrow";
import { ArrowObject } from "../Board";
import { BoardData } from "../Home";
import React, { SetStateAction } from "react";
import {v4 as uuidv4} from 'uuid'


type Props = {
    arrows: ArrowObject[],
    currentBoard: BoardData,
    setCurrentBoard: React.Dispatch<SetStateAction<BoardData>>
    type: "create" | "save" | "edit" | "share" | ""
    
}

const ArrowList:React.FC<Props> = (props) => {

    return (
        <div>
            {props.arrows.map((arrow) => {
              return (
              <Arrow arrow={arrow} setCurrentBoard={props.setCurrentBoard} 
                     arrows={props.arrows} currentBoard={props.currentBoard}
                     type={props.type} key={uuidv4()}
              />
              )
            })}
        </div>
    )
}

export default ArrowList