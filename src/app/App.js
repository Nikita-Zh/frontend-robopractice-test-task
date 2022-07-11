import React, {useEffect, useState} from "react";
import styles from './App.module.css';
import Table from "./Table";

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
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <h1>Task for red_mad_robot</h1>
                    <Table dataIsLoaded={dataIsLoaded} data={data}></Table>
                    <footer className={styles.footer}>
                        <div>Author: Nikita Zhuykov</div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default App;