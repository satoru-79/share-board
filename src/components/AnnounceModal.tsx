import { SetStateAction } from 'react';
import Modal from 'react-modal';
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear'

type Props = {
    buttonValue:'削除' | '保存解除',
    action: Function
}

const AnnounceModal:React.FC<Props> = (props) => {

    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    return (
        <div className=''>
                <p className='font-black text-sm border border-black mb-1 px-1 rounded-[5px] btn text-black
                              hover:bg-blue-950 hover:text-white z-50 h-full text-center bg-white'
                   onClick={() => setEditModalIsOpen(true)}
                >
                    {props.buttonValue}
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
                      top: '35%',
                      left: '25%',
                      right: '25%',
                      bottom: '35%',
                      border: '1px solid #ccc',
                      background: 'white',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '4px',
                      outline: 'none',
                      padding: '10px',
                    }
                }}
            >          
                <div className="h-full">
                    <div className="h-8 flex items-center justify-between">
                        <div className='h-6 aspect-square hover:bg-slate-300 flex 
                                        items-center justify-center rounded-full btn'
                        >
                            <ClearIcon onClick={() => {setEditModalIsOpen(false)}} 
                                       className='h-full'
                            />
                        </div>   
                        <div className="h-full aspect-square"></div>
                    </div>
                    <div className="flex flex-col justify-around my-2 h-3/4 "
                    >
                        <div  className="flex flex-row justify-center w-full ">
                            <p className="font-normal mb-1">
                                { props.buttonValue === '削除' ?
                                    '削除すると二度と復元できません。本当によろしいですか？'
                                : 
                                    '保存リストから削除します。本当によろしいですか？'
                                }
                            </p>
                        </div>
                        <div  className="flex flex-row justify-end w-full gap-3 pb-1">
                            <div className='border border-red-500 hover:text-white hover:bg-red-500 rounded-md px-2
                                            btn text-red-500 bg-white'
                                 onClick={() => {
                                    props.action();
                                    setEditModalIsOpen(false);
                                }}
                            >
                                <p>削除</p>
                            </div>
                            <div className='border border-black rounded-md px-2 btn hover:text-white
                                            hover:bg-black '
                                 onClick={() => setEditModalIsOpen(false)}
                            >
                                <p>キャンセル</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>       
        </div>   
    )
}

export default AnnounceModal;