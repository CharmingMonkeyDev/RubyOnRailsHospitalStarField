import React, { useContext, useState } from "react"
import { ImagesContext } from "../../Context";

interface props {
    title: string,
    children: any
}

const TogglePannel:React.FC<props> = ({title, children}) => {
    const [open, setOpen] = useState<Boolean>(false);
    const images = useContext(ImagesContext);
    const toggleOpen = (e) => {
        e.preventDefault();
        setOpen(!open);
    }
    return (
        <div className='filter-group' style={{paddingTop: '15px', paddingBottom: '6px'}}>
            <button 
            onClick={toggleOpen}
            style={{display: 'inline-flex', paddingLeft: '19px', border: 'none', background: 'none'}}>
                {open ? (<img
                    src={images.arrow_down_icon}
                    width={9.395}
                    height={5}
                    style={{borderRadius: '1px', margin: 'auto'}}
                    className='sort-icon'
                    alt='Sort Asc'
                />) :
                (<img
                    src={images.arrow_up_icon}
                    width={9.395}
                    height={5}
                    style={{borderRadius: '1px', margin: 'auto'}}
                    className='sort-icon'
                    alt='Sort Asc'
                />)}
                <p
                style={{
                    color: '#212B36',
                    fontFamily: 'QuicksandMedium',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: '16px',
                    margin: '0 8px 0 4px'
                }}
                >{title}</p>
            </button>
            {open && children}
        </div>
    )
}

export default TogglePannel;