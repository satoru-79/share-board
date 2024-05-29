import Header from "./components/Header"
import { useEffect, useState } from "react"
import { BoardObject } from "./Home"
import BoardList from "./components/BoardList"
import {auth, db, provider} from './firebase'
import {collection, getDocs, setDoc, doc, query, orderBy} from 'firebase/firestore'
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"


const Personal = () => {

    const [user] = useAuthState(auth);

    const location = useLocation();

    const [searchParams] = useSearchParams();
    const userName = searchParams.get("username");
    const userId = searchParams.get("userid");

    const [displayBoards, setDisplayBoards] = useState<BoardObject[]>([]);

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

    function getBoardInfo() {
        const boardRef = collection(db,'boards');
        const BoardData = query(boardRef, orderBy('timestamp','desc'))
        getDocs(BoardData).then((snapShot) => {
            const boards:any = snapShot.docs.filter((doc) => doc.data().ispublic).map((doc) => ({...doc.data()}));
            setDisplayBoards(boards.filter((board:BoardObject) => 
                board.userId === userId
            ))
        })
        
    }


    useEffect(() => {
        getUserInfo();
        if (location.state) {
            setDisplayBoards(location.state.boards.filter((board:BoardObject) =>
                board.userId === userId
            ))
        } else {
            getBoardInfo();
        }
    },[])



    if (user) {    
        return(
        <div>
            <Header />
            <div className="p-5">
                <p className="font-black border-b-2 border-black text-xl mb-10">
                    {userName}
                    　の作成したボード
                </p>
                <BoardList defaultBoards={displayBoards} 
                           name='share' displayBoards={displayBoards}
                           savedBoards={savedBoards}
                           setSavedBoards={setSavedBoards}
                />

            </div>
        </div>
        )
    } else {
        return (
            <div>

            </div>
        )
    }
}

export default Personal