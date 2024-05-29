import {signInWithPopup, signOut} from 'firebase/auth';
import {auth, provider} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';



const Header = () => {

    const [user] = useAuthState(auth);
    const width = window.innerWidth;

    return (
    <header className="w-full h-14 bg-header flex justify-between items-center">
        <Link to={'/'}
              className="flex ml-2 h-12 btn"
        >
          <div className="h-full">
            <img src='images/shareboard-icon.png' alt='' className='h-full w-full' />
          </div>
          <div className="h-full"
               style={{width: width > 600 ? 350 : 0}}
          >
            <img src="images/title.png" alt="" className="h-full w-full" />
          </div>
        </Link>
        <div className="flex">
          {user ?
            <SignOutButton />
          : 
            <SignInButton />
          }
        </div>
    </header>    
    )
}

export default Header

export const SignInButton = () => {

    const signInWithGoogle = () => {
        signInWithPopup(auth,provider)
        .catch((error) => {
          if (error.code !== 'auth/cancelled-popup-request') {
            // キャンセル以外のエラーの場合、エラー処理を行う
            console.error(error);
          }
        });
        ;
    }
  
  
    return(
        <div className='mr-2'>
          <p className='signInButton'
             onClick={() => signInWithGoogle()}
          >
            Googleでサインイン
          </p>
        </div>
    )
  }
  
  const SignOutButton = () => {
  
    return(
      <div className='mr-2'>
        <p className='signInButton'
           onClick={() => {
            signOut(auth);
          }}
        >
          サインアウト
        </p>
      </div>
  )
  }
  
  
  
  