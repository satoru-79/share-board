import Header from "./components/Header"
import {auth} from "./firebase"
import { useAuthState } from "react-firebase-hooks/auth";


const Information = () => {

    const width = window.innerWidth;

    return(
        <div>
            <Header />
            <div className="m-4 flex flex-col justify-start gap-3">
                <p className="font-black text-2xl w-full border-b-2 border-black mb-3">
                    ボードの使いかた
                </p>
                <div className="w-[100%] flex justify-between"
                     style={{flexDirection: width > 500 ? 'row' : 'column'}}
                >
                    <div className="mx-auto flex flex-col justify-start gap-2"
                         style={{width : width > 500 ? "47%" : "90%"}}
                    >
                        <p className="text-lg"><span className="font-bold">コートの種類 :</span><br/> 
                            画面左上のTabからコートを選ぶと、オールコート / ハーフコートが入れ替わります。
                        </p>
                        <p className="text-lg"><span className="font-bold">ページの切り替え(サインイン時のみ) :</span><br/>
                            画面下部の「前のボード」、「次のボード」で編集するページを切り替えることができます。また、画面上部の
                            「このページを削除」ボタンを押すと、表示されているページを削除することができます。<br/>
                            また、先頭のページにいるときに「次のボード」を押すと、作成・編集時のみページを追加できます。
                        </p>
                        <p className="text-lg"><span className="font-bold">ドロワーメニュー :</span><br/>
                           画面右上の青いスパナのアイコンを押すと、右側にドロワーメニューが表示されます。このドロワーメニューから選手や矢印を追加できます。
                        </p>
                    </div>
                    <img src="images/information.png" alt="" className="m-auto"
                        style={{width: width > 500 ? width * 0.5 : width * 0.9, 
                                height: width > 500 ? width * 0.31 : width * 0.558
                               }}
                    />
                </div>
                <div className="w-[100%] flex justify-between"
                     style={{flexDirection: width > 500 ? "row" : "column"}}
                >
                    <div className="mx-auto flex flex-col justify-start gap-2"
                         style={{width : width > 500 ? "47%" : "90%"}}
                    >
                        <p className="text-lg"><span className="font-bold">プレイヤー情報の変更 :</span><br/> 
                            ドロワーメニュー内から、名前、番号、色を設定して追加ボタンを押すとコートにプレイヤーが追加されます。また、
                            すでに追加されているプレイヤーをクリックすると、ドロワーメニューからそのプレイヤーの情報の変更、削除が行えます。
                        </p>
                        <p className="text-lg"><span className="font-bold">プリセットの管理(サインイン時のみ) :</span><br/>
                            ドロワーメニュー内から、プリセットの登録、呼び出し、削除が行えます。登録はhome / away で別々ですが、呼び出しはどちらからでも行えます
                        </p>
                        <p className="text-lg"><span className="font-bold">矢印 :</span><br/>
                           ドロワーメニュー内から、色、タイプ、先端の形、軌道、付属させる文字を設定し、追加ボタンを押すとコートに矢印を追加できます。
                           矢印の移動は始点と終点の白い四角をドラッグすることで行えます(ボードの見やすさを考慮して、白い四角は作成・編集時にしか表示されません)。
                        </p>
                    </div>
                    <img src="images/information_2.png" alt="" className="m-auto"
                         style={{width: width > 500 ? width * 0.5 : width * 0.9, 
                                 height: width > 500 ? width * 0.31 : width * 0.558
                                }}
                    />
                </div>
            </div>

        </div>
    )

}

export default Information