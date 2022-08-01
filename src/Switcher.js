
export default function Switcher(props) {
    return(
        <div id="switcher">
            {props.options.map((option, index) => (
                <button 
                    className={`${props.selectedIndex === index ? "selected" : ""}`}
                    onClick={() => { props.updateChoice(index); }}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}
