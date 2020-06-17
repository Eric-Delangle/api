import React from 'react';

// Je précise tous les paramètres dont mon champ aura besoin .
const Field = ({ name, label, value, onChange, placeholder= "", type ="text ", error ="" }) => ( 
    <div className="form-group">
    <label htmlFor={ name }>{ label }</label>
    <input 
        value={ value }
        onChange= { onChange }
        type= {type } 
        placeholder= { placeholder || label }
        name={ name }  
        id={ name }
        className={"form-control" + ( error && " is-invalid")}
    />
    {error && <p className="invalid-feedback">{ error }</p>}
</div>   
 );
 
export default Field;