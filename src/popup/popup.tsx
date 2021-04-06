import React from "react";
import Modal from '@material-ui/core/Modal';

import './popup.scss'




function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


export default function SimpleModal(data: any) {
    
    
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <button onClick={handleOpen}>
            <img src={data.icon} alt=""></img> DETAILS
            </button>

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className="paper">
                    <h2>{data.header}</h2>
                    <p>
                        {data.mainText}
                    </p>
                    <p> Alcohol percentage: {data.alcoholPercentage}</p>
                </div>
            </Modal>
        </div>
    );
}