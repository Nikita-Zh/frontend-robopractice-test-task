import React, {useEffect, useState} from "react";
import './App.css';
import TableAntd from "./TableAntd";

const App = () => {

    const [data, setData] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/api/users')
            .then(res => res.json())
            .then((res) => {
                    setData(res);
                    setDataIsLoaded(true);
                },
                (err) => {
                    console.log(err);
                });
    }, []);

    return (
        <>
            <div className="wrapper">
                <div className="container">
                    <h1>Task for red_mad_robot</h1>
                    <TableAntd dataIsLoaded={dataIsLoaded} data={data}></TableAntd>
                    <footer className="footer">
                        <div>Author: Nikita Zhuykov</div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default App;