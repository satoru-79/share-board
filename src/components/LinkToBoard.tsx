import '../App.css'
import { Link } from 'react-router-dom'
import { arrayRemove, arrayUnion, deleteDoc, doc ,updateDoc} from 'firebase/firestore';
import {auth, db} from '../firebase';
import { SetStateAction, useState, useEffect } from 'react';
import { BoardObject } from '../Home';
import AnnounceModal from './AnnounceModal'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';


type Props = {
    board:BoardObject,
    index:number,
    type: 'share' | 'own' | 'save' ,
    defaultBoards: BoardObject[],
    savedBoards: BoardObject[],
    setSavedBoards: React.Dispatch<SetStateAction<BoardObject[]>>
}

const LinkToBoard:React.FC<Props> = (props) => {

    const [gooded, setGooded] = useState(false);

    const [alreadySaved, setAlreadySaved] = useState(false)

    useEffect(() => {
        if (auth.currentUser) {
            if (props.board.good.indexOf(auth.currentUser.uid) >= 0) {
                setGooded(true);
            } else {
                setGooded(false);
            }
        }
    },[])

    useEffect(() => {
        setAlreadySaved(props.savedBoards.find((board) => board.key === props.board.key) !== undefined);
    },[props.savedBoards])


    const deleteBoard = () => {
        deleteDoc(doc(db,'boards',props.board.key));
        props.setSavedBoards(props.savedBoards.filter((board:BoardObject, index:number) => index !== props.index));
    }

    const saveBoard = () => {
        if (auth.currentUser) {
            updateDoc(doc(db,'savedBoards', auth.currentUser.uid),{
                boards: arrayUnion(props.board)
            });
        }

        props.setSavedBoards((prevSavedBoard:BoardObject[]) => [...prevSavedBoard,props.board])

    }

    const removeBoard = () => {
        if (auth.currentUser) {
            updateDoc(doc(db, 'savedBoards', auth.currentUser.uid),{
                boards: arrayRemove(props.board)
            });
        }
        props.setSavedBoards(props.savedBoards.filter((board) => board !== props.board))
    }

    const changeGooded = () => {
        if (gooded) {
            updateDoc(doc(db,'boards', props.board.key), {
                good: arrayRemove(auth.currentUser?.uid)
            })
        } else {
            updateDoc(doc(db,'boards', props.board.key), {
                good: arrayUnion(auth.currentUser?.uid)
            })
        }
        setGooded(!gooded)

    }


    return (
        <div className="rounded-[20px] w-[24%] border-2 border-black shadow-md h-[160px] bg-white mr-[0.5%] ml-[0.5%]
                        btn flex flex-col items-center justify-start overflow-hidden z-10 hover:border-orange-400 relative"    
             style={{backgroundColor: props.board.boardType === 'オフェンス'   ? 'rgb(220 38 38)' :
                                      props.board.boardType === 'ディフェンス' ? 'rgb(37 99 235)' 
                                                                             : 'rgb(22 163 74)'
             }}               
        >
            <Link to={
                props.type === 'own' ? `/edit_board?key=${props.board.key}&user=${auth.currentUser?.uid}`
                                      : `/view_board?key=${props.board.key}`   
                }
                state={{
                    boards: props.board.boards,
                    title: props.board.title,
                    key: props.board.key
                }} 
                className='h-full w-full'
            >
                <div className='h-full w-full '>
                    <div className='bg-slate-600 h-[50%] w-full flex justify-center'>
                        {props.board.boards[0].court === 0 ?
                            <div 
                                className='bg-orange-400 h-full aspect-[1.4] bg-court-img bg-contain
                                           bg-center bg-no-repeat'
                            >
                            </div>
                        :
                            <div 
                                className='bg-half-court-img h-full aspect-[1.4] bg-contain 
                                           bg-center bg-no-repeat bg-orange-400'
                            >
                            </div>
                
                        }
                    </div>
                    <div className='flex justify-between items-center flex-col text-center w-full h-[30%] flex-nowrap overflow-hidden'>
                        <p className='font-black text-base h-[50%] flex overflow-scroll text-white w-full items-center justify-center'>
                            {props.board.title}
                        </p>
                        <div className='flex flex-row w-full h-[50%] overflow-hidden justify-center items-center'>
                            { props.type === 'own' && 
                            <p className='font-black text-sm text-white'>
                                {props.board.ispublic ? '公開中': '非公開'}
                            </p>
                            }
                        </div>
                    </div>
                </div>
            </Link> 
            { props.type !== 'own' &&
                <Link to ={`/user_page?username=${props.board.userName}&userid=${props.board.userId}`}
                      state={{
                        boards: props.defaultBoards,
                      }}
                      className='font-black text-sm text-white hover:border-b border-white absolute top-[65%]'
                >
                    投稿者 : {props.board.userName}
                </Link>
            }
            {props.type === 'own' ? 
            <div className='h-[15%] flex justify-center gap-4 absolute top-[80%]'>
                <div className='flex items-center gap-1 py-2 px-2 '>
                    <ThumbUpOffAltIcon sx={{height: 20, color:'white'}}/>
                    <p className='text-white '>{props.board.good.length}</p>
                </div>
                <AnnounceModal buttonValue='削除' action={deleteBoard}/>
            </div>
            : props.type === 'save' ?
            <div className='h-[15%] flex justify-center gap-2 absolute top-[80%]'>
                <div className='flex items-center gap-1 py-2 px-2'>
                    <ThumbUpOffAltIcon sx={{height: 20, color:'white'}}/>
                    <p className='text-white '>{props.board.good.length}</p>
                </div>
                <AnnounceModal buttonValue='保存解除' action={removeBoard}/>
            </div>
            :
            <div className='h-[15%] flex justify-center gap-2 absolute top-[80%]'>
                <div className='bg-white flex items-center gap-1 py-2 px-2 border rounded-full btn hover:border-black'
                    onClick={() => changeGooded()}
                >
                    { gooded ? 
                    <ThumbUpAltIcon sx={{height: 20}} />
                    :
                    <ThumbUpOffAltIcon sx={{height: 20}}/>
                    }
                    <p className='text-black '>{props.board.good.length}</p>
                </div>
                { alreadySaved ? 
                <p className='font-black text-sm border border-black mb-1 px-1 rounded-[5px] text-white
                              bg-black z-50 h-full text-center '
                >
                    保存済み
                </p>
                :
                <p className='font-black text-sm border border-black mb-1 px-1 rounded-[5px] btn text-black
                              hover:bg-blue-950 hover:text-white z-50 h-full text-center bg-white'
                   onClick={() => saveBoard()}
                >
                    保存
                </p>
                }
            </div>
            }
        </div>   
    )

}


export default LinkToBoard;