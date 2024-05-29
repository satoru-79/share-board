import './App.css';
import { Link } from 'react-router-dom';
import {auth, provider} from './firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import Home from './Home';
import Header from './components/Header';
import { SignInButton } from './components/Header';


function App() {

  const [user] = useAuthState(auth);

  const width = window.innerWidth;

  return (
    <div className="App bg-blue-950" >
      <Header />
      {!user ?
      <div id='container' >
        <p className='font-black mx-4 py-2 mt-5 pl-5 flex items-center
                      border text-red-500 bg-white'
        >
          ! PC以外でのご利用時は、横向き状態を強く推奨します !
          </p>
        <div className="w-full bg-blue-950 flex items-center justify-center"
             style={{flexDirection: width > 700 ? 'row' :  'column',
                     height: width > 700 ? 480 : undefined,
                     
            }}
        >
          <div className='h-3/5  py-[20px]'
               style={{width: width > 700 ? 400 : '90%'}}
          >
            <img src="images/sample_court.png" alt="" className='h-full'/>
          </div>
          <div className='w-[350px] h-5/6 flex flex-col justify-center text-white items-center py-[20px]'>
            <h1 className='font-black text-2xl mb-8'>今すぐボードを利用</h1>
            <p className='font-midium w-3/4 mb-8'>シンプルな作戦ボードはサインインなしでも利用できます。</p>
            <Link  to={'/board'} state={{board:null}}
              
            >
              <p className='font-black  py-2 px-4 bg-green-500 btn hover:text-green-500  hover:bg-white 
                            border border-green-500'
              >
                ボードを使う
              </p>
            </Link>
            <Link to={'/information'}>
              <p className='mt-5 py-2 px-4 rounded-full bg-black btn
                            hover:text-black hover:bg-white hover:border-black'
              >
                ?　ボードの使いかた
              </p>
            </Link>
          </div>
        </div>
        <div className="w-full bg-slate-300 flex items-center justify-center"
             style={{flexDirection: width > 700 ? 'row' : 'column' ,
                     height: width > 700 ? 520 : undefined
            }}
        >
          <div className='w-[350px] h-[400px] flex flex-col justify-center text-white items-center '>
            <h1 className='font-black text-2xl mb-5 text-black'>サインインすると・・・</h1>
            <p className='font-midium w-3/4 mb-5 text-black'>ボードや駒の状態を保存したり、作成したボードをシェアすることができます</p>
            <SignInButton />
          </div>
          <div className='h-[200px] bg-white pb-[20px] mb-3'
               style={{width: width > 700 ? 400 : '90%'}}
          >
            <img src="images/home.png" alt="" />
          </div>
        </div>
      </div>
     :
        <Home  user={user}/>
      }
    </div>
  );
}

export default App;

