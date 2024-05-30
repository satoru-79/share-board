import { SetStateAction, useState } from "react";
import '../App.css'
import { ArrowObject } from "../Board";
import {v4 as uuidv4} from 'uuid'


type Props = {
    urls: string[],
    options:any
    arrow: ArrowObject,
    setArrow: React.Dispatch<SetStateAction<ArrowObject>>,
    property: 'color' | 'endPlug' | 'path'
}


const ArrowSetting:React.FC<Props> = (props) => {

    let [activeImg,setActiveImg] = useState<number>(20);  

    const setArrowOption = (property: string, index:number) => {
        if(property === 'color') {
            if (index > 1) props.setArrow({...props.arrow,color:props.options[index],dash:true});
            else           props.setArrow({...props.arrow,color:props.options[index],dash:false});
        }
        else if(property === 'endPlug') props.setArrow({...props.arrow, endPlug:props.options[index]})
        else if(property === 'path') {
            if (index === 2) props.setArrow({...props.arrow, path:props.options[index],reverse:true});
            else             props.setArrow({...props.arrow, path:props.options[index],reverse:false});
        }
        
    }

    return (
        <div id='arrow-type-and-color-images'
             className='flex flex-row overflow-scroll mt-3 '
             key={uuidv4()}
        >
            { props.urls.map((url,index) => {
                return(
                    <img src={url} alt="" 
                         className="arrow-img z-1"
                         style={{border: activeImg === index ? '2px solid black': undefined}}
                         onClick={() => {
                            setArrowOption(props.property,index);
                            setActiveImg(index)
                        }}
                        key={uuidv4()}
                    />
                )
                    
            })}
                  
        </div>    
    )

}

export default ArrowSetting;