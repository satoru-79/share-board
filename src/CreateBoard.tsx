import { SetStateAction, useState, useEffect } from "react" 
import { db , auth} from './firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Modal from 'react-modal';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import { BoardData } from "./Home";

type Props = {
    boardKey: string,
    boardData: BoardData[],
    setBoards: React.Dispatch<SetStateAction<BoardData[]>>,
    page: number,
    currentBoard: BoardData,
    title: string,
    type: 'create' | 'edit'
}


const CreateBoard:React.FC<Props> = (props) => {

    //モーダル回芸を管理するステート
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [title,setTitle] = useState<string>('');
    const [boardType, setBoardType] = useState('オフェンス');
    const [ispublic, setIsPublic] = useState(true);

    function updateLastBoard() {
        console.log(props.page)
        const copyBoards = [...props.boardData];
        copyBoards[props.page] = props.currentBoard;
        props.setBoards(copyBoards);
    }

    
    function completeBoard() {
        if (auth.currentUser) {
            const key = uuidv4()
            if (props.type === 'create') {
                setDoc(doc(db,'boards',key), {
                    key:key,
                    boards: props.boardData,
                    boardType: boardType,
                    title: title,
                    ispublic: ispublic,
                    userId: auth.currentUser.uid,
                    userName: auth.currentUser.displayName,
                    good: [],
                    timestamp: serverTimestamp()
                })
            } else {
                if (title === '') {
                    console.log('');
                    console.log(props.boardData);
                    updateDoc(doc(db,'boards', props.boardKey), {
                        boards: props.boardData,
                        boardType: boardType,
                        ispublic: ispublic,
                    })
                } else {
                    console.log('a');
                    console.log(props.boardData);
                    updateDoc(doc(db,'boards', props.boardKey), {
                        boards: props.boardData,
                        boardType: boardType,
                        title: title,
                        ispublic: ispublic,
                    })
                }
            }
        }
    }


    return (

        <div className="items-center ">
            <p className="border px-4 py-2 btn text-center text-white bg-blue-950
                          hover:bg-white hover:text-blue-950 hover:border-blue-950"
               onClick={() => {
                setEditModalIsOpen(true);
                updateLastBoard();
               }}
            >
            { props.type === 'create' ? '作成' : '編集'
            }
            </p>
            <Modal 
                isOpen={editModalIsOpen}
                onRequestClose={() => setEditModalIsOpen(false)}
                ariaHideApp={false} 
                style={{
                    overlay: {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      zIndex: 900
                    },
                    content: {
                      position: 'absolute',
                      top: '10%',
                      left: '30%',
                      right: '30%',
                      bottom: '10%',
                      border: '1px solid #ccc',
                      background: 'white',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '4px',
                      outline: 'none',
                      padding: '15px',
                    }
                }}
            >          
                <div className="h-full">
                    <div className="h-8 flex items-center justify-between">   
                        <div className='h-full aspect-square hover:bg-slate-300 flex 
                                        items-center justify-center rounded-full btn'
                        >
                            <ClearIcon onClick={() => {setEditModalIsOpen(false)}} 
                                       className='h-full'
                            />
                        </div>   
                        <div className="">
                            <p className="font-black text-xl">
                                {props.type === 'create' ? 'ボード作成' : 'ボード編集'}
                            </p>
                        </div>
                        <div className="h-full aspect-square"></div>
                    </div>
                    <form className="flex flex-col justify-between mt-10 h-3/4"
                    >
                        <div  className="flex flex-col items-center w-full ">
                            <p className="font-black mb-3">ボードのタイトル</p>
                            <input type="text" onChange={(e) => setTitle(e.target.value)}
                                   className="bg-slate-200 rounded-[5px] w-2/3 py-1 px-1"
                                   placeholder="ボードのタイトルを入力"
                                   defaultValue={props.title}
                            />
                        </div>
                        <div  className="flex flex-col items-center w-full">
                            <p className="font-black mb-3">戦術の種類</p>
                            <div className="flex flex-row border w-2/3 py-1 justify-around"> 
                                <div>
                                    <input type="radio" id="offence" name="type" 
                                           defaultChecked onChange={() => setBoardType('オフェンス')}
                                    />
                                    <label htmlFor="offence">オフェンス</label>
                                </div>
                                <div>
                                    <input type="radio" id='defence' name="type"  
                                           onChange={() => setBoardType('ディフェンス')}
                                    />
                                    <label htmlFor="defence">ディフェンス</label>
                                </div>
                                <div>
                                    <input type="radio" id='others' name="type"  
                                           onChange={() => setBoardType('その他')}
                                    />
                                    <label htmlFor="others">その他</label>
                                </div>
                                
                            </div>
                        </div>
                        <div  className="flex flex-col items-center w-full">
                            <p className="font-black mb-3">ボードを公開</p>
                            <div className="flex flex-row border w-2/3 py-1 justify-around"> 
                                <div>
                                    <input type="radio"  id="public" name="ispublic" value="public" 
                                           defaultChecked onChange={() => setIsPublic(true)}
                                    />
                                    <label htmlFor="public">する</label>
                                </div>
                                <div>
                                    <input type="radio" id="private" name="ispublic" value="private" 
                                           onChange={() => setIsPublic(false)}
                                    />
                                    <label htmlFor="private">しない</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center ">
                            <Link to={'/'}  onClick={() => completeBoard()}>
                                <input type="submit" value='保存' 
                                       className="font-black border border-black px-2 py-1 btn 
                                                  hover:bg-black hover:text-white"
                                />
                            </Link>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
        
        
        
    )

}


export default CreateBoard;
