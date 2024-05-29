import * as React from 'react';
import { Menu } from '@mui/material';
import {MenuItem} from '@mui/material';
import {Button} from '@mui/material';
import { Player } from '../Board';
import '../ColorMenu.css';

type Props = {
    player: Player,
    setPlayer: React.Dispatch<React.SetStateAction<Player>>
}

const ColorMenu:React.FC<Props> = (props) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div className='h-6 aspect-square border border-black overflow-hidden rounded-full'
           style={{backgroundColor:props.player.color.code}}
      >
        <Button
          id="basic-button"
          onClick={handleClick}
          sx={{width:"100%", height:"100%"}}
        >
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            
          }}
          sx={{width:90}}
        >
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"red",isblack:false}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
                >
                <div className='h-5 aspect-square bg-red-500 rounded-full'>
                </div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"blue",isblack:false}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}>
                <div className='h-5 aspect-square bg-blue-700 rounded-full'>
                </div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"green",isblack:false}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
            >
                <div className='h-5 aspect-square bg-green-700 rounded-full'></div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"yellow",isblack:true}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
            >
                <div className='h-5 aspect-square bg-yellow-300 rounded-full'></div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"purple",isblack:false}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
            >
                <div className='h-5 aspect-square bg-purple-800 rounded-full'></div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"orange",isblack:false}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
                >
                <div className='h-5 aspect-square bg-orange-500 rounded-full'>
                </div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"pink",isblack:true}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}>
                <div className='h-5 aspect-square bg-pink-200 rounded-full'>
                </div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"brown",isblack:false}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
                >
                <div className='h-5 aspect-square bg-amber-800 rounded-full'>
                </div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"black",isblack:false}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
                >
                <div className='h-5 aspect-square bg-black rounded-full'>
                </div>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleClose(); props.setPlayer({...props.player,color:{code:"white",isblack:true}})
                }}
                className='flex justify-center'
                sx={{display: "flex", justifyContent:"center",height:25}}
                >
                <div className='h-5 aspect-square bg-white rounded-full border border-black'>
                </div>
            </MenuItem>
        </Menu>
      </div>
    );
}

export default ColorMenu;