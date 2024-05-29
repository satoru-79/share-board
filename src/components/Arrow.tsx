import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import LeaderLine from 'leader-line-new'
import { useRef, useEffect, SetStateAction } from 'react';
import { ArrowObject, getCourtSize } from '../Board';
import { BoardData } from '../Home';


type Props = {
    arrow:ArrowObject;
    arrows: ArrowObject[];
    currentBoard: BoardData
    setCurrentBoard: React.Dispatch<SetStateAction<BoardData>>,
    type: "create" | "save" | "edit" | "share" | "" 
}

const Arrow:React.FC<Props> = (props) => {

    const element1Ref = useRef<HTMLDivElement>(null);
    const element2Ref = useRef<HTMLDivElement>(null);
    const lineRef = useRef<LeaderLine>();
    const height = getCourtSize('height');


    useEffect(() => {
      if (element1Ref.current && element2Ref.current) {
        const line = new LeaderLine(
          element1Ref.current,
          element2Ref.current,
        );

        line.setOptions({
            color:props.arrow.color,
            size: height > 500 ? 6 : 3 ,
            path: props.arrow.path,
            startPlug:props.arrow.startPlug,
            endPlug:props.arrow.endPlug, 
            dash: props.arrow.dash,
            startLabel:LeaderLine.pathLabel({
              text:props.arrow.startLabel,outlineColor:'black',
              fontSize: height > 500 ? 18 : 
              height > 400 ? 14 : height > 300 ? 12 : 10
            }),
            endLabel:  LeaderLine.pathLabel({
              text:props.arrow.endLabel,outlineColor:'black',
              fontSize: height > 500 ? 18 : 
              height > 400 ? 14 : height > 300 ? 12 : 10
            }),
        })

        lineRef.current = line;

          return () => {
            if (lineRef.current) {
              lineRef.current.remove();
            }
          }
      }
    }, [element1Ref,element2Ref]);


    

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
      if (lineRef.current) {
        lineRef.current.setOptions({ end: [data.x, data.y] });
        lineRef.current.position();
      }
    };

    const setStartPosition = (e: DraggableEvent, data: DraggableData) => { 
      //動かした矢印の視点の座標を更新する
        props.setCurrentBoard({...props.currentBoard, arrows: props.arrows.map((arrow) => 
          arrow.key === props.arrow.key ? {...props.arrow,startPosition:{x: data.x/getCourtSize('width'), y:data.y/getCourtSize('height')}}
                                        : arrow
        )})
      
    }

    const setEndPosition = (e: DraggableEvent, data: DraggableData) => {
      //動かした矢印の終点の座標を更新する
      props.setCurrentBoard({...props.currentBoard, arrows: props.arrows.map((arrow) => 
        arrow.key === props.arrow.key ? {...props.arrow,endPosition:{x: data.x/getCourtSize('width'), y:data.y/getCourtSize('height')}}
                                      : arrow
      )})
    }


    return (
        <div  className='' key={props.arrow.key}>
            <Draggable
                onDrag={handleDrag}
                onStop={setStartPosition}
                defaultPosition={{x: props.arrow.startPosition ? props.arrow.startPosition.x * getCourtSize('width') : 0 , 
                                  y: props.arrow.startPosition ? props.arrow.startPosition.y * getCourtSize('height') : 0 
                                }}   
            >
                <div ref={element1Ref} 
                     className='fixed absolute top-[50%] left-[50%] w-6 h-6  hover:cursor-pointer '
                     style={{backgroundColor: props.type === "share" || props.type === "save" ? undefined 
                                                                                              : "white",
                             height: height > 700 ? 24 : 16,
                             width: height > 700 ? 24 : 16
                             
                     }}
                >
                </div>
            </Draggable>
            <Draggable 
                onDrag={handleDrag}
                onStop={setEndPosition}
                //保存された座標がある場合、そこを初期位置にする
                defaultPosition={{x: props.arrow.endPosition ? props.arrow.endPosition.x * getCourtSize('width') : 0 , 
                                  y: props.arrow.endPosition ? props.arrow.endPosition.y * getCourtSize('height'): 0 
                }}   
            >
                <div 
                    ref={element2Ref}
                    className='fixed absolute top-[55%] left-[55%] hover:cursor-pointer '
                    style={{backgroundColor: props.type === "share" || props.type === "save" ? undefined 
                                                                                             : "white",
                            height: height > 700 ? 24 : 16,
                            width: height > 700 ? 24 : 16
                          }}  
                >
                </div>
            </Draggable>
        </div>
    
    )

}

export default Arrow;



