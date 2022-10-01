import React from 'react';
import "./button.scss";

const Button = ({ unstyled, text, type, bold, loading, del, add, click }) => {

    const btnBgColor = {
        backgroundColor: type === "cyan" ? "#66ffff" : type === "darken" ? "#b3b3b3" : "white",
        fontWeight: bold ? "700" : "normal",
        minWidth: unstyled ? "fit-content" : del ? "70px" : add ? "120px" : "150px",
        borderRadius: "10px",
        margin: unstyled ? "0 5px" : del ? "0 4px 0" : add ? "0 5px" : "30px 0",
        padding: unstyled ? "5px 15px" : del ? "0 4px 0" : add ? "3px 10px" : "5px 0",
    };

    return (
        <button style={btnBgColor} onClick={click} disabled={loading}>
            {loading ?
                <i className="fa fa-spinner loader"></i>
                :
                text
            }
        </button>
    );
};

export default Button;