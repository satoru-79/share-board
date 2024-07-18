import './App.css'
import { Drawer,Tabs,Tab } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import BuildIcon from '@mui/icons-material/Build';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Draggable , {DraggableData, DraggableEvent}from 'react-draggable';
import Piece from './components/Piece';
import ColorMenu from './components/ColorMenu';
import ArrowSetting from './components/ArrowSetting'
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'
import CreateBoard from './CreateBoard'
import Preset from './components/Preset';
import { useLocation } from 'react-router-dom';
import {auth, db} from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BoardData, BoardObject } from './Home';
import ArrowList from './components/ArrowList';
import { useSearchParams } from 'react-router-dom';
import {collection, getDocs,  } from 'firebase/firestore'
import { PropertyDescriptorParsingType } from 'html2canvas/dist/types/css/IPropertyDescriptor';


export type Player = {
  key:string,
  name: string,
  number: string,
  side: 'home' | 'away',
  color:{
    code: string,
    isblack: boolean,
  },
  position: {
    x: number,
    y: number
  }
}

export type ArrowObject = {
  key:string,
  color:'black' | 'red' | 'blue' | 'white',
  path: 'straight' | 'arc' ,
  dash: boolean,
  startPlug: 'arrow1' | 'square' | 'behind' | 'hand' | 'arrow2',
  endPlug: 'arrow1' | 'square' | 'behind' | 'hand' | 'arrow2',
  reverse: boolean
  endLabel: string,
  startLabel:string,
  startPosition: {
    x: number,
    y: number
  },
  endPosition: {
    x: number,
    y: number
  }
}

export function getCourtSize(direction:string) {
  const court = document.getElementById('court');
  if (court) {
    if (direction === 'width') return court.offsetWidth;
    if (direction === 'height') return court.offsetHeight;
  } 
  return 1;
}

type Props = {
  type: 'share' | 'create' | 'save' | 'edit' | ''
}



const Board:React.FC<Props> = (props) => {

  const [user] = useAuthState(auth);

  const [searchParams] = useSearchParams();

  //Linkから飛んできた際に渡された情報を受け取る。
  const location = useLocation();

  const displayable = ((props.type === "create" || props.type === "edit") && (auth.currentUser?.uid === searchParams.get("user"))) ||
                      (props.type === "" ) || 
                      (( props.type === "share" || props.type == "save") && (user)) 
                      


  const [boardKey, setBoardKey] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [currentBoard, setCurrentBoard] = useState<BoardData>(
    {
      homePlayers:[],
      awayPlayers:[],
      arrows:[],
      court:0,
      ballPosition:{ x:0, y:0 },
      comment:""
    }
  );


  //ボード編集のdrawerの開閉を管理する変数--//
  const [open, setOpen] = useState(false);

  //-Tab関連の変数--//
  const [value, setValue] = useState<0 | 1>(0);
  const handleChange = (event:any, newValue:0 | 1) => {
      if ((props.type !== 'share') && ( props.type !== 'save')) {
        setValue(newValue);
        setCurrentBoard({...currentBoard, court: newValue})
      }
  }

  //--プレイヤー情報の変更に使う変数--//
  const [editFormVisible , setEditFormVisible] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<Player>({key:'', name:"", number:"", side:'home', color: {code:"red", isblack: false}, position: {x:0 , y:0 }});

  /*--------------------------//
  プレイヤーの情報を管理する変数・関数
  = フォームの内容が変化するたびにplayerステートを更新し、
  送信されたタイミングでcuurentBoardのplayersステートに追加。
  //----------------------------*/
  const [homePlayer, setHomePlayer] = useState<Player>({key:'', name:"", number:"", side:'home', color: {code:"red", isblack: false,}, position: {x:0 , y:0 }})
  const [awayPlayer, setAwayPlayer] = useState<Player>({key:'', name:"", number:"", side:'away', color: {code:"blue", isblack: false}, position: {x:0 , y:0 }})
    

  const changePlayerInfo = () => {
    if (editTarget.side === 'home') {
      setCurrentBoard(
        {...currentBoard, homePlayers:
          currentBoard.homePlayers.map((player) => player.key === editTarget.key ? editTarget : player)}  
      )
    } else {
      setCurrentBoard(
        {...currentBoard, awayPlayers:
          currentBoard.awayPlayers.map((player) => player.key === editTarget.key ? editTarget : player)
        }  
      )
    }
    setEditFormVisible(false);
  }

  const deletePlayer = () => {
    if (editTarget.side === 'home') {
      setCurrentBoard(
      {...currentBoard, homePlayers:
        currentBoard.homePlayers.filter((player) => player.key !== editTarget.key )
      } 
      )
    } else {
      setCurrentBoard(
      {...currentBoard, awayPlayers:
        currentBoard.awayPlayers.filter((player) => player.key !== editTarget.key)
      }
      )
    }
    setEditFormVisible(false);
  }


  /*------------------------//
  矢印を管理する変数・関数
  = 形や線のタイプなどを選択するごとにarrowステートを更新し、追加ボタンが押された時にarrowsステートに追加。 
  //------------------------*/
  const [arrow, setArrow] = useState<ArrowObject>({key:"",path:'straight',color:'black',startPlug:'behind',endPlug:'arrow1',dash:false,reverse:false,endLabel:"",startLabel:"",startPosition: {x: 0,y: 0}, endPosition: {x: 0,y: 0}});
  const [arrows, setArrows] = useState<ArrowObject[]>([]);
  
  const createArrow = () => {
    const copyArrow = arrow;
    if (copyArrow.reverse) setCurrentBoard({...currentBoard, arrows:   
    [...currentBoard.arrows, {...copyArrow,key:uuidv4(),endPlug:'behind',startPlug:copyArrow.endPlug, startLabel:copyArrow.endLabel, endLabel: ""}]})
    else setCurrentBoard({...currentBoard, arrows : [...currentBoard.arrows, {...copyArrow, key:uuidv4()}]});
  }


    

  const updateBallPosition = (e:DraggableEvent, data: DraggableData) => { 
    setCurrentBoard({...currentBoard, ballPosition: {x: data.x/getCourtSize('width') , y:data.y/getCourtSize('height')}});
    
  }

  const getBoardInfo = () => {
    const boardRef = collection(db,'boards');
    getDocs(boardRef).then((snapShot) => {
        const targetData = snapShot.docs.find((doc) => doc.data().key === searchParams.get("key"))?.data();
        console.log(targetData);
        setBoards(targetData?.boards)
        setCurrentBoard(targetData?.boards[0])
        setBoardKey(targetData?.key);
        setBoardTitle(targetData?.title);
    })
  }

  useEffect(() => {
    /*----------------------------------------------//
    作成済みのボードや公開中のボードを開く時に、
    すでに決まっているプレイヤーや矢印の情報をステートに代入する
    //----------------------------------------------*/
    if (location.state) {
      if (location.state.boards) { 
        setBoards(location.state.boards);
        setCurrentBoard(location.state.boards[0]);
        setBoardKey(location.state.key);
        setBoardTitle(location.state.title);
      }
    } else {
      getBoardInfo()
    }
  },[])

  useEffect(() => {
    if (currentBoard.court === 0) {
      setValue(0);
    } else {
      setValue(1);
    }
    setArrows(currentBoard.arrows);
  },[currentBoard])

  //ボード全体の情報を入れるステート
  const [boards, setBoards] = useState<any>([
    {
      homePlayers:[],
      awayPlayers:[],
      arrows:[],
      court: 0,
      ballPosition:{x:0,y:0},
      comment:""
    }
  ]);

  //何枚目のボードを操作しているかを管理する変数
  const [page, setPage] = useState<number>(0);


  //次のページに遷移する関数
  const toNextPage = () => {
    const copyBoards = [...boards];
    copyBoards[page] = currentBoard;
    const newPage = page + 1; 
    if (page < 9) {
      if ((copyBoards.length === newPage) && ((props.type === 'create') || (props.type === 'edit'))){
        copyBoards.push(currentBoard);
      }
      setBoards(copyBoards);
      if (((props.type === 'create') || (props.type === 'edit') ||(boards.length !== newPage))) {
        setPage(newPage);
        setCurrentBoard(copyBoards[newPage]);
      }
    }
  }

  //前のページに遷移する関数
  const toPrevPage = () => {
    const copyBoards = [...boards];
    copyBoards[page] = currentBoard;
    setPage(page - 1);
    setCurrentBoard(copyBoards[page - 1]);
    setBoards(copyBoards);
  }

  const deleteCurrentBoard = () => {
    setBoards(boards.filter((board:BoardData,index:number) => index !== page))
    if (page !== 0) {
      setCurrentBoard(boards[page - 1]);
      setPage(page - 1);
    } else {
      setCurrentBoard(boards[page + 1]);
    }
  }

  console.log(user);
  console.log(searchParams.get("user"));


    
  if (displayable) {
    return(
      <div>
        <div id='tab-area' className='w-full '>  
          <Tabs value={value} onChange={handleChange} indicatorColor="primary"
                textColor="inherit" aria-label="simple tabs example"
                sx={{
                  bgcolor:"rgb(23 37 84)", 
                  width:"100%",
                }}  
          >
            <Tab label="ALL COURT" sx={{color:'white'}}/>
            <Tab label="HALF COURT" sx={{color:'white'}} />
            
            <div className='flex items-center  justify-end w-full'>
              <div className='h-full flex justify-center items-center 
                             absolute left-[30%]'
              >
                <p className='text-white font-black'
                   style={{fontSize: window.innerWidth < 850 ? 12: 16}}
                >
                  ID : {boardKey}
                </p>
              </div>
              { (props.type === 'create' || props.type === 'edit') &&
                <p className='bg-red-500 absolute left-[70%] flex items-center px-2 py-1 btn 
                              rounded-full hover:bg-white text-white hover:text-red-500 font-black'
                   onClick={() => boards.length !== 1 && deleteCurrentBoard()}
                   style={{fontSize: window.innerWidth < 850 ? 12: 16}}
                > 
                  このページを削除
                </p>
              }
              <div id='drawer-open-btn' onClick={() => setOpen(!open)} 
                   className='btn flex items-center justify-center mr-5 bg-blue-500 
                              h-9 w-9 rounded-full fixed z-20 '
              >
                  <BuildIcon sx={{color: "white", width:"60%"}}/>
              </div>
            </div>
          </Tabs>

          {/*--オールコート選択時--*/}
          <div
            role="tabpanel"
            hidden={value !== 0}
            id={`simple-tabpanel-$0`}
            aria-labelledby={`simple-tab-0`}

          >
            {value === 0 && 
            (
              <div className="h-screen bg-orange-400 overflow-hidden flex items-center justify-center"              
                   key={uuidv4()}
              >
                <div className='w-full h-full'>
                  <div className='flex flex-row w-full items-center justify-center 
                                  h-full '>                 
                    <div className='h-full aspect-[1.4] flex flex-row flex-wrap bg-court-img bg-contain bg-no-repeat bg-center absolute'
                         id='court'
                    >

                    <ArrowList arrows={arrows} currentBoard={currentBoard} 
                               setCurrentBoard={setCurrentBoard} type={props.type}
                    />

                    {currentBoard.homePlayers.map((player,index) => {
                      return (
                        <Piece player={player} editFormVisible={editFormVisible}
                               setEditFormVisible={setEditFormVisible}
                               setEditTarget={setEditTarget}  size={0.1}
                               setPlayers={setCurrentBoard}
                               players={currentBoard.homePlayers}
                               currentBoard={currentBoard}
                               key={index}
                        />
                      )
                    })}
                    <Draggable
                      onStop={updateBallPosition}
                      bounds='parent'
                      defaultPosition={{x: currentBoard.ballPosition.x * getCourtSize('width'),y: currentBoard.ballPosition.y * getCourtSize('height')}}   
                    >
                      <div className='hover:cursor-pointer z-30 absolute top-[50%] left-[50%] aspect-square'
                           style={{height: getCourtSize('height') * 0.06}}
                      >
                        <img src='images/ball.png' alt="aaa" className='h-full pointer-events-none' />
                      </div>
                    </Draggable>
                    {currentBoard.awayPlayers.map((player,index) => {
                      return (
                        <Piece player={player} editFormVisible={editFormVisible}
                               setEditFormVisible={setEditFormVisible}
                               setEditTarget={setEditTarget}  size={0.1}
                               setPlayers={setCurrentBoard}
                               players={currentBoard.awayPlayers}
                               currentBoard={currentBoard}
                               key={index}
                        />
                      )
                    })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/*--ハーフコート選択時--*/}
          <div
            role="tabpanel"
            hidden={value !== 1}
            id={`simple-tabpanel-$1`}
            aria-labelledby={`simple-tab-1`}
          >
            {value === 1 && (
              <div className="h-screen bg-orange-400 overflow-hidden flex items-center justify-center"
                   key={uuidv4()}              
              >
                <div className='w-full h-full'>
                  <div className='flex flex-row w-full items-center justify-center 
                                  h-full'> 
                    <div className='h-full aspect-[1.4] flex flex-row flex-wrap bg-half-court-img bg-contain bg-no-repeat bg-center absolute'
                         id='court'
                    >

                    <ArrowList arrows={arrows} currentBoard={currentBoard} 
                               setCurrentBoard={setCurrentBoard} type={props.type}
                    />

                    {currentBoard.homePlayers.map((player,index) => {
                      return (
                        <Piece player={player} editFormVisible={editFormVisible}
                               setEditFormVisible={setEditFormVisible}
                               setEditTarget={setEditTarget}  size={0.12}
                               setPlayers={setCurrentBoard}
                               players={currentBoard.homePlayers}
                               currentBoard={currentBoard}
                               key={index}
                        />
                      )
                    })}
                    <Draggable 
                      bounds='parent'
                      onStop={updateBallPosition}
                      defaultPosition={{x:currentBoard.ballPosition.x * getCourtSize('width'), y:currentBoard.ballPosition.y * getCourtSize('height')}}
                    >
                      <div className='hover:cursor-pointer z-20 absolute top-[50%] left-[50%]'
                           style={{height: getCourtSize('height') * 0.08}}
                      >
                        <img src="images/ball.png" alt="" className='h-full pointer-events-none' />
                      </div>
                    </Draggable>
                    {currentBoard.awayPlayers.map((player,index) => {
                      return (
                        <Piece player={player} editFormVisible={editFormVisible}
                               setEditFormVisible={setEditFormVisible}
                               setEditTarget={setEditTarget}  size={0.12}
                               setPlayers={setCurrentBoard}
                               players={currentBoard.awayPlayers}
                               currentBoard={currentBoard}
                               key={index}
                        />
                      )
                    })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>   
          <div className='flex justify-center items-center w-[100%]'
              >
                <p className='font-black text-black'>ページ : {page + 1} / {boards.length}</p>
          </div>
          { props.type !== '' &&
          <div className='h-[50vh] w-full bg-white flex justify-center mt-10 mb-20'
               
          >
              <textarea name="" id="" className='h-full w-[70%] border border-black bg-slate-100 rounded-md p-2'
                key={page}
                style={{fontSize: window.innerHeight > 700 ? 20  
                                                           : 16
                }}   
                placeholder='コメントを入力'
                defaultValue={currentBoard.comment}
                onChange={(e) => {
                  setCurrentBoard({...currentBoard, comment: e.target.value});
                }}
              >
              </textarea>
          </div>
          }    
        </div>


        {/*--Drawerエリア--*/}
        <Drawer anchor='right' open={open} variant='persistent'>
          <div className='w-[200px] bg-slate-300'>
            <div  id='drawer-title'
                  className=' p-2 w-[200px] h-[50px] flex items-center justify-between bg-black fixed z-90'
            >
              <p className='text-2xl text-white w-1/5 btn text-center'
                 onClick={() => {setOpen(!open);setEditFormVisible(false)}}
              >
                ×
              </p>
              <p className='text-white text-ml font-bold '>ボードを編集</p> 
              <div className='w-1/5'></div>
            </div>
            <div  id='drawer-content' className='w-full flex items-center flex-col mt-[50px]'>

              {/*--Homeチームのエリア--*/}
              <div className='flex flex-row border-b border-b-black items-center my-3'>
                <p className='text-black font-black my-1 px-5 text-ms'>HOME チーム</p>
                <div className='h-6 aspect-square bg-white rounded-full flex items-center justify-center btn ml-1'
                         onClick={() => setCurrentBoard({...currentBoard,homePlayers:[]})}
                    >
                      <RestartAltIcon />
                    </div>
              </div>
              <div className='my-3'>
                <form id='home-add-player-form' 
                      className='flex flex-col justify-center items-center'
                      onSubmit={(e) => {
                        e.preventDefault();
                        setHomePlayer({...homePlayer,key: uuidv4()})
                        const copyHomePlayer = homePlayer;
                        setCurrentBoard({...currentBoard,homePlayers:[...currentBoard.homePlayers,copyHomePlayer]});
                      }}
                >
                  <div id='drawer-home-addplayer-title'
                       className='flex flex-row h-6 justify-center' 
                  >
                    <p className='font-black mr-4'>+ プレイヤーを追加</p>                                                                   
                    <ColorMenu  player={homePlayer} setPlayer={setHomePlayer}/>
                  </div>
                  <input  type="text" placeholder='名前' 
                          className='border border-black rounded-md w-4/5 my-1 pl-1'
                          onChange={(e) => {setHomePlayer({...homePlayer,name: e.target.value})}}
                  />
                  <input  type="number" placeholder='背番号'
                          className='border border-black rounded-md w-4/5 my-1 pl-1'
                          onChange={(e) => setHomePlayer({...homePlayer,number: e.target.value})}
                  />
                  <input  type="submit" value='追加' 
                          className='drawerButton'
                  />
                </form>
                { auth.currentUser &&
                <Preset players={currentBoard.homePlayers} player={homePlayer} setCurrentBoard={setCurrentBoard}
                        currentBoard={currentBoard} side='home'
                />
                }
              </div>

              {/*--Awayチームのエリア--*/}
              <div className='flex flex-row border-b border-b-black items-center my-3 '>
                <p className='text-black font-black my-1 px-5 text-ms'>AWAY チーム</p>
                <div className='h-6 aspect-square bg-white rounded-full flex items-center justify-center btn ml-1'
                         onClick={() => setCurrentBoard({...currentBoard,awayPlayers:[]})}
                    >
                      <RestartAltIcon />
                    </div>
              </div>
              <div className='my-3'>
                <form id='away-add-player-form' action=""
                      className='flex flex-col justify-center items-center'
                      onSubmit={(e) =>  {
                        e.preventDefault();        
                        setAwayPlayer({...awayPlayer,key: uuidv4()})
                        const copyAwayPlayer = awayPlayer;
                        setCurrentBoard({...currentBoard, awayPlayers:[...currentBoard.awayPlayers, copyAwayPlayer]});
                      }}
                > 
                  <div id='drawer-away-addplayer-title' 
                       className='flex flex-row h-6 justify-center '
                  >
                    <p className='font-black mr-4'>+ プレイヤーを追加</p>  
                    <ColorMenu  player={awayPlayer} setPlayer={setAwayPlayer}/>
                  </div>
                  <input  type="text" placeholder='名前'
                          className='border border-black rounded-md w-4/5 my-1 pl-1 '
                          onChange={(e) => setAwayPlayer({...awayPlayer,name: e.target.value})}
                  />
                  <input  type="number" placeholder='背番号' 
                          className='border border-black rounded-md w-4/5 my-1 pl-1'
                          onChange={(e) => setAwayPlayer({...awayPlayer,number: e.target.value})}
                  />
                  <input  type="submit" value='追加'
                          className='drawerButton'
                  /> 
                </form>
                { auth.currentUser &&
                <Preset players={currentBoard.awayPlayers} player={awayPlayer} setCurrentBoard={setCurrentBoard}
                        currentBoard={currentBoard} side='away'
                />
                }
              </div>  
              {/*--編集用フォームのエリア--*/}
              <div >
                <form id='edit-player-form' action=""
                      className='flex flex-col items-center my-3'
                      style={{visibility: editFormVisible ? 'visible' : 'hidden',
                              height: editFormVisible ? undefined : 0
                      }}
                >
                  <div id='drawer-editplayer-title' 
                       className='flex flex-row h-6 justify-center'
                  >
                    <p className='font-black mr-4'>　プレイヤーを編集</p>  
                    <ColorMenu  player={editTarget} setPlayer={setEditTarget}/>
                  </div>   
                  <input  type="text" placeholder='名前を変更'
                          className='border border-black rounded-md w-4/5 my-1 pl-1'
                          value={editTarget.name}
                          onChange={(e) => setEditTarget({...editTarget,name: e.target.value})}
                  />               
                  <input  type="number" placeholder='背番号を変更' 
                          className='border border-black rounded-md w-4/5 my-1 pl-1'
                          value={editTarget.number}
                          onChange={(e) => setEditTarget({...editTarget,number: e.target.value})}
                        
                  />
                  <div className='flex justify-around w-2/3'>
                    <input  type="submit" value='変更' 
                            className='drawerButton w-2/5'
                            onClick={(e) => {
                              e.preventDefault();
                              changePlayerInfo();
                            }}
                    />
                    <input type="submit" value='削除' 
                           className='drawerButton w-2/5'
                           onClick={(e) => {e.preventDefault();deletePlayer()}}
                    />
                  </div>            
                </form>
              </div>

              {/*--矢印の管理をするエリア--*/}
              <div id='arrow-area-title'
                   className='w-2/3 h-7 border-b border-b-black flex justify-between'
              >
                  <p className='font-black text-ml' >矢印</p>
                  <div className='flex flex-row'>
                    <div className='h-6 aspect-square bg-black rounded-full flex items-center justify-center btn mr-1'
                         onClick={() => setCurrentBoard({...currentBoard, 
                          arrows: currentBoard.arrows.filter((arrow, index) => index !== currentBoard.arrows.length -1)}
                        )}
                    >
                      <NavigateBeforeIcon  sx={{color: 'white'}}/>
                    </div>
                    <div className='h-6 aspect-square bg-white rounded-full flex items-center justify-center btn ml-1'
                         onClick={() => setCurrentBoard({...currentBoard, arrows: []})}
                    >
                      <RestartAltIcon />
                    </div>
                  </div>
              </div>
              <form action=""
                    className='py-4'
                    onSubmit={(e) => {
                      e.preventDefault();
                      createArrow();
                    }}
              >
                <div id='arrow-type-and-color-title'
                     className='flex justify-start w-full mt-2 pl-4 '
                >
                  <p className='text-sm font-black'>線のタイプと色を設定</p>
                </div>
                <ArrowSetting 
                  urls={
                    ['images/straight_arrow_black.png',
                      'images/straight_arrow_red.png',
                      'images/dash_arrow_black.png',
                      'images/dash_arrow_red.png',
                    ]
                  }
                  options={['black','red','black','red']}
                  arrow={arrow}
                  setArrow={setArrow} 
                  property='color'
                />
                <div id='arrow-endplug-title'
                     className='flex justify-start w-full mt-2 pl-4'
                >
                  <p className='text-sm font-black'>先端の形を設定</p>
                </div>
                <ArrowSetting 
                  urls={
                    [ 'images/straight_arrow_black.png',
                      'images/arrow2_arrow.png',
                      'images/square_arrow.png',
                      'images/disc_arrow.png',
                      'images/hand_arrow.png'
                    ]
                  }
                  options = {['arrow1','arrow2','square','disc','hand']}
                  arrow={arrow}
                  setArrow={setArrow} 
                  property='endPlug'
                />
                <div id='arrow-path-title'
                     className='flex justify-start w-full mt-3 pl-4'
                >
                  <p className='text-sm font-black'>線の軌道を設定</p>
                </div>
                <ArrowSetting 
                  urls={
                    ['images/straight_arrow_black.png',
                      'images/arc_arrow.png',
                      'images/arc_arrow_reverse.png',
                    ]
                  }
                  options={['straight','arc','arc']} 
                  arrow={arrow}
                  setArrow={setArrow} 
                  property='path'
                />
                <div id='arrow-label-title'
                     className='flex justify-start w-full mt-3 pl-4'
                >
                  <p className='text-sm font-black'>矢印に文字を追加</p>
                </div>
                <div className='flex justify-center mt-3'>
                  <input type="text"  
                         className='border border-black rounded-md w-4/5 my-1 pl-1'
                         onChange={(e) => setArrow({...arrow,endLabel:e.target.value})}
                  />
                </div>
                <div className='flex justify-center mt-3'>
                  <input type="submit" value={'追加'} 
                         className='drawerButton'
                  />
                </div>
              </form>
              
            </div>
          </div>         
        </Drawer>
        { props.type !== '' &&
        <div className='flex flex-row justify-around w-full fixed top-[90%] z-30 border-black'>
          <p className="border border-blue-950 px-4 py-2 btn text-center text-white 
                        bg-blue-950  hover:bg-white hover:text-blue-950 "
             onClick={() => {
              page !== 0 && toPrevPage(); 
             }}
            >
                {'<'} 前のボード
            </p>
          { props.type === 'create' ?
          <CreateBoard boardKey={boardKey}
                       boardData={boards}
                       currentBoard={currentBoard}
                       setBoards={setBoards}
                       page={page}
                       type='create'
                       title=''
          /> 
          : props.type === 'edit' &&
          <CreateBoard boardKey={boardKey}
                       boardData={boards}
                       currentBoard={currentBoard}
                       setBoards={setBoards}
                       page={page}
                       type='edit'
                       title={boardTitle}
          /> 
          }
          <p className="border border-blue-950 px-4 py-2 btn text-center text-white bg-blue-950
                          hover:bg-white hover:text-blue-950 "
             onClick={() =>  toNextPage()}
            >
                次のボード &gt;
          </p>
        </div>
        }
      </div>        
    )
  } else {
    return (
      <div>

      </div>  
    )
  }
}

export default Board;