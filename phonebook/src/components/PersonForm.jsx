const PersonForm=(props)=>{
    return(
        <div>
        <form onSubmit={props.onSubmit}>
            <div>
               name: 
                <input 
                onChange={props.onNameChange}
                value={props.nameValue}  
                />
            </div>
            <div>
                number: 
                <input 
                onChange={props.onNumberChange}
                value={props.numberValue}  
            />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
        </div>
    )
}
export default PersonForm