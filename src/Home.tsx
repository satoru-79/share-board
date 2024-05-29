import { useState, useEffect } from 'react'
import {auth,provider,db} from './firebase'
import {collection , getDocs, setDoc, doc, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom'
import { Player, ArrowObject } from './Board';
import BoardList from './components/BoardList';

type Props = {
    user:any
}

export type BoardData = {
    homePlayers: Player[],    
    awayPlayers: Player[],
    arrows: ArrowObject[],
    court: 0 | 1,
    ballPosition: {x:number, y:number},
    comment: string
}

export type BoardObject = {
    boards:BoardData[],
    key:string,
    userId: string,
    userName: string,
    title: string,
    boardType: 'オフェンス' | 'ディフェンス' | 'その他',
    ispublic: boolean,
    good: string[]
}




const Home:React.FC<Props> = (props) => {

    //公開された全てのボードデータを新着順に格納するstate
    const [defaultBoards, setDefaultBoards] = useState<any>([]);

    //作成したボードのデータを格納するstate
    const [myBoards, setMyBoards] = useState<any>([]);


    //作成したボード / 保存したボード の画面の切り替えを管理するstate
    const [active, setActive] = useState<number>(0);

     //保存したボードのデータを格納するstate
    const [savedBoards, setSavedBoards] = useState<BoardObject[]>([]);

    const getUserInfo = () => {
        const savedBoards = collection(db, 'savedBoards');
        getDocs(savedBoards).then((snapShot) => {
            const currentUserData = snapShot.docs.find((doc) => doc.id === auth.currentUser?.uid);
            if (auth.currentUser) {
                if (!currentUserData) {
                    setDoc(doc(db, 'savedBoards', auth.currentUser.uid), {
                        boards: [],
                    })
                } else {
                    setSavedBoards(currentUserData.data().boards);
                }
            }
        })
    }

    const getBoardInfo = () => {
        const boardRef = collection(db,'boards');
        const BoardData = query(boardRef, orderBy('timestamp','desc'))
        getDocs(BoardData).then((snapShot) => {
            const publicBoards = snapShot.docs.filter((doc) => doc.data().ispublic).map((doc) => ({...doc.data()}));
            setDefaultBoards(publicBoards);
            const myData = snapShot.docs.filter((doc) => doc.data().userId === auth.currentUser?.uid )
            setMyBoards(myData.map((doc) => ({...doc.data()})))
        })
    }

    

    useEffect(() => {
        getUserInfo();
        getBoardInfo();
    },[])

   


    return (
        <div className='px-3 bg-white'>
            <div className='flex flex-row h-16 w-full justify-between py-3'>
                <div className='flex flex-row gap-2'>
                    <p className='flex items-center font-black'>ユーザー :</p>
                    <div className='flex flex-row border border-black py-1 px-4 rounded-full justify-around'>
                        <div className='rounded-full h-full aspect-square mr-2'>
                            <img src={props.user && auth.currentUser?.photoURL} alt="" 
                                className='h-full rounded-full'
                            />
                        </div>
                        <p className='flex items-center font-black'>{auth.currentUser?.displayName}</p>
                    </div>
                </div>
                <div className='flex flex-row items-center gap-2'>
                    <Link className='btn hover:opacity-70' to={`/create_board?user=${auth.currentUser?.uid}`}
                              state={{
                                  board: null,
                              }}
                        >
                        <div className='px-3 py-2 bg-blue-500 rounded-full mb-1'>
                            <p className='font-black text-white'>+ ボードを作成</p>
                        </div>
                    </Link>
                    <Link to={'/information'}>
                        <p className='py-2 px-4 border border-silver text-white rounded-full bg-black btn
                                      hover:text-black hover:bg-white hover:border-black'
                        >
                            ?　ボードの使いかた
                        </p>
                    </Link>
                </div>
            </div>
            <div className='flex flex-col w-full mb-8'>
                <div className='w-full flex justify-around px-5 py-3 mb-5 items-end'>
                    <div className='w-[33%] flex justify-center'>
                        <p className='font-black select-none btn'
                           style={{fontSize: active === 0 ? 30 : 24,
                                   color: active === 0 ? 'black' : 'silver',
                                   borderBottom: active === 0 ? '2px solid black' : '2px solid silver' 
                           }}
                           onClick={() => setActive(0)}
                        >
                            Share Board
                        </p>
                    </div>
                    <div className='w-[33%] flex justify-center'>
                        <p className='font-black btn select-none'
                           style={{fontSize: active === 1 ? 30 : 24,
                                   color: active === 1 ? 'black' : 'silver',
                                   borderBottom: active === 1 ? '2px solid black' : '2px solid silver' 
                                 }}
                            onClick={() => setActive(1)}
                        >
                            My Board
                        </p>
                    </div>
                    <div className='w-[33%] flex justify-center'>
                        <p className='font-black btn select-none'
                           style={{fontSize: active === 2 ? 30 : 24,
                                   color: active === 2 ? 'black' : 'silver',
                                   borderBottom: active === 2 ? '2px solid black' : '2px solid silver' 
                                 }}
                           onClick={() => setActive(2)}
                        >
                            Saved Board
                        </p>
                    </div>
                </div>
                { active === 0 ?
                <BoardList defaultBoards={defaultBoards} name='share'
                           displayBoards={defaultBoards}
                           savedBoards={savedBoards}
                           setSavedBoards={setSavedBoards}

                />
                : active === 1 ?
                <BoardList defaultBoards={defaultBoards} name='own'
                           displayBoards={myBoards}
                           savedBoards={savedBoards}
                           setSavedBoards={setSavedBoards}
                />
                :
                <BoardList defaultBoards={defaultBoards} name='save'
                           displayBoards={savedBoards}
                           savedBoards={savedBoards}
                           setSavedBoards={setSavedBoards}
                />
                }
            </div>
        </div>
        )
}
           
export default Home