import Header from "./components/Header"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { BoardObject } from "./Home"
import BoardList from "./components/BoardList"
import {auth, db, provider} from './firebase'
import {collection, getDocs, setDoc, doc} from 'firebase/firestore'



const Personal = () => {

    const location = useLocation();

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

    useEffect(() => {
        getUserInfo()
        if (location.state) {
            setDisplayBoards(location.state.boards.filter((board:BoardObject) =>
                board.userId === location.state.id
            ))
        }
    },[])


    return(
    <div>
        <Header />
        {location.state &&
        <div className="p-5">
            <p className="font-black border-b-2 border-black text-xl mb-10">
                {location.state.name}
                　の作成したボード
            </p>
            <BoardList defaultBoards={displayBoards} 
                       name='share' displayBoards={displayBoards}
                       savedBoards={savedBoards}
                       setSavedBoards={setSavedBoards}
            />

        </div>
        }
    </div>
    )
}

export default Personal