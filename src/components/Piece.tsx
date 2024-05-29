import Draggable, { DraggableEvent, DraggableData} from "react-draggable"
import { Player, getCourtSize} from "../Board"
import { BoardData } from "../Home";
import React from "react";

type Props = {
    player:Player,
    editFormVisible: boolean,
    setEditFormVisible: React.Dispatch<React.SetStateAction<boolean>>
    setEditTarget: React.Dispatch<React.SetStateAction<Player>>,
    players: Player[],
    setPlayers: React.Dispatch<React.SetStateAction<BoardData>>
    size: number,
    currentBoard: BoardData
}

const Piece:React.FC<Props> = (props) => {
    const height = getCourtSize('height');

    const handleDrag = (e:DraggableEvent, data:DraggableData) => {
        if (props.player.side === 'home'){
            props.setPlayers({...props.currentBoard, homePlayers: props.players.map((player) => player.key === props.player.key 
                ? {...player, position:{ x: data.x/ getCourtSize('width'), y: data.y/ getCourtSize('height')}}
                : player
            )})
        } else {
            props.setPlayers({...props.currentBoard, awayPlayers: props.players.map((player) => player.key === props.player.key 
                ? {...player, position:{ x: data.x/ getCourtSize('width'), y: data.y/ getCourtSize('height')}}
                : player
            )})
        }
        props.setEditFormVisible(true);
        props.setEditTarget(props.player);
    };


    return (
        <Draggable 
            onStop={handleDrag}
            bounds='parent'
            defaultPosition={{x: props.player.position ? props.player.position.x * getCourtSize('width') : 0 , 
                              y: props.player.position ? props.player.position.y * getCourtSize('height'): 0
                            }}
            key={props.player.key}
        >
            <div 
                className="flex flex-col justify-center items-center absolute top-[45%] z-[100] "
                style={{
                    height: height * props.size, width: height * props.size,
                    left:props.player.side === 'home' ? '40%' : '60%'
                }}
            >
                    <div  
                        className="rounded-full aspect-square flex items-center justify-center z-10 hover:cursor-pointer"
                        style={{height:"80%", backgroundColor: props.player.color.code}}
                    >
                        <p className="font-black flex z-1 select-none"
                           style={{
                            color: props.player.color.isblack ? "black" : "white",
                            fontSize: height * 0.05   
                           }}
                           onClick={() => console.log('p')}

                        >
                            {props.player.number}
                        </p>
                    </div>
                    <p 
                        className="font-black text-normal text-center z-0 h-[20%] btn"
                    >
                        {props.player.name}
                    </p>
            </div>
        </Draggable>
    )
}


export default Piece