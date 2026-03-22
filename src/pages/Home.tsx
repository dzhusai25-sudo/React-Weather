export function Home() {
    return (
        <div>
        <div id="currentWidget" className="widget current-weather"></div>
        <h1 className="runApp">Enjoy your weather! 🌞</h1>
        <p className="orNot">... (or not 🌧️)</p>
        <input className="input" placeholder="Ваш город"></input>
        <button className="button">Get Weather</button>
        <div className="result"></div>
        <div className="errors"></div>
        <div className="hostory">История поиска</div>
        </div>
    );
}