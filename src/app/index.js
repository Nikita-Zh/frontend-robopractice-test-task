import React, {useEffect, useState} from "react";
import Table from "./Table";

const App = () => {

    const [data, setData] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/api/users')
            .then(res => res.json())
            .then((res) => {
                    //console.log(res);
                    setData(res);
                    setDataIsLoaded(true);
                    //console.log('state: ', data);
                },
                (err) => {
                    console.log(err);
                });
    }, []);

    /* const getData = () => {
         fetch('http://localhost:8080/api/users')
             .then(res => res.json())
             .then((res) => {
                     console.log(res);
                     setDataIsLoaded(true);
                     return res;

                 },
                 (err) => {
                     console.log(err);
                     return [];
                 });
     };
 */
    return (
        <>
            <h1>Hello</h1>
            <Table dataIsLoaded={dataIsLoaded} data={data}/>
        </>
    );
};

export default App;